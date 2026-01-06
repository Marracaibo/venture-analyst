// Forge Studio Screener - Decision Logic (v2)
// Basato sui 5 Filtri Chiave + Gap Analysis + Core/Satellite

import {
  StartupInput,
  ScreenerResult,
  Verdetto,
  PackageOffer,
  OperationalRole,
  VERTICALI_PRIORITY
} from './screener-types';

// ==========================================
// VALUTAZIONE 5 FILTRI CHIAVE
// ==========================================

interface FiltersResult {
  problemSolving: boolean;
  marketAnalysis: boolean;
  differentiation: boolean;
  businessModel: boolean;
  traction: boolean;
  passedCount: number;
  details: string[];
}

function evaluate5Filters(input: StartupInput): FiltersResult {
  const details: string[] = [];
  
  // Nota: La valutazione dettagliata dei 5 filtri viene ora fatta dall'AI
  // Questa funzione fornisce una valutazione base per fallback
  
  // 1. PROBLEM SOLVING - ha descritto il problema?
  const problemSolving = !!(input.problemDescription && input.problemDescription.length > 20) ||
    input.fase === 'revenue';
  
  if (problemSolving) {
    details.push('Problem Solving: Problema descritto');
  } else {
    details.push('Problem Solving: Da approfondire');
  }

  // 2. MARKET ANALYSIS - ha descritto il mercato?
  const marketAnalysis = !!(input.marketDescription && input.marketDescription.length > 20) ||
    input.competizione !== 'saturo';
  
  if (marketAnalysis) {
    details.push('Market Analysis: Mercato descritto');
  } else {
    details.push('Market Analysis: Da analizzare');
  }

  // 3. DIFFERENZIAZIONE - ha descritto unicità?
  const differentiation = !!(input.uniquenessDescription && input.uniquenessDescription.length > 20) ||
    !!(input.competitiveAdvantage && input.competitiveAdvantage.length > 10) ||
    input.competizione === 'oceano-blu';
  
  if (differentiation) {
    details.push('Differenziazione: Unicità descritta');
  } else {
    details.push('Differenziazione: Da definire');
  }

  // 4. BUSINESS MODEL - CAC:LTV o modello descritto?
  let businessModel = false;
  if (input.cacEstimate && input.ltvEstimate) {
    const ratio = input.ltvEstimate / input.cacEstimate;
    businessModel = ratio >= 3;
    details.push(`Business Model: LTV/CAC = ${ratio.toFixed(1)}x`);
  } else if (input.revenueModel && input.revenueModel.length > 10) {
    businessModel = true;
    details.push('Business Model: Modello descritto');
  } else if (input.fase === 'revenue' && input.mrrCurrent && input.mrrCurrent > 1000) {
    businessModel = true;
    details.push('Business Model: Revenue presente');
  } else {
    details.push('Business Model: Da definire');
  }

  // 5. TRACTION - ha descritto traction?
  const traction = !!(input.tractionDescription && input.tractionDescription.length > 10) ||
    (input.customersCount && input.customersCount > 0) ||
    (input.mrrCurrent && input.mrrCurrent > 0) ||
    input.fase === 'revenue';
  
  if (traction) {
    details.push('Traction: Risultati descritti');
  } else {
    details.push('Traction: Da costruire');
  }

  const passed = [problemSolving, marketAnalysis, differentiation, businessModel, traction];
  const passedCount = passed.filter(Boolean).length;

  return {
    problemSolving,
    marketAnalysis,
    differentiation,
    businessModel,
    traction,
    passedCount,
    details
  };
}

// ==========================================
// GAP ANALYSIS - Cosa possiamo offrire
// ==========================================

interface GapResult {
  gaps: string[];
  services: string[];
  rolesNeeded: OperationalRole[];
}

function analyzeGaps(input: StartupInput, filters: FiltersResult): GapResult {
  const gaps: string[] = [];
  const services: string[] = [];
  const rolesNeeded: OperationalRole[] = [];

  // MVP / Prodotto
  if (input.fase === 'idea' || input.fase === 'mvp') {
    gaps.push('Prodotto non ancora maturo');
    services.push('Sviluppo MVP / Tech Architecture');
    if (input.needsCto === true || (input.team && !input.team.techInHouse)) {
      rolesNeeded.push('cto');
    }
  }

  // Market Analysis
  if (!filters.marketAnalysis) {
    gaps.push('Analisi di mercato insufficiente');
    services.push('Market Research & Competitive Analysis');
  }

  // Business Model
  if (!filters.businessModel) {
    gaps.push('Business model non definito o non sostenibile');
    services.push('Business Model Design & Pricing Strategy');
    if (input.needsCfo) {
      rolesNeeded.push('cfo');
    }
  }

  // Finance & Contabilità
  if (input.needsCfo || (input.fase === 'revenue' && !input.funding)) {
    gaps.push('Gestione finanziaria da strutturare');
    services.push('Financial Planning & Accounting Setup');
    if (!rolesNeeded.includes('cfo')) rolesNeeded.push('cfo');
  }

  // Marketing & Growth
  if (!filters.traction || input.needsCmo) {
    gaps.push('Difficoltà acquisizione clienti');
    services.push('Go-to-Market Strategy & Growth');
    if (input.needsCmo) {
      rolesNeeded.push('cmo');
    }
  }

  // Tech
  if (input.needsCto && !rolesNeeded.includes('cto')) {
    rolesNeeded.push('cto');
  }
  if (input.needsCmo && !rolesNeeded.includes('cmo')) {
    rolesNeeded.push('cmo');
  }

  return { gaps, services, rolesNeeded };
}

// ==========================================
// DETERMINAZIONE CORE vs SATELLITE
// ==========================================

function determineEngagement(
  input: StartupInput, 
  filters: FiltersResult, 
  gaps: GapResult
): { type: 'CORE' | 'SATELLITE' | 'REJECT'; roles: OperationalRole[]; reasoning: string } {
  
  // REJECT se:
  // - Meno di 3 filtri passati
  // - Coachability bassa
  // - Cap table sporca
  // - Consumer puro (basso priority) senza traction
  
  if (filters.passedCount < 3) {
    return {
      type: 'REJECT',
      roles: [],
      reasoning: `Solo ${filters.passedCount}/5 filtri chiave superati. Servono almeno 3/5 per considerare la startup.`
    };
  }

  if (input.coachability === 'bassa') {
    return {
      type: 'REJECT',
      roles: [],
      reasoning: 'Coachability bassa - il founder non è ricettivo al feedback. Deal breaker per venture building.'
    };
  }

  if (input.capTable === 'sporca') {
    return {
      type: 'REJECT',
      roles: [],
      reasoning: 'Cap Table problematica con troppi soci. Richiede pulizia prima di procedere.'
    };
  }

  // Controllo verticale
  const isHighPriority = VERTICALI_PRIORITY.high.includes(input.verticale);
  const isMediumPriority = VERTICALI_PRIORITY.medium.includes(input.verticale);
  const isLowPriority = VERTICALI_PRIORITY.low.includes(input.verticale);

  // CORE se:
  // - Almeno 4/5 filtri passati
  // - Servono ruoli operativi (CTO/CMO/CFO)
  // - Verticale priority high/medium
  // - Potenziale revenue significativo

  const hasOperationalNeed = gaps.rolesNeeded.length > 0;
  const hasGoodPotential = 
    (input.revenueYear3Estimate && input.revenueYear3Estimate >= 500000) ||
    (input.marketDescription && input.marketDescription.length > 50);

  if (filters.passedCount >= 4 && hasOperationalNeed && (isHighPriority || isMediumPriority) && hasGoodPotential) {
    return {
      type: 'CORE',
      roles: gaps.rolesNeeded,
      reasoning: `Startup con forte potenziale (${filters.passedCount}/5 filtri). Richiede ruoli operativi: ${gaps.rolesNeeded.join(', ').toUpperCase()}. Candidata per Core Acceleration con massimo 3 startup/anno.`
    };
  }

  // SATELLITE per tutti gli altri casi che passano almeno 3 filtri
  // - Offriamo servizi in cambio di equity senza ruoli operativi
  return {
    type: 'SATELLITE',
    roles: [],
    reasoning: filters.passedCount >= 4 
      ? 'Startup promettente ma non richiede ruoli operativi o verticale non prioritario. Offriamo servizi in cambio di equity.'
      : `${filters.passedCount}/5 filtri superati. Possiamo colmare i gap offrendo servizi in cambio di quote, senza ruoli operativi iniziali.`
  };
}

// ==========================================
// GENERAZIONE PACCHETTI CUSTOM
// ==========================================

function generatePackages(
  input: StartupInput, 
  engagement: 'CORE' | 'SATELLITE',
  roles: OperationalRole[],
  gaps: GapResult
): PackageOffer[] {
  const packages: PackageOffer[] = [];
  const startupName = input.nome || 'Startup';
  const verticalLabel = input.verticale.replace(/-/g, ' ').toUpperCase();

  if (engagement === 'CORE') {
    // ==========================================
    // CORE: 30-60% equity basato sul contributo
    // ==========================================
    
    // Calcola equity base: 30% + 10% per ogni ruolo operativo (max 60%)
    const baseEquity = 30;
    const roleEquity = Math.min(roles.length * 10, 30); // max +30% per ruoli
    const totalEquityMin = baseEquity + (roles.length > 0 ? roleEquity - 5 : 0);
    const totalEquityMax = baseEquity + roleEquity;
    
    // Pacchetto principale CORE con ruoli operativi
    if (roles.length > 0) {
      const roleDescriptions: Record<OperationalRole, { title: string; desc: string; items: string[] }> = {
        'cto': {
          title: `CTO for ${startupName}`,
          desc: `Leadership tecnica full-time per ${startupName}`,
          items: [
            `Architettura ${verticalLabel} scalabile`,
            'Tech team building & hiring',
            'Code review e quality assurance',
            'Roadmap tecnica 12 mesi',
            'Stack selection e DevOps setup'
          ]
        },
        'cmo': {
          title: `CMO for ${startupName}`,
          desc: `Leadership marketing e growth per ${startupName}`,
          items: [
            `GTM strategy ${verticalLabel}`,
            'Brand identity e positioning',
            'Acquisition channels setup',
            'Marketing team building',
            'Performance analytics'
          ]
        },
        'cfo': {
          title: `CFO for ${startupName}`,
          desc: `Leadership finanziaria per ${startupName}`,
          items: [
            'Financial planning & modeling',
            'Fundraising strategy & execution',
            'Investor relations',
            'Compliance e governance',
            'Budget e cash flow management'
          ]
        }
      };

      const roleItems = roles.map(role => ({
        titolo: roleDescriptions[role].title,
        descrizione: roleDescriptions[role].desc,
        steps: roleDescriptions[role].items
      }));

      packages.push({
        nome: `Core Partnership ${startupName}`,
        items: [
          ...roleItems,
          { 
            titolo: 'Weekly Strategy Board', 
            descrizione: `Board settimanale dedicato a ${startupName} con tutti i C-level Forge`,
            steps: ['Allineamento strategico', 'Review KPI', 'Decisioni operative', 'Blockers resolution']
          },
          { 
            titolo: 'Network & Capital Access', 
            descrizione: `Accesso esclusivo al network Forge per ${verticalLabel}`,
            steps: ['Intro investitori tier-1', 'Clienti enterprise', 'Partnership strategiche', 'Mentor verticali']
          }
        ],
        prezzo: `${totalEquityMin}-${totalEquityMax}% Equity`,
        equityRange: `${totalEquityMin}-${totalEquityMax}%`,
        rationale: `${roles.length} ruolo/i operativo/i: ${roles.map(r => r.toUpperCase()).join(', ')}`,
        tier: 'CORE'
      });
    }

    // Pacchetto addizionale per fase early (idea/mvp)
    if (input.fase === 'idea' || input.fase === 'mvp') {
      packages.push({
        nome: `MVP Acceleration ${startupName}`,
        items: [
          { titolo: 'Product Sprint', descrizione: `3 mesi intensivi per portare ${startupName} da ${input.fase} a prodotto live`, steps: ['Discovery', 'Design', 'Development', 'Launch'] },
          { titolo: 'Tech Stack Setup', descrizione: `Infrastruttura ${verticalLabel} production-ready` },
          { titolo: 'First 10 Customers', descrizione: 'Acquisizione primi 10 clienti paganti con supporto diretto' }
        ],
        prezzo: 'Incluso nel Core',
        equityRange: 'Incluso',
        tier: 'CORE'
      });
    }

  } else {
    // ==========================================
    // SATELLITE: 5-20% equity, pacchetti granulari
    // ==========================================
    
    // Pacchetto FULL se servono molti servizi (15-20%)
    if (gaps.services.length >= 3) {
      packages.push({
        nome: `${startupName} Launch Package`,
        items: gaps.services.map(service => ({
          titolo: service,
          descrizione: `Servizio dedicato per ${startupName}`
        })),
        prezzo: '15-20% Equity',
        equityRange: '15-20%',
        rationale: `Pacchetto completo: ${gaps.services.length} aree di intervento`,
        tier: 'GROWTH'
      });
    }

    // Pacchetti singoli granulari
    if (gaps.services.includes('Sviluppo MVP / Tech Architecture')) {
      packages.push({
        nome: `Tech Foundation ${startupName}`,
        items: [
          { titolo: 'Architecture Blueprint', descrizione: `Architettura ${verticalLabel} per ${startupName}` },
          { titolo: 'MVP Roadmap', descrizione: 'Roadmap sviluppo 6 mesi con milestones' },
          { titolo: 'Tech Partner Network', descrizione: 'Intro a dev agencies e freelancer verificati' },
          { titolo: 'Monthly Tech Review', descrizione: 'Review tecnica mensile con CTO Forge' }
        ],
        prezzo: '5-8% Equity',
        equityRange: '5-8%',
        rationale: 'Advisory tecnico senza sviluppo diretto',
        tier: 'BOOST'
      });
    }

    if (gaps.services.includes('Market Research & Competitive Analysis')) {
      packages.push({
        nome: `Market Intelligence ${startupName}`,
        items: [
          { titolo: `${verticalLabel} Market Deep Dive`, descrizione: 'Analisi TAM/SAM/SOM specifica' },
          { titolo: 'Competitive Landscape', descrizione: `Mappa competitor ${verticalLabel} con positioning` },
          { titolo: 'ICP & Personas', descrizione: `Buyer personas per ${startupName}` },
          { titolo: 'GTM Playbook', descrizione: 'Strategia go-to-market actionable' }
        ],
        prezzo: '3-5% Equity',
        equityRange: '3-5%',
        rationale: 'Ricerca e strategia mercato',
        tier: 'BOOST'
      });
    }

    if (gaps.services.includes('Business Model Design & Pricing Strategy')) {
      packages.push({
        nome: `Business Model ${startupName}`,
        items: [
          { titolo: 'Business Model Design', descrizione: `Modello di business ottimizzato per ${verticalLabel}` },
          { titolo: 'Pricing Strategy', descrizione: `Strategia pricing per ${startupName}` },
          { titolo: 'Unit Economics Model', descrizione: 'CAC, LTV, payback period, margini' },
          { titolo: 'Revenue Projections', descrizione: 'Proiezioni 3 anni per fundraising' }
        ],
        prezzo: '3-5% Equity',
        equityRange: '3-5%',
        rationale: 'Definizione modello economico',
        tier: 'BOOST'
      });
    }

    if (gaps.services.includes('Financial Planning & Accounting Setup')) {
      packages.push({
        nome: `Finance Setup ${startupName}`,
        items: [
          { titolo: 'Accounting & Reporting', descrizione: 'Setup contabilità startup-ready' },
          { titolo: 'Financial Model', descrizione: `Modello finanziario ${startupName} per investitori` },
          { titolo: 'Fundraising Materials', descrizione: 'Pitch deck, data room, termsheet templates' },
          { titolo: 'CFO Advisory', descrizione: 'Call trimestrale con CFO Forge' }
        ],
        prezzo: '4-6% Equity',
        equityRange: '4-6%',
        rationale: 'Setup finanziario e fundraising prep',
        tier: 'BOOST'
      });
    }

    if (gaps.services.includes('Go-to-Market Strategy & Growth')) {
      packages.push({
        nome: `Growth Engine ${startupName}`,
        items: [
          { titolo: 'Growth Strategy', descrizione: `Strategia acquisizione per ${verticalLabel}` },
          { titolo: 'Channel Prioritization', descrizione: 'Identificazione top 3 canali' },
          { titolo: 'First Customers Program', descrizione: '5 intro a potenziali clienti dal network Forge' },
          { titolo: 'Growth Dashboard', descrizione: 'Setup analytics e KPI tracking' }
        ],
        prezzo: '4-7% Equity',
        equityRange: '4-7%',
        rationale: 'Accelerazione acquisizione clienti',
        tier: 'GROWTH'
      });
    }

    // Pacchetto advisory base se pochi gap
    if (packages.length === 0 || gaps.services.length < 2) {
      packages.push({
        nome: `Advisory ${startupName}`,
        items: [
          { titolo: 'Monthly Strategy Call', descrizione: 'Call mensile con partner Forge' },
          { titolo: 'Network Introductions', descrizione: '2 intro/mese a clienti o investitori' },
          { titolo: 'Quarterly Review', descrizione: 'Review trimestrale progressi e pivot' }
        ],
        prezzo: '2-4% Equity',
        equityRange: '2-4%',
        rationale: 'Advisory leggero con opzione upgrade',
        tier: 'BOOST'
      });
    }
  }

  return packages;
}

// ==========================================
// FUNZIONE PRINCIPALE
// ==========================================

export function evaluateStartup(input: StartupInput): ScreenerResult {
  // 1. Valuta i 5 filtri
  const filters = evaluate5Filters(input);
  
  // 2. Analizza i gap
  const gaps = analyzeGaps(input, filters);
  
  // 3. Determina engagement type
  const engagement = determineEngagement(input, filters, gaps);
  
  // 4. Genera kill switches
  const killSwitches: string[] = [];
  if (engagement.type === 'REJECT') {
    if (filters.passedCount < 3) killSwitches.push(`Solo ${filters.passedCount}/5 filtri chiave superati`);
    if (input.coachability === 'bassa') killSwitches.push('Coachability bassa - founder non ricettivo');
    if (input.capTable === 'sporca') killSwitches.push('Cap Table problematica');
  }

  // 5. Estrai strengths e weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  
  if (filters.problemSolving) strengths.push('Problema validato dal mercato');
  else weaknesses.push('Problema non ancora validato');
  
  if (filters.marketAnalysis) strengths.push('Mercato interessante con opportunità');
  else weaknesses.push('Analisi di mercato da approfondire');
  
  if (filters.differentiation) strengths.push('Differenziazione o moat competitivo');
  else weaknesses.push('Facile da replicare, serve differenziazione');
  
  if (filters.businessModel) strengths.push('Business model sostenibile');
  else weaknesses.push('Business model da definire o migliorare');
  
  if (filters.traction) strengths.push('Traction o facilità acquisizione clienti');
  else weaknesses.push('Difficoltà acquisizione clienti');

  // Extra strengths/weaknesses
  if (VERTICALI_PRIORITY.high.includes(input.verticale)) {
    strengths.push('Verticale prioritario per Forge Studio');
  }
  if (input.fase === 'revenue') {
    strengths.push('Già generando revenue');
  }
  if (input.coachability === 'alta') {
    strengths.push('Founder altamente coachable');
  }
  if (input.team?.fullTime) {
    strengths.push('Team full-time dedicato');
  }

  // 6. Genera pacchetti
  const packages = engagement.type === 'REJECT' 
    ? [] 
    : generatePackages(input, engagement.type, engagement.roles, gaps);

  // 7. Next steps
  const nextSteps = engagement.type === 'REJECT'
    ? [
        'Lavora sui filtri non superati prima di ripresentarti',
        'Se cap table sporca: risolvi la struttura societaria',
        'Se coachability: valuta se sei pronto per un percorso di accelerazione'
      ]
    : engagement.type === 'CORE'
      ? [
          'Call di approfondimento con partner Forge (30 min)',
          'Due diligence tecnica e commerciale',
          'Definizione term sheet e ruoli operativi',
          'Kick-off piano 90 giorni'
        ]
      : [
          'Review proposta servizi-per-equity',
          'Definizione milestones per eventuale upgrade a CORE',
          'Setup check-in mensili',
          'Firma accordo e avvio collaborazione'
        ];

  // 8. Costruisci result
  const verdetto: Verdetto = engagement.type;
  const verdettoLabel = 
    verdetto === 'CORE' ? 'Core Acceleration' :
    verdetto === 'SATELLITE' ? 'Satellite Partnership' :
    'Non Idonea';

  return {
    verdetto,
    verdettoLabel,
    reasoning: engagement.reasoning,
    killSwitches,
    strengths,
    weaknesses,
    packages,
    nextSteps,
    filtersScore: {
      problemSolving: filters.problemSolving,
      marketAnalysis: filters.marketAnalysis,
      differentiation: filters.differentiation,
      businessModel: filters.businessModel,
      traction: filters.traction,
      passedCount: filters.passedCount
    },
    gapsIdentified: gaps.gaps,
    servicesWeCanOffer: gaps.services,
    engagementType: engagement.type === 'REJECT' ? undefined : engagement.type,
    operationalRoles: engagement.roles.length > 0 ? engagement.roles : undefined,
    equityProposed: packages.length > 0 ? packages.map(p => p.equityRange).join(' + ') : undefined
  };
}
