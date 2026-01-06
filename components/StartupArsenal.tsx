'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Swords, Loader2, X, Download, Copy, Check, ExternalLink,
  Globe, Mail, Linkedin, Target, DollarSign, BarChart3,
  MessageSquare, FlaskConical, Clipboard, Radar, PieChart,
  Mic, FileText, ChevronDown, ChevronUp, Sparkles, Info
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { ARSENAL_CATEGORIES, ARSENAL_ITEMS, ArsenalItemId, ArsenalItem } from '@/lib/arsenal-types';
import { generateArsenalPDF, generatePreviewHTML } from '@/lib/arsenal-pdf-export';

interface GeneratedContent {
  itemId: ArsenalItemId;
  content: string;
  sections?: Record<string, unknown>;
}

interface PartInfo {
  currentPart: number;
  totalParts: number;
  partTitle: string;
}

export function StartupArsenal() {
  const { currentAnalysis, currentIdea } = useStore();
  const [generating, setGenerating] = useState<ArsenalItemId | null>(null);
  const [generatedItems, setGeneratedItems] = useState<Map<ArsenalItemId, GeneratedContent>>(new Map());
  const [activePreview, setActivePreview] = useState<ArsenalItemId | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('attack');
  const [copied, setCopied] = useState(false);
  const [showInfo, setShowInfo] = useState<ArsenalItemId | null>(null);
  const [partProgress, setPartProgress] = useState<PartInfo | null>(null);

  if (!currentAnalysis || !currentIdea) return null;

  // Use Vercel API directly - optimized for fast responses
  const arsenalApiUrl = '/api/arsenal';

  // Simple single-call generation with streaming
  const handleGenerate = async (itemId: ArsenalItemId) => {
    if (generating) return;
    
    setGenerating(itemId);
    
    try {
      console.log('[ARSENAL] Starting generation for:', itemId);
      
      const response = await fetch(arsenalApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          idea: currentIdea,
          analysis: currentAnalysis
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[ARSENAL] Error response:', errorText);
        throw new Error('Generation failed');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let content = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.type === 'delta' && data.text) {
              content += data.text;
              // Update preview in real-time
              setGeneratedItems(prev => new Map(prev).set(itemId, {
                itemId,
                content,
              }));
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
      
      // Final update
      setGeneratedItems(prev => new Map(prev).set(itemId, {
        itemId,
        content,
      }));
      
      setActivePreview(itemId);
      console.log('[ARSENAL] Generation complete for:', itemId);
    } catch (error) {
      console.error('[ARSENAL] Error generating:', error);
    } finally {
      setGenerating(null);
    }
  };

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMD = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = (itemId: ArsenalItemId, content: string) => {
    if (!currentAnalysis) return;
    generateArsenalPDF({
      itemId,
      content,
      ideaTitle: currentAnalysis.ideaTitle
    });
  };

  const getItemIcon = (itemId: ArsenalItemId) => {
    const icons: Record<ArsenalItemId, React.ReactNode> = {
      'landing-page': <Globe className="w-5 h-5" />,
      'email-sequences': <Mail className="w-5 h-5" />,
      'linkedin-pack': <Linkedin className="w-5 h-5" />,
      'cold-scripts': <Mic className="w-5 h-5" />,
      'investor-match': <Target className="w-5 h-5" />,
      'pitch-deck': <FileText className="w-5 h-5" />,
      'financial-model': <DollarSign className="w-5 h-5" />,
      'pitch-qa-trainer': <MessageSquare className="w-5 h-5" />,
      'interview-scripts': <Clipboard className="w-5 h-5" />,
      'experiment-tracker': <FlaskConical className="w-5 h-5" />,
      'survey-generator': <BarChart3 className="w-5 h-5" />,
      'competitor-radar': <Radar className="w-5 h-5" />,
      'roadmap-generator': <Target className="w-5 h-5" />,
      'executive-summary': <FileText className="w-5 h-5" />,
      'legal-starter-pack': <FileText className="w-5 h-5" />,
      'cap-table-sim': <PieChart className="w-5 h-5" />
    };
    return icons[itemId] || <FileText className="w-5 h-5" />;
  };

  const getCategoryGradient = (category: string) => {
    const gradients: Record<string, string> = {
      attack: 'from-red-500 to-orange-500',
      fundraising: 'from-green-500 to-emerald-500',
      validation: 'from-purple-500 to-pink-500',
      growth: 'from-blue-500 to-cyan-500',
      legal: 'from-amber-500 to-yellow-500'
    };
    return gradients[category] || 'from-gray-500 to-gray-600';
  };

  const renderItemCard = (item: ArsenalItem) => {
    const isGenerated = generatedItems.has(item.id);
    const isGenerating = generating === item.id;
    const isInfoOpen = showInfo === item.id;

    return (
      <div key={item.id} className="relative">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
            isGenerated 
              ? 'border-accent-green bg-accent-green/5' 
              : 'border-border-subtle bg-background hover:border-accent-purple/50'
          }`}
          onClick={() => isGenerated ? setActivePreview(item.id) : handleGenerate(item.id)}
        >
          {/* Info Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowInfo(isInfoOpen ? null : item.id);
            }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background-elevated hover:bg-accent-purple/20 flex items-center justify-center transition-colors z-10"
          >
            <Info className="w-3.5 h-3.5 text-text-muted hover:text-accent-purple" />
          </button>

          {/* Generated Badge */}
          {isGenerated && (
            <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-accent-green flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isGenerated ? 'bg-accent-green/20 text-accent-green' : 'bg-surface-elevated text-text-muted'
            }`}>
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin text-accent-purple" />
              ) : (
                <span className="text-xl">{item.icon}</span>
              )}
            </div>
            
            <div className="flex-1 min-w-0 pr-6">
              <h4 className="font-semibold text-text-primary text-sm">{item.name}</h4>
              <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{item.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-accent-purple">{item.estimatedTime}</span>
                {isGenerated && (
                  <span className="text-xs text-accent-green">✓ Pronto</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        </div>
    );
  };

  return (
    <div className="bg-surface-elevated rounded-xl border border-border-subtle overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border-subtle bg-gradient-to-r from-background to-surface-elevated">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 via-purple-500 to-cyan-500 flex items-center justify-center">
            <Swords className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              Startup Arsenal
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </h3>
            <p className="text-sm text-text-muted">Non documenti. Armi.</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 space-y-3">
        {Object.entries(ARSENAL_CATEGORIES).map(([key, category]) => (
          <div key={key} className="rounded-xl border border-border-subtle overflow-hidden">
            {/* Category Header */}
            <button
              onClick={() => setExpandedCategory(expandedCategory === key ? null : key)}
              className={`w-full p-3 flex items-center justify-between bg-gradient-to-r ${getCategoryGradient(key)} bg-opacity-10 hover:bg-opacity-20 transition-all`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{category.name}</span>
                <span className="text-xs text-text-muted bg-background/50 px-2 py-0.5 rounded-full">
                  {category.items.length} tools
                </span>
                {category.items.filter(i => generatedItems.has(i.id)).length > 0 && (
                  <span className="text-xs text-accent-green bg-accent-green/10 px-2 py-0.5 rounded-full">
                    {category.items.filter(i => generatedItems.has(i.id)).length} pronti
                  </span>
                )}
              </div>
              {expandedCategory === key ? (
                <ChevronUp className="w-5 h-5 text-text-muted" />
              ) : (
                <ChevronDown className="w-5 h-5 text-text-muted" />
              )}
            </button>

            {/* Category Items */}
            <AnimatePresence>
              {expandedCategory === key && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-background/50">
                    {category.items.map(item => renderItemCard(item))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-t border-border-subtle bg-background/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">
            {generatedItems.size} / {ARSENAL_ITEMS.length} generati
          </span>
          {generatedItems.size > 0 && (
            <button 
              onClick={() => setActivePreview(Array.from(generatedItems.keys())[0])}
              className="text-accent-purple hover:underline flex items-center gap-1"
            >
              Vedi generati
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {activePreview && generatedItems.has(activePreview) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setActivePreview(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface-elevated rounded-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-border-subtle">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {ARSENAL_ITEMS.find(i => i.id === activePreview)?.icon}
                  </span>
                  <div>
                    <h4 className="font-bold text-text-primary">
                      {ARSENAL_ITEMS.find(i => i.id === activePreview)?.name}
                    </h4>
                    <p className="text-xs text-text-muted">
                      Generato per: {currentAnalysis.ideaTitle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCopy(generatedItems.get(activePreview)?.content || '')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-background hover:bg-border-subtle rounded-lg text-sm transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-accent-green" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copiato!' : 'Copia'}
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownloadMD(
                      generatedItems.get(activePreview)?.content || '',
                      `${activePreview}-${currentAnalysis.ideaTitle.toLowerCase().replace(/\s+/g, '-')}.md`
                    )}
                    className="flex items-center gap-2 px-3 py-1.5 bg-background hover:bg-border-subtle rounded-lg text-sm transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    .MD
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownloadPDF(activePreview, generatedItems.get(activePreview)?.content || '')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-accent-purple to-accent-cyan text-white rounded-lg text-sm transition-colors font-medium"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </motion.button>
                  <button 
                    onClick={() => setActivePreview(null)}
                    className="p-1.5 hover:bg-background rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-text-muted" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-background-secondary">
                <div 
                  className="max-w-none text-text-secondary leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: generatePreviewHTML(generatedItems.get(activePreview)?.content || '') 
                  }}
                />
              </div>

              {/* Modal Footer - Navigation */}
              <div className="p-4 border-t border-border-subtle bg-background/50">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {Array.from(generatedItems.keys()).map(itemId => (
                      <button
                        key={itemId}
                        onClick={() => setActivePreview(itemId)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          activePreview === itemId 
                            ? 'bg-accent-purple text-white' 
                            : 'bg-background hover:bg-border-subtle text-text-muted'
                        }`}
                      >
                        {ARSENAL_ITEMS.find(i => i.id === itemId)?.icon}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-text-muted">
                    Clicca sulle icone per navigare tra i generati
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Modal - Centered */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowInfo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a1f] border-2 border-accent-purple/50 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {(() => {
                const item = ARSENAL_ITEMS.find(i => i.id === showInfo);
                if (!item) return null;
                return (
                  <>
                    {/* Header */}
                    <div className="p-5 border-b border-accent-purple/30 bg-gradient-to-r from-accent-purple/20 to-accent-cyan/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center">
                            <span className="text-2xl">{item.icon}</span>
                          </div>
                          <div>
                            <h5 className="font-bold text-white text-lg">{item.name}</h5>
                            <p className="text-sm text-gray-300">{item.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowInfo(null)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5 text-gray-400 hover:text-white" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5 space-y-5 bg-[#1a1a1f]">
                      <div>
                        <p className="text-sm text-accent-purple font-bold mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-accent-purple"></span>
                          Come funziona
                        </p>
                        <p className="text-sm text-gray-200 leading-relaxed">{item.howItWorks}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-accent-cyan font-bold mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-accent-cyan"></span>
                          Cosa ottieni
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.whatYouGet.map((benefit, idx) => (
                            <span 
                              key={idx}
                              className="text-xs px-3 py-1.5 bg-white/10 rounded-lg text-gray-200 border border-white/20"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-5 border-t border-accent-purple/30 bg-[#15151a]">
                      <button
                        onClick={() => {
                          setShowInfo(null);
                          handleGenerate(item.id);
                        }}
                        disabled={generating !== null}
                        className="w-full py-3 bg-gradient-to-r from-accent-purple to-accent-cyan text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-base"
                      >
                        {generating === item.id 
                          ? (partProgress 
                              ? `Parte ${partProgress.currentPart}/${partProgress.totalParts || '?'}...` 
                              : 'Generando...') 
                          : `Genera ${item.name}`}
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
