// Premium Competitor Radar Configuration - Deep Competitive Intelligence

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

export const COMPETITOR_RADAR_PREMIUM: PremiumDocumentConfig = {
  documentTitle: 'Competitor Intelligence Report - Strategic Analysis',
  totalEstimatedTime: '2-3 minuti',
  sections: [
    {
      id: 'market-landscape',
      title: 'Market Landscape & Key Players',
      maxTokens: 4000,
      prompt: `Genera un'analisi approfondita del panorama competitivo per questa startup:

# 1. PANORAMA DI MERCATO

## Executive Summary
Breve overview del landscape competitivo (3-4 frasi)

## Mappa del Mercato
\`\`\`
                    PREMIUM PRICING
                         ↑
                         │
    ┌─────────────────────┼─────────────────────┐
    │   ENTERPRISE        │   INNOVATORS        │
    │   [Competitor A]    │   [Competitor B]    │
    │                     │                     │
LEGACY ────────────────────┼──────────────────── MODERN
    │                     │                     │
    │   BUDGET            │   DISRUPTORS        │
    │   [Competitor C]    │   [TUA STARTUP]     │
    │                     │                     │
    └─────────────────────┼─────────────────────┘
                         │
                         ↓
                    BUDGET PRICING
\`\`\`

## Competitor Tier Classification

### Tier 1 - Direct Competitors (Stessa soluzione, stesso target)
| Competitor | Focus | Stage | Funding | Threat Level |
|------------|-------|-------|---------|--------------|
| [Nome] | [Focus] | [Stage] | [€M] | 🔴/🟡/🟢 |

### Tier 2 - Indirect Competitors (Soluzione diversa, stesso problema)
| Competitor | Approccio | Differenza chiave |
|------------|-----------|-------------------|
| [Nome] | [Approccio] | [Differenza] |

### Tier 3 - Potenziali Entranti
- **Big Tech Risk**: [Chi potrebbe entrare e perché]
- **Adjacent Players**: [Chi potrebbe espandere nel tuo mercato]
- **International**: [Player esteri che potrebbero arrivare]

## Trend di Mercato
1. **[Trend 1]**: Impatto sul competitive landscape
2. **[Trend 2]**: Impatto sul competitive landscape
3. **[Trend 3]**: Impatto sul competitive landscape`
    },
    {
      id: 'competitor-deep-dive',
      title: 'Deep Dive sui Top Competitor',
      maxTokens: 5000,
      prompt: `Analisi dettagliata dei 5 competitor principali:

# 2. COMPETITOR DEEP DIVE

Per ciascun competitor, fornisci un'analisi strutturata:

## COMPETITOR 1: [NOME]

### Company Profile
| Attribute | Details |
|-----------|---------|
| **Founded** | [Anno] |
| **HQ** | [Location] |
| **Employees** | [Range] |
| **Stage** | [Seed/Series A/B/C] |
| **Total Funding** | [€M] |
| **Key Investors** | [Nomi] |
| **Revenue Est.** | [€M ARR] |

### Product Analysis
- **Core Product**: [Descrizione]
- **Target Segment**: [Primary ICP]
- **Key Features**:
  - ✅ [Feature 1]
  - ✅ [Feature 2]
  - ❌ [Missing feature]
- **Tech Stack**: [Se noto]
- **Integrations**: [Key integrations]

### Pricing Model
| Plan | Price | Target |
|------|-------|--------|
| [Free] | €0 | [Target] |
| [Pro] | €X/mo | [Target] |
| [Enterprise] | Custom | [Target] |

### Go-to-Market
- **Distribution**: [Direct sales/PLG/Channel]
- **Marketing Channels**: [Principali canali]
- **Content Strategy**: [Blog/Podcast/Events]
- **Sales Motion**: [Self-serve/Inside/Field]

### Strengths & Weaknesses
| Strengths 💪 | Weaknesses 📉 |
|--------------|---------------|
| [Strength 1] | [Weakness 1] |
| [Strength 2] | [Weakness 2] |
| [Strength 3] | [Weakness 3] |

### Recent Moves (Last 12 months)
- **Product**: [Lanci recenti]
- **Funding**: [Round recenti]
- **Partnerships**: [Partnership chiave]
- **Hiring**: [Aree di focus hiring]

---

## COMPETITOR 2-5: [Ripeti la stessa struttura per altri 4 competitor]`
    },
    {
      id: 'feature-comparison',
      title: 'Feature Comparison Matrix',
      maxTokens: 3500,
      prompt: `Crea una matrice di confronto feature completa:

# 3. FEATURE COMPARISON MATRIX

## Core Features Comparison
| Feature | Tua Startup | Comp 1 | Comp 2 | Comp 3 | Comp 4 | Comp 5 |
|---------|-------------|--------|--------|--------|--------|--------|
| **[Feature Category 1]** | | | | | | |
| Feature 1.1 | ✅/❌/🔄 | ✅/❌/🔄 | ... | ... | ... | ... |
| Feature 1.2 | | | | | | |
| Feature 1.3 | | | | | | |
| **[Feature Category 2]** | | | | | | |
| Feature 2.1 | | | | | | |
| Feature 2.2 | | | | | | |
| **[Feature Category 3]** | | | | | | |
| ... | | | | | | |

**Legenda**: ✅ Full support | 🔄 Partial/Beta | ❌ Not available | 🔜 Announced

## Technical Capabilities
| Capability | Tua Startup | Industry Best | Gap Analysis |
|------------|-------------|---------------|--------------|
| Performance | [Score] | [Competitor] | [Gap] |
| Scalability | [Score] | [Competitor] | [Gap] |
| Security | [Score] | [Competitor] | [Gap] |
| API Coverage | [Score] | [Competitor] | [Gap] |
| Mobile | [Score] | [Competitor] | [Gap] |

## Integration Ecosystem
| Category | Your Integrations | Market Leader | Gap |
|----------|-------------------|---------------|-----|
| CRM | [List] | [Leader + count] | [#] |
| Productivity | [List] | [Leader + count] | [#] |
| Analytics | [List] | [Leader + count] | [#] |
| Communication | [List] | [Leader + count] | [#] |

## User Experience Score
| UX Dimension | Tua Startup | Comp 1 | Comp 2 | Comp 3 |
|--------------|-------------|--------|--------|--------|
| Onboarding | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ... | ... |
| Ease of Use | | | | |
| Documentation | | | | |
| Support | | | | |
| Mobile App | | | | |

## Feature Gap Analysis
### Features You Have That Others Don't
1. **[Unique Feature 1]**: [Why it matters]
2. **[Unique Feature 2]**: [Why it matters]

### Critical Gaps to Address
1. **[Missing Feature 1]**: Priority [High/Med/Low], Effort [S/M/L]
2. **[Missing Feature 2]**: Priority [High/Med/Low], Effort [S/M/L]`
    },
    {
      id: 'pricing-analysis',
      title: 'Pricing & Business Model Analysis',
      maxTokens: 3000,
      prompt: `Analisi dettagliata di pricing e business model:

# 4. PRICING & BUSINESS MODEL ANALYSIS

## Pricing Landscape Overview
\`\`\`
Price Point Distribution (Monthly, per user/seat)

€500+ │                    ▓▓ [Competitor E]
      │               
€200  │          ▓▓ [Competitor C]    
      │     ▓▓ [Competitor B]
€100  │ ▓▓ [Your Startup]  ▓▓ [Competitor D]
      │                    
€50   │ ▓▓ [Competitor A]
      │
Free  │ ▓▓ [Freemium options]
      └────────────────────────────────────
         Basic    Standard    Enterprise
\`\`\`

## Detailed Pricing Comparison
| Company | Free Tier | Entry Price | Mid-Tier | Enterprise | Model |
|---------|-----------|-------------|----------|------------|-------|
| **Tua Startup** | [Y/N + limits] | €[X]/mo | €[X]/mo | €[X]/mo | [per user/flat/usage] |
| Competitor 1 | | | | | |
| Competitor 2 | | | | | |
| Competitor 3 | | | | | |

## Business Model Analysis
| Company | Primary Model | Secondary Revenue | Avg Contract Value | Net Revenue Retention |
|---------|---------------|-------------------|--------------------|-----------------------|
| Competitor 1 | [SaaS/Usage/Hybrid] | [Add-ons/Services] | [€K] | [%] |
| Competitor 2 | | | | |

## Pricing Strategy Insights

### What's Working in the Market
- **Freemium**: [Chi lo usa e con che risultati]
- **Usage-based**: [Trend e efficacia]
- **Seat-based**: [Pro e contro nel settore]

### Pricing Power Analysis
| Factor | Impact on Pricing Power |
|--------|------------------------|
| Switching costs | [Low/Med/High] - [Explanation] |
| Network effects | [Low/Med/High] - [Explanation] |
| Integration depth | [Low/Med/High] - [Explanation] |
| Data lock-in | [Low/Med/High] - [Explanation] |

### Recommended Pricing Position
**Strategia consigliata**: [Premium/Value/Penetration]
**Rationale**: [Spiegazione basata su competitive position]

## Monetization Opportunities
1. **[Opportunity 1]**: [Description + potential impact]
2. **[Opportunity 2]**: [Description + potential impact]
3. **[Opportunity 3]**: [Description + potential impact]`
    },
    {
      id: 'competitive-strategy',
      title: 'Competitive Strategy & Positioning',
      maxTokens: 4000,
      prompt: `Sviluppa la strategia competitiva:

# 5. COMPETITIVE STRATEGY & POSITIONING

## Current Positioning Assessment
\`\`\`
POSITIONING MAP

         High Customization
              ↑
              │    [Comp A]
              │         ●
    [Comp B]  │              [YOUR POSITION]
         ●    │                   ★
              │
──────────────┼──────────────────────────────→
Low Touch     │                    High Touch
              │    [Comp C]
              │         ●
              │              [Comp D]
              │                   ●
              ↓
         Low Customization
\`\`\`

## Competitive Advantages
### Sustainable Advantages (Defensible)
| Advantage | Strength | Time to Copy | Moat Type |
|-----------|----------|--------------|-----------|
| [Advantage 1] | ⭐⭐⭐⭐⭐ | [Months/Years] | [Network/Data/Tech/Brand] |
| [Advantage 2] | ⭐⭐⭐⭐ | | |
| [Advantage 3] | ⭐⭐⭐ | | |

### Temporary Advantages (Leverage Now)
- **[Advantage 1]**: Window of opportunity [X months]
- **[Advantage 2]**: Window of opportunity [X months]

## Differentiation Strategy

### Primary Differentiator
**[Il tuo differentiatore principale]**
- Why it matters to customers: [Explanation]
- Why competitors can't easily copy: [Explanation]
- How to communicate it: [Messaging]

### Supporting Differentiators
1. **[Differentiator 2]**: [Brief explanation]
2. **[Differentiator 3]**: [Brief explanation]

## Competitive Response Playbook

### If Competitor Cuts Prices
- **Immediate Response**: [Action]
- **Messaging**: [What to tell customers]
- **Counter-strategy**: [Medium-term response]

### If Competitor Launches Similar Feature
- **Immediate Response**: [Action]
- **Messaging**: [What to tell customers]
- **Counter-strategy**: [Medium-term response]

### If Big Tech Enters Market
- **Immediate Response**: [Action]
- **Messaging**: [What to tell customers]
- **Counter-strategy**: [Medium-term response]

## Win/Loss Analysis Framework
| Scenario | Key Factors | Win Rate Target | Action to Improve |
|----------|-------------|-----------------|-------------------|
| vs Competitor A | [Factors] | [%] | [Actions] |
| vs Competitor B | [Factors] | [%] | [Actions] |
| vs Status Quo | [Factors] | [%] | [Actions] |

## Battle Cards Summary
### vs [Competitor 1]
- **Their pitch**: "[What they say]"
- **Your counter**: "[Your response]"
- **Killer question**: "[Question that exposes their weakness]"
- **Proof point**: "[Customer story or data]"

### vs [Competitor 2]
[Ripeti struttura]`
    },
    {
      id: 'monitoring-alerts',
      title: 'Monitoring System & Alert Keywords',
      maxTokens: 2500,
      prompt: `Sistema di monitoraggio competitivo:

# 6. COMPETITIVE MONITORING SYSTEM

## Google Alerts Setup
### Company Monitoring
| Alert Query | Frequency | Purpose |
|-------------|-----------|---------|
| "[Competitor 1 Name]" | Daily | News & PR |
| "[Competitor 1]" + "funding" OR "raises" | Daily | Funding alerts |
| "[Competitor 1]" + "partnership" OR "integrates" | Weekly | Partnership moves |
| "[Competitor 1]" + "launches" OR "announces" | Daily | Product updates |

### Market Monitoring
| Alert Query | Frequency | Purpose |
|-------------|-----------|---------|
| "[Your market keyword]" + "startup" + "funding" | Daily | New entrants |
| "[Technology keyword]" + "trend" | Weekly | Tech shifts |
| "[Industry]" + "regulation" OR "law" | Weekly | Regulatory changes |

## Social Media Monitoring

### Twitter/X Lists to Create
1. **Competitor Executives**: [List of handles]
2. **Industry Analysts**: [List of handles]
3. **Key Customers**: [List of handles]

### LinkedIn Tracking
- **Company pages**: [URLs to follow]
- **Employee moves**: Search "[Competitor] past company"
- **Job postings**: [URLs to monitor]

### Reddit & Community Monitoring
- **Subreddits**: [r/relevant1, r/relevant2]
- **Keywords**: [List of keywords to track]
- **Review sites**: [G2, Capterra, etc.]

## Competitive Intelligence Dashboard

### Weekly Metrics to Track
| Metric | Source | Current | Trend |
|--------|--------|---------|-------|
| Competitor website traffic | SimilarWeb | [Est.] | ↑/↓ |
| Social followers | Native | [Count] | ↑/↓ |
| Job postings | LinkedIn | [Count] | ↑/↓ |
| App store rating | App Store | [Rating] | ↑/↓ |
| G2/Capterra reviews | Review sites | [Count] | ↑/↓ |

### Monthly Deep Dives
- [ ] Review competitor blog posts and announcements
- [ ] Analyze new features released
- [ ] Check pricing page changes
- [ ] Review new case studies/testimonials
- [ ] Monitor executive interviews/podcasts

### Quarterly Assessment
- [ ] Full pricing comparison update
- [ ] Feature matrix refresh
- [ ] Market share estimation
- [ ] New entrant identification
- [ ] Strategy document update

## Automated Tools Recommendations
| Tool | Purpose | Cost | Priority |
|------|---------|------|----------|
| SimilarWeb | Traffic analysis | Free/Paid | High |
| Crunchbase | Funding tracking | Free/Paid | High |
| BuiltWith | Tech stack | Free/Paid | Medium |
| Google Alerts | News monitoring | Free | High |
| Mention | Social listening | Paid | Medium |

## Competitor Intel Slack Channel Format
\`\`\`
🚨 COMPETITIVE ALERT
━━━━━━━━━━━━━━━━━━━
**Competitor**: [Name]
**Type**: [Funding/Product/Hire/Partnership]
**Summary**: [1-2 sentences]
**Source**: [URL]
**Impact**: 🔴 High / 🟡 Medium / 🟢 Low
**Suggested Action**: [If any]
━━━━━━━━━━━━━━━━━━━
\`\`\``
    },
    {
      id: 'strategic-recommendations',
      title: 'Strategic Recommendations & Action Plan',
      maxTokens: 3000,
      prompt: `Raccomandazioni strategiche e piano d'azione:

# 7. STRATEGIC RECOMMENDATIONS

## Executive Summary
[3-4 frasi che riassumono la posizione competitiva e le raccomandazioni chiave]

## Priority Matrix
\`\`\`
                    HIGH IMPACT
                        ↑
                        │
     QUICK WINS         │         BIG BETS
     ─────────          │         ────────
     [Action 1]         │         [Action 4]
     [Action 2]         │         [Action 5]
                        │
LOW EFFORT ─────────────┼───────────────── HIGH EFFORT
                        │
     FILL-INS           │         AVOID
     ────────           │         ─────
     [Action 3]         │         [Action 6]
                        │
                        ↓
                    LOW IMPACT
\`\`\`

## Immediate Actions (Next 30 Days)
| Action | Owner | Deadline | Success Metric |
|--------|-------|----------|----------------|
| [Action 1] | [Role] | [Date] | [Metric] |
| [Action 2] | [Role] | [Date] | [Metric] |
| [Action 3] | [Role] | [Date] | [Metric] |

## Short-term Strategy (90 Days)
### Product
- **Build**: [Features to prioritize]
- **Improve**: [Existing features to enhance]
- **Remove**: [Features to deprecate]

### Go-to-Market
- **Positioning**: [Key message updates]
- **Targeting**: [Segment focus]
- **Channels**: [Channel priorities]

### Sales Enablement
- **Battle cards**: Create for top 3 competitors
- **Training**: [Key areas to train sales team]
- **Content**: [Comparison content to create]

## Long-term Strategy (12 Months)
### Competitive Moat Building
1. **[Moat initiative 1]**: [Description and timeline]
2. **[Moat initiative 2]**: [Description and timeline]
3. **[Moat initiative 3]**: [Description and timeline]

### Market Expansion
- **New segments**: [Segments to target]
- **Geographic**: [Regions to expand]
- **Use cases**: [New use cases to develop]

## Risk Mitigation
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| [Competitor funding round] | [H/M/L] | [H/M/L] | [Action] |
| [Big tech entry] | [H/M/L] | [H/M/L] | [Action] |
| [Price war] | [H/M/L] | [H/M/L] | [Action] |

## Key Metrics to Win
| Metric | Current | 90-Day Target | 12-Month Target |
|--------|---------|---------------|-----------------|
| Win rate vs [Comp 1] | [%] | [%] | [%] |
| Win rate vs [Comp 2] | [%] | [%] | [%] |
| Market share | [%] | [%] | [%] |
| NPS vs competitors | [Score] | [Score] | [Score] |

## Conclusion
[Paragrafo finale con call-to-action e next steps prioritari]`
    }
  ]
};
