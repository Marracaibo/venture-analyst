'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderOpen,
  Home,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Trash2,
  BarChart3,
  Calendar,
  Building2,
  Plus,
  Filter,
  Search,
  RefreshCw,
  ExternalLink,
  Edit3,
  ChevronDown,
  ChevronUp,
  Download,
  Star,
  X
} from 'lucide-react';
import Link from 'next/link';
import {
  PortfolioStartup,
  VERTICALE_LABELS,
  FASE_LABELS,
  VERDETTO_COLORS
} from '@/lib/screener-types';
import {
  getPortfolio,
  getPortfolioStats,
  deleteStartup,
  updateStartup,
  PortfolioStats,
  getVVAFavorites,
  importAllVVAFavorites,
  importFromVVA
} from '@/lib/portfolio-store';
import { SavedAnalysis } from '@/lib/history';

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioStartup[]>([]);
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [filter, setFilter] = useState<'all' | 'CORE' | 'SATELLITE' | 'REJECT'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'watching' | 'exited' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [vvaFavorites, setVvaFavorites] = useState<SavedAnalysis[]>([]);
  const [showVVAImport, setShowVVAImport] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    const data = getPortfolio();
    setPortfolio(data);
    setStats(getPortfolioStats());
    setVvaFavorites(getVVAFavorites());
    setIsLoading(false);
  };

  const handleImportVVA = (id: string) => {
    const result = importFromVVA(id);
    if (result) {
      loadData();
    }
  };

  const handleImportAllVVA = () => {
    const count = importAllVVAFavorites();
    if (count > 0) {
      loadData();
      setShowVVAImport(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questa startup dal portfolio?')) {
      deleteStartup(id);
      loadData();
    }
  };

  const handleStatusChange = (id: string, status: PortfolioStartup['status']) => {
    updateStartup(id, { status });
    loadData();
  };

  const filteredPortfolio = portfolio.filter(startup => {
    if (filter !== 'all' && startup.result.verdetto !== filter) return false;
    if (statusFilter !== 'all' && startup.status !== statusFilter) return false;
    if (searchQuery && !startup.input.nome.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getVerdettoIcon = (verdetto: string) => {
    switch (verdetto) {
      case 'CORE': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'SATELLITE': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'REJECT': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'watching': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'exited': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `€${(value / 1000).toFixed(1)}k`;
    return `€${value}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">
              <Home className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Portfolio Dashboard</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {vvaFavorites.length > 0 && (
              <button
                onClick={() => setShowVVAImport(!showVVAImport)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 rounded-lg font-medium transition-colors"
              >
                <Star className="w-4 h-4" />
                Importa da VVA ({vvaFavorites.length})
              </button>
            )}
            <Link
              href="/screener"
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuova Startup
            </Link>
          </div>
        </div>
      </header>

      {/* VVA Import Panel */}
      <AnimatePresence>
        {showVVAImport && vvaFavorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-slate-800 bg-amber-500/5"
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  <span className="font-medium text-white">Preferiti VVA disponibili</span>
                  <span className="text-sm text-slate-400">({vvaFavorites.length} analisi)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleImportAllVVA}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Importa Tutti
                  </button>
                  <button
                    onClick={() => setShowVVAImport(false)}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {vvaFavorites.map((fav) => {
                  const alreadyImported = portfolio.some(p => p.id === `vva_${fav.id}`);
                  return (
                    <div
                      key={fav.id}
                      className={`p-3 rounded-xl border ${alreadyImported ? 'bg-slate-800/30 border-slate-700/50 opacity-60' : 'bg-slate-800/50 border-slate-700 hover:border-amber-500/50'} transition-colors`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate">{fav.title}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(fav.timestamp).toLocaleDateString('it-IT')} - 
                            <span className={fav.analysis.verdict === 'green' ? ' text-emerald-400' : fav.analysis.verdict === 'yellow' ? ' text-amber-400' : ' text-red-400'}>
                              {' '}{fav.analysis.verdict === 'green' ? 'Promettente' : fav.analysis.verdict === 'yellow' ? 'Cauto' : 'Problematico'}
                            </span>
                          </p>
                        </div>
                        {alreadyImported ? (
                          <span className="text-xs text-slate-500 px-2 py-1 bg-slate-700/50 rounded">Importato</span>
                        ) : (
                          <button
                            onClick={() => handleImportVVA(fav.id)}
                            className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded text-xs font-medium transition-colors"
                          >
                            Importa
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
              <div className="text-3xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-slate-400">Totale Startup</div>
            </div>
            <div className="bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/30">
              <div className="text-3xl font-bold text-emerald-400">{stats.core}</div>
              <div className="text-sm text-emerald-400/70">Core</div>
            </div>
            <div className="bg-amber-500/10 rounded-2xl p-4 border border-amber-500/30">
              <div className="text-3xl font-bold text-amber-400">{stats.satellite}</div>
              <div className="text-sm text-amber-400/70">Satellite</div>
            </div>
            <div className="bg-blue-500/10 rounded-2xl p-4 border border-blue-500/30">
              <div className="text-3xl font-bold text-blue-400">{stats.active}</div>
              <div className="text-sm text-blue-400/70">Attive</div>
            </div>
            <div className="bg-purple-500/10 rounded-2xl p-4 border border-purple-500/30">
              <div className="text-3xl font-bold text-purple-400">{stats.exited}</div>
              <div className="text-sm text-purple-400/70">Exit</div>
            </div>
            <div className="bg-cyan-500/10 rounded-2xl p-4 border border-cyan-500/30">
              <div className="text-3xl font-bold text-cyan-400">{formatCurrency(stats.totalMRR)}</div>
              <div className="text-sm text-cyan-400/70">MRR Totale</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca startup..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Verdetto Filter */}
          <div className="flex gap-2">
            {(['all', 'CORE', 'SATELLITE', 'REJECT'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-xl font-medium transition-all ${
                  filter === f
                    ? f === 'CORE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : f === 'SATELLITE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : f === 'REJECT' ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
                }`}
              >
                {f === 'all' ? 'Tutti' : f}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
          >
            <option value="all">Tutti gli status</option>
            <option value="active">🟢 Attive</option>
            <option value="watching">👀 Watching</option>
            <option value="exited">🎉 Exit</option>
            <option value="failed">❌ Failed</option>
          </select>

          <button
            onClick={loadData}
            className="p-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Portfolio List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
          </div>
        ) : filteredPortfolio.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen className="w-16 h-16 mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {portfolio.length === 0 ? 'Portfolio vuoto' : 'Nessun risultato'}
            </h3>
            <p className="text-slate-400 mb-6">
              {portfolio.length === 0 
                ? 'Inizia ad analizzare startup per popolare il tuo portfolio'
                : 'Prova a modificare i filtri di ricerca'}
            </p>
            <Link
              href="/screener"
              className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Analizza Prima Startup
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPortfolio.map((startup) => (
              <motion.div
                key={startup.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden"
              >
                {/* Main Row */}
                <div
                  className="p-5 flex items-center gap-4 cursor-pointer hover:bg-slate-700/30 transition-colors"
                  onClick={() => setExpandedId(expandedId === startup.id ? null : startup.id)}
                >
                  {/* Verdetto Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    startup.result.verdetto === 'CORE' ? 'bg-emerald-500/20' :
                    startup.result.verdetto === 'SATELLITE' ? 'bg-amber-500/20' :
                    'bg-red-500/20'
                  }`}>
                    {getVerdettoIcon(startup.result.verdetto)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-white truncate">{startup.input.nome}</h3>
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-medium border ${getStatusColor(startup.status)}`}>
                        {startup.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {VERTICALE_LABELS[startup.input.verticale]}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {FASE_LABELS[startup.input.fase]}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(startup.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="hidden md:flex items-center gap-6">
                    {startup.input.metrics?.mrr && startup.input.metrics.mrr > 0 && (
                      <div className="text-right">
                        <div className="text-lg font-semibold text-emerald-400">
                          {formatCurrency(startup.input.metrics.mrr)}
                        </div>
                        <div className="text-xs text-slate-500">MRR</div>
                      </div>
                    )}
                    {startup.input.metrics?.customers && startup.input.metrics.customers > 0 && (
                      <div className="text-right">
                        <div className="text-lg font-semibold text-blue-400">
                          {startup.input.metrics.customers}
                        </div>
                        <div className="text-xs text-slate-500">Clienti</div>
                      </div>
                    )}
                  </div>

                  {/* Expand Icon */}
                  {expandedId === startup.id ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedId === startup.id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0 border-t border-slate-700/50">
                        <div className="grid md:grid-cols-2 gap-6 pt-5">
                          {/* Left: Analysis Summary */}
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-slate-400 mb-2">Reasoning</h4>
                              <p className="text-slate-300 text-sm">{startup.result.reasoning}</p>
                            </div>

                            {startup.result.strengths.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-emerald-400 mb-2">Punti di Forza</h4>
                                <ul className="space-y-1">
                                  {startup.result.strengths.slice(0, 3).map((s, i) => (
                                    <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                                      <span className="text-emerald-400">✓</span>
                                      {s}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {startup.result.weaknesses.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-amber-400 mb-2">Aree di Attenzione</h4>
                                <ul className="space-y-1">
                                  {startup.result.weaknesses.slice(0, 3).map((w, i) => (
                                    <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                                      <span className="text-amber-400">!</span>
                                      {w}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Right: Actions & Status */}
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-slate-400 mb-2">Cambia Status</h4>
                              <div className="flex flex-wrap gap-2">
                                {(['active', 'watching', 'exited', 'failed'] as const).map((status) => (
                                  <button
                                    key={status}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(startup.id, status);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                                      startup.status === status
                                        ? getStatusColor(status)
                                        : 'bg-slate-700/50 text-slate-400 border-slate-600 hover:border-slate-500'
                                    }`}
                                  >
                                    {status === 'active' && '🟢 Active'}
                                    {status === 'watching' && '👀 Watching'}
                                    {status === 'exited' && '🎉 Exited'}
                                    {status === 'failed' && '❌ Failed'}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {startup.input.descrizione && (
                              <div>
                                <h4 className="text-sm font-medium text-slate-400 mb-2">Descrizione</h4>
                                <p className="text-slate-300 text-sm line-clamp-3">
                                  {startup.input.descrizione}
                                </p>
                              </div>
                            )}

                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(startup.id);
                                }}
                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Elimina
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        {/* Verticale Distribution */}
        {stats && Object.keys(stats.byVerticale).length > 0 && (
          <div className="mt-8 bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-violet-400" />
              Distribuzione per Verticale
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(stats.byVerticale).map(([verticale, count]) => (
                <div key={verticale} className="bg-slate-900/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{count}</div>
                  <div className="text-sm text-slate-400">
                    {VERTICALE_LABELS[verticale as keyof typeof VERTICALE_LABELS] || verticale}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
