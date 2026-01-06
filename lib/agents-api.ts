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
  AgentType,
  ScoreBreakdown
} from './types';
import { generateId } from './utils';

// Agent log callback type
type LogCallback = (agent: AgentType, message: string, status: 'running' | 'complete' | 'error') => void;
type ProgressCallback = (progress: number) => void;

// Call the API for a specific agent
async function callAgent(
  agent: AgentType,
  idea: StartupIdea,
  context?: Record<string, unknown>
): Promise<unknown> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agent, idea, context }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Agent ${agent} failed`);
  }

  const data = await response.json();
  return data.result;
}

// Type definitions for API responses
interface MarketResult {
  competitors: Array<Omit<Competitor, 'id'>>;
  marketSize: MarketSize;
}

interface GrowthResult {
  experiments: Array<Omit<GrowthExperiment, 'id'>>;
  earlyAdopters: Array<Omit<EarlyAdopterPersona, 'id'>>;
  contacts: Array<Omit<Contact, 'id'>>;
}

interface ProjectResult {
  roadmap: Array<Omit<RoadmapTask, 'id' | 'status'>>;
}

interface DevilResult {
  risks: Array<Omit<Risk, 'id'>>;
}

interface ScorerResult {
  scores: ScoreBreakdown;
  reasoning: {
    marketSize: string;
    competition: string;
    executionRisk: string;
    differentiation: string;
    timing: string;
  };
}

// Main analysis function using real Claude API
export async function runAnalysisWithAI(
  idea: StartupIdea,
  onLog: LogCallback,
  onProgress: ProgressCallback,
  onAgentChange: (agent: AgentType) => void
): Promise<AnalysisResult> {
  
  let marketResult: MarketResult | null = null;
  let growthResult: GrowthResult | null = null;
  let projectResult: ProjectResult | null = null;
  let devilResult: DevilResult | null = null;
  let scorerResult: ScorerResult | null = null;
  let verdict: { type: 'green' | 'yellow' | 'red'; reason: string } = { type: 'yellow', reason: '' };

  try {
    // Step 1: Orchestrator
    onAgentChange('orchestrator');
    onLog('orchestrator', 'Inizializzazione analisi con Claude AI...', 'running');
    onProgress(5);

    const orchestratorResult = await callAgent('orchestrator', idea) as {
      needsClarification: boolean;
      clarificationQuestions: string[];
      parsedIdea: { problem: string; solution: string; target: string };
      initialVerdict: { type: 'green' | 'yellow' | 'red'; reason: string };
    };

    if (orchestratorResult.needsClarification) {
      onLog('orchestrator', 'Servono più dettagli...', 'complete');
      throw new Error('CLARIFICATION_NEEDED:' + JSON.stringify(orchestratorResult.clarificationQuestions));
    }

    verdict = orchestratorResult.initialVerdict;
    onLog('orchestrator', `Verdetto iniziale: ${verdict.type.toUpperCase()}`, 'complete');
    onProgress(15);

    // Step 2: Market Analyst
    onAgentChange('market');
    onLog('market', 'Ricerca competitor reali in corso...', 'running');
    
    marketResult = await callAgent('market', idea) as MarketResult;
    
    onLog('market', `Trovati ${marketResult?.competitors.length || 0} competitor. Mercato analizzato.`, 'complete');
    onProgress(35);

    // Step 3: Growth Hacker
    onAgentChange('growth');
    onLog('growth', 'Definizione strategia GTM...', 'running');
    
    growthResult = await callAgent('growth', idea, { 
      competitors: marketResult?.competitors,
      marketSize: marketResult?.marketSize 
    }) as GrowthResult;
    
    onLog('growth', `${growthResult?.experiments.length || 0} esperimenti definiti.`, 'complete');
    onProgress(55);

    // Step 4: Project Manager
    onAgentChange('project');
    onLog('project', 'Creazione roadmap esecutiva...', 'running');
    
    projectResult = await callAgent('project', idea, {
      experiments: growthResult?.experiments,
      earlyAdopters: growthResult?.earlyAdopters
    }) as ProjectResult;
    
    onLog('project', `Roadmap con ${projectResult?.roadmap.length || 0} task creata.`, 'complete');
    onProgress(75);

    // Step 5: Devil's Advocate
    onAgentChange('devil');
    onLog('devil', 'Stress test in corso...', 'running');
    
    devilResult = await callAgent('devil', idea, {
      competitors: marketResult?.competitors,
      marketSize: marketResult?.marketSize,
      experiments: growthResult?.experiments
    }) as DevilResult;
    
    onLog('devil', `${devilResult?.risks.length || 0} rischi critici identificati.`, 'complete');
    onProgress(82);

    // Step 6: Scorer - calculate scores
    onAgentChange('orchestrator');
    onLog('orchestrator', 'Calcolo punteggi finali...', 'running');
    
    scorerResult = await callAgent('scorer', idea, {
      competitors: marketResult?.competitors,
      marketSize: marketResult?.marketSize,
      risks: devilResult?.risks,
      experiments: growthResult?.experiments
    }) as ScorerResult;
    
    onLog('orchestrator', `Score complessivo: ${scorerResult?.scores.overall || 0}/100`, 'complete');
    onProgress(95);

    // Step 7: Final synthesis
    onLog('orchestrator', 'Sintesi finale del report...', 'running');

    // Keep the original verdict from orchestrator - don't override based on risks
    const criticalRisks = devilResult?.risks.filter(r => r.severity === 'critical').length || 0;
    if (criticalRisks >= 3 && verdict.type === 'green') {
      verdict = { type: 'yellow', reason: verdict.reason + ' (Nota: identificati diversi rischi critici da mitigare)' };
    }

    onLog('orchestrator', 'Report completo generato con Claude AI.', 'complete');
    onProgress(100);

    // Build final result
    return {
      id: generateId(),
      ideaTitle: idea.solution.split(' ').slice(0, 5).join(' '),
      ideaDescription: `${idea.problem} → ${idea.solution}`,
      verdict: verdict.type,
      verdictReason: verdict.reason,
      scores: scorerResult?.scores || {
        marketSize: 50,
        competition: 50,
        executionRisk: 50,
        differentiation: 50,
        timing: 50,
        overall: 50,
      },
      competitors: (marketResult?.competitors || []).map(c => ({
        ...c,
        id: generateId(),
      })),
      marketSize: marketResult?.marketSize || {
        tam: { value: 'N/A', description: '', formula: '' },
        sam: { value: 'N/A', description: '', formula: '' },
        som: { value: 'N/A', description: '', formula: '' },
      },
      growthExperiments: (growthResult?.experiments || []).map(e => ({
        ...e,
        id: generateId(),
      })),
      earlyAdopters: (growthResult?.earlyAdopters || []).map(p => ({
        ...p,
        id: generateId(),
      })),
      roadmap: (projectResult?.roadmap || []).map(t => ({
        ...t,
        id: generateId(),
        status: 'todo' as const,
      })),
      risks: (devilResult?.risks || []).map(r => ({
        ...r,
        id: generateId(),
      })),
      contacts: (growthResult?.contacts || []).map(c => ({
        ...c,
        id: generateId(),
      })),
      createdAt: new Date(),
      status: 'complete',
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Check if it's a clarification request
    if (errorMessage.startsWith('CLARIFICATION_NEEDED:')) {
      throw error;
    }
    
    onLog('orchestrator', `Errore: ${errorMessage}`, 'error');
    throw error;
  }
}

// Check if API is configured
export async function checkApiStatus(): Promise<{ configured: boolean; error?: string }> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        agent: 'orchestrator', 
        idea: { problem: 'test', solution: 'test', target: 'test' } 
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      if (error.error === 'ANTHROPIC_API_KEY not configured') {
        return { configured: false, error: 'API key non configurata' };
      }
      return { configured: true };
    }

    return { configured: true };
  } catch {
    return { configured: false, error: 'Errore di connessione' };
  }
}

// Generate icebreaker message using Claude
export async function generateIcebreakerWithAI(
  contact: Contact, 
  idea: StartupIdea
): Promise<string> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent: 'growth',
        idea,
        context: {
          generateIcebreaker: true,
          contact,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate icebreaker');
    }

    const data = await response.json();
    return data.result.icebreaker || generateFallbackIcebreaker(contact, idea);
  } catch {
    return generateFallbackIcebreaker(contact, idea);
  }
}

function generateFallbackIcebreaker(contact: Contact, idea: StartupIdea): string {
  return `Ciao ${contact.name.split(' ')[0]},

Ho visto il tuo lavoro come ${contact.role} presso ${contact.company} e mi ha colpito.

Sto lavorando su una soluzione per ${idea.problem.substring(0, 100)}... e credo che la tua esperienza potrebbe essere preziosa.

Saresti disponibile per una call di 15 minuti per condividere la tua prospettiva? Non è una vendita, solo ricerca.

Grazie!`;
}
