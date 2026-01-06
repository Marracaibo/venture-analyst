import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { PATTERN_SUMMARY } from '@/lib/vc-patterns';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: 'https://api.anthropic.com',
});

const SECTOR_DETAILS: Record<string, string> = {
  // Settori "Unsexy" tradizionali
  waste: 'Gestione Rifiuti, Riciclo, Economia Circolare, Smaltimento',
  construction: 'Edilizia, Ristrutturazioni, Infrastrutture, Cantieri - FOCUS su gestione cantieri e coordinamento, NON certificazioni',
  healthcare: 'Sanità operativa - scheduling, comunicazione paziente-medico, gestione RSA - NON diagnosi',
  logistics: 'Logistica, Trasporti, Spedizioni, Magazzini, Flotte, Last-mile delivery',
  compliance: 'Compliance interna aziendale, GDPR operativo, audit preparation - NON consulenza legale',
  energy: 'Energia, Utilities, Rinnovabili, Efficienza Energetica, Bollette business',
  agriculture: 'Agricoltura, Agrotech, Food Supply Chain, Allevamento',
  manufacturing: 'Manifattura, Industria 4.0, Produzione, Manutenzione predittiva',
  // Settori "Far West" - Picks & Shovels
  creator: 'Creator Economy, Influencer, Content Creator, YouTube, TikTok, Podcast - tool di gestione, analytics, monetizzazione',
  ecommerce: 'E-commerce, Dropshipping, Amazon Seller, Shopify - automazione, inventory, pricing',
  remote: 'Remote Work, Team Distribuiti, Freelancer, Gig Economy - gestione progetti, contratti, pagamenti',
  shortterm: 'Short-term Rental, Airbnb Host, Property Manager - automazione, pricing dinamico, guest communication',
  saas: 'SaaS & Micro-SaaS, Indie Hacker, Bootstrapper - tool per lanciare e gestire prodotti software',
  ai: 'AI Tools & Prompt Engineering, AI Agency, AI Automation - infrastruttura per chi usa AI',
};

const AGENT_PROMPTS = {
  // ========== FASE 1: GENERAZIONE ==========
  painHunter: `Sei un Pain Hunter con framework VC. Trovi problemi che creano UNICORNI.

FRAMEWORK:
- TAM > €1B (mercato grande)
- Problema URGENTE (deadline, penalità, perdita economica)
- Incumbent ASSENTI o LENTI
- Pagamento CHIARO (chi paga, quanto, perché)

SETTORI TRADIZIONALI: inefficienze PMI, back-office, compliance operativa
SETTORI "FAR WEST": Picks & Shovels per creator/seller/freelancer (€50-200/mese)

EVITA: Certificazioni obbligatorie, responsabilità legale/medica, incumbent dominanti.

${PATTERN_SUMMARY}

Rispondi SOLO con JSON valido.`,

  scienceArbitrage: `Trova tech GIÀ PRONTA che abilita soluzioni 10x.

TECH PRONTE (API disponibili oggi):
- LLM: GPT-4, Claude, Llama → documenti, chat, analisi
- Vision: GPT-4V, YOLO, SAM → image analysis, OCR
- Audio: Whisper, ElevenLabs → trascrizione, sintesi
- Data: Embeddings, vector DB → search semantico

EVITA: Training custom, hardware speciale, paper senza implementazione.
Rispondi SOLO con JSON valido.`,

  collision: `Genera 5 IDEE STARTUP unicorn-tier combinando problemi + tech.

CRITERI QUANTITATIVI (scoring 0-100):
- Market (40pt): TAM>€1B, growing>20%, fragmented
- Timing (35pt): regulatory trigger, tech enabler, behavior shift  
- Economics (40pt): CAC<€50, LTV>€500, payback<6mo, margin>70%
- Moat (50pt): network effects, switching costs, data moat, regulatory moat
- Execution (20pt): MVP 4wk, existing hardware, API-first

PATTERN UNICORN:
- Deel ($12B): HR compliance + network effects
- Toast ($30B): vertical SaaS + hardware lock-in
- Stripe ($95B): developer ecosystem + integrations

Per ogni idea: nome, tagline, chi paga, quanto, CAC stimato, LTV stimato, moat primario.
Genera ESATTAMENTE 5 idee con score preliminare 1-100.
Rispondi SOLO con JSON valido.`,

  // ========== FASE 2: MASSACRO + OTTIMIZZAZIONE (COMBINATO) ==========
  destroyer: `Sei un DESTROYER: Short Seller + First Principles Thinker combinati.

FASE 1 - MASSACRO (uccidi 2 idee su 5):
Per ogni idea cerca il FATAL FLAW:
- Quibi morì per TIMING (pandemic = TV, not mobile)
- WeWork morì per UNIT ECONOMICS (CAC > LTV forever)
- Theranos morì per TECH IMPOSSIBILE (physics said no)
- Zenefits morì per REGULATION (insurance violations)

FASE 2 - OTTIMIZZAZIONE 10x (sulle 3 sopravvissute):
- Qual è il costo MINIMO teorico per risolvere questo problema?
- Come eliminiamo il 90% del lavoro invece di ottimizzarlo?
- Quale MOAT cresce automaticamente nel tempo?

Output: 3 idee sopravvissute con:
- Fatal flaw evitato e perché
- Versione 10x ottimizzata
- Moat primario identificato
Rispondi SOLO con JSON valido.`,

  // ========== FASE 3: VALIDAZIONE FINALE (COMBINATO) ==========
  validator: `Sei un VALIDATOR: Regulatory Hacker + VC Pattern Matcher combinati.

REGULATORY TRIGGERS 2025-2027:
- AI Act (Aug 2025): €35M fines → AI compliance tools
- CSRD (Jan 2025): €10M fines → ESG/carbon tracking  
- DORA (Jan 2025): €5M fines → fintech resilience
- NIS2 (Oct 2024): €10M fines → cybersecurity
- EPBD (2027): property devaluation → building energy

VC PATTERNS:
- SUCCESSI: Deel, Toast, Stripe → compliance + lock-in + ecosystem
- FALLIMENTI: Quibi, WeWork, Theranos → timing, economics, physics

SCORING FINALE (0-100):
- 90-100 "Unicorn" = regulatory moat + network effects + 10x economics
- 70-89 "Strong" = solido ma manca 1 elemento
- 50-69 "Risky" = interessante ma rischi significativi
- <50 "Pass" = fatal flaw non risolto

Per ogni idea finale fornisci:
- Score quantitativo con breakdown
- Regulatory angle (direttiva, deadline, penalità)
- Startup fallita simile e perché NOI non moriamo
- Red flags da monitorare
- Action plan primi 90 giorni
Rispondi SOLO con JSON valido.`,
};

const RESPONSE_SCHEMAS = {
  painHunter: `{
  "painPoints": [
    {
      "title": string,
      "description": string,
      "tam": string,
      "urgency": string,
      "whoPays": string,
      "howMuch": string
    }
  ]
}`,

  scienceArbitrage: `{
  "tech": [
    {
      "name": string,
      "api": string,
      "useCase": string,
      "costPerCall": string
    }
  ]
}`,

  collision: `{
  "ideas": [
    {
      "id": number,
      "name": string,
      "tagline": string,
      "whoPays": string,
      "howMuch": string,
      "cacEstimate": string,
      "ltvEstimate": string,
      "moat": string,
      "problem": { "sector": string, "pain": string, "tam": string },
      "solution": { "description": string, "tech": string, "mvpWeeks": number },
      "score": number
    }
  ]
}`,

  destroyer: `{
  "killed": [
    { "id": number, "name": string, "fatalFlaw": string }
  ],
  "survivors": [
    {
      "id": number,
      "name": string,
      "tagline": string,
      "fatalFlawAvoided": string,
      "tenXVersion": string,
      "moat": string,
      "problem": { "sector": string, "pain": string, "tam": string },
      "solution": { "description": string, "tech": string, "mvpWeeks": number },
      "whoPays": string,
      "howMuch": string,
      "cacEstimate": string,
      "ltvEstimate": string
    }
  ]
}`,

  validator: `{
  "finalIdeas": [
    {
      "id": number,
      "name": string,
      "tagline": string,
      "score": number,
      "scoreBreakdown": { "market": number, "timing": number, "economics": number, "moat": number, "execution": number },
      "verdict": "unicorn" | "strong" | "risky" | "pass",
      "regulatory": { "directive": string | null, "deadline": string | null, "penalty": string | null },
      "failedSimilar": { "name": string, "year": number, "cause": string },
      "whyWeDontDie": string,
      "redFlags": string[],
      "actionPlan90Days": string[],
      "problem": { "sector": string, "pain": string, "tam": string },
      "solution": { "description": string, "tech": string, "mvpWeeks": number, "tenXVersion": string },
      "whoPays": string,
      "howMuch": string,
      "cac": string,
      "ltv": string,
      "moat": string
    }
  ]
}`,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agent, sector, context, painPoints, breakthroughs, ideas, survivors, optimized, regulatory } = body;

    if (!agent || !AGENT_PROMPTS[agent as keyof typeof AGENT_PROMPTS]) {
      return NextResponse.json({ error: 'Invalid agent' }, { status: 400 });
    }

    const systemPrompt = AGENT_PROMPTS[agent as keyof typeof AGENT_PROMPTS];
    const responseSchema = RESPONSE_SCHEMAS[agent as keyof typeof RESPONSE_SCHEMAS];

    let userMessage = '';

    // ========== FASE 1: GENERAZIONE ==========
    if (agent === 'painHunter') {
      const sectorDetail = SECTOR_DETAILS[sector] || sector;
      userMessage = `Analizza il settore: ${sectorDetail}
${context ? `\nContesto: ${context}` : ''}

Trova 4-5 pain points unicorn-tier. Rispondi con JSON:
${responseSchema}`;
    } else if (agent === 'scienceArbitrage') {
      userMessage = `Pain points:
${JSON.stringify(painPoints, null, 2)}

Trova 4-5 tech GIÀ PRONTE (API disponibili). Rispondi con JSON:
${responseSchema}`;
    } else if (agent === 'collision') {
      userMessage = `PAIN POINTS:
${JSON.stringify(painPoints, null, 2)}

TECH DISPONIBILI:
${JSON.stringify(breakthroughs, null, 2)}

Genera ESATTAMENTE 5 idee unicorn-tier con scoring quantitativo. Rispondi con JSON:
${responseSchema}`;
    }
    
    // ========== FASE 2: MASSACRO + OTTIMIZZAZIONE (COMBINATO) ==========
    else if (agent === 'destroyer') {
      userMessage = `5 idee da analizzare:
${JSON.stringify(ideas, null, 2)}

FASE 1: Uccidi le 2 peggiori (trova il Fatal Flaw)
FASE 2: Ottimizza le 3 sopravvissute (versione 10x)

Rispondi con JSON:
${responseSchema}`;
    }
    
    // ========== FASE 3: VALIDAZIONE FINALE (COMBINATO) ==========
    else if (agent === 'validator') {
      userMessage = `3 idee sopravvissute e ottimizzate:
${JSON.stringify(survivors, null, 2)}

Valida con:
1. Regulatory angle (direttive EU 2025-2027)
2. VC pattern matching (startup fallite simili)
3. Score finale quantitativo (0-100)

Rispondi con JSON:
${responseSchema}`;
    }

    // Token allocation per agent
    const tokenMap: Record<string, number> = {
      painHunter: 2000,
      scienceArbitrage: 2000,
      collision: 4000,
      destroyer: 4000,
      validator: 4000,
    };
    const maxTokens = tokenMap[agent] || 3000;

    console.log(`[Generator] Running ${agent} with ${maxTokens} max tokens`);

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: userMessage }],
      system: systemPrompt,
    });

    const textContent = message.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    let jsonResponse;
    try {
      let jsonText = textContent.text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.slice(7);
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.slice(3);
      }
      if (jsonText.endsWith('```')) {
        jsonText = jsonText.slice(0, -3);
      }
      jsonResponse = JSON.parse(jsonText.trim());
    } catch {
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
    console.error('Generator API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof Error ? error.stack : String(error);
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: errorDetails,
        agent: 'unknown'
      },
      { status: 500 }
    );
  }
}
