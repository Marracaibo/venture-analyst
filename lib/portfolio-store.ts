// Portfolio Store - Persistenza startup screenate
import { PortfolioStartup, StartupInput, ScreenerResult, StartupMetrics } from './screener-types';
import { getFavorites, getAnalysisHistory, SavedAnalysis } from './history';

const PORTFOLIO_KEY = 'forge_studio_portfolio';

// Genera ID unico
export function generateId(): string {
  return `startup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Ottieni tutte le startup dal portfolio
export function getPortfolio(): PortfolioStartup[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(PORTFOLIO_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

// Salva una nuova startup nel portfolio
export function saveToPortfolio(
  input: StartupInput,
  result: ScreenerResult
): PortfolioStartup {
  const portfolio = getPortfolio();
  
  const newStartup: PortfolioStartup = {
    id: generateId(),
    input,
    result,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: result.verdetto === 'PARK' ? 'watching' : 'active',
    metricsHistory: input.metrics ? [{
      date: new Date().toISOString(),
      metrics: input.metrics
    }] : []
  };
  
  portfolio.unshift(newStartup);
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
  
  return newStartup;
}

// Aggiorna una startup esistente
export function updateStartup(
  id: string,
  updates: Partial<Omit<PortfolioStartup, 'id' | 'createdAt'>>
): PortfolioStartup | null {
  const portfolio = getPortfolio();
  const index = portfolio.findIndex(s => s.id === id);
  
  if (index === -1) return null;
  
  portfolio[index] = {
    ...portfolio[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
  return portfolio[index];
}

// Aggiungi nuove metriche a una startup
export function addMetricsSnapshot(
  id: string,
  metrics: StartupMetrics
): PortfolioStartup | null {
  const portfolio = getPortfolio();
  const index = portfolio.findIndex(s => s.id === id);
  
  if (index === -1) return null;
  
  const startup = portfolio[index];
  const history = startup.metricsHistory || [];
  
  history.push({
    date: new Date().toISOString(),
    metrics
  });
  
  portfolio[index] = {
    ...startup,
    metricsHistory: history,
    input: {
      ...startup.input,
      metrics
    },
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
  return portfolio[index];
}

// Ottieni una startup per ID
export function getStartupById(id: string): PortfolioStartup | null {
  const portfolio = getPortfolio();
  return portfolio.find(s => s.id === id) || null;
}

// Elimina una startup
export function deleteStartup(id: string): boolean {
  const portfolio = getPortfolio();
  const filtered = portfolio.filter(s => s.id !== id);
  
  if (filtered.length === portfolio.length) return false;
  
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(filtered));
  return true;
}

// Filtra portfolio per verdetto
export function getPortfolioByVerdetto(verdetto: 'GO' | 'PARK'): PortfolioStartup[] {
  return getPortfolio().filter(s => s.result.verdetto === verdetto);
}

// Filtra portfolio per status
export function getPortfolioByStatus(status: PortfolioStartup['status']): PortfolioStartup[] {
  return getPortfolio().filter(s => s.status === status);
}

// Statistiche portfolio
export interface PortfolioStats {
  total: number;
  go: number;
  park: number;
  active: number;
  watching: number;
  exited: number;
  failed: number;
  totalMRR: number;
  avgEquity: number;
  byVerticale: Record<string, number>;
}

export function getPortfolioStats(): PortfolioStats {
  const portfolio = getPortfolio();
  
  const stats: PortfolioStats = {
    total: portfolio.length,
    go: portfolio.filter(s => s.result.verdetto === 'GO').length,
    park: portfolio.filter(s => s.result.verdetto === 'PARK').length,
    active: portfolio.filter(s => s.status === 'active').length,
    watching: portfolio.filter(s => s.status === 'watching').length,
    exited: portfolio.filter(s => s.status === 'exited').length,
    failed: portfolio.filter(s => s.status === 'failed').length,
    totalMRR: 0,
    avgEquity: 0,
    byVerticale: {}
  };
  
  // Calcola MRR totale
  portfolio.forEach(s => {
    if (s.input.metrics?.mrr) {
      stats.totalMRR += s.input.metrics.mrr;
    }
    
    // Count by verticale
    const v = s.input.verticale;
    stats.byVerticale[v] = (stats.byVerticale[v] || 0) + 1;
  });
  
  return stats;
}

// ==========================================
// IMPORT DA VVA (Virtual Venture Analyst)
// ==========================================

// Ottieni preferiti VVA disponibili per import
export function getVVAFavorites(): SavedAnalysis[] {
  return getFavorites();
}

// Ottieni cronologia VVA disponibile per import
export function getVVAHistory(): SavedAnalysis[] {
  return getAnalysisHistory();
}

// Converti analisi VVA in formato Portfolio
function convertVVAToPortfolio(vva: SavedAnalysis): PortfolioStartup {
  const verdict = vva.analysis.verdict;
  let verdetto: 'GO' | 'PARK' = 'PARK';
  let verdettoLabel = 'Park - Non ora';
  
  if (verdict === 'green') {
    verdetto = 'GO';
    verdettoLabel = 'Go - Co-Founding Partnership';
  }

  const input: StartupInput = {
    nome: vva.title || 'Startup VVA',
    businessModel: 'b2b',
    verticale: 'software-saas',
    fase: 'idea',
    capTable: 'solo-founder',
    competizione: 'affollato',
    coachability: 'alta',
    descrizione: vva.idea.problem + ' ' + vva.idea.solution,
    problemDescription: vva.idea.problem,
    targetCustomer: vva.idea.target,
    uniquenessDescription: vva.idea.additionalContext,
  };

  const result: ScreenerResult = {
    verdetto,
    verdettoLabel,
    reasoning: vva.analysis.ideaDescription || '',
    killSwitches: [],
    strengths: vva.analysis.competitors?.flatMap(c => c.strengths || []).slice(0, 5) || [],
    weaknesses: vva.analysis.risks?.map(r => r.title) || [],
    packages: [],
    nextSteps: vva.analysis.roadmap?.map(t => t.title) || [],
  };

  return {
    id: `vva_${vva.id}`,
    input,
    result,
    createdAt: new Date(vva.timestamp).toISOString(),
    updatedAt: new Date().toISOString(),
    status: verdetto === 'PARK' ? 'watching' : 'active',
    notes: `Importato da VVA - Verdict originale: ${verdict}`,
  };
}

// Importa un preferito VVA nel portfolio
export function importFromVVA(vvaId: string): PortfolioStartup | null {
  const favorites = getFavorites();
  const history = getAnalysisHistory();
  const all = [...favorites, ...history];
  
  const vva = all.find(f => f.id === vvaId);
  if (!vva) return null;
  
  // Controlla se già importato
  const portfolio = getPortfolio();
  const alreadyExists = portfolio.some(p => p.id === `vva_${vvaId}`);
  if (alreadyExists) return null;
  
  const converted = convertVVAToPortfolio(vva);
  
  portfolio.unshift(converted);
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
  
  return converted;
}

// Importa tutti i preferiti VVA
export function importAllVVAFavorites(): number {
  const favorites = getFavorites();
  const portfolio = getPortfolio();
  let imported = 0;
  
  for (const fav of favorites) {
    const alreadyExists = portfolio.some(p => p.id === `vva_${fav.id}`);
    if (!alreadyExists) {
      const converted = convertVVAToPortfolio(fav);
      portfolio.unshift(converted);
      imported++;
    }
  }
  
  if (imported > 0) {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
  }
  
  return imported;
}
