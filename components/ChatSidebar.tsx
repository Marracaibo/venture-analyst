'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { runAnalysis, needsClarification, parseIdeaFromInput } from '@/lib/agents';
import { runAnalysisWithAI } from '@/lib/agents-api';
import { getAgentColor, getAgentEmoji, cn } from '@/lib/utils';
import { Send, Sparkles, RotateCcw, Lightbulb, Zap, Bot, Wand2, History, Trash2, MessageCircle, X, GitCompare, Calculator, Star, PlusCircle, Shield, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { StartupIdea, AgentType } from '@/lib/types';

export function ChatSidebar() {
  const [input, setInput] = useState('');
  const [pendingIdea, setPendingIdea] = useState<Partial<StartupIdea>>({});
  const [useRealAI, setUseRealAI] = useState(true); // Toggle between real Claude AI and mock
  const [apiConfigured, setApiConfigured] = useState<boolean | null>(null);
  const [autoSubmitDone, setAutoSubmitDone] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  
  const {
    chatMessages,
    addChatMessage,
    addAgentLog,
    setCurrentIdea,
    setCurrentAnalysis,
    setIsAnalyzing,
    setCurrentAgent,
    setAnalysisProgress,
    setClarificationNeeded,
    clarificationNeeded,
    clarificationQuestions,
    isAnalyzing,
    reset,
    startNewIdea,
    // History
    analysisHistory,
    loadHistory,
    saveToHistory,
    loadFromHistory,
    deleteFromHistory,
    // Favorites
    favorites,
    loadFavorites,
    toggleFavorite,
    removeFavorite,
    currentSavedId,
    // Follow-up
    followUpMode,
    setFollowUpMode,
    currentAnalysis,
  } = useStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, streamingResponse]);

  // Load history and favorites on mount
  useEffect(() => {
    loadHistory();
    loadFavorites();
  }, []);

  // Add welcome message on mount
  useEffect(() => {
    if (chatMessages.length === 0) {
      addChatMessage({
        role: 'assistant',
        content: `👋 Benvenuto nel **Virtual Venture Analyst**!

Sono il tuo team di agenti AI specializzati nell'analisi di startup. Descrivi la tua idea e ti fornirò:

• 📊 Analisi competitor e mercato
• 🚀 Strategia Go-To-Market
• 🗓️ Roadmap esecutiva 4 settimane
• 👿 Stress test dei rischi

**Come descrivere la tua idea:**
Includi il **problema** che risolvi, la **soluzione** proposta, e il **target** di riferimento.

*Esempio: "Voglio creare una piattaforma che aiuta gli studi legali italiani a gestire i documenti con AI, riducendo il tempo di ricerca del 70%."*`,
        agent: 'orchestrator',
      });
    }
  }, []);

  // Store idea from URL for auto-submit
  const ideaFromUrl = searchParams.get('idea');
  const pendingUrlIdea = useRef<string | null>(null);
  
  // Set pending URL idea when detected
  useEffect(() => {
    if (ideaFromUrl && !autoSubmitDone) {
      pendingUrlIdea.current = ideaFromUrl;
    }
  }, [ideaFromUrl, autoSubmitDone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAnalyzing) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    addChatMessage({
      role: 'user',
      content: userMessage,
    });

    // If using real AI, let Claude handle the parsing
    if (useRealAI) {
      // If we're waiting for clarification, merge the user's response with previous context
      if (clarificationNeeded && pendingIdea) {
        // Combine all context into a rich description for Claude
        const fullContext = [
          pendingIdea.problem && `Problema: ${pendingIdea.problem}`,
          pendingIdea.solution && `Soluzione: ${pendingIdea.solution}`,
          pendingIdea.target && `Target: ${pendingIdea.target}`,
          pendingIdea.additionalContext && `Contesto: ${pendingIdea.additionalContext}`,
          `Risposta alle domande: ${userMessage}`,
        ].filter(Boolean).join('\n');
        
        const updatedIdea: StartupIdea = {
          problem: pendingIdea.problem || userMessage,
          solution: pendingIdea.solution || userMessage,
          target: pendingIdea.target || userMessage,
          additionalContext: fullContext,
        };
        
        setClarificationNeeded(false);
        setPendingIdea({});
        await startAnalysis(updatedIdea);
        return;
      }
      
      // Start analysis with whatever we have - Claude will ask for clarification if needed
      const ideaToAnalyze: StartupIdea = {
        problem: userMessage,
        solution: userMessage,
        target: userMessage,
        additionalContext: userMessage,
      };
      
      await startAnalysis(ideaToAnalyze);
      return;
    }

    // Demo mode: use local parsing logic
    if (clarificationNeeded) {
      const updatedIdea = { ...pendingIdea };
      
      const parsed = parseIdeaFromInput(userMessage);
      if (parsed.problem) updatedIdea.problem = parsed.problem;
      if (parsed.solution) updatedIdea.solution = parsed.solution;
      if (parsed.target) updatedIdea.target = parsed.target;
      if (parsed.additionalContext) {
        if (!updatedIdea.problem) updatedIdea.problem = parsed.additionalContext;
        else if (!updatedIdea.solution) updatedIdea.solution = parsed.additionalContext;
        else if (!updatedIdea.target) updatedIdea.target = parsed.additionalContext;
      }

      const check = needsClarification(updatedIdea);
      if (check.needed) {
        setPendingIdea(updatedIdea);
        setClarificationNeeded(true, check.questions);
        addChatMessage({
          role: 'assistant',
          content: `Grazie! Ho ancora bisogno di qualche dettaglio:\n\n${check.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`,
          agent: 'orchestrator',
        });
        return;
      }

      setClarificationNeeded(false);
      await startAnalysis(updatedIdea as StartupIdea);
      return;
    }

    const parsed = parseIdeaFromInput(userMessage);
    const check = needsClarification(parsed);
    if (check.needed) {
      setPendingIdea(parsed);
      setClarificationNeeded(true, check.questions);
      addChatMessage({
        role: 'assistant',
        content: `Interessante! Per fornirti un'analisi completa, ho bisogno di qualche dettaglio in più:\n\n${check.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`,
        agent: 'orchestrator',
      });
      return;
    }

    await startAnalysis({
      problem: parsed.problem || userMessage,
      solution: parsed.solution || userMessage,
      target: parsed.target || 'Da definire',
      additionalContext: parsed.additionalContext,
    });
  };

  const startAnalysis = async (idea: StartupIdea) => {
    setCurrentIdea(idea);
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const modeLabel = useRealAI ? '🤖 Claude AI' : '⚡ Demo Mode';
    addChatMessage({
      role: 'assistant',
      content: `🎯 Perfetto! Avvio l'analisi completa della tua idea...

**Modalità:** ${modeLabel}
Gli agenti stanno lavorando. Osserva la barra in alto per seguire il progresso.`,
      agent: 'orchestrator',
    });

    try {
      // Choose between real AI and mock based on toggle
      const analysisFunction = useRealAI ? runAnalysisWithAI : runAnalysis;
      
      const result = await analysisFunction(
        idea,
        (agent: AgentType, message: string, status: 'running' | 'complete' | 'error') => {
          addAgentLog({ agent, message, status: status === 'error' ? 'complete' : status });
        },
        (progress: number) => {
          setAnalysisProgress(progress);
        },
        (agent: AgentType) => {
          setCurrentAgent(agent);
        }
      );

      setCurrentAnalysis(result);
      setIsAnalyzing(false);
      setCurrentAgent(null);
      setPendingIdea({}); // Reset pending idea so user can start fresh
      setClarificationNeeded(false); // Reset clarification state
      setFollowUpMode(true); // Enable follow-up questions

      const aiNote = useRealAI ? '\n\n*Analisi generata con Claude AI - dati realistici basati su ricerca simulata.*' : '';
      addChatMessage({
        role: 'assistant',
        content: `✅ **Analisi completata!**

Ho generato un report completo con:
- Verdetto: ${result.verdict === 'green' ? '🟢 Promettente' : result.verdict === 'yellow' ? '🟡 Cauto' : '🔴 Problematico'}
- ${result.competitors.length} competitor analizzati
- ${result.growthExperiments.length} esperimenti GTM
- ${result.roadmap.length} task nella roadmap
- ${result.risks.length} rischi identificati

Esplora i risultati nella **War Room** a destra. Puoi cliccare su ogni sezione per approfondire.${aiNote}

💬 **Fai domande di approfondimento** sull'analisi qui sotto!`,
        agent: 'orchestrator',
      });

      // Save to history
      saveToHistory();
    } catch (error) {
      setIsAnalyzing(false);
      setCurrentAgent(null);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check if Claude is asking for clarification
      if (errorMessage.startsWith('CLARIFICATION_NEEDED:')) {
        try {
          const questionsJson = errorMessage.replace('CLARIFICATION_NEEDED:', '');
          const questions = JSON.parse(questionsJson) as string[];
          
          setPendingIdea(idea);
          setClarificationNeeded(true, questions);
          addChatMessage({
            role: 'assistant',
            content: `🤔 **Ho bisogno di qualche dettaglio in più per fornirti un'analisi completa:**\n\n${questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n')}\n\n*Rispondi a queste domande e riavvierò l'analisi.*`,
            agent: 'orchestrator',
          });
          return;
        } catch {
          // If parsing fails, show as regular message
        }
      }
      
      // Check for API key error
      if (errorMessage.includes('ANTHROPIC_API_KEY') || errorMessage.includes('not configured')) {
        addChatMessage({
          role: 'assistant',
          content: `⚠️ **API Key non configurata**

Per usare Claude AI, devi configurare la chiave API:

1. Crea un file \`.env.local\` nella cartella del progetto
2. Aggiungi: \`ANTHROPIC_API_KEY=your_key_here\`
3. Riavvia il server

Oppure passa alla **Demo Mode** per testare l'interfaccia.`,
          agent: 'orchestrator',
        });
        setApiConfigured(false);
      } else {
        addChatMessage({
          role: 'assistant',
          content: `❌ Si è verificato un errore durante l'analisi: ${errorMessage}`,
          agent: 'orchestrator',
        });
      }
    }
  };

  // Process pending URL idea after startAnalysis is available
  useEffect(() => {
    if (pendingUrlIdea.current && !autoSubmitDone && !isAnalyzing && chatMessages.length > 0) {
      const ideaText = pendingUrlIdea.current;
      pendingUrlIdea.current = null;
      setAutoSubmitDone(true);
      
      // Add user message
      addChatMessage({
        role: 'user',
        content: ideaText,
      });
      
      // Start analysis
      const ideaToAnalyze: StartupIdea = {
        problem: ideaText,
        solution: ideaText,
        target: ideaText,
        additionalContext: ideaText,
      };
      
      startAnalysis(ideaToAnalyze);
    }
  }, [chatMessages.length, autoSubmitDone, isAnalyzing]);

  const handleReset = () => {
    startNewIdea();
    setPendingIdea({});
    setStreamingResponse('');
    setShowHistory(false);
    // Add welcome message back
    setTimeout(() => {
      addChatMessage({
        role: 'assistant',
        content: `👋 Pronto per una nuova analisi! Descrivi la tua idea di startup.`,
        agent: 'orchestrator',
      });
    }, 100);
  };

  // Handle follow-up questions with streaming
  const handleFollowUp = async (question: string) => {
    if (!currentAnalysis) return;

    addChatMessage({ role: 'user', content: question });
    setIsStreaming(true);
    setStreamingResponse('');

    try {
      const response = await fetch('/api/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          context: {
            ideaDescription: currentAnalysis.ideaDescription,
            verdict: currentAnalysis.verdict,
            scores: currentAnalysis.scores,
            competitors: currentAnalysis.competitors,
            risks: currentAnalysis.risks,
          },
        }),
      });

      if (!response.ok) throw new Error('Follow-up failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullResponse += parsed.text;
                  setStreamingResponse(fullResponse);
                }
              } catch {
                // Ignore parse errors
              }
            }
          }
        }
      }

      // Add final message
      addChatMessage({
        role: 'assistant',
        content: fullResponse,
        agent: 'orchestrator',
      });
      setStreamingResponse('');
    } catch (error) {
      console.error('Follow-up error:', error);
      addChatMessage({
        role: 'assistant',
        content: '❌ Errore durante la risposta. Riprova.',
        agent: 'orchestrator',
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const exampleIdeas = [
    "Una piattaforma SaaS per studi legali che usa AI per analizzare contratti",
    "Un'app B2B per la gestione automatizzata delle spese aziendali",
    "Un marketplace per freelancer specializzati in AI e machine learning",
  ];

  return (
    <aside className="w-full md:w-80 lg:w-96 bg-background-secondary md:border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-agent-orchestrator to-agent-market flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-text-primary">Virtual Venture Analyst</h1>
              <p className="text-xs text-text-muted hidden sm:block">Multi-Agent Startup Analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                showHistory ? "bg-accent-purple/20 text-accent-purple" : "hover:bg-background-tertiary text-text-muted hover:text-text-secondary"
              )}
              title="Cronologia"
            >
              <History className="w-4 h-4" />
            </button>
            <Link
              href="/generator"
              className="p-1.5 rounded-lg hover:bg-background-tertiary text-accent-purple hover:text-accent-purple/80 transition-colors"
              title="Idea Generator"
            >
              <Wand2 className="w-4 h-4" />
            </Link>
            <Link
              href="/compare"
              className="p-1.5 rounded-lg hover:bg-background-tertiary text-accent-cyan hover:text-accent-cyan/80 transition-colors"
              title="Confronta Idee"
            >
              <GitCompare className="w-4 h-4" />
            </Link>
            <Link
              href="/financial"
              className="p-1.5 rounded-lg hover:bg-background-tertiary text-accent-green hover:text-accent-green/80 transition-colors"
              title="Financial Model"
            >
              <Calculator className="w-4 h-4" />
            </Link>
            <Link
              href="/screener"
              className="p-1.5 rounded-lg hover:bg-background-tertiary text-violet-400 hover:text-violet-300 transition-colors"
              title="Forge Studio Screener"
            >
              <Shield className="w-4 h-4" />
            </Link>
            <Link
              href="/portfolio"
              className="p-1.5 rounded-lg hover:bg-background-tertiary text-amber-400 hover:text-amber-300 transition-colors"
              title="Portfolio Startup"
            >
              <Briefcase className="w-4 h-4" />
            </Link>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg hover:bg-background-tertiary text-text-muted hover:text-text-secondary transition-colors"
              title="Nuova analisi"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* AI Mode Toggle */}
        <div className="flex items-center justify-between bg-background-tertiary rounded-lg p-2">
          <div className="flex items-center gap-2">
            {useRealAI ? (
              <Bot className="w-4 h-4 text-accent-purple" />
            ) : (
              <Zap className="w-4 h-4 text-accent-yellow" />
            )}
            <span className="text-xs font-medium text-text-secondary">
              {useRealAI ? 'Claude AI' : 'Demo Mode'}
            </span>
          </div>
          <button
            onClick={() => setUseRealAI(!useRealAI)}
            disabled={isAnalyzing}
            className={cn(
              'relative w-10 h-5 rounded-full transition-colors',
              useRealAI ? 'bg-accent-purple' : 'bg-background-elevated',
              isAnalyzing && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div
              className={cn(
                'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
                useRealAI ? 'translate-x-5' : 'translate-x-0.5'
              )}
            />
          </button>
        </div>
        {apiConfigured === false && useRealAI && (
          <p className="text-[10px] text-accent-yellow mt-2">
            ⚠️ API key non configurata - configura .env.local
          </p>
        )}
      </div>

      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-border overflow-hidden"
          >
            <div className="p-3 max-h-64 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-text-muted">Cronologia & Preferiti</span>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-1 hover:bg-background-tertiary rounded"
                >
                  <X className="w-3 h-3 text-text-muted" />
                </button>
              </div>
              
              {/* Favorites */}
              {favorites.length > 0 && (
                <div className="mb-3">
                  <p className="text-[10px] text-yellow-400 font-medium mb-1 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400" /> Preferiti
                  </p>
                  <div className="space-y-1">
                    {favorites.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-start gap-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors group"
                      >
                        <button
                          onClick={() => {
                            loadFromHistory(entry.id);
                            setShowHistory(false);
                          }}
                          className="flex-1 text-left"
                        >
                          <p className="text-xs font-medium text-text-primary line-clamp-1">{entry.title}</p>
                        </button>
                        <button
                          onClick={() => removeFavorite(entry.id)}
                          className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded transition-all"
                        >
                          <X className="w-3 h-3 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent */}
              <p className="text-[10px] text-text-muted font-medium mb-1">Recenti</p>
              {analysisHistory.length === 0 ? (
                <p className="text-xs text-text-muted text-center py-2">Nessuna analisi salvata</p>
              ) : (
                <div className="space-y-1">
                  {analysisHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start gap-2 p-2 rounded-lg bg-background-tertiary/50 hover:bg-background-tertiary transition-colors group"
                    >
                      <button
                        onClick={() => {
                          loadFromHistory(entry.id);
                          setShowHistory(false);
                        }}
                        className="flex-1 text-left"
                      >
                        <p className="text-xs font-medium text-text-primary line-clamp-1">{entry.title}</p>
                        <p className="text-[10px] text-text-muted">
                          {new Date(entry.timestamp).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </button>
                      <button
                        onClick={() => deleteFromHistory(entry.id)}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded transition-all"
                      >
                        <Trash2 className="w-3 h-3 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {chatMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'flex-row-reverse' : ''
              )}
            >
              {message.role === 'assistant' && message.agent && (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                  style={{ backgroundColor: `${getAgentColor(message.agent)}20` }}
                >
                  {getAgentEmoji(message.agent)}
                </div>
              )}
              <div
                className={cn(
                  'rounded-xl px-4 py-3 max-w-[85%]',
                  message.role === 'user'
                    ? 'bg-accent-blue text-white'
                    : 'bg-background-tertiary text-text-primary'
                )}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.content.split('**').map((part, i) => 
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                  )}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Streaming response */}
        {isStreaming && streamingResponse && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 bg-accent-purple/20"
            >
              ✨
            </div>
            <div className="rounded-xl px-4 py-3 max-w-[85%] bg-background-tertiary text-text-primary">
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {streamingResponse}
                <span className="inline-block w-2 h-4 bg-accent-purple/50 animate-pulse ml-1" />
              </p>
            </div>
          </motion.div>
        )}

        {/* Example ideas when empty */}
        {chatMessages.length === 1 && !followUpMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-2 mt-4"
          >
            <div className="flex items-center gap-2 text-text-muted text-xs">
              <Lightbulb className="w-3 h-3" />
              <span>Esempi di idee:</span>
            </div>
            {exampleIdeas.map((idea, i) => (
              <button
                key={i}
                onClick={() => setInput(idea)}
                className="w-full text-left p-3 rounded-lg bg-background-tertiary/50 hover:bg-background-tertiary text-xs text-text-secondary hover:text-text-primary transition-colors border border-border/50"
              >
                {idea}
              </button>
            ))}
          </motion.div>
        )}

        {/* Follow-up mode indicator */}
        {followUpMode && currentAnalysis && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 p-3 rounded-lg bg-accent-green/10 border border-accent-green/30">
              <MessageCircle className="w-4 h-4 text-accent-green flex-shrink-0" />
              <span className="text-xs text-accent-green flex-1">
                Analisi completata! Fai domande o salva.
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleFavorite}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors",
                  currentSavedId && favorites.some(f => f.id === currentSavedId)
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-background-tertiary text-text-muted hover:text-yellow-400"
                )}
              >
                <Star className={cn(
                  "w-3.5 h-3.5",
                  currentSavedId && favorites.some(f => f.id === currentSavedId) && "fill-yellow-400"
                )} />
                {currentSavedId && favorites.some(f => f.id === currentSavedId) ? 'Salvato!' : 'Salva'}
              </button>
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-accent-purple/20 text-accent-purple text-xs font-medium hover:bg-accent-purple/30 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Nuova Idea
              </button>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim() || isAnalyzing || isStreaming) return;
          
          // If in follow-up mode, use streaming follow-up
          if (followUpMode && currentAnalysis) {
            handleFollowUp(input.trim());
            setInput('');
          } else {
            handleSubmit(e);
          }
        }} 
        className="p-4 border-t border-border"
      >
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!input.trim() || isAnalyzing || isStreaming) return;
                
                if (followUpMode && currentAnalysis) {
                  handleFollowUp(input.trim());
                  setInput('');
                } else {
                  handleSubmit(e as unknown as React.FormEvent);
                }
              }
            }}
            placeholder={
              followUpMode && currentAnalysis 
                ? "Fai una domanda sull'analisi..." 
                : clarificationNeeded 
                  ? "Rispondi alle domande..." 
                  : "Descrivi la tua idea di startup..."
            }
            className="w-full bg-background-tertiary border border-border rounded-xl px-4 py-3 pr-12 text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple"
            rows={3}
            disabled={isAnalyzing || isStreaming}
          />
          <button
            type="submit"
            disabled={!input.trim() || isAnalyzing || isStreaming}
            className={cn(
              'absolute right-3 bottom-3 p-2 rounded-lg transition-all',
              input.trim() && !isAnalyzing && !isStreaming
                ? 'bg-accent-purple text-white hover:bg-accent-purple/80'
                : 'bg-background-elevated text-text-muted cursor-not-allowed'
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        {isAnalyzing && (
          <p className="text-xs text-text-muted mt-2 text-center animate-pulse">
            Analisi in corso... Osserva la War Room
          </p>
        )}
        {isStreaming && (
          <p className="text-xs text-accent-purple mt-2 text-center animate-pulse">
            Risposta in streaming...
          </p>
        )}
      </form>
    </aside>
  );
}
