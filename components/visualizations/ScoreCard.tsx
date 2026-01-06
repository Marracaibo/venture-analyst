'use client';

import { motion } from 'framer-motion';
import { ScoreBreakdown } from '@/lib/types';
import { TrendingUp, Users, Zap, Sparkles, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreCardProps {
  scores: ScoreBreakdown;
}

const scoreCategories = [
  { key: 'marketSize', label: 'Market Size', icon: TrendingUp, description: 'Dimensione e potenziale del mercato' },
  { key: 'competition', label: 'Competizione', icon: Users, description: 'Livello di competizione (alto = meno competitor)' },
  { key: 'executionRisk', label: 'Esecuzione', icon: Zap, description: 'Facilità di esecuzione (alto = più facile)' },
  { key: 'differentiation', label: 'Differenziazione', icon: Sparkles, description: 'Unicità della proposta' },
  { key: 'timing', label: 'Timing', icon: Clock, description: 'Tempismo di mercato' },
] as const;

function getScoreColor(score: number): string {
  if (score >= 75) return 'text-accent-green';
  if (score >= 50) return 'text-accent-yellow';
  if (score >= 25) return 'text-accent-orange';
  return 'text-accent-red';
}

function getScoreBgColor(score: number): string {
  if (score >= 75) return 'bg-accent-green';
  if (score >= 50) return 'bg-accent-yellow';
  if (score >= 25) return 'bg-accent-orange';
  return 'bg-accent-red';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Eccellente';
  if (score >= 65) return 'Buono';
  if (score >= 50) return 'Medio';
  if (score >= 35) return 'Basso';
  return 'Critico';
}

export function ScoreCard({ scores }: ScoreCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background-secondary rounded-xl border border-border p-6"
    >
      {/* Header with Overall Score */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Score Complessivo</h3>
            <p className="text-xs text-text-muted">Valutazione su 5 metriche chiave</p>
          </div>
        </div>
        
        {/* Overall Score Circle */}
        <div className="relative">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-background-tertiary"
            />
            <motion.circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              className={getScoreColor(scores.overall)}
              initial={{ strokeDasharray: '0 214' }}
              animate={{ strokeDasharray: `${(scores.overall / 100) * 214} 214` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className={cn('text-2xl font-bold', getScoreColor(scores.overall))}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              {scores.overall}
            </motion.span>
            <span className="text-[10px] text-text-muted">/100</span>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-4">
        {scoreCategories.map((category, index) => {
          const score = scores[category.key as keyof ScoreBreakdown] as number;
          const Icon = category.icon;
          
          return (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-text-muted" />
                  <span className="text-sm font-medium text-text-secondary">{category.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn('text-sm font-bold', getScoreColor(score))}>
                    {score}
                  </span>
                  <span className="text-xs text-text-muted hidden group-hover:inline">
                    {getScoreLabel(score)}
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
                <motion.div
                  className={cn('h-full rounded-full', getScoreBgColor(score))}
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.8, delay: 0.2 * index }}
                />
              </div>
              
              {/* Tooltip on hover */}
              <p className="text-[10px] text-text-muted mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {category.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Score Legend */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-center gap-4 text-[10px] text-text-muted">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-accent-green" />
            <span>75+ Ottimo</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-accent-yellow" />
            <span>50-74 Medio</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-accent-orange" />
            <span>25-49 Basso</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-accent-red" />
            <span>&lt;25 Critico</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
