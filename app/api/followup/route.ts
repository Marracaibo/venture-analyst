import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { question, context } = await request.json();

    if (!question) {
      return Response.json({ error: 'Question is required' }, { status: 400 });
    }

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Start streaming in background
    (async () => {
      try {
        const systemPrompt = `Sei un esperto analista di startup. L'utente ha appena ricevuto un'analisi della sua idea e ora vuole fare domande di approfondimento.

CONTESTO DELL'ANALISI:
${context.ideaDescription || 'Idea startup'}

VERDETTO: ${context.verdict || 'N/A'}
SCORE: ${context.scores?.overall || 'N/A'}/100

COMPETITOR IDENTIFICATI:
${context.competitors?.map((c: { name: string }) => `- ${c.name}`).join('\n') || 'Nessuno'}

RISCHI IDENTIFICATI:
${context.risks?.map((r: { title: string; severity: string }) => `- ${r.title} (${r.severity})`).join('\n') || 'Nessuno'}

Rispondi in modo conciso ma utile. Usa bullet points quando appropriato. Rispondi SEMPRE in italiano.`;

        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          stream: true,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: question,
            },
          ],
        });

        for await (const event of response) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            const chunk = event.delta.text;
            await writer.write(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
          }
        }

        await writer.write(encoder.encode('data: [DONE]\n\n'));
      } catch (error) {
        console.error('Streaming error:', error);
        await writer.write(encoder.encode(`data: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`));
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Follow-up error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
