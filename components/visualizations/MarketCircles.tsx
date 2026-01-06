'use client';

import { useState } from 'react';
import { MarketSize } from '@/lib/types';
import { Target, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface MarketCirclesProps {
  marketSize: MarketSize;
}

export function MarketCircles({ marketSize }: MarketCirclesProps) {
  const [hoveredCircle, setHoveredCircle] = useState<'tam' | 'sam' | 'som' | null>(null);

  const circles = [
    { key: 'tam' as const, label: 'TAM', color: '#3b82f6', size: 100, data: marketSize.tam },
    { key: 'sam' as const, label: 'SAM', color: '#8b5cf6', size: 70, data: marketSize.sam },
    { key: 'som' as const, label: 'SOM', color: '#22c55e', size: 40, data: marketSize.som },
  ];

  const activeCircle = hoveredCircle ? circles.find(c => c.key === hoveredCircle) : null;

  return (
    <div className="bg-background-secondary rounded-xl border border-border p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-accent-purple/20 flex items-center justify-center">
          <Target className="w-5 h-5 text-accent-purple" />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary">Market Size</h3>
          <p className="text-xs text-text-muted">Stima TAM / SAM / SOM</p>
        </div>
      </div>

      {/* Circles Container */}
      <div className="relative aspect-square flex items-center justify-center">
        {/* Concentric circles */}
        {circles.map((circle, index) => (
          <motion.div
            key={circle.key}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.15, type: 'spring', stiffness: 100 }}
            className="absolute rounded-full flex items-center justify-center cursor-pointer transition-all duration-300"
            style={{
              width: `${circle.size}%`,
              height: `${circle.size}%`,
              backgroundColor: `${circle.color}10`,
              border: `2px solid ${circle.color}${hoveredCircle === circle.key ? '' : '60'}`,
              boxShadow: hoveredCircle === circle.key ? `0 0 30px ${circle.color}40` : 'none',
            }}
            onMouseEnter={() => setHoveredCircle(circle.key)}
            onMouseLeave={() => setHoveredCircle(null)}
          >
            {circle.key === 'som' && (
              <div className="text-center">
                <span className="text-2xl">🎯</span>
              </div>
            )}
          </motion.div>
        ))}

        {/* Labels on circles */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-medium text-accent-blue">
          TAM
        </div>
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 text-xs font-medium text-accent-purple">
          SAM
        </div>
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 text-xs font-medium text-accent-green">
          SOM
        </div>
      </div>

      {/* Info Panel */}
      <div className="mt-4 space-y-3">
        {circles.map((circle) => (
          <motion.div
            key={circle.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + circles.indexOf(circle) * 0.1 }}
            className={`p-3 rounded-lg border transition-all ${
              hoveredCircle === circle.key
                ? 'bg-background-tertiary border-border-strong'
                : 'bg-background-tertiary/50 border-border/50'
            }`}
            onMouseEnter={() => setHoveredCircle(circle.key)}
            onMouseLeave={() => setHoveredCircle(null)}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: circle.color }}
                />
                <span className="text-sm font-medium text-text-primary">{circle.label}</span>
              </div>
              <span className="text-lg font-bold" style={{ color: circle.color }}>
                {circle.data.value}
              </span>
            </div>
            <p className="text-xs text-text-muted mb-2">{circle.data.description}</p>
            <div className="flex items-start gap-1 text-[10px] text-text-muted/70 bg-background/50 rounded px-2 py-1">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span className="font-mono">{circle.data.formula}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
