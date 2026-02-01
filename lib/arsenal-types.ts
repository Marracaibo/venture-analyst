// Startup Arsenal Types - Post-analysis generators

export type ArsenalCategory = 'attack' | 'fundraising' | 'growth' | 'validation' | 'legal';

export type ArsenalItemId = 
  // Attack - Landing & Outreach
  | 'landing-page'
  | 'email-sequences'
  | 'linkedin-pack'
  | 'cold-scripts'
  // Fundraising
  | 'investor-match'
  | 'pitch-deck'
  | 'financial-model'
  | 'pitch-qa-trainer'
  | 'executive-summary'
  | 'cap-table-sim'
  | 'investment-proposal'
  // Validation
  | 'interview-scripts'
  | 'experiment-tracker'
  | 'survey-generator'
  // Growth
  | 'competitor-radar'
  | 'roadmap-generator'
  // Legal
  | 'legal-starter-pack';

export interface ArsenalItem {
  id: ArsenalItemId;
  name: string;
  description: string;
  icon: string;
  category: ArsenalCategory;
  estimatedTime: string;
  outputType: 'code' | 'text' | 'spreadsheet' | 'interactive';
  howItWorks: string;
  whatYouGet: string[];
}

export interface GeneratedAsset {
  id: string;
  itemId: ArsenalItemId;
  content: string;
  metadata?: Record<string, unknown>;
  generatedAt: Date;
}

// Landing Page Generator Output
export interface LandingPageOutput {
  html: string;
  css: string;
  sections: {
    hero: { headline: string; subheadline: string; cta: string };
    problem: { title: string; painPoints: string[] };
    solution: { title: string; features: { icon: string; title: string; description: string }[] };
    socialProof: { testimonials: { quote: string; author: string; role: string }[] };
    pricing: { plans: { name: string; price: string; features: string[]; recommended: boolean }[] };
    faq: { questions: { q: string; a: string }[] };
    cta: { headline: string; buttonText: string };
  };
}

// Email Sequences Output
export interface EmailSequenceOutput {
  sequences: {
    name: string;
    description: string;
    emails: {
      subject: string;
      preview: string;
      body: string;
      sendDay: number;
      goal: string;
      abVariant?: { subject: string; body: string };
    }[];
  }[];
}

// LinkedIn Content Pack Output
export interface LinkedInPackOutput {
  posts: {
    day: number;
    type: 'text' | 'carousel' | 'poll' | 'story';
    hook: string;
    content: string;
    hashtags: string[];
    bestTime: string;
    carouselSlides?: string[];
    pollOptions?: string[];
  }[];
  profileOptimization: {
    headline: string;
    about: string;
    featuredContent: string[];
  };
}

// Investor Match Output
export interface InvestorMatchOutput {
  investors: {
    name: string;
    firm: string;
    type: 'vc' | 'angel' | 'corporate' | 'accelerator';
    checkSize: string;
    stage: string;
    sectors: string[];
    portfolio: string[];
    linkedIn?: string;
    twitter?: string;
    emailPattern?: string;
    whyMatch: string;
    recentDeals?: string[];
  }[];
  outreachStrategy: {
    warmIntros: string[];
    coldApproach: string;
    timing: string;
  };
}

// Financial Model Output
export interface FinancialModelOutput {
  assumptions: {
    name: string;
    value: string;
    editable: boolean;
  }[];
  projections: {
    year: number;
    revenue: number;
    costs: number;
    profit: number;
    customers: number;
    mrr: number;
    arr: number;
  }[];
  unitEconomics: {
    cac: number;
    ltv: number;
    ltvCacRatio: number;
    paybackMonths: number;
    grossMargin: number;
    churnRate: number;
  };
  fundingScenarios: {
    name: string;
    raise: number;
    dilution: number;
    runway: number;
    milestones: string[];
  }[];
  googleSheetsFormula: string; // Ready to paste
}

// Pitch Q&A Trainer Output
export interface PitchQAOutput {
  commonQuestions: {
    question: string;
    category: 'market' | 'team' | 'product' | 'traction' | 'financials' | 'competition';
    difficulty: 'easy' | 'medium' | 'hard' | 'killer';
    idealAnswer: string;
    redFlags: string[];
    tips: string;
  }[];
  practiceScenarios: {
    investorType: string;
    style: string;
    focusAreas: string[];
    likelyQuestions: string[];
  }[];
}

// Interview Scripts Output
export interface InterviewScriptsOutput {
  scripts: {
    type: 'problem-discovery' | 'solution-validation' | 'pricing-test' | 'competitor-intel';
    duration: string;
    questions: {
      question: string;
      purpose: string;
      followUps: string[];
      redFlags: string[];
      greenFlags: string[];
    }[];
    closingActions: string[];
  }[];
  recruitmentTemplates: {
    channel: string;
    message: string;
  }[];
}

// Experiment Tracker Output
export interface ExperimentTrackerOutput {
  experiments: {
    name: string;
    hypothesis: string;
    metric: string;
    target: string;
    duration: string;
    status: 'idea' | 'running' | 'complete';
    steps: string[];
    budget: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  notionTemplate: string; // Notion-compatible markdown
}

// All Arsenal Items Configuration
export const ARSENAL_ITEMS: ArsenalItem[] = [
  // 🌐 ATTACK - Landing & Outreach
  {
    id: 'landing-page',
    name: 'Landing Page Generator',
    description: 'Pagina web completa pronta per il deploy',
    icon: '🌐',
    category: 'attack',
    estimatedTime: '~15 sec',
    outputType: 'code',
    howItWorks: 'L\'AI analizza la tua idea, il problema che risolvi e il target per creare una landing page completa con copy persuasivo, sezioni ottimizzate per la conversione e codice HTML/TailwindCSS pronto da deployare.',
    whatYouGet: ['Hero section con headline e CTA', 'Sezione problema/soluzione', '3 testimonial realistici', 'Pricing table', 'FAQ section', 'Codice HTML completo']
  },
  {
    id: 'email-sequences',
    name: 'Email Sequences',
    description: '3 sequenze email con A/B test variants',
    icon: '📧',
    category: 'attack',
    estimatedTime: '~15 sec',
    outputType: 'text',
    howItWorks: 'Genera 3 sequenze email complete (cold outreach, follow-up post-demo, nurturing) con subject line A/B tested, body copy personalizzabile e timing ottimale per ogni invio.',
    whatYouGet: ['5 email cold outreach', '4 email post-demo', '6 email nurturing', 'Varianti A/B per subject', 'Template variabili', 'Best practices']
  },
  {
    id: 'linkedin-pack',
    name: 'LinkedIn Content Pack',
    description: '30 giorni di post + ottimizzazione profilo',
    icon: '💼',
    category: 'attack',
    estimatedTime: '~15 sec',
    outputType: 'text',
    howItWorks: 'Crea un piano editoriale completo per LinkedIn con post giornalieri, carousel template, poll strategici e ottimizzazione del profilo per posizionarti come thought leader nel tuo settore.',
    whatYouGet: ['30 post completi con hook', '5 carousel template', '4 poll strategici', 'Headline e About ottimizzati', 'Hashtag strategy', 'Orari migliori di posting']
  },
  {
    id: 'cold-scripts',
    name: 'Cold Pitch Scripts',
    description: 'Script per call, DM e video pitch',
    icon: '🎤',
    category: 'attack',
    estimatedTime: '~15 sec',
    outputType: 'text',
    howItWorks: 'Genera script collaudati per cold call, messaggi DM su LinkedIn/Instagram e video pitch, con gestione obiezioni e tecniche di chiusura per massimizzare il tasso di conversione.',
    whatYouGet: ['Script cold call completo', '5 DM sequence template', 'Video pitch 90 secondi', 'Elevator pitch 30 sec', '10 obiezioni + risposte', 'Voicemail script']
  },
  
  // 💰 FUNDRAISING
  {
    id: 'investor-match',
    name: 'Investor Match',
    description: '25 investitori ideali con contatti',
    icon: '🎯',
    category: 'fundraising',
    estimatedTime: '~15 sec',
    outputType: 'text',
    howItWorks: 'Analizza il tuo settore, stage e business model per identificare 25 investitori (VC, Angel, Corporate) che hanno già investito in startup simili, con strategia di contatto personalizzata.',
    whatYouGet: ['8 investitori perfect fit', '10 good fit', '7 worth a try', 'LinkedIn + email pattern', 'Strategia warm intro', 'Template outreach email']
  },
  {
    id: 'pitch-deck',
    name: 'Pitch Deck Structure',
    description: '12 slide stile YC con contenuti',
    icon: '📊',
    category: 'fundraising',
    estimatedTime: '~15 sec',
    outputType: 'text',
    howItWorks: 'Crea la struttura completa di un pitch deck da 12 slide seguendo il format Y Combinator, con contenuti specifici per ogni slide, speaker notes e suggerimenti di design.',
    whatYouGet: ['12 slide con contenuto', 'Speaker notes (60 sec/slide)', 'Suggerimenti visual', 'Struttura problema→soluzione', 'Slide financials', 'CTA e ask finale']
  },
  {
    id: 'financial-model',
    name: 'Financial Model',
    description: 'Proiezioni 3 anni + unit economics',
    icon: '💰',
    category: 'fundraising',
    estimatedTime: '~15 sec',
    outputType: 'spreadsheet',
    howItWorks: 'Costruisce un modello finanziario completo con assumptions modificabili, proiezioni revenue 3 anni, unit economics dettagliati e scenari di funding alternativi.',
    whatYouGet: ['20+ assumptions editabili', 'Proiezioni mensili Y1', 'Proiezioni trimestrali Y2-3', 'CAC/LTV/Payback analysis', '3 scenari funding', 'Formula Google Sheets']
  },
  {
    id: 'pitch-qa-trainer',
    name: 'Pitch Q&A Trainer',
    description: '30 domande killer + risposte ideali',
    icon: '🥊',
    category: 'fundraising',
    estimatedTime: '~15 sec',
    outputType: 'interactive',
    howItWorks: 'Prepara alle domande più difficili dei VC con 30 domande categorizzate per topic, risposte ideali strutturate, red flags da evitare e scenari di pratica con diversi tipi di investitori.',
    whatYouGet: ['30 domande killer', 'Risposte ideali complete', 'Red flags da evitare', '3 scenari di pratica', 'Framework STAR', '10 errori fatali']
  },
  {
    id: 'executive-summary',
    name: 'Executive Summary',
    description: 'Report completo 1-pager per investitori',
    icon: '📄',
    category: 'fundraising',
    estimatedTime: '~15 sec',
    outputType: 'text',
    howItWorks: 'Genera un Executive Summary professionale di 1-2 pagine che sintetizza tutti i dati dell\'analisi in un formato pronto per investitori, advisor o board members.',
    whatYouGet: ['One-pager professionale', 'Problem/Solution', 'Market opportunity', 'Business model', 'Traction highlights', 'Team overview', 'Ask & use of funds']
  },
  
  // 🧪 VALIDATION
  {
    id: 'interview-scripts',
    name: 'Interview Scripts',
    description: '4 script per customer discovery',
    icon: '🎙️',
    category: 'validation',
    estimatedTime: '~15 sec',
    outputType: 'text',
    howItWorks: 'Genera 4 script di intervista completi per validare problema, soluzione, pricing e competitor, con domande strutturate, follow-up e segnali green/red flag da identificare.',
    whatYouGet: ['Script problem discovery', 'Script solution validation', 'Script pricing test', 'Script competitor intel', 'Template recruitment', 'Framework sintesi']
  },
  {
    id: 'experiment-tracker',
    name: 'Experiment Tracker',
    description: '10 esperimenti prioritizzati + Notion template',
    icon: '🧪',
    category: 'validation',
    estimatedTime: '~15 sec',
    outputType: 'text',
    howItWorks: 'Crea 10 esperimenti di growth prioritizzati con ICE score, ipotesi strutturate, metriche target e un template Notion pronto da importare per tracciare i risultati.',
    whatYouGet: ['10 esperimenti dettagliati', 'ICE score per priorità', 'Metriche e target', 'Timeline 90 giorni', 'Template Notion', 'North star metric']
  },
  {
    id: 'survey-generator',
    name: 'Survey Generator',
    description: 'Questionario validazione + landing',
    icon: '📋',
    category: 'validation',
    estimatedTime: '~15 sec',
    outputType: 'text',
    howItWorks: 'Crea un questionario di validazione completo con domande di screening, Van Westendorp pricing, e strategia di distribuzione per raccogliere feedback significativo.',
    whatYouGet: ['20+ domande strutturate', 'Screening questions', 'Van Westendorp pricing', 'Template Typeform', 'Sample size calculator', 'Distribution strategy']
  },
  
  // 📈 GROWTH
  {
    id: 'competitor-radar',
    name: 'Competitor Radar',
    description: 'Tracking sheet + alert keywords',
    icon: '📡',
    category: 'growth',
    estimatedTime: '~15 sec',
    outputType: 'spreadsheet',
    howItWorks: 'Mappa 5-7 competitor con analisi dettagliata di pricing, feature, funding e team. Include matrice comparativa, Google Alerts keywords e opportunità di differenziazione.',
    whatYouGet: ['5-7 competitor analizzati', 'Feature comparison matrix', 'Pricing comparison', 'Alert keywords', 'Template Google Sheets', 'Gap analysis']
  },
  {
    id: 'roadmap-generator',
    name: 'Roadmap Completa',
    description: 'Roadmap 12 mesi ultra-dettagliata con milestones',
    icon: '🗺️',
    category: 'growth',
    estimatedTime: '~15 sec',
    outputType: 'text',
    howItWorks: 'Genera una roadmap completa a 12 mesi basata sull\'analisi della tua startup. Include milestones settimanali, OKR trimestrali, dipendenze tra task, risorse necessarie e criteri di successo per ogni fase.',
    whatYouGet: ['Roadmap 12 mesi dettagliata', 'OKR per trimestre', 'Milestones settimanali', 'Dipendenze e blockers', 'Team e risorse', 'KPI per fase', 'Template Notion/Asana']
  },
  
  // ⚖️ LEGAL
  {
    id: 'legal-starter-pack',
    name: 'Legal Starter Pack',
    description: 'Contratti soci, patti parasociali, NDA e templates',
    icon: '⚖️',
    category: 'legal',
    estimatedTime: '~15 sec',
    outputType: 'text',
    howItWorks: 'Genera tutti i documenti legali essenziali per una startup: patto tra soci, accordo di riservatezza, vesting agreement, IP assignment e checklist legale. Basato sulla struttura e settore della tua startup.',
    whatYouGet: ['Patto Parasociale completo', 'NDA bilaterale', 'Vesting Agreement 4 anni', 'IP Assignment', 'Founder Agreement', 'GDPR checklist', 'Clausole personalizzate']
  },
  {
    id: 'cap-table-sim',
    name: 'Cap Table Simulator',
    description: 'Simulatore diluzione multi-round',
    icon: '🥧',
    category: 'fundraising',
    estimatedTime: '~15 sec',
    outputType: 'spreadsheet',
    howItWorks: 'Simula la diluzione attraverso diversi round di funding (pre-seed, seed, Series A) mostrando l\'impatto sulla ownership dei founder e suggerendo termini founder-friendly.',
    whatYouGet: ['Cap table iniziale', '4 scenari di round', 'Dilution waterfall', 'ESOP recommendations', 'Formula Google Sheets', 'Term sheet tips']
  },
  {
    id: 'investment-proposal',
    name: 'Investment Proposal',
    description: 'Proposta di investimento professionale completa',
    icon: '📑',
    category: 'fundraising',
    estimatedTime: '~15 sec',
    outputType: 'text',
    howItWorks: 'Genera un documento di proposta di investimento completo basato sull\'analisi AI della startup. Include valutazione dettagliata, punti di forza/debolezza, pacchetti di investimento e termini suggeriti.',
    whatYouGet: ['Executive Summary', 'Valutazione AI 5 filtri', 'Analisi SWOT', 'Pacchetti investimento', 'Term sheet indicativo', 'Timeline e next steps']
  }
];

// Group items by category
export const ARSENAL_CATEGORIES = {
  attack: {
    name: '⚔️ Attack',
    description: 'Armi per acquisire clienti e visibilità',
    items: ARSENAL_ITEMS.filter(i => i.category === 'attack')
  },
  fundraising: {
    name: '💰 Fundraising',
    description: 'Kit completo per raccogliere fondi',
    items: ARSENAL_ITEMS.filter(i => i.category === 'fundraising')
  },
  validation: {
    name: '🧪 Validation',
    description: 'Strumenti per validare prima di costruire',
    items: ARSENAL_ITEMS.filter(i => i.category === 'validation')
  },
  growth: {
    name: '📈 Growth',
    description: 'Monitoraggio e crescita',
    items: ARSENAL_ITEMS.filter(i => i.category === 'growth')
  },
  legal: {
    name: '⚖️ Legal',
    description: 'Documenti legali e contratti tra soci',
    items: ARSENAL_ITEMS.filter(i => i.category === 'legal')
  }
};
