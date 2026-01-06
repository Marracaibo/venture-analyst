import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { StartupInput, ScreenerResult, VERTICALE_LABELS, FASE_LABELS, CAPTABLE_LABELS, COMPETIZIONE_LABELS, COACHABILITY_LABELS } from '@/lib/screener-types';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Use Haiku for speed (completes in <30 seconds)
const FAST_MODEL = 'claude-3-5-haiku-20241022';

// PROMPT per valutazione oggettiva dei 5 filtri
const FILTERS_EVALUATION_PROMPT = `Sei un Venture Analyst esperto. Valuta OGGETTIVAMENTE questa startup sui 5 filtri chiave.

Per ogni filtro dai uno SCORE da 1 a 5 e una breve motivazione (1 frase).

CRITERI DI VALUTAZIONE:

1. PROBLEM SOLVING (Il problema e' reale e urgente?)
   - 5: Problema critico, validato con dati/clienti paganti
   - 4: Problema significativo, evidenze di mercato
   - 3: Problema esistente ma non urgente
   - 2: Problema vago o di nicchia troppo piccola
   - 1: Problema inesistente o inventato

2. MARKET ANALYSIS (Mercato grande e accessibile?)
   - 5: TAM >1B, mercato in crescita, posizionamento chiaro
   - 4: TAM 100M-1B, buone opportunita
   - 3: Mercato medio, competizione gestibile
   - 2: Mercato piccolo o saturo
   - 1: No market fit evidente

3. DIFFERENTIATION (Unicita' difendibile?)
   - 5: Moat forte (tech/IP, network effects, dati unici)
   - 4: Vantaggio competitivo chiaro e sostenibile
   - 3: Differenziazione presente ma replicabile
   - 2: Poca differenziazione
   - 1: Commodity, facilmente copiabile

4. BUSINESS MODEL (Modello economico sostenibile? CAC:LTV >= 1:3)
   - 5: Unit economics provati, margini >60%, scalabile
   - 4: Modello chiaro, margini buoni
   - 3: Modello definito ma da validare
   - 2: Modello incerto, margini bassi
   - 1: Nessun modello chiaro

5. TRACTION (Capacita' di acquisire clienti?)
   - 5: Revenue significativa, crescita >20% mese
   - 4: Primi clienti paganti, segnali positivi
   - 3: Utenti/beta tester, interesse validato
   - 2: Solo interesse verbale
   - 1: Nessuna trazione

RISPONDI SOLO con questo JSON:
{
  "filters": {
    "problemSolving": { "score": 1-5, "passed": true/false, "reason": "..." },
    "marketAnalysis": { "score": 1-5, "passed": true/false, "reason": "..." },
    "differentiation": { "score": 1-5, "passed": true/false, "reason": "..." },
    "businessModel": { "score": 1-5, "passed": true/false, "reason": "..." },
    "traction": { "score": 1-5, "passed": true/false, "reason": "..." }
  },
  "passedCount": 0-5,
  "overallAssessment": "1-2 frasi di sintesi"
}

Un filtro e' "passed" se score >= 3.`;

const SCREENER_PROMPT = `Sei un Venture Builder Expert senior per Forge Studio. Il tuo compito è analizzare startup in profondità e creare PACCHETTI DI SUPPORTO ULTRA-PERSONALIZZATI e ACTIONABLE.

## TEAM FORGE STUDIO

Il team che lavorerà con la startup:
- **Riccardo (CEO)**: 20+ anni esperienza in Marketing & Sales. Competenze: GTM strategy, sales processes, brand positioning, customer acquisition
- **Alessandro (CFO)**: Esperto commerciale con forte network di investitori. Competenze: fundraising, financial modeling, investor relations, deal structuring
- **Amin (CTO)**: Competenze tecniche avanzate in AI/ML, coding, database, architettura software, DevOps

Se un task richiede competenze NON presenti nel team, scrivi "ESTERNO" come responsabile.

## FORGE STUDIO - SERVIZI DISPONIBILI

### 🛠️ TECH & PRODUCT (Amin)
- CTO Fractional (2gg/settimana per 3 mesi)
- MVP Development Sprint (team 2-3 dev per 6-8 settimane)
- Architettura & Code Review
- Tech Stack Selection & Setup
- DevOps & Infrastructure Setup
- AI/ML Integration Consulting
- Mobile App Development
- API Design & Integration

### 💰 FUNDRAISING & FINANCE (Alessandro)
- Pitch Deck Premium (design + storytelling)
- Financial Model & Projections
- VC/Angel Intro Package (10+ intro qualificate)
- Due Diligence Preparation Kit
- Valuation Advisory
- Term Sheet Negotiation Support
- Cap Table Management Setup

### 🚀 SALES & GTM (Riccardo)
- Go-to-Market Strategy Workshop (2 giorni)
- CRM Setup & Sales Automation (HubSpot/Pipedrive)
- Sales Playbook & Scripts
- Primi 10 Clienti Garantiti (con success fee)
- Pricing Strategy & Packaging
- Partnership Development
- Channel Strategy

### 📣 MARKETING & BRAND (Riccardo)
- Brand Identity Sprint (logo, palette, tone of voice) → ESTERNO per design
- Landing Page Ad Alta Conversione → Amin per tech, Riccardo per copy
- Content Strategy 90 giorni
- LinkedIn Founder Building
- PR Launch Campaign → ESTERNO per media relations
- Performance Marketing Setup
- Community Building Strategy

### ⚖️ LEGAL & OPS (ESTERNO con supervisione Alessandro)
- Startup Legal Kit (statuto, patti parasociali, SAFE)
- GDPR & Privacy Compliance
- Contratti Template (clienti, fornitori, dipendenti)
- Incorporation Advisory
- IP Protection Strategy
- HR Setup & First Hires

### 🧠 STRATEGY & ADVISORY (Team)
- Business Model Canvas Workshop (Riccardo + Alessandro)
- Competitive Analysis Deep Dive (Riccardo)
- Pivot Assessment (Team)
- Scaling Roadmap (Team)
- Board Preparation (Alessandro)
- Exit Strategy Planning (Alessandro)

## IL TUO COMPITO

1. **ANALIZZA IN PROFONDITÀ** l'idea basandoti sulla descrizione fornita
2. **IDENTIFICA I GAP CRITICI** - cosa manca per il successo?
3. **CREA PACCHETTI SU MISURA** con servizi ULTRA-DETTAGLIATI

## REGOLE PACCHETTI

- **NOMI EVOCATIVI** e memorabili
- **4-6 SERVIZI** per pacchetto
- **OGNI SERVIZIO DEVE INCLUDERE**:
  - Titolo chiaro
  - Descrizione dettagliata (2-3 frasi che spiegano ESATTAMENTE cosa si fa)
  - Step operativi (lista di 3-5 azioni concrete)
  - Deliverable specifico
  - Timeline realistica
  - Chi lo fa (Riccardo/Alessandro/Amin/ESTERNO)
- **PRICING**: CORE 18-25%, GROWTH 8-15%, BOOST 3-7%

## REGOLE PROSSIMI PASSI

Per ogni step dei prossimi 90 giorni DEVI specificare:
- **Chi**: Riccardo, Alessandro, Amin, o ESTERNO
- **Cosa**: azione concreta e specifica
- **Output**: deliverable atteso
- **Tempo**: durata realistica

Sii BRUTALMENTE ONESTO e SPECIFICO. Niente fuffa generica.
Rispondi SOLO in italiano.

## FORMATO RISPOSTA (JSON) - SEGUI QUESTO ESEMPIO ESATTO

{
  "gapAnalysis": {
    "criticalMissing": ["Manca validazione di mercato con utenti reali", "Nessun modello di pricing testato"],
    "hasAlready": ["Team tecnico forte con competenze AI", "Conoscenza del dominio legal"],
    "mainRisks": ["Mercato legaltech saturo - serve differenziazione forte", "CAC potenzialmente alto per acquisire avvocati"],
    "hiddenOpportunities": ["Possibilità di partnership con ordini avvocati", "Espansione B2B verso studi legali"]
  },
  "deepAnalysis": "Analisi approfondita di 3-4 paragrafi...",
  "customPackages": [
    {
      "nome": "Market Validation Sprint",
      "focus": "GTM & Sales",
      "tier": "BOOST",
      "items": [
        {
          "titolo": "Pricing Model Review",
          "descrizione": "Analisi e ottimizzazione del modello di pricing attraverso interviste con potenziali clienti, benchmark competitivo e test A/B su landing page. L'obiettivo è identificare il price point ottimale e il packaging dei servizi.",
          "steps": [
            "Interviste con 10 avvocati target per validare willingness-to-pay",
            "Analisi pricing dei 5 competitor principali (Westlaw, LexisNexis, etc)",
            "Creazione di 3 ipotesi di pricing (freemium, subscription, pay-per-use)",
            "Setup A/B test su landing page con diverse fasce di prezzo",
            "Report finale con raccomandazione pricing e proiezioni revenue"
          ],
          "deliverable": "Documento pricing strategy con price point validato e proiezioni MRR",
          "timeline": "2 settimane",
          "owner": "Riccardo"
        },
        {
          "titolo": "GTM Strategy Workshop",
          "descrizione": "Workshop intensivo di 2 giorni per definire la strategia go-to-market. Identificheremo i canali di acquisizione più efficaci, il messaging e il funnel di conversione.",
          "steps": [
            "Day 1 AM: Analisi ICP (Ideal Customer Profile) e buyer personas",
            "Day 1 PM: Mapping del customer journey e touchpoints",
            "Day 2 AM: Definizione canali (LinkedIn, eventi, referral, content)",
            "Day 2 PM: Creazione sales playbook e script di vendita"
          ],
          "deliverable": "GTM Strategy Document + Sales Playbook",
          "timeline": "2 giorni intensivi",
          "owner": "Riccardo"
        }
      ],
      "prezzo": "5-8% Equity",
      "rationale": "Questo pacchetto è essenziale perché la startup ha un prodotto tech ma manca completamente di validazione commerciale. Riccardo con i suoi 20 anni di esperienza sales può accelerare drasticamente il time-to-market."
    }
  ],
  "next90Days": [
    {
      "settimana": "1-2",
      "tasks": [
        {
          "owner": "Riccardo",
          "task": "Condurre 10 interviste con avvocati target per validare pricing",
          "output": "Report interviste con insights su willingness-to-pay",
          "durata": "5 giorni"
        },
        {
          "owner": "Amin",
          "task": "Setup landing page con A/B test per 3 fasce di prezzo",
          "output": "Landing page live con tracking conversioni",
          "durata": "3 giorni"
        }
      ]
    },
    {
      "settimana": "3-4",
      "tasks": [
        {
          "owner": "Riccardo",
          "task": "Workshop GTM Strategy di 2 giorni con founder",
          "output": "GTM Strategy Document completo",
          "durata": "2 giorni"
        },
        {
          "owner": "Alessandro",
          "task": "Preparare financial model con proiezioni basate su pricing validato",
          "output": "Financial model Excel con scenari",
          "durata": "3 giorni"
        }
      ]
    },
    {
      "settimana": "5-8",
      "tasks": [
        {
          "owner": "Riccardo",
          "task": "Acquisizione primi 5 clienti pilota attraverso network",
          "output": "5 clienti paganti o in trial",
          "durata": "4 settimane"
        }
      ]
    },
    {
      "settimana": "9-12",
      "tasks": [
        {
          "owner": "Alessandro",
          "task": "Preparazione materiali per eventuale round seed",
          "output": "Pitch deck + data room pronti",
          "durata": "2 settimane"
        }
      ]
    }
  ],
  "verdict_adjustment": ""
}

IMPORTANTE: Genera ESATTAMENTE questo formato. Ogni item DEVE avere tutti i campi (titolo, descrizione lunga, steps array, deliverable, timeline, owner). NON abbreviare.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input: StartupInput = body.input;
    const useAI: boolean = body.useAI ?? true;

    // Validazione minima
    if (!input.nome || input.nome.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Nome startup richiesto' },
        { status: 400 }
      );
    }

    // STEP 1: Valutazione AI dei 5 filtri basata su descrizioni testuali
    let aiFiltersResult: any = null;
    
    if (useAI && process.env.ANTHROPIC_API_KEY) {
      try {
        const filtersInput = `
STARTUP: ${input.nome}
SETTORE: ${VERTICALE_LABELS[input.verticale] || input.verticale}
MODELLO: ${input.businessModel?.toUpperCase() || 'N/A'}
FASE: ${FASE_LABELS[input.fase]}

1. PROBLEMA CHE RISOLVE:
${input.problemDescription || 'Non specificato'}

ALTERNATIVE ATTUALI:
${input.currentAlternatives || 'Non specificato'}

2. MERCATO E COMPETITOR:
${input.marketDescription || 'Non specificato'}

CLIENTE TARGET:
${input.targetCustomer || 'Non specificato'}

3. UNICITA' E DIFFERENZIAZIONE:
${input.uniquenessDescription || 'Non specificato'}

VANTAGGIO COMPETITIVO:
${input.competitiveAdvantage || 'Non specificato'}

4. BUSINESS MODEL:
${input.revenueModel || 'Non specificato'}

UNIT ECONOMICS:
${input.unitEconomics || 'Non specificato'}
${input.cacEstimate ? `CAC stimato: €${input.cacEstimate}` : ''}
${input.ltvEstimate ? `LTV stimato: €${input.ltvEstimate}` : ''}

5. TRACTION:
${input.tractionDescription || 'Non specificato'}
${input.customersCount ? `Clienti: ${input.customersCount}` : ''}
${input.mrrCurrent ? `MRR: €${input.mrrCurrent}` : ''}

DESCRIZIONE GENERALE:
${input.descrizione || 'Non fornita'}
`;

        const filtersResponse = await client.messages.create({
          model: FAST_MODEL,
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `${FILTERS_EVALUATION_PROMPT}\n\n---\n\nSTARTUP DA VALUTARE:\n${filtersInput}`
            }
          ]
        });

        const filtersText = filtersResponse.content[0].type === 'text' ? filtersResponse.content[0].text : '';
        const filtersJsonMatch = filtersText.match(/\{[\s\S]*\}/);
        if (filtersJsonMatch) {
          aiFiltersResult = JSON.parse(filtersJsonMatch[0]);
        }
      } catch (filterError) {
        console.error('AI filters evaluation failed:', filterError);
      }
    }

    // STEP 2: Determina verdetto basato sui filtri AI
    const passedCount = aiFiltersResult?.passedCount || 0;
    const isCoachable = input.coachability !== 'bassa';
    const isCapTableClean = input.capTable !== 'sporca';
    
    let verdetto: 'CORE' | 'SATELLITE' | 'REJECT' = 'SATELLITE';
    let verdettoLabel = 'Satellite Partnership';
    let reasoning = '';

    // Kill switches
    const killSwitches: string[] = [];
    if (!isCoachable) killSwitches.push('Coachability bassa - founder non ricettivo');
    if (!isCapTableClean) killSwitches.push('Cap Table problematica');
    if (passedCount < 3) killSwitches.push(`Solo ${passedCount}/5 filtri superati`);

    if (killSwitches.length > 0 && passedCount < 3) {
      verdetto = 'REJECT';
      verdettoLabel = 'Non Idonea';
      reasoning = `La startup non supera i criteri minimi. ${aiFiltersResult?.overallAssessment || ''}`;
    } else if (passedCount >= 4 && isCoachable && isCapTableClean && (input.needsCto || input.needsCmo || input.needsCfo)) {
      verdetto = 'CORE';
      verdettoLabel = 'Core Acceleration';
      reasoning = `Startup con forte potenziale (${passedCount}/5 filtri). ${aiFiltersResult?.overallAssessment || ''}`;
    } else {
      verdetto = 'SATELLITE';
      verdettoLabel = 'Satellite Partnership';
      reasoning = `${passedCount}/5 filtri superati. ${aiFiltersResult?.overallAssessment || 'Possiamo supportare con servizi mirati.'}`;
    }

    // Costruisci filtersScore per UI
    const filtersScore = aiFiltersResult?.filters ? {
      problemSolving: aiFiltersResult.filters.problemSolving?.passed || false,
      marketAnalysis: aiFiltersResult.filters.marketAnalysis?.passed || false,
      differentiation: aiFiltersResult.filters.differentiation?.passed || false,
      businessModel: aiFiltersResult.filters.businessModel?.passed || false,
      traction: aiFiltersResult.filters.traction?.passed || false,
      passedCount: passedCount,
      details: aiFiltersResult.filters
    } : undefined;

    // Strengths e weaknesses dai filtri
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    if (aiFiltersResult?.filters) {
      const f = aiFiltersResult.filters;
      if (f.problemSolving?.passed) strengths.push(`Problema: ${f.problemSolving.reason}`);
      else weaknesses.push(`Problema: ${f.problemSolving?.reason || 'Da validare'}`);
      
      if (f.marketAnalysis?.passed) strengths.push(`Mercato: ${f.marketAnalysis.reason}`);
      else weaknesses.push(`Mercato: ${f.marketAnalysis?.reason || 'Da analizzare'}`);
      
      if (f.differentiation?.passed) strengths.push(`Differenziazione: ${f.differentiation.reason}`);
      else weaknesses.push(`Differenziazione: ${f.differentiation?.reason || 'Da rafforzare'}`);
      
      if (f.businessModel?.passed) strengths.push(`Business Model: ${f.businessModel.reason}`);
      else weaknesses.push(`Business Model: ${f.businessModel?.reason || 'Da definire'}`);
      
      if (f.traction?.passed) strengths.push(`Traction: ${f.traction.reason}`);
      else weaknesses.push(`Traction: ${f.traction?.reason || 'Da costruire'}`);
    }

    // Costruisci risultato base
    const baseResult: ScreenerResult = {
      verdetto,
      verdettoLabel,
      reasoning,
      killSwitches,
      strengths,
      weaknesses,
      packages: [],
      nextSteps: [],
      filtersScore
    };

    // Se useAI è true e abbiamo una API key, genera pacchetti personalizzati con Claude
    if (useAI && process.env.ANTHROPIC_API_KEY) {
      try {
        const startupDescription = `
## DATI STRUTTURATI
- Nome: ${input.nome}
- Verticale: ${VERTICALE_LABELS[input.verticale]}
- Fase: ${FASE_LABELS[input.fase]}
- Cap Table: ${CAPTABLE_LABELS[input.capTable]}
- Competizione: ${COMPETIZIONE_LABELS[input.competizione]}
- Coachability Founder: ${COACHABILITY_LABELS[input.coachability]}

## DESCRIZIONE IDEA (IMPORTANTE - USA QUESTA PER L'ANALISI)
${input.descrizione}

## VERDETTO AUTOMATICO
Verdetto: ${baseResult.verdetto} (${baseResult.verdettoLabel})
Motivazione: ${baseResult.reasoning}
${baseResult.killSwitches.length > 0 ? `Kill Switches attivati: ${baseResult.killSwitches.join(', ')}` : ''}
`;

        const message = await client.messages.create({
          model: FAST_MODEL,
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: `${SCREENER_PROMPT}\n\n---\n\nSTARTUP DA ANALIZZARE:\n${startupDescription}\n\n---\n\nIMPORTANTE: Per ogni item del pacchetto DEVI includere TUTTI i campi: titolo, descrizione (2-3 frasi dettagliate), steps (array di 3-5 azioni concrete), deliverable, timeline, owner (Riccardo/Alessandro/Amin/ESTERNO). NON saltare nessun campo.`
            }
          ]
        });

        const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
        
        // Parse JSON dalla risposta
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const aiInsights = JSON.parse(jsonMatch[0]);
          
          // Arricchisci il risultato con l'analisi AI
          baseResult.aiInsights = aiInsights.deepAnalysis;
          
          // Gap Analysis -> strengths e weaknesses
          if (aiInsights.gapAnalysis) {
            if (aiInsights.gapAnalysis.criticalMissing?.length > 0) {
              baseResult.weaknesses = Array.from(new Set([...baseResult.weaknesses, ...aiInsights.gapAnalysis.criticalMissing]));
            }
            if (aiInsights.gapAnalysis.hasAlready?.length > 0) {
              baseResult.strengths = Array.from(new Set([...baseResult.strengths, ...aiInsights.gapAnalysis.hasAlready]));
            }
            if (aiInsights.gapAnalysis.mainRisks?.length > 0) {
              baseResult.weaknesses = Array.from(new Set([...baseResult.weaknesses, ...aiInsights.gapAnalysis.mainRisks]));
            }
            if (aiInsights.gapAnalysis.hiddenOpportunities?.length > 0) {
              baseResult.strengths = Array.from(new Set([...baseResult.strengths, ...aiInsights.gapAnalysis.hiddenOpportunities]));
            }
          }
          
          // Next steps da AI (nuovo formato con settimane e tasks dettagliati)
          if (aiInsights.next90Days?.length > 0) {
            const formattedSteps: string[] = [];
            aiInsights.next90Days.forEach((week: any) => {
              if (typeof week === 'string') {
                formattedSteps.push(week);
              } else if (week.tasks && Array.isArray(week.tasks)) {
                week.tasks.forEach((task: any) => {
                  const owner = task.owner || 'Team';
                  const durata = task.durata ? ` (${task.durata})` : '';
                  formattedSteps.push(`[Sett. ${week.settimana}] **${owner}**: ${task.task}${durata} → ${task.output || 'Completato'}`);
                });
              } else if (week.azione) {
                formattedSteps.push(`[Sett. ${week.settimana}] ${week.azione}`);
              }
            });
            baseResult.nextSteps = formattedSteps;
          }
          
          // PACCHETTI PERSONALIZZATI DA AI - Sostituiscono quelli base se CORE o SATELLITE
          if (baseResult.verdetto !== 'REJECT' && aiInsights.customPackages?.length > 0) {
            // Sostituisci completamente i pacchetti con quelli generati da AI
            baseResult.packages = aiInsights.customPackages.map((pkg: any) => ({
              nome: pkg.nome,
              items: pkg.items.map((item: any) => ({
                titolo: item.titolo,
                descrizione: item.descrizione,
                steps: item.steps || [],
                deliverable: item.deliverable,
                timeline: item.timeline,
                owner: item.owner
              })),
              prezzo: pkg.prezzo,
              equityRange: pkg.prezzo,
              rationale: pkg.rationale,
              focus: pkg.focus,
              tier: pkg.tier
            }));
          }
          
          // Se AI suggerisce di aggiustare il verdetto, aggiungi nota
          if (aiInsights.verdict_adjustment && aiInsights.verdict_adjustment.trim()) {
            baseResult.reasoning += `\n\n⚠️ Nota AI: ${aiInsights.verdict_adjustment}`;
          }
        }
      } catch (aiError) {
        console.error('AI enhancement failed:', aiError);
        // Continua con il risultato base se AI fallisce
      }
    }

    return NextResponse.json({
      success: true,
      result: baseResult,
      input: input
    });

  } catch (error) {
    console.error('Screener error:', error);
    return NextResponse.json(
      { success: false, error: 'Errore durante lo screening' },
      { status: 500 }
    );
  }
}
