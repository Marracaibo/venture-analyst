import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();

    if (!description) {
      return Response.json({ error: 'Description is required' }, { status: 400 });
    }

    const systemPrompt = `Sei un esperto analista di startup e venture capitalist. Analizza questa idea e fornisci una valutazione strutturata con proiezioni finanziarie realistiche.

Rispondi SOLO con un JSON valido (senza markdown, senza backticks) con questa struttura:
{
  "name": "Nome breve dell'idea (max 30 caratteri)",
  "verdict": "green" | "yellow" | "red",
  "scores": {
    "marketSize": 0-100,
    "competition": 0-100,
    "executionRisk": 0-100,
    "differentiation": 0-100,
    "timing": 0-100,
    "overall": 0-100
  },
  "tam": "Stima TAM (es: €500M, €2B)",
  "competitorCount": numero,
  "riskCount": numero,
  "mvpWeeks": numero,
  "summary": "Riassunto in 1-2 frasi",
  "pros": ["pro1", "pro2", "pro3"],
  "cons": ["contro1", "contro2", "contro3"],
  "executionEase": {
    "score": 0-100,
    "level": "easy" | "medium" | "hard",
    "reason": "Spiegazione breve"
  },
  "idealTeam": {
    "roles": [
      {"role": "CEO/Founder", "skills": "competenze richieste", "priority": "must-have" | "nice-to-have"},
      {"role": "CTO", "skills": "competenze richieste", "priority": "must-have" | "nice-to-have"}
    ],
    "minTeamSize": numero,
    "keyHire": "Il ruolo più critico da assumere per primo"
  },
  "financials": {
    "tamNumeric": numero in milioni EUR,
    "avgTicket": prezzo medio €/anno per cliente,
    "estimatedCAC": costo acquisizione cliente €,
    "grossMargin": margine lordo % (0-100),
    "year1Customers": clienti stimati anno 1,
    "year2Customers": clienti stimati anno 2,
    "year3Customers": clienti stimati anno 3,
    "year1Revenue": ricavi € anno 1,
    "year2Revenue": ricavi € anno 2,
    "year3Revenue": ricavi € anno 3,
    "breakEvenYear": anno di break-even (1, 2, 3 o 0 se mai),
    "ltv": lifetime value cliente €,
    "ltvCacRatio": rapporto LTV/CAC
  },
  "competitive": {
    "mainCompetitors": ["competitor1", "competitor2", "competitor3"],
    "moatStrength": "strong" | "medium" | "weak",
    "entryBarrier": "high" | "medium" | "low"
  }
}

Sii realistico nelle proiezioni - usa stime conservative per startup early-stage.
Criteri di scoring:
- marketSize: TAM >€1B = 80+, €100M-1B = 50-80, <€100M = <50
- competition: Pochi competitor = 80+, Mercato affollato = <50
- executionRisk: MVP <4 sett = 80+, >12 sett = <50
- differentiation: Innovazione forte = 80+, Me-too = <50
- timing: Trend favorevole = 80+, Mercato saturo = <50
- overall: Media ponderata (market 30%, timing 25%, differentiation 20%, competition 15%, execution 10%)`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Analizza questa idea:\n\n${description}`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Parse JSON response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const result = JSON.parse(jsonMatch[0]);
    
    return Response.json(result);
  } catch (error) {
    console.error('Compare error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
