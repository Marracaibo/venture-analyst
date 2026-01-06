import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: 'https://api.anthropic.com',
});

const SUGGEST_PROMPT = `Sei un esperto di startup italiane. Analizza la descrizione dell'idea e suggerisci i valori più appropriati per i campi del form.

## CAMPI DA SUGGERIRE

1. **verticale**: Il settore principale della startup
   - fintech, healthtech, edtech, ecommerce, saas, marketplace, deeptech, gaming, sustainability, altro

2. **fase**: Lo stadio di sviluppo
   - idea (solo concetto)
   - mvp (prodotto minimo)
   - early-traction (primi clienti/revenue)
   - growth (scaling)

3. **competizione**: Livello di competizione nel mercato
   - monopolio (1-2 player dominanti)
   - oligopolio (pochi player forti)
   - affollato (molti competitor)
   - blue-ocean (mercato nuovo/inesplorato)

4. **capTable**: Situazione societaria (se menzionata, altrimenti usa "unknown")
   - solo-founder
   - co-founders
   - investitori-presenti
   - unknown

5. **coachability**: Se il founder sembra aperto a feedback (se non chiaro, usa "media")
   - alta, media, bassa

## RISPOSTA (JSON)
{
  "verticale": "valore",
  "fase": "valore", 
  "competizione": "valore",
  "capTable": "valore",
  "coachability": "valore",
  "confidence": "alta | media | bassa",
  "reasoning": "Breve spiegazione delle scelte"
}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const descrizione: string = body.descrizione;

    if (!descrizione || descrizione.trim().length < 30) {
      return NextResponse.json(
        { success: false, error: 'Descrizione troppo breve per suggerire i campi' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'API key non configurata' },
        { status: 500 }
      );
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `${SUGGEST_PROMPT}\n\n---\n\nDESCRIZIONE IDEA:\n${descrizione}`
        }
      ]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    // Parse JSON dalla risposta
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const suggestions = JSON.parse(jsonMatch[0]);
      return NextResponse.json({
        success: true,
        suggestions
      });
    }

    return NextResponse.json(
      { success: false, error: 'Impossibile generare suggerimenti' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Suggest error:', error);
    return NextResponse.json(
      { success: false, error: 'Errore durante la generazione dei suggerimenti' },
      { status: 500 }
    );
  }
}
