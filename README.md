# Virtual Venture Analyst

Un sistema AI multi-agente che analizza idee di startup come un venture studio professionale.

## Features

### Multi-Agent System
Il sistema simula un team di 5 agenti specializzati:

1. **Orchestrator** - Coordina il flusso di lavoro e sintetizza le informazioni
2. **Market Analyst** - Analizza competitor e dimensiona il mercato (TAM/SAM/SOM)
3. **Growth Hacker** - Definisce la strategia Go-To-Market e gli esperimenti di crescita
4. **Project Manager** - Trasforma la strategia in una roadmap esecutiva
5. **Devil's Advocate** - Identifica rischi e punti deboli

### UI Components

- **Chat Sidebar** ("L'Interrogatorio") - Interfaccia conversazionale per inserire idee
- **Terminal Bar** ("Il Terminale degli Agenti") - Feedback visivo in tempo reale degli agenti
- **War Room** - Dashboard interattiva con visualizzazioni:
  - **Battle Matrix** - Scatter plot per posizionamento competitivo
  - **Market Circles** - Cerchi concentrici TAM/SAM/SOM
  - **Kanban Roadmap** - Board stile Trello con task pre-compilati
  - **Risk Panel** - Analisi rischi con mitigazioni
  - **Contact Cards** - Profili contatti con generazione messaggi

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React

## Getting Started

### 1. Configura la API Key di Claude (Opzionale)

Per usare l'analisi AI reale con Claude, crea un file `.env.local`:

```bash
# Crea il file .env.local nella root del progetto
echo "ANTHROPIC_API_KEY=your_api_key_here" > .env.local
```

Ottieni la tua API key da: https://console.anthropic.com/

> **Nota:** Senza API key, puoi comunque usare la "Demo Mode" per testare l'interfaccia.

### 2. Installa e Avvia

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### 3. Modalità di Analisi

L'app supporta due modalità (toggle nell'header):

- **🤖 Claude AI**: Analisi reale con Claude Sonnet - genera competitor reali, market sizing accurato, e contenuti personalizzati
- **⚡ Demo Mode**: Dati simulati per testare l'interfaccia senza consumare API credits

## Usage

1. Descrivi la tua idea di startup nella chat a sinistra
2. Se necessario, rispondi alle domande di chiarimento
3. Osserva gli agenti lavorare nella barra terminale in alto
4. Esplora i risultati nella War Room:
   - Clicca sui competitor nella Battle Matrix per dettagli
   - Passa il mouse sui cerchi del mercato per le formule
   - Espandi i task nella roadmap per vedere i template pronti
   - Genera messaggi personalizzati per i contatti suggeriti

## Project Structure

```
venture-analyst/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ChatSidebar.tsx
│   ├── TerminalBar.tsx
│   ├── WarRoom.tsx
│   ├── EmptyState.tsx
│   └── visualizations/
│       ├── BattleMatrix.tsx
│       ├── MarketCircles.tsx
│       ├── KanbanRoadmap.tsx
│       ├── RiskPanel.tsx
│       ├── ContactCards.tsx
│       └── VerdictBanner.tsx
├── lib/
│   ├── agents.ts      # Agent simulation logic
│   ├── store.ts       # Zustand state management
│   ├── types.ts       # TypeScript interfaces
│   └── utils.ts       # Utility functions
└── package.json
```

## License

MIT
