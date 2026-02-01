// Premium Business Plan Configuration

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

// Business Plan Premium - utilizzato come base per executive summary esteso
export const BUSINESS_PLAN_PREMIUM: PremiumDocumentConfig = {
  documentTitle: 'Business Plan Completo',
  totalEstimatedTime: '3-4 minuti',
  sections: [
    {
      id: 'executive-market',
      title: 'Executive Summary e Mercato',
      maxTokens: 3500,
      prompt: `Genera un Business Plan PROFESSIONALE - Parte 1:

# BUSINESS PLAN

## [NOME STARTUP]

**Versione:** 1.0  
**Data:** Febbraio 2026  
**Confidenziale**

---

## 📋 INDICE

1. Executive Summary
2. Vision e Mission
3. Analisi del Mercato
4. Competitor Analysis
5. Prodotto e Tecnologia
6. Business Model
7. Go-to-Market Strategy
8. Team e Organizzazione
9. Proiezioni Finanziarie
10. Rischi e Mitigazioni
11. Funding e Milestones

---

## 1. EXECUTIVE SUMMARY

### Il Problema
[Descrizione approfondita del problema in 3-4 paragrafi]

La creazione di [prodotto/servizio nel settore] richiede:
- **[Challenge 1]**: [descrizione dettagliata]
- **[Challenge 2]**: [descrizione dettagliata]
- **[Challenge 3]**: [descrizione dettagliata]

[Target] hanno bisogno di [soluzione] ma non hanno [risorse/competenze/tempo] per [azione].

### La Soluzione
**[Nome Startup]** è [descrizione one-liner]:

1. **[Step 1]** → [Risultato]
2. **[Step 2]** → [Risultato]
3. **[Step 3]** → [Risultato]
4. **[Step 4]** → [Risultato finale]

**Da [input] a [output] in [tempo], senza [barriera rimossa].**

### Opportunità di Mercato
| Metrica | Valore |
|---------|--------|
| TAM (Total Addressable Market) | €[X]B |
| SAM (Serviceable Available Market) | €[X]M |
| SOM (Serviceable Obtainable Market) | €[X]M (3 anni) |
| CAGR del settore | [X]% |

### Modello di Business
- **[Tipo]** con [caratteristica]
- **Margine lordo**: [X]%
- **LTV:CAC target**: [X]:1

### Richiesta di Investimento
| Round | Importo | Valutazione | Uso Fondi |
|-------|---------|-------------|-----------|
| Pre-Seed | €[X]K | €[X]M | [Obiettivo] |
| Seed | €[X]K | €[X]M | [Obiettivo] |

---

## 2. VISION E MISSION

### Vision
> *"[Visione a lungo termine - cosa cambierà nel mondo grazie a voi]"*

### Mission
[Mission statement - come realizzerete la vision]

### Valori Fondamentali

| Valore | Descrizione |
|--------|-------------|
| **[Valore 1]** | [Descrizione] |
| **[Valore 2]** | [Descrizione] |
| **[Valore 3]** | [Descrizione] |
| **[Valore 4]** | [Descrizione] |

### Obiettivi a 3 Anni

\`\`\`
Anno 1 (2026):
├── [X] utenti registrati
├── [X] MAU (Monthly Active Users)
├── €[X]K MRR
└── Break-even operativo

Anno 2 (2027):
├── [X] utenti registrati
├── [X] MAU
├── €[X]K MRR
└── Espansione [mercato/prodotto]

Anno 3 (2028):
├── [X] utenti registrati
├── [X] MAU
├── €[X]M MRR
└── Leader mercato [segmento]
\`\`\`

---

## 3. ANALISI DEL MERCATO

### 3.1 Dimensione del Mercato

\`\`\`
┌────────────────────────────────────────────────────────────────┐
│                    MARKET SIZE BREAKDOWN                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  TAM: €[X]B                                                    │
│  ████████████████████████████████████████████████████████████  │
│  ([Descrizione mercato totale])                                │
│                                                                │
│  SAM: €[X]M                                                    │
│  █████████████████                                             │
│  ([Segmento specifico])                                        │
│                                                                │
│  SOM: €[X]M (Anno 3)                                           │
│  ██                                                            │
│  ([X]% SAM - Target realistico)                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
\`\`\`

### 3.2 Trend di Mercato

| Trend | Impatto | Opportunità |
|-------|---------|-------------|
| **[Trend 1]** | 🔴 Alto | [Descrizione opportunità] |
| **[Trend 2]** | 🔴 Alto | [Descrizione opportunità] |
| **[Trend 3]** | 🟠 Medio | [Descrizione opportunità] |
| **[Trend 4]** | 🟠 Medio | [Descrizione opportunità] |

### 3.3 Driver di Crescita

1. **[Driver 1]** → [Impatto quantificato]
2. **[Driver 2]** → [Impatto quantificato]
3. **[Driver 3]** → [Impatto quantificato]
4. **[Driver 4]** → [Impatto quantificato]

### 3.4 Target Market Segmentation

| Segmento | Dimensione | Priorità | Caratteristiche |
|----------|------------|----------|-----------------|
| [Segmento 1] | €[X]M | 🔴 Alta | [Descrizione] |
| [Segmento 2] | €[X]M | 🟠 Media | [Descrizione] |
| [Segmento 3] | €[X]M | 🟡 Bassa | [Descrizione] |

Sii SPECIFICO per questa startup.`
    },
    {
      id: 'competitor-product',
      title: 'Competitor e Prodotto',
      maxTokens: 3500,
      prompt: `Continua il Business Plan - Parte 2:

## 4. COMPETITOR ANALYSIS

### 4.1 Mappa Competitiva

\`\`\`
                        QUALITÀ OUTPUT
                             ▲
                    Alta     │     ★ [NOI]
                             │        (target)
         ┌───────────────────┼───────────────────┐
         │   [Comp 1] ●      │     ● [Comp 2]    │
         │                   │                   │
         │   [Comp 3] ●      │     ● [Comp 4]    │
   ──────┼───────────────────┼───────────────────┼──────▶
  Basso  │                   │                   │  Alto
  PREZZO │   [Comp 5] ●      │                   │ PREZZO
         │                   │     ● [Comp 6]    │
         │                   │                   │
         └───────────────────┼───────────────────┘
                    Bassa    │
                             │
                     FACILITÀ D'USO
\`\`\`

### 4.2 Competitor Matrix Dettagliata

| Competitor | Prezzo | Target | Pro | Contro | Threat |
|------------|--------|--------|-----|--------|--------|
| **[Comp 1]** | €[X]/mo | [Target] | [Pro] | [Contro] | 🔴 Alto |
| **[Comp 2]** | €[X]/mo | [Target] | [Pro] | [Contro] | 🟠 Medio |
| **[Comp 3]** | €[X]/mo | [Target] | [Pro] | [Contro] | 🟠 Medio |
| **[Comp 4]** | €[X]/mo | [Target] | [Pro] | [Contro] | 🟡 Basso |
| **[Comp 5]** | €[X]/mo | [Target] | [Pro] | [Contro] | 🟡 Basso |

### 4.3 Feature Comparison

| Feature | [Noi] | [Comp 1] | [Comp 2] | [Comp 3] |
|---------|-------|----------|----------|----------|
| [Feature 1] | ✅ | ❌ | ⚠️ | ❌ |
| [Feature 2] | ✅ | ✅ | ❌ | ❌ |
| [Feature 3] | ✅ | ❌ | ✅ | ⚠️ |
| [Feature 4] | ✅ | ⚠️ | ❌ | ❌ |
| [Feature 5] | ✅ | ❌ | ❌ | ✅ |
| **Prezzo base** | €[X] | €[Y] | €[Z] | €[W] |
| **Facilità d'uso** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |

### 4.4 Vantaggi Competitivi

| Vantaggio | Descrizione | Difendibilità |
|-----------|-------------|---------------|
| **[Vantaggio 1]** | [Descrizione] | 🔴 Alta |
| **[Vantaggio 2]** | [Descrizione] | 🟠 Media |
| **[Vantaggio 3]** | [Descrizione] | 🔴 Alta |

---

## 5. PRODOTTO E TECNOLOGIA

### 5.1 Descrizione Prodotto

[Descrizione dettagliata del prodotto - 2-3 paragrafi]

### 5.2 Architettura Tecnica

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                         ARCHITETTURA                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│   │  Frontend   │────▶│   Backend   │────▶│  Database   │       │
│   │  [Tech]     │     │   [Tech]    │     │   [Tech]    │       │
│   └─────────────┘     └──────┬──────┘     └─────────────┘       │
│                              │                                   │
│                              ▼                                   │
│                    ┌─────────────────┐                          │
│                    │ External APIs   │                          │
│                    │ [API 1, API 2]  │                          │
│                    └─────────────────┘                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

### 5.3 Stack Tecnologico

| Layer | Tecnologia | Motivazione |
|-------|------------|-------------|
| **Frontend** | [Tech] | [Perché] |
| **Backend** | [Tech] | [Perché] |
| **Database** | [Tech] | [Perché] |
| **Infrastructure** | [Tech] | [Perché] |
| **AI/ML** | [Tech] | [Perché] |

### 5.4 Product Roadmap

| Fase | Timeline | Features | Obiettivo |
|------|----------|----------|-----------|
| **MVP** | Q1 2026 | [Feature 1, 2, 3] | Validazione |
| **v1.0** | Q2 2026 | [Feature 4, 5] | Product-market fit |
| **v2.0** | Q3-Q4 2026 | [Feature 6, 7, 8] | Scale |
| **v3.0** | 2027 | [Feature 9, 10] | Espansione |

### 5.5 IP e Proprietà Intellettuale

| Asset | Status | Protezione |
|-------|--------|------------|
| Brand/Nome | [Status] | Marchio registrato |
| Tecnologia core | [Status] | Trade secret |
| Algoritmi | [Status] | Copyright |
| Brevetti | [Status] | [Se applicabile] |

Sii SPECIFICO per questa startup.`
    },
    {
      id: 'business-model-gtm',
      title: 'Business Model e Go-to-Market',
      maxTokens: 3500,
      prompt: `Continua il Business Plan - Parte 3:

## 6. BUSINESS MODEL

### 6.1 Revenue Model

**Modello principale:** [SaaS/Marketplace/Transactional/etc.]

[Descrizione dettagliata di come guadagnate - 2 paragrafi]

### 6.2 Struttura Pricing

| Piano | Prezzo | Target | Features |
|-------|--------|--------|----------|
| **Free** | €0 | [Chi] | [Features base] |
| **[Pro]** | €[X]/mese | [Chi] | [Features pro] |
| **[Business]** | €[X]/mese | [Chi] | [Features business] |
| **Enterprise** | Custom | [Chi] | [Features enterprise] |

### 6.3 Revenue Streams

| Stream | % Revenue (Y3) | Descrizione |
|--------|----------------|-------------|
| [Stream 1] | [X]% | [Descrizione] |
| [Stream 2] | [X]% | [Descrizione] |
| [Stream 3] | [X]% | [Descrizione] |

### 6.4 Unit Economics

\`\`\`
┌──────────────────────────────────────────────────────────────┐
│                      UNIT ECONOMICS                           │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ARPU (Monthly)              €[X]                            │
│  ─────────────────────────────────────────────────           │
│  Gross Margin                [X]%                            │
│  ─────────────────────────────────────────────────           │
│  CAC                         €[X]                            │
│  ─────────────────────────────────────────────────           │
│  LTV                         €[X]                            │
│  ─────────────────────────────────────────────────           │
│  LTV:CAC Ratio               [X]:1                           │
│  ─────────────────────────────────────────────────           │
│  Payback Period              [X] mesi                        │
│  ─────────────────────────────────────────────────           │
│  Monthly Churn               [X]%                            │
│                                                               │
└──────────────────────────────────────────────────────────────┘
\`\`\`

---

## 7. GO-TO-MARKET STRATEGY

### 7.1 GTM Overview

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                     GO-TO-MARKET FUNNEL                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   AWARENESS     →    ACQUISITION   →    ACTIVATION              │
│   ┌─────────┐        ┌─────────┐        ┌─────────┐             │
│   │ Content │───────▶│ Landing │───────▶│  Trial  │             │
│   │ + Ads   │        │  Page   │        │         │             │
│   └─────────┘        └─────────┘        └─────────┘             │
│                                              │                   │
│                         ┌────────────────────┘                   │
│                         ▼                                        │
│   REVENUE        ←    RETENTION                                 │
│   ┌─────────┐        ┌─────────┐                                │
│   │  Paid   │◀───────│ Onboard │                                │
│   │  Plan   │        │ + Value │                                │
│   └─────────┘        └─────────┘                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

### 7.2 Canali di Acquisizione

#### Fase 1: Validation (Mesi 1-3)
| Canale | Budget | CAC Target | Conversion |
|--------|--------|------------|------------|
| [Canale 1] | €[X] | €[Y] | [Z]% |
| [Canale 2] | €[X] | €[Y] | [Z]% |
| [Canale 3] | €[X] | €[Y] | [Z]% |

#### Fase 2: Growth (Mesi 4-8)
| Canale | Budget | CAC Target | Conversion |
|--------|--------|------------|------------|
| [Canale 4] | €[X] | €[Y] | [Z]% |
| [Canale 5] | €[X] | €[Y] | [Z]% |

#### Fase 3: Scale (Mesi 9-12)
| Canale | Budget | CAC Target | Conversion |
|--------|--------|------------|------------|
| [Canale 6] | €[X] | €[Y] | [Z]% |
| [Canale 7] | €[X] | €[Y] | [Z]% |

### 7.3 Sales Motion

| Motion | % Clienti | Descrizione | CAC |
|--------|-----------|-------------|-----|
| **Self-serve** | [X]% | [Descrizione] | €[X] |
| **Sales-assisted** | [X]% | [Descrizione] | €[X] |
| **Enterprise** | [X]% | [Descrizione] | €[X] |

### 7.4 Content Strategy

| Tipo | Frequenza | Canale | Obiettivo |
|------|-----------|--------|-----------|
| Blog post | [X]/mese | Website | SEO, authority |
| LinkedIn | [X]/settimana | LinkedIn | Brand awareness |
| Newsletter | [X]/mese | Email | Nurturing |
| Webinar | [X]/mese | [Platform] | Lead generation |

### 7.5 Partnership Strategy

| Partner Type | Esempi | Valore |
|--------------|--------|--------|
| **Integrations** | [Partner 1, 2] | [Valore] |
| **Resellers** | [Partner 3, 4] | [Valore] |
| **Co-marketing** | [Partner 5, 6] | [Valore] |

Sii SPECIFICO per questa startup.`
    },
    {
      id: 'team-financials-risks',
      title: 'Team, Financials e Rischi',
      maxTokens: 3500,
      prompt: `Continua il Business Plan - Parte 4:

## 8. TEAM E ORGANIZZAZIONE

### 8.1 Founding Team

#### [Nome Founder 1] - CEO
**Background:**
- [Esperienza 1]
- [Esperienza 2]
- [Esperienza 3]

**Perché è la persona giusta:**
[Descrizione 2-3 righe]

**LinkedIn:** [link]

#### [Nome Founder 2] - CTO (se presente)
**Background:**
- [Esperienza 1]
- [Esperienza 2]

**Perché è la persona giusta:**
[Descrizione]

### 8.2 Team Unfair Advantages

\`\`\`
┌────────────────────────────────────────────────────────────┐
│                    PERCHÉ NOI VINCIAMO                      │
├────────────────────────────────────────────────────────────┤
│  ✓ [Vantaggio 1]                                           │
│  ✓ [Vantaggio 2]                                           │
│  ✓ [Vantaggio 3]                                           │
│  ✓ [Vantaggio 4]                                           │
└────────────────────────────────────────────────────────────┘
\`\`\`

### 8.3 Hiring Plan

| Ruolo | Q1 | Q2 | Q3 | Q4 | Salary Range |
|-------|----|----|----|----|--------------|
| [Ruolo 1] | ✓ | | | | €[X]-[Y]K |
| [Ruolo 2] | | ✓ | | | €[X]-[Y]K |
| [Ruolo 3] | | | ✓ | | €[X]-[Y]K |
| [Ruolo 4] | | | | ✓ | €[X]-[Y]K |

### 8.4 Org Chart (Target Y1)

\`\`\`
                    ┌─────────────┐
                    │    CEO      │
                    │ [Nome]      │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           │               │               │
    ┌──────┴──────┐ ┌──────┴──────┐ ┌──────┴──────┐
    │    CTO     │ │   Growth    │ │  Operations │
    │  [Nome]    │ │  [Hire Q2]  │ │  [Hire Q4]  │
    └─────────────┘ └─────────────┘ └─────────────┘
\`\`\`

---

## 9. PROIEZIONI FINANZIARIE

### 9.1 Revenue Projections

| Metrica | Anno 1 | Anno 2 | Anno 3 |
|---------|--------|--------|--------|
| **Revenue** | €[X]K | €[X]K | €[X]M |
| **Clienti** | [X] | [X] | [X] |
| **ARPU** | €[X] | €[X] | €[X] |
| **MRR (fine anno)** | €[X]K | €[X]K | €[X]K |
| **ARR** | €[X]K | €[X]M | €[X]M |
| **Growth YoY** | - | [X]% | [X]% |

### 9.2 P&L Summary

| Voce | Anno 1 | Anno 2 | Anno 3 |
|------|--------|--------|--------|
| **Revenue** | €[X]K | €[X]K | €[X]M |
| **COGS** | €[X]K | €[X]K | €[X]K |
| **Gross Profit** | €[X]K | €[X]K | €[X]K |
| **Gross Margin** | [X]% | [X]% | [X]% |
| **S&M** | €[X]K | €[X]K | €[X]K |
| **R&D** | €[X]K | €[X]K | €[X]K |
| **G&A** | €[X]K | €[X]K | €[X]K |
| **EBITDA** | -€[X]K | -€[X]K | €[X]K |
| **EBITDA Margin** | -[X]% | -[X]% | [X]% |

### 9.3 Cash Flow

\`\`\`
Cash (€)
    │
€500K├───────────────────────────────────────────●
    │                                        ●
€300K├─────────────────────────────────●
    │                            ●
€150K├────●─────────────────●
    │     ●             ●
€50K├──────●─────●
    │          ●
 €0 └───────────────────────────────────────────
        Q1  Q2  Q3  Q4  Q1  Q2  Q3  Q4  Q1  Q2
        ├───── Y1 ─────┤├───── Y2 ─────┤├── Y3
\`\`\`

---

## 10. RISCHI E MITIGAZIONI

### 10.1 Risk Matrix

| Rischio | Probabilità | Impatto | Mitigazione |
|---------|-------------|---------|-------------|
| **[Rischio 1]** | 🟠 Media | 🔴 Alto | [Azione mitigazione] |
| **[Rischio 2]** | 🔴 Alta | 🟠 Medio | [Azione mitigazione] |
| **[Rischio 3]** | 🟡 Bassa | 🔴 Alto | [Azione mitigazione] |
| **[Rischio 4]** | 🟠 Media | 🟠 Medio | [Azione mitigazione] |
| **[Rischio 5]** | 🟡 Bassa | 🟠 Medio | [Azione mitigazione] |

### 10.2 Contingency Plans

**Se [Scenario negativo 1]:**
→ [Piano B dettagliato]

**Se [Scenario negativo 2]:**
→ [Piano B dettagliato]

---

## 11. FUNDING E MILESTONES

### 11.1 Funding Ask

| Parametro | Valore |
|-----------|--------|
| **Round** | [Pre-Seed/Seed] |
| **Amount** | €[X] |
| **Valuation** | €[X]M pre-money |
| **Strumento** | [SAFE/Equity] |
| **Min Ticket** | €[X]K |

### 11.2 Use of Funds

\`\`\`
    Team [████████████████░░░░░░░░░░░░░░] 40% - €[X]K
  Growth [████████████░░░░░░░░░░░░░░░░░░] 30% - €[X]K
 Product [████████░░░░░░░░░░░░░░░░░░░░░░] 20% - €[X]K
     Ops [████░░░░░░░░░░░░░░░░░░░░░░░░░░] 10% - €[X]K
\`\`\`

### 11.3 Milestones

| Milestone | Target | Timeline | Funding Trigger |
|-----------|--------|----------|-----------------|
| [Milestone 1] | [Metrica] | Mese 6 | ☐ |
| [Milestone 2] | [Metrica] | Mese 12 | ☐ |
| [Milestone 3] | [Metrica] | Mese 18 | Seed ready |

### 11.4 Exit Strategy

| Scenario | Timeline | Valuation Range |
|----------|----------|-----------------|
| **M&A - Strategic** | 5-7 anni | €[X]-[Y]M |
| **M&A - Financial** | 5-7 anni | €[X]-[Y]M |
| **IPO** | 7-10 anni | €[X]M+ |

**Potenziali Acquirer:**
- [Azienda 1] - [Perché avrebbe senso]
- [Azienda 2] - [Perché avrebbe senso]
- [Azienda 3] - [Perché avrebbe senso]

---

## CONTATTI

📧 **Email:** [email]
🌐 **Website:** [website]
📱 **Telefono:** [telefono]
💼 **LinkedIn:** [link]

---

*Business Plan generato da Startup Arsenal*

Sii SPECIFICO per questa startup.`
    }
  ]
};
