// Premium Roadmap Configuration

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

export const ROADMAP_PREMIUM: PremiumDocumentConfig = {
  documentTitle: 'Roadmap Strategica 12 Mesi',
  totalEstimatedTime: '2-3 minuti',
  sections: [
    {
      id: 'q1-q2',
      title: 'Q1-Q2: Validazione e MVP',
      maxTokens: 3000,
      prompt: `Genera una Roadmap DETTAGLIATA - Parte 1:

# ROADMAP STRATEGICA 12 MESI

## [NOME STARTUP]

**Versione:** 1.0  
**Data:** Febbraio 2026  
**Periodo:** Q1 2026 - Q4 2026

---

## 📋 OVERVIEW

### Vision 12 Mesi
[Dove vogliamo essere tra 12 mesi - 2-3 frasi]

### North Star Metric
**[Metrica principale]**: Da [X] a [Y] entro fine anno

### Risorse Disponibili
| Risorsa | Attuale | Target Y1 |
|---------|---------|-----------|
| Team | [X] | [Y] |
| Budget | €[X]K | €[Y]K |
| Runway | [X] mesi | [Y] mesi |

---

## 📅 Q1: VALIDAZIONE (Mesi 1-3)

### 🎯 OKR Q1

**Objective:** Validare problem-solution fit con early adopters

| Key Result | Target | Metrica |
|------------|--------|---------|
| KR1 | [X] customer interviews completate | [Numero] |
| KR2 | [X] utenti beta attivi | [Numero] |
| KR3 | NPS > [X] dai beta tester | [Score] |

---

### 📆 MESE 1: Discovery

#### Settimana 1
| Task | Owner | Deliverable | Done |
|------|-------|-------------|------|
| Definire ICP (Ideal Customer Profile) | Founder | Documento ICP | ☐ |
| Setup strumenti (Notion, Analytics) | Founder | Account attivi | ☐ |
| Landing page v1 | Founder | URL live | ☐ |
| [Task specifico startup] | [Owner] | [Deliverable] | ☐ |

#### Settimana 2
| Task | Owner | Deliverable | Done |
|------|-------|-------------|------|
| 5 customer interviews | Founder | Note + insights | ☐ |
| Analisi competitor dettagliata | Founder | Documento analisi | ☐ |
| Definire MVP scope | Founder | PRD v1 | ☐ |
| [Task specifico startup] | [Owner] | [Deliverable] | ☐ |

#### Settimana 3
| Task | Owner | Deliverable | Done |
|------|-------|-------------|------|
| 5 customer interviews | Founder | Note + insights | ☐ |
| Wireframe MVP | Founder | Figma/sketch | ☐ |
| Setup dev environment | Tech | Repo + CI/CD | ☐ |
| [Task specifico startup] | [Owner] | [Deliverable] | ☐ |

#### Settimana 4
| Task | Owner | Deliverable | Done |
|------|-------|-------------|------|
| 5 customer interviews (totale 15) | Founder | Report sintesi | ☐ |
| Validare pricing con 5 prospect | Founder | Pricing validated | ☐ |
| Iniziare sviluppo MVP | Tech | Sprint 1 started | ☐ |
| [Task specifico startup] | [Owner] | [Deliverable] | ☐ |

**🚦 Gate Review Mese 1:**
- [ ] 15+ interviews completate
- [ ] ICP validato
- [ ] MVP scope definito
- [ ] Almeno 3 prospect interessati a beta

---

### 📆 MESE 2: MVP Build

#### Settimana 5
| Task | Owner | Deliverable | Done |
|------|-------|-------------|------|
| Sviluppo core feature 1 | Tech | Feature live | ☐ |
| Creare waitlist signup | Founder | Form attivo | ☐ |
| Content marketing: 4 post LinkedIn | Founder | Post pubblicati | ☐ |
| [Task specifico startup] | [Owner] | [Deliverable] | ☐ |

#### Settimana 6
| Task | Owner | Deliverable | Done |
|------|-------|-------------|------|
| Sviluppo core feature 2 | Tech | Feature live | ☐ |
| Outreach 50 prospect | Founder | 50 email inviate | ☐ |
| Setup analytics | Tech | Dashboard attiva | ☐ |
| [Task specifico startup] | [Owner] | [Deliverable] | ☐ |

#### Settimana 7
| Task | Owner | Deliverable | Done |
|------|-------|-------------|------|
| Sviluppo core feature 3 | Tech | Feature live | ☐ |
| Follow-up prospect | Founder | 10 call booked | ☐ |
| User testing interno | Team | Bug list | ☐ |
| [Task specifico startup] | [Owner] | [Deliverable] | ☐ |

#### Settimana 8
| Task | Owner | Deliverable | Done |
|------|-------|-------------|------|
| MVP v1 completo | Tech | Prodotto live | ☐ |
| Onboard primi 5 beta user | Founder | 5 utenti attivi | ☐ |
| Feedback collection setup | Founder | Sistema feedback | ☐ |
| [Task specifico startup] | [Owner] | [Deliverable] | ☐ |

**🚦 Gate Review Mese 2:**
- [ ] MVP live e funzionante
- [ ] 5+ beta user onboarded
- [ ] 50+ nella waitlist
- [ ] Primi feedback raccolti

---

### 📆 MESE 3: Beta Launch

#### Settimana 9-12 (Sprint)
| Task | Timeline | Deliverable |
|------|----------|-------------|
| Onboard altri 15 beta user | Sett. 9-10 | 20 utenti totali |
| Iterare su feedback | Sett. 9-12 | 10+ miglioramenti |
| Primi 3 clienti paganti | Sett. 11-12 | €[X] MRR |
| Case study con beta user | Sett. 12 | 1 case study |
| Pitch deck v1 | Sett. 12 | Deck pronto |

**🚦 Gate Review Q1:**
- [ ] 20+ beta user
- [ ] 3+ clienti paganti
- [ ] €[X]+ MRR
- [ ] NPS > 40
- [ ] Problem-solution fit validato

---

## 📅 Q2: PRODUCT-MARKET FIT (Mesi 4-6)

### 🎯 OKR Q2

**Objective:** Raggiungere primi segnali di product-market fit

| Key Result | Target | Metrica |
|------------|--------|---------|
| KR1 | [X] clienti paganti | [Numero] |
| KR2 | €[X]K MRR | [Revenue] |
| KR3 | [X]% retention 30 giorni | [Retention] |

---

### 📆 MESE 4: Traction

#### Focus Areas
| Area | Obiettivo | KPI |
|------|-----------|-----|
| **Acquisizione** | Trovare canale scalabile | CAC < €[X] |
| **Prodotto** | Feature richieste da clienti | 5+ releases |
| **Revenue** | Validare pricing | €[X]K MRR |

#### Task Principali
- [ ] Testare 3 canali acquisizione (€[X] budget ciascuno)
- [ ] Onboard 10 nuovi clienti paganti
- [ ] Implementare feature più richieste
- [ ] Setup processo sales (CRM, template)
- [ ] Content: 8 post LinkedIn + 2 blog post

---

### 📆 MESE 5: Optimization

#### Focus Areas
| Area | Obiettivo | KPI |
|------|-----------|-----|
| **Conversion** | Ottimizzare funnel | Conv. rate +[X]% |
| **Retention** | Ridurre churn | Churn < [X]% |
| **Expansion** | Primi upsell | +€[X] expansion |

#### Task Principali
- [ ] Double down su canale vincente
- [ ] Implementare onboarding ottimizzato
- [ ] Customer success program base
- [ ] Primi test di upsell
- [ ] Referral program v1

---

### 📆 MESE 6: Scale Prep

#### Focus Areas
| Area | Obiettivo | KPI |
|------|-----------|-----|
| **Team** | Primo hire | 1 persona |
| **Process** | Documentare tutto | Playbook v1 |
| **Funding** | Preparare seed round | Deck + materials |

#### Task Principali
- [ ] Hiring primo team member
- [ ] Documentare processi chiave
- [ ] Preparare data room
- [ ] Outreach primi 10 investitori
- [ ] Raggiungere €[X]K MRR

**🚦 Gate Review Q2:**
- [ ] [X]+ clienti paganti
- [ ] €[X]K+ MRR
- [ ] CAC payback < 12 mesi
- [ ] Retention 30d > [X]%
- [ ] Canale acquisizione validato

Sii SPECIFICO per questa startup.`
    },
    {
      id: 'q3-q4',
      title: 'Q3-Q4: Growth e Scale',
      maxTokens: 3000,
      prompt: `Continua la Roadmap - Parte 2:

## 📅 Q3: GROWTH (Mesi 7-9)

### 🎯 OKR Q3

**Objective:** Scalare acquisizione e chiudere seed round

| Key Result | Target | Metrica |
|------------|--------|---------|
| KR1 | [X] clienti paganti | [Numero] |
| KR2 | €[X]K MRR | [Revenue] |
| KR3 | Seed round closed | €[X]K raised |

---

### 📆 MESE 7: Accelerazione

#### Focus Areas
| Area | Obiettivo | Budget |
|------|-----------|--------|
| **Paid Acquisition** | Scalare canale vincente | €[X]K |
| **Content** | SEO + thought leadership | €[X]K |
| **Sales** | Outbound strutturato | €[X]K |

#### Task Principali
- [ ] Scalare budget paid da €[X] a €[X]K
- [ ] Assumere secondo team member (sales/marketing)
- [ ] Lanciare blog con 4 articoli SEO
- [ ] Setup outbound: 100 email/settimana
- [ ] Partecipare a 2 eventi di settore

#### Metriche Target
| Metrica | Inizio Mese | Fine Mese | Growth |
|---------|-------------|-----------|--------|
| MRR | €[X]K | €[X]K | +[X]% |
| Clienti | [X] | [X] | +[X] |
| Leads | [X] | [X] | +[X]% |

---

### 📆 MESE 8: Fundraising

#### Focus Areas
| Area | Obiettivo | KPI |
|------|-----------|-----|
| **Investor Outreach** | 30 investitori contattati | 10 meeting |
| **Traction** | Crescita continua | +[X]% MoM |
| **Team** | Consolidare | Processi ottimizzati |

#### Investor Pipeline
| Stage | Target |
|-------|--------|
| Warm intros richieste | 20 |
| Cold outreach | 30 |
| First meetings | 15 |
| Second meetings | 8 |
| Term sheets | 2-3 |

#### Task Principali
- [ ] Pitch 15 investitori
- [ ] Aggiornare deck con nuove metriche
- [ ] Reference call setup
- [ ] Due diligence prep (data room)
- [ ] Continuare execution (non rallentare!)

---

### 📆 MESE 9: Close Round

#### Focus Areas
| Area | Obiettivo | KPI |
|------|-----------|-----|
| **Closing** | Chiudere round | €[X]K raised |
| **Legal** | Documentazione | Signing |
| **Planning** | Piano post-funding | Roadmap Q4 |

#### Task Principali
- [ ] Negoziare termini finali
- [ ] Legal review (avvocato startup)
- [ ] Firmare SAFE/equity
- [ ] Wire dei fondi
- [ ] Comunicazione (PR, LinkedIn)
- [ ] Pianificare use of funds

**🚦 Gate Review Q3:**
- [ ] [X]+ clienti paganti
- [ ] €[X]K+ MRR
- [ ] Seed round closed (€[X]K)
- [ ] Team [X] persone
- [ ] Processi documentati

---

## 📅 Q4: SCALE (Mesi 10-12)

### 🎯 OKR Q4

**Objective:** Scalare team e raggiungere €[X]K MRR

| Key Result | Target | Metrica |
|------------|--------|---------|
| KR1 | Team [X] persone | [Numero] |
| KR2 | €[X]K MRR | [Revenue] |
| KR3 | Espansione [mercato/feature] | [Specifico] |

---

### 📆 MESE 10: Team Building

#### Hiring Plan
| Ruolo | Priorità | Salary Range | Start |
|-------|----------|--------------|-------|
| [Ruolo 1] | 🔴 Alta | €[X]-[Y]K | Mese 10 |
| [Ruolo 2] | 🔴 Alta | €[X]-[Y]K | Mese 10 |
| [Ruolo 3] | 🟠 Media | €[X]-[Y]K | Mese 11 |

#### Task Principali
- [ ] Job posting su LinkedIn, AngelList
- [ ] Screen 50+ candidati
- [ ] Intervistare 15 candidati
- [ ] Fare 2-3 offerte
- [ ] Onboarding nuovi hire

#### Metriche Target
| Metrica | Inizio Mese | Fine Mese | Growth |
|---------|-------------|-----------|--------|
| MRR | €[X]K | €[X]K | +[X]% |
| Team | [X] | [X] | +[X] |

---

### 📆 MESE 11: Expansion

#### Focus Areas
| Area | Obiettivo | Investment |
|------|-----------|------------|
| **New Market** | [Espansione geografica/verticale] | €[X]K |
| **New Feature** | [Feature enterprise/key] | Dev time |
| **Partnerships** | [X] partner attivi | BD effort |

#### Task Principali
- [ ] Lanciare in [nuovo mercato/segmento]
- [ ] Rilasciare [feature chiave]
- [ ] Firmare [X] partnership
- [ ] Setup customer success team
- [ ] Implementare tier enterprise

---

### 📆 MESE 12: Year-End

#### Focus Areas
| Area | Obiettivo | KPI |
|------|-----------|-----|
| **Revenue** | Hit €[X]K MRR | [Target] |
| **Efficiency** | Ottimizzare unit economics | LTV:CAC > [X] |
| **Planning** | Roadmap 2027 | Documento pronto |

#### Task Principali
- [ ] Raggiungere €[X]K MRR target
- [ ] Annual review con team
- [ ] Customer advisory board
- [ ] 2027 planning session
- [ ] Investor update Q4

**🚦 Gate Review Q4 / Year-End:**
- [ ] [X]+ clienti paganti
- [ ] €[X]K+ MRR (€[X]K+ ARR)
- [ ] Team [X] persone
- [ ] LTV:CAC > [X]:1
- [ ] Pronto per Series A prep

---

## 📊 DASHBOARD KPI ANNUALE

### Revenue Metrics
| Metrica | Q1 | Q2 | Q3 | Q4 |
|---------|----|----|----|----|
| MRR | €[X]K | €[X]K | €[X]K | €[X]K |
| Clienti | [X] | [X] | [X] | [X] |
| ARPU | €[X] | €[X] | €[X] | €[X] |
| Churn | [X]% | [X]% | [X]% | [X]% |

### Growth Metrics
| Metrica | Q1 | Q2 | Q3 | Q4 |
|---------|----|----|----|----|
| New Customers | [X] | [X] | [X] | [X] |
| CAC | €[X] | €[X] | €[X] | €[X] |
| LTV:CAC | [X]:1 | [X]:1 | [X]:1 | [X]:1 |

### Team & Resources
| Metrica | Q1 | Q2 | Q3 | Q4 |
|---------|----|----|----|----|
| Team Size | [X] | [X] | [X] | [X] |
| Burn Rate | €[X]K | €[X]K | €[X]K | €[X]K |
| Runway | [X]m | [X]m | [X]m | [X]m |

---

## 🚨 RISK REGISTER

| Risk | Probabilità | Impatto | Mitigazione |
|------|-------------|---------|-------------|
| Competitor launch | 🟠 Media | 🔴 Alto | [Azione specifica] |
| Key hire failure | 🟡 Bassa | 🟠 Medio | [Azione specifica] |
| Funding delay | 🟠 Media | 🔴 Alto | [Azione specifica] |
| Tech debt | 🟠 Media | 🟠 Medio | [Azione specifica] |
| Churn spike | 🟡 Bassa | 🔴 Alto | [Azione specifica] |

---

## 📝 TEMPLATE NOTION/ASANA

Per implementare questa roadmap, crea:

1. **Board "Roadmap 2026"** con colonne: Backlog, Q1, Q2, Q3, Q4, Done
2. **Task per ogni settimana** con due date e owner
3. **Dashboard KPI** con metriche automatiche
4. **Weekly review** ogni venerdì

---

*Roadmap generata da Startup Arsenal*

Sii SPECIFICO per questa startup.`
    }
  ]
};
