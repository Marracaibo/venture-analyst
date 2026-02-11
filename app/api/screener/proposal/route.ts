// API per generazione Proposta di Partnership Strategica con AI
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { StartupInput, ScreenerResult, SETTORI_CONFIG, BUSINESS_MODEL_LABELS } from '@/lib/screener-types';

const anthropic = new Anthropic();

// Sezioni del documento
const PROPOSAL_SECTIONS = [
  {
    id: 'executive-summary',
    title: '1. Executive Summary',
    prompt: (input: StartupInput, result: ScreenerResult) => `
Genera l'Executive Summary per una proposta di partnership strategica per la startup "${input.nome}".

DATI STARTUP:
- Settore: ${SETTORI_CONFIG.find(s => s.id === input.verticale)?.label || input.verticale}
- Business Model: ${BUSINESS_MODEL_LABELS[input.businessModel].label}
- Fase: ${input.fase}
- Problema: ${input.problemDescription || 'N/A'}
- Mercato: ${input.marketDescription || 'N/A'}
- Unicità: ${input.uniquenessDescription || 'N/A'}
- Revenue Model: ${input.revenueModel || 'N/A'}
- Traction: ${input.tractionDescription || 'N/A'}

RISULTATO SCREENING:
- Verdetto: ${result.verdetto} (${result.verdettoLabel})
- Filtri passati: ${result.filtersScore?.passedCount || 0}/5
- Punti di forza: ${result.strengths.join(', ')}
- Aree miglioramento: ${result.weaknesses.join(', ')}

Scrivi in italiano professionale. Includi:
1. Box "Opportunità di Investimento" con: Settore, Tecnologia, Stage, Mercato Target
2. "Sintesi dell'Opportunità" - perché questa è un'opportunità unica
3. Cosa propone il team manageriale (costituzione, fundraising, go-to-market, exit)
4. Tabella "Cosa i Fondatori Ricevono" (Expertise, Network, Accelerazione, Focus R&D, Probabilità Successo)
5. "Highlights Chiave" con mercato validato, tecnologia difendibile, team, timing

Formatta con markdown. Usa tabelle dove appropriato.`
  },
  {
    id: 'team-presentation',
    title: '2. Presentazione Team Manageriale',
    prompt: (input: StartupInput, result: ScreenerResult) => `
Genera la sezione "Presentazione Team Manageriale" per la proposta di ${input.nome}.

I ruoli operativi necessari sono: ${result.operationalRoles?.join(', ') || 'CFO, CMO, CEO'}

Per ogni ruolo (CFO, CMO, CEO) scrivi:
1. Titolo del ruolo
2. "Esperienza e Competenze Distintive" - descrizione generale dell'expertise
3. "Valore Aggiunto Specifico per ${input.nome}" con bullet points:
   - Per CFO: Fundraising, Modellazione Finanziaria, Governance, Ottimizzazione Fiscale
   - Per CMO: Go-to-Market, Brand Building, Partnership Commerciali, Digital Marketing
   - Per CEO: Leadership Strategica, Gestione Stakeholder, Scaling Operations

4. Tabella "Sinergie e Complementarietà del Team" con rating numerico (es. 4/5) per:
   - Fundraising
   - Conoscenza Settore ${SETTORI_CONFIG.find(s => s.id === input.verticale)?.label}
   - Governance e Leadership
   - Gestione Finanziaria
   - Network Commerciale
   - Problem Solving Complesso

5. Box "Perché Questo Team è Ideale per ${input.nome}" - come copre i gap critici

Scrivi in italiano professionale con markdown.`
  },
  {
    id: 'startup-analysis',
    title: '3. Analisi Startup',
    prompt: (input: StartupInput, result: ScreenerResult) => `
Genera un'analisi approfondita della startup "${input.nome}".

DATI:
- Settore: ${SETTORI_CONFIG.find(s => s.id === input.verticale)?.label}
- Problema: ${input.problemDescription}
- Soluzione: ${input.descrizione}
- Mercato: ${input.marketDescription}
- Target: ${input.targetCustomer}
- Unicità: ${input.uniquenessDescription}
- Vantaggio competitivo: ${input.competitiveAdvantage}
- Revenue Model: ${input.revenueModel}
- Unit Economics: ${input.unitEconomics}
- Traction: ${input.tractionDescription}
- Clienti: ${input.customersCount || 0}, MRR: €${input.mrrCurrent || 0}

Scrivi sezioni:
1. "Overview Tecnologia e Prodotto" - cosa fa, come funziona, innovazione
2. "Analisi del Mercato" con TAM/SAM/SOM, trend, driver crescita
3. "Landscape Competitivo" - competitor, positioning, barriere
4. "Modello di Business" - revenue streams, pricing, scalabilità
5. "Traction e Validazione" - metriche, clienti, crescita
6. "Team Fondatori" - competenze, gap, complementarietà
7. "Rischi e Mitigazioni" - tabella rischi con strategie

Usa tabelle, bullet points, dati quantitativi. Italiano professionale.`
  },
  {
    id: 'valuation',
    title: '4. Valutazione Aziendale Pre-Money',
    prompt: (input: StartupInput, result: ScreenerResult) => `
Genera la sezione "Valutazione Aziendale Pre-Money" per ${input.nome}.

DATI:
- Fase: ${input.fase}
- Settore: ${SETTORI_CONFIG.find(s => s.id === input.verticale)?.label}
- MRR: €${input.mrrCurrent || 0}
- Clienti: ${input.customersCount || 0}
- LTV: €${input.ltvEstimate || 0}
- CAC: €${input.cacEstimate || 0}

Scrivi:
1. "Metodologia di Valutazione" - approach usato (Berkus, Scorecard, DCF semplificato)
2. "Comparable Analysis" - tabella con startup simili e loro valutazioni
3. "Scorecard Method" con punteggi per: Team, Mercato, Prodotto, Traction, Competizione
4. "Range di Valutazione Pre-Money" - €XXK - €XXK con giustificazione
5. "Sensitività" - come cambia con diverse assunzioni
6. "Raccomandazione" - valutazione suggerita per negoziazione

Fase ${input.fase}:
- idea: €100K-300K
- mvp: €300K-800K  
- prodotto-live: €500K-1.5M
- revenue: €1M-3M (dipende da MRR)

Italiano professionale, tabelle con numeri.`
  },
  {
    id: 'option-a-equity',
    title: '5. OPZIONE A: Costituzione Societaria con Equity Immediata',
    prompt: (input: StartupInput, result: ScreenerResult) => `
Genera "OPZIONE A: Costituzione Societaria con Equity Immediata" per ${input.nome}.

Questa opzione prevede che il team manageriale entri subito come soci con equity.

Scrivi:
1. "Struttura Proposta" 
   - Split: 70% fondatori / 30% management
   - Capitale sociale: €10.000 (5 soci contribuiscono)
   - Vesting: 4 anni, 1 anno cliff per tutti

2. "Meccanismo di Ingresso"
   - Costituzione SRL con atto notarile
   - Quote assegnate pro-quota
   - Patto parasociale con diritti/doveri

3. "Vantaggi per i Fondatori" - tabella
   - Commitment immediato del management
   - Governance chiara da Day 1
   - Attrattività per investitori
   - Accelerazione time-to-market

4. "Vantaggi per il Management"
   - Equity garantita
   - Partecipazione decisioni strategiche
   - Upside da exit

5. "Governance Proposta"
   - Composizione CdA
   - Materie riservate
   - Diritti di veto
   - Clausole di uscita

6. "Timeline Costituzione" - 30 giorni

Italiano professionale, tabelle dettagliate.`
  },
  {
    id: 'option-b-workforequity',
    title: '6. OPZIONE B: Work for Equity Progressivo',
    prompt: (input: StartupInput, result: ScreenerResult) => `
Genera "OPZIONE B: Work for Equity Progressivo" per ${input.nome}.

Questa opzione prevede che il management guadagni equity basata su milestones.

Scrivi:
1. "Struttura Proposta"
   - Fondatori costituiscono al 100%
   - Management guadagna fino a 30% equity
   - Basato su deliverable e milestones

2. "Meccanismo di Maturazione"
   - Tabella milestones con % equity:
     * Costituzione e governance: 5%
     * Chiusura pre-seed €300K: 8%
     * Primi 10 clienti paganti: 5%
     * Revenue €100K: 5%
     * Chiusura seed €1M: 7%
   - Totale: 30% se tutti raggiunti

3. "Vantaggi per i Fondatori"
   - Mantengono controllo iniziale
   - Equity "earned" = allineamento
   - Flessibilità se non funziona

4. "Vantaggi per il Management"
   - Dimostra valore prima di impegnarsi
   - Potenziale upside significativo
   - Exit clean se obiettivi non raggiunti

5. "Governance"
   - Observer rights fino a 10%
   - Board seat da 15%
   - Voto su materie riservate da 20%

6. "Comparazione Opzioni" - tabella A vs B

Italiano professionale.`
  },
  {
    id: 'roadmap',
    title: '7. Roadmap 24 Mesi e Milestones',
    prompt: (input: StartupInput, result: ScreenerResult) => `
Genera "Roadmap 24 Mesi e Milestones" per ${input.nome}.

Settore: ${SETTORI_CONFIG.find(s => s.id === input.verticale)?.label}
Fase attuale: ${input.fase}

Scrivi roadmap dettagliata:

**FASE 1: Foundations (Mesi 1-3)**
- Costituzione società
- Setup governance
- Definizione strategy
- Milestones e KPI

**FASE 2: Pre-Seed & MVP (Mesi 4-6)**
- Raccolta €300K
- MVP development
- Alpha testing
- Primi pilot

**FASE 3: Validazione (Mesi 7-12)**
- Product-market fit
- Primi clienti paganti
- Iterazione prodotto
- €100K revenue target

**FASE 4: Seed & Scale (Mesi 13-18)**
- Raccolta €1M seed
- Team expansion
- Go-to-market
- €500K revenue target

**FASE 5: Growth (Mesi 19-24)**
- Scaling operations
- Espansione mercato
- Series A preparation
- €1M+ revenue target

Per ogni fase includi:
- Obiettivi chiave
- Metriche di successo
- Risorse necessarie
- Owner responsabile

Aggiungi tabella riassuntiva timeline con tutte le milestones.
Italiano professionale.`
  },
  {
    id: 'gtm-strategy',
    title: '8. Strategia Go-to-Market',
    prompt: (input: StartupInput, result: ScreenerResult) => `
Genera "Strategia Go-to-Market" per ${input.nome}.

DATI:
- Settore: ${SETTORI_CONFIG.find(s => s.id === input.verticale)?.label}
- Target: ${input.targetCustomer}
- Business Model: ${BUSINESS_MODEL_LABELS[input.businessModel].label}
- Revenue Model: ${input.revenueModel}

Scrivi:
1. "Segmentazione Mercato"
   - Segmenti prioritari
   - Dimensione per segmento
   - Profilo cliente ideale (ICP)

2. "Posizionamento"
   - Value proposition
   - Differenziazione
   - Messaging chiave

3. "Canali di Acquisizione"
   - Canali primari e secondari
   - CAC stimato per canale
   - Conversion funnel

4. "Strategia Pricing"
   - Modello pricing
   - Tier/pacchetti
   - Confronto competitor

5. "Partnership Strategiche"
   - Partner potenziali
   - Tipo collaborazione
   - Valore per entrambi

6. "Piano Marketing"
   - Attività mesi 1-6
   - Budget allocazione
   - KPI e metriche

7. "Sales Strategy"
   - Processo vendita
   - Team necessario
   - Tools e CRM

Tabelle con numeri e timeline. Italiano professionale.`
  },
  {
    id: 'fundraising-plan',
    title: '9. Piano Fundraising',
    prompt: (input: StartupInput, result: ScreenerResult) => `
Genera "Piano Fundraising" per ${input.nome}.

Fase attuale: ${input.fase}
Settore: ${SETTORI_CONFIG.find(s => s.id === input.verticale)?.label}

Scrivi:
1. "Overview Strategia Fundraising"
   - Totale da raccogliere: €1.3M in 18 mesi
   - Round 1: Pre-seed €300K
   - Round 2: Seed €1M

2. "Pre-Seed Round (€300K)"
   - Valuation: €XXK pre-money
   - Strumento: SAFE / Equity
   - Target investitori: Angels, Family Offices
   - Use of funds breakdown
   - Timeline: 3-4 mesi

3. "Seed Round (€1M)"
   - Valuation: €XXM pre-money
   - Strumento: Equity
   - Target: VC early-stage, Corporate VC
   - Milestones da raggiungere prima
   - Timeline: mese 12-15

4. "Pipeline Investitori"
   - Lista VC italiani ed europei target
   - Angels network
   - Corporate VC settore

5. "Materiali Fundraising"
   - Pitch deck
   - Financial model
   - Data room
   - One-pager

6. "Timeline Dettagliata"
   - Preparazione materiali
   - Outreach
   - Due diligence
   - Closing

7. "Fondi Pubblici e Agevolazioni"
   - Smart&Start
   - Credito d'imposta R&D
   - Fondi regionali
   - Horizon Europe

Tabelle con numeri specifici.`
  },
  {
    id: 'exit-strategy',
    title: '10. Exit Strategy',
    prompt: (input: StartupInput, result: ScreenerResult) => `
Genera "Exit Strategy" per ${input.nome}.

Settore: ${SETTORI_CONFIG.find(s => s.id === input.verticale)?.label}

Scrivi:
1. "Vision Exit a 5 Anni"
   - Obiettivo: acquisizione strategica o IPO
   - Valuation target: €XXM
   - Multiple atteso: XX x revenue

2. "Scenari di Exit"
   
   **Scenario A: Acquisizione Strategica**
   - Acquirenti potenziali (lista 5-10 aziende)
   - Rationale strategico
   - Valuation range
   - Timeline: anno 4-5
   
   **Scenario B: Private Equity**
   - PE funds target
   - Requisiti (revenue, profitability)
   - Valuation
   - Timeline: anno 5-7
   
   **Scenario C: IPO**
   - Mercato target (AIM, Euronext Growth)
   - Requisiti minimi
   - Timeline: anno 6-8

3. "Comparable Exits"
   - Tabella exit recenti nel settore
   - Valuation, acquirente, multiple

4. "Value Drivers per Exit"
   - Cosa aumenta la valuation
   - Metriche chiave
   - IP e asset strategici

5. "Return Analysis"
   - Tabella ritorno per investitori
   - Per round (pre-seed, seed)
   - Multipli attesi

Italiano professionale con tabelle.`
  },
  {
    id: 'services-support',
    title: '11. Servizi e Supporto Offerti dal Team Manageriale',
    prompt: (input: StartupInput, result: ScreenerResult) => `
Genera "Servizi e Supporto Offerti dal Team Manageriale" per ${input.nome}.

Descrivi i servizi che CFO, CMO, CEO offrono:

1. **Servizi CFO**
   - Financial Planning & Analysis
   - Fundraising support
   - Investor relations
   - Governance e compliance
   - Cash flow management
   - Reporting trimestrale
   - Ore/settimana: 10-15h

2. **Servizi CMO**
   - Marketing strategy
   - Brand development
   - Digital marketing
   - Sales enablement
   - Partnership development
   - PR e comunicazione
   - Ore/settimana: 10-15h

3. **Servizi CEO**
   - Strategic planning
   - Stakeholder management
   - Team building
   - Operations oversight
   - Board management
   - Networking e rappresentanza
   - Ore/settimana: 15-20h

4. **Tabella Riepilogativa**
   - Servizio | Owner | Frequenza | Deliverable

5. **Commitment Temporale**
   - Primi 6 mesi: 30-40h/settimana totali
   - Mesi 7-12: 20-30h/settimana
   - Dopo seed: valutazione full-time

6. **Tools e Risorse Incluse**
   - Accesso network
   - Template e framework
   - Introduzioni investitori
   - Mentorship

Italiano professionale.`
  },
  {
    id: 'terms-conditions',
    title: '12. Termini e Condizioni',
    prompt: (input: StartupInput, result: ScreenerResult) => `
Genera "Termini e Condizioni" per la proposta di partnership con ${input.nome}.

Scrivi:
1. **Validità Proposta**
   - Valida per 30 giorni
   - Soggetta a due diligence
   - Non vincolante fino a firma

2. **Condizioni Precedenti**
   - Verifica background fondatori
   - Analisi IP e proprietà intellettuale
   - Validazione dati finanziari
   - Accordo su governance

3. **Patto Parasociale**
   - Clausole standard:
     * Lock-up period
     * Tag-along / Drag-along
     * Right of first refusal
     * Anti-dilution
     * Good/Bad leaver

4. **Confidenzialità**
   - NDA reciproco
   - Protezione informazioni
   - Durata obblighi

5. **Esclusività**
   - Periodo esclusiva: 60 giorni
   - No-shop clause
   - Break-up fee

6. **Governance**
   - Quorum assemblee
   - Materie riservate
   - Diritti di veto
   - Reporting obblighi

7. **Uscita e Risoluzione**
   - Cause di scioglimento
   - Valutazione quote
   - Meccanismo buy-out

Linguaggio legale ma comprensibile.`
  },
  {
    id: 'conclusions-cta',
    title: '13. Conclusioni e Call to Action',
    prompt: (input: StartupInput, result: ScreenerResult) => `
Genera "Conclusioni e Call to Action" per ${input.nome}.

Scrivi:
1. **Riepilogo Opportunità**
   - Perché ${input.nome} è un'opportunità unica
   - Timing di mercato
   - Team complementare
   - Potenziale di crescita

2. **Valore della Partnership**
   - Cosa porta il team manageriale
   - Accelerazione time-to-market
   - Aumento probabilità successo
   - Accesso a network e capitali

3. **Proposta Finale**
   - Riepilogo Opzione A e B
   - Raccomandazione
   - Flessibilità nella struttura

4. **Prossimi Passi**
   1. Call conoscitiva (entro 1 settimana)
   2. Due diligence reciproca (2 settimane)
   3. Negoziazione termini (1 settimana)
   4. Firma accordi (1 settimana)
   5. Kick-off operativo

5. **Contatti**
   - Email
   - Telefono
   - Calendario per booking call

6. **Nota Finale**
   - Messaggio motivazionale
   - Invito a procedere
   - Disponibilità al dialogo

Tono professionale ma entusiasta. Italiano.`
  }
];

export async function POST(request: NextRequest) {
  try {
    const { input, result, section } = await request.json();

    if (!input || !result) {
      return NextResponse.json({ error: 'Missing input or result' }, { status: 400 });
    }

    // Se richiesta singola sezione
    if (section) {
      const sectionConfig = PROPOSAL_SECTIONS.find(s => s.id === section);
      if (!sectionConfig) {
        return NextResponse.json({ error: 'Section not found' }, { status: 404 });
      }

      const content = await generateSection(sectionConfig, input, result);
      return NextResponse.json({ section: sectionConfig.id, title: sectionConfig.title, content });
    }

    // Genera tutte le sezioni
    const sections = [];
    for (const sectionConfig of PROPOSAL_SECTIONS) {
      const content = await generateSection(sectionConfig, input, result);
      sections.push({
        id: sectionConfig.id,
        title: sectionConfig.title,
        content
      });
    }

    return NextResponse.json({ 
      success: true, 
      startupName: input.nome,
      sections 
    });

  } catch (error) {
    console.error('Proposal generation error:', error);
    return NextResponse.json({ error: 'Failed to generate proposal' }, { status: 500 });
  }
}

async function generateSection(
  sectionConfig: typeof PROPOSAL_SECTIONS[0], 
  input: StartupInput, 
  result: ScreenerResult
): Promise<string> {
  const prompt = sectionConfig.prompt(input, result);

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: `Sei un consulente strategico esperto in startup e investimenti. Genera contenuto professionale per un documento di proposta di investimento.

${prompt}

REGOLE DI FORMATTAZIONE (OBBLIGATORIE):
- Scrivi in italiano professionale, tono autorevole ma accessibile
- NON usare MAI emoji, emoticon o simboli speciali (no 🚀💰⚡📊✅★☆ ecc.)
- Usa solo testo ASCII e punteggiatura standard
- Per i rating usa numeri (es. "4/5") invece di simboli stelle
- Ogni heading ## deve stare su una riga a se stante, separato da una riga vuota sopra e sotto
- Ogni tabella deve avere una riga vuota prima e dopo
- Le tabelle devono avere il formato:
  [riga vuota]
  | Colonna1 | Colonna2 |
  |---|---|
  | dato1 | dato2 |
  [riga vuota]
- NON mettere mai heading e tabelle sulla stessa riga
- NON usare --- come separatore nel testo (solo nelle tabelle)
- Sii specifico e quantitativo con numeri reali
- Usa bullet points e liste numerate per i contenuti descrittivi`
      }
    ]
  });

  const textContent = response.content.find(c => c.type === 'text');
  return textContent?.text || '';
}

// GET per ottenere lista sezioni disponibili
export async function GET() {
  return NextResponse.json({
    sections: PROPOSAL_SECTIONS.map(s => ({ id: s.id, title: s.title }))
  });
}
