import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { ArsenalItemId, ARSENAL_ITEMS } from '@/lib/arsenal-types';
import { StartupIdea, AnalysisResult } from '@/lib/types';
import { getFastPrompt } from '@/lib/arsenal-prompts-fast';

// AI-powered generation with streaming - uses Claude Haiku for speed

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { itemId, idea, analysis } = await request.json() as {
      itemId: ArsenalItemId;
      idea: StartupIdea;
      analysis: AnalysisResult;
    };

    console.log(`[ARSENAL] Starting AI generation: ${itemId}`);

    const promptConfig = getFastPrompt(itemId);
    const itemInfo = ARSENAL_ITEMS.find(i => i.id === itemId);
    
    if (!promptConfig) {
      throw new Error(`No prompt config for ${itemId}`);
    }

    // Build context from startup data
    const context = `
STARTUP: ${analysis.ideaTitle}
PROBLEMA: ${idea.problem}
SOLUZIONE: ${idea.solution}
TARGET: ${idea.target}
MERCATO: TAM ${analysis.marketSize.tam}, SAM ${analysis.marketSize.sam}
COMPETITOR: ${analysis.competitors.map(c => c.name).join(', ')}
VERDICT: ${analysis.verdict}
`;

    const fullPrompt = `Sei un esperto di startup e growth hacking. Genera contenuto UTILE e SPECIFICO per questa startup:

${context}

TASK: ${itemInfo?.name || itemId}
${promptConfig.prompt}

IMPORTANTE: 
- Sii SPECIFICO per questa startup, non generico
- Usa i dati forniti
- Output in italiano
- Formato Markdown`;

    // Stream response from Claude Haiku
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await anthropic.messages.create({
            model: 'claude-3-5-haiku-20241022',
            max_tokens: promptConfig.maxTokens,
            stream: true,
            messages: [{ role: 'user', content: fullPrompt }],
          });

          for await (const event of response) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              const chunk = { type: 'delta', text: event.delta.text };
              controller.enqueue(encoder.encode(JSON.stringify(chunk) + '\n'));
            }
          }

          controller.enqueue(encoder.encode(JSON.stringify({ type: 'done', itemId }) + '\n'));
          controller.close();
          console.log(`[ARSENAL] AI generation complete: ${itemId}`);
        } catch (err) {
          console.error(`[ARSENAL] Stream error:`, err);
          controller.enqueue(encoder.encode(JSON.stringify({ 
            type: 'error', 
            message: err instanceof Error ? err.message : 'AI generation failed' 
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
    console.error(`[ARSENAL] Error:`, error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
