'use client';

import { getVerdictInfo } from '@/lib/utils';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface VerdictBannerProps {
  verdict: 'green' | 'yellow' | 'red';
  reason: string;
  title: string;
}

export function VerdictBanner({ verdict, reason, title }: VerdictBannerProps) {
  const info = getVerdictInfo(verdict);
  
  const Icon = verdict === 'green' ? CheckCircle : verdict === 'yellow' ? AlertTriangle : XCircle;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl p-6 border"
      style={{
        backgroundColor: `${info.color}10`,
        borderColor: `${info.color}30`,
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${info.color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color: info.color }} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{info.emoji}</span>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Verdetto: {info.label}
              </h2>
              <p className="text-sm text-text-secondary">{title}</p>
            </div>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {reason}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
