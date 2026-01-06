'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { BattleMatrix } from './visualizations/BattleMatrix';
import { MarketCircles } from './visualizations/MarketCircles';
import { KanbanRoadmap } from './visualizations/KanbanRoadmap';
import { RiskPanel } from './visualizations/RiskPanel';
import { ContactCards } from './visualizations/ContactCards';
import { VerdictBanner } from './visualizations/VerdictBanner';
import { ScoreCard } from './visualizations/ScoreCard';
import { EmptyState } from './EmptyState';
import { StartupArsenal } from './StartupArsenal';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader2 } from 'lucide-react';
import { generateAnalysisPDF } from '@/lib/pdf-export';

export function WarRoom() {
  const { currentAnalysis, isAnalyzing, analysisProgress } = useStore();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!currentAnalysis) return;
    
    setIsExporting(true);
    try {
      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      generateAnalysisPDF(currentAnalysis);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!currentAnalysis && !isAnalyzing) {
    return <EmptyState />;
  }

  return (
    <div className="h-full overflow-y-auto bg-background p-6">
      <AnimatePresence mode="wait">
        {isAnalyzing && !currentAnalysis ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center"
          >
            <div className="relative w-32 h-32">
              {/* Animated rings */}
              <div className="absolute inset-0 rounded-full border-2 border-agent-orchestrator/30 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-agent-market/30 animate-ping" style={{ animationDelay: '0.2s' }} />
              <div className="absolute inset-4 rounded-full border-2 border-agent-growth/30 animate-ping" style={{ animationDelay: '0.4s' }} />
              <div className="absolute inset-6 rounded-full border-2 border-agent-project/30 animate-ping" style={{ animationDelay: '0.6s' }} />
              <div className="absolute inset-8 rounded-full border-2 border-agent-devil/30 animate-ping" style={{ animationDelay: '0.8s' }} />
              
              {/* Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-agent-orchestrator to-agent-market flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
              </div>
            </div>
            
            <p className="mt-8 text-text-secondary text-sm">
              Analisi in corso... {analysisProgress}%
            </p>
            <p className="mt-2 text-text-muted text-xs">
              Gli agenti stanno elaborando la tua idea
            </p>
          </motion.div>
        ) : currentAnalysis ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 max-w-7xl mx-auto"
          >
            {/* Header with Export Button */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-text-primary">Report di Analisi</h2>
                <p className="text-sm text-text-muted">Generato con Claude AI</p>
              </div>
              <motion.button
                onClick={handleExportPDF}
                disabled={isExporting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Esportando...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Esporta PDF</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Verdict Banner + Score Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <VerdictBanner 
                  verdict={currentAnalysis.verdict}
                  reason={currentAnalysis.verdictReason}
                  title={currentAnalysis.ideaTitle}
                />
              </div>
              <div className="lg:col-span-1">
                <ScoreCard scores={currentAnalysis.scores} />
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Battle Matrix - Competitors */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <BattleMatrix competitors={currentAnalysis.competitors} />
              </motion.div>

              {/* Market Circles - TAM/SAM/SOM */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <MarketCircles marketSize={currentAnalysis.marketSize} />
              </motion.div>
            </div>

            {/* Kanban Roadmap - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <KanbanRoadmap 
                tasks={currentAnalysis.roadmap}
                experiments={currentAnalysis.growthExperiments}
                personas={currentAnalysis.earlyAdopters}
              />
            </motion.div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <RiskPanel risks={currentAnalysis.risks} />
              </motion.div>

              {/* Contact Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <ContactCards 
                  contacts={currentAnalysis.contacts}
                  idea={useStore.getState().currentIdea!}
                />
              </motion.div>
            </div>

            {/* Startup Arsenal - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <StartupArsenal />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
