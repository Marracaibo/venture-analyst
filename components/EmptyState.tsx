'use client';

import { Rocket, Target, TrendingUp, Shield, Lightbulb, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function EmptyState() {
  const features = [
    {
      icon: Target,
      title: 'Analisi Competitor',
      description: 'Mappa competitiva con posizionamento strategico',
      color: '#3b82f6',
    },
    {
      icon: TrendingUp,
      title: 'Market Sizing',
      description: 'Stima TAM/SAM/SOM con metodologia Fermi',
      color: '#22c55e',
    },
    {
      icon: Rocket,
      title: 'Go-To-Market',
      description: 'Strategia di crescita e primi esperimenti',
      color: '#f97316',
    },
    {
      icon: Shield,
      title: 'Stress Test',
      description: 'Analisi rischi e punti deboli',
      color: '#ef4444',
    },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl"
      >
        {/* Logo */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-agent-orchestrator via-agent-market to-agent-growth flex items-center justify-center">
          <span className="text-4xl">🎯</span>
        </div>

        <h1 className="text-3xl font-bold text-text-primary mb-3">
          Virtual Venture Analyst
        </h1>
        <p className="text-text-secondary mb-8">
          Il tuo team di agenti AI per analizzare idee di startup come un venture studio professionale.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="p-4 rounded-xl bg-background-secondary border border-border hover:border-border-strong transition-colors text-left"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: `${feature.color}20` }}
              >
                <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
              </div>
              <h3 className="font-medium text-text-primary text-sm mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-text-muted">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-center gap-2 text-text-muted text-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          <span>Descrivi la tua idea nella chat a sinistra per iniziare</span>
        </div>

        {/* Idea Generator Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/generator"
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-xl hover:border-yellow-500/50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-text-primary">Non hai un'idea?</p>
              <p className="text-xs text-text-muted">Genera idee con il Triangolo d'Oro</p>
            </div>
            <ArrowRight className="w-5 h-5 text-yellow-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
