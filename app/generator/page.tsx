'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  Search, 
  Microscope, 
  Zap, 
  Loader2, 
  ArrowRight,
  Building2,
  FileText,
  Cpu,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  Skull,
  Atom,
  Scale,
  History,
  Trophy,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

// Final idea after tournament
interface FinalIdea {
  id: number;
  name: string;
  tagline: string;
  score: number;
  scoreBreakdown: { market: number; timing: number; economics: number; moat: number; execution: number };
  verdict: 'unicorn' | 'strong' | 'risky' | 'pass';
  regulatory: { directive: string | null; deadline: string | null; penalty: string | null };
  failedSimilar: { name: string; year: number; cause: string };
  whyWeDontDie: string;
  redFlags: string[];
  actionPlan90Days: string[];
  problem: { sector: string; pain: string; tam: string };
  solution: { description: string; tech: string; mvpWeeks: number; tenXVersion: string };
  whoPays: string;
  howMuch: string;
  cac: string;
  ltv: string;
  moat: string;
}

// Killed idea from destroyer
interface KilledIdea {
  id: number;
  name: string;
  fatalFlaw: string;
}

// Tournament phases
type TournamentPhase = 
  | 'idle' 
  | 'generation' 
  | 'massacre' 
  | 'optimization' 
  | 'validation' 
  | 'complete';

interface AgentProgress {
  painHunter: 'idle' | 'running' | 'done';
  scienceArbitrage: 'idle' | 'running' | 'done';
  collision: 'idle' | 'running' | 'done';
  destroyer: 'idle' | 'running' | 'done';
  validator: 'idle' | 'running' | 'done';
}

const SECTORS_UNSEXY = [
  { id: 'waste', label: 'Rifiuti & Ambiente', icon: '♻️' },
  { id: 'construction', label: 'Edilizia & Cantieri', icon: '🏗️' },
  { id: 'healthcare', label: 'Sanità Operativa', icon: '🏥' },
  { id: 'logistics', label: 'Logistica & Trasporti', icon: '🚛' },
  { id: 'compliance', label: 'Compliance Interna', icon: '📋' },
  { id: 'energy', label: 'Energia & Utilities', icon: '⚡' },
  { id: 'agriculture', label: 'Agricoltura & Food', icon: '🌾' },
  { id: 'manufacturing', label: 'Manifattura & Industria', icon: '🏭' },
];

const SECTORS_FARWEST = [
  { id: 'creator', label: 'Creator Economy', icon: '🎬' },
  { id: 'ecommerce', label: 'E-commerce & Seller', icon: '🛒' },
  { id: 'remote', label: 'Remote & Freelance', icon: '💻' },
  { id: 'shortterm', label: 'Short-term Rental', icon: '🏠' },
  { id: 'saas', label: 'SaaS & Indie Hacker', icon: '🚀' },
  { id: 'ai', label: 'AI Tools & Agency', icon: '🤖' },
];

const initialProgress: AgentProgress = {
  painHunter: 'idle',
  scienceArbitrage: 'idle',
  collision: 'idle',
  destroyer: 'idle',
  validator: 'idle',
};

export default function GeneratorPage() {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [customContext, setCustomContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [phase, setPhase] = useState<TournamentPhase>('idle');
  const [progress, setProgress] = useState<AgentProgress>(initialProgress);
  const [finalIdeas, setFinalIdeas] = useState<FinalIdea[]>([]);
  const [killedIdeas, setKilledIdeas] = useState<KilledIdea[]>([]);
  const [ideasGenerated, setIdeasGenerated] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const updateProgress = (agent: keyof AgentProgress, status: 'idle' | 'running' | 'done') => {
    setProgress(prev => ({ ...prev, [agent]: status }));
  };

  const handleGenerate = async () => {
    if (!selectedSector) return;
    
    setIsGenerating(true);
    setError(null);
    setFinalIdeas([]);
    setKilledIdeas([]);
    setIdeasGenerated(0);
    setProgress(initialProgress);
    
    try {
      // ========== FASE 1: GENERAZIONE (10 idee) ==========
      setPhase('generation');
      
      // Pain Hunter
      updateProgress('painHunter', 'running');
      const painResponse = await fetch('/api/generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: 'painHunter', sector: selectedSector, context: customContext }),
      });
      if (!painResponse.ok) throw new Error('Pain Hunter failed');
      const painData = await painResponse.json();
      updateProgress('painHunter', 'done');
      
      // Science Arbitrage
      updateProgress('scienceArbitrage', 'running');
      const scienceResponse = await fetch('/api/generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: 'scienceArbitrage', painPoints: painData.result.painPoints, sector: selectedSector }),
      });
      if (!scienceResponse.ok) throw new Error('Science Arbitrage failed');
      const scienceData = await scienceResponse.json();
      updateProgress('scienceArbitrage', 'done');
      
      // Collision → 5 idee
      updateProgress('collision', 'running');
      const collisionResponse = await fetch('/api/generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: 'collision', painPoints: painData.result.painPoints, breakthroughs: scienceData.result.tech, sector: selectedSector }),
      });
      if (!collisionResponse.ok) {
        const errData = await collisionResponse.json();
        throw new Error(`Collision failed: ${errData.error || 'Unknown'}`);
      }
      const collisionData = await collisionResponse.json();
      updateProgress('collision', 'done');
      setIdeasGenerated(collisionData.result.ideas?.length || 5);
      
      // ========== FASE 2: DESTROYER (5 → 3 + ottimizzazione) ==========
      setPhase('massacre');
      updateProgress('destroyer', 'running');
      const destroyerResponse = await fetch('/api/generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: 'destroyer', ideas: collisionData.result.ideas }),
      });
      if (!destroyerResponse.ok) throw new Error('Destroyer failed');
      const destroyerData = await destroyerResponse.json();
      updateProgress('destroyer', 'done');
      setKilledIdeas(destroyerData.result.killed || []);
      
      // ========== FASE 3: VALIDATOR (regulatory + VC pattern) ==========
      setPhase('validation');
      updateProgress('validator', 'running');
      const validatorResponse = await fetch('/api/generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: 'validator', survivors: destroyerData.result.survivors }),
      });
      if (!validatorResponse.ok) throw new Error('Validator failed');
      const validatorData = await validatorResponse.json();
      updateProgress('validator', 'done');
      
      setFinalIdeas(validatorData.result.finalIdeas || []);
      setPhase('complete');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nella generazione');
      setPhase('idle');
    } finally {
      setIsGenerating(false);
    }
  };

  const getAgentStatusIcon = (status: 'idle' | 'running' | 'done') => {
    switch (status) {
      case 'running':
        return <Loader2 className="w-5 h-5 animate-spin text-accent-purple" />;
      case 'done':
        return <CheckCircle2 className="w-5 h-5 text-accent-green" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-border-subtle" />;
    }
  };

  const getVerdictColor = (verdict: 'unicorn' | 'strong' | 'risky' | 'pass') => {
    switch (verdict) {
      case 'unicorn':
        return 'from-purple-500 to-pink-600';
      case 'strong':
        return 'from-green-500 to-emerald-600';
      case 'risky':
        return 'from-yellow-500 to-amber-600';
      case 'pass':
        return 'from-gray-500 to-gray-600';
    }
  };

  const getVerdictLabel = (verdict: 'unicorn' | 'strong' | 'risky' | 'pass') => {
    switch (verdict) {
      case 'unicorn': return { emoji: '🦄', label: 'Unicorn Potential' };
      case 'strong': return { emoji: '💪', label: 'Strong Bet' };
      case 'risky': return { emoji: '⚠️', label: 'Risky but Interesting' };
      case 'pass': return { emoji: '❌', label: 'Pass' };
    }
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case 'generation': return '🔬 Fase 1: Generazione (10 idee)';
      case 'massacre': return '💀 Fase 2: Massacro (10 → 3)';
      case 'optimization': return '⚛️ Fase 3: Ottimizzazione 10x';
      case 'validation': return '📊 Fase 4: Validazione Finale';
      case 'complete': return '🏆 Torneo Completato!';
      default: return '';
    }
  };

  // Generate rich prompt with full context for the analyzer
  const generateRichPrompt = (idea: FinalIdea) => {
    return `**${idea.name}**
${idea.tagline}

**PROBLEMA:**
- Settore: ${idea.problem.sector}
- Pain Point: ${idea.problem.pain}
- TAM: ${idea.problem.tam}

**SOLUZIONE:**
${idea.solution.description}
- Tecnologia: ${idea.solution.tech}
- MVP in: ${idea.solution.mvpWeeks} settimane
- Versione 10x: ${idea.solution.tenXVersion}

**ECONOMICS:**
- Chi paga: ${idea.whoPays}
- Quanto: ${idea.howMuch}
- CAC: ${idea.cac}
- LTV: ${idea.ltv}
- Moat: ${idea.moat}

**REGOLAMENTARE:**
- Direttiva: ${idea.regulatory.directive || 'N/A'}
- Deadline: ${idea.regulatory.deadline || 'N/A'}
- Penalty: ${idea.regulatory.penalty || 'N/A'}

**LESSONS LEARNED:**
- Startup fallita simile: ${idea.failedSimilar.name} (${idea.failedSimilar.year}) - ${idea.failedSimilar.cause}
- Perché noi non moriamo: ${idea.whyWeDontDie}

**SCORE: ${idea.score}/100 (${idea.verdict})**`;
  };

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
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center">
              <Lightbulb className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold text-text-primary">Idea Generator</h1>
              <p className="text-xs text-text-muted hidden sm:block">Unicorn Factory</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
        {/* Intro */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 md:mb-12"
        >
          <h2 className="text-xl md:text-3xl font-bold text-text-primary mb-2 md:mb-4">
            Genera Idee <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">Unicorn-Tier</span>
          </h2>
          <p className="text-sm md:text-base text-text-muted max-w-2xl mx-auto">
            Framework VC reali • 5 agenti AI • ~40 secondi
          </p>
        </motion.div>

        {/* Sector Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {/* Unsexy Sectors */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gray-500/20 flex items-center justify-center">
                <span className="text-lg">🏭</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Settori "Unsexy"</h3>
                <p className="text-xs text-text-muted">Enormi ma ignorati dai tech bro</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
              {SECTORS_UNSEXY.map((sector) => (
                <button
                  key={sector.id}
                  onClick={() => setSelectedSector(sector.id)}
                  className={`p-3 md:p-4 rounded-xl border-2 transition-all ${
                    selectedSector === sector.id
                      ? 'border-accent-purple bg-accent-purple/10'
                      : 'border-border-subtle hover:border-accent-purple/50 bg-surface-elevated'
                  }`}
                >
                  <span className="text-xl md:text-2xl mb-1 md:mb-2 block">{sector.icon}</span>
                  <span className="text-xs md:text-sm font-medium text-text-primary">{sector.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Far West Sectors */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <span className="text-lg">⛏️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Settori "Far West"</h3>
                <p className="text-xs text-text-muted">Picks & Shovels - vendi le pale ai cercatori d'oro</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
              {SECTORS_FARWEST.map((sector) => (
                <button
                  key={sector.id}
                  onClick={() => setSelectedSector(sector.id)}
                  className={`p-3 md:p-4 rounded-xl border-2 transition-all ${
                    selectedSector === sector.id
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-border-subtle hover:border-yellow-500/50 bg-surface-elevated'
                  }`}
                >
                  <span className="text-xl md:text-2xl mb-1 md:mb-2 block">{sector.icon}</span>
                  <span className="text-xs md:text-sm font-medium text-text-primary">{sector.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Custom Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-4">2. Contesto aggiuntivo (opzionale)</h3>
          <textarea
            value={customContext}
            onChange={(e) => setCustomContext(e.target.value)}
            placeholder="Es: Ho notato che in Italia mancano 50.000 geometri per le ristrutturazioni della Direttiva Case Green..."
            className="relative z-10 w-full h-24 p-4 rounded-xl bg-background-elevated border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple resize-none cursor-text"
          />
        </motion.div>

        {/* Generate Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-12"
        >
          <button
            onClick={handleGenerate}
            disabled={!selectedSector || isGenerating}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent-purple to-accent-cyan text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generando idee...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Genera 3 Idee d'Oro</span>
              </>
            )}
          </button>
        </motion.div>

        {/* Tournament Progress */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12"
            >
              <div className="max-w-3xl mx-auto bg-surface-elevated rounded-2xl p-6 border border-border-subtle">
                {/* Phase Indicator */}
                <div className="text-center mb-6">
                  <span className="text-2xl font-bold text-text-primary">{getPhaseLabel()}</span>
                  {ideasGenerated > 0 && phase === 'massacre' && (
                    <p className="text-sm text-text-muted mt-1">10 idee generate → filtrando a 3</p>
                  )}
                </div>

                {/* Phase 1: Generation */}
                <div className={`mb-4 p-4 rounded-xl ${phase === 'generation' ? 'bg-accent-purple/10 border border-accent-purple/30' : 'bg-background/50'}`}>
                  <h4 className="font-semibold text-text-primary mb-3">🔬 Fase 1: Generazione</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex items-center gap-2">
                      {getAgentStatusIcon(progress.painHunter)}
                      <span className="text-sm text-text-muted">Pain Hunter</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getAgentStatusIcon(progress.scienceArbitrage)}
                      <span className="text-sm text-text-muted">Science Arbitrage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getAgentStatusIcon(progress.collision)}
                      <span className="text-sm text-text-muted">Collision (5 idee)</span>
                    </div>
                  </div>
                </div>

                {/* Phase 2: Destroyer */}
                <div className={`mb-4 p-4 rounded-xl ${phase === 'massacre' ? 'bg-red-500/10 border border-red-500/30' : 'bg-background/50'}`}>
                  <h4 className="font-semibold text-text-primary mb-3">💀 Fase 2: Destroyer</h4>
                  <div className="flex items-center gap-2">
                    {getAgentStatusIcon(progress.destroyer)}
                    <span className="text-sm text-text-muted">Massacro (5→3) + Ottimizzazione 10x</span>
                  </div>
                </div>

                {/* Phase 3: Validator */}
                <div className={`p-4 rounded-xl ${phase === 'validation' ? 'bg-green-500/10 border border-green-500/30' : 'bg-background/50'}`}>
                  <h4 className="font-semibold text-text-primary mb-3">📊 Fase 3: Validator</h4>
                  <div className="flex items-center gap-2">
                    {getAgentStatusIcon(progress.validator)}
                    <span className="text-sm text-text-muted">Regulatory + VC Pattern + Score Finale</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Killed Ideas */}
        <AnimatePresence>
          {killedIdeas.length > 0 && phase === 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="max-w-3xl mx-auto">
                <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                  <Skull className="w-5 h-5" />
                  Idee Eliminate dal Devil's Advocate
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {killedIdeas.map((killed, index) => (
                    <div key={index} className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                      <p className="font-medium text-text-primary text-sm line-through">{killed.name}</p>
                      <p className="text-xs text-red-400 mt-1">{killed.fatalFlaw}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Final Ideas - Tournament Winners */}
        <AnimatePresence>
          {finalIdeas.length > 0 && phase === 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-xl md:text-2xl font-bold text-text-primary text-center mb-4 md:mb-8">
                🏆 Vincitori del Torneo
              </h3>
              
              {finalIdeas.map((idea: FinalIdea, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-surface-elevated rounded-2xl border border-border-subtle overflow-hidden"
                >
                  {/* Idea Header */}
                  <div className={`p-4 md:p-6 bg-gradient-to-r ${getVerdictColor(idea.verdict)}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 md:mb-2">
                          <span className="text-xl md:text-2xl">{getVerdictLabel(idea.verdict).emoji}</span>
                          <span className="text-white/80 text-xs md:text-sm font-medium uppercase">
                            {getVerdictLabel(idea.verdict).label}
                          </span>
                        </div>
                        <h4 className="text-lg md:text-2xl font-bold text-white truncate">{idea.name}</h4>
                        <p className="text-white/90 text-sm md:text-base mt-1 line-clamp-2">{idea.tagline}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-3xl md:text-4xl font-bold text-white">{idea.score}</div>
                        <div className="text-white/70 text-xs md:text-sm">/100</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Idea Content - responsive grid */}
                  <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {/* Problem & Business */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-red-500" />
                        </div>
                        <h5 className="font-semibold text-text-primary">Problema & Business</h5>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-text-muted">Settore:</span> <span className="text-text-primary">{idea.problem.sector}</span></p>
                        <p><span className="text-text-muted">Pain:</span> <span className="text-text-primary">{idea.problem.pain}</span></p>
                        <p><span className="text-text-muted">Chi paga:</span> <span className="text-text-primary">{idea.whoPays}</span></p>
                        <p><span className="text-text-muted">Quanto:</span> <span className="text-accent-green font-medium">{idea.howMuch}</span></p>
                        <p><span className="text-text-muted">CAC:</span> <span className="text-text-primary">{idea.cac}</span></p>
                        <p><span className="text-text-muted">LTV:</span> <span className="text-accent-green font-medium">{idea.ltv}</span></p>
                      </div>
                    </div>
                    
                    {/* Solution 10x */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Atom className="w-4 h-4 text-blue-500" />
                        </div>
                        <h5 className="font-semibold text-text-primary">Soluzione 10x</h5>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-text-primary">{idea.solution.description}</p>
                        <p><span className="text-text-muted">Tech:</span> <span className="text-text-primary">{idea.solution.tech}</span></p>
                        <p><span className="text-text-muted">MVP:</span> <span className="text-accent-green font-medium">{idea.solution.mvpWeeks} settimane</span></p>
                        <p><span className="text-text-muted">Versione 10x:</span> <span className="text-accent-purple">{idea.solution.tenXVersion}</span></p>
                      </div>
                    </div>
                    
                    {/* Regulatory */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                          <Scale className="w-4 h-4 text-yellow-500" />
                        </div>
                        <h5 className="font-semibold text-text-primary">Regolamentare</h5>
                      </div>
                      <div className="space-y-2 text-sm">
                        {idea.regulatory.directive && (
                          <p><span className="text-text-muted">Direttiva:</span> <span className="text-text-primary">{idea.regulatory.directive}</span></p>
                        )}
                        {idea.regulatory.deadline && (
                          <p><span className="text-text-muted">Deadline:</span> <span className="text-red-400 font-medium">{idea.regulatory.deadline}</span></p>
                        )}
                        {idea.regulatory.penalty && (
                          <p><span className="text-text-muted">Penalty:</span> <span className="text-red-400">{idea.regulatory.penalty}</span></p>
                        )}
                      </div>
                    </div>
                    
                    {/* Lessons Learned */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <History className="w-4 h-4 text-purple-500" />
                        </div>
                        <h5 className="font-semibold text-text-primary">Lessons Learned</h5>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-text-muted">Fallita:</span> <span className="text-red-400">{idea.failedSimilar.name} ({idea.failedSimilar.year})</span></p>
                        <p className="text-xs text-text-muted">"{idea.failedSimilar.cause}"</p>
                        <p><span className="text-text-muted">Perché noi no:</span> <span className="text-accent-green">{idea.whyWeDontDie}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Red Flags & Action Plan */}
                  <div className="px-4 md:px-6 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {/* Red Flags */}
                    {idea.redFlags && idea.redFlags.length > 0 && (
                      <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/20">
                        <p className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Red Flags
                        </p>
                        <ul className="text-xs text-text-muted space-y-1">
                          {idea.redFlags.map((flag, i) => (
                            <li key={i}>• {flag}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Action Plan */}
                    {idea.actionPlan90Days && idea.actionPlan90Days.length > 0 && (
                      <div className="p-3 bg-green-500/5 rounded-xl border border-green-500/20">
                        <p className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Action Plan 90 Days
                        </p>
                        <ul className="text-xs text-text-muted space-y-1">
                          {idea.actionPlan90Days.map((action: string, i: number) => (
                            <li key={i}>• {action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {/* CTA */}
                  <div className="px-4 md:px-6 pb-4 md:pb-6">
                    <Link
                      href={`/?idea=${encodeURIComponent(generateRichPrompt(idea))}`}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-accent-purple/10 hover:bg-accent-purple/20 text-accent-purple font-medium rounded-xl transition-colors text-sm md:text-base"
                    >
                      <span>Analizza con Venture Analyst</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State with Tournament Explanation */}
        {!isGenerating && finalIdeas.length === 0 && phase === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 md:mt-8"
          >
            <div className="max-w-5xl mx-auto">
              <h3 className="text-lg md:text-xl font-bold text-text-primary text-center mb-1 md:mb-2">
                🏟️ Unicorn Factory
              </h3>
              <p className="text-center text-text-muted text-sm mb-4 md:mb-8">5 agenti AI • ~40 secondi</p>
              
              {/* Phase 1 */}
              <div className="mb-4 md:mb-6">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <span className="text-base md:text-lg">🔬</span>
                  <h4 className="font-bold text-text-primary text-sm md:text-base">Fase 1: Generazione</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4">
                  <div className="bg-surface-elevated rounded-xl p-3 md:p-4 border border-border-subtle">
                    <div className="flex items-center gap-2 mb-1">
                      <Search className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="font-medium text-text-primary text-xs md:text-sm">Pain Hunter</span>
                    </div>
                    <p className="text-xs text-text-muted hidden sm:block">TAM &gt;€1B, urgenza</p>
                  </div>
                  <div className="bg-surface-elevated rounded-xl p-3 md:p-4 border border-border-subtle">
                    <div className="flex items-center gap-2 mb-1">
                      <Microscope className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="font-medium text-text-primary text-xs md:text-sm">Science Arbitrage</span>
                    </div>
                    <p className="text-xs text-text-muted hidden sm:block">Tech pronte</p>
                  </div>
                  <div className="bg-surface-elevated rounded-xl p-3 md:p-4 border border-border-subtle">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      <span className="font-medium text-text-primary text-xs md:text-sm">Collision</span>
                    </div>
                    <p className="text-xs text-text-muted hidden sm:block">5 idee + scoring</p>
                  </div>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="mb-4 md:mb-6">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <span className="text-base md:text-lg">💀</span>
                  <h4 className="font-bold text-text-primary text-sm md:text-base">Fase 2: Destroyer</h4>
                </div>
                <div className="bg-red-500/5 rounded-xl p-3 md:p-4 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Skull className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="font-medium text-text-primary text-xs md:text-sm">5→3 + ottimizzazione 10x</span>
                  </div>
                  <p className="text-xs text-text-muted hidden sm:block">
                    Fatal flaws + First Principles
                  </p>
                </div>
              </div>

              {/* Phase 3 */}
              <div>
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <span className="text-base md:text-lg">📊</span>
                  <h4 className="font-bold text-text-primary text-sm md:text-base">Fase 3: Validator</h4>
                </div>
                <div className="bg-green-500/5 rounded-xl p-3 md:p-4 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="font-medium text-text-primary text-xs md:text-sm">Regulatory + VC + Score</span>
                  </div>
                  <p className="text-xs text-text-muted hidden sm:block">
                    EU 2025-27 + startup fallite + score 0-100
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
