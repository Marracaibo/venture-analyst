'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Sparkles, ArrowRight, ArrowLeft, ChevronDown, ChevronUp, Loader2, Home, Save, FolderOpen, Brain, Search, X, Building, Users, RefreshCw, Lightbulb, Wrench, Rocket, Banknote, HelpCircle, FileText, Download } from 'lucide-react';
import { generateInvestmentProposalPDF } from '@/lib/screener-proposal-pdf';
import { generateFullProposalPDF } from '@/lib/screener-proposal-pdf-full';
import { generateProposalWord } from '@/lib/screener-proposal-word';
import Link from 'next/link';
import { StartupInput, ScreenerResult, Settore, FaseAttuale, CapTable, Coachability, BusinessModel, SETTORI_CONFIG } from '@/lib/screener-types';
import { saveToPortfolio } from '@/lib/portfolio-store';

const BM_CFG: Record<BusinessModel, { l: string; d: string; I: any }> = {
  'b2b': { l: 'B2B', d: 'Vendi ad aziende', I: Building },
  'b2c': { l: 'B2C', d: 'Vendi a consumatori', I: Users },
  'b2b2c': { l: 'B2B2C', d: 'Aziende che servono consumatori', I: RefreshCw }
};

const FASE_CFG = [
  { v: 'idea', l: 'Idea', d: 'Solo concept', I: Lightbulb },
  { v: 'mvp', l: 'MVP', d: 'Prototipo', I: Wrench },
  { v: 'prodotto-live', l: 'Live', d: 'In produzione', I: Rocket },
  { v: 'revenue', l: 'Revenue', d: '>1k/mese', I: Banknote }
];

const init: StartupInput = {
  nome: '', businessModel: 'b2b', verticale: 'software-saas', fase: 'idea', capTable: 'solo-founder',
  competizione: 'affollato', coachability: 'alta', descrizione: '',
  team: { foundersCount: 1, fullTime: true, techInHouse: false },
  problemDescription: '', currentAlternatives: '',
  marketDescription: '', targetCustomer: '',
  uniquenessDescription: '', competitiveAdvantage: '',
  revenueModel: '', unitEconomics: '',
  tractionDescription: '',
  needsCto: false, needsCmo: false, needsCfo: false
};

// DEMO PRESETS for testing
const DEMO_CORE: StartupInput = {
  nome: 'Mizan AI', businessModel: 'b2b2c', verticale: 'legaltech', fase: 'revenue', capTable: 'founder-advisor',
  competizione: 'affollato', coachability: 'alta', descrizione: 'Piattaforma AI per ricerca legale automatizzata. Riduce del 70% il tempo di ricerca precedenti per avvocati.',
  team: { foundersCount: 2, fullTime: true, techInHouse: true },
  problemDescription: 'Gli avvocati italiani perdono 3+ ore al giorno a cercare precedenti legali su database obsoleti. Il 60% delle ricerche non porta risultati utili, causando perdita di tempo e opportunità.',
  currentAlternatives: 'Ricerca manuale su DeJure, Westlaw Italia, LexisNexis. Costi elevati (500-1000€/mese), interfacce datate, nessuna AI.',
  marketDescription: 'Mercato legaltech italiano: 800M€, crescita 15% annuo. 250.000 avvocati in Italia. Competitor principali: DeJure (leader storico), Wolters Kluwer. Nessuno usa AI generativa.',
  targetCustomer: 'Studi legali medio-grandi (10-50 avvocati) con focus su contenzioso civile e commerciale. Fatturato 1-10M€, digitalizzati.',
  uniquenessDescription: 'Modello AI proprietario addestrato su 150.000 sentenze italiane. Deep integration con workflow avvocati. Unica soluzione che genera bozze di atti.',
  competitiveAdvantage: 'First mover AI in Italia. Partnership esclusiva con Ordine Avvocati Milano. Team: ex Giuffré + AI engineers da Google.',
  revenueModel: 'SaaS subscription: 149€/mese per avvocato, tier Enterprise 899€/mese unlimited. Target ACV: 8.000€.',
  unitEconomics: 'CAC: 180€ via LinkedIn + eventi. LTV: 4.500€ (30 mesi avg). Margine lordo: 85%. LTV:CAC = 25:1.',
  tractionDescription: '15 studi paganti, 4.500€ MRR, crescita 30% mese. 200 in waitlist. 3 top-50 studi in trial. NPS: 72.',
  customersCount: 15, mrrCurrent: 4500, cacEstimate: 180, ltvEstimate: 4500,
  needsCto: false, needsCmo: true, needsCfo: false
};

const DEMO_SATELLITE: StartupInput = {
  nome: 'FitMeal', businessModel: 'b2c', verticale: 'foodtech', fase: 'mvp', capTable: 'solo-founder',
  competizione: 'affollato', coachability: 'media', descrizione: 'App per meal planning personalizzato con AI. Genera piani alimentari settimanali basati su preferenze e obiettivi.',
  team: { foundersCount: 1, fullTime: true, techInHouse: false },
  problemDescription: 'Le persone vogliono mangiare sano ma non sanno cosa cucinare. Passano 30+ minuti a decidere cosa mangiare ogni giorno.',
  currentAlternatives: 'App generiche come MyFitnessPal, blog di ricette, nutrizionisti (costosi). Nessuno offre pianificazione automatica personalizzata.',
  marketDescription: 'Mercato wellness/nutrition app: 5B€ globale, Italia 200M€. Competitor: Yazio, Lifesum, MyFitnessPal. Mercato affollato ma frammentato.',
  targetCustomer: 'Millennials 25-40 attenti alla salute, reddito medio-alto, poco tempo per cucinare. 80% donne.',
  uniquenessDescription: 'AI che impara dai gusti e genera ricette nuove. Integrazione con supermercati per lista spesa automatica.',
  competitiveAdvantage: 'Team con background food tech. Database 10.000 ricette italiane. Partnership con Esselunga in discussione.',
  revenueModel: 'Freemium: base gratis, Premium 9.99€/mese con AI illimitata e lista spesa.',
  unitEconomics: 'CAC stimato 15€ via Instagram ads. LTV stimato 60€ (6 mesi avg). Conversion freemium: 5%.',
  tractionDescription: '500 download beta, 50 utenti attivi settimanali. 10 utenti paganti. Feedback positivo ma retention da migliorare.',
  customersCount: 10, mrrCurrent: 100, cacEstimate: 15, ltvEstimate: 60,
  needsCto: true, needsCmo: false, needsCfo: false
};

export default function ScreenerPage() {
  const [s, setS] = useState(0);
  const [inp, setInp] = useState<StartupInput>(init);
  const [res, setRes] = useState<ScreenerResult | null>(null);
  const [ld, setLd] = useState(false);
  const [exp, setExp] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [sv, setSv] = useState(false);
  const [srch, setSrch] = useState('');
  const [genProp, setGenProp] = useState(false);
  const [genProgress, setGenProgress] = useState('');
  const tot = 11;

  // Genera proposta completa con AI (Word)
  const generateFullProposal = async (format: 'word' | 'pdf' = 'word') => {
    if (!res) return;
    setGenProp(true);
    setGenProgress('Generazione AI in corso... (2-3 minuti)');
    
    try {
      const response = await fetch('/api/screener/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: inp, result: res })
      });
      
      const data = await response.json();
      
      if (data.success && data.sections) {
        setGenProgress(`Creazione ${format.toUpperCase()}...`);
        if (format === 'word') {
          await generateProposalWord(inp, res, data.sections);
        } else {
          await generateFullProposalPDF(inp, res, data.sections);
        }
        setGenProgress('');
      } else {
        setErr('Errore nella generazione della proposta');
      }
    } catch (error) {
      console.error('Error generating proposal:', error);
      setErr('Errore nella generazione');
    } finally {
      setGenProp(false);
      setGenProgress('');
    }
  };

  const fSett = useMemo(() => {
    if (!srch.trim()) return SETTORI_CONFIG;
    const q = srch.toLowerCase();
    return SETTORI_CONFIG.filter(x => x.label.toLowerCase().includes(q) || x.keywords.some(k => k.includes(q)));
  }, [srch]);

  const ok = () => {
    if (s === 0) return inp.nome.trim().length > 0;
    if (s === 4) return (inp.problemDescription?.length || 0) >= 20;
    if (s === 5) return (inp.marketDescription?.length || 0) >= 20;
    if (s === 6) return (inp.uniquenessDescription?.length || 0) >= 20;
    if (s === 7) return (inp.revenueModel?.length || 0) >= 10;
    if (s === 8) return true;
    return true;
  };

  const sub = async () => {
    setLd(true); setErr(null);
    try {
      const r = await fetch('/api/screener', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input: inp, useAI: true }) });
      const d = await r.json();
      if (d.success) { setRes(d.result); setS(tot); } else setErr(d.error || 'Errore');
    } catch { setErr('Errore'); } finally { setLd(false); }
  };

  const savePf = () => { if (res) { saveToPortfolio(inp, res); setSv(true); } };
  const rst = () => { setInp(init); setRes(null); setS(0); setSv(false); setSrch(''); };
  const prg = res ? 100 : (s / (tot - 1)) * 100;
  const titles = ['Nome', 'Modello', 'Settore', 'Fase', 'Problema', 'Mercato', 'Differenziazione', 'Business Model', 'Traction', 'Struttura', 'Analisi'];
  const selSett = SETTORI_CONFIG.find(x => x.id === inp.verticale);

  const Hint = ({ text }: { text: string }) => (
    <div className="flex items-start gap-2 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50 mt-3">
      <HelpCircle className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-slate-400">{text}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-slate-400 hover:text-white"><Home className="w-5 h-5" /></Link>
            <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"><Brain className="w-4 h-4 text-white" /></div><span className="font-semibold text-white">Screener AI</span></div>
          </div>
          {!res && <span className="text-sm text-slate-400">{s + 1}/{tot}</span>}
        </div>
        <div className="h-1 bg-slate-800"><motion.div className="h-full bg-gradient-to-r from-violet-500 to-purple-600" animate={{ width: prg + '%' }} /></div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        {err && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{err}</div>}
        <AnimatePresence mode="wait">
          {res ? (
            <motion.div key="res" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <div className="text-center space-y-3">
                <div className={'w-20 h-20 mx-auto rounded-2xl flex items-center justify-center ' + (res.verdetto === 'GO' ? 'bg-emerald-500/20 border-2 border-emerald-500' : 'bg-amber-500/20 border-2 border-amber-500')}>
                  {res.verdetto === 'GO' ? <CheckCircle2 className="w-10 h-10 text-emerald-400" /> : <AlertTriangle className="w-10 h-10 text-amber-400" />}
                </div>
                <h2 className={'text-2xl font-bold ' + (res.verdetto === 'GO' ? 'text-emerald-400' : 'text-amber-400')}>{res.verdettoLabel}</h2>
                <p className="text-white font-medium">{inp.nome}</p>
                <p className="text-xs text-slate-400">{BM_CFG[inp.businessModel].l} - {selSett?.label}</p>
              </div>
              {res.filtersScore && (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex justify-between mb-3"><span className="text-sm text-slate-300">Valutazione AI - 5 Filtri</span><span className={'font-bold text-lg ' + (res.filtersScore.passedCount >= 4 ? 'text-emerald-400' : res.filtersScore.passedCount >= 3 ? 'text-amber-400' : 'text-red-400')}>{res.filtersScore.passedCount}/5</span></div>
                  <div className="space-y-2">
                    {[{k:'problemSolving',l:'Problema',e:'Il problema e reale?'},{k:'marketAnalysis',l:'Mercato',e:'Mercato accessibile?'},{k:'differentiation',l:'Unicita',e:'Difficile da copiare?'},{k:'businessModel',l:'Business Model',e:'Modello sostenibile?'},{k:'traction',l:'Traction',e:'Sa acquisire clienti?'}].map(f => {
                      const passed = (res.filtersScore as any)[f.k];
                      const detail = (res.filtersScore as any).details?.[f.k];
                      return (
                        <div key={f.k} className={'p-3 rounded-lg border ' + (passed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30')}>
                          <div className="flex justify-between items-center">
                            <div>
                              <span className={'font-medium text-sm ' + (passed ? 'text-emerald-400' : 'text-red-400')}>{passed ? 'OK' : 'NO'} - {f.l}</span>
                              {detail?.score && <span className="ml-2 text-xs text-slate-500">({detail.score}/5)</span>}
                            </div>
                          </div>
                          {detail?.reason && <p className="text-xs text-slate-400 mt-1">{detail.reason}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* Box Reasoning con spiegazione verdetto */}
              <div className={`rounded-xl p-4 border ${res.verdetto === 'GO' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${res.verdetto === 'GO' ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
                    {res.verdetto === 'GO' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-amber-400" />}
                  </div>
                  <div>
                    <p className={`font-semibold text-sm mb-1 ${res.verdetto === 'GO' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {res.verdetto === 'GO' ? '🚀 Verdetto: GO - Pronti a partire!' : '⏸️ Verdetto: PARK - Non ancora pronti'}
                    </p>
                    <p className="text-slate-300 text-sm">{res.reasoning}</p>
                    {res.verdetto === 'PARK' && (
                      <p className="text-amber-300/80 text-xs mt-2 italic">
                        💡 Per passare a GO: migliorare traction e validazione di mercato. Ricontattaci quando avrai più dati.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {res.operationalRoles && res.operationalRoles.length > 0 && <div className="bg-violet-500/10 rounded-xl p-4 border border-violet-500/30"><p className="text-violet-400 text-sm mb-2">Ruoli Operativi</p><div className="flex gap-2">{res.operationalRoles.map(r => <span key={r} className="px-3 py-1 bg-violet-500/20 rounded text-violet-300 text-xs uppercase font-bold">{r}</span>)}</div></div>}
              {res.killSwitches.length > 0 && <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30"><p className="text-red-400 text-sm mb-2">⛔ Bloccanti (Kill Switches)</p><ul>{res.killSwitches.map((k,i) => <li key={i} className="text-slate-300 text-xs">- {k}</li>)}</ul></div>}
              <div className="grid grid-cols-2 gap-3"><div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/30"><p className="text-emerald-400 text-xs mb-2">Punti di Forza</p><ul>{res.strengths.slice(0,4).map((x,i) => <li key={i} className="text-slate-300 text-xs mb-1">+ {x}</li>)}</ul></div><div className="bg-amber-500/10 rounded-xl p-3 border border-amber-500/30"><p className="text-amber-400 text-xs mb-2">Da Migliorare</p><ul>{res.weaknesses.slice(0,4).map((x,i) => <li key={i} className="text-slate-300 text-xs mb-1">- {x}</li>)}</ul></div></div>
              
              {/* Pacchetti Proposti */}
              <div className="space-y-2">
                <p className="text-white font-medium text-sm">
                  {res.verdetto === 'GO' ? '🎁 Pacchetto Co-Founding (25-35% equity)' : '📋 Pacchetto Proposto (se condizioni migliorano)'}
                </p>
                {res.packages.length > 0 ? (
                  res.packages.map((p,i) => (
                    <div key={i} className="bg-slate-800/50 rounded-xl border border-slate-700">
                      <button onClick={() => setExp(exp === i ? null : i)} className="w-full p-3 flex justify-between text-left">
                        <div>
                          <p className="font-medium text-white text-sm">{p.nome}</p>
                          <p className="text-xs text-violet-400">{p.prezzo}</p>
                        </div>
                        {exp === i ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>
                      {exp === i && (
                        <div className="px-3 pb-3 space-y-2">
                          {p.items.map((it,j) => (
                            <div key={j} className="bg-slate-900/50 rounded p-2">
                              <p className="text-white text-xs font-medium">{it.titolo}</p>
                              <p className="text-xs text-slate-400">{it.descrizione}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 border-dashed">
                    <p className="text-slate-400 text-sm text-center">
                      ⏳ Pacchetto in generazione... Se non appare, l'analisi AI potrebbe essere ancora in corso.
                    </p>
                  </div>
                )}
              </div>
              {res.nextSteps.length > 0 && <div className="bg-violet-500/10 rounded-xl p-4 border border-violet-500/30"><p className="text-violet-400 text-sm mb-2">Prossimi Passi</p><ol>{res.nextSteps.slice(0,4).map((x,i) => <li key={i} className="flex gap-2 mb-1"><span className="w-5 h-5 rounded-full bg-violet-500/30 text-violet-400 text-xs flex items-center justify-center">{i+1}</span><span className="text-slate-300 text-xs">{x}</span></li>)}</ol></div>}
              <div className="flex gap-2">
                <button onClick={savePf} disabled={sv} className={'flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 ' + (sv ? 'bg-emerald-500/20 text-emerald-400' : 'bg-violet-600 text-white')}>{sv ? <><CheckCircle2 className="w-4 h-4" />Salvato</> : <><Save className="w-4 h-4" />Salva</>}</button>
                <button onClick={() => generateInvestmentProposalPDF(inp, res)} className="px-4 py-3 rounded-xl bg-slate-700 text-white flex items-center gap-2 text-sm"><FileText className="w-4 h-4" />Quick PDF</button>
                <Link href="/portfolio" className="px-4 py-3 rounded-xl bg-slate-700 text-white flex items-center"><FolderOpen className="w-4 h-4" /></Link>
              </div>
              
              {/* Genera Proposta Completa AI - Word */}
              <button 
                onClick={() => generateFullProposal('word')} 
                disabled={genProp}
                className="w-full py-4 rounded-xl font-medium text-sm flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {genProp ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{genProgress || 'Generazione AI in corso...'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Genera Proposta Word AI (70+ pagine)</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
              <button onClick={rst} className="w-full py-2 text-slate-500 hover:text-white text-xs">Nuova analisi</button>
            </motion.div>
          ) : (
            <motion.div key={s} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="text-center"><h2 className="text-xl font-bold text-white mb-1">{titles[s]}</h2></div>
              {s === 0 && <div className="max-w-md mx-auto space-y-4">
                <input type="text" value={inp.nome} onChange={e => setInp({...inp, nome: e.target.value})} placeholder="Nome startup" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-center focus:border-violet-500 focus:outline-none" autoFocus />
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Descrizione breve (1-2 frasi)</label>
                  <textarea value={inp.descrizione || ''} onChange={e => setInp({...inp, descrizione: e.target.value})} placeholder="Es: Piattaforma AI che aiuta gli avvocati a trovare precedenti legali in 10 secondi invece di 3 ore" rows={2} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:border-violet-500 focus:outline-none resize-none" />
                </div>
                <div className="pt-4 border-t border-slate-700/50">
                  <p className="text-xs text-slate-500 text-center mb-3">Demo per testing</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => { setInp(DEMO_CORE); setS(10); }} className="px-3 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-400 text-xs font-medium hover:bg-emerald-500/30">🚀 Demo CORE (Mizan)</button>
                    <button onClick={() => { setInp(DEMO_SATELLITE); setS(10); }} className="px-3 py-2 bg-amber-500/20 border border-amber-500/50 rounded-lg text-amber-400 text-xs font-medium hover:bg-amber-500/30">📡 Demo SATELLITE (FitMeal)</button>
                  </div>
                </div>
              </div>}
              {s === 1 && <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">{(['b2b','b2c','b2b2c'] as BusinessModel[]).map(bm => { const c = BM_CFG[bm]; return <button key={bm} onClick={() => setInp({...inp, businessModel: bm})} className={'p-4 rounded-xl border-2 text-center ' + (inp.businessModel === bm ? 'border-violet-500 bg-violet-500/20' : 'border-slate-700')}><c.I className="w-8 h-8 mx-auto mb-2 text-violet-400" /><div className="font-bold text-white">{c.l}</div><div className="text-xs text-slate-400">{c.d}</div></button>})}</div>}
              {s === 2 && <div className="space-y-4"><div className="relative max-w-sm mx-auto"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="text" value={srch} onChange={e => setSrch(e.target.value)} placeholder="Cerca..." className="w-full pl-10 pr-10 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:border-violet-500 focus:outline-none" />{srch && <button onClick={() => setSrch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-slate-500" /></button>}</div>{selSett && !srch && <div className="text-center"><span className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/20 border border-violet-500/50 rounded-full text-violet-300">{selSett.icon} {selSett.label}</span></div>}<div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">{fSett.map(st => <button key={st.id} onClick={() => { setInp({...inp, verticale: st.id}); setSrch(''); }} className={'p-2 rounded-lg border text-center ' + (inp.verticale === st.id ? 'border-violet-500 bg-violet-500/20' : 'border-slate-700/50')}><div className="text-lg">{st.icon}</div><div className="text-xs text-white">{st.label}</div></button>)}</div></div>}
              {s === 3 && <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">{FASE_CFG.map(o => <button key={o.v} onClick={() => setInp({...inp, fase: o.v as FaseAttuale})} className={'p-4 rounded-xl border-2 text-center ' + (inp.fase === o.v ? 'border-violet-500 bg-violet-500/20' : 'border-slate-700')}><o.I className="w-6 h-6 mx-auto mb-1 text-violet-400" /><div className="font-medium text-white">{o.l}</div><div className="text-xs text-slate-400">{o.d}</div></button>)}</div>}
              {s === 4 && <div className="max-w-lg mx-auto space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Quale problema risolvi? Per chi?</label>
                  <textarea value={inp.problemDescription || ''} onChange={e => setInp({...inp, problemDescription: e.target.value})} placeholder="Es: Gli avvocati perdono 3h al giorno a cercare precedenti legali manualmente..." rows={3} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:border-violet-500 focus:outline-none resize-none" />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Come lo risolvono oggi senza di te?</label>
                  <textarea value={inp.currentAlternatives || ''} onChange={e => setInp({...inp, currentAlternatives: e.target.value})} placeholder="Es: Usano ricerche manuali su database, chiedono ai colleghi, pagano consulenti esterni..." rows={2} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:border-violet-500 focus:outline-none resize-none" />
                </div>
                <Hint text="Sii specifico: chi ha il problema, quanto e grave, quanto spesso si presenta. L'AI valutera oggettivamente." />
              </div>}

              {s === 5 && <div className="max-w-lg mx-auto space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Descrivi il mercato e i competitor</label>
                  <textarea value={inp.marketDescription || ''} onChange={e => setInp({...inp, marketDescription: e.target.value})} placeholder="Es: Mercato legaltech italiano vale 500M, dominato da Westlaw e LexisNexis, ma nessuno usa AI..." rows={3} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:border-violet-500 focus:outline-none resize-none" />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Chi e il tuo cliente ideale?</label>
                  <textarea value={inp.targetCustomer || ''} onChange={e => setInp({...inp, targetCustomer: e.target.value})} placeholder="Es: Studi legali medio-grandi (10-50 avvocati), fatturato 1-5M, con almeno 2 praticanti..." rows={2} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:border-violet-500 focus:outline-none resize-none" />
                </div>
                <Hint text="Includi dimensione mercato, competitor principali, trend. L'AI valutera il potenziale." />
              </div>}

              {s === 6 && <div className="max-w-lg mx-auto space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Cosa ti rende unico e difficile da copiare?</label>
                  <textarea value={inp.uniquenessDescription || ''} onChange={e => setInp({...inp, uniquenessDescription: e.target.value})} placeholder="Es: Abbiamo un modello AI proprietario addestrato su 100k sentenze italiane, cosa che richiederebbe 2 anni a un competitor..." rows={3} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:border-violet-500 focus:outline-none resize-none" />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Qual e il tuo vantaggio competitivo?</label>
                  <textarea value={inp.competitiveAdvantage || ''} onChange={e => setInp({...inp, competitiveAdvantage: e.target.value})} placeholder="Es: First mover in Italia, partnership esclusiva con Ordine Avvocati Milano, team con 10 anni in legal..." rows={2} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:border-violet-500 focus:outline-none resize-none" />
                </div>
                <Hint text="Moat = barriera competitiva. Puo essere tech/IP, network effects, dati, brand, regolamentazione." />
              </div>}

              {s === 7 && <div className="max-w-lg mx-auto space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Come guadagni? Qual e il pricing?</label>
                  <textarea value={inp.revenueModel || ''} onChange={e => setInp({...inp, revenueModel: e.target.value})} placeholder="Es: SaaS subscription 99/mese per utente, tier enterprise 499/mese unlimited. Target ACV 5k..." rows={3} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:border-violet-500 focus:outline-none resize-none" />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Unit economics (se li conosci)</label>
                  <textarea value={inp.unitEconomics || ''} onChange={e => setInp({...inp, unitEconomics: e.target.value})} placeholder="Es: CAC ~200 via LinkedIn ads, LTV ~2400 (24 mesi avg), margine lordo 80%..." rows={2} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:border-violet-500 focus:outline-none resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-slate-400 mb-1 block">CAC stimato</label><input type="number" value={inp.cacEstimate || ''} onChange={e => setInp({...inp, cacEstimate: +e.target.value || undefined})} className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm" placeholder="EUR" /></div>
                  <div><label className="text-xs text-slate-400 mb-1 block">LTV stimato</label><input type="number" value={inp.ltvEstimate || ''} onChange={e => setInp({...inp, ltvEstimate: +e.target.value || undefined})} className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm" placeholder="EUR" /></div>
                </div>
                <Hint text="Il rapporto LTV/CAC ideale e almeno 3:1. Se non hai dati, descrivi come pensi di monetizzare." />
              </div>}

              {s === 8 && <div className="max-w-lg mx-auto space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Traction: clienti, revenue, crescita finora</label>
                  <textarea value={inp.tractionDescription || ''} onChange={e => setInp({...inp, tractionDescription: e.target.value})} placeholder="Es: 15 clienti paganti, 3k MRR, crescita 25% mese su mese. 50 in waitlist. 3 enterprise in trial..." rows={3} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:border-violet-500 focus:outline-none resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-slate-400 mb-1 block">Clienti paganti</label><input type="number" value={inp.customersCount || ''} onChange={e => setInp({...inp, customersCount: +e.target.value || undefined})} className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm" placeholder="0" /></div>
                  <div><label className="text-xs text-slate-400 mb-1 block">MRR attuale</label><input type="number" value={inp.mrrCurrent || ''} onChange={e => setInp({...inp, mrrCurrent: +e.target.value || undefined})} className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm" placeholder="EUR" /></div>
                </div>
                <Hint text="Anche se sei in fase early, descrivi segnali di interesse: waitlist, LOI, beta tester, engagement." />
              </div>}
              {s === 9 && <div className="max-w-md mx-auto space-y-4">
                <div>
                  <p className="text-xs text-slate-400 mb-2">Cap Table</p>
                  <div className="space-y-2">
                    {[{v:'solo-founder',l:'Solo Founder'},{v:'founder-advisor',l:'Con Advisor'},{v:'sporca',l:'Complessa (molti soci)',w:true}].map(o => <button key={o.v} onClick={() => setInp({...inp, capTable: o.v as CapTable})} className={'w-full p-3 rounded-xl border-2 text-left ' + (inp.capTable === o.v ? (o.w ? 'border-red-500 bg-red-500/10' : 'border-violet-500 bg-violet-500/20') : 'border-slate-700')}><span className="text-white text-sm">{o.l}</span></button>)}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-2">Coachability</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[{v:'alta',l:'Alta'},{v:'media',l:'Media'},{v:'bassa',l:'Bassa'}].map(o => <button key={o.v} onClick={() => setInp({...inp, coachability: o.v as Coachability})} className={'p-3 rounded-lg border text-center ' + (inp.coachability === o.v ? 'border-violet-500 bg-violet-500/20' : 'border-slate-700')}><div className="text-xs text-white">{o.l}</div></button>)}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-2">Di quali ruoli avete bisogno?</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[{k:'needsCto',l:'CTO'},{k:'needsCmo',l:'CMO'},{k:'needsCfo',l:'CFO'}].map(r => <button key={r.k} onClick={() => setInp({...inp, [r.k]: !(inp as any)[r.k]})} className={'p-2 rounded-lg border font-bold text-sm ' + ((inp as any)[r.k] ? 'border-violet-500 bg-violet-500/20 text-violet-400' : 'border-slate-700 text-slate-400')}>{r.l}</button>)}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-2">Team</p>
                  <div className="flex gap-2 mb-2">
                    {[1,2,3,4].map(n => <button key={n} onClick={() => setInp({...inp, team: {...inp.team!, foundersCount: n}})} className={'flex-1 py-2 rounded-lg border font-bold text-sm ' + (inp.team?.foundersCount === n ? 'border-violet-500 bg-violet-500/20 text-white' : 'border-slate-700 text-slate-400')}>{n}</button>)}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setInp({...inp, team: {...inp.team!, fullTime: true}})} className={'py-2 rounded-lg border text-xs ' + (inp.team?.fullTime ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-slate-700 text-slate-400')}>Full-time</button>
                    <button onClick={() => setInp({...inp, team: {...inp.team!, techInHouse: true}})} className={'py-2 rounded-lg border text-xs ' + (inp.team?.techInHouse ? 'border-violet-500 bg-violet-500/20 text-violet-400' : 'border-slate-700 text-slate-400')}>Tech interno</button>
                  </div>
                </div>
              </div>}

              {s === 10 && <div className="max-w-lg mx-auto text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Pronto per l'analisi AI</h3>
                  <p className="text-sm text-slate-400">Claude valutera oggettivamente la tua startup sui 5 filtri chiave e generera pacchetti personalizzati.</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-left">
                  <p className="text-xs text-slate-500 mb-2">Riepilogo</p>
                  <div className="space-y-1 text-sm">
                    <p className="text-white"><span className="text-slate-400">Nome:</span> {inp.nome}</p>
                    <p className="text-white"><span className="text-slate-400">Modello:</span> {BM_CFG[inp.businessModel].l} - {selSett?.label}</p>
                    <p className="text-white"><span className="text-slate-400">Fase:</span> {FASE_CFG.find(f => f.v === inp.fase)?.l}</p>
                  </div>
                </div>
              </div>}
            </motion.div>
          )}
        </AnimatePresence>
        {!res && <div className="flex justify-between mt-8 pt-6 border-t border-slate-800">
          <button onClick={() => s > 0 && setS(s-1)} disabled={s === 0} className={'flex items-center gap-1 px-4 py-2 rounded-lg text-sm ' + (s === 0 ? 'text-slate-600' : 'text-slate-300 hover:bg-slate-800')}><ArrowLeft className="w-4 h-4" />Indietro</button>
          {s === tot-1 ? <button onClick={sub} disabled={!ok() || ld} className={'flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm ' + (ok() && !ld ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white' : 'bg-slate-700 text-slate-500')}>{ld ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}{ld ? 'Analisi AI in corso...' : 'Analizza con AI'}</button> : <button onClick={() => ok() && setS(s+1)} disabled={!ok()} className={'flex items-center gap-1 px-5 py-2 rounded-lg font-medium text-sm ' + (ok() ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white' : 'bg-slate-700 text-slate-500')}>Avanti<ArrowRight className="w-4 h-4" /></button>}
        </div>}
      </main>
    </div>
  );
}
