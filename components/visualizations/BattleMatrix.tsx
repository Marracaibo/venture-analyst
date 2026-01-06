'use client';

import { useState } from 'react';
import { Competitor } from '@/lib/types';
import { Swords, ExternalLink, X, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BattleMatrixProps {
  competitors: Competitor[];
}

export function BattleMatrix({ competitors }: BattleMatrixProps) {
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);

  // Calculate position on the matrix (0-100 scale)
  const getPosition = (competitor: Competitor) => ({
    x: (competitor.priceLevel / 10) * 80 + 10, // 10-90% range
    y: 100 - ((competitor.complexity / 10) * 80 + 10), // Inverted for CSS
  });

  // Your position (the gap in the market)
  const yourPosition = {
    x: 35, // Lower price
    y: 65, // Lower complexity (higher on screen)
  };

  return (
    <div className="bg-background-secondary rounded-xl border border-border p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-accent-blue/20 flex items-center justify-center">
          <Swords className="w-5 h-5 text-accent-blue" />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary">Battle Matrix</h3>
          <p className="text-xs text-text-muted">Posizionamento competitivo</p>
        </div>
      </div>

      {/* Matrix */}
      <div className="relative aspect-square bg-background-tertiary rounded-lg border border-border overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="border border-border/30" />
          ))}
        </div>

        {/* Axis labels */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-text-muted">
          Prezzo →
        </div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-text-muted">
          Complessità →
        </div>

        {/* Quadrant labels */}
        <div className="absolute top-3 left-3 text-[10px] text-text-muted/50">
          Enterprise
        </div>
        <div className="absolute top-3 right-3 text-[10px] text-text-muted/50">
          Premium
        </div>
        <div className="absolute bottom-3 left-3 text-[10px] text-text-muted/50">
          Budget
        </div>
        <div className="absolute bottom-3 right-3 text-[10px] text-text-muted/50">
          Luxury
        </div>

        {/* Competitors */}
        {competitors.map((competitor, index) => {
          const pos = getPosition(competitor);
          return (
            <motion.button
              key={competitor.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedCompetitor(competitor)}
              className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer hover:scale-110 transition-transform border-2"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                backgroundColor: competitor.type === 'direct' ? '#3b82f620' : '#f9731620',
                borderColor: competitor.type === 'direct' ? '#3b82f6' : '#f97316',
                color: competitor.type === 'direct' ? '#3b82f6' : '#f97316',
              }}
              title={competitor.name}
            >
              {competitor.name.charAt(0)}
            </motion.button>
          );
        })}

        {/* Your position */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-green/20 border-2 border-accent-green flex items-center justify-center"
          style={{
            left: `${yourPosition.x}%`,
            top: `${yourPosition.y}%`,
          }}
        >
          <span className="text-lg">🎯</span>
        </motion.div>

        {/* Blue Ocean indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.6 }}
          className="absolute w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-green/10 border border-dashed border-accent-green/30"
          style={{
            left: `${yourPosition.x}%`,
            top: `${yourPosition.y}%`,
          }}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-blue" />
          <span className="text-text-muted">Diretto</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-orange" />
          <span className="text-text-muted">Indiretto</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-green" />
          <span className="text-text-muted">Tu (Oceano Blu)</span>
        </div>
      </div>

      {/* Competitor Detail Modal */}
      <AnimatePresence>
        {selectedCompetitor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCompetitor(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background-secondary rounded-xl border border-border p-6 max-w-md w-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
                    style={{
                      backgroundColor: selectedCompetitor.type === 'direct' ? '#3b82f620' : '#f9731620',
                      color: selectedCompetitor.type === 'direct' ? '#3b82f6' : '#f97316',
                    }}
                  >
                    {selectedCompetitor.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">{selectedCompetitor.name}</h4>
                    <p className="text-xs text-text-muted capitalize">
                      Competitor {selectedCompetitor.type === 'direct' ? 'Diretto' : 'Indiretto'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCompetitor(null)}
                  className="p-1 rounded hover:bg-background-tertiary text-text-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedCompetitor.funding && (
                <div className="mb-4 px-3 py-2 rounded-lg bg-background-tertiary">
                  <span className="text-xs text-text-muted">Funding: </span>
                  <span className="text-sm text-text-primary font-medium">{selectedCompetitor.funding}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-accent-green" />
                    <span className="text-xs font-medium text-text-secondary">Punti di Forza</span>
                  </div>
                  <ul className="space-y-1">
                    {selectedCompetitor.strengths.map((s, i) => (
                      <li key={i} className="text-xs text-text-muted flex items-start gap-2">
                        <span className="text-accent-green">+</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-4 h-4 text-accent-red" />
                    <span className="text-xs font-medium text-text-secondary">Punti Deboli</span>
                  </div>
                  <ul className="space-y-1">
                    {selectedCompetitor.weaknesses.map((w, i) => (
                      <li key={i} className="text-xs text-text-muted flex items-start gap-2">
                        <span className="text-accent-red">-</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {selectedCompetitor.website && (
                <a
                  href={selectedCompetitor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-background-tertiary hover:bg-background-elevated text-text-secondary text-sm transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visita sito
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
