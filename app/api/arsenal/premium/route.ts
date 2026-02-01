import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { ArsenalItemId, ARSENAL_ITEMS } from '@/lib/arsenal-types';
import { StartupIdea, AnalysisResult } from '@/lib/types';
import { getPremiumConfig, buildStartupContext, hasPremiumGeneration } from '@/lib/arsenal-prompts-premium';

// Premium document generation with Claude Sonnet - Multi-section streaming
// Generates high-quality documents like VideoAI-Studio style

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { itemId, idea, analysis, sectionIndex } = await request.json() as {
      itemId: ArsenalItemId;
      idea: StartupIdea;
      analysis: AnalysisResult;
      sectionIndex?: number; // Optional: generate specific section only
    };

    console.log(`[ARSENAL PREMIUM] Starting generation: ${itemId}, section: ${sectionIndex ?? 'all'}`);

    // Check if premium is available for this item
    if (!hasPremiumGeneration(itemId)) {
      return new Response(
        JSON.stringify({ error: `Premium generation not available for ${itemId}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const premiumConfig = await getPremiumConfig(itemId);
    const itemInfo = ARSENAL_ITEMS.find(i => i.id === itemId);
    
    if (!premiumConfig) {
      throw new Error(`No premium config for ${itemId}`);
    }

    // Build startup context
    const context = buildStartupContext(idea, analysis);

    // Determine which sections to generate
    const sectionsToGenerate = sectionIndex !== undefined 
      ? [premiumConfig.sections[sectionIndex]].filter(Boolean)
      : premiumConfig.sections;

    if (sectionsToGenerate.length === 0) {
      throw new Error(`Invalid section index: ${sectionIndex}`);
    }

    // Stream response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send metadata first
          controller.enqueue(encoder.encode(JSON.stringify({
            type: 'metadata',
            documentTitle: premiumConfig.documentTitle,
            totalSections: premiumConfig.sections.length,
            estimatedTime: premiumConfig.totalEstimatedTime,
          }) + '\n'));

          // Generate each section
          for (let i = 0; i < sectionsToGenerate.length; i++) {
            const section = sectionsToGenerate[i];
            const actualIndex = sectionIndex !== undefined ? sectionIndex : i;

            // Send section start
            controller.enqueue(encoder.encode(JSON.stringify({
              type: 'section_start',
              sectionId: section.id,
              sectionTitle: section.title,
              sectionIndex: actualIndex,
              totalSections: premiumConfig.sections.length,
            }) + '\n'));

            // Build the full prompt for this section
            const fullPrompt = `Sei un esperto consulente di startup e investimenti. Genera contenuto PROFESSIONALE, DETTAGLIATO e SPECIFICO per questa startup.

CONTESTO STARTUP:
${context}

DOCUMENTO: ${premiumConfig.documentTitle}
SEZIONE: ${section.title}

${section.prompt}

ISTRUZIONI CRITICHE:
- Sii ESTREMAMENTE SPECIFICO per questa startup - usa i dati forniti
- Genera contenuto COMPLETO e PROFESSIONALE, non placeholder generici
- Usa numeri e metriche realistiche basate sul settore
- Formato Markdown con tabelle, liste, diagrammi ASCII dove appropriato
- Output in italiano
- NON usare [placeholder] - inserisci valori realistici`;

            // Stream from Claude Opus (best model for premium documents)
            const response = await anthropic.messages.create({
              model: 'claude-opus-4-20250514',
              max_tokens: section.maxTokens,
              stream: true,
              messages: [{ role: 'user', content: fullPrompt }],
            });

            for await (const event of response) {
              if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                controller.enqueue(encoder.encode(JSON.stringify({
                  type: 'delta',
                  sectionId: section.id,
                  text: event.delta.text,
                }) + '\n'));
              }
            }

            // Send section complete
            controller.enqueue(encoder.encode(JSON.stringify({
              type: 'section_complete',
              sectionId: section.id,
              sectionIndex: actualIndex,
            }) + '\n'));

            console.log(`[ARSENAL PREMIUM] Section ${actualIndex + 1}/${premiumConfig.sections.length} complete: ${section.title}`);
          }

          // Send final completion
          controller.enqueue(encoder.encode(JSON.stringify({
            type: 'done',
            itemId,
            documentTitle: premiumConfig.documentTitle,
          }) + '\n'));

          controller.close();
          console.log(`[ARSENAL PREMIUM] Generation complete: ${itemId}`);

        } catch (err) {
          console.error(`[ARSENAL PREMIUM] Stream error:`, err);
          controller.enqueue(encoder.encode(JSON.stringify({
            type: 'error',
            message: err instanceof Error ? err.message : 'Premium generation failed',
          }) + '\n'));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error(`[ARSENAL PREMIUM] Error:`, error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// GET endpoint to check premium availability and get config
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get('itemId') as ArsenalItemId;

  if (!itemId) {
    return new Response(
      JSON.stringify({ 
        premiumItems: [
          'pitch-deck',
          'executive-summary',
          'financial-model',
          'roadmap-generator',
          'legal-starter-pack'
        ]
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  const hasPremium = hasPremiumGeneration(itemId);
  
  if (!hasPremium) {
    return new Response(
      JSON.stringify({ available: false, itemId }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  const config = await getPremiumConfig(itemId);
  
  return new Response(
    JSON.stringify({
      available: true,
      itemId,
      documentTitle: config?.documentTitle,
      totalSections: config?.sections.length,
      sections: config?.sections.map(s => ({ id: s.id, title: s.title })),
      estimatedTime: config?.totalEstimatedTime,
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
