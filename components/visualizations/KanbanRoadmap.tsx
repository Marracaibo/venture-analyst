'use client';

import { useState } from 'react';
import { RoadmapTask, GrowthExperiment, EarlyAdopterPersona } from '@/lib/types';
import { getCategoryColor } from '@/lib/utils';
import { Calendar, Rocket, Users, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface KanbanRoadmapProps {
  tasks: RoadmapTask[];
  experiments: GrowthExperiment[];
  personas: EarlyAdopterPersona[];
}

export function KanbanRoadmap({ tasks, experiments, personas }: KanbanRoadmapProps) {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'experiments' | 'personas'>('roadmap');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const weeks = [1, 2, 3, 4] as const;

  const copyContent = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-background-secondary rounded-xl border border-border p-5">
      {/* Header with Tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent-orange/20 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-accent-orange" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Execution Hub</h3>
            <p className="text-xs text-text-muted">Roadmap, Esperimenti & Personas</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-background-tertiary rounded-lg p-1">
          {[
            { key: 'roadmap' as const, label: 'Roadmap', icon: Calendar },
            { key: 'experiments' as const, label: 'Esperimenti', icon: Rocket },
            { key: 'personas' as const, label: 'Personas', icon: Users },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-background-elevated text-text-primary'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'roadmap' && (
          <motion.div
            key="roadmap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-4 gap-3"
          >
            {weeks.map((week) => (
              <div key={week} className="space-y-2">
                <div className="text-xs font-medium text-text-secondary px-2 py-1 bg-background-tertiary rounded-lg text-center">
                  Settimana {week}
                </div>
                <div className="space-y-2 min-h-[200px]">
                  {tasks
                    .filter((t) => t.week === week)
                    .map((task) => (
                      <motion.div
                        key={task.id}
                        layout
                        className="bg-background-tertiary rounded-lg border border-border hover:border-border-strong transition-colors"
                      >
                        <button
                          onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                          className="w-full p-3 text-left"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div
                                className="w-2 h-2 rounded-full mb-2"
                                style={{ backgroundColor: getCategoryColor(task.category) }}
                              />
                              <h4 className="text-sm font-medium text-text-primary leading-tight">
                                {task.title}
                              </h4>
                              <p className="text-xs text-text-muted mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            </div>
                            {task.content && (
                              <div className="text-text-muted">
                                {expandedTask === task.id ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </div>
                            )}
                          </div>
                        </button>

                        <AnimatePresence>
                          {expandedTask === task.id && task.content && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-3 pb-3 pt-0">
                                <div className="bg-background rounded-lg p-3 border border-border/50">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] text-text-muted uppercase tracking-wide">
                                      Template Pronto
                                    </span>
                                    <button
                                      onClick={() => copyContent(task.id, task.content!)}
                                      className="flex items-center gap-1 text-xs text-accent-blue hover:text-accent-blue/80"
                                    >
                                      {copiedId === task.id ? (
                                        <>
                                          <Check className="w-3 h-3" />
                                          Copiato!
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3 h-3" />
                                          Copia
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  <pre className="text-xs text-text-secondary whitespace-pre-wrap font-mono leading-relaxed max-h-40 overflow-y-auto">
                                    {task.content}
                                  </pre>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'experiments' && (
          <motion.div
            key="experiments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {experiments.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-background-tertiary rounded-lg border border-border p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-green/20 flex items-center justify-center text-lg">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary">{exp.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-text-muted">{exp.timeframe}</span>
                        <span className="text-xs text-accent-green">{exp.budget}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      exp.priority === 'high'
                        ? 'bg-accent-red/20 text-accent-red'
                        : exp.priority === 'medium'
                        ? 'bg-accent-yellow/20 text-accent-yellow'
                        : 'bg-accent-blue/20 text-accent-blue'
                    }`}
                  >
                    {exp.priority === 'high' ? 'Alta' : exp.priority === 'medium' ? 'Media' : 'Bassa'}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mb-3">{exp.description}</p>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span className="font-medium">Outcome atteso:</span>
                  <span>{exp.expectedOutcome}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'personas' && (
          <motion.div
            key="personas"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-2 gap-4"
          >
            {personas.map((persona, index) => (
              <motion.div
                key={persona.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-background-tertiary rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center text-xl">
                    {persona.name.includes('Marco') ? '👨‍💼' : '👩‍💼'}
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary">{persona.name}</h4>
                    <p className="text-xs text-text-muted">{persona.role}</p>
                    {persona.company && (
                      <p className="text-xs text-accent-blue">{persona.company}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="text-xs font-medium text-text-secondary mb-2">Pain Points</h5>
                    <ul className="space-y-1">
                      {persona.painPoints.map((pain, i) => (
                        <li key={i} className="text-xs text-text-muted flex items-start gap-2">
                          <span className="text-accent-red">•</span>
                          {pain}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-xs font-medium text-text-secondary mb-2">Dove Trovarli</h5>
                    <div className="flex flex-wrap gap-1">
                      {persona.whereToFind.map((where, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-background rounded text-xs text-text-muted"
                        >
                          {where}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend for Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
          {[
            { label: 'Validazione', color: getCategoryColor('validation') },
            { label: 'Marketing', color: getCategoryColor('marketing') },
            { label: 'Prodotto', color: getCategoryColor('product') },
            { label: 'Sales', color: getCategoryColor('sales') },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-text-muted">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
