// Forge Studio Screener Types

// Modello di business
export type BusinessModel = 'b2b' | 'b2c' | 'b2b2c';

// Settore/Verticale
export type Settore = 
  | 'software-saas' | 'ai-ml' | 'cybersecurity' | 'cloud-devops'
  | 'fintech-payments' | 'insurtech' | 'legaltech' | 'regtech' | 'proptech-real-estate'
  | 'healthtech' | 'biotech' | 'medtech' | 'pharma' | 'wellness-fitness'
  | 'ecommerce-retail' | 'marketplace' | 'foodtech' | 'travel-hospitality'
  | 'logistics-supply-chain' | 'manufacturing-industry40' | 'agritech' | 'cleantech-energy'
  | 'edtech' | 'hrtech' | 'martech-adtech'
  | 'gaming-entertainment' | 'creator-economy' | 'social-community'
  | 'mobility-automotive' | 'spacetech' | 'iot-hardware'
  | 'altro';

// Legacy compatibility
export type Verticale = Settore;

export type FaseAttuale = 'idea' | 'mvp' | 'prodotto-live' | 'revenue';

export type CapTable = 'solo-founder' | 'founder-advisor' | 'sporca';

export type Competizione = 'oceano-blu' | 'affollato' | 'saturo';

export type Coachability = 'alta' | 'media' | 'bassa';

// Nuovo sistema binario: GO o PARK
export type Verdetto = 'GO' | 'PARK';

// Legacy compatibility
export type LegacyVerdetto = 'CORE' | 'SATELLITE' | 'REJECT';

// ==========================================
// 5 FILTRI CHIAVE DI VALUTAZIONE
// ==========================================

// 1. Problem Solving - risolve un problema reale?
export type ProblemValidation = 'validated' | 'assumed' | 'unclear';

export interface ProblemSolvingScore {
  validation: ProblemValidation;
  painLevel: 1 | 2 | 3 | 4 | 5;  // 1=nice-to-have, 5=critical
  targetUsers: string;           // chi ha il problema
  currentSolution: string;       // come lo risolvono oggi
}

// 2. Market Analysis
export interface MarketAnalysisScore {
  marketSize: 'small' | 'medium' | 'large' | 'massive';  // TAM
  competition: 'oceano-blu' | 'few-players' | 'crowded' | 'saturated';
  positioning: 'leader' | 'challenger' | 'niche' | 'unclear';
  revenueStreams: string[];      // es. ['subscription', 'transaction-fee']
}

// 3. Differenziazione
export type MoatType = 'tech-ip' | 'network-effects' | 'data-moat' | 'brand' | 'regulatory' | 'switching-cost' | 'none';

export interface DifferentiationScore {
  uniqueness: 1 | 2 | 3 | 4 | 5;  // quanto è unico
  moatTypes: MoatType[];          // tipi di barriere
  defensibility: 'easy-to-copy' | 'medium' | 'hard-to-copy' | 'protected';
}

// 4. Business Model - CAC:LTV almeno 1:3
export interface BusinessModelScore {
  hasBusinessModel: boolean;
  cacEstimate?: number;           // € costo acquisizione cliente
  ltvEstimate?: number;           // € lifetime value
  cacLtvRatio?: number;           // calcolato: ltv/cac (deve essere >= 3)
  marginType: 'negative' | 'low' | 'medium' | 'high';  // <0%, 0-30%, 30-60%, >60%
}

// 5. Traction - può generare facilmente clienti paganti?
export interface TractionScore {
  hasPayingCustomers: boolean;
  customersCount: number;
  revenueMonthly: number;         // MRR
  growthRate: number;             // % mensile
  acquisitionEase: 'very-hard' | 'hard' | 'medium' | 'easy';  // quanto è facile acquisire
}

// Aggregato 5 Filtri
export interface FiveFiltersScore {
  problemSolving: ProblemSolvingScore;
  marketAnalysis: MarketAnalysisScore;
  differentiation: DifferentiationScore;
  businessModel: BusinessModelScore;
  traction: TractionScore;
  // Score aggregato
  passedFilters: number;          // 0-5
  isEligible: boolean;            // passato almeno 4/5?
}

// ==========================================
// GAP ANALYSIS - Cosa possiamo offrire
// ==========================================
export interface GapAnalysis {
  needsMvp: boolean;              // serve sviluppo prodotto
  needsMarketAnalysis: boolean;   // serve analisi mercato
  needsBusinessModel: boolean;    // serve definizione business model
  needsFinance: boolean;          // serve CFO/contabilità
  needsTech: boolean;             // serve CTO
  needsMarketing: boolean;        // serve CMO
}

// ==========================================
// VALUTAZIONE POTENZIALE & COMPATIBILITÀ
// ==========================================
export type OperationalRole = 'cto' | 'cmo' | 'cfo';

export interface PotentialAssessment {
  revenueYear3: number;           // € revenue attesa anno 3
  revenueYear5: number;           // € revenue attesa anno 5
  exitPotential: 'low' | 'medium' | 'high' | 'massive';
  requiredRoles: OperationalRole[];  // quali ruoli servono
  forgeCompatibility: 'perfect' | 'good' | 'partial' | 'poor';
}

// ==========================================
// CORE vs SATELLITE - Basato su ruoli operativi
// ==========================================
export interface EngagementType {
  type: 'GO' | 'PARK';
  operationalRoles: OperationalRole[];  // ruoli che prendiamo (GO)
  equityForServices: boolean;           // quota per servizi
  servicesOffered: string[];            // cosa offriamo
}

// Metriche per tracking
export interface StartupMetrics {
  mrr?: number;           // Monthly Recurring Revenue
  arr?: number;           // Annual Recurring Revenue
  users?: number;         // Utenti attivi
  customers?: number;     // Clienti paganti
  growthRate?: number;    // % crescita mensile
  runway?: number;        // Mesi di runway
  burnRate?: number;      // Burn rate mensile
}

// Team info
export interface TeamInfo {
  foundersCount: number;
  fullTime: boolean;
  techInHouse: boolean;
  founderNames?: string[];
}

// Richiesta funding
export interface FundingRequest {
  amount?: number;        // € richiesti
  equityOffered?: number; // % equity offerta
  instrument: 'equity' | 'safe' | 'convertible' | 'none';
  valuation?: number;     // Valuation pre-money
}

export interface StartupInput {
  nome: string;
  businessModel: BusinessModel;  // B2B, B2C, B2B2C
  verticale: Verticale;          // Settore specifico
  fase: FaseAttuale;
  capTable: CapTable;
  competizione: Competizione;
  coachability: Coachability;
  descrizione?: string;
  
  // Metriche e info base
  metrics?: StartupMetrics;
  team?: TeamInfo;
  funding?: FundingRequest;
  website?: string;
  foundedDate?: string;
  
  // ==========================================
  // 5 FILTRI CHIAVE - Input descrittivi (AI valuta)
  // ==========================================
  
  // 1. Problem Solving - descrivi il problema che risolvi
  problemDescription?: string;      // "Quale problema risolvi? Per chi?"
  currentAlternatives?: string;     // "Come lo risolvono oggi senza di te?"
  
  // 2. Market Analysis - descrivi il mercato
  marketDescription?: string;       // "Descrivi il mercato e i competitor"
  targetCustomer?: string;          // "Chi e' il tuo cliente ideale?"
  
  // 3. Differenziazione - cosa ti rende unico
  uniquenessDescription?: string;   // "Cosa ti rende unico/difficile da copiare?"
  competitiveAdvantage?: string;    // "Qual e' il tuo vantaggio competitivo?"
  
  // 4. Business Model - come guadagni
  revenueModel?: string;            // "Come guadagni? Pricing?"
  unitEconomics?: string;           // "CAC, LTV, margini (se li conosci)"
  
  // 5. Traction - risultati finora
  tractionDescription?: string;     // "Clienti, revenue, crescita finora"
  
  // Metriche numeriche (opzionali, per chi le ha)
  cacEstimate?: number;
  ltvEstimate?: number;
  customersCount?: number;
  mrrCurrent?: number;
  
  // ==========================================
  // GAP ANALYSIS & COMPATIBILITÀ
  // ==========================================
  needsCto?: boolean;
  needsCmo?: boolean;
  needsCfo?: boolean;
  revenueYear3Estimate?: number;
  revenueYear5Estimate?: number;
}

// Startup salvata nel portfolio
export interface PortfolioStartup {
  id: string;
  input: StartupInput;
  result: ScreenerResult;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'exited' | 'failed' | 'watching';
  notes?: string;
  metricsHistory?: Array<{
    date: string;
    metrics: StartupMetrics;
  }>;
}

export interface PackageItem {
  titolo: string;
  descrizione: string;
  steps?: string[];
  deliverable?: string;
  timeline?: string;
  owner?: string;
}

export interface PackageOffer {
  nome: string;
  items: PackageItem[];
  prezzo: string;
  equityRange?: string;
  focus?: string;
  rationale?: string;
  tier?: 'CORE' | 'GROWTH' | 'BOOST';
}

export interface ScreenerResult {
  verdetto: Verdetto;
  verdettoLabel: string;
  reasoning: string;
  killSwitches: string[];
  strengths: string[];
  weaknesses: string[];
  packages: PackageOffer[];
  nextSteps: string[];
  aiInsights?: string;
  
  // 5 Filtri Score
  filtersScore?: {
    problemSolving: boolean;
    marketAnalysis: boolean;
    differentiation: boolean;
    businessModel: boolean;
    traction: boolean;
    passedCount: number;
  };
  
  // Gap Analysis
  gapsIdentified?: string[];
  servicesWeCanOffer?: string[];
  
  // Engagement Type
  engagementType?: 'GO' | 'PARK';
  operationalRoles?: OperationalRole[];
  equityProposed?: string;
}

// Labels Business Model
export const BUSINESS_MODEL_LABELS: Record<BusinessModel, { label: string; icon: string; desc: string }> = {
  'b2b': { label: 'B2B', icon: '🏢', desc: 'Vendi ad aziende' },
  'b2c': { label: 'B2C', icon: '👥', desc: 'Vendi a consumatori' },
  'b2b2c': { label: 'B2B2C', icon: '🔄', desc: 'Vendi ad aziende che servono consumatori' }
};

// Settori con icone e descrizioni per UI user-friendly
export const SETTORI_CONFIG: Array<{ id: Settore; label: string; icon: string; keywords: string[] }> = [
  { id: 'software-saas', label: 'Software / SaaS', icon: '💻', keywords: ['software', 'saas', 'app', 'platform', 'tool'] },
  { id: 'ai-ml', label: 'AI & Machine Learning', icon: '🤖', keywords: ['ai', 'ml', 'intelligenza artificiale', 'machine learning', 'nlp', 'computer vision'] },
  { id: 'cybersecurity', label: 'Cybersecurity', icon: '🔐', keywords: ['security', 'sicurezza', 'cyber', 'protezione', 'privacy'] },
  { id: 'cloud-devops', label: 'Cloud & DevOps', icon: '☁️', keywords: ['cloud', 'devops', 'infrastruttura', 'aws', 'azure'] },
  { id: 'fintech-payments', label: 'FinTech & Payments', icon: '💳', keywords: ['fintech', 'pagamenti', 'banking', 'crypto', 'investimenti'] },
  { id: 'insurtech', label: 'InsurTech', icon: '🛡️', keywords: ['assicurazione', 'insurance', 'polizza'] },
  { id: 'legaltech', label: 'LegalTech', icon: '⚖️', keywords: ['legal', 'legale', 'avvocato', 'contratti', 'compliance'] },
  { id: 'regtech', label: 'RegTech', icon: '📋', keywords: ['regolamentazione', 'compliance', 'normativa'] },
  { id: 'proptech-real-estate', label: 'PropTech & Real Estate', icon: '🏠', keywords: ['immobiliare', 'real estate', 'affitti', 'casa'] },
  { id: 'healthtech', label: 'HealthTech', icon: '🏥', keywords: ['salute', 'health', 'telemedicina', 'digital health'] },
  { id: 'biotech', label: 'BioTech', icon: '🧬', keywords: ['biotech', 'biotecnologia', 'ricerca'] },
  { id: 'medtech', label: 'MedTech', icon: '🩺', keywords: ['medical device', 'dispositivi medici'] },
  { id: 'pharma', label: 'Pharma & Drug Discovery', icon: '💊', keywords: ['farmaceutico', 'farmaci', 'drug'] },
  { id: 'wellness-fitness', label: 'Wellness & Fitness', icon: '🏋️', keywords: ['fitness', 'benessere', 'sport', 'palestra'] },
  { id: 'ecommerce-retail', label: 'E-Commerce & Retail', icon: '🛒', keywords: ['ecommerce', 'shop', 'vendita', 'retail'] },
  { id: 'marketplace', label: 'Marketplace', icon: '🏪', keywords: ['marketplace', 'piattaforma', 'intermediazione'] },
  { id: 'foodtech', label: 'FoodTech', icon: '🍔', keywords: ['food', 'cibo', 'ristorante', 'delivery'] },
  { id: 'travel-hospitality', label: 'Travel & Hospitality', icon: '✈️', keywords: ['travel', 'viaggi', 'hotel', 'turismo'] },
  { id: 'logistics-supply-chain', label: 'Logistics & Supply Chain', icon: '📦', keywords: ['logistica', 'spedizioni', 'supply chain', 'magazzino'] },
  { id: 'manufacturing-industry40', label: 'Manufacturing & Industry 4.0', icon: '🏭', keywords: ['manifattura', 'industria', 'produzione', 'automazione'] },
  { id: 'agritech', label: 'AgriTech', icon: '🌾', keywords: ['agricoltura', 'farming', 'agri'] },
  { id: 'cleantech-energy', label: 'CleanTech & Energy', icon: '⚡', keywords: ['energia', 'sostenibilità', 'green', 'rinnovabili'] },
  { id: 'edtech', label: 'EdTech', icon: '📚', keywords: ['educazione', 'formazione', 'corsi', 'learning'] },
  { id: 'hrtech', label: 'HRTech', icon: '👔', keywords: ['hr', 'risorse umane', 'recruiting', 'talent'] },
  { id: 'martech-adtech', label: 'MarTech & AdTech', icon: '📢', keywords: ['marketing', 'advertising', 'pubblicità'] },
  { id: 'gaming-entertainment', label: 'Gaming & Entertainment', icon: '🎮', keywords: ['gaming', 'giochi', 'intrattenimento'] },
  { id: 'creator-economy', label: 'Creator Economy', icon: '🎬', keywords: ['creator', 'influencer', 'content'] },
  { id: 'social-community', label: 'Social & Community', icon: '💬', keywords: ['social', 'community', 'network'] },
  { id: 'mobility-automotive', label: 'Mobility & Automotive', icon: '🚗', keywords: ['mobilità', 'auto', 'trasporti', 'ev'] },
  { id: 'spacetech', label: 'SpaceTech', icon: '🚀', keywords: ['space', 'spazio', 'satellite'] },
  { id: 'iot-hardware', label: 'IoT & Hardware', icon: '📡', keywords: ['iot', 'hardware', 'sensori', 'dispositivi'] },
  { id: 'altro', label: 'Altro', icon: '📌', keywords: ['altro', 'other'] }
];

// Labels per compatibilità
export const VERTICALE_LABELS: Record<Settore, string> = SETTORI_CONFIG.reduce((acc, s) => {
  acc[s.id] = s.label;
  return acc;
}, {} as Record<Settore, string>);

// Verticali premium (priorità alta per CORE)
export const VERTICALI_PRIORITY: Record<'high' | 'medium' | 'low', Settore[]> = {
  high: ['software-saas', 'ai-ml', 'fintech-payments', 'legaltech', 'cybersecurity', 'healthtech'],
  medium: ['cloud-devops', 'regtech', 'proptech-real-estate', 'marketplace', 'edtech', 'cleantech-energy'],
  low: ['ecommerce-retail', 'foodtech', 'travel-hospitality', 'gaming-entertainment', 'creator-economy', 'altro']
};

export const FASE_LABELS: Record<FaseAttuale, string> = {
  'idea': 'Idea su carta',
  'mvp': 'MVP grezzo',
  'prodotto-live': 'Prodotto Live',
  'revenue': 'Revenue >1k/mese'
};

export const CAPTABLE_LABELS: Record<CapTable, string> = {
  'solo-founder': 'Solo Founder',
  'founder-advisor': 'Founder + Advisor',
  'sporca': 'Sporca/Troppi soci inattivi'
};

export const COMPETIZIONE_LABELS: Record<Competizione, string> = {
  'oceano-blu': 'Oceano Blu/Innovativo',
  'affollato': 'Affollato ma migliorabile',
  'saturo': 'Saturo/Commodity'
};

export const COACHABILITY_LABELS: Record<Coachability, string> = {
  'alta': 'Alta - ascolta e impara',
  'media': 'Media',
  'bassa': 'Bassa - testa dura'
};

// Colori verdetto - sistema binario GO/PARK
export const VERDETTO_COLORS: Record<Verdetto, { bg: string; text: string; border: string }> = {
  'GO': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500' },
  'PARK': { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500' }
};

// Legacy colors for compatibility
export const LEGACY_VERDETTO_COLORS: Record<LegacyVerdetto, { bg: string; text: string; border: string }> = {
  'CORE': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500' },
  'SATELLITE': { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500' },
  'REJECT': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500' }
};
