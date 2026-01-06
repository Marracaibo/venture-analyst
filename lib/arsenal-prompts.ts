import { ArsenalItemId } from './arsenal-types';

// Split configuration for each arsenal item
export interface PromptPart {
  id: string;
  title: string;
  prompt: string;
}

export interface ArsenalItemConfig {
  parts: PromptPart[];
  maxTokensPerPart: number;
}

// Simplified, fast prompts split into parts
export const ARSENAL_CONFIGS: Record<ArsenalItemId, ArsenalItemConfig> = {
  'landing-page': {
    maxTokensPerPart: 1500,
    parts: [
      {
        id: 'structure',
        title: 'Struttura Landing Page',
        prompt: `Crea la STRUTTURA di una landing page. Output breve e diretto:

## 🎯 HERO
- Headline (max 10 parole)
- Subheadline (max 20 parole)
- CTA Button

## 😫 PROBLEMA (3 bullet)

## ✨ SOLUZIONE (3 feature con titolo e 1 riga)

## 🏆 COME FUNZIONA (3 step)

## 💰 PRICING (2 piani: nome, prezzo, 3 feature)

## 🚀 CTA FINALE

Sii specifico per questa startup.`
      },
      {
        id: 'content',
        title: 'Contenuti Landing Page',
        prompt: `Crea i CONTENUTI extra per la landing page:

## 💬 TESTIMONIAL (3)
Per ogni: nome, ruolo, azienda, quote (1-2 righe)

## ❓ FAQ (5)
Domanda + risposta breve

Sii specifico e realistico.`
      }
    ]
  },

  'email-sequences': {
    maxTokensPerPart: 1500,
    parts: [
      {
        id: 'cold',
        title: 'Cold Outreach Emails',
        prompt: `Crea SEQUENZA COLD OUTREACH (3 email):

Per ogni email:
- Subject Line
- Body (max 100 parole)
- Giorno di invio

Focus su apertura, valore, follow-up.`
      },
      {
        id: 'nurture',
        title: 'Nurturing Emails',
        prompt: `Crea SEQUENZA NURTURING (3 email):

Per ogni email:
- Subject Line
- Body (max 100 parole)
- Content/valore offerto

Focus su educazione e trust building.`
      }
    ]
  },

  'linkedin-pack': {
    maxTokensPerPart: 1500,
    parts: [
      {
        id: 'profile',
        title: 'Ottimizzazione Profilo',
        prompt: `Ottimizza il profilo LinkedIn:

## HEADLINE (120 char max)
## ABOUT (500 char max, storytelling + CTA)
## FEATURED (3 contenuti da evidenziare)`
      },
      {
        id: 'week1',
        title: 'Contenuti Settimana 1',
        prompt: `7 post LinkedIn per la prima settimana:

Per ogni giorno:
### Giorno X
- Hook (prima riga)
- Contenuto (max 150 parole)
- CTA
- Hashtag (3)`
      },
      {
        id: 'week2',
        title: 'Contenuti Settimana 2',
        prompt: `7 post LinkedIn per la seconda settimana:

Per ogni giorno:
### Giorno X
- Hook
- Contenuto (max 150 parole)
- CTA
- Hashtag (3)`
      }
    ]
  },

  'cold-scripts': {
    maxTokensPerPart: 1500,
    parts: [
      {
        id: 'calls',
        title: 'Script Chiamate',
        prompt: `Script per COLD CALL:

## APERTURA (10 sec)
## PITCH (30 sec)
## 5 OBIEZIONI + RISPOSTE
## CHIUSURA (booking)
## VOICEMAIL (20 sec)`
      },
      {
        id: 'dm',
        title: 'Script DM e Video',
        prompt: `Script per outreach:

## DM LINKEDIN (4 messaggi sequenza)
## VIDEO PITCH 60 SEC (script con timing)
## ELEVATOR PITCH 30 SEC`
      }
    ]
  },

  'investor-match': {
    maxTokensPerPart: 1500,
    parts: [
      {
        id: 'tier1',
        title: 'Investitori Top Match',
        prompt: `5 INVESTITORI ITALIANI/EU perfetti per questa startup:

Per ogni:
- Nome fondo/angel
- Tipo e check size
- Focus settoriale
- Perché è un match
- Come contattarlo`
      },
      {
        id: 'tier2',
        title: 'Altri Investitori + Strategia',
        prompt: `5 ALTRI INVESTITORI da considerare + STRATEGIA:

## INVESTITORI (5)
Per ogni: nome, tipo, perché considerarlo

## EMAIL TEMPLATE per outreach
## WARM INTRO: come ottenerla`
      }
    ]
  },

  'pitch-deck': {
    maxTokensPerPart: 1500,
    parts: [
      {
        id: 'slides1-6',
        title: 'Pitch Deck Slide 1-6',
        prompt: `Pitch deck SLIDE 1-6:

## SLIDE 1: COVER (titolo, tagline)
## SLIDE 2: PROBLEMA (statement + 2 data points)
## SLIDE 3: SOLUZIONE (one-liner + 3 benefit)
## SLIDE 4: DEMO (flow da mostrare)
## SLIDE 5: MARKET (TAM/SAM/SOM numeri)
## SLIDE 6: BUSINESS MODEL (revenue + unit economics)`
      },
      {
        id: 'slides7-12',
        title: 'Pitch Deck Slide 7-12',
        prompt: `Pitch deck SLIDE 7-12:

## SLIDE 7: TRACTION (3 metriche)
## SLIDE 8: COMPETITION (positioning 2x2)
## SLIDE 9: GTM (strategia + canali)
## SLIDE 10: TEAM (founder bio)
## SLIDE 11: FINANCIALS (3 anni)
## SLIDE 12: ASK (quanto, valuation, use of funds)`
      }
    ]
  },

  'financial-model': {
    maxTokensPerPart: 1500,
    parts: [
      {
        id: 'assumptions',
        title: 'Assumptions e Unit Economics',
        prompt: `Financial model parte 1:

## ASSUMPTIONS (10 key assumptions con valori)
## UNIT ECONOMICS
- CAC, LTV, LTV/CAC, Payback, Gross Margin, Churn

## REVENUE MODEL (formula)`
      },
      {
        id: 'projections',
        title: 'Proiezioni 3 Anni',
        prompt: `Financial model parte 2:

## PROIEZIONI 3 ANNI (tabella)
| Metrica | Y1 | Y2 | Y3 |
Revenue, Customers, MRR, EBITDA, Cash

## FUNDING SCENARIOS
- Bootstrap
- €500K Seed
- €1M Seed`
      }
    ]
  },

  'pitch-qa-trainer': {
    maxTokensPerPart: 1500,
    parts: [
      {
        id: 'questions',
        title: 'Domande VC',
        prompt: `15 DOMANDE che i VC faranno:

Per ogni:
- Domanda esatta
- Difficoltà (Easy/Medium/Hard)
- Risposta ideale (2-3 righe)
- Cosa NON dire`
      },
      {
        id: 'scenarios',
        title: 'Scenari di Pratica',
        prompt: `Scenari di pratica pitch:

## VC SCETTICO: come gestirlo
## VC TECNICO: come gestirlo
## "L'HO GIÀ VISTO FALLIRE": come rispondere

## 5 ERRORI FATALI da evitare`
      }
    ]
  },

  'interview-scripts': {
    maxTokensPerPart: 1500,
    parts: [
      {
        id: 'discovery',
        title: 'Problem Discovery',
        prompt: `Script PROBLEM DISCOVERY (30 min):

- Intro (come presentarsi)
- 10 DOMANDE chiave
  Per ogni: domanda + green flag + red flag
- Chiusura (come chiedere referral)`
      },
      {
        id: 'validation',
        title: 'Solution Validation',
        prompt: `Script SOLUTION VALIDATION:

- 8 DOMANDE sulla soluzione
- TEST PRICING (Van Westendorp)
- Template per recruiting intervistati
- Quante interviste fare`
      }
    ]
  },

  'experiment-tracker': {
    maxTokensPerPart: 1500,
    parts: [
      {
        id: 'experiments',
        title: '10 Esperimenti',
        prompt: `10 ESPERIMENTI prioritizzati:

Per ogni:
- Nome e hypothesis
- Metrica + target
- Effort (Low/Med/High)
- Impact (Low/Med/High)
- ICE Score
- 3 step per eseguirlo`
      }
    ]
  },

  'survey-generator': {
    maxTokensPerPart: 1500,
    parts: [
      {
        id: 'survey',
        title: 'Survey Completo',
        prompt: `Survey VALIDATION (20 domande max):

## SCREENING (3 domande)
## PROBLEMA (5 domande mix)
## SOLUZIONE (4 domande)
## PRICING (3 domande Van Westendorp)
## DEMOGRAPHICS (2 domande)

Format: testo domanda + tipo (multiple choice/scala/open)`
      }
    ]
  },

  'competitor-radar': {
    maxTokensPerPart: 1500,
    parts: [
      {
        id: 'analysis',
        title: 'Analisi Competitor',
        prompt: `COMPETITOR ANALYSIS:

## 5 COMPETITOR (per ogni):
- Nome, website, pricing
- Strengths e weaknesses
- Funding stimato

## FEATURE MATRIX (tabella comparativa)
## POSITIONING: dove ci posizioniamo`
      }
    ]
  },

  'roadmap-generator': {
    maxTokensPerPart: 1500,
    parts: [
      {
        id: 'q1q2',
        title: 'Roadmap Q1-Q2',
        prompt: `ROADMAP primi 6 mesi:

## Q1: VALIDAZIONE (mesi 1-3)
- OKR (1 objective + 3 KR)
- 12 task settimanali chiave
- Gate review criteria

## Q2: GROWTH (mesi 4-6)
- OKR
- 12 task settimanali
- Gate review`
      },
      {
        id: 'q3q4',
        title: 'Roadmap Q3-Q4',
        prompt: `ROADMAP mesi 7-12:

## Q3: SCALE (mesi 7-9)
- OKR + task principali

## Q4: EXPAND (mesi 10-12)
- OKR + task principali

## TEAM PLAN (chi assumere quando)
## BUDGET overview per trimestre`
      }
    ]
  },

  'cap-table-sim': {
    maxTokensPerPart: 1500,
    parts: [
      {
        id: 'captable',
        title: 'Cap Table Simulator',
        prompt: `CAP TABLE SIMULATOR:

## CAP TABLE INIZIALE (founder)

## 3 SCENARI ROUND:
Per ogni: pre-money, amount, dilution, post-money table

## ESOP: raccomandazione size e vesting

## TERMINI DA NEGOZIARE (5 più importanti)`
      }
    ]
  },

  'executive-summary': {
    maxTokensPerPart: 1500,
    parts: [
      {
        id: 'summary',
        title: 'Executive Summary',
        prompt: `EXECUTIVE SUMMARY (1 pagina):

## OPPORTUNITY (2 righe)
## PROBLEMA e chi lo soffre
## SOLUZIONE e secret sauce
## MARKET (TAM/SAM/SOM)
## BUSINESS MODEL e unit economics
## TRACTION e milestones
## TEAM
## ASK (quanto, valuation, use of funds)
## PERCHÉ ORA (3 motivi)`
      }
    ]
  },

  'legal-starter-pack': {
    maxTokensPerPart: 1500,
    parts: [
      {
        id: 'checklist',
        title: 'Checklist e Patto Parasociale',
        prompt: `LEGAL STARTER PACK parte 1:

## CHECKLIST LEGALE (cosa serve)

## PATTO PARASOCIALE (clausole chiave):
- Lock-up
- Prelazione
- Tag-along / Drag-along
- Vesting schedule
- Good/Bad leaver`
      },
      {
        id: 'docs',
        title: 'NDA e Founder Agreement',
        prompt: `LEGAL STARTER PACK parte 2:

## NDA (clausole essenziali)

## FOUNDER AGREEMENT:
- Ruoli e responsabilità
- Tempo commitment
- Compensi
- IP Assignment

## GDPR CHECKLIST (5 punti)`
      }
    ]
  }
};

// Get total parts for an item
export function getItemPartsCount(itemId: ArsenalItemId): number {
  return ARSENAL_CONFIGS[itemId]?.parts.length || 1;
}

// Get specific part prompt
export function getPartPrompt(itemId: ArsenalItemId, partIndex: number): PromptPart | null {
  const config = ARSENAL_CONFIGS[itemId];
  if (!config || partIndex >= config.parts.length) return null;
  return config.parts[partIndex];
}

// Get max tokens for an item's parts
export function getMaxTokens(itemId: ArsenalItemId): number {
  return ARSENAL_CONFIGS[itemId]?.maxTokensPerPart || 1500;
}
