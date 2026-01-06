const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Arsenal prompts - simplified for speed
const ARSENAL_PROMPTS = {
  'landing-page': {
    parts: [
      { id: 'structure', title: 'Struttura', prompt: `Crea la STRUTTURA di una landing page:\n\n## HERO\n- Headline (max 10 parole)\n- Subheadline\n- CTA Button\n\n## PROBLEMA (3 bullet)\n\n## SOLUZIONE (3 feature)\n\n## COME FUNZIONA (3 step)\n\n## PRICING (2 piani)\n\n## CTA FINALE` },
      { id: 'content', title: 'Contenuti', prompt: `Crea i CONTENUTI extra:\n\n## TESTIMONIAL (3)\n\n## FAQ (5 domande + risposte)` }
    ]
  },
  'email-sequences': {
    parts: [
      { id: 'cold', title: 'Cold Emails', prompt: `Crea SEQUENZA COLD OUTREACH (3 email):\nPer ogni: Subject, Body (max 100 parole), Giorno` },
      { id: 'nurture', title: 'Nurturing', prompt: `Crea SEQUENZA NURTURING (3 email):\nPer ogni: Subject, Body, Content/valore` }
    ]
  },
  'linkedin-pack': {
    parts: [
      { id: 'profile', title: 'Profilo', prompt: `Ottimizza profilo LinkedIn:\n## HEADLINE\n## ABOUT (500 char)\n## FEATURED (3 contenuti)` },
      { id: 'week1', title: 'Settimana 1', prompt: `7 post LinkedIn settimana 1:\nPer ogni: Hook, Contenuto (150 parole), CTA, Hashtag` },
      { id: 'week2', title: 'Settimana 2', prompt: `7 post LinkedIn settimana 2:\nPer ogni: Hook, Contenuto (150 parole), CTA, Hashtag` }
    ]
  },
  'cold-scripts': {
    parts: [
      { id: 'calls', title: 'Script Chiamate', prompt: `Script COLD CALL:\n## APERTURA\n## PITCH\n## 5 OBIEZIONI + RISPOSTE\n## CHIUSURA\n## VOICEMAIL` },
      { id: 'dm', title: 'DM e Video', prompt: `Script outreach:\n## DM LINKEDIN (4 messaggi)\n## VIDEO PITCH 60 SEC\n## ELEVATOR PITCH` }
    ]
  },
  'investor-match': {
    parts: [
      { id: 'investors', title: 'Investitori', prompt: `10 INVESTITORI ITALIANI/EU per questa startup:\nPer ogni: Nome, Tipo, Check size, Focus, Perché match, Come contattare` }
    ]
  },
  'pitch-deck': {
    parts: [
      { id: 'slides1-6', title: 'Slide 1-6', prompt: `Pitch deck SLIDE 1-6:\n## COVER\n## PROBLEMA\n## SOLUZIONE\n## DEMO\n## MARKET\n## BUSINESS MODEL` },
      { id: 'slides7-12', title: 'Slide 7-12', prompt: `Pitch deck SLIDE 7-12:\n## TRACTION\n## COMPETITION\n## GTM\n## TEAM\n## FINANCIALS\n## ASK` }
    ]
  },
  'financial-model': {
    parts: [
      { id: 'model', title: 'Financial Model', prompt: `Financial model:\n## ASSUMPTIONS (10 key)\n## UNIT ECONOMICS\n## PROIEZIONI 3 ANNI\n## FUNDING SCENARIOS` }
    ]
  },
  'pitch-qa-trainer': {
    parts: [
      { id: 'qa', title: 'Q&A Trainer', prompt: `15 DOMANDE VC + risposte ideali:\nPer ogni: Domanda, Difficoltà, Risposta (3 righe), Cosa NON dire` }
    ]
  },
  'interview-scripts': {
    parts: [
      { id: 'discovery', title: 'Discovery', prompt: `Script PROBLEM DISCOVERY:\n- Intro\n- 10 DOMANDE (domanda + green/red flag)\n- Chiusura` },
      { id: 'validation', title: 'Validation', prompt: `Script SOLUTION VALIDATION:\n- 8 DOMANDE\n- TEST PRICING\n- Template recruiting` }
    ]
  },
  'experiment-tracker': {
    parts: [
      { id: 'experiments', title: 'Esperimenti', prompt: `10 ESPERIMENTI prioritizzati:\nPer ogni: Nome, Hypothesis, Metrica, ICE Score, 3 step` }
    ]
  },
  'survey-generator': {
    parts: [
      { id: 'survey', title: 'Survey', prompt: `Survey VALIDATION (20 domande):\n## SCREENING (3)\n## PROBLEMA (5)\n## SOLUZIONE (4)\n## PRICING (3)\n## DEMOGRAPHICS (2)` }
    ]
  },
  'competitor-radar': {
    parts: [
      { id: 'analysis', title: 'Analisi', prompt: `COMPETITOR ANALYSIS:\n## 5 COMPETITOR\n## FEATURE MATRIX\n## POSITIONING` }
    ]
  },
  'roadmap-generator': {
    parts: [
      { id: 'roadmap', title: 'Roadmap', prompt: `ROADMAP 12 MESI:\n## Q1-Q2 (OKR + task)\n## Q3-Q4 (OKR + task)\n## TEAM PLAN\n## BUDGET` }
    ]
  },
  'cap-table-sim': {
    parts: [
      { id: 'captable', title: 'Cap Table', prompt: `CAP TABLE SIMULATOR:\n## CAP TABLE INIZIALE\n## 3 SCENARI ROUND\n## ESOP\n## TERMINI` }
    ]
  },
  'executive-summary': {
    parts: [
      { id: 'summary', title: 'Executive Summary', prompt: `EXECUTIVE SUMMARY (1 pagina):\n## OPPORTUNITY\n## PROBLEMA\n## SOLUZIONE\n## MARKET\n## BUSINESS MODEL\n## TRACTION\n## TEAM\n## ASK` }
    ]
  },
  'legal-starter-pack': {
    parts: [
      { id: 'legal', title: 'Legal Pack', prompt: `LEGAL STARTER PACK:\n## CHECKLIST\n## PATTO PARASOCIALE (clausole)\n## NDA\n## FOUNDER AGREEMENT\n## GDPR` }
    ]
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'arsenal-api' });
});

// Get item config
app.get('/api/arsenal/config', (req, res) => {
  const { itemId } = req.query;
  const config = ARSENAL_PROMPTS[itemId];
  
  if (!config) {
    return res.status(400).json({ error: 'Invalid itemId' });
  }
  
  res.json({
    itemId,
    totalParts: config.parts.length,
    parts: config.parts.map((p, i) => ({ index: i, id: p.id, title: p.title }))
  });
});

// Generate arsenal content
app.post('/api/arsenal', async (req, res) => {
  const { itemId, partIndex = 0, idea, analysis } = req.body;
  
  console.log(`[ARSENAL] Request: ${itemId}, part ${partIndex}`);
  
  const config = ARSENAL_PROMPTS[itemId];
  if (!config || partIndex >= config.parts.length) {
    return res.status(400).json({ error: 'Invalid itemId or partIndex' });
  }
  
  const part = config.parts[partIndex];
  const totalParts = config.parts.length;
  
  // Build context
  const context = `**STARTUP**: ${analysis?.ideaTitle || idea?.name || 'Startup'}
**PROBLEMA**: ${idea?.problem || 'N/A'}
**SOLUZIONE**: ${idea?.solution || 'N/A'}
**TARGET**: ${idea?.target || 'N/A'}`;

  try {
    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    const stream = await anthropic.messages.stream({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 2000,
      system: 'Sei un expert consultant. Genera output COMPLETO e SPECIFICO. Non usare placeholder. Rispondi in italiano. Sii conciso ma actionable.',
      messages: [
        {
          role: 'user',
          content: `${part.prompt}\n\n---\nCONTESTO:\n${context}\n---\n\nGenera output specifico per questa startup.`
        }
      ]
    });
    
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta?.text) {
        res.write(JSON.stringify({ type: 'delta', text: event.delta.text }) + '\n');
      }
    }
    
    // Send done message
    res.write(JSON.stringify({
      type: 'done',
      itemId,
      partIndex,
      partTitle: part.title,
      totalParts,
      isLastPart: partIndex === totalParts - 1
    }) + '\n');
    
    res.end();
    console.log(`[ARSENAL] Completed: ${itemId}, part ${partIndex}/${totalParts}`);
    
  } catch (error) {
    console.error('[ARSENAL] Error:', error);
    res.write(JSON.stringify({ type: 'error', error: error.message }) + '\n');
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`Arsenal API running on port ${PORT}`);
});
