// Premium Investment Proposal Configuration - Professional Investment Document

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

export const INVESTMENT_PROPOSAL_PREMIUM: PremiumDocumentConfig = {
  documentTitle: 'Proposta di Investimento - Documento Professionale',
  totalEstimatedTime: '2-3 minuti',
  sections: [
    {
      id: 'cover-executive',
      title: 'Cover Page & Executive Summary',
      maxTokens: 3000,
      prompt: `Genera la cover page e l'executive summary della proposta di investimento:

# PROPOSTA DI INVESTIMENTO

## [NOME STARTUP]
**[Tagline della startup in una frase]**

---

### Informazioni Chiave
| Campo | Valore |
|-------|--------|
| **Settore** | [Settore/Vertical] |
| **Stage** | [Pre-seed/Seed/Series A] |
| **Location** | [Città, Paese] |
| **Founded** | [Anno] |
| **Team Size** | [Numero] |

### Investment Highlights
- **Opportunità**: [Frase che cattura l'opportunità]
- **Soluzione**: [Cosa fa la startup in una frase]
- **Mercato**: [TAM/SAM in €]
- **Traction**: [Metriche chiave]
- **Ask**: [Quanto stanno raccogliendo]

---

# EXECUTIVE SUMMARY

## Il Problema
[2-3 frasi che descrivono il problema in modo quantificabile]

## La Soluzione
[2-3 frasi che spiegano come la startup risolve il problema]

## Perché Ora
[2-3 frasi sul timing e le condizioni di mercato favorevoli]

## Risultati Chiave
| Metrica | Valore | Trend |
|---------|--------|-------|
| [Metrica 1] | [Valore] | ↑ [%] |
| [Metrica 2] | [Valore] | ↑ [%] |
| [Metrica 3] | [Valore] | ↑ [%] |

## Valutazione AI
**Score Complessivo: [X]/100**

| Criterio | Score | Valutazione |
|----------|-------|-------------|
| Problema | [X]/5 | [OK/Warning/Risk] |
| Mercato | [X]/5 | [OK/Warning/Risk] |
| Unicità | [X]/5 | [OK/Warning/Risk] |
| Business Model | [X]/5 | [OK/Warning/Risk] |
| Traction | [X]/5 | [OK/Warning/Risk] |`
    },
    {
      id: 'ai-evaluation',
      title: 'Valutazione AI Dettagliata',
      maxTokens: 4000,
      prompt: `Genera la valutazione AI dettagliata con i 5 filtri:

# VALUTAZIONE AI - ANALISI APPROFONDITA

## 1. PROBLEMA (Score: [X]/5)
### Assessment: [OK/WARNING/RISK]

**Sintesi**: [Frase riassuntiva]

### Analisi Dettagliata
| Criterio | Valutazione | Note |
|----------|-------------|------|
| Problema reale e quantificabile | ✅/⚠️/❌ | [Note] |
| Impatto significativo sul target | ✅/⚠️/❌ | [Note] |
| Urgenza di risoluzione | ✅/⚠️/❌ | [Note] |
| Willingness to pay | ✅/⚠️/❌ | [Note] |

### Evidence
- [Dato o evidenza 1]
- [Dato o evidenza 2]

---

## 2. MERCATO (Score: [X]/5)
### Assessment: [OK/WARNING/RISK]

**Sintesi**: [Frase riassuntiva]

### Dimensioni di Mercato
| Metrica | Valore | Fonte |
|---------|--------|-------|
| TAM | €[X]B | [Fonte] |
| SAM | €[X]M | [Fonte] |
| SOM (Y3) | €[X]M | Proiezione |
| CAGR | [X]% | [Fonte] |

### Dinamiche di Mercato
- **Trend principali**: [Lista trend]
- **Driver di crescita**: [Lista driver]
- **Barriere**: [Lista barriere]

---

## 3. UNICITÀ (Score: [X]/5)
### Assessment: [OK/WARNING/RISK]

**Sintesi**: [Frase riassuntiva]

### Differenziazione
| Aspetto | Startup | Competitor Principale |
|---------|---------|----------------------|
| [Aspetto 1] | [Valore] | [Valore competitor] |
| [Aspetto 2] | [Valore] | [Valore competitor] |
| [Aspetto 3] | [Valore] | [Valore competitor] |

### Moat Analysis
- **Proprietà intellettuale**: [Descrizione]
- **Network effects**: [Descrizione]
- **Switching costs**: [Descrizione]
- **Data advantage**: [Descrizione]

---

## 4. BUSINESS MODEL (Score: [X]/5)
### Assessment: [OK/WARNING/RISK]

**Sintesi**: [Frase riassuntiva]

### Unit Economics
| Metrica | Valore | Benchmark |
|---------|--------|-----------|
| CAC | €[X] | €[X] |
| LTV | €[X] | €[X] |
| LTV:CAC | [X]:1 | >3:1 |
| Payback Period | [X] mesi | <12 mesi |
| Gross Margin | [X]% | >[X]% |
| Churn Rate | [X]% | <[X]% |

### Revenue Model
- **Tipo**: [SaaS/Marketplace/Transaction/etc.]
- **Pricing**: [Descrizione pricing]
- **Scalabilità**: [Alta/Media/Bassa]

---

## 5. TRACTION (Score: [X]/5)
### Assessment: [OK/WARNING/RISK]

**Sintesi**: [Frase riassuntiva]

### Metriche di Trazione
| Metrica | Attuale | 3 mesi fa | Growth |
|---------|---------|-----------|--------|
| MRR/ARR | €[X] | €[X] | +[X]% |
| Clienti paganti | [X] | [X] | +[X]% |
| Pipeline | €[X] | €[X] | +[X]% |
| NPS | [X] | [X] | +[X] |

### Milestones Raggiunti
- ✅ [Milestone 1]
- ✅ [Milestone 2]
- 🔄 [Milestone in progress]`
    },
    {
      id: 'strengths-weaknesses',
      title: 'Punti di Forza e Aree di Miglioramento',
      maxTokens: 2500,
      prompt: `Analisi SWOT della startup:

# ANALISI STRATEGICA

## PUNTI DI FORZA 💪

### 1. [Punto di Forza Principale]
[Descrizione dettagliata con evidenze]

### 2. [Secondo Punto di Forza]
[Descrizione dettagliata con evidenze]

### 3. [Terzo Punto di Forza]
[Descrizione dettagliata con evidenze]

### 4. [Quarto Punto di Forza]
[Descrizione dettagliata con evidenze]

---

## AREE DI MIGLIORAMENTO ⚠️

### 1. [Area di Miglioramento 1]
- **Rischio**: [Descrizione del rischio]
- **Impatto**: [Alto/Medio/Basso]
- **Mitigazione suggerita**: [Come affrontarlo]

### 2. [Area di Miglioramento 2]
- **Rischio**: [Descrizione del rischio]
- **Impatto**: [Alto/Medio/Basso]
- **Mitigazione suggerita**: [Come affrontarlo]

### 3. [Area di Miglioramento 3]
- **Rischio**: [Descrizione del rischio]
- **Impatto**: [Alto/Medio/Basso]
- **Mitigazione suggerita**: [Come affrontarlo]

---

## MATRICE RISCHIO-OPPORTUNITÀ

| Fattore | Tipo | Probabilità | Impatto | Priorità |
|---------|------|-------------|---------|----------|
| [Fattore 1] | Opportunità | Alta | Alto | 🔴 |
| [Fattore 2] | Rischio | Media | Alto | 🟡 |
| [Fattore 3] | Opportunità | Alta | Medio | 🟡 |
| [Fattore 4] | Rischio | Bassa | Medio | 🟢 |`
    },
    {
      id: 'investment-packages',
      title: 'Pacchetti di Investimento Proposti',
      maxTokens: 3500,
      prompt: `Genera i pacchetti di investimento proposti:

# PROPOSTA DI INVESTIMENTO

## Recommendation
**[CORE ACCELERATION / STRATEGIC INVESTMENT / WATCH & WAIT]**

[Paragrafo che spiega la raccomandazione basata sull'analisi]

---

## PACCHETTI PROPOSTI

### 🥉 PACCHETTO BASE - "Seed Support"
| Aspetto | Dettaglio |
|---------|-----------|
| **Investment** | €[X]K - €[X]K |
| **Equity** | [X]% - [X]% |
| **Valuation** | €[X]M pre-money |

**Cosa Include:**
- ✅ Accesso a network investitori
- ✅ Office hours mensili
- ✅ Supporto legal base
- ✅ Accesso a perks partner

**Ideale per**: [Descrizione target]

---

### 🥈 PACCHETTO GROWTH - "Acceleration"
| Aspetto | Dettaglio |
|---------|-----------|
| **Investment** | €[X]K - €[X]K |
| **Equity** | [X]% - [X]% |
| **Valuation** | €[X]M pre-money |

**Cosa Include:**
- ✅ Tutto del pacchetto Base
- ✅ Mentorship settimanale dedicata
- ✅ Supporto go-to-market
- ✅ Intro a corporate partner
- ✅ Supporto hiring (2 posizioni)
- ✅ PR & comunicazione

**Ideale per**: [Descrizione target]

---

### 🥇 PACCHETTO PREMIUM - "Scale Partner"
| Aspetto | Dettaglio |
|---------|-----------|
| **Investment** | €[X]K - €[X]M |
| **Equity** | [X]% - [X]% |
| **Valuation** | €[X]M pre-money |

**Cosa Include:**
- ✅ Tutto del pacchetto Growth
- ✅ Board seat o observer
- ✅ Follow-on riservato
- ✅ Supporto internazionalizzazione
- ✅ CFO/COO fractional
- ✅ Due diligence per Series A

**Ideale per**: [Descrizione target]

---

## COMPARAZIONE PACCHETTI

| Feature | Base | Growth | Premium |
|---------|------|--------|---------|
| Investment range | €[X]-[X]K | €[X]-[X]K | €[X]K-[X]M |
| Mentorship | Monthly | Weekly | Daily access |
| Network access | Limited | Full | VIP |
| Follow-on rights | No | Pro-rata | Super pro-rata |
| Board involvement | No | Observer | Seat |`
    },
    {
      id: 'terms-timeline',
      title: 'Termini e Timeline',
      maxTokens: 2500,
      prompt: `Genera i termini suggeriti e la timeline:

# TERMINI SUGGERITI

## Term Sheet Indicativo

### Struttura dell'Investimento
| Termine | Proposta |
|---------|----------|
| **Tipo di strumento** | [SAFE/Convertible Note/Equity] |
| **Ammontare** | €[X]K - €[X]K |
| **Valuation Cap** | €[X]M |
| **Discount** | [X]% |
| **Pro-rata rights** | [Sì/No] |
| **Information rights** | [Quarterly/Monthly] |

### Governance
| Termine | Proposta |
|---------|----------|
| **Board composition** | [Descrizione] |
| **Protective provisions** | [Standard/Custom] |
| **Vesting acceleration** | [Single/Double trigger] |
| **ESOP pool** | [X]% post-money |

### Condizioni Precedenti
- [ ] Due diligence completata
- [ ] Background check founders
- [ ] Legal documentation review
- [ ] [Altra condizione specifica]

---

# TIMELINE PROPOSTA

## Processo di Investimento

\`\`\`
Settimana 1-2: Due Diligence
├── Review documentazione
├── Call con clienti reference
└── Technical assessment

Settimana 3: Negotiation
├── Term sheet finale
├── Negoziazione termini
└── Approval committee

Settimana 4: Closing
├── Documentazione legale
├── Firma contratti
└── Wire transfer
\`\`\`

### Milestones Post-Investment (90 giorni)
| Milestone | Target | Deadline |
|-----------|--------|----------|
| [Milestone 1] | [Target] | Mese 1 |
| [Milestone 2] | [Target] | Mese 2 |
| [Milestone 3] | [Target] | Mese 3 |

---

# NEXT STEPS

1. **Entro 48h**: [Azione immediata]
2. **Entro 1 settimana**: [Azione successiva]
3. **Entro 2 settimane**: [Azione finale]

## Contatti
- **Investment Lead**: [Nome]
- **Email**: [email]
- **Telefono**: [numero]

---

*Questo documento è una proposta indicativa e non costituisce un impegno vincolante. I termini finali saranno definiti nel term sheet ufficiale.*`
    }
  ]
};
