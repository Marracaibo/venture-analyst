'use client';

import { useStore } from '@/lib/store';
import { getAgentColor, getAgentName } from '@/lib/utils';
import { Terminal, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function TerminalBar() {
  const { agentLogs, isAnalyzing, currentAgent, analysisProgress } = useStore();
  
  // Get the last 5 logs
  const recentLogs = agentLogs.slice(-5);
  const latestLog = recentLogs[recentLogs.length - 1];

  return (
    <div className="h-10 bg-background-secondary border-b border-border flex items-center px-4 gap-4">
      {/* Logo/Title */}
      <div className="flex items-center gap-2 text-text-secondary">
        <Terminal className="w-4 h-4" />
        <span className="text-xs font-mono font-medium">VVA</span>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-border" />

      {/* Agent Status */}
      <div className="flex-1 flex items-center gap-3 overflow-hidden">
        {isAnalyzing && currentAgent && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: getAgentColor(currentAgent) }}
            />
            <span 
              className="text-xs font-mono font-medium"
              style={{ color: getAgentColor(currentAgent) }}
            >
              [{getAgentName(currentAgent)}]
            </span>
          </motion.div>
        )}

        {/* Terminal Output */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {latestLog && (
              <motion.div
                key={latestLog.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 font-mono text-xs"
              >
                <span className="text-text-muted">$</span>
                <span 
                  className="text-text-secondary truncate"
                  style={{ color: latestLog.status === 'running' ? getAgentColor(latestLog.agent) : undefined }}
                >
                  {latestLog.message}
                </span>
                {latestLog.status === 'running' && (
                  <span className="typing-cursor text-text-muted" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Bar */}
      {isAnalyzing && (
        <div className="flex items-center gap-3">
          <div className="w-32 h-1.5 bg-background-tertiary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-agent-orchestrator via-agent-market to-agent-growth rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${analysisProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-xs font-mono text-text-muted w-8">
            {analysisProgress}%
          </span>
        </div>
      )}

      {/* Status Indicator */}
      <div className="flex items-center gap-2">
        <Cpu className={`w-4 h-4 ${isAnalyzing ? 'text-accent-green animate-pulse' : 'text-text-muted'}`} />
        <span className="text-xs font-mono text-text-muted">
          {isAnalyzing ? 'ANALYZING' : 'READY'}
        </span>
      </div>
    </div>
  );
}
