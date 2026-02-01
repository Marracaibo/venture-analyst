import { ArsenalItemId } from './arsenal-types';

// Premium document generation - Multi-section, high-quality output
// Inspired by VideoAI-Studio professional documentation style

export interface PremiumSection {
  id: string;
  title: string;
  prompt: string;
  maxTokens: number;
}

export interface PremiumDocumentConfig {
  documentTitle: string;
  sections: PremiumSection[];
  totalEstimatedTime: string;
}

// Helper to build startup context
export function buildStartupContext(idea: any, analysis: any): string {
  return `
STARTUP: ${analysis?.ideaTitle || 'N/A'}
PROBLEMA: ${idea?.problem || 'N/A'}
SOLUZIONE: ${idea?.solution || 'N/A'}
TARGET: ${idea?.target || 'N/A'}
MERCATO: TAM ${analysis?.marketSize?.tam || 'N/A'}, SAM ${analysis?.marketSize?.sam || 'N/A'}
COMPETITOR: ${analysis?.competitors?.map((c: any) => c.name).join(', ') || 'N/A'}
VERDICT: ${analysis?.verdict || 'N/A'}
SCORE: ${analysis?.score || 'N/A'}/100
`;
}

// Lazy load premium configs to avoid circular dependencies
let _premiumConfigs: Partial<Record<ArsenalItemId, PremiumDocumentConfig>> | null = null;

async function loadPremiumConfigs(): Promise<Partial<Record<ArsenalItemId, PremiumDocumentConfig>>> {
  if (_premiumConfigs) return _premiumConfigs;
  
  const [pitchDeck, execSummary, financialModel, roadmap, legalPack, competitorRadar, investmentProposal] = await Promise.all([
    import('./premium/pitch-deck-premium'),
    import('./premium/executive-summary-premium'),
    import('./premium/financial-model-premium'),
    import('./premium/roadmap-premium'),
    import('./premium/legal-pack-premium'),
    import('./premium/competitor-radar-premium'),
    import('./premium/investment-proposal-premium'),
  ]);
  
  _premiumConfigs = {
    'pitch-deck': pitchDeck.PITCH_DECK_PREMIUM,
    'executive-summary': execSummary.EXECUTIVE_SUMMARY_PREMIUM,
    'financial-model': financialModel.FINANCIAL_MODEL_PREMIUM,
    'roadmap-generator': roadmap.ROADMAP_PREMIUM,
    'legal-starter-pack': legalPack.LEGAL_PACK_PREMIUM,
    'competitor-radar': competitorRadar.COMPETITOR_RADAR_PREMIUM,
    'investment-proposal': investmentProposal.INVESTMENT_PROPOSAL_PREMIUM,
  };
  
  return _premiumConfigs;
}

// Get premium config for an item
export async function getPremiumConfig(itemId: ArsenalItemId): Promise<PremiumDocumentConfig | null> {
  const configs = await loadPremiumConfigs();
  return configs[itemId] || null;
}

// Check if premium generation is available for an item
export function hasPremiumGeneration(itemId: ArsenalItemId): boolean {
  const premiumItems: ArsenalItemId[] = [
    'pitch-deck',
    'executive-summary', 
    'financial-model',
    'roadmap-generator',
    'legal-starter-pack',
    'competitor-radar',
    'investment-proposal'
  ];
  return premiumItems.includes(itemId);
}

// Get list of items with premium generation
export function getPremiumItems(): ArsenalItemId[] {
  return [
    'pitch-deck',
    'executive-summary',
    'financial-model',
    'roadmap-generator',
    'legal-starter-pack',
    'competitor-radar',
    'investment-proposal'
  ];
}
