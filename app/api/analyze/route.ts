import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: 'https://api.anthropic.com',
});

// System prompts for each agent
const AGENT_PROMPTS = {
  orchestrator: `Sei l'Orchestrator di un Virtual Venture Analyst esperto. Il tuo ruolo è:
1. Analizzare l'idea di startup fornita
2. Estrarre: Problema, Soluzione, Target
3. Fornire un verdetto iniziale (green/yellow/red) con motivazione ONESTA

CRITERI PER IL VERDETTO (sii equilibrato e onesto):

🟢 GREEN (circa 20-30% delle idee):
- Problema reale e urgente con willingness to pay dimostrata
- Differenziazione chiara rispetto a soluzioni esistenti
- Mercato in crescita o sottovalutato
- Founder/team ha un vantaggio competitivo (esperienza, network, tecnologia)
- Unit economics potenzialmente sostenibili

🟡 YELLOW (circa 50-60% delle idee):
- Problema reale ma mercato competitivo
- Idea valida ma necessita forte validazione
- Differenziazione non chiara o facilmente replicabile
- Modello di business da definire meglio
- Sfide operative significative ma superabili

🔴 RED (circa 20-30% delle idee):
- Mercato saturo con player dominanti e alte barriere
- Problema non abbastanza urgente (nice-to-have vs must-have)
- Unit economics strutturalmente sfavorevoli
- Dipendenza critica da fattori esterni incontrollabili
- Idea già fallita più volte nel mercato

IMPORTANTE: 
- Sii ONESTO e DIRETTO. Un feedback duro ma giusto è più utile di false speranze.
- Procedi SEMPRE con l'analisi - NON chiedere chiarimenti a meno che l'input sia incomprensibile
- Se mancano dettagli, inferiscili ragionevolmente

Imposta needsClarification a TRUE solo se l'input è incomprensibile (es. "ciao", "test").

Rispondi SEMPRE in formato JSON valido.`,

  market: `Sei il Market Analyst di un Virtual Venture Analyst. Il tuo ruolo è:
1. Identificare 2 competitor diretti e 1 indiretto REALI nel mercato
2. Per ogni competitor: nome reale, punti di forza, punti deboli, funding stimato
3. Stimare TAM/SAM/SOM con formule di Fermi realistiche
4. Posizionare i competitor su scala 1-10 per prezzo e complessità

Fai ricerche simulate ma realistiche. Usa nomi di aziende vere quando possibile.
Rispondi SEMPRE in formato JSON valido.`,

  growth: `Sei il Growth Hacker di un Virtual Venture Analyst. Il tuo ruolo è:
1. Definire 3 esperimenti di crescita a budget zero/basso
2. Identificare 2 Early Adopter Personas dettagliate
3. Suggerire 4 contatti tipo da raggiungere (ruoli realistici)
4. Generare template di outreach pronti all'uso

Sii pratico e actionable. Ogni esperimento deve essere eseguibile in 1-2 settimane.
Rispondi SEMPRE in formato JSON valido.`,

  project: `Sei il Project Manager di un Virtual Venture Analyst. Il tuo ruolo è:
1. Creare una roadmap di 4 settimane con 8-10 task totali (2-3 per settimana)
2. Ogni task: titolo breve, descrizione (max 50 parole), categoria (validation/marketing/product/sales)
3. Prioritizza validazione nelle prime 2 settimane

Sii sintetico. Non generare template o contenuti lunghi.
Rispondi SEMPRE in formato JSON valido.`,

  devil: `Sei il Devil's Advocate di un Virtual Venture Analyst. Il tuo ruolo è:
1. Identificare i 3 rischi più letali per questa idea
2. Essere brutale ma giusto - non addolcire la pillola
3. Per ogni rischio: severity (critical/high/medium), descrizione dettagliata, mitigazione suggerita
4. Considera: barriere all'entrata, dipendenze esterne, unit economics, competition

Non essere ottimista. Il tuo lavoro è trovare i buchi.
Rispondi SEMPRE in formato JSON valido.`,

  scorer: `Sei lo Scorer di un Virtual Venture Analyst. Il tuo ruolo è:
Analizzare l'idea e assegnare punteggi da 1 a 100 per ogni categoria.

CATEGORIE:
1. marketSize (1-100): Dimensione e potenziale del mercato
   - 80-100: Mercato enorme (>$10B), in forte crescita
   - 60-79: Mercato significativo ($1-10B), crescita stabile
   - 40-59: Mercato di nicchia ($100M-1B)
   - 20-39: Mercato piccolo (<$100M)
   - 1-19: Mercato quasi inesistente

2. competition (1-100): Livello di competizione (ALTO = poca competition = meglio)
   - 80-100: Oceano blu, pochi competitor deboli
   - 60-79: Mercato con spazio, competitor non dominanti
   - 40-59: Mercato competitivo ma frammentato
   - 20-39: Competitor forti e consolidati
   - 1-19: Monopolio/oligopolio di giganti tech

3. executionRisk (1-100): Facilità di esecuzione (ALTO = più facile)
   - 80-100: MVP costruibile in settimane, no dipendenze critiche
   - 60-79: Esecuzione fattibile con team piccolo
   - 40-59: Richiede competenze specifiche o capitali
   - 20-39: Sfide tecniche/operative significative
   - 1-19: Quasi impossibile da eseguire

4. differentiation (1-100): Unicità della proposta
   - 80-100: Innovazione breakthrough, brevettabile
   - 60-79: Differenziazione chiara e difendibile
   - 40-59: Qualche elemento distintivo
   - 20-39: Facilmente replicabile
   - 1-19: Commodity, nessuna differenziazione

5. timing (1-100): Timing di mercato
   - 80-100: Timing perfetto, trend in accelerazione
   - 60-79: Buon timing, mercato maturo al punto giusto
   - 40-59: Timing accettabile
   - 20-39: Troppo presto o troppo tardi
   - 1-19: Timing completamente sbagliato

6. overall: Media ponderata (marketSize*0.25 + competition*0.20 + executionRisk*0.20 + differentiation*0.20 + timing*0.15)

Sii ONESTO e CALIBRATO. Non dare tutti 70-80, usa l'intera scala.
Rispondi SEMPRE in formato JSON valido.`,
};

// Response schemas for each agent
const RESPONSE_SCHEMAS = {
  orchestrator: `{
  "needsClarification": boolean,
  "clarificationQuestions": string[],
  "parsedIdea": {
    "problem": string,
    "solution": string,
    "target": string
  },
  "initialVerdict": {
    "type": "green" | "yellow" | "red",
    "reason": string
  }
}`,

  market: `{
  "competitors": [
    {
      "name": string,
      "type": "direct" | "indirect",
      "priceLevel": number (1-10),
      "complexity": number (1-10),
      "strengths": string[],
      "weaknesses": string[],
      "funding": string,
      "website": string
    }
  ],
  "marketSize": {
    "tam": { "value": string, "description": string, "formula": string },
    "sam": { "value": string, "description": string, "formula": string },
    "som": { "value": string, "description": string, "formula": string }
  }
}`,

  growth: `{
  "experiments": [
    {
      "title": string,
      "description": string,
      "budget": string,
      "timeframe": string,
      "expectedOutcome": string,
      "priority": "high" | "medium" | "low"
    }
  ],
  "earlyAdopters": [
    {
      "name": string,
      "role": string,
      "company": string,
      "painPoints": string[],
      "whereToFind": string[]
    }
  ],
  "contacts": [
    {
      "name": string,
      "role": string,
      "company": string,
      "relevance": string
    }
  ]
}`,

  project: `{
  "roadmap": [
    {
      "title": string (max 10 parole),
      "description": string (max 50 parole),
      "week": 1 | 2 | 3 | 4,
      "category": "validation" | "marketing" | "product" | "sales"
    }
  ]
}`,

  devil: `{
  "risks": [
    {
      "title": string,
      "description": string,
      "severity": "critical" | "high" | "medium",
      "mitigation": string
    }
  ]
}`,

  scorer: `{
  "scores": {
    "marketSize": number (1-100),
    "competition": number (1-100),
    "executionRisk": number (1-100),
    "differentiation": number (1-100),
    "timing": number (1-100),
    "overall": number (1-100)
  },
  "reasoning": {
    "marketSize": string,
    "competition": string,
    "executionRisk": string,
    "differentiation": string,
    "timing": string
  }
}`,
};

export async function POST(request: NextRequest) {
  try {
    const { agent, idea, context } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    const systemPrompt = AGENT_PROMPTS[agent as keyof typeof AGENT_PROMPTS];
    const responseSchema = RESPONSE_SCHEMAS[agent as keyof typeof RESPONSE_SCHEMAS];

    if (!systemPrompt) {
      return NextResponse.json(
        { error: `Unknown agent: ${agent}` },
        { status: 400 }
      );
    }

    const userMessage = `
IDEA DI STARTUP:
Problema: ${idea.problem || 'Non specificato'}
Soluzione: ${idea.solution || 'Non specificato'}
Target: ${idea.target || 'Non specificato'}
Contesto aggiuntivo: ${idea.additionalContext || 'Nessuno'}

${context ? `CONTESTO DALLE ANALISI PRECEDENTI:\n${JSON.stringify(context, null, 2)}` : ''}

Rispondi con un JSON valido che segue questo schema:
${responseSchema}

IMPORTANTE: Rispondi SOLO con il JSON, senza markdown code blocks o altro testo.
`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
      system: systemPrompt,
    });

    // Extract text content
    const textContent = message.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    // Parse JSON response
    let jsonResponse;
    try {
      // Try to extract JSON from the response (handle potential markdown)
      let jsonText = textContent.text.trim();
      
      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.slice(7);
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.slice(3);
      }
      if (jsonText.endsWith('```')) {
        jsonText = jsonText.slice(0, -3);
      }
      
      jsonResponse = JSON.parse(jsonText.trim());
    } catch (parseError) {
      console.error('Failed to parse JSON:', textContent.text);
      return NextResponse.json(
        { error: 'Failed to parse agent response', raw: textContent.text },
        { status: 500 }
      );
    }

    return NextResponse.json({
      agent,
      result: jsonResponse,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
