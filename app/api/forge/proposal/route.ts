// API per generazione Proposta di Partnership Strategica dalla WarRoom/Forge
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { StartupIdea, AnalysisResult } from '@/lib/types';

const anthropic = new Anthropic();

// Sezioni del documento
const PROPOSAL_SECTIONS = [
  {
    id: 'executive-summary',
    title: '1. Executive Summary',
    prompt: (idea: StartupIdea, analysis: AnalysisResult) => `
Genera l'Executive Summary per una proposta di partnership strategica per "${analysis.ideaTitle}".

DATI STARTUP:
- Problema: ${idea.problem}
- Soluzione: ${idea.solution}
- Target: ${idea.target}
- Contesto: ${idea.additionalContext || 'N/A'}

RISULTATO ANALISI:
- Verdetto: ${analysis.verdict === 'green' ? 'PROMETTENTE' : analysis.verdict === 'yellow' ? 'CAUTO' : 'PROBLEMATICO'}
- Motivazione: ${analysis.verdictReason}
- Score Mercato: ${analysis.scores.marketSize}/100
- Score Differenziazione: ${analysis.scores.differentiation}/100
- Score Timing: ${analysis.scores.timing}/100

MERCATO:
- TAM: ${analysis.marketSize.tam.value} - ${analysis.marketSize.tam.description}
- SAM: ${analysis.marketSize.sam.value} - ${analysis.marketSize.sam.description}
- SOM: ${analysis.marketSize.som.value} - ${analysis.marketSize.som.description}

Scrivi in italiano professionale. Includi:
1. Box "Opportunità di Investimento" con: Settore, Tecnologia, Stage, Mercato Target
2. "Sintesi dell'Opportunità" - perché questa è un'opportunità unica
3. Cosa propone il team manageriale
4. Tabella "Cosa i Fondatori Ricevono"
5. "Highlights Chiave"

Formatta con markdown. Usa tabelle dove appropriato.`
  },
  {
    id: 'market-analysis',
    title: '2. Analisi di Mercato',
    prompt: (idea: StartupIdea, analysis: AnalysisResult) => `
Genera l'analisi di mercato dettagliata per "${analysis.ideaTitle}".

DATI MERCATO:
- TAM: ${analysis.marketSize.tam.value}
  Formula: ${analysis.marketSize.tam.formula}
  Descrizione: ${analysis.marketSize.tam.description}
- SAM: ${analysis.marketSize.sam.value}
  Formula: ${analysis.marketSize.sam.formula}
  Descrizione: ${analysis.marketSize.sam.description}
- SOM: ${analysis.marketSize.som.value}
  Formula: ${analysis.marketSize.som.formula}
  Descrizione: ${analysis.marketSize.som.description}

COMPETITOR:
${analysis.competitors.map(c => `- ${c.name} (${c.type}): Punti di forza: ${c.strengths.join(', ')}. Debolezze: ${c.weaknesses.join(', ')}`).join('\n')}

Scrivi in italiano. Includi:
1. Dimensione e Dinamiche del Mercato
2. Segmentazione del mercato target
3. Trend di crescita e driver
4. Analisi competitiva dettagliata
5. Posizionamento strategico

Usa tabelle per confronti. Formatta con markdown.`
  },
  {
    id: 'competitive-landscape',
    title: '3. Panorama Competitivo',
    prompt: (idea: StartupIdea, analysis: AnalysisResult) => `
Genera l'analisi del panorama competitivo per "${analysis.ideaTitle}".

COMPETITOR IDENTIFICATI:
${analysis.competitors.map(c => `
**${c.name}** (${c.type === 'direct' ? 'Diretto' : 'Indiretto'})
- Livello Prezzo: ${c.priceLevel}/10
- Complessità: ${c.complexity}/10
- Punti di Forza: ${c.strengths.join(', ')}
- Debolezze: ${c.weaknesses.join(', ')}
${c.funding ? `- Funding: ${c.funding}` : ''}
${c.website ? `- Sito: ${c.website}` : ''}
`).join('\n')}

LA NOSTRA SOLUZIONE:
${idea.solution}

Scrivi in italiano. Includi:
1. Mappa competitiva con posizionamento
2. Analisi SWOT vs competitor
3. Vantaggi competitivi sostenibili
4. Barriere all'ingresso
5. Strategia di differenziazione

Usa tabelle comparative. Formatta con markdown.`
  },
  {
    id: 'growth-strategy',
    title: '4. Strategia di Crescita',
    prompt: (idea: StartupIdea, analysis: AnalysisResult) => `
Genera la strategia di crescita per "${analysis.ideaTitle}".

ESPERIMENTI DI CRESCITA PROPOSTI:
${analysis.growthExperiments.map(e => `
**${e.title}** (Priorità: ${e.priority})
- ${e.description}
- Budget: ${e.budget}
- Timeframe: ${e.timeframe}
- Risultato atteso: ${e.expectedOutcome}
`).join('\n')}

EARLY ADOPTERS TARGET:
${analysis.earlyAdopters.map(p => `
**${p.name}** - ${p.role}
- Pain Points: ${p.painPoints.join(', ')}
- Dove trovarli: ${p.whereToFind.join(', ')}
`).join('\n')}

Scrivi in italiano. Includi:
1. Framework di crescita (AARRR o simile)
2. Canali di acquisizione prioritari
3. Strategia di retention
4. Metriche chiave (North Star, etc.)
5. Piano di scaling

Formatta con markdown.`
  },
  {
    id: 'roadmap',
    title: '5. Roadmap Operativa',
    prompt: (idea: StartupIdea, analysis: AnalysisResult) => `
Genera la roadmap operativa per "${analysis.ideaTitle}".

ROADMAP PROPOSTA:
${analysis.roadmap.map(t => `
**Settimana ${t.week}**: ${t.title}
- ${t.description}
- Categoria: ${t.category}
`).join('\n')}

Scrivi in italiano. Includi:
1. Timeline dettagliata (4 settimane)
2. Milestones chiave
3. Deliverables specifici
4. Risorse necessarie per ogni fase
5. KPI di avanzamento

Usa tabelle per la timeline. Formatta con markdown.`
  },
  {
    id: 'risk-analysis',
    title: '6. Analisi dei Rischi',
    prompt: (idea: StartupIdea, analysis: AnalysisResult) => `
Genera l'analisi dei rischi per "${analysis.ideaTitle}".

RISCHI IDENTIFICATI:
${analysis.risks.map(r => `
**${r.title}** (Severità: ${r.severity})
- ${r.description}
${r.mitigation ? `- Mitigazione: ${r.mitigation}` : ''}
`).join('\n')}

SCORE RISCHIO ESECUZIONE: ${analysis.scores.executionRisk}/100

Scrivi in italiano. Includi:
1. Matrice dei rischi (impatto vs probabilità)
2. Rischi di mercato
3. Rischi tecnologici
4. Rischi operativi
5. Strategie di mitigazione dettagliate
6. Piano di contingenza

Usa tabelle. Formatta con markdown.`
  },
  {
    id: 'financial-projections',
    title: '7. Proiezioni Finanziarie',
    prompt: (idea: StartupIdea, analysis: AnalysisResult) => `
Genera le proiezioni finanziarie per "${analysis.ideaTitle}".

DATI MERCATO:
- SOM (obiettivo raggiungibile): ${analysis.marketSize.som.value}
- SAM (mercato accessibile): ${analysis.marketSize.sam.value}

Scrivi in italiano. Genera proiezioni REALISTICHE:
1. Revenue model dettagliato
2. Proiezioni 3-5 anni (conservativo, base, ottimistico)
3. Unit economics (CAC, LTV, Payback)
4. Break-even analysis
5. Funding requirements
6. Use of funds

Crea tabelle numeriche dettagliate. Formatta con markdown.`
  },
  {
    id: 'investment-thesis',
    title: '8. Tesi di Investimento',
    prompt: (idea: StartupIdea, analysis: AnalysisResult) => `
Genera la tesi di investimento per "${analysis.ideaTitle}".

VERDETTO ANALISI: ${analysis.verdict === 'green' ? 'PROMETTENTE' : analysis.verdict === 'yellow' ? 'CAUTO' : 'PROBLEMATICO'}
MOTIVAZIONE: ${analysis.verdictReason}

SCORES:
- Mercato: ${analysis.scores.marketSize}/100
- Competizione: ${analysis.scores.competition}/100
- Differenziazione: ${analysis.scores.differentiation}/100
- Timing: ${analysis.scores.timing}/100
- Overall: ${analysis.scores.overall}/100

Scrivi in italiano. Includi:
1. Perché investire ora
2. Potenziale di rendimento
3. Exit strategy possibili
4. Comparables e valutazione
5. Deal terms suggeriti
6. Conclusioni e raccomandazioni

Formatta con markdown.`
  }
];

export async function POST(request: NextRequest) {
  try {
    const { idea, analysis } = await request.json() as {
      idea: StartupIdea;
      analysis: AnalysisResult;
    };

    if (!idea || !analysis) {
      return NextResponse.json({ error: 'Missing idea or analysis data' }, { status: 400 });
    }

    const sections: { id: string; title: string; content: string }[] = [];

    // Generate each section
    for (const section of PROPOSAL_SECTIONS) {
      console.log(`[FORGE PROPOSAL] Generating section: ${section.title}`);
      
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: section.prompt(idea, analysis)
        }]
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      
      sections.push({
        id: section.id,
        title: section.title,
        content
      });
    }

    return NextResponse.json({
      success: true,
      sections
    });

  } catch (error) {
    console.error('[FORGE PROPOSAL] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate proposal' },
      { status: 500 }
    );
  }
}
