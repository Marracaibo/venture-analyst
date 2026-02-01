// Premium Legal Pack Configuration

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

export const LEGAL_PACK_PREMIUM: PremiumDocumentConfig = {
  documentTitle: 'Legal Starter Pack Completo',
  totalEstimatedTime: '2-3 minuti',
  sections: [
    {
      id: 'checklist-patto',
      title: 'Checklist e Patto Parasociale',
      maxTokens: 3000,
      prompt: `Genera un Legal Starter Pack PROFESSIONALE - Parte 1:

# LEGAL STARTER PACK

## [NOME STARTUP]

**Versione:** 1.0  
**Data:** Febbraio 2026  
**Nota:** Questo documento è una guida. Consultare sempre un avvocato per documenti legali definitivi.

---

## 1. CHECKLIST LEGALE STARTUP

### 1.1 Costituzione Società (Priorità 🔴 ALTA)

| Task | Status | Costo Stimato | Note |
|------|--------|---------------|------|
| Scelta forma giuridica | ☐ | - | SRL vs SRLS vs SPA |
| Atto costitutivo notaio | ☐ | €1.500-3.000 | Include statuto |
| Registrazione CCIAA | ☐ | €200-400 | Camera di Commercio |
| Apertura P.IVA | ☐ | Gratuito | Agenzia Entrate |
| Iscrizione INPS | ☐ | Gratuito | Gestione separata |
| PEC aziendale | ☐ | €10-50/anno | Obbligatoria |
| Firma digitale | ☐ | €30-80 | Per legale rappresentante |

### 1.2 Forma Giuridica Consigliata

**Per startup early-stage: SRLS (Società a Responsabilità Limitata Semplificata)**

| Aspetto | SRLS | SRL | SPA |
|---------|------|-----|-----|
| Capitale minimo | €1 | €10.000 | €50.000 |
| Costi costituzione | €300-500 | €2.000-3.000 | €5.000+ |
| Flessibilità statuto | Limitata | Alta | Massima |
| Adatta per funding | ⚠️ Convertire | ✅ Sì | ✅ Sì |
| Consigliata per | MVP/Validation | Seed+ | Series A+ |

**Raccomandazione:** Iniziare con SRLS, convertire a SRL quando si raccolgono fondi.

### 1.3 Documenti Fondamentali

| Documento | Priorità | Quando Serve | Status |
|-----------|----------|--------------|--------|
| Patto Parasociale | 🔴 Alta | Prima di costituire | ☐ |
| Statuto personalizzato | 🔴 Alta | Costituzione | ☐ |
| IP Assignment | 🔴 Alta | Subito | ☐ |
| NDA | 🟠 Media | Prima di parlare | ☐ |
| Terms of Service | 🟠 Media | Prima del lancio | ☐ |
| Privacy Policy | 🔴 Alta | Prima del lancio | ☐ |
| Cookie Policy | 🔴 Alta | Prima del lancio | ☐ |
| Founder Agreement | 🔴 Alta | Prima di lavorare insieme | ☐ |

---

## 2. PATTO PARASOCIALE

### 2.1 Struttura Base

\`\`\`
PATTO PARASOCIALE

TRA
- [Nome Founder 1], CF [XXXXX], residente in [Indirizzo]
- [Nome Founder 2], CF [XXXXX], residente in [Indirizzo]

PREMESSO CHE
- Le parti intendono costituire una società denominata [NOME STARTUP]
- Le parti intendono regolare i propri rapporti in modo dettagliato
- Il presente patto integra ma non sostituisce lo statuto sociale

SI CONVIENE QUANTO SEGUE
\`\`\`

### 2.2 Clausole Essenziali

#### ARTICOLO 1 - OGGETTO E DURATA
- Durata: [X] anni dalla costituzione (rinnovabile)
- Oggetto: regolare rapporti tra soci
- Prevalenza su statuto per materie qui disciplinate

#### ARTICOLO 2 - QUOTE E VESTING

**Ripartizione Iniziale:**
| Socio | Quote % | Vesting | Note |
|-------|---------|---------|------|
| [Founder 1] | [X]% | 4 anni, cliff 1 anno | CEO |
| [Founder 2] | [X]% | 4 anni, cliff 1 anno | CTO |
| ESOP riservato | [X]% | Per futuri hire | Pool |

**Schema Vesting:**
\`\`\`
Anno 1: 0% maturato (cliff)
       │
       └── Dopo 12 mesi: 25% matura immediatamente
       
Anno 2: 25% + 25% = 50% maturato
Anno 3: 50% + 25% = 75% maturato
Anno 4: 75% + 25% = 100% maturato

Maturazione: Mensile dopo il cliff
\`\`\`

#### ARTICOLO 3 - GOOD LEAVER / BAD LEAVER

**Good Leaver** (mantiene quote maturate):
- Dimissioni per giusta causa
- Licenziamento senza giusta causa
- Morte o invalidità permanente
- Accordo scritto tra le parti

**Bad Leaver** (perde quote non maturate + penalità):
- Dimissioni senza giusta causa nei primi [X] anni
- Licenziamento per giusta causa
- Violazione patto di non concorrenza
- Violazione clausole riservatezza

**Meccanismo di riacquisto:**
| Scenario | Prezzo Riacquisto | Timeline |
|----------|-------------------|----------|
| Good Leaver | Fair Market Value | 90 giorni |
| Bad Leaver | Valore nominale (€1) | 30 giorni |

#### ARTICOLO 4 - LOCK-UP

**Periodo Lock-up:** [24-36] mesi dalla costituzione

Durante il lock-up:
- Divieto di cessione quote a terzi
- Eccezioni: successione, trasferimento a società controllate
- Necessario consenso unanime per deroghe

#### ARTICOLO 5 - DIRITTO DI PRELAZIONE

In caso di vendita quote:
1. Socio cedente comunica intenzione + condizioni
2. Altri soci hanno [30] giorni per esercitare prelazione
3. Se non esercitata, può vendere a terzi alle stesse condizioni
4. Validità offerta: [90] giorni

#### ARTICOLO 6 - TAG-ALONG (Co-vendita)

Se un socio vende >50% delle sue quote:
- Altri soci possono vendere pro-quota alle stesse condizioni
- Acquirente deve acquistare anche quote dei soci che esercitano tag-along
- Termine per esercizio: [15] giorni dalla notifica

#### ARTICOLO 7 - DRAG-ALONG (Obbligo di co-vendita)

Se soci con >[X]% concordano vendita 100% a terzo:
- Possono obbligare altri soci a vendere
- Prezzo non inferiore a [X]x investimento iniziale
- O approvato da [X]% dei soci

---

### 2.3 Clausole Aggiuntive Importanti

#### ARTICOLO 8 - NON CONCORRENZA

Durante la partecipazione + [24] mesi dopo:
- Divieto di attività concorrenti
- Ambito geografico: [Italia/EU]
- Settore: [specificare settore startup]
- Penale: €[X] per ogni violazione

#### ARTICOLO 9 - RISERVATEZZA

Obbligo permanente di riservatezza su:
- Informazioni tecniche e know-how
- Dati clienti e fornitori
- Strategie commerciali
- Informazioni finanziarie
- Penale: €[X] per ogni violazione

#### ARTICOLO 10 - DEADLOCK

In caso di stallo decisionale:
1. Mediazione tra soci (30 giorni)
2. Mediatore esterno (30 giorni)
3. Russian roulette: un socio offre prezzo, l'altro sceglie se comprare o vendere

Sii SPECIFICO per questa startup.`
    },
    {
      id: 'nda-founder-agreement',
      title: 'NDA e Founder Agreement',
      maxTokens: 3000,
      prompt: `Continua il Legal Starter Pack - Parte 2:

## 3. NDA (NON-DISCLOSURE AGREEMENT)

### 3.1 Template NDA Bilaterale

\`\`\`
ACCORDO DI RISERVATEZZA

TRA
[NOME STARTUP] (di seguito "Parte A")
E
[NOME CONTROPARTE] (di seguito "Parte B")

Collettivamente "le Parti"

PREMESSO CHE
Le Parti intendono avviare discussioni relative a [OGGETTO]
e durante tali discussioni potrebbero scambiarsi informazioni riservate.

SI CONVIENE QUANTO SEGUE:
\`\`\`

### 3.2 Clausole NDA Essenziali

#### ARTICOLO 1 - DEFINIZIONE INFORMAZIONI RISERVATE

Sono considerate Informazioni Riservate:
- Informazioni tecniche (codice, algoritmi, architetture)
- Informazioni commerciali (clienti, prezzi, strategie)
- Informazioni finanziarie (bilanci, proiezioni, valutazioni)
- Know-how e processi proprietari
- Qualsiasi informazione marcata come "Confidenziale"

**NON sono considerate riservate:**
- Informazioni di pubblico dominio
- Informazioni già note alla Parte ricevente
- Informazioni ottenute da terzi non vincolati

#### ARTICOLO 2 - OBBLIGHI

La Parte ricevente si impegna a:
- Non divulgare a terzi senza consenso scritto
- Usare solo per lo scopo dichiarato
- Proteggere con la stessa cura delle proprie informazioni riservate
- Limitare accesso a dipendenti/consulenti con need-to-know
- Notificare immediatamente eventuali violazioni

#### ARTICOLO 3 - DURATA

- Durata accordo: [3-5] anni dalla firma
- Obblighi di riservatezza: permangono per [5] anni dal termine

#### ARTICOLO 4 - RESTITUZIONE

Al termine delle discussioni o su richiesta:
- Restituire tutti i materiali ricevuti
- Distruggere copie digitali
- Confermare per iscritto la distruzione

#### ARTICOLO 5 - PENALE

In caso di violazione:
- Penale: €[10.000-50.000] per ogni violazione
- Risarcimento danni ulteriori se dimostrati
- Foro competente: [Città]

---

## 4. FOUNDER AGREEMENT

### 4.1 Template Founder Agreement

\`\`\`
ACCORDO TRA FONDATORI

TRA
- [Nome Founder 1]
- [Nome Founder 2]

Per la creazione e sviluppo di [NOME STARTUP]

Data: [Data]
\`\`\`

### 4.2 Sezioni Founder Agreement

#### SEZIONE 1 - RUOLI E RESPONSABILITÀ

| Founder | Ruolo | Responsabilità Principali |
|---------|-------|---------------------------|
| [Nome 1] | CEO | Vision, fundraising, business development |
| [Nome 2] | CTO | Tecnologia, prodotto, team tecnico |

**Decision Matrix:**
| Decisione | Founder 1 | Founder 2 | Consenso |
|-----------|-----------|-----------|----------|
| Strategia aziendale | Lead | Input | Required |
| Tecnologia/Prodotto | Input | Lead | Required |
| Hiring | Jointly | Jointly | Required |
| Spese > €[X]K | Jointly | Jointly | Required |
| Fundraising | Lead | Input | Required |
| Pivot strategico | Jointly | Jointly | Required |

#### SEZIONE 2 - IMPEGNO DI TEMPO

Ciascun Founder si impegna a:
- Dedicare [X]% del tempo lavorativo al progetto
- Non assumere altri impieghi senza consenso scritto
- Partecipare a meeting settimanali di allineamento
- Comunicare tempestivamente impedimenti

**Part-time transition:**
| Fase | Impegno | Condizioni |
|------|---------|------------|
| Pre-funding | Min 20h/settimana | Può mantenere lavoro |
| Post €50K raised | Min 32h/settimana | Part-time permesso |
| Post €150K raised | Full-time | Lasciare altro lavoro entro 60 giorni |

#### SEZIONE 3 - COMPENSI E EQUITY

**Fase Bootstrap (no revenue):**
- Nessun salario
- Equity come da patto parasociale
- Rimborso spese documentate

**Fase Revenue:**
- Salario: €[X]/mese quando MRR > €[X]K
- Aumento automatico: +€[X]/mese ogni €[X]K MRR addizionale
- Cap salario pre-Series A: €[X]K/anno

#### SEZIONE 4 - INTELLECTUAL PROPERTY

Tutti i Founder cedono alla società:
- Ogni invenzione sviluppata per il progetto
- Codice sorgente scritto per il progetto
- Design, documenti, materiali creati
- Brevetti e marchi relativi al progetto

**IP pre-esistente:**
- Rimane di proprietà del Founder originale
- Licenza gratuita e perpetua alla società per uso nel progetto

#### SEZIONE 5 - USCITA DI UN FOUNDER

**Processo di uscita:**
1. Notifica scritta con [60] giorni di preavviso
2. Transizione responsabilità e conoscenze
3. Applicazione clausole good/bad leaver
4. Non-compete attivo per [24] mesi

---

## 5. GDPR E PRIVACY

### 5.1 Checklist GDPR

| Requisito | Descrizione | Status |
|-----------|-------------|--------|
| Privacy Policy | Documento pubblico su sito | ☐ |
| Cookie Policy | Banner + pagina dedicata | ☐ |
| Registro trattamenti | Documento interno | ☐ |
| Consenso esplicito | Checkbox non pre-flaggata | ☐ |
| Diritto cancellazione | Processo implementato | ☐ |
| Data portability | Export dati utente | ☐ |
| DPO | Nominare se necessario | ☐ |
| Data breach plan | Procedura notifica 72h | ☐ |

### 5.2 Sanzioni GDPR

| Violazione | Sanzione Max |
|------------|--------------|
| Violazioni minori | €10M o 2% fatturato globale |
| Violazioni gravi | €20M o 4% fatturato globale |

---

## 6. STARTUP INNOVATIVA

### 6.1 Requisiti

Per iscriversi al Registro Startup Innovative:

| Requisito | Check |
|-----------|-------|
| Costituita da max 5 anni | ☐ |
| Sede in Italia o EU con filiale IT | ☐ |
| Fatturato < €5M/anno | ☐ |
| Non quotata | ☐ |
| No distribuzione utili | ☐ |
| Oggetto sociale: prodotti/servizi innovativi | ☐ |

**+ Almeno 1 dei seguenti:**
| Criterio | Soglia | Check |
|----------|--------|-------|
| Spese R&D | ≥15% del maggiore tra costi e fatturato | ☐ |
| Team qualificato | ≥1/3 dottorandi/PhD o ≥2/3 laurea magistrale | ☐ |
| Proprietà intellettuale | Brevetto o software registrato | ☐ |

### 6.2 Vantaggi Startup Innovativa

| Vantaggio | Descrizione |
|-----------|-------------|
| Incentivi fiscali investitori | 30-50% detrazione/deduzione |
| Fail fast | Liquidazione semplificata |
| Work for equity | Agevolazioni fiscali |
| Credito d'imposta R&D | Fino al 50% |
| Smart & Start | Finanziamenti agevolati Invitalia |
| Visto startup | Visto per founder extra-UE |

---

## 7. COSTI STIMATI PRIMO ANNO

| Voce | Costo Stimato | Note |
|------|---------------|------|
| Costituzione SRLS | €300-500 | Notaio incluso |
| Commercialista | €1.500-3.000/anno | Gestione base |
| Avvocato startup | €1.000-2.000 | Patto + contratti base |
| PEC + firma digitale | €100/anno | Obbligatori |
| Registrazione marchio IT | €200 | Opzionale ma consigliato |
| Registrazione marchio EU | €900 | Se espansione EU |
| **TOTALE MINIMO** | **€3.000-6.000** | Primo anno |

---

*Legal Starter Pack generato da Startup Arsenal*
*Consultare sempre un avvocato per documenti definitivi*

Sii SPECIFICO per questa startup.`
    }
  ]
};
