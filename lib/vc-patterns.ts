// Database di pattern VC per idee di qualità unicorn

export const UNICORN_EXITS = {
  b2b_saas: [
    { name: 'Deel', sector: 'HR/Payroll', exit: '$12B valuation', year: 2024, moat: 'Compliance network effects' },
    { name: 'Rippling', sector: 'HR Platform', exit: '$13.5B valuation', year: 2024, moat: 'Unified data layer' },
    { name: 'Notion', sector: 'Productivity', exit: '$10B valuation', year: 2024, moat: 'Template marketplace' },
  ],
  fintech: [
    { name: 'Stripe', sector: 'Payments', exit: '$95B valuation', year: 2021, moat: 'Developer ecosystem' },
    { name: 'Plaid', sector: 'Banking API', exit: '$13.4B valuation', year: 2021, moat: 'Bank integrations' },
    { name: 'Wise', sector: 'FX/Transfers', exit: '$11B IPO', year: 2021, moat: 'Regulatory licenses' },
  ],
  vertical_saas: [
    { name: 'Procore', sector: 'Construction', exit: '$12B IPO', year: 2021, moat: 'Industry standard' },
    { name: 'Toast', sector: 'Restaurants', exit: '$30B IPO', year: 2021, moat: 'Hardware + software lock-in' },
    { name: 'ServiceTitan', sector: 'Home Services', exit: '$9.5B valuation', year: 2024, moat: 'Workflow integration' },
  ],
  ai_tools: [
    { name: 'Jasper', sector: 'AI Writing', exit: '$1.5B valuation', year: 2022, moat: 'Templates + brand voice' },
    { name: 'Midjourney', sector: 'AI Images', exit: '$10B+ revenue run rate', year: 2024, moat: 'Community + style' },
    { name: 'Cursor', sector: 'AI Coding', exit: '$400M+ valuation', year: 2024, moat: 'IDE integration' },
  ],
};

export const FAMOUS_FAILURES = {
  timing: [
    { name: 'Quibi', raised: '$1.75B', died: 2020, cause: 'Mobile-first video during pandemic (everyone at home on TV)' },
    { name: 'Webvan', raised: '$800M', died: 2001, cause: 'Grocery delivery before smartphone ubiquity' },
    { name: 'Google Glass', raised: 'N/A', died: 2015, cause: 'Wearables before social acceptance' },
  ],
  unit_economics: [
    { name: 'WeWork', raised: '$22B', died: 2019, cause: 'Real estate arbitrage with negative margins' },
    { name: 'MoviePass', raised: '$68M', died: 2019, cause: 'Selling $10 for $1' },
    { name: 'Homejoy', raised: '$64M', died: 2015, cause: 'CAC > LTV, no retention' },
  ],
  tech_impossible: [
    { name: 'Theranos', raised: '$700M', died: 2018, cause: 'Physics said no' },
    { name: 'Magic Leap', raised: '$3.5B', died: 2022, cause: 'AR hardware 10 years too early' },
    { name: 'Juicero', raised: '$120M', died: 2017, cause: 'Over-engineered solution to non-problem' },
  ],
  regulation: [
    { name: 'Aereo', raised: '$97M', died: 2014, cause: 'Supreme Court killed the business model' },
    { name: 'Zenefits', raised: '$584M', died: 2017, cause: 'Insurance license violations' },
    { name: 'Bird (struggles)', raised: '$776M', died: 2023, cause: 'City regulations + unit economics' },
  ],
};

export const EU_REGULATIONS_2025_2027 = [
  {
    name: 'AI Act',
    deadline: '2025-08',
    penalty: '€35M or 7% global revenue',
    opportunity: 'AI compliance tools, risk assessment, documentation automation',
  },
  {
    name: 'CSRD (Sustainability Reporting)',
    deadline: '2025-01',
    penalty: '€10M+ fines',
    opportunity: 'ESG data collection, carbon accounting, supply chain tracking',
  },
  {
    name: 'DORA (Digital Operational Resilience)',
    deadline: '2025-01',
    penalty: '€5M or 10% revenue',
    opportunity: 'ICT risk management for financial institutions',
  },
  {
    name: 'NIS2 (Cybersecurity)',
    deadline: '2024-10',
    penalty: '€10M or 2% revenue',
    opportunity: 'Security compliance, incident reporting, supply chain security',
  },
  {
    name: 'EPBD (Energy Performance Buildings)',
    deadline: '2027',
    penalty: 'Property value reduction',
    opportunity: 'Building energy audits, renovation planning, smart building',
  },
  {
    name: 'Packaging and Packaging Waste Regulation',
    deadline: '2025-2030',
    penalty: 'Market ban',
    opportunity: 'Packaging compliance, reusable systems, waste tracking',
  },
];

export const SCORING_CRITERIA = {
  market: {
    tam_billion_plus: { points: 20, description: 'TAM > €1B' },
    growing_20_percent: { points: 10, description: 'Market growing >20%/year' },
    fragmented: { points: 10, description: 'No dominant player >30% share' },
  },
  timing: {
    regulatory_trigger: { points: 15, description: 'New law creates urgency' },
    tech_enabler: { points: 10, description: 'New tech makes it possible' },
    behavior_shift: { points: 10, description: 'COVID/AI changed behavior' },
  },
  economics: {
    cac_under_50: { points: 10, description: 'CAC < €50' },
    ltv_over_500: { points: 10, description: 'LTV > €500' },
    payback_under_6mo: { points: 10, description: 'Payback < 6 months' },
    gross_margin_70: { points: 10, description: 'Gross margin > 70%' },
  },
  moat: {
    network_effects: { points: 15, description: 'Value increases with users' },
    switching_costs: { points: 10, description: 'Painful to leave' },
    data_moat: { points: 10, description: 'Proprietary data advantage' },
    regulatory_moat: { points: 15, description: 'License/certification barrier' },
  },
  execution: {
    mvp_4_weeks: { points: 10, description: 'MVP in 4 weeks' },
    existing_hardware: { points: 5, description: 'No custom hardware needed' },
    api_first: { points: 5, description: 'Built on existing APIs' },
  },
};

// Funzione per calcolare score quantitativo
export function calculateScore(criteria: {
  market: string[];
  timing: string[];
  economics: string[];
  moat: string[];
  execution: string[];
}): { score: number; breakdown: Record<string, number>; verdict: string } {
  let total = 0;
  const breakdown: Record<string, number> = {};

  const allCriteria = { ...SCORING_CRITERIA };

  for (const [category, items] of Object.entries(criteria)) {
    let categoryScore = 0;
    const categoryDef = allCriteria[category as keyof typeof allCriteria] as Record<string, { points: number; description: string }>;
    
    if (categoryDef) {
      for (const item of items) {
        const criterion = categoryDef[item];
        if (criterion && typeof criterion.points === 'number') {
          categoryScore += criterion.points;
        }
      }
    }
    breakdown[category] = categoryScore;
    total += categoryScore;
  }

  let verdict: string;
  if (total >= 90) verdict = 'unicorn';
  else if (total >= 70) verdict = 'strong';
  else if (total >= 50) verdict = 'risky';
  else verdict = 'pass';

  return { score: total, breakdown, verdict };
}

// Stringa compatta per i prompt
export const PATTERN_SUMMARY = `
UNICORN PATTERNS:
- B2B SaaS: Deel ($12B), Rippling ($13.5B) → compliance + network effects
- Vertical SaaS: Toast ($30B), Procore ($12B) → industry standard + lock-in
- Fintech: Stripe ($95B), Plaid ($13.4B) → developer ecosystem + integrations

DEATH PATTERNS:
- Timing: Quibi, Webvan → too early or wrong moment
- Unit Economics: WeWork, MoviePass → CAC > LTV
- Regulation: Aereo, Zenefits → legal killed the model

EU REGULATIONS 2025-2027:
- AI Act (Aug 2025): €35M fines → AI compliance tools
- CSRD (Jan 2025): €10M fines → ESG/carbon tracking
- DORA (Jan 2025): €5M fines → fintech resilience
- NIS2 (Oct 2024): €10M fines → cybersecurity
- EPBD (2027): property devaluation → building energy

SCORING (0-100):
- Market (40pt): TAM>€1B, growing >20%, fragmented
- Timing (35pt): regulatory trigger, tech enabler, behavior shift
- Economics (40pt): CAC<€50, LTV>€500, payback<6mo, margin>70%
- Moat (50pt): network effects, switching costs, data, regulatory
- Execution (20pt): MVP 4wk, existing hardware, API-first
`.trim();
