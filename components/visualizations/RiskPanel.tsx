'use client';

import { Risk } from '@/lib/types';
import { getSeverityColor } from '@/lib/utils';
import { AlertTriangle, Shield, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface RiskPanelProps {
  risks: Risk[];
}

export function RiskPanel({ risks }: RiskPanelProps) {
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);

  const getSeverityLabel = (severity: Risk['severity']) => {
    switch (severity) {
      case 'critical':
        return 'Critico';
      case 'high':
        return 'Alto';
      case 'medium':
        return 'Medio';
    }
  };

  return (
    <div className="bg-background-secondary rounded-xl border border-border p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-accent-red/20 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-accent-red" />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary">Devil's Advocate</h3>
          <p className="text-xs text-text-muted">Stress Test & Rischi Identificati</p>
        </div>
      </div>

      {/* Risks List */}
      <div className="space-y-3">
        {risks.map((risk, index) => (
          <motion.div
            key={risk.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background-tertiary rounded-lg border border-border overflow-hidden"
          >
            <button
              onClick={() => setExpandedRisk(expandedRisk === risk.id ? null : risk.id)}
              className="w-full p-4 text-left"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${getSeverityColor(risk.severity)}20` }}
                >
                  <span className="text-lg">👿</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-medium uppercase"
                      style={{
                        backgroundColor: `${getSeverityColor(risk.severity)}20`,
                        color: getSeverityColor(risk.severity),
                      }}
                    >
                      {getSeverityLabel(risk.severity)}
                    </span>
                  </div>
                  <h4 className="font-medium text-text-primary text-sm">{risk.title}</h4>
                  <p className="text-xs text-text-muted mt-1 line-clamp-2">{risk.description}</p>
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-text-muted transition-transform ${
                    expandedRisk === risk.id ? 'rotate-90' : ''
                  }`}
                />
              </div>
            </button>

            {expandedRisk === risk.id && risk.mitigation && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-4"
              >
                <div className="bg-accent-green/10 border border-accent-green/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-accent-green" />
                    <span className="text-xs font-medium text-accent-green">Mitigazione Suggerita</span>
                  </div>
                  <p className="text-xs text-text-secondary">{risk.mitigation}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-muted">Rischi totali identificati</span>
          <div className="flex items-center gap-3">
            {['critical', 'high', 'medium'].map((severity) => {
              const count = risks.filter((r) => r.severity === severity).length;
              if (count === 0) return null;
              return (
                <div key={severity} className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getSeverityColor(severity as Risk['severity']) }}
                  />
                  <span className="text-text-secondary">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
