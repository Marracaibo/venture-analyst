'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Plus, 
  X, 
  Sparkles, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Trophy,
  Loader2,
  DollarSign,
  Target,
  Shield,
  BarChart3,
  Zap,
  History,
  Star,
  ChevronDown,
  Check,
  XCircle,
  Users2,
  Gauge
} from 'lucide-react';
import Link from 'next/link';
import { getAnalysisHistory, getFavorites, SavedAnalysis } from '@/lib/history';

interface Financials {
  tamNumeric: number;
  avgTicket: number;
  estimatedCAC: number;
  grossMargin: number;
  year1Customers: number;
  year2Customers: number;
  year3Customers: number;
  year1Revenue: number;
  year2Revenue: number;
  year3Revenue: number;
  breakEvenYear: number;
  ltv: number;
  ltvCacRatio: number;
}

interface Competitive {
  mainCompetitors: string[];
  moatStrength: 'strong' | 'medium' | 'weak';
  entryBarrier: 'high' | 'medium' | 'low';
}

interface ExecutionEase {
  score: number;
  level: 'easy' | 'medium' | 'hard';
  reason: string;
}

interface TeamRole {
  role: string;
  skills: string;
  priority: 'must-have' | 'nice-to-have';
}

interface IdealTeam {
  roles: TeamRole[];
  minTeamSize: number;
  keyHire: string;
}

interface CompareIdea {
  id: string;
  name: string;
  description: string;
  isLoading: boolean;
  analysis: {
    verdict: 'green' | 'yellow' | 'red';
    scores: {
      marketSize: number;
      competition: number;
      executionRisk: number;
      differentiation: number;
      timing: number;
      overall: number;
    };
    tam: string;
    competitorCount: number;
    riskCount: number;
    mvpWeeks: number;
    summary: string;
    pros?: string[];
    cons?: string[];
    executionEase?: ExecutionEase;
    idealTeam?: IdealTeam;
    financials?: Financials;
    competitive?: Competitive;
  } | null;
}

export default function ComparePage() {
  const [ideas, setIdeas] = useState<CompareIdea[]>([
    { id: '1', name: '', description: '', isLoading: false, analysis: null },
    { id: '2', name: '', description: '', isLoading: false, analysis: null },
  ]);
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
  const [favorites, setFavorites] = useState<SavedAnalysis[]>([]);
  const [showSelector, setShowSelector] = useState<string | null>(null);

  // Load saved analyses on mount
  useEffect(() => {
    setSavedAnalyses(getAnalysisHistory());
    setFavorites(getFavorites());
  }, []);

  // Load from saved analysis - just load the description, user clicks "Compare All" to analyze
  const loadFromSaved = (ideaId: string, saved: SavedAnalysis) => {
    // Build description from saved idea
    const idea = saved.idea as { problem?: string; solution?: string; target?: string };
    const description = [
      idea.problem && `Problema: ${idea.problem}`,
      idea.solution && `Soluzione: ${idea.solution}`,
      idea.target && `Target: ${idea.target}`,
    ].filter(Boolean).join('\n') || saved.title;

    setIdeas(ideas.map(i => i.id === ideaId ? {
      ...i,
      name: saved.title,
      description: description,
      analysis: null, // Don't set fake analysis - user clicks "Compare All"
    } : i));
    setShowSelector(null);
  };

  const addIdea = () => {
    if (ideas.length >= 3) return;
    setIdeas([...ideas, { 
      id: Date.now().toString(), 
      name: '', 
      description: '', 
      isLoading: false, 
      analysis: null 
    }]);
  };

  const removeIdea = (id: string) => {
    if (ideas.length <= 2) return;
    setIdeas(ideas.filter(i => i.id !== id));
  };

  const updateIdea = (id: string, field: 'name' | 'description', value: string) => {
    setIdeas(ideas.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const analyzeIdea = async (id: string) => {
    const idea = ideas.find(i => i.id === id);
    if (!idea || !idea.description.trim()) return;

    setIdeas(ideas.map(i => i.id === id ? { ...i, isLoading: true } : i));

    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: idea.description }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const result = await response.json();
      
      setIdeas(ideas.map(i => i.id === id ? { 
        ...i, 
        isLoading: false, 
        analysis: result,
        name: idea.name || result.name || 'Idea ' + id
      } : i));
    } catch (error) {
      console.error('Analysis error:', error);
      setIdeas(ideas.map(i => i.id === id ? { ...i, isLoading: false } : i));
    }
  };

  // Re-analyze all ideas with full data
  const compareAll = async () => {
    const ideasToAnalyze = ideas.filter(i => i.description.trim());
    if (ideasToAnalyze.length < 2) return;

    // Set all to loading
    setIdeas(ideas.map(i => i.description.trim() ? { ...i, isLoading: true, analysis: null } : i));

    // Analyze each sequentially
    for (const idea of ideasToAnalyze) {
      try {
        const response = await fetch('/api/compare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description: idea.description }),
        });

        if (!response.ok) throw new Error('Analysis failed');
        const result = await response.json();
        
        setIdeas(prev => prev.map(i => i.id === idea.id ? { 
          ...i, 
          isLoading: false, 
          analysis: result,
          name: idea.name || result.name || 'Idea'
        } : i));
      } catch (error) {
        console.error('Analysis error:', error);
        setIdeas(prev => prev.map(i => i.id === idea.id ? { ...i, isLoading: false } : i));
      }
    }
  };

  const analyzeAll = async () => {
    for (const idea of ideas) {
      if (idea.description.trim() && !idea.analysis) {
        await analyzeIdea(idea.id);
      }
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'green': return 'text-green-400 bg-green-500/20';
      case 'yellow': return 'text-yellow-400 bg-yellow-500/20';
      case 'red': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getVerdictEmoji = (verdict: string) => {
    switch (verdict) {
      case 'green': return '🟢';
      case 'yellow': return '🟡';
      case 'red': return '🔴';
      default: return '⚪';
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `€${(value / 1000).toFixed(0)}K`;
    return `€${value.toFixed(0)}`;
  };

  const allAnalyzed = ideas.every(i => i.analysis !== null || !i.description.trim());
  const hasAnalysis = ideas.some(i => i.analysis !== null);

  // Find winner
  const winner = ideas.reduce((best, current) => {
    if (!current.analysis) return best;
    if (!best || !best.analysis) return current;
    return current.analysis.scores.overall > best.analysis.scores.overall ? current : best;
  }, null as CompareIdea | null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border-subtle bg-surface-elevated sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-1 md:gap-2 text-text-muted hover:text-text-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Torna all'Analyst</span>
          </Link>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold text-text-primary">Comparison Mode</h1>
              <p className="text-xs text-text-muted hidden sm:block">Confronta fino a 3 idee</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Intro */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
            Confronta le tue idee <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple">side-by-side</span>
          </h2>
          <p className="text-sm md:text-base text-text-muted mb-4">
            Inserisci 2-3 idee e scopri quale ha il potenziale maggiore
          </p>
          
          {/* Compare All Button */}
          {ideas.filter(i => i.description.trim()).length >= 2 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={compareAll}
              disabled={ideas.some(i => i.isLoading)}
              className="px-6 py-3 bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto shadow-lg shadow-accent-purple/20"
            >
              {ideas.some(i => i.isLoading) ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analizzando...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  🔥 Compara Tutto
                </>
              )}
            </motion.button>
          )}
        </motion.div>

        {/* Ideas Grid */}
        <div className={`grid gap-4 md:gap-6 mb-8 ${ideas.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
          {ideas.map((idea, index) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface-elevated rounded-2xl border border-border-subtle overflow-hidden"
            >
              {/* Idea Header */}
              <div className="p-4 border-b border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-text-muted">#{index + 1}</span>
                  {idea.analysis && winner?.id === idea.id && (
                    <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> Migliore
                    </span>
                  )}
                </div>
                {ideas.length > 2 && (
                  <button
                    onClick={() => removeIdea(idea.id)}
                    className="p-1 hover:bg-red-500/20 rounded text-text-muted hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Input or Analysis */}
              <div className="p-4">
                {!idea.analysis ? (
                  <div className="space-y-3">
                    {/* Load from saved */}
                    {(savedAnalyses.length > 0 || favorites.length > 0) && (
                      <div className="relative">
                        <button
                          onClick={() => setShowSelector(showSelector === idea.id ? null : idea.id)}
                          className="w-full flex items-center justify-between px-3 py-2 bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg text-sm text-accent-cyan hover:bg-accent-cyan/20 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <History className="w-4 h-4" />
                            Carica da analisi salvate
                          </span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${showSelector === idea.id ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                          {showSelector === idea.id && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 right-0 mt-1 bg-surface-elevated border border-border-subtle rounded-lg shadow-xl z-20 max-h-48 overflow-y-auto"
                            >
                              {favorites.length > 0 && (
                                <div className="p-2 border-b border-border-subtle">
                                  <p className="text-[10px] text-yellow-400 font-medium px-2 mb-1 flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-400" /> Preferiti
                                  </p>
                                  {favorites.map(saved => (
                                    <button
                                      key={saved.id}
                                      onClick={() => loadFromSaved(idea.id, saved)}
                                      className="w-full text-left px-2 py-1.5 text-xs text-text-primary hover:bg-yellow-500/10 rounded transition-colors"
                                    >
                                      {saved.title}
                                    </button>
                                  ))}
                                </div>
                              )}
                              {savedAnalyses.length > 0 && (
                                <div className="p-2">
                                  <p className="text-[10px] text-text-muted font-medium px-2 mb-1">Recenti</p>
                                  {savedAnalyses.map(saved => (
                                    <button
                                      key={saved.id}
                                      onClick={() => loadFromSaved(idea.id, saved)}
                                      className="w-full text-left px-2 py-1.5 text-xs text-text-primary hover:bg-background-tertiary rounded transition-colors"
                                    >
                                      {saved.title}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    <div className="relative">
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-border-subtle" />
                      <p className="relative text-center text-[10px] text-text-muted bg-surface-elevated px-2 w-fit mx-auto">
                        oppure inserisci nuova
                      </p>
                    </div>

                    <input
                      type="text"
                      value={idea.name}
                      onChange={(e) => updateIdea(idea.id, 'name', e.target.value)}
                      placeholder="Nome dell'idea (opzionale)"
                      className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple"
                    />
                    <textarea
                      value={idea.description}
                      onChange={(e) => updateIdea(idea.id, 'description', e.target.value)}
                      placeholder="Descrivi l'idea: problema, soluzione, target..."
                      className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple resize-none h-24"
                    />
                    <button
                      onClick={() => analyzeIdea(idea.id)}
                      disabled={!idea.description.trim() || idea.isLoading}
                      className="w-full py-2 bg-accent-purple/20 hover:bg-accent-purple/30 text-accent-purple font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {idea.isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analizzando...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Analizza
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Verdict */}
                    <div className={`p-3 rounded-xl ${getVerdictColor(idea.analysis.verdict)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg">{getVerdictEmoji(idea.analysis.verdict)}</span>
                        <span className="text-2xl font-bold">{idea.analysis.scores.overall}/100</span>
                      </div>
                      <h3 className="font-bold text-lg">{idea.name || idea.analysis.summary?.split('.')[0]}</h3>
                    </div>

                    {/* Scores */}
                    <div className="space-y-2">
                      {[
                        { label: 'Mercato', value: idea.analysis.scores.marketSize, icon: '📊' },
                        { label: 'Competizione', value: idea.analysis.scores.competition, icon: '🏆' },
                        { label: 'Esecuzione', value: idea.analysis.scores.executionRisk, icon: '⚡' },
                        { label: 'Differenziazione', value: idea.analysis.scores.differentiation, icon: '💡' },
                        { label: 'Timing', value: idea.analysis.scores.timing, icon: '⏰' },
                      ].map((score) => (
                        <div key={score.label} className="flex items-center gap-2">
                          <span className="text-sm">{score.icon}</span>
                          <span className="text-xs text-text-muted w-24">{score.label}</span>
                          <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-accent-purple to-accent-cyan rounded-full transition-all"
                              style={{ width: `${score.value}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-text-primary w-8">{score.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Financial Metrics */}
                    {idea.analysis.financials && (
                      <div className="space-y-3 pt-2 border-t border-border-subtle">
                        <p className="text-xs font-bold text-accent-green flex items-center gap-1">
                          <DollarSign className="w-3 h-3" /> Proiezioni Finanziarie
                        </p>
                        
                        {/* Revenue Chart (Mini Bar) */}
                        <div className="space-y-1">
                          <p className="text-[10px] text-text-muted">Revenue (3 anni)</p>
                          <div className="flex items-end gap-1 h-12">
                            {[
                              { year: 'Y1', value: idea.analysis.financials.year1Revenue },
                              { year: 'Y2', value: idea.analysis.financials.year2Revenue },
                              { year: 'Y3', value: idea.analysis.financials.year3Revenue },
                            ].map((yr, i) => {
                              const maxRev = idea.analysis!.financials!.year3Revenue || 1;
                              const height = Math.max(10, (yr.value / maxRev) * 100);
                              return (
                                <div key={yr.year} className="flex-1 flex flex-col items-center">
                                  <div 
                                    className="w-full bg-gradient-to-t from-accent-green to-accent-cyan rounded-t transition-all"
                                    style={{ height: `${height}%` }}
                                  />
                                  <span className="text-[9px] text-text-muted mt-1">{yr.year}</span>
                                </div>
                              );
                            })}
                          </div>
                          <p className="text-[10px] text-accent-green text-right">
                            Y3: {formatCurrency(idea.analysis.financials.year3Revenue)}
                          </p>
                        </div>

                        {/* Key Financial Metrics */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-background rounded-lg">
                            <p className="text-[10px] text-text-muted">LTV/CAC</p>
                            <p className={`text-sm font-bold ${idea.analysis.financials.ltvCacRatio >= 3 ? 'text-accent-green' : idea.analysis.financials.ltvCacRatio >= 1.5 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {idea.analysis.financials.ltvCacRatio.toFixed(1)}x
                            </p>
                          </div>
                          <div className="p-2 bg-background rounded-lg">
                            <p className="text-[10px] text-text-muted">Break-even</p>
                            <p className={`text-sm font-bold ${idea.analysis.financials.breakEvenYear <= 2 ? 'text-accent-green' : idea.analysis.financials.breakEvenYear === 3 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {idea.analysis.financials.breakEvenYear > 0 ? `Anno ${idea.analysis.financials.breakEvenYear}` : 'Mai'}
                            </p>
                          </div>
                          <div className="p-2 bg-background rounded-lg">
                            <p className="text-[10px] text-text-muted">Margine</p>
                            <p className="text-sm font-bold text-text-primary">{idea.analysis.financials.grossMargin}%</p>
                          </div>
                          <div className="p-2 bg-background rounded-lg">
                            <p className="text-[10px] text-text-muted">CAC</p>
                            <p className="text-sm font-bold text-text-primary">{formatCurrency(idea.analysis.financials.estimatedCAC)}</p>
                          </div>
                        </div>

                        {/* Moat Indicator */}
                        {idea.analysis.competitive && (
                          <div className="flex items-center gap-2 p-2 bg-background rounded-lg">
                            <Shield className={`w-4 h-4 ${
                              idea.analysis.competitive.moatStrength === 'strong' ? 'text-accent-green' :
                              idea.analysis.competitive.moatStrength === 'medium' ? 'text-yellow-400' : 'text-red-400'
                            }`} />
                            <div className="flex-1">
                              <p className="text-[10px] text-text-muted">Moat</p>
                              <p className="text-xs font-medium text-text-primary capitalize">
                                {idea.analysis.competitive.moatStrength === 'strong' ? 'Forte' :
                                 idea.analysis.competitive.moatStrength === 'medium' ? 'Medio' : 'Debole'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Legacy Key Metrics (if no financials) */}
                    {!idea.analysis.financials && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-background rounded-lg text-center">
                          <p className="text-xs text-text-muted">TAM</p>
                          <p className="text-sm font-bold text-text-primary">{idea.analysis.tam}</p>
                        </div>
                        <div className="p-2 bg-background rounded-lg text-center">
                          <p className="text-xs text-text-muted">MVP</p>
                          <p className="text-sm font-bold text-text-primary">{idea.analysis.mvpWeeks} sett.</p>
                        </div>
                        <div className="p-2 bg-background rounded-lg text-center">
                          <p className="text-xs text-text-muted">Competitor</p>
                          <p className="text-sm font-bold text-text-primary">{idea.analysis.competitorCount}</p>
                        </div>
                        <div className="p-2 bg-background rounded-lg text-center">
                          <p className="text-xs text-text-muted">Rischi</p>
                          <p className="text-sm font-bold text-red-400">{idea.analysis.riskCount}</p>
                        </div>
                      </div>
                    )}

                    {/* Pro & Contro */}
                    {(idea.analysis.pros || idea.analysis.cons) && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-subtle">
                        {idea.analysis.pros && idea.analysis.pros.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-accent-green flex items-center gap-1">
                              <Check className="w-3 h-3" /> Pro
                            </p>
                            {idea.analysis.pros.slice(0, 3).map((pro, i) => (
                              <p key={i} className="text-[10px] text-text-secondary leading-tight">• {pro}</p>
                            ))}
                          </div>
                        )}
                        {idea.analysis.cons && idea.analysis.cons.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-red-400 flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> Contro
                            </p>
                            {idea.analysis.cons.slice(0, 3).map((con, i) => (
                              <p key={i} className="text-[10px] text-text-secondary leading-tight">• {con}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Execution Ease */}
                    {idea.analysis.executionEase && (
                      <div className="p-2 bg-background rounded-lg border-t border-border-subtle">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] font-bold text-text-muted flex items-center gap-1">
                            <Gauge className="w-3 h-3" /> Facilità Esecuzione
                          </p>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            idea.analysis.executionEase.level === 'easy' ? 'bg-accent-green/20 text-accent-green' :
                            idea.analysis.executionEase.level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {idea.analysis.executionEase.level === 'easy' ? 'Facile' :
                             idea.analysis.executionEase.level === 'medium' ? 'Media' : 'Difficile'}
                          </span>
                        </div>
                        <p className="text-[10px] text-text-muted">{idea.analysis.executionEase.reason}</p>
                      </div>
                    )}

                    {/* Ideal Team */}
                    {idea.analysis.idealTeam && (
                      <div className="p-2 bg-background rounded-lg">
                        <p className="text-[10px] font-bold text-accent-purple flex items-center gap-1 mb-2">
                          <Users2 className="w-3 h-3" /> Team Ideale ({idea.analysis.idealTeam.minTeamSize}+ persone)
                        </p>
                        <div className="space-y-1">
                          {idea.analysis.idealTeam.roles.slice(0, 4).map((role, i) => (
                            <div key={i} className="flex items-start gap-1">
                              <span className={`text-[9px] px-1 py-0.5 rounded ${
                                role.priority === 'must-have' ? 'bg-accent-purple/20 text-accent-purple' : 'bg-background-tertiary text-text-muted'
                              }`}>
                                {role.priority === 'must-have' ? '★' : '○'}
                              </span>
                              <div>
                                <p className="text-[10px] font-medium text-text-primary">{role.role}</p>
                                <p className="text-[9px] text-text-muted">{role.skills}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-accent-purple mt-2">
                          🎯 Key Hire: <span className="font-medium">{idea.analysis.idealTeam.keyHire}</span>
                        </p>
                      </div>
                    )}

                    {/* Summary */}
                    <p className="text-xs text-text-muted">{idea.analysis.summary}</p>

                    {/* Reset */}
                    <button
                      onClick={() => setIdeas(ideas.map(i => i.id === idea.id ? { ...i, analysis: null } : i))}
                      className="w-full py-2 border border-border-subtle hover:bg-background text-text-muted text-xs rounded-lg transition-colors"
                    >
                      Modifica idea
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Add Idea Button */}
          {ideas.length < 3 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={addIdea}
              className="min-h-[300px] border-2 border-dashed border-border-subtle hover:border-accent-purple/50 rounded-2xl flex flex-col items-center justify-center gap-2 text-text-muted hover:text-accent-purple transition-colors"
            >
              <Plus className="w-8 h-8" />
              <span className="text-sm font-medium">Aggiungi idea</span>
            </motion.button>
          )}
        </div>

        {/* Compare All Button */}
        {ideas.some(i => i.description.trim() && !i.analysis && !i.isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <button
              onClick={analyzeAll}
              className="px-8 py-3 bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Analizza tutte
            </button>
          </motion.div>
        )}

        {/* Winner Summary */}
        {hasAnalysis && allAnalyzed && winner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-2xl border border-yellow-500/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <div>
                <h3 className="text-lg font-bold text-text-primary">Vincitore: {winner.name}</h3>
                <p className="text-sm text-text-muted">Score: {winner.analysis?.scores.overall}/100</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary">{winner.analysis?.summary}</p>
            <div className="mt-4 flex gap-3">
              <Link
                href={`/?idea=${encodeURIComponent(winner.description)}`}
                className="flex-1 py-2 bg-accent-purple text-white font-medium rounded-lg text-center hover:bg-accent-purple/80 transition-colors text-sm"
              >
                Analisi completa
              </Link>
              <Link
                href={`/financial?idea=${encodeURIComponent(winner.name)}&tam=${encodeURIComponent(winner.analysis?.tam || '')}`}
                className="flex-1 py-2 bg-accent-green/20 text-accent-green font-medium rounded-lg text-center hover:bg-accent-green/30 transition-colors text-sm"
              >
                Financial Model
              </Link>
            </div>
          </motion.div>
        )}

        {/* Comparative Charts */}
        {hasAnalysis && ideas.filter(i => i.analysis?.financials).length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 space-y-6"
          >
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent-cyan" />
              Confronto Finanziario
            </h3>

            {/* Revenue Comparison Chart */}
            <div className="bg-surface-elevated rounded-2xl border border-border-subtle p-4 md:p-6">
              <h4 className="text-sm font-bold text-text-primary mb-4">📈 Proiezioni Revenue (3 anni)</h4>
              <div className="space-y-4">
                {['year1Revenue', 'year2Revenue', 'year3Revenue'].map((key, yearIndex) => {
                  const maxValue = Math.max(...ideas.map(i => i.analysis?.financials?.[key as keyof Financials] as number || 0));
                  return (
                    <div key={key} className="space-y-2">
                      <p className="text-xs text-text-muted">Anno {yearIndex + 1}</p>
                      <div className="space-y-1">
                        {ideas.filter(i => i.analysis?.financials).map((idea, index) => {
                          const value = idea.analysis?.financials?.[key as keyof Financials] as number || 0;
                          const width = maxValue > 0 ? (value / maxValue) * 100 : 0;
                          const colors = ['from-accent-purple to-accent-cyan', 'from-accent-green to-accent-cyan', 'from-yellow-400 to-orange-400'];
                          return (
                            <div key={idea.id} className="flex items-center gap-2">
                              <span className="text-xs text-text-muted w-16 truncate">#{index + 1}</span>
                              <div className="flex-1 h-6 bg-background rounded-lg overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${width}%` }}
                                  transition={{ delay: 0.3 + yearIndex * 0.1, duration: 0.5 }}
                                  className={`h-full bg-gradient-to-r ${colors[index]} rounded-lg flex items-center justify-end pr-2`}
                                >
                                  <span className="text-[10px] font-bold text-white">{formatCurrency(value)}</span>
                                </motion.div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key Metrics Comparison */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* LTV/CAC */}
              <div className="bg-surface-elevated rounded-xl border border-border-subtle p-4">
                <h4 className="text-xs font-bold text-text-muted mb-3 flex items-center gap-1">
                  <Target className="w-3 h-3" /> LTV/CAC Ratio
                </h4>
                <div className="space-y-2">
                  {ideas.filter(i => i.analysis?.financials).map((idea, index) => {
                    const ratio = idea.analysis?.financials?.ltvCacRatio || 0;
                    const isGood = ratio >= 3;
                    return (
                      <div key={idea.id} className="flex items-center justify-between">
                        <span className="text-xs text-text-muted">Idea #{index + 1}</span>
                        <span className={`text-sm font-bold ${isGood ? 'text-accent-green' : ratio >= 1.5 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {ratio.toFixed(1)}x
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-text-muted mt-2">Target: ≥3x</p>
              </div>

              {/* Break-even */}
              <div className="bg-surface-elevated rounded-xl border border-border-subtle p-4">
                <h4 className="text-xs font-bold text-text-muted mb-3 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Break-even
                </h4>
                <div className="space-y-2">
                  {ideas.filter(i => i.analysis?.financials).map((idea, index) => {
                    const year = idea.analysis?.financials?.breakEvenYear || 0;
                    return (
                      <div key={idea.id} className="flex items-center justify-between">
                        <span className="text-xs text-text-muted">Idea #{index + 1}</span>
                        <span className={`text-sm font-bold ${year <= 2 ? 'text-accent-green' : year === 3 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {year > 0 ? `Anno ${year}` : 'Mai'}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-text-muted mt-2">Target: Anno 2</p>
              </div>

              {/* Gross Margin */}
              <div className="bg-surface-elevated rounded-xl border border-border-subtle p-4">
                <h4 className="text-xs font-bold text-text-muted mb-3 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Margine Lordo
                </h4>
                <div className="space-y-2">
                  {ideas.filter(i => i.analysis?.financials).map((idea, index) => {
                    const margin = idea.analysis?.financials?.grossMargin || 0;
                    return (
                      <div key={idea.id} className="flex items-center justify-between">
                        <span className="text-xs text-text-muted">Idea #{index + 1}</span>
                        <span className={`text-sm font-bold ${margin >= 70 ? 'text-accent-green' : margin >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {margin}%
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-text-muted mt-2">Target: ≥70%</p>
              </div>
            </div>

            {/* Radar-style Score Comparison */}
            <div className="bg-surface-elevated rounded-2xl border border-border-subtle p-4 md:p-6">
              <h4 className="text-sm font-bold text-text-primary mb-4">🎯 Score Comparison</h4>
              <div className="grid grid-cols-5 gap-2 text-center">
                {['Mercato', 'Competition', 'Esecuzione', 'Differenz.', 'Timing'].map((label, i) => (
                  <div key={label} className="text-[10px] text-text-muted font-medium">{label}</div>
                ))}
              </div>
              {ideas.filter(i => i.analysis).map((idea, index) => {
                const colors = ['bg-accent-purple', 'bg-accent-green', 'bg-yellow-400'];
                const scores = [
                  idea.analysis!.scores.marketSize,
                  idea.analysis!.scores.competition,
                  idea.analysis!.scores.executionRisk,
                  idea.analysis!.scores.differentiation,
                  idea.analysis!.scores.timing,
                ];
                return (
                  <div key={idea.id} className="mt-2">
                    <div className="grid grid-cols-5 gap-2">
                      {scores.map((score, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${colors[index]} rounded-full`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-text-muted mt-1">{score}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-text-muted text-center mt-1">
                      Idea #{index + 1} {winner?.id === idea.id && '🏆'}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Execution & Team Comparison */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Execution Ease Comparison */}
              <div className="bg-surface-elevated rounded-2xl border border-border-subtle p-4 md:p-6">
                <h4 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-accent-cyan" />
                  Facilità d'Esecuzione
                </h4>
                <div className="space-y-3">
                  {ideas.filter(i => i.analysis?.executionEase).map((idea, index) => (
                    <div key={idea.id} className="p-3 bg-background rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-text-primary">
                          #{index + 1} {idea.name || 'Idea'}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          idea.analysis!.executionEase!.level === 'easy' ? 'bg-accent-green/20 text-accent-green' :
                          idea.analysis!.executionEase!.level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {idea.analysis!.executionEase!.level === 'easy' ? '✓ Facile' :
                           idea.analysis!.executionEase!.level === 'medium' ? '~ Media' : '✗ Difficile'}
                        </span>
                      </div>
                      <p className="text-[10px] text-text-muted">{idea.analysis!.executionEase!.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Comparison */}
              <div className="bg-surface-elevated rounded-2xl border border-border-subtle p-4 md:p-6">
                <h4 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Users2 className="w-4 h-4 text-accent-purple" />
                  Team Ideale a Confronto
                </h4>
                <div className="space-y-3">
                  {ideas.filter(i => i.analysis?.idealTeam).map((idea, index) => (
                    <div key={idea.id} className="p-3 bg-background rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-text-primary">
                          #{index + 1} {idea.name || 'Idea'}
                        </span>
                        <span className="text-xs text-accent-purple font-bold">
                          {idea.analysis!.idealTeam!.minTeamSize}+ persone
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {idea.analysis!.idealTeam!.roles.filter(r => r.priority === 'must-have').slice(0, 4).map((role, i) => (
                          <span key={i} className="text-[9px] px-1.5 py-0.5 bg-accent-purple/20 text-accent-purple rounded">
                            {role.role}
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-accent-purple">
                        🎯 {idea.analysis!.idealTeam!.keyHire}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Verdict */}
            {ideas.filter(i => i.analysis).length >= 2 && (
              <div className="bg-gradient-to-r from-accent-purple/10 to-accent-cyan/10 rounded-2xl border border-accent-purple/30 p-4 md:p-6">
                <h4 className="text-sm font-bold text-text-primary mb-4">📊 Verdetto Finale</h4>
                <div className="space-y-3">
                  {ideas.filter(i => i.analysis).sort((a, b) => (b.analysis?.scores.overall || 0) - (a.analysis?.scores.overall || 0)).map((idea, index) => (
                    <div key={idea.id} className={`flex items-center gap-3 p-3 rounded-lg ${index === 0 ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-background'}`}>
                      <span className={`text-lg ${index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-text-primary">{idea.name || 'Idea'}</p>
                        <p className="text-[10px] text-text-muted">{idea.analysis?.summary}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-accent-purple">{idea.analysis?.scores.overall}</p>
                        <p className="text-[10px] text-text-muted">/100</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
