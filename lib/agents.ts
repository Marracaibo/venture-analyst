import { 
  StartupIdea, 
  AnalysisResult, 
  Competitor, 
  MarketSize, 
  GrowthExperiment, 
  EarlyAdopterPersona, 
  RoadmapTask, 
  Risk, 
  Contact,
  AgentType
} from './types';
import { generateId, delay } from './utils';

// Agent log callback type
type LogCallback = (agent: AgentType, message: string, status: 'running' | 'complete') => void;
type ProgressCallback = (progress: number) => void;

// Simulated analysis engine
export async function runAnalysis(
  idea: StartupIdea,
  onLog: LogCallback,
  onProgress: ProgressCallback,
  onAgentChange: (agent: AgentType) => void
): Promise<AnalysisResult> {
  
  // Step 1: Orchestrator initializes
  onAgentChange('orchestrator');
  onLog('orchestrator', 'Initializing analysis pipeline...', 'running');
  await delay(800);
  onLog('orchestrator', 'Parsing startup idea components...', 'running');
  await delay(600);
  onLog('orchestrator', 'Dispatching to specialized agents...', 'complete');
  onProgress(10);

  // Step 2: Market Analyst
  onAgentChange('market');
  onLog('market', 'Searching Crunchbase for competitor data...', 'running');
  await delay(1200);
  onLog('market', 'Analyzing ProductHunt for similar products...', 'running');
  await delay(1000);
  onLog('market', 'Calculating TAM/SAM/SOM using Fermi estimation...', 'running');
  await delay(1500);
  const competitors = generateCompetitors(idea);
  const marketSize = generateMarketSize(idea);
  onLog('market', `Found ${competitors.length} competitors. Market analysis complete.`, 'complete');
  onProgress(35);

  // Step 3: Growth Hacker
  onAgentChange('growth');
  onLog('growth', 'Identifying early adopter segments...', 'running');
  await delay(1000);
  onLog('growth', 'Designing lean GTM experiments...', 'running');
  await delay(1200);
  onLog('growth', 'Generating outreach templates...', 'running');
  await delay(800);
  const experiments = generateExperiments(idea);
  const earlyAdopters = generateEarlyAdopters(idea);
  const contacts = generateContacts(idea);
  onLog('growth', 'GTM strategy defined with 3 experiments.', 'complete');
  onProgress(55);

  // Step 4: Project Manager
  onAgentChange('project');
  onLog('project', 'Creating 4-week execution roadmap...', 'running');
  await delay(1000);
  onLog('project', 'Generating task templates and content...', 'running');
  await delay(1200);
  const roadmap = generateRoadmap(idea);
  onLog('project', 'Roadmap complete with actionable tasks.', 'complete');
  onProgress(75);

  // Step 5: Devil's Advocate
  onAgentChange('devil');
  onLog('devil', 'Analyzing potential failure points...', 'running');
  await delay(1000);
  onLog('devil', 'Stress testing business model assumptions...', 'running');
  await delay(1200);
  onLog('devil', 'Identifying competitive moat weaknesses...', 'running');
  await delay(800);
  const risks = generateRisks(idea);
  onLog('devil', 'Identified 3 critical risks. Analysis complete.', 'complete');
  onProgress(90);

  // Step 6: Orchestrator synthesizes
  onAgentChange('orchestrator');
  onLog('orchestrator', 'Synthesizing all agent outputs...', 'running');
  await delay(800);
  const verdict = calculateVerdict(competitors, marketSize, risks);
  onLog('orchestrator', 'Final report assembled.', 'complete');
  onProgress(100);

  // Generate mock scores
  const mockScores = {
    marketSize: Math.floor(Math.random() * 40) + 40, // 40-80
    competition: Math.floor(Math.random() * 40) + 30, // 30-70
    executionRisk: Math.floor(Math.random() * 40) + 35, // 35-75
    differentiation: Math.floor(Math.random() * 40) + 30, // 30-70
    timing: Math.floor(Math.random() * 40) + 40, // 40-80
    overall: 0,
  };
  mockScores.overall = Math.round(
    mockScores.marketSize * 0.25 +
    mockScores.competition * 0.20 +
    mockScores.executionRisk * 0.20 +
    mockScores.differentiation * 0.20 +
    mockScores.timing * 0.15
  );

  return {
    id: generateId(),
    ideaTitle: extractTitle(idea),
    ideaDescription: `${idea.problem} → ${idea.solution}`,
    verdict: verdict.type,
    verdictReason: verdict.reason,
    scores: mockScores,
    competitors,
    marketSize,
    growthExperiments: experiments,
    earlyAdopters,
    roadmap,
    risks,
    contacts,
    createdAt: new Date(),
    status: 'complete',
  };
}

// Check if idea needs clarification
export function needsClarification(idea: Partial<StartupIdea>): { needed: boolean; questions: string[] } {
  const questions: string[] = [];
  
  if (!idea.problem || idea.problem.length < 20) {
    questions.push('Qual è il problema specifico che vuoi risolvere? Descrivi il "pain point" del tuo target.');
  }
  
  if (!idea.solution || idea.solution.length < 20) {
    questions.push('Come risolvi questo problema? Qual è la tua soluzione unica?');
  }
  
  if (!idea.target || idea.target.length < 10) {
    questions.push('Chi è il tuo cliente ideale? (es. "PMI italiane nel settore legale", "Freelancer creativi under 35")');
  }
  
  return {
    needed: questions.length > 0,
    questions,
  };
}

// Parse user input to extract idea components
export function parseIdeaFromInput(input: string): Partial<StartupIdea> {
  const lowerInput = input.toLowerCase();
  
  // Try to extract problem, solution, target from natural language
  const idea: Partial<StartupIdea> = {};
  
  // Simple heuristics - in production, this would use NLP
  if (lowerInput.includes('problema') || lowerInput.includes('difficoltà')) {
    const problemMatch = input.match(/problema[:\s]+([^.]+)/i);
    if (problemMatch) idea.problem = problemMatch[1].trim();
  }
  
  if (lowerInput.includes('soluzione') || lowerInput.includes('risolvo')) {
    const solutionMatch = input.match(/soluzione[:\s]+([^.]+)/i);
    if (solutionMatch) idea.solution = solutionMatch[1].trim();
  }
  
  if (lowerInput.includes('target') || lowerInput.includes('clienti')) {
    const targetMatch = input.match(/target[:\s]+([^.]+)/i);
    if (targetMatch) idea.target = targetMatch[1].trim();
  }
  
  // If no structured format, use the whole input as context
  if (!idea.problem && !idea.solution && !idea.target) {
    idea.additionalContext = input;
  }
  
  return idea;
}

// Helper functions to generate mock data (in production, these would call AI APIs)

function extractTitle(idea: StartupIdea): string {
  const words = idea.solution.split(' ').slice(0, 5).join(' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function generateCompetitors(idea: StartupIdea): Competitor[] {
  const target = idea.target.toLowerCase();
  const solution = idea.solution.toLowerCase();
  
  // Generate contextual competitors based on the idea
  const competitors: Competitor[] = [
    {
      id: generateId(),
      name: 'Competitor Alpha',
      type: 'direct',
      priceLevel: 7,
      complexity: 8,
      strengths: ['Brand riconosciuto', 'Ampia base utenti', 'Funding significativo'],
      weaknesses: ['Prodotto complesso', 'Pricing enterprise', 'Lento ad innovare'],
      funding: '$15M Series B',
      features: ['Feature A', 'Feature B', 'Feature C'],
      website: 'https://competitor-alpha.com',
    },
    {
      id: generateId(),
      name: 'Competitor Beta',
      type: 'direct',
      priceLevel: 4,
      complexity: 5,
      strengths: ['Prezzo competitivo', 'UX semplice', 'Crescita rapida'],
      weaknesses: ['Funzionalità limitate', 'Supporto scarso', 'Poca personalizzazione'],
      funding: '$3M Seed',
      features: ['Feature X', 'Feature Y'],
      website: 'https://competitor-beta.io',
    },
    {
      id: generateId(),
      name: 'Incumbent Corp',
      type: 'indirect',
      priceLevel: 9,
      complexity: 9,
      strengths: ['Market leader', 'Integrazioni enterprise', 'Team vendite globale'],
      weaknesses: ['Legacy technology', 'Non focalizzato sul problema', 'Costi nascosti'],
      funding: 'Public Company',
      features: ['Suite completa', 'API enterprise'],
      website: 'https://incumbent-corp.com',
    },
  ];
  
  // Customize based on context
  if (target.includes('legal') || target.includes('avvocat')) {
    competitors[0].name = 'LegalTech Pro';
    competitors[1].name = 'JurisAI';
    competitors[2].name = 'Thomson Reuters';
  } else if (target.includes('health') || target.includes('medic')) {
    competitors[0].name = 'HealthFlow';
    competitors[1].name = 'MediTrack';
    competitors[2].name = 'Epic Systems';
  } else if (target.includes('fintech') || target.includes('finanz')) {
    competitors[0].name = 'FinanceHub';
    competitors[1].name = 'MoneyWise';
    competitors[2].name = 'Bloomberg';
  }
  
  return competitors;
}

function generateMarketSize(idea: StartupIdea): MarketSize {
  return {
    tam: {
      value: '$12.5B',
      description: 'Mercato globale totale del settore',
      formula: 'Numero totale aziende target × Spesa media annua per soluzioni simili',
    },
    sam: {
      value: '$850M',
      description: 'Mercato servibile in Italia/Europa',
      formula: 'TAM × % aziende in mercato geografico target × % con problema specifico',
    },
    som: {
      value: '$25M',
      description: 'Quota realisticamente raggiungibile in 3 anni',
      formula: 'SAM × 3% market share realistico per startup early-stage',
    },
  };
}

function generateExperiments(idea: StartupIdea): GrowthExperiment[] {
  return [
    {
      id: generateId(),
      title: 'LinkedIn Outreach Campaign',
      description: `Creare 5 post su LinkedIn indirizzati a decision maker nel settore ${idea.target}. Focus su pain point specifici.`,
      budget: '€0 - Solo tempo',
      timeframe: 'Settimana 1-2',
      expectedOutcome: '50+ connessioni qualificate, 5-10 conversazioni',
      priority: 'high',
    },
    {
      id: generateId(),
      title: 'Cold Email a 50 Prospect',
      description: 'Identificare 50 aziende target e inviare email personalizzate con value proposition chiara.',
      budget: '€30 (email tool)',
      timeframe: 'Settimana 2-3',
      expectedOutcome: '10% response rate, 3-5 demo call',
      priority: 'high',
    },
    {
      id: generateId(),
      title: 'Landing Page + Waitlist',
      description: 'Creare una landing page con value proposition chiara e form per waitlist. Misurare conversion rate.',
      budget: '€0-50 (hosting)',
      timeframe: 'Settimana 1',
      expectedOutcome: '100+ visitatori, 15-20 iscrizioni waitlist',
      priority: 'medium',
    },
  ];
}

function generateEarlyAdopters(idea: StartupIdea): EarlyAdopterPersona[] {
  return [
    {
      id: generateId(),
      name: 'Marco - L\'Innovatore',
      role: 'Head of Operations',
      company: 'PMI Tech-Forward',
      painPoints: [
        'Frustrato da processi manuali',
        'Budget limitato per soluzioni enterprise',
        'Cerca vantaggio competitivo',
      ],
      whereToFind: [
        'LinkedIn (gruppi di settore)',
        'Eventi startup locali',
        'Podcast di business',
      ],
    },
    {
      id: generateId(),
      name: 'Giulia - L\'Early Adopter',
      role: 'Founder / CEO',
      company: 'Startup in crescita',
      painPoints: [
        'Tempo limitato per valutare soluzioni',
        'Cerca tool che scalino con l\'azienda',
        'Vuole ROI misurabile',
      ],
      whereToFind: [
        'Twitter/X tech community',
        'ProductHunt',
        'Acceleratori e incubatori',
      ],
    },
  ];
}

function generateRoadmap(idea: StartupIdea): RoadmapTask[] {
  return [
    // Week 1 - Validation
    {
      id: generateId(),
      title: 'Validazione Problema',
      description: 'Condurre 10 interviste con potenziali clienti per validare il problema',
      week: 1,
      status: 'todo',
      category: 'validation',
      content: `Script Intervista:
1. "Raccontami come gestisci attualmente [problema]?"
2. "Quali sono le maggiori frustrazioni?"
3. "Quanto tempo/denaro perdi per questo problema?"
4. "Hai provato altre soluzioni? Cosa non funzionava?"
5. "Se esistesse una soluzione ideale, come sarebbe?"`,
    },
    {
      id: generateId(),
      title: 'Creazione Landing Page',
      description: 'Sviluppare landing page con value proposition e waitlist',
      week: 1,
      status: 'todo',
      category: 'marketing',
      content: `Struttura Landing Page:
- Hero: Headline che cattura il pain point
- Problem: 3 bullet point sui problemi attuali
- Solution: Come risolvi (senza dettagli tecnici)
- Social Proof: Anche solo "Unisciti a X professionisti"
- CTA: Form email per waitlist
- Footer: Link a LinkedIn personale per credibilità`,
    },
    // Week 2 - Outreach
    {
      id: generateId(),
      title: 'LinkedIn Content Strategy',
      description: 'Pubblicare 5 post su LinkedIn sul problema che risolvi',
      week: 2,
      status: 'todo',
      category: 'marketing',
      content: `Post 1: "Il problema nascosto che costa €X alle aziende..."
Post 2: "Ho intervistato 10 [target] e ho scoperto che..."
Post 3: "3 modi in cui le aziende affrontano [problema] (e perché falliscono)"
Post 4: "Sto costruendo qualcosa per risolvere [problema]. Feedback?"
Post 5: "Lezioni apprese dalle prime 10 conversazioni con [target]"`,
    },
    {
      id: generateId(),
      title: 'Cold Email Campaign',
      description: 'Inviare email personalizzate a 50 prospect qualificati',
      week: 2,
      status: 'todo',
      category: 'sales',
      content: `Subject: Domanda veloce su [problema specifico]

Ciao [Nome],

Ho notato che [azienda] sta [attività rilevante]. 

Sto lavorando su una soluzione per [problema] e mi piacerebbe capire come lo gestite attualmente.

Saresti disponibile per una call di 15 minuti questa settimana?

Non è una vendita - solo ricerca per costruire qualcosa di utile.

[Tuo Nome]`,
    },
    // Week 3 - MVP
    {
      id: generateId(),
      title: 'MVP Definition',
      description: 'Definire le feature minime per il primo test con utenti reali',
      week: 3,
      status: 'todo',
      category: 'product',
      content: `MVP Checklist:
□ Una sola feature core che risolve il problema principale
□ Onboarding in meno di 2 minuti
□ Nessuna registrazione richiesta per provare
□ Feedback loop integrato (come raccogliere input)
□ Metriche base: chi usa cosa, per quanto tempo`,
    },
    {
      id: generateId(),
      title: 'Pilot Program Setup',
      description: 'Configurare programma pilota con 3-5 early adopter',
      week: 3,
      status: 'todo',
      category: 'sales',
      content: `Offerta Pilot:
- Accesso gratuito per 30 giorni
- Supporto diretto via WhatsApp/Slack
- Call settimanale di feedback
- In cambio: testimonianza se soddisfatti
- Prezzo speciale "founding member" se continuano`,
    },
    // Week 4 - Iterate
    {
      id: generateId(),
      title: 'Analisi Feedback & Iteration',
      description: 'Raccogliere feedback dai pilot e iterare sul prodotto',
      week: 4,
      status: 'todo',
      category: 'product',
    },
    {
      id: generateId(),
      title: 'Pricing Strategy',
      description: 'Definire pricing basato su value e feedback ricevuto',
      week: 4,
      status: 'todo',
      category: 'sales',
      content: `Framework Pricing:
1. Quanto risparmia/guadagna il cliente? (Value)
2. Quanto costa la soluzione attuale? (Anchor)
3. Qual è il budget tipico? (Willingness to pay)
4. Modello: Subscription vs Usage-based vs One-time
5. Tier: Free trial → Pro → Enterprise`,
    },
  ];
}

function generateRisks(idea: StartupIdea): Risk[] {
  return [
    {
      id: generateId(),
      title: 'Barriere all\'Entrata Inesistenti',
      description: 'Se la soluzione è facilmente replicabile, competitor con più risorse potrebbero copiarla rapidamente. Senza un moat tecnologico o di network effect, il vantaggio competitivo è fragile.',
      severity: 'critical',
      mitigation: 'Costruire network effect, lock-in tramite dati, o expertise di dominio difficile da replicare.',
    },
    {
      id: generateId(),
      title: 'Dipendenza da Piattaforma Esterna',
      description: 'Se il business dipende da API di terze parti (es. OpenAI, social media), cambiamenti di pricing o policy potrebbero essere fatali.',
      severity: 'high',
      mitigation: 'Diversificare fornitori, costruire alternative in-house per componenti critici.',
    },
    {
      id: generateId(),
      title: 'Ciclo di Vendita Lungo',
      description: 'Se il target sono enterprise o settori regolamentati, il ciclo di vendita potrebbe essere 6-12 mesi, richiedendo runway significativo.',
      severity: 'high',
      mitigation: 'Iniziare con PMI per validare, poi scalare verso enterprise. Considerare modello PLG.',
    },
  ];
}

function generateContacts(idea: StartupIdea): Contact[] {
  return [
    {
      id: generateId(),
      name: 'Alessandro Rossi',
      role: 'VP Operations',
      company: 'TechCorp Italia',
      relevance: 'Decision maker nel settore target, attivo su LinkedIn',
      avatar: undefined,
    },
    {
      id: generateId(),
      name: 'Francesca Bianchi',
      role: 'Head of Innovation',
      company: 'Enterprise Solutions SpA',
      relevance: 'Gestisce budget per nuove soluzioni, speaker a eventi',
      avatar: undefined,
    },
    {
      id: generateId(),
      name: 'Marco Verdi',
      role: 'Founder & CEO',
      company: 'StartupX',
      relevance: 'Early adopter seriale, influencer nel settore',
      avatar: undefined,
    },
    {
      id: generateId(),
      name: 'Laura Neri',
      role: 'Partner',
      company: 'VC Fund Italia',
      relevance: 'Investe in settore affine, potrebbe introdurre a portfolio',
      avatar: undefined,
    },
  ];
}

function calculateVerdict(
  competitors: Competitor[], 
  marketSize: MarketSize, 
  risks: Risk[]
): { type: 'green' | 'yellow' | 'red'; reason: string } {
  const criticalRisks = risks.filter(r => r.severity === 'critical').length;
  const directCompetitors = competitors.filter(c => c.type === 'direct').length;
  
  if (criticalRisks >= 2) {
    return {
      type: 'red',
      reason: 'Troppi rischi critici identificati. Necessaria pivot significativa o validazione più approfondita.',
    };
  }
  
  if (criticalRisks === 1 || directCompetitors >= 3) {
    return {
      type: 'yellow',
      reason: 'Idea promettente ma con sfide significative. Procedere con cautela e focus su differenziazione.',
    };
  }
  
  return {
    type: 'green',
    reason: 'Opportunità di mercato interessante con rischi gestibili. Procedere con validazione rapida.',
  };
}

// Generate icebreaker message for a contact
export function generateIcebreaker(contact: Contact, idea: StartupIdea): string {
  return `Ciao ${contact.name.split(' ')[0]},

Ho visto il tuo lavoro come ${contact.role} presso ${contact.company} e mi ha colpito [dettaglio specifico].

Sto lavorando su una soluzione per ${idea.problem.substring(0, 100)}... e credo che la tua esperienza potrebbe essere preziosa.

Saresti disponibile per una call di 15 minuti per condividere la tua prospettiva? Non è una vendita, solo ricerca.

Grazie!`;
}
