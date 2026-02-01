// Premium Executive Summary Configuration

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

export const EXECUTIVE_SUMMARY_PREMIUM: PremiumDocumentConfig = {
  documentTitle: 'Executive Summary Professionale',
  totalEstimatedTime: '2-3 minuti',
  sections: [
    {
      id: 'overview-problem',
      title: 'Overview e Problema',
      maxTokens: 3000,
      prompt: `Genera un Executive Summary PROFESSIONALE - Parte 1:

# EXECUTIVE SUMMARY

## [NOME STARTUP]

**Versione:** 1.0  
**Data:** Febbraio 2026  
**Confidenziale**

---

## 📋 INDICE

1. Executive Overview
2. Il Problema
3. La Soluzione
4. Opportunità di Mercato
5. Business Model
6. Traction e Milestones
7. Team
8. Financial Projections
9. The Ask

---

## 1. EXECUTIVE OVERVIEW

### Sintesi in 30 Secondi

**Chi siamo:** [1 frase]

**Cosa facciamo:** [1 frase che spiega il prodotto/servizio]

**Per chi:** [Target specifico]

**Perché ora:** [1 frase sul timing]

### Highlights
| Metrica | Valore |
|---------|--------|
| Mercato (TAM) | €[X]B |
| Mercato (SOM 3Y) | €[X]M |
| Revenue Model | [Tipo] |
| Ask | €[X] |
| Valuation | €[X]M pre-money |

---

## 2. IL PROBLEMA

### Il Problema che Risolviamo

[Descrizione dettagliata del problema in 3-4 paragrafi. Includi:
- Chi soffre questo problema
- Quanto costa (in tempo, denaro, frustrazione)
- Perché le soluzioni attuali non funzionano
- Citazioni o dati che validano il problema]

### Il Problema in Numeri

| Statistica | Valore | Implicazione |
|------------|--------|--------------|
| [Stat 1] | [Valore] | [Cosa significa per il target] |
| [Stat 2] | [Valore] | [Cosa significa per il target] |
| [Stat 3] | [Valore] | [Cosa significa per il target] |

### Chi Soffre Questo Problema

#### Persona 1: [Nome/Ruolo]
- **Profilo:** [Descrizione]
- **Pain Point Principale:** [Qual è il problema più grande]
- **Conseguenze:** [Cosa succede se non risolve]
- **Budget:** €[X]/anno per soluzioni attuali

#### Persona 2: [Nome/Ruolo]
- **Profilo:** [Descrizione]
- **Pain Point Principale:** [Problema]
- **Conseguenze:** [Impatto]

### Perché le Soluzioni Attuali Falliscono

| Soluzione Attuale | Perché Non Funziona |
|-------------------|---------------------|
| [Soluzione 1] | [Limite] |
| [Soluzione 2] | [Limite] |
| [Soluzione 3] | [Limite] |

---

## 3. LA SOLUZIONE

### Come Risolviamo il Problema

[Descrizione dettagliata della soluzione in 2-3 paragrafi]

### I 3 Pilastri della Nostra Soluzione

#### Pilastro 1: [Nome]
[Descrizione dettagliata di come questo aspetto risolve parte del problema]

#### Pilastro 2: [Nome]
[Descrizione dettagliata]

#### Pilastro 3: [Nome]
[Descrizione dettagliata]

### Prima vs Dopo

| Aspetto | Prima (Senza di Noi) | Dopo (Con Noi) |
|---------|----------------------|----------------|
| Tempo | [X ore/settimana] | [Y ore/settimana] |
| Costo | €[X]/mese | €[Y]/mese |
| Risultato | [Outcome negativo] | [Outcome positivo] |
| Esperienza | [Frustrante] | [Semplice] |

### Il Nostro "Secret Sauce"

[Cosa ci rende unici e difficili da replicare - 1-2 paragrafi]

Sii SPECIFICO per questa startup.`
    },
    {
      id: 'market-business',
      title: 'Mercato e Business Model',
      maxTokens: 3000,
      prompt: `Continua l'Executive Summary - Parte 2:

## 4. OPPORTUNITÀ DI MERCATO

### Dimensione del Mercato

#### TAM - Total Addressable Market
**€[X] Miliardi**

[Spiegazione di come è stato calcolato e cosa include]

#### SAM - Serviceable Available Market
**€[X] Milioni**

[Segmento specifico che possiamo servire e perché]

#### SOM - Serviceable Obtainable Market (3 anni)
**€[X] Milioni**

[Target realistico e come lo raggiungeremo]

### Market Size Visualization
\`\`\`
┌────────────────────────────────────────────────────────────────┐
│  TAM: €[X]B                                                    │
│  ████████████████████████████████████████████████████████████  │
│                                                                │
│  SAM: €[X]M                                                    │
│  █████████████████                                             │
│                                                                │
│  SOM: €[X]M (Anno 3)                                           │
│  ██                                                            │
└────────────────────────────────────────────────────────────────┘
\`\`\`

### Trend di Mercato

| Trend | Descrizione | Impatto su di Noi |
|-------|-------------|-------------------|
| [Trend 1] | [Descrizione] | 🔴 Alto - [Come ne beneficiamo] |
| [Trend 2] | [Descrizione] | 🔴 Alto - [Come ne beneficiamo] |
| [Trend 3] | [Descrizione] | 🟠 Medio - [Come ne beneficiamo] |

### Timing: Perché Adesso?

1. **[Motivo 1]:** [Spiegazione]
2. **[Motivo 2]:** [Spiegazione]
3. **[Motivo 3]:** [Spiegazione]

---

## 5. BUSINESS MODEL

### Revenue Model

**Modello Principale:** [SaaS/Marketplace/Transaction/etc.]

[Descrizione di come guadagniamo in 2-3 paragrafi]

### Struttura Pricing

| Piano | Prezzo | Target | Features Incluse |
|-------|--------|--------|------------------|
| [Free/Starter] | €0 | [Chi] | [Features base] |
| [Pro] | €[X]/mese | [Chi] | [Features pro] |
| [Enterprise] | €[X]/mese | [Chi] | [Features enterprise] |

### Unit Economics

\`\`\`
┌──────────────────────────────────────────────────────────────┐
│                      UNIT ECONOMICS                           │
├──────────────────────────────────────────────────────────────┤
│  ARPU (Monthly)              €[X]                            │
│  Customer Acquisition Cost   €[X]                            │
│  Lifetime Value (LTV)        €[X]                            │
│  LTV:CAC Ratio               [X]:1  [✓ if >3:1]              │
│  Payback Period              [X] mesi                        │
│  Gross Margin                [X]%                            │
│  Monthly Churn               [X]%                            │
└──────────────────────────────────────────────────────────────┘
\`\`\`

### Formula Revenue

\`\`\`
Revenue Mensile = Clienti Attivi × ARPU
                = [X] × €[Y] = €[Z]

Revenue Annuale (ARR) = MRR × 12
                      = €[X]K × 12 = €[Y]K
\`\`\`

### Scalabilità

[Spiegazione di come il business scala - margini migliorano con volume?]

Sii SPECIFICO per questa startup.`
    },
    {
      id: 'traction-team-ask',
      title: 'Traction, Team e The Ask',
      maxTokens: 3000,
      prompt: `Continua l'Executive Summary - Parte 3:

## 6. TRACTION E MILESTONES

### Metriche Attuali

| Metrica | Valore | Trend |
|---------|--------|-------|
| [Metrica 1] | [Valore] | [+X% MoM] |
| [Metrica 2] | [Valore] | [+X% MoM] |
| [Metrica 3] | [Valore] | [+X% MoM] |

### Milestones Raggiunti

#### 2025
- ✅ [Milestone 1] - [Data]
- ✅ [Milestone 2] - [Data]
- ✅ [Milestone 3] - [Data]

#### 2026 (Target)
- 🎯 [Milestone 4] - Q1
- 🎯 [Milestone 5] - Q2
- 🎯 [Milestone 6] - Q4

### Growth Graph
\`\`\`
[Metrica Principale]
       │
  [Y3] ├────────────────────────────────────●
       │                               ●
  [Y2] ├──────────────────────────●
       │                     ●
  [Y1] ├────────────────●
       │           ●
   [0] └──●────────────────────────────────────
          M1  M2  M3  M4  M5  M6  M7  M8  M9
\`\`\`

### Social Proof

> "[Testimonial cliente 1]"
> — **[Nome]**, [Ruolo], [Azienda]

> "[Testimonial cliente 2]"
> — **[Nome]**, [Ruolo], [Azienda]

---

## 7. TEAM

### Fondatori

#### [Nome] - CEO/Founder
**Background:**
- [Esperienza rilevante 1]
- [Esperienza rilevante 2]
- [Achievement notevole]

**Perché è la persona giusta:**
[1-2 frasi che collegano l'esperienza al problema]

### Team Strength
\`\`\`
┌────────────────────────────────────────────────────────────┐
│  ✓ [Vantaggio 1 del team]                                  │
│  ✓ [Vantaggio 2 del team]                                  │
│  ✓ [Vantaggio 3 del team]                                  │
│  ✓ [Vantaggio 4 del team]                                  │
└────────────────────────────────────────────────────────────┘
\`\`\`

### Hiring Plan (12 mesi)
| Ruolo | Q1 | Q2 | Q3 | Q4 |
|-------|----|----|----|----|
| [Ruolo 1] | ✓ | | | |
| [Ruolo 2] | | ✓ | | |
| [Ruolo 3] | | | ✓ | |

---

## 8. FINANCIAL PROJECTIONS

### Proiezioni 3 Anni

| Metrica | Anno 1 | Anno 2 | Anno 3 |
|---------|--------|--------|--------|
| **Revenue** | €[X]K | €[X]K | €[X]M |
| **Clienti** | [X] | [X] | [X] |
| **MRR (fine anno)** | €[X]K | €[X]K | €[X]K |
| **ARR** | €[X]K | €[X]M | €[X]M |
| **Gross Margin** | [X]% | [X]% | [X]% |
| **Team Size** | [X] | [X] | [X] |
| **Burn Rate** | €[X]K/mo | €[X]K/mo | €[X]K/mo |
| **EBITDA** | -€[X]K | -€[X]K | +€[X]K |

### Revenue Projection Graph
\`\`\`
Revenue (€)
    │
€2M ├─────────────────────────────────────●
    │                                 ●
€1M ├─────────────────────────────●
    │                        ●
€500K├────────────────────●
    │               ●
€100K├──────────●
    │     ●
 €0 └──●──────────────────────────────────────
       Q1  Q2  Q3  Q4  Q1  Q2  Q3  Q4  Q1  Q2
       ├───── Y1 ─────┤├───── Y2 ─────┤├── Y3
\`\`\`

### Key Assumptions
1. **[Assumption 1]:** [Valore] - [Giustificazione]
2. **[Assumption 2]:** [Valore] - [Giustificazione]
3. **[Assumption 3]:** [Valore] - [Giustificazione]

---

## 9. THE ASK

### Cosa Stiamo Raccogliendo

| Parametro | Valore |
|-----------|--------|
| **Round** | [Pre-Seed/Seed] |
| **Amount** | €[X] |
| **Valuation** | €[X]M pre-money |
| **Strumento** | [SAFE/Equity] |
| **Min Ticket** | €[X]K |

### Use of Funds
\`\`\`
    Team [████████████████░░░░░░░░░░░░░░] 40% - €[X]K
  Growth [████████████░░░░░░░░░░░░░░░░░░] 30% - €[X]K
 Product [████████░░░░░░░░░░░░░░░░░░░░░░] 20% - €[X]K
     Ops [████░░░░░░░░░░░░░░░░░░░░░░░░░░] 10% - €[X]K
\`\`\`

### Milestones con Questi Fondi

| Milestone | Metrica Target | Timeline |
|-----------|----------------|----------|
| [Milestone 1] | [Target] | Mese 6 |
| [Milestone 2] | [Target] | Mese 12 |
| [Milestone 3] | [Target] | Mese 18 |

### Perché Investire Adesso

1. **Early mover advantage:** [Spiegazione]
2. **Termini favorevoli:** [Spiegazione]
3. **Momentum:** [Spiegazione]

---

## CONTATTI

📧 **Email:** [email]
🌐 **Website:** [website]
📱 **Telefono:** [telefono]

---

*Documento generato da Startup Arsenal*

Sii SPECIFICO per questa startup.`
    }
  ]
};
