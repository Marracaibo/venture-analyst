import { NextRequest } from 'next/server';
import { ArsenalItemId } from '@/lib/arsenal-types';
import { StartupIdea, AnalysisResult } from '@/lib/types';
import { generateArsenalContent } from '@/lib/arsenal-templates';

// Template-based - NO AI, instant results, no timeout issues

export async function POST(request: NextRequest) {
  try {
    const { itemId, idea, analysis } = await request.json() as {
      itemId: ArsenalItemId;
      idea: StartupIdea;
      analysis: AnalysisResult;
    };

    console.log(`[ARSENAL] Generating template: ${itemId}`);

    // Generate content from template - instant!
    const content = generateArsenalContent(itemId, idea, analysis);

    console.log(`[ARSENAL] Complete: ${itemId}`);

    // Return as streaming format for compatibility with frontend
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Send content in chunks to simulate streaming
        const chunks = content.match(/.{1,100}/g) || [content];
        chunks.forEach(chunk => {
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'delta', text: chunk }) + '\n'));
        });
        controller.enqueue(encoder.encode(JSON.stringify({ type: 'done', itemId }) + '\n'));
        controller.close();
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
