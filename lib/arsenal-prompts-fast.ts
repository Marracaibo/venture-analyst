import { ArsenalItemId } from './arsenal-types';

// Ultra-fast prompts - designed to complete in <30 seconds on Vercel
// Each prompt generates ~300-500 tokens max

export interface FastPromptConfig {
  prompt: string;
  maxTokens: number;
}

export const FAST_ARSENAL_PROMPTS: Record<ArsenalItemId, FastPromptConfig> = {
  'landing-page': {
    maxTokens: 1200,
    prompt: `Crea una landing page professionale e convincente:

## 🎯 HERO SECTION
- **Headline:** (max 10 parole, impattante, specifico per il problema)
- **Subheadline:** (1-2 righe che spiegano il valore)
- **CTA Primario:** (testo bottone, es. "Prova Gratis 14 Giorni")
- **Social Proof:** (es. "Usato da 500+ aziende")

## 😫 IL PROBLEMA (3 punti dolore specifici del target)
Descrivi il problema in modo che il lettore pensi "sì, questo sono io!"

## ✨ LA SOLUZIONE (3 benefici chiave)
Come risolviamo ogni punto dolore - focus sui risultati, non features

## 🔥 COME FUNZIONA (3 step)
1. [Azione] → [Risultato immediato]
2. [Azione] → [Risultato immediato]  
3. [Azione] → [Risultato immediato]

## 💬 TESTIMONIAL (2 citazioni realistiche)
"[Citazione specifica con numeri]" - Nome, Ruolo, Azienda

## 💰 CTA FINALE
- Headline urgenza
- Bottone CTA
- Riduttore di rischio (es. "Nessuna carta richiesta")

Usa linguaggio specifico per il target. Evita genericità.`
  },

  'email-sequences': {
    maxTokens: 1000,
    prompt: `Crea 3 email di cold outreach pronte da usare:

## 📧 EMAIL 1 - Primo Contatto
**Subject:** [Specifico, curioso, max 6 parole]
**Preview:** [Prima riga che appare in anteprima]

Ciao {{nome}},

[Opener personalizzato - riferimento a qualcosa di specifico]
[1 frase sul problema che risolviamo]
[1 frase sul beneficio concreto con numero]
[CTA soft - domanda o proposta meeting]

[Firma breve]

---

## 📧 EMAIL 2 - Follow-up (3 giorni dopo)
**Subject:** Re: [subject precedente] / [alternativo curioso]

[Riferimento email precedente]
[Nuovo angle o case study breve]
[CTA più diretto]

---

## 📧 EMAIL 3 - Break-up (7 giorni dopo)
**Subject:** [Closing the loop / Ultima chance]

[Messaggio breve e diretto]
[Valore finale]
[CTA definitivo o chiusura elegante]

---

**Best practices incluse:**
- Orari migliori invio
- Personalizzazione suggerita`
  },

  'linkedin-pack': {
    maxTokens: 1100,
    prompt: `Crea un pacchetto LinkedIn completo:

## 👤 OTTIMIZZAZIONE PROFILO

**Headline (120 char):**
[Formula: Ruolo + Chi aiuto + Risultato]

**About (primi 3 righi cruciali):**
[Hook che cattura attenzione]
[Problema che risolvo]
[CTA o invito a connettersi]

---

## 📝 5 POST PRONTI DA PUBBLICARE

### POST 1 - Storia Personale
**Hook:** [Prima riga che ferma lo scroll]
[Storia breve con lezione]
[Takeaway actionable]
[Domanda per engagement]

### POST 2 - Insight di Settore
**Hook:** [Statistica o affermazione controversa]
[Analisi del trend]
[Cosa significa per il target]

### POST 3 - How-To Pratico
**Hook:** [Promessa specifica]
[3-5 step actionable]
[CTA finale]

### POST 4 - Errore Comune
**Hook:** [Errore che tutti fanno]
[Perché è sbagliato]
[Alternativa migliore]

### POST 5 - Behind the Scenes
**Hook:** [Cosa ho imparato questa settimana]
[Lezione concreta]
[Applicazione pratica]

---

**Hashtag consigliati:** (5 specifici per settore)
**Orari migliori:** [giorni e orari]`
  },

  'cold-scripts': {
    maxTokens: 900,
    prompt: `Crea script di vendita pronti all'uso:

## 📞 COLD CALL SCRIPT

**Apertura (primi 10 secondi):**
"Ciao [Nome], sono [Nome] di [Azienda]. Ti rubo 30 secondi?"

**Pitch (se dice sì):**
"[1 frase problema] [1 frase soluzione] [1 frase risultato concreto]"

**Qualificazione:**
"Velocemente: [domanda per capire se è il target giusto]?"

---

## 🚫 GESTIONE 5 OBIEZIONI

**"Non ho tempo"**
→ [Risposta in 1 riga]

**"Mandami info via email"**
→ [Risposta in 1 riga]

**"Usiamo già [competitor]"**
→ [Risposta in 1 riga]

**"Costa troppo"**
→ [Risposta in 1 riga]

**"Devo parlarne con..."**
→ [Risposta in 1 riga]

---

## 🎬 VIDEO PITCH 60 SECONDI
[Script completo con timing per ogni sezione]

## 🗣️ ELEVATOR PITCH 30 SECONDI
[Versione ultra-compressa per networking]`
  },

  'investor-match': {
    maxTokens: 1000,
    prompt: `Identifica gli investitori ideali per questa startup:

## 🎯 PROFILO INVESTITORE IDEALE
- Stage: [Pre-seed/Seed/Series A]
- Check size target: €[X] - €[Y]
- Settori focus: [specifici]
- Geografia: [preferenze]

---

## 💰 5 CATEGORIE DI INVESTITORI

### 1. BUSINESS ANGELS (€25K-100K)
- **Profilo ideale:** [descrizione]
- **Dove trovarli:** [piattaforme, eventi]
- **Approach:** [come contattarli]

### 2. MICRO VC (€100K-500K)
- **Profilo ideale:** [descrizione]
- **Fondi italiani/EU rilevanti:** [nomi]
- **Approach:** [warm intro vs cold]

### 3. VC TRADIZIONALI (€500K+)
- **Quando ha senso:** [metriche necessarie]
- **Fondi rilevanti:** [nomi]

### 4. CORPORATE VC / STRATEGIC
- **Aziende rilevanti:** [nomi specifici per settore]
- **Vantaggio:** [oltre al capitale]

### 5. ACCELERATORI
- **Programmi rilevanti:** [nomi]
- **Pro/contro:** [valutazione]

---

## 📧 EMAIL TEMPLATE OUTREACH

Subject: [Startup] - [settore] - [metrica chiave se c'è]

[Email pronta da personalizzare]`
  },

  'pitch-deck': {
    maxTokens: 1200,
    prompt: `Crea la struttura completa del pitch deck:

## 📊 PITCH DECK - 12 SLIDE

### SLIDE 1: COVER
- Titolo: [Nome startup]
- Tagline: [1 frase che spiega cosa fate]
- Visual: [suggerimento immagine]

### SLIDE 2: PROBLEMA
- **Headline:** [Il problema in 1 frase]
- **3 punti dolore** con dati/numeri
- Visual: [suggerimento]

### SLIDE 3: SOLUZIONE
- **Headline:** [Come lo risolviamo]
- **3 benefici chiave** 
- Screenshot/demo se possibile

### SLIDE 4: COME FUNZIONA
- 3-4 step del customer journey
- Visual: flowchart semplice

### SLIDE 5: MARKET SIZE
- **TAM:** €[X]B - [come calcolato]
- **SAM:** €[X]M - [segmento specifico]
- **SOM:** €[X]M - [obiettivo 3 anni]

### SLIDE 6: BUSINESS MODEL
- Revenue streams
- Pricing
- Unit economics (CAC, LTV, margine)

### SLIDE 7: TRACTION
- Metriche chiave (anche se early stage)
- Milestones raggiunti
- Growth rate

### SLIDE 8: COMPETITION
- Matrice 2x2 posizionamento
- Differenziatori chiave

### SLIDE 9: GO-TO-MARKET
- Strategia acquisizione
- Canali prioritari
- CAC target

### SLIDE 10: TEAM
- Founder + ruoli chiave
- Perché siamo le persone giuste

### SLIDE 11: FINANCIALS
- Proiezioni 3 anni
- Path to profitability
- Use of funds

### SLIDE 12: THE ASK
- Quanto: €[X]
- Per cosa: [3 priorità]
- Contatto: [email]

---

**Speaker notes:** 60 secondi per slide`
  },

  'financial-model': {
    maxTokens: 1000,
    prompt: `Crea un financial model realistico:

## 📈 ASSUMPTIONS BASE

| Parametro | Valore | Note |
|-----------|--------|------|
| Prezzo medio | €[X]/mese | [giustificazione] |
| Churn mensile | [X]% | [benchmark settore] |
| CAC | €[X] | [canali previsti] |
| Conversion rate | [X]% | [trial to paid] |
| Team iniziale | [N] persone | €[X]K burn/mese |

---

## 💰 UNIT ECONOMICS

**Per cliente:**
- **LTV:** €[X] = (ARPU × Gross Margin) / Churn
- **CAC:** €[X]
- **LTV:CAC Ratio:** [X]:1 (target >3:1)
- **Payback Period:** [X] mesi

---

## 📊 PROIEZIONI 3 ANNI

| Metrica | Anno 1 | Anno 2 | Anno 3 |
|---------|--------|--------|--------|
| Clienti | [X] | [X] | [X] |
| MRR | €[X]K | €[X]K | €[X]K |
| ARR | €[X]K | €[X]M | €[X]M |
| Burn | €[X]K | €[X]K | €[X]K |
| Runway | [X] mesi | [X] mesi | Profitable |

---

## 🎯 MILESTONES FUNDING

**Pre-seed (€[X]K):** [milestone da raggiungere]
**Seed (€[X]K):** [milestone da raggiungere]
**Series A (€[X]M):** [milestone da raggiungere]

---

**Nota:** Questi numeri sono stime basate su benchmark di settore. Adatta in base ai tuoi dati reali.`
  },

  'pitch-qa-trainer': {
    maxTokens: 1100,
    prompt: `Prepara risposte alle domande più difficili dei VC:

## 🥊 10 DOMANDE KILLER + RISPOSTE

### 1. "Perché proprio voi? Cosa vi rende unici?"
**❌ Evita:** "Siamo i migliori..."
**✅ Risposta:** [Risposta specifica con unfair advantage]

### 2. "Come mai non l'ha già fatto [Big Tech]?"
**✅ Risposta:** [Spiega il moat e perché non è nel loro focus]

### 3. "Qual è il vostro CAC e come pensate di abbassarlo?"
**✅ Risposta:** [Numero + strategia concreta]

### 4. "Cosa succede se [competitor] lancia la stessa feature?"
**✅ Risposta:** [Moat + velocità esecuzione + relazioni clienti]

### 5. "Perché questo mercato, perché ora?"
**✅ Risposta:** [Trend macro + timing specifico]

### 6. "Come userete esattamente i fondi?"
**✅ Risposta:** [Breakdown: X% team, X% growth, X% product]

### 7. "Qual è il piano se non raggiungete le metriche?"
**✅ Risposta:** [Plan B concreto senza sembrare pessimista]

### 8. "Perché dovrei investire oggi e non al prossimo round?"
**✅ Risposta:** [FOMO + termini attuali + milestone imminente]

### 9. "Cosa ti tiene sveglio la notte?"
**✅ Risposta:** [Mostra self-awareness senza red flags]

### 10. "Qual è il tuo exit plan?"
**✅ Risposta:** [Acquirer realistici + comparables M&A]

---

## 🚨 3 RED FLAGS DA EVITARE
1. [Comportamento da evitare]
2. [Frase da non dire mai]
3. [Errore di atteggiamento]`
  },

  'interview-scripts': {
    maxTokens: 900,
    prompt: `Crea script per customer discovery interviews:

## 🎙️ PRIMA DELL'INTERVISTA

**Recruiting message:**
"Ciao [Nome], sto facendo ricerca su [problema]. Cerco persone che [criterio]. 20 minuti del tuo tempo = [incentivo]. Disponibile?"

**Screening questions:**
1. [Domanda per qualificare]
2. [Domanda per qualificare]

---

## 📝 SCRIPT INTERVISTA (20 min)

### INTRO (2 min)
"Grazie per il tempo. Sto cercando di capire meglio [problema]. Non c'è risposta giusta o sbagliata. Posso registrare per miei appunti?"

### CONTESTO (3 min)
- "Raccontami del tuo ruolo e cosa fai quotidianamente"
- "Come gestisci attualmente [problema]?"

### PROBLEM DISCOVERY (8 min)
1. "Qual è la cosa più frustrante di [processo]?"
2. "Quanto tempo/soldi spendi per [problema]?"
3. "Raccontami l'ultima volta che [problema] ti ha creato difficoltà"
4. "Cosa hai provato per risolverlo?"
5. "Perché quelle soluzioni non funzionano?"

### SOLUTION VALIDATION (5 min)
- "Se potessi avere una bacchetta magica, cosa vorresti?"
- [Descrivi soluzione] "Cosa ne pensi?"
- "Quanto pagheresti per risolvere questo problema?"

### CHIUSURA (2 min)
- "C'è qualcosa che non ti ho chiesto ma dovrei sapere?"
- "Conosci altre 2-3 persone con lo stesso problema?"

---

## 📊 TEMPLATE SINTESI
| Intervistato | Problema principale | Soluzione attuale | WTP | Referral |`
  },

  'experiment-tracker': {
    maxTokens: 900,
    prompt: `Crea 7 esperimenti di validazione prioritizzati:

## 🧪 EXPERIMENT BOARD

### ESPERIMENTO 1 - SMOKE TEST
**Priorità:** 🔴 ALTA
**Ipotesi:** "Se [azione], allora [risultato] perché [motivo]"
**Test:** Landing page + form signup
**Metrica successo:** [X] signup in [Y] giorni
**Budget:** €[X]
**Durata:** 1 settimana

---

### ESPERIMENTO 2 - WILLINGNESS TO PAY
**Priorità:** 🔴 ALTA
**Ipotesi:** "I clienti pagheranno €[X]/mese per [soluzione]"
**Test:** Fake door con pricing page
**Metrica successo:** [X]% click su "Acquista"
**Budget:** €[X]
**Durata:** 1 settimana

---

### ESPERIMENTO 3 - CANALE ACQUISIZIONE
**Priorità:** 🟡 MEDIA
**Ipotesi:** "[Canale] è il canale più efficiente"
**Test:** A/B test su 3 canali con €[X] ciascuno
**Metrica successo:** CAC < €[X]
**Durata:** 2 settimane

---

### ESPERIMENTO 4 - CONCIERGE MVP
**Priorità:** 🟡 MEDIA
**Ipotesi:** "Posso deliverare valore manualmente"
**Test:** 5 clienti pilota gestiti manualmente
**Metrica successo:** NPS > 8, retention > 80%
**Durata:** 1 mese

---

### ESPERIMENTO 5 - REFERRAL
**Priorità:** 🟢 BASSA (dopo traction)
**Ipotesi:** "I clienti soddisfatti riferiranno [X] nuovi clienti"
**Test:** Programma referral semplice
**Metrica successo:** Viral coefficient > 0.5
**Durata:** 1 mese

---

### ESPERIMENTO 6 - CONTENT/SEO
**Priorità:** 🟢 BASSA (lungo termine)
**Ipotesi:** "[X] keyword porta traffico qualificato"
**Test:** 5 articoli ottimizzati
**Metrica successo:** [X] visite organiche/mese

---

### ESPERIMENTO 7 - PARTNERSHIP
**Priorità:** 🟡 MEDIA
**Ipotesi:** "[Partner] può portare [X] clienti"
**Test:** Pilot con 1 partner
**Metrica successo:** [X] clienti da partnership

---

## 📋 TEMPLATE NOTION
[Link o istruzioni per creare board]`
  },

  'survey-generator': {
    maxTokens: 800,
    prompt: `Crea un survey di validazione completo:

## 📋 SURVEY - [NOME STARTUP]

**Intro:**
"Stiamo sviluppando [soluzione] per [target]. Questo questionario richiede 3 minuti. Le tue risposte ci aiutano a creare qualcosa di veramente utile."

---

### SEZIONE 1: SCREENING (2 domande)

**Q1.** Qual è il tuo ruolo?
- [ ] [Opzione target ✓]
- [ ] [Opzione target ✓]
- [ ] [Opzione non target → esci]
- [ ] Altro: ___

**Q2.** Quante volte [azione rilevante] al mese?
- [ ] Mai → [esci]
- [ ] 1-3 volte
- [ ] 4-10 volte
- [ ] 10+ volte

---

### SEZIONE 2: PROBLEMA (4 domande)

**Q3.** Quanto è frustrante [problema]? ⭐
1 (per niente) → 5 (molto)

**Q4.** Quali di questi problemi riscontri? (multipla)
- [ ] [Problema 1]
- [ ] [Problema 2]
- [ ] [Problema 3]
- [ ] Altro: ___

**Q5.** Come risolvi attualmente [problema]?
- [ ] [Soluzione A]
- [ ] [Soluzione B]
- [ ] Non lo risolvo
- [ ] Altro: ___

**Q6.** Quanto spendi attualmente per [problema]? €___/mese

---

### SEZIONE 3: SOLUZIONE (2 domande)

**Q7.** Quanto sarebbe utile una soluzione che [beneficio chiave]?
1 (inutile) → 5 (indispensabile)

**Q8.** Quali feature sarebbero più importanti? (ordina per priorità)
- [Feature 1]
- [Feature 2]
- [Feature 3]

---

### SEZIONE 4: PRICING (2 domande)

**Q9.** A quale prezzo questa soluzione sarebbe:
- Troppo economica (sospetta): €___
- Un affare: €___
- Costosa ma accettabile: €___
- Troppo cara: €___

**Q10.** Saresti interessato a provare una versione beta?
- [ ] Sì → [email: ___]
- [ ] Forse più avanti
- [ ] No

---

**Tool consigliato:** Typeform / Google Forms
**Sample size target:** 50-100 risposte`
  },

  'competitor-radar': {
    maxTokens: 1000,
    prompt: `Crea un'analisi competitiva dettagliata:

## 🔍 COMPETITOR ANALYSIS

### MAPPA COMPETITIVA

| Competitor | Tipo | Target | Pricing | Funding |
|------------|------|--------|---------|---------|
| [Nome 1] | Diretto | [chi] | €[X]/mo | €[X]M |
| [Nome 2] | Diretto | [chi] | €[X]/mo | €[X]M |
| [Nome 3] | Indiretto | [chi] | €[X]/mo | Bootstrap |
| [Nome 4] | Sostituto | [chi] | Gratis | N/A |

---

### ANALISI DETTAGLIATA

#### 🏆 COMPETITOR 1: [Nome]
**Punti di forza:**
- [Forza 1]
- [Forza 2]

**Punti deboli:**
- [Debolezza 1] ← **nostra opportunità**
- [Debolezza 2]

**Cosa dicono i clienti:** (review)
"[Citazione negativa = nostra opportunità]"

---

#### 🏆 COMPETITOR 2: [Nome]
[Stessa struttura]

---

#### 🏆 COMPETITOR 3: [Nome]
[Stessa struttura]

---

## 📊 MATRICE POSIZIONAMENTO

        PREMIUM
           ↑
    [Noi]  |  [Comp1]
           |
SEMPLICE ←→ COMPLESSO
           |
  [Comp3]  |  [Comp2]
           ↓
        BUDGET

---

## ⚔️ NOSTRI DIFFERENZIATORI

1. **[Differenziatore 1]:** [perché è difendibile]
2. **[Differenziatore 2]:** [perché è difendibile]
3. **[Differenziatore 3]:** [perché è difendibile]

---

## 🔔 GOOGLE ALERTS DA SETTARE
- "[competitor1]"
- "[competitor2]"
- "[keyword settore] startup"
- "[keyword settore] funding"`
  },

  'roadmap-generator': {
    maxTokens: 1100,
    prompt: `Crea una roadmap dettagliata 12 mesi:

## 🗺️ ROADMAP STARTUP - 12 MESI

---

### 📅 FASE 1: VALIDAZIONE (Mese 1-2)

**Obiettivo:** Validare problem-solution fit

**Settimana 1-2:**
- [ ] 15 customer interviews
- [ ] Definire ICP (Ideal Customer Profile)
- [ ] Smoke test landing page

**Settimana 3-4:**
- [ ] Analisi risultati interviste
- [ ] MVP scope definition
- [ ] Prima versione pitch deck

**Settimana 5-8:**
- [ ] Concierge MVP con 5 clienti
- [ ] Iterare su feedback
- [ ] Validare willingness to pay

**🎯 Milestone:** 5 clienti paganti pilot

---

### 📅 FASE 2: MVP (Mese 3-4)

**Obiettivo:** Prodotto funzionante + primi clienti

**Settimana 9-12:**
- [ ] Sviluppo MVP core features
- [ ] Setup infrastructure base
- [ ] Onboarding primi 10 beta user

**Settimana 13-16:**
- [ ] Iterazione su feedback
- [ ] Pricing optimization
- [ ] Primi 20 clienti paganti

**🎯 Milestone:** €[X]K MRR + NPS > 40

---

### 📅 FASE 3: PRODUCT-MARKET FIT (Mese 5-8)

**Obiettivo:** Trovare canale scalabile

**Mese 5-6:**
- [ ] Test 3 canali acquisizione
- [ ] Ottimizzazione conversion funnel
- [ ] Content marketing setup

**Mese 7-8:**
- [ ] Double down su canale vincente
- [ ] Automazione processi
- [ ] Hiring primo team member

**🎯 Milestone:** €[X]K MRR + CAC < €[X]

---

### 📅 FASE 4: CRESCITA (Mese 9-12)

**Obiettivo:** Scalare acquisizione

**Mese 9-10:**
- [ ] Fundraising seed round
- [ ] Team expansion
- [ ] Feature expansion

**Mese 11-12:**
- [ ] International expansion prep
- [ ] Partnership strategiche
- [ ] Series A prep

**🎯 Milestone:** €[X]K MRR + Team [X] persone

---

## 📊 KPI PER FASE

| Fase | MRR | Clienti | Team | Funding |
|------|-----|---------|------|---------|
| 1 | €1K | 5 | 1-2 | Bootstrap |
| 2 | €5K | 20 | 2 | €50-100K |
| 3 | €15K | 100 | 3-4 | Seed prep |
| 4 | €50K | 300 | 6-8 | €500K+ |`
  },

  'cap-table-sim': {
    maxTokens: 800,
    prompt: `Crea una simulazione cap table:

## 🥧 CAP TABLE SIMULATOR

---

### STRUTTURA INIZIALE (Pre-funding)

| Shareholder | Shares | % |
|-------------|--------|---|
| Founder 1 | 500,000 | 50% |
| Founder 2 | 500,000 | 50% |
| **Totale** | 1,000,000 | 100% |

---

### SCENARIO 1: PRE-SEED (€150K @ €600K pre-money)

**Termini:**
- Valuation pre-money: €600K
- Investment: €150K
- Valuation post-money: €750K

| Shareholder | Pre | Post | Diluzione |
|-------------|-----|------|-----------|
| Founder 1 | 50% | 40% | -10% |
| Founder 2 | 50% | 40% | -10% |
| Investor | 0% | 20% | +20% |

---

### SCENARIO 2: SEED (€500K @ €2M pre-money)

**Termini:**
- Valuation pre-money: €2M
- Investment: €500K
- Valuation post-money: €2.5M

| Shareholder | Pre | Post | Diluzione |
|-------------|-----|------|-----------|
| Founder 1 | 40% | 32% | -8% |
| Founder 2 | 40% | 32% | -8% |
| Pre-seed | 20% | 16% | -4% |
| Seed Investor | 0% | 20% | +20% |

---

### ESOP (Employee Stock Option Pool)

**Raccomandazione:** 10-15% pre-Series A

| Fase | ESOP % | Per chi |
|------|--------|---------|
| Pre-seed | 5% | Primi 2-3 hire chiave |
| Seed | 10% | Team early stage |
| Series A | 15% | Crescita team |

**Vesting standard:** 4 anni, 1 anno cliff

---

### ⚠️ CLAUSOLE DA NEGOZIARE

1. **Liquidation preference:** Max 1x non-participating
2. **Anti-dilution:** Weighted average (no full ratchet)
3. **Board seats:** Founder majority fino a Series A
4. **Pro-rata rights:** Accettabile ma con cap

---

### 🧮 FORMULA DILUZIONE

Nuova % = Vecchia % × (Pre-money / Post-money)

Esempio: 50% × (600K / 750K) = 40%`
  },

  'executive-summary': {
    maxTokens: 1000,
    prompt: `Crea un Executive Summary professionale:

# EXECUTIVE SUMMARY

## [NOME STARTUP]
*[Tagline di una riga]*

---

### 🎯 IL PROBLEMA

[2-3 righe che descrivono il problema in modo vivido e specifico. Usa numeri se possibile.]

**Impatto:** [Quantifica il costo del problema per il target]

---

### ✨ LA SOLUZIONE

[2-3 righe che spiegano cosa fate e come risolvete il problema. Focus sui benefici, non sulle features.]

**Proposta di valore unica:** [1 frase che vi differenzia]

---

### 📊 MERCATO

| Metrica | Valore | Note |
|---------|--------|------|
| TAM | €[X]B | [Come calcolato] |
| SAM | €[X]M | [Segmento specifico] |
| SOM (3 anni) | €[X]M | [Target realistico] |

**Trend chiave:** [Perché ora è il momento giusto]

---

### 💰 BUSINESS MODEL

- **Modello:** [SaaS/Marketplace/etc.]
- **Pricing:** €[X]/mese per [unità]
- **Unit economics:** CAC €[X], LTV €[X], LTV:CAC [X]:1

---

### 📈 TRACTION

| Metrica | Valore | Trend |
|---------|--------|-------|
| [Metrica 1] | [X] | [crescita %] |
| [Metrica 2] | [X] | [crescita %] |
| [Metrica 3] | [X] | [crescita %] |

**Highlight:** [Risultato più impressionante]

---

### 👥 TEAM

**[Nome], CEO** - [Background rilevante in 10 parole]
**[Nome], CTO** - [Background rilevante in 10 parole]

**Perché noi:** [1 frase sul perché siete le persone giuste]

---

### 💵 THE ASK

**Raising:** €[X]

**Use of funds:**
- [X]% - [Area 1]
- [X]% - [Area 2]
- [X]% - [Area 3]

**Milestone 18 mesi:** [Cosa raggiungerete]

---

**Contatto:** [email] | [telefono]`
  },

  'legal-starter-pack': {
    maxTokens: 900,
    prompt: `Crea una checklist legale per startup italiana:

## ⚖️ LEGAL STARTER PACK

---

### ✅ DA FARE SUBITO (Prima settimana)

- [ ] **Costituzione SRL/SRLS**
  - Costi: €[X] (notaio) + €[X] (registro)
  - Capitale: min €1 (SRLS) o €10K (SRL)
  - Tempo: 5-10 giorni

- [ ] **Apertura P.IVA e iscrizione INPS**
  - Codice ATECO: [suggerimento per settore]
  - Regime: Ordinario (se fundraising)

- [ ] **Conto corrente business**
  - Opzioni: Qonto, N26 Business, Banca tradizionale
  
- [ ] **PEC aziendale**
  - Es: [nome]@pec.it

- [ ] **Dominio email professionale**
  - team@[startup].com

---

### 📄 DOCUMENTI ESSENZIALI

#### 1. PATTO PARASOCIALE
**Clausole fondamentali:**
- Vesting 4 anni, cliff 1 anno
- Good/Bad leaver
- Tag-along e Drag-along
- Non-compete (24 mesi)
- Lock-up period

#### 2. IP ASSIGNMENT
Tutti i founder cedono IP alla società:
- Software sviluppato
- Brevetti
- Marchi

#### 3. NDA (Non-Disclosure Agreement)
Per conversazioni con:
- Potenziali clienti
- Investitori (opzionale)
- Partner

#### 4. TERMINI DI SERVIZIO + PRIVACY POLICY
Obbligatori per qualsiasi prodotto digitale:
- GDPR compliant
- Cookie policy

---

### ⏰ VESTING RACCOMANDATO

Founder 1: 25% vested subito, 75% in 4 anni
Founder 2: 25% vested subito, 75% in 4 anni

Cliff: 12 mesi
Maturazione: Mensile dopo cliff
Accelerazione: Single trigger su M&A

---

### 🚨 ERRORI DA EVITARE

1. **Non avere patto parasociale** → Conflitti founder irrisolvibili
2. **IP non assegnata** → Due diligence fallita
3. **Regime fiscale sbagliato** → Problemi con investitori
4. **GDPR ignorato** → Multe fino a €20M o 4% fatturato

---

### 💡 STARTUP INNOVATIVE

**Requisiti:**
- [ ] Costituita da max 5 anni
- [ ] Sede in Italia
- [ ] Fatturato < €5M
- [ ] No distribuzione utili
- [ ] 15%+ spese R&D o 1/3 team laureati/PhD

**Vantaggi:**
- Incentivi fiscali investitori (30-50% detrazione)
- Fail fast: liquidazione semplificata
- Work for equity agevolato`
  },

  'investment-proposal': {
    maxTokens: 1500,
    prompt: `Crea una proposta di investimento professionale:

## 📋 EXECUTIVE SUMMARY
- **Opportunità:** Descrizione in 2-3 frasi
- **Ask:** Importo richiesto e valuation
- **Use of Funds:** Come verranno usati i fondi

## 🎯 IL PROBLEMA
- Problema specifico che risolviamo
- Dimensione del problema (numeri)
- Chi soffre di questo problema

## 💡 LA SOLUZIONE
- Come risolviamo il problema
- Differenziazione vs competitor
- Moat/barriere all'ingresso

## 📊 TRACTION & METRICHE
- MRR/ARR attuale
- Crescita mese su mese
- Clienti paganti
- Unit economics (CAC, LTV, LTV:CAC)

## 💰 FINANCIALS
- Revenue attuale e proiezioni 3 anni
- Burn rate mensile
- Runway attuale
- Break-even previsto

## 👥 TEAM
- Founder 1: Background e ruolo
- Founder 2: Background e ruolo
- Advisor chiave (se presenti)

## 🚀 ROADMAP
- Milestone Q1: [Obiettivo]
- Milestone Q2: [Obiettivo]
- Milestone Q3: [Obiettivo]
- Milestone Q4: [Obiettivo]

## 📈 DEAL TERMS
- Round: Pre-seed/Seed/Series A
- Valuation: Pre-money
- Strumento: SAFE/Equity
- Diritti investitori

Sii specifico con numeri reali. Evita genericità.`
  }
};

// Get prompt config for an item
export function getFastPrompt(itemId: ArsenalItemId): FastPromptConfig | null {
  return FAST_ARSENAL_PROMPTS[itemId] || null;
}
