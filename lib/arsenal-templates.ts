import { ArsenalItemId } from './arsenal-types';
import { StartupIdea, AnalysisResult } from './types';

// Template-based arsenal generation - NO AI, instant results

type TemplateGenerator = (idea: StartupIdea, analysis: AnalysisResult) => string;

// Helper to get strengths from competitors
const getStrengths = (analysis: AnalysisResult): string[] => {
  const strengths: string[] = [];
  analysis.competitors.forEach(c => {
    c.strengths.forEach(s => {
      if (!strengths.includes(s)) strengths.push(s);
    });
  });
  return strengths.length > 0 ? strengths : ['Innovazione', 'Semplicità', 'Focus sul cliente'];
};

// Helper to get weaknesses from competitors
const getWeaknesses = (analysis: AnalysisResult): string[] => {
  const weaknesses: string[] = [];
  analysis.competitors.forEach(c => {
    c.weaknesses.forEach(w => {
      if (!weaknesses.includes(w)) weaknesses.push(w);
    });
  });
  return weaknesses.length > 0 ? weaknesses : ['Complessità', 'Prezzo alto', 'Supporto lento'];
};

export const ARSENAL_TEMPLATES: Record<ArsenalItemId, TemplateGenerator> = {
  'landing-page': (idea, analysis) => {
    const strengths = getStrengths(analysis);
    return `# Landing Page - ${analysis.ideaTitle}

## 🎯 HERO SECTION

**Headline:** ${analysis.ideaTitle}

**Subheadline:** ${idea.solution}

**CTA Button:** Inizia Ora →

---

## 😫 IL PROBLEMA

${idea.problem}

**Chi soffre questo problema?** ${idea.target}

---

## ✨ LA SOLUZIONE

${idea.solution}

### Benefici:
1. **${strengths[0] || 'Efficienza'}**
2. **${strengths[1] || 'Semplicità'}**
3. **${strengths[2] || 'Risparmio'}**

---

## 🏆 COME FUNZIONA

1. **Registrati** - Crea il tuo account in 30 secondi
2. **Configura** - Personalizza in base alle tue esigenze
3. **Risultati** - Inizia a vedere i benefici

---

## 💰 PRICING

### Starter - €19/mese
- Funzionalità base
- 1 utente

### Pro - €49/mese
- Tutte le funzionalità
- Team illimitato

---

## 🚀 CTA FINALE

**Pronto a iniziare?**

[Prova Gratuita] [Prenota Demo]`;
  },

  'email-sequences': (idea, analysis) => `# Email Sequences - ${analysis.ideaTitle}

## EMAIL 1: Primo Contatto

**Subject:** Risolvi ${idea.problem.slice(0, 30)}...

**Body:**
Ciao {{nome}},

Ho notato che lavori con ${idea.target}.

Molti professionisti come te affrontano: ${idea.problem.slice(0, 50)}...

Abbiamo creato ${analysis.ideaTitle} proprio per questo.

Posso mostrarti come in 15 minuti?

{{firma}}

---

## EMAIL 2: Follow-up

**Subject:** Re: ${analysis.ideaTitle}

**Body:**
Ciao {{nome}},

Ti scrivo un veloce follow-up.

Hai 15 minuti questa settimana?

{{firma}}

---

## EMAIL 3: Valore

**Subject:** 3 modi per migliorare

**Body:**
Ciao {{nome}},

Ecco 3 strategie:
1. Automatizzare i processi
2. Ridurre i tempi
3. Migliorare la qualità

Vuoi scoprire come?

{{firma}}`,

  'linkedin-pack': (idea, analysis) => `# LinkedIn Pack - ${analysis.ideaTitle}

## HEADLINE PROFILO
${analysis.ideaTitle} | Aiuto ${idea.target}

---

## POST 1: Il Problema

Ho parlato con +50 ${idea.target}.

Il problema #1?

${idea.problem.slice(0, 80)}...

Ma c'è una soluzione 👇

---

## POST 2: La Storia

3 anni fa ero nella stessa situazione.

Poi ho scoperto un metodo diverso.

Oggi aiuto altri con ${analysis.ideaTitle}.

---

## POST 3: CTA

Stanco di ${idea.problem.slice(0, 40)}...?

Ho creato una guida gratuita.

Commenta "GUIDA" e te la mando.`,

  'cold-scripts': (idea, analysis) => `# Cold Scripts - ${analysis.ideaTitle}

## SCRIPT PRINCIPALE

**Apertura:**
"Buongiorno, sono [Nome] da ${analysis.ideaTitle}."

**Pitch:**
"Aiutiamo ${idea.target} a ${idea.solution.slice(0, 50)}..."

**Domanda:**
"Quanto tempo dedicate a questo problema?"

---

## OBIEZIONI

**"Non ho tempo"**
→ "Bastano 15 minuti per vedere se possiamo farvi risparmiare ore."

**"Abbiamo già una soluzione"**
→ "Cosa funziona bene? Molti clienti ci usano in aggiunta."

**"Mandami info"**
→ "Quale email preferisci?"

---

## CHIUSURA

"Fissiamo 15 minuti per giovedì o venerdì?"`,

  'investor-match': (idea, analysis) => `# Investor Match - ${analysis.ideaTitle}

## TIPI DI INVESTITORI

### 1. Business Angels
- Check: €25-100K
- Dove: Italian Angels for Growth

### 2. Micro VC
- Check: €100-300K
- Esempi: Primo Ventures, LVenture

### 3. Acceleratori
- Techstars, LUISS EnLabs

---

## EMAIL TEMPLATE

**Subject:** ${analysis.ideaTitle} - intro

Ciao [Nome],

Sto costruendo ${analysis.ideaTitle}: ${idea.solution.slice(0, 50)}...

**Problema:** ${idea.problem.slice(0, 50)}...
**Target:** ${idea.target}

20 minuti la prossima settimana?

Grazie`,

  'pitch-deck': (idea, analysis) => `# Pitch Deck - ${analysis.ideaTitle}

## SLIDE 1: Cover
**${analysis.ideaTitle}**

---

## SLIDE 2: Problema
${idea.problem}

---

## SLIDE 3: Soluzione
${idea.solution}

---

## SLIDE 4: Market
- TAM: ${analysis.marketSize.tam.value}
- SAM: ${analysis.marketSize.sam.value}
- SOM: ${analysis.marketSize.som.value}

---

## SLIDE 5: Business Model
Subscription SaaS

---

## SLIDE 6: Competition
${analysis.competitors.slice(0, 3).map(c => `- ${c.name}`).join('\n')}

---

## SLIDE 7: Team
[Il tuo team]

---

## SLIDE 8: Ask
€[Amount] per [Obiettivo]`,

  'financial-model': (idea, analysis) => `# Financial Model - ${analysis.ideaTitle}

## ASSUMPTIONS
- Prezzo: €29/mese
- Churn: 5%
- CAC: €80

## UNIT ECONOMICS
- LTV: €580
- CAC: €80
- LTV:CAC: 7:1 ✅

## PROIEZIONI
| | Y1 | Y2 | Y3 |
|---|---|---|---|
| Clienti | 100 | 400 | 1500 |
| MRR | €3K | €12K | €45K |
| ARR | €36K | €144K | €540K |`,

  'pitch-qa-trainer': (idea, analysis) => `# Q&A Trainer - ${analysis.ideaTitle}

## DOMANDE DIFFICILI

**1. "Perché voi?"**
→ "Siamo specializzati su ${idea.target}."

**2. "Difendibilità?"**
→ "Network effect + dati proprietari."

**3. "Perché ora?"**
→ "Il mercato sta digitalizzando."

**4. "Acquisizione clienti?"**
→ "Content + partnership + referral."

**5. "E se Google entra?"**
→ "Non sono interessati a nicchie verticali."

**6. "Rischi?"**
→ "Execution. Mitighiamo con team esperto."

**7. "Perché il team?"**
→ "Esperienza diretta + track record."

**8. "Metriche?"**
→ "North Star: Active Users. KPI: MRR, Churn, NPS."`,

  'interview-scripts': (idea, analysis) => `# Interview Scripts - ${analysis.ideaTitle}

## INTRO
"Grazie per il tempo. Sto facendo ricerca su ${idea.problem.slice(0, 40)}..."

## DOMANDE PROBLEMA
1. "Raccontami l'ultima volta che..."
2. "Quanto spesso succede?"
3. "Cosa hai provato?"
4. "Cosa non ha funzionato?"
5. "Cosa vorresti idealmente?"

## DOMANDE VALORE
6. "Quanto ti costa questo problema?"
7. "Chi altri lo soffre?"
8. "Hai budget?"

## CHIUSURA
"Conosci altri con sfide simili?"
"Saresti interessato a vedere la soluzione?"`,

  'experiment-tracker': (idea, analysis) => `# Experiments - ${analysis.ideaTitle}

## EXP 1: Problem Validation
- **Test:** 20 interviste
- **Successo:** 75% confermano
- **Timeline:** 2 settimane

## EXP 2: Solution Interest
- **Test:** Landing + Ads (€200)
- **Successo:** >5% conversion
- **Timeline:** 1 settimana

## EXP 3: Pricing
- **Test:** 3 fasce di prezzo
- **Successo:** >3% click
- **Timeline:** 1 settimana

## EXP 4: Channel
- **Test:** LinkedIn outreach
- **Successo:** 5 demo booked
- **Timeline:** 2 settimane

## EXP 5: MVP Usage
- **Test:** Beta 10 utenti
- **Successo:** 7/10 attivi
- **Timeline:** 4 settimane`,

  'survey-generator': (idea, analysis) => `# Survey - ${analysis.ideaTitle}

## SCREENING
1. Lavori in ${idea.target}? (Sì/No)
2. Qual è il tuo ruolo?

## PROBLEMA
3. Quanto spesso affronti "${idea.problem.slice(0, 30)}..."? (Mai/Raramente/Spesso/Sempre)
4. Quanto è grave? (1-10)
5. Come risolvi attualmente?
6. Cosa non funziona?

## SOLUZIONE
7. Interesse per "${idea.solution.slice(0, 40)}..."? (1-5)
8. Feature must-have?

## PRICING
9. Quanto pagheresti? (€0-19/€20-49/€50-99/€100+)
10. Beta gratuita? (Sì + email / No)`,

  'competitor-radar': (idea, analysis) => {
    const weaknesses = getWeaknesses(analysis);
    return `# Competitor Radar - ${analysis.ideaTitle}

## COMPETITOR
${analysis.competitors.slice(0, 4).map((c, i) => `
### ${i + 1}. ${c.name}
- **Punti di forza:** ${c.strengths.slice(0, 2).join(', ')}
- **Punti deboli:** ${c.weaknesses.slice(0, 2).join(', ')}
`).join('\n')}

## NOSTRI VANTAGGI
1. Specializzazione su ${idea.target}
2. Semplicità d'uso
3. Prezzo accessibile
4. Supporto dedicato

## POSIZIONAMENTO
**Loro:** Soluzioni generiche
**Noi:** Specializzati su ${idea.target}`;
  },

  'roadmap-generator': (idea, analysis) => `# Roadmap - ${analysis.ideaTitle}

## MESE 1-2: VALIDAZIONE
- [ ] 20 customer interviews
- [ ] Landing + waitlist
- [ ] MVP minimale
**Target:** 10 beta users

## MESE 3-4: MVP
- [ ] Core features
- [ ] Onboarding
- [ ] Payments
**Target:** 5 clienti paganti

## MESE 5-6: GROWTH
- [ ] Content marketing
- [ ] Referral program
- [ ] Feature v2
**Target:** €2K MRR`,

  'cap-table-sim': (idea, analysis) => `# Cap Table - ${analysis.ideaTitle}

## INIZIALE
| Founder | % |
|---------|---|
| Founder 1 | 50% |
| Founder 2 | 30% |
| Founder 3 | 20% |

## POST-SEED (€500K @ €2M pre)
| Shareholder | % |
|-------------|---|
| Founders | 80% |
| Investors | 20% |

## ESOP
Raccomandato: 10-15%

## TERMINI
1. **Liquidation:** 1x non-participating
2. **Anti-dilution:** Weighted average
3. **Vesting:** 4 anni, 1 cliff`,

  'executive-summary': (idea, analysis) => `# Executive Summary - ${analysis.ideaTitle}

## PROBLEMA
${idea.problem}

## SOLUZIONE
${idea.solution}

## MERCATO
- TAM: ${analysis.marketSize.tam.value}
- SAM: ${analysis.marketSize.sam.value}

## BUSINESS MODEL
SaaS Subscription

## TRACTION
[Le tue metriche]

## TEAM
[Il tuo team]

## ASK
€[Amount] per [Obiettivo]`,

  'legal-starter-pack': (idea, analysis) => `# Legal Pack - ${analysis.ideaTitle}

## CHECKLIST
- [ ] Costituzione SRL
- [ ] Patti parasociali
- [ ] PEC e firma digitale
- [ ] Privacy policy
- [ ] Termini di servizio

## VESTING
- 4 anni durata
- 1 anno cliff
- Mensile dopo cliff

## ERRORI DA EVITARE
1. No patti parasociali
2. Quote 50/50
3. No marchio registrato
4. Ignorare GDPR`,

  'investment-proposal': (idea, analysis) => `# Investment Proposal - ${analysis.ideaTitle}

## EXECUTIVE SUMMARY
**Opportunità:** ${idea.solution}
**Target:** ${idea.target}
**Problema:** ${idea.problem}

## IL PROBLEMA
${idea.problem}

Chi soffre: ${idea.target}

## LA SOLUZIONE
${idea.solution}

## TRACTION
[Inserire metriche]
- MRR: €
- Clienti: 
- Crescita: %

## TEAM
[Inserire team]

## ASK
€[Amount] per [% equity]
Valuation: €[Pre-money]`
};

export function generateArsenalContent(
  itemId: ArsenalItemId,
  idea: StartupIdea,
  analysis: AnalysisResult
): string {
  const template = ARSENAL_TEMPLATES[itemId];
  if (!template) {
    return `# ${itemId}\n\nTemplate non disponibile.`;
  }
  return template(idea, analysis);
}
