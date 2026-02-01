// Premium Pitch Deck Configuration

export interface PremiumSection {
  id: string;
  title: string;
  prompt: string;
  maxTokens: number;
}

export interface PremiumDocumentConfig {
  documentTitle: string;
  sections: PremiumSection[];
  totalEstimatedTime: string;
}

export const PITCH_DECK_PREMIUM: PremiumDocumentConfig = {
  documentTitle: 'Pitch Deck Completo - Investor Ready',
  totalEstimatedTime: '2-3 minuti',
  sections: [
    {
      id: 'intro-problem',
      title: 'Cover, Problema e Opportunità',
      maxTokens: 3000,
      prompt: `Genera le prime 4 slide del pitch deck in formato DETTAGLIATO e PROFESSIONALE:

## SLIDE 1: COVER
- **Nome Startup**: [nome]
- **Tagline**: Una frase memorabile che cattura l'essenza (max 10 parole)
- **Visual Suggestion**: Descrivi l'immagine/grafica ideale
- **Contatto**: placeholder per email/website

---

## SLIDE 2: IL PROBLEMA (The Pain Point)

### Headline
Una frase potente che fa sentire il problema

### Il Problema in Numeri
| Statistica | Valore | Fonte |
|------------|--------|-------|
| [Dato 1] | [Valore] | [Fonte credibile] |
| [Dato 2] | [Valore] | [Fonte credibile] |
| [Dato 3] | [Valore] | [Fonte credibile] |

### Chi Soffre Questo Problema
- **Persona 1**: [Ruolo] - [Pain point specifico]
- **Persona 2**: [Ruolo] - [Pain point specifico]

### Il Costo del Problema
- Per le aziende: €[X] all'anno in [perdite/inefficienze]
- Per gli individui: [ore/stress/soldi] persi

### Speaker Notes (60 secondi)
[Script completo per presentare questa slide]

---

## SLIDE 3: LA SOLUZIONE

### One-Liner
[Cosa fate in una frase]

### Come Risolviamo il Problema
\`\`\`
PRIMA (Senza di noi)          →    DOPO (Con noi)
─────────────────────────────────────────────────
[Problema 1]                  →    [Soluzione 1]
[Problema 2]                  →    [Soluzione 2]
[Problema 3]                  →    [Soluzione 3]
\`\`\`

### I 3 Pilastri della Soluzione
1. **[Pilastro 1]**: [Descrizione beneficio, non feature]
2. **[Pilastro 2]**: [Descrizione beneficio, non feature]
3. **[Pilastro 3]**: [Descrizione beneficio, non feature]

### Secret Sauce
Cosa ci rende unici e difficili da copiare

### Speaker Notes (60 secondi)
[Script completo]

---

## SLIDE 4: DEMO / COME FUNZIONA

### User Journey in 4 Step

#### Step 1: [Azione]
- **Cosa fa l'utente**: [descrizione]
- **Cosa succede**: [risultato immediato]
- **Tempo**: [X secondi/minuti]

#### Step 2: [Azione]
- **Cosa fa l'utente**: [descrizione]
- **Cosa succede**: [risultato immediato]

#### Step 3: [Azione]
- **Cosa fa l'utente**: [descrizione]
- **Cosa succede**: [risultato immediato]

#### Step 4: [Risultato Finale]
- **Output**: [cosa ottiene l'utente]
- **Valore**: [beneficio quantificabile]

### Speaker Notes (90 secondi - questa slide è cruciale)
[Script dettagliato per la demo]

Sii SPECIFICO per questa startup. Usa i dati forniti nel contesto.`
    },
    {
      id: 'market-business',
      title: 'Market Size e Business Model',
      maxTokens: 3000,
      prompt: `Genera le slide 5-7 del pitch deck:

## SLIDE 5: MARKET SIZE

### Headline
"Un mercato da €[X]B in crescita del [Y]% annuo"

### TAM - Total Addressable Market
- **Valore**: €[X]B
- **Calcolo**: [Come sei arrivato a questo numero]

### SAM - Serviceable Available Market
- **Valore**: €[X]M
- **Segmento**: [Chi specificamente]

### SOM - Serviceable Obtainable Market (3 anni)
- **Valore**: €[X]M
- **Target realistico**: [X]% del SAM

### Market Size Visualization
\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│  TAM: €[X]B                                                     │
│  ████████████████████████████████████████████████████████████   │
│                                                                 │
│  SAM: €[X]M                                                     │
│  █████████████████                                              │
│                                                                 │
│  SOM: €[X]M (Anno 3)                                            │
│  ██                                                             │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

### Trend di Mercato
| Trend | Impatto | Opportunità per Noi |
|-------|---------|---------------------|
| [Trend 1] | 🔴 Alto | [Come ne beneficiamo] |
| [Trend 2] | 🟠 Medio | [Come ne beneficiamo] |

### Speaker Notes (60 secondi)
[Script completo]

---

## SLIDE 6: BUSINESS MODEL

### Revenue Model
**Modello principale**: [SaaS/Marketplace/Transactional/etc.]

### Pricing Structure
| Piano | Prezzo | Target | % Revenue Mix |
|-------|--------|--------|---------------|
| [Free/Starter] | €0 | [Chi] | 0% (lead gen) |
| [Pro] | €[X]/mese | [Chi] | [Y]% |
| [Enterprise] | €[X]/mese | [Chi] | [Y]% |

### Unit Economics
\`\`\`
┌──────────────────────────────────────────────────────────────┐
│  ARPU (Average Revenue Per User)     │  €[X]/mese           │
│  Gross Margin                        │  [X]%                │
│  CAC (Customer Acquisition Cost)     │  €[X]                │
│  LTV (Lifetime Value)                │  €[X]                │
│  LTV:CAC Ratio                       │  [X]:1 ✓             │
│  Payback Period                      │  [X] mesi            │
└──────────────────────────────────────────────────────────────┘
\`\`\`

### Speaker Notes (60 secondi)
[Script completo]

---

## SLIDE 7: TRACTION

### Headline
"[Metrica più impressionante]"

### Traction Metrics Dashboard
| Metrica | Valore Attuale | Growth | Periodo |
|---------|----------------|--------|---------|
| [Metrica 1] | [Valore] | +[X]% | MoM |
| [Metrica 2] | [Valore] | +[X]% | MoM |
| [Metrica 3] | [Valore] | +[X]% | MoM |

### Milestones Raggiunti
- ✅ [Milestone 1] - [Data]
- ✅ [Milestone 2] - [Data]
- 🎯 [Prossimo milestone] - [Target data]

### Social Proof
- "[Quote cliente]" - [Nome, Ruolo, Azienda]

### Speaker Notes (60 secondi)
[Script completo]

Sii SPECIFICO e REALISTICO per questa startup.`
    },
    {
      id: 'competition-gtm',
      title: 'Competition e Go-to-Market',
      maxTokens: 3000,
      prompt: `Genera le slide 8-9 del pitch deck:

## SLIDE 8: COMPETITIVE LANDSCAPE

### Positioning Matrix
\`\`\`
                            QUALITÀ/COMPLETEZZA
                                    ▲
                           Alta     │     ★ [NOI]
              ┌─────────────────────┼─────────────────────┐
              │   ● [Competitor 1]  │   ● [Competitor 2]  │
    PREZZO ───┼─────────────────────┼─────────────────────┼─── PREZZO
    Basso     │   ● [Competitor 3]  │   ● [Competitor 4]  │    Alto
              └─────────────────────┼─────────────────────┘
                           Bassa    │
                            SEMPLICITÀ D'USO
\`\`\`

### Competitor Analysis
| Competitor | Forza Principale | Debolezza (Nostra Opportunità) |
|------------|------------------|--------------------------------|
| [Competitor 1] | [Forza] | [Debolezza] |
| [Competitor 2] | [Forza] | [Debolezza] |
| [Competitor 3] | [Forza] | [Debolezza] |

### Feature Comparison
| Feature | Noi | Comp 1 | Comp 2 | Comp 3 |
|---------|-----|--------|--------|--------|
| [Feature 1] | ✅ | ❌ | ⚠️ | ❌ |
| [Feature 2] | ✅ | ✅ | ❌ | ❌ |
| [Feature 3] | ✅ | ❌ | ❌ | ✅ |
| **Prezzo** | €[X] | €[Y] | €[Z] | €[W] |

### I Nostri Differenziatori
1. **[Differenziatore 1]**: [Perché è difendibile]
2. **[Differenziatore 2]**: [Perché è difendibile]
3. **[Differenziatore 3]**: [Perché è difendibile]

### Speaker Notes (60 secondi)
[Script completo]

---

## SLIDE 9: GO-TO-MARKET STRATEGY

### GTM Funnel
\`\`\`
AWARENESS → ACQUISITION → ACTIVATION → REVENUE → RETENTION
   │            │            │           │          │
   ▼            ▼            ▼           ▼          ▼
[Canali]    [Landing]    [Trial]     [Paid]    [Expand]
\`\`\`

### Canali di Acquisizione Prioritari

#### Fase 1: Validation (Mesi 1-3)
| Canale | Budget | CAC Target | Volume |
|--------|--------|------------|--------|
| [Canale 1] | €[X] | €[Y] | [Z] leads |
| [Canale 2] | €[X] | €[Y] | [Z] leads |

#### Fase 2: Growth (Mesi 4-6)
| Canale | Budget | CAC Target | Volume |
|--------|--------|------------|--------|
| [Canale 3] | €[X] | €[Y] | [Z] leads |

### Sales Motion
- **Self-serve** ([X]% clienti): [Descrizione]
- **Sales-assisted** ([X]% clienti): [Descrizione]

### Early Adopter Strategy
1. [Strategia per primi 100 clienti]
2. [Come creare urgenza/FOMO]

### Speaker Notes (60 secondi)
[Script completo]

Sii SPECIFICO per questa startup e il suo target.`
    },
    {
      id: 'team-financials-ask',
      title: 'Team, Financials e The Ask',
      maxTokens: 3000,
      prompt: `Genera le slide finali 10-12 del pitch deck:

## SLIDE 10: TEAM

### Founder(s)

#### [Nome Founder 1] - CEO
**Background Rilevante:**
- [Esperienza 1 rilevante per questa startup]
- [Esperienza 2 rilevante]
- [Achievement notevole]

**Perché è la persona giusta:**
[1-2 frasi sul perché questa persona può risolvere questo problema]

### Team Unfair Advantage
\`\`\`
┌────────────────────────────────────────────────────────────┐
│  ✓ [Vantaggio 1: es. "10 anni nel settore X"]              │
│  ✓ [Vantaggio 2: es. "Network di 500+ decision maker"]     │
│  ✓ [Vantaggio 3: es. "Competenze tecniche uniche"]         │
└────────────────────────────────────────────────────────────┘
\`\`\`

### Hiring Plan
| Ruolo | Timeline | Priorità |
|-------|----------|----------|
| [Ruolo 1] | Q1 2026 | 🔴 Alta |
| [Ruolo 2] | Q2 2026 | 🟠 Media |

### Speaker Notes (60 secondi)
[Script completo]

---

## SLIDE 11: FINANCIAL PROJECTIONS

### 3-Year Projections
\`\`\`
Revenue (€)
    │
€2M ├─────────────────────────────────────────────●
    │                                         ●
€1M ├─────────────────────────────────────●
    │                              ●
€500K├──────────────────────────●
    │                   ●
€100K├──────────────●
    │        ●
€0  └──●───────────────────────────────────────────
       Q1   Q2   Q3   Q4   Q1   Q2   Q3   Q4   Q1
       ├────── Y1 ──────┤├────── Y2 ──────┤├─ Y3
\`\`\`

### Detailed Projections Table
| Metrica | Anno 1 | Anno 2 | Anno 3 |
|---------|--------|--------|--------|
| **Revenue** | €[X]K | €[X]K | €[X]M |
| **Clienti Paganti** | [X] | [X] | [X] |
| **MRR (fine anno)** | €[X]K | €[X]K | €[X]K |
| **Gross Margin** | [X]% | [X]% | [X]% |
| **Burn Rate/mese** | €[X]K | €[X]K | €[X]K |
| **Team Size** | [X] | [X] | [X] |

### Key Assumptions
1. [Assumption 1 e perché è realistica]
2. [Assumption 2 e perché è realistica]

### Speaker Notes (60 secondi)
[Script completo]

---

## SLIDE 12: THE ASK

### What We're Raising
\`\`\`
┌──────────────────────────────────────────────────────────────────┐
│                     ROUND: [PRE-SEED/SEED]                        │
│                        €[AMOUNT]                                  │
│                 Valuation: €[X]M pre-money                        │
└──────────────────────────────────────────────────────────────────┘
\`\`\`

### Use of Funds
| Area | % | Amount | Obiettivo |
|------|---|--------|-----------|
| 👥 Team | [X]% | €[X]K | [Hire specifici] |
| 📈 Growth | [X]% | €[X]K | [CAC, canali] |
| 🛠️ Product | [X]% | €[X]K | [Features] |
| 💼 Operations | [X]% | €[X]K | [Infra, legal] |

### Use of Funds Visualization
\`\`\`
    Team [████████████████░░░░] 40%
  Growth [████████████░░░░░░░░] 30%
 Product [████████░░░░░░░░░░░░] 20%
     Ops [████░░░░░░░░░░░░░░░░] 10%
\`\`\`

### Milestones con Questi Fondi (18 mesi)
| Milestone | Target | Timeline |
|-----------|--------|----------|
| ✅ [Milestone 1] | [Metrica target] | Mese 6 |
| ✅ [Milestone 2] | [Metrica target] | Mese 12 |
| ✅ [Milestone 3] | [Metrica target] | Mese 18 |

### Why Now?
1. **[Motivo 1]**: [Perché questo è il momento giusto]
2. **[Motivo 2]**: [Momentum/opportunità]

### Contact
📧 [email] | 🌐 [website]

### Speaker Notes (60 secondi)
[Script completo - questa è la slide più importante]

---

## APPENDIX (Bonus)

### A: Product Roadmap (Q1-Q4)
### B: Customer Case Study
### C: Technical Architecture

Sii SPECIFICO e REALISTICO. Usa i dati della startup forniti.`
    }
  ]
};
