import { ArsenalItemId } from './arsenal-types';

// Ultra-fast prompts - designed to complete in <30 seconds on Vercel
// Each prompt generates ~300-500 tokens max

export interface FastPromptConfig {
  prompt: string;
  maxTokens: number;
}

export const FAST_ARSENAL_PROMPTS: Record<ArsenalItemId, FastPromptConfig> = {
  'landing-page': {
    maxTokens: 800,
    prompt: `Crea una landing page BREVE:

## HERO
- Headline (max 8 parole)
- Subheadline (1 riga)
- CTA button text

## PROBLEMA (2 bullet points)

## SOLUZIONE (2 bullet points)

## CTA FINALE (1 riga)

Sii specifico per questa startup. Max 200 parole totali.`
  },

  'email-sequences': {
    maxTokens: 600,
    prompt: `Crea 2 email di cold outreach:

EMAIL 1 - Primo contatto:
- Subject: 
- Body (50 parole max)

EMAIL 2 - Follow-up:
- Subject:
- Body (50 parole max)

Sii diretto e specifico.`
  },

  'linkedin-pack': {
    maxTokens: 700,
    prompt: `Crea contenuto LinkedIn:

## HEADLINE PROFILO (120 char)

## 3 POST (per ogni post):
- Hook (prima riga)
- Contenuto (50 parole)
- CTA

Sii engaging e specifico.`
  },

  'cold-scripts': {
    maxTokens: 600,
    prompt: `Script per cold call:

## APERTURA (15 parole)
## PITCH (30 parole)
## 3 OBIEZIONI + RISPOSTE (20 parole ciascuna)
## CHIUSURA (15 parole)

Sii naturale e diretto.`
  },

  'investor-match': {
    maxTokens: 600,
    prompt: `Lista 5 tipi di investitori ideali:

Per ogni tipo:
- Tipo (Angel/VC/etc)
- Check size tipico
- Perché è un match (1 riga)

Poi: 1 template email per outreach (50 parole).`
  },

  'pitch-deck': {
    maxTokens: 800,
    prompt: `Outline pitch deck 10 slide:

Per ogni slide:
## SLIDE X: [TITOLO]
- Contenuto chiave (1-2 righe)

Slide: Cover, Problema, Soluzione, Market, Business Model, Traction, Competition, Team, Financials, Ask.`
  },

  'financial-model': {
    maxTokens: 600,
    prompt: `Financial model semplificato:

## ASSUMPTIONS (5 key assumptions)
## UNIT ECONOMICS (CAC, LTV, Margin)
## PROIEZIONI (Y1, Y2, Y3 - revenue e users)

Usa numeri realistici per questo settore.`
  },

  'pitch-qa-trainer': {
    maxTokens: 700,
    prompt: `8 domande difficili che i VC faranno:

Per ogni domanda:
Q: [domanda]
A: [risposta ideale - 20 parole max]

Focus su domande scomode.`
  },

  'interview-scripts': {
    maxTokens: 600,
    prompt: `Script per customer interview:

## INTRO (come presentarsi - 20 parole)
## 5 DOMANDE CHIAVE
## CHIUSURA (come chiedere referral - 15 parole)

Focus su problem discovery.`
  },

  'experiment-tracker': {
    maxTokens: 600,
    prompt: `5 esperimenti da fare subito:

Per ogni esperimento:
- Nome
- Ipotesi (1 riga)
- Come validare (1 riga)
- Metrica di successo

Prioritizza per impatto.`
  },

  'survey-generator': {
    maxTokens: 500,
    prompt: `Survey di validazione (10 domande):

## SCREENING (2 domande)
## PROBLEMA (4 domande)
## SOLUZIONE (2 domande)
## PRICING (2 domande)

Per ogni: domanda + tipo (scala/multipla/aperta).`
  },

  'competitor-radar': {
    maxTokens: 600,
    prompt: `Analisi competitor:

## 3 COMPETITOR PRINCIPALI
Per ogni: Nome, Pricing, Punto di forza, Punto debole

## COME CI DIFFERENZIAMO (3 punti)

Sii specifico per questo mercato.`
  },

  'roadmap-generator': {
    maxTokens: 700,
    prompt: `Roadmap 6 mesi:

## MESE 1-2: VALIDAZIONE
- 3 task chiave

## MESE 3-4: MVP
- 3 task chiave

## MESE 5-6: GROWTH
- 3 task chiave

## METRICHE TARGET per ogni fase`
  },

  'cap-table-sim': {
    maxTokens: 500,
    prompt: `Cap table semplificato:

## STRUTTURA INIZIALE (founder %)
## SCENARIO SEED (€500K @ €2M pre)
- Diluzione
- Post-money %

## ESOP raccomandato (%)

## 3 TERMINI DA NEGOZIARE`
  },

  'executive-summary': {
    maxTokens: 700,
    prompt: `Executive Summary (1 pagina):

## PROBLEMA (2 righe)
## SOLUZIONE (2 righe)
## MARKET SIZE (TAM/SAM numeri)
## BUSINESS MODEL (1 riga)
## TRACTION (metriche attuali)
## TEAM (1 riga)
## ASK (quanto e per cosa)

Sii conciso e impattante.`
  },

  'legal-starter-pack': {
    maxTokens: 600,
    prompt: `Checklist legale startup:

## DA FARE SUBITO (5 punti)
## DOCUMENTI NECESSARI (lista)
## CLAUSOLE VESTING (raccomandazione)
## ATTENZIONE A (3 errori comuni)

Specifico per startup italiana.`
  }
};

// Get prompt config for an item
export function getFastPrompt(itemId: ArsenalItemId): FastPromptConfig | null {
  return FAST_ARSENAL_PROMPTS[itemId] || null;
}
