// Agent Types
export type AgentType = 'orchestrator' | 'market' | 'growth' | 'project' | 'devil' | 'scorer';

export interface AgentLog {
  id: string;
  agent: AgentType;
  message: string;
  timestamp: Date;
  status: 'running' | 'complete' | 'error';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  agent?: AgentType;
}

// Analysis Types
export interface Competitor {
  id: string;
  name: string;
  logo?: string;
  type: 'direct' | 'indirect';
  priceLevel: number; // 1-10 scale
  complexity: number; // 1-10 scale
  strengths: string[];
  weaknesses: string[];
  funding?: string;
  features?: string[];
  website?: string;
}

export interface MarketSize {
  tam: {
    value: string;
    description: string;
    formula: string;
  };
  sam: {
    value: string;
    description: string;
    formula: string;
  };
  som: {
    value: string;
    description: string;
    formula: string;
  };
}

export interface GrowthExperiment {
  id: string;
  title: string;
  description: string;
  budget: string;
  timeframe: string;
  expectedOutcome: string;
  priority: 'high' | 'medium' | 'low';
}

export interface EarlyAdopterPersona {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  painPoints: string[];
  whereToFind: string[];
  icebreaker?: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  week: 1 | 2 | 3 | 4;
  status: 'todo' | 'in-progress' | 'done';
  content?: string; // Pre-generated content (e.g., email template)
  category: 'validation' | 'marketing' | 'product' | 'sales';
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium';
  mitigation?: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
  linkedIn?: string;
  relevance: string;
  generatedMessage?: string;
}

// Main Analysis Result
export interface ScoreBreakdown {
  marketSize: number;        // 1-100: TAM/SAM potential
  competition: number;       // 1-100: competitive landscape (higher = less competition)
  executionRisk: number;     // 1-100: feasibility (higher = easier to execute)
  differentiation: number;   // 1-100: uniqueness of solution
  timing: number;            // 1-100: market timing (higher = better timing)
  overall: number;           // 1-100: weighted average
}

export interface AnalysisResult {
  id: string;
  ideaTitle: string;
  ideaDescription: string;
  verdict: 'green' | 'yellow' | 'red';
  verdictReason: string;
  scores: ScoreBreakdown;
  competitors: Competitor[];
  marketSize: MarketSize;
  growthExperiments: GrowthExperiment[];
  earlyAdopters: EarlyAdopterPersona[];
  roadmap: RoadmapTask[];
  risks: Risk[];
  contacts: Contact[];
  createdAt: Date;
  status: 'pending' | 'analyzing' | 'complete';
}

// Startup Idea Input
export interface StartupIdea {
  problem: string;
  solution: string;
  target: string;
  additionalContext?: string;
}

// Analysis State
export interface AnalysisState {
  currentIdea: StartupIdea | null;
  currentAnalysis: AnalysisResult | null;
  chatMessages: ChatMessage[];
  agentLogs: AgentLog[];
  isAnalyzing: boolean;
  currentAgent: AgentType | null;
  analysisProgress: number;
  clarificationNeeded: boolean;
  clarificationQuestions: string[];
}
