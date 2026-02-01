// Premium Financial Model Configuration

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

export const FINANCIAL_MODEL_PREMIUM: PremiumDocumentConfig = {
  documentTitle: 'Financial Model Completo',
  totalEstimatedTime: '2-3 minuti',
  sections: [
    {
      id: 'assumptions',
      title: 'Key Assumptions e Unit Economics',
      maxTokens: 3000,
      prompt: `Sei un CFO esperto. Genera un FINANCIAL MODEL professionale per questa startup.

REGOLE DI FORMATTAZIONE CRITICHE:
- USA SOLO markdown standard: # ## ### per titoli, | per tabelle, - per liste
- NON usare emoji o simboli Unicode speciali
- NON usare box ASCII (caratteri come ┌ ─ │ └)
- COMPILA tutti i valori con numeri REALISTICI basati sul settore
- Le tabelle DEVONO avere il separatore |---|---| dopo l'header
- Sii SPECIFICO: usa numeri concreti, non placeholder [X]

---

# FINANCIAL MODEL - {NOME_STARTUP}

**Versione:** 1.0 | **Data:** Febbraio 2026 | **Periodo:** 3 anni

---

## 1. KEY ASSUMPTIONS

### 1.1 Revenue Assumptions

Genera una tabella con i parametri di revenue realistici per questo tipo di startup:
- Pricing tiers (Base, Pro, Enterprise)
- Mix di revenue per tier
- Sconti per contratti annuali

### 1.2 Growth Assumptions

Genera una tabella con le assumptions di crescita per Y1, Y2, Y3:
- New MRR growth mensile
- Expansion revenue
- Net Revenue Retention

### 1.3 Cost Assumptions

Genera una tabella con la struttura dei costi:
- COGS (% del revenue)
- Sales & Marketing
- R&D
- G&A

### 1.4 Churn Assumptions

Genera una tabella con le metriche di churn per segmento:
- SMB, Mid-Market, Enterprise
- Monthly e Annual churn rates

---

## 2. UNIT ECONOMICS

### 2.1 Customer Acquisition Cost (CAC)

Calcola il CAC con questa formula:
- CAC = (Spesa Marketing + Salari Sales) / Nuovi Clienti
- Mostra il breakdown dettagliato

### 2.2 Lifetime Value (LTV)

Calcola l'LTV con questa formula:
- LTV = (ARPU x Gross Margin) / Monthly Churn
- Mostra il calcolo step-by-step

### 2.3 LTV:CAC Ratio

Calcola e valuta il ratio:
- Sotto 1:1 = Insostenibile
- 1-3:1 = Rischioso
- 3-5:1 = Sano
- Sopra 5:1 = Eccellente

### 2.4 Payback Period

Calcola il periodo di payback in mesi.

### 2.5 Unit Economics Summary

Genera una tabella riassuntiva con:

| Metrica | Valore | Benchmark | Status |
|---------|--------|-----------|--------|
| CAC | (valore) | (benchmark settore) | OK/Warning/Risk |
| LTV | (valore) | (benchmark settore) | OK/Warning/Risk |
| LTV:CAC | (ratio) | >3:1 | OK/Warning/Risk |
| Payback | (mesi) | <12 mesi | OK/Warning/Risk |
| Gross Margin | (%) | >70% | OK/Warning/Risk |
| Monthly Churn | (%) | <3% | OK/Warning/Risk |

USA NUMERI REALISTICI basati sul settore e sul modello di business della startup.`
    },
    {
      id: 'projections-y1',
      title: 'Proiezioni Mensili Anno 1',
      maxTokens: 3000,
      prompt: `Continua il Financial Model - Parte 2.

REGOLE DI FORMATTAZIONE:
- USA SOLO markdown standard: tabelle con |, titoli con ##
- NON usare emoji, box ASCII o grafici ASCII
- COMPILA tutti i valori con numeri REALISTICI
- Le tabelle DEVONO avere |---|---| dopo l'header

---

## 3. PROIEZIONI MENSILI ANNO 1

### 3.1 Revenue Projection Y1

Genera una tabella con le proiezioni mensili di revenue per l'Anno 1:
- Colonne: Mese, New MRR, Churn, Expansion, Net New, Total MRR, ARR
- Righe: M1 a M12 + TOTAL Y1
- Usa numeri realistici crescenti

### 3.2 Customer Growth Y1

Genera una tabella con la crescita clienti mensile:
- Colonne: Mese, Nuovi Clienti, Churned, Net, Totale
- Righe: M1 a M12

### 3.3 Costs Y1

Genera una tabella con i costi mensili:
- Colonne: Mese, COGS, S&M, R&D, G&A, Total Costs, EBITDA
- Mostra la progressione verso il break-even

### 3.4 Cash Flow Summary Y1

Genera una tabella riassuntiva:

| Metrica | Valore |
|---------|--------|
| Opening Cash | (importo iniziale) |
| Total Revenue Y1 | (somma) |
| Total Costs Y1 | (somma) |
| Net Burn Y1 | (differenza) |
| Funding Received | (se applicabile) |
| Closing Cash | (risultato) |
| Runway Remaining | (mesi) |

USA NUMERI REALISTICI basati sulle assumptions della Parte 1.`
    },
    {
      id: 'projections-y2y3-scenarios',
      title: 'Proiezioni Y2-Y3 e Scenari',
      maxTokens: 3000,
      prompt: `Continua il Financial Model - Parte 3 (finale).

REGOLE DI FORMATTAZIONE:
- USA SOLO markdown standard: tabelle con |, titoli con ##
- NON usare emoji, box ASCII o grafici ASCII
- COMPILA tutti i valori con numeri REALISTICI
- Le tabelle DEVONO avere |---|---| dopo l'header

---

## 4. PROIEZIONI TRIMESTRALI Y2-Y3

### 4.1 P&L Summary

Genera una tabella P&L trimestrale per Y2 e Y3:
- Colonne: Metrica, Y1 Total, Y2 Q1-Q4, Y3 Q1-Q4
- Righe: Revenue, COGS, Gross Profit, S&M, R&D, G&A, EBITDA, Margin %

### 4.2 Key Metrics Evolution

Genera una tabella con l'evoluzione delle metriche chiave:

| Metrica | Y1 End | Y2 End | Y3 End |
|---------|--------|--------|--------|
| Clienti Totali | (numero) | (numero) | (numero) |
| MRR | (importo) | (importo) | (importo) |
| ARR | (importo) | (importo) | (importo) |
| Team Size | (numero) | (numero) | (numero) |
| Gross Margin | (%) | (%) | (%) |

---

## 5. FUNDING SCENARIOS

Presenta 3 scenari di funding con tabelle comparative:

### Scenario A: Bootstrap
- Revenue Y1-Y3, Growth Rate, Team Size, Break-even
- Pro e Contro

### Scenario B: Pre-Seed (150K EUR)
- Revenue Y1-Y3, Growth Rate, Team Size, Dilution, Runway
- Pro e Contro

### Scenario C: Seed (500K EUR)
- Revenue Y1-Y3, Growth Rate, Team Size, Dilution, Runway
- Pro e Contro

---

## 6. SENSITIVITY ANALYSIS

Genera 3 analisi di sensitivita con tabelle:

### What If: Churn +50%
Mostra impatto su LTV, LTV:CAC, Y3 ARR

### What If: CAC +30%
Mostra impatto su CAC, LTV:CAC, Payback

### What If: Price -20%
Mostra impatto su ARPU, Y3 ARR, Break-even

---

## 7. CONCLUSIONI E RACCOMANDAZIONI

Scrivi un breve paragrafo con:
- Scenario consigliato e perche
- Rischi principali da monitorare
- Metriche chiave da tracciare

---

*Financial Model generato da Startup Arsenal*`
    }
  ]
};
