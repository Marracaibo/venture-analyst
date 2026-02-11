// Word Document Generator for Investment Proposal - EnoGen Style
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ShadingType,
  PageBreak,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  TableOfContents,
  StyleLevel,
  convertInchesToTwip,
  ExternalHyperlink,
  ImageRun,
  VerticalAlign,
  UnderlineType,
} from 'docx';
import { StartupInput, ScreenerResult, SETTORI_CONFIG, BUSINESS_MODEL_LABELS } from './screener-types';

// Colori
const COLORS = {
  primary: '2962FF',      // Blu EnoGen
  primaryDark: '1A47B0',
  accent: '00BFA5',       // Teal
  dark: '1A202C',
  gray: '718096',
  lightGray: 'F7FAFC',
  success: '22C55E',
  warning: 'EAB308',
  white: 'FFFFFF',
};

interface ProposalSection {
  id: string;
  title: string;
  content: string;
}

// Strip emoji and special unicode symbols from text (codePoint-based, no 'u' flag needed)
function stripEmoji(text: string): string {
  return Array.from(text).filter(char => {
    const c = char.codePointAt(0) || 0;
    if (c >= 0x1F600 && c <= 0x1F64F) return false;
    if (c >= 0x1F300 && c <= 0x1F5FF) return false;
    if (c >= 0x1F680 && c <= 0x1F6FF) return false;
    if (c >= 0x1F1E0 && c <= 0x1F1FF) return false;
    if (c >= 0x2600 && c <= 0x26FF) return false;
    if (c >= 0x2700 && c <= 0x27BF) return false;
    if (c >= 0xFE00 && c <= 0xFE0F) return false;
    if (c >= 0x1F900 && c <= 0x1F9FF) return false;
    if (c >= 0x1FA00 && c <= 0x1FA6F) return false;
    if (c >= 0x1FA70 && c <= 0x1FAFF) return false;
    if (c === 0x200D || c === 0x20E3) return false;
    if (c >= 0xE0020 && c <= 0xE007F) return false;
    if ([0x2605, 0x2606, 0x2B50, 0x2705, 0x274C, 0x26A1, 0x2728].includes(c)) return false;
    return true;
  }).join('').replace(/\s{2,}/g, ' ').trim();
}

// Pre-process AI-generated markdown to normalize structure
function preprocessContent(content: string): string {
  let result = content;
  // Ensure --- (horizontal rules) become proper line breaks
  result = result.replace(/\s*-{3,}\s*/g, '\n\n');
  // Ensure ## headings always start on their own line
  result = result.replace(/([^\n])\s*(#{1,4}\s)/g, '$1\n$2');
  // Ensure table rows (starting with |) are always on their own line
  result = result.replace(/([^\n|])\s*(\|[^|]+\|)/g, '$1\n$2');
  // Remove stray ** that aren't proper bold markers (orphaned asterisks)
  result = result.replace(/\*\*\s*\*\*/g, '');
  // Clean up multiple blank lines
  result = result.replace(/\n{3,}/g, '\n\n');
  return result.trim();
}

// Clean text: strip residual markdown markers
function cleanText(text: string): string {
  return text.replace(/\*\*/g, '').replace(/#{1,4}\s*/g, '').trim();
}

// Parse markdown to docx elements (returns mixed Paragraph and Table)
function parseMarkdownToDocx(rawContent: string): (Paragraph | Table)[] {
  const content = preprocessContent(rawContent);
  const elements: (Paragraph | Table)[] = [];
  const lines = content.split('\n');
  let inTable = false;
  let tableRows: string[][] = [];
  let tableHeaders: string[] = [];

  const flushTable = () => {
    if (tableHeaders.length > 0 || tableRows.length > 0) {
      const rows: TableRow[] = [];
      
      // Header row
      if (tableHeaders.length > 0) {
        rows.push(new TableRow({
          tableHeader: true,
          children: tableHeaders.map(header => new TableCell({
            shading: { fill: COLORS.primary, type: ShadingType.CLEAR },
            width: { size: 100 / tableHeaders.length, type: WidthType.PERCENTAGE },
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ 
                text: header.trim(), 
                bold: true, 
                color: COLORS.white,
                size: 20
              })]
            })],
            verticalAlign: VerticalAlign.CENTER,
          }))
        }));
      }
      
      // Data rows
      tableRows.forEach((row, idx) => {
        // Ensure row has same number of cells as headers
        while (row.length < tableHeaders.length) {
          row.push('');
        }
        rows.push(new TableRow({
          children: row.slice(0, tableHeaders.length).map(cell => new TableCell({
            shading: { fill: idx % 2 === 0 ? COLORS.lightGray : COLORS.white, type: ShadingType.CLEAR },
            width: { size: 100 / tableHeaders.length, type: WidthType.PERCENTAGE },
            children: [new Paragraph({
              children: [new TextRun({ 
                text: cleanText(cell.trim()), 
                size: 20,
                color: COLORS.dark
              })]
            })],
            verticalAlign: VerticalAlign.CENTER,
          }))
        }));
      });

      if (rows.length > 0) {
        elements.push(new Paragraph({ children: [] })); // Spacing before table
        elements.push(new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: rows,
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
          }
        }));
        elements.push(new Paragraph({ children: [] })); // Spacing after table
      }
      
      tableHeaders = [];
      tableRows = [];
    }
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      if (inTable) flushTable();
      elements.push(new Paragraph({ children: [] }));
      continue;
    }

    // Skip horizontal rules
    if (/^-{3,}$/.test(trimmed) || /^\*{3,}$/.test(trimmed) || /^_{3,}$/.test(trimmed)) {
      continue;
    }

    // Table detection
    if (trimmed.startsWith('|')) {
      if (trimmed.replace(/[^-|\s]/g, '').replace(/\s/g, '') === trimmed.replace(/\s/g, '')) continue; // Skip separator rows
      if (trimmed.includes('---')) continue; // Skip separator
      
      const cells = trimmed.split('|').filter(c => c.trim()).map(c => cleanText(c));
      
      if (!inTable) {
        inTable = true;
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Headers
    if (trimmed.startsWith('####')) {
      elements.push(new Paragraph({
        heading: HeadingLevel.HEADING_4,
        children: [new TextRun({ 
          text: cleanText(trimmed.replace(/^####\s*/, '')), 
          bold: true,
          color: COLORS.dark,
          size: 22
        })]
      }));
    } else if (trimmed.startsWith('###')) {
      elements.push(new Paragraph({
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 },
        children: [new TextRun({ 
          text: cleanText(trimmed.replace(/^###\s*/, '')), 
          bold: true,
          color: COLORS.primary,
          size: 24
        })]
      }));
    } else if (trimmed.startsWith('##')) {
      elements.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 150 },
        children: [new TextRun({ 
          text: cleanText(trimmed.replace(/^##\s*/, '')), 
          bold: true,
          color: COLORS.primary,
          size: 28
        })]
      }));
    } else if (trimmed.startsWith('#')) {
      elements.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
        children: [new TextRun({ 
          text: cleanText(trimmed.replace(/^#\s*/, '')), 
          bold: true,
          color: COLORS.dark,
          size: 32
        })]
      }));
    }
    // Bullet points
    else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const text = trimmed.replace(/^[-*]\s*/, '');
      const runs = parseBoldText(text);
      elements.push(new Paragraph({
        bullet: { level: 0 },
        spacing: { after: 80 },
        children: runs
      }));
    }
    // Numbered lists
    else if (/^\d+\.\s/.test(trimmed)) {
      const match = trimmed.match(/^\d+\.\s*(.*)/);
      if (match) {
        const runs = parseBoldText(match[1]);
        elements.push(new Paragraph({
          numbering: { reference: 'numbered-list', level: 0 },
          spacing: { after: 80 },
          children: runs
        }));
      }
    }
    // Blockquotes / Info boxes
    else if (trimmed.startsWith('>')) {
      const text = trimmed.replace(/^>\s*/, '');
      elements.push(new Paragraph({
        shading: { fill: 'E8F0FE', type: ShadingType.CLEAR },
        border: {
          left: { style: BorderStyle.SINGLE, size: 24, color: COLORS.primary }
        },
        indent: { left: convertInchesToTwip(0.25), right: convertInchesToTwip(0.25) },
        spacing: { before: 100, after: 100 },
        children: parseBoldText(text)
      }));
    }
    // Regular paragraph
    else {
      const runs = parseBoldText(trimmed);
      elements.push(new Paragraph({
        spacing: { after: 120 },
        children: runs
      }));
    }
  }

  if (inTable) flushTable();

  return elements;
}

// Parse bold text (**text**)
function parseBoldText(text: string): TextRun[] {
  const runs: TextRun[] = [];
  const regex = /\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Text before bold
    if (match.index > lastIndex) {
      runs.push(new TextRun({ 
        text: text.slice(lastIndex, match.index),
        size: 22,
        color: COLORS.dark
      }));
    }
    // Bold text
    runs.push(new TextRun({ 
      text: match[1], 
      bold: true,
      size: 22,
      color: COLORS.dark
    }));
    lastIndex = regex.lastIndex;
  }

  // Remaining text
  if (lastIndex < text.length) {
    runs.push(new TextRun({ 
      text: text.slice(lastIndex),
      size: 22,
      color: COLORS.dark
    }));
  }

  if (runs.length === 0) {
    runs.push(new TextRun({ text, size: 22, color: COLORS.dark }));
  }

  return runs;
}

// Helper: full-width colored bar with text
function createColorBar(text: string, fillColor: string, textColor: string, fontSize: number = 24, bold: boolean = true): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE, size: 0 },
      bottom: { style: BorderStyle.NONE, size: 0 },
      left: { style: BorderStyle.NONE, size: 0 },
      right: { style: BorderStyle.NONE, size: 0 },
      insideHorizontal: { style: BorderStyle.NONE, size: 0 },
      insideVertical: { style: BorderStyle.NONE, size: 0 },
    },
    rows: [new TableRow({
      children: [new TableCell({
        shading: { fill: fillColor, type: ShadingType.CLEAR },
        width: { size: 100, type: WidthType.PERCENTAGE },
        margins: { top: convertInchesToTwip(0.12), bottom: convertInchesToTwip(0.12), left: convertInchesToTwip(0.3), right: convertInchesToTwip(0.3) },
        children: [new Paragraph({
          children: [new TextRun({ text, bold, size: fontSize, color: textColor, font: 'Calibri' })]
        })]
      })]
    })]
  });
}

// Helper: KPI metric cell
function createMetricCell(label: string, value: string, fillColor: string = COLORS.lightGray): TableCell {
  return new TableCell({
    shading: { fill: fillColor, type: ShadingType.CLEAR },
    width: { size: 50, type: WidthType.PERCENTAGE },
    margins: { top: convertInchesToTwip(0.1), bottom: convertInchesToTwip(0.1), left: convertInchesToTwip(0.2), right: convertInchesToTwip(0.2) },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: label.toUpperCase(), size: 16, color: COLORS.gray, bold: true, font: 'Calibri' })]
      }),
      new Paragraph({
        children: [new TextRun({ text: value, size: 24, color: COLORS.dark, bold: true, font: 'Calibri' })]
      })
    ]
  });
}

// Helper: section title bar (number + title on colored background)
function createSectionTitle(title: string): (Paragraph | Table)[] {
  const cleanTitle = stripEmoji(title).replace(/\*\*/g, '');
  return [
    new Paragraph({ children: [] }),
    createColorBar(cleanTitle, COLORS.primary, COLORS.white, 28, true),
    new Paragraph({ spacing: { after: 200 }, children: [] }),
  ];
}

export async function generateProposalWord(
  input: StartupInput,
  result: ScreenerResult,
  sections: ProposalSection[]
): Promise<void> {
  const settore = SETTORI_CONFIG.find(s => s.id === input.verticale);
  const date = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
  const dateFormatted = date.charAt(0).toUpperCase() + date.slice(1);
  const noBorders = {
    top: { style: BorderStyle.NONE, size: 0 },
    bottom: { style: BorderStyle.NONE, size: 0 },
    left: { style: BorderStyle.NONE, size: 0 },
    right: { style: BorderStyle.NONE, size: 0 },
    insideHorizontal: { style: BorderStyle.NONE, size: 0 },
    insideVertical: { style: BorderStyle.NONE, size: 0 },
  } as const;

  const docChildren: (Paragraph | Table)[] = [];

  // ==========================================
  // COVER PAGE
  // ==========================================

  // Top blue bar - branding
  docChildren.push(createColorBar('STARTUP STUDIO', COLORS.primary, COLORS.white, 20, true));

  // Right-aligned classification
  docChildren.push(new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { before: 100 },
    children: [new TextRun({ text: 'DOCUMENTO RISERVATO E CONFIDENZIALE', size: 16, color: COLORS.primary, bold: true })]
  }));
  docChildren.push(new Paragraph({
    alignment: AlignmentType.RIGHT,
    children: [new TextRun({ text: `Ref. SS/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 9000) + 1000)}`, size: 16, color: COLORS.gray })]
  }));

  // Spacer
  for (let i = 0; i < 6; i++) {
    docChildren.push(new Paragraph({ children: [] }));
  }

  // Startup Name - large centered
  docChildren.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: input.nome.toUpperCase(), bold: true, size: 80, color: COLORS.primary, font: 'Calibri' })]
  }));

  docChildren.push(new Paragraph({ children: [] }));

  // Accent line
  docChildren.push(new Table({
    width: { size: 30, type: WidthType.PERCENTAGE },
    borders: noBorders,
    rows: [new TableRow({
      children: [new TableCell({
        shading: { fill: COLORS.accent, type: ShadingType.CLEAR },
        width: { size: 100, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: ' ', size: 4 })] })]
      })]
    })]
  }));

  docChildren.push(new Paragraph({ children: [] }));

  // Subtitle
  docChildren.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Proposta di Partnership Strategica', size: 36, color: COLORS.dark, font: 'Calibri' })]
  }));
  docChildren.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: 'e Investimento Manageriale', size: 36, color: COLORS.dark, font: 'Calibri' })]
  }));

  docChildren.push(new Paragraph({ children: [] }));

  // Verdetto badge
  const verdettoBg = result.verdetto === 'GO' ? COLORS.success : COLORS.warning;
  const verdettoText = result.verdetto === 'GO' ? 'VERDETTO: GO' : 'VERDETTO: PARK';
  docChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [] }));
  docChildren.push(new Table({
    width: { size: 40, type: WidthType.PERCENTAGE },
    borders: noBorders,
    rows: [new TableRow({
      children: [new TableCell({
        shading: { fill: verdettoBg, type: ShadingType.CLEAR },
        width: { size: 100, type: WidthType.PERCENTAGE },
        margins: { top: convertInchesToTwip(0.08), bottom: convertInchesToTwip(0.08), left: convertInchesToTwip(0.3), right: convertInchesToTwip(0.3) },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: verdettoText, bold: true, size: 24, color: COLORS.white })]
        })]
      })]
    })]
  }));

  // Spacer
  for (let i = 0; i < 5; i++) {
    docChildren.push(new Paragraph({ children: [] }));
  }

  // Bottom info block
  docChildren.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Preparato da Startup Studio', size: 20, color: COLORS.gray })]
  }));
  docChildren.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: dateFormatted, size: 20, color: COLORS.gray })]
  }));

  docChildren.push(new Paragraph({ children: [] }));

  // Bottom accent bar
  docChildren.push(createColorBar(
    'Questo documento contiene informazioni riservate destinate esclusivamente ai destinatari indicati.',
    COLORS.primaryDark, COLORS.white, 14, false
  ));

  // Page break
  docChildren.push(new Paragraph({ children: [new PageBreak()] }));

  // ==========================================
  // DISCLAIMER PAGE
  // ==========================================

  docChildren.push(new Paragraph({
    spacing: { before: 400, after: 300 },
    children: [new TextRun({ text: 'Avvertenze e Disclaimer', bold: true, size: 32, color: COLORS.primary })]
  }));

  docChildren.push(new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.primary } },
    spacing: { after: 300 },
    children: []
  }));

  const disclaimerTexts = [
    'Il presente documento e\' strettamente confidenziale e destinato esclusivamente ai soggetti espressamente autorizzati alla sua consultazione. La riproduzione, distribuzione o divulgazione, anche parziale, a terzi non autorizzati e\' vietata.',
    'Le informazioni, le analisi e le proiezioni contenute nel presente documento sono state elaborate sulla base dei dati forniti dai fondatori e di stime di mercato disponibili al momento della redazione. Startup Studio non garantisce la completezza, l\'accuratezza o l\'attualita\' di tali informazioni.',
    'Le proiezioni finanziarie e le valutazioni espresse hanno carattere puramente indicativo e non costituiscono in alcun modo una promessa di rendimento o una garanzia di risultato. I risultati effettivi potrebbero differire significativamente dalle previsioni.',
    'Il presente documento non costituisce un\'offerta al pubblico, una sollecitazione all\'investimento o una consulenza finanziaria, legale o fiscale. Si raccomanda ai destinatari di avvalersi dei propri consulenti professionali prima di assumere qualsiasi decisione di investimento.',
    'Startup Studio declina ogni responsabilita\' per eventuali danni diretti o indiretti derivanti dall\'uso delle informazioni contenute nel presente documento.',
  ];

  disclaimerTexts.forEach((text) => {
    docChildren.push(new Paragraph({
      spacing: { after: 200 },
      children: [new TextRun({ text, size: 20, color: COLORS.gray, italics: true })]
    }));
  });

  docChildren.push(new Paragraph({ children: [new PageBreak()] }));

  // ==========================================
  // KPI SUMMARY PAGE
  // ==========================================

  docChildren.push(...createSectionTitle('Panoramica Progetto'));

  // KPI Grid - 2 columns x 3 rows
  const faseLabel = input.fase === 'idea' ? 'Idea' : input.fase === 'mvp' ? 'MVP' : input.fase === 'prodotto-live' ? 'Prodotto Live' : 'Revenue';
  const businessModel = BUSINESS_MODEL_LABELS[input.businessModel]?.label || input.businessModel;

  const kpiRows = [
    new TableRow({
      children: [
        createMetricCell('Startup', input.nome, COLORS.lightGray),
        createMetricCell('Settore', settore?.label || input.verticale, COLORS.white),
      ]
    }),
    new TableRow({
      children: [
        createMetricCell('Fase', faseLabel, COLORS.white),
        createMetricCell('Business Model', businessModel, COLORS.lightGray),
      ]
    }),
    new TableRow({
      children: [
        createMetricCell('MRR Attuale', `EUR ${(input.mrrCurrent || 0).toLocaleString('it-IT')}`, COLORS.lightGray),
        createMetricCell('Clienti', String(input.customersCount || 0), COLORS.white),
      ]
    }),
    new TableRow({
      children: [
        createMetricCell('Verdetto', `${result.verdetto} - ${result.verdettoLabel}`, verdettoBg),
        createMetricCell('Filtri Superati', `${result.filtersScore?.passedCount || 0}/5`, COLORS.lightGray),
      ]
    }),
  ];

  docChildren.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
    },
    rows: kpiRows,
  }));

  docChildren.push(new Paragraph({ children: [] }));
  docChildren.push(new Paragraph({ children: [] }));

  // Strengths & Weaknesses boxes
  if (result.strengths && result.strengths.length > 0) {
    docChildren.push(createColorBar('Punti di Forza', COLORS.success, COLORS.white, 20, true));
    docChildren.push(new Paragraph({ spacing: { after: 80 }, children: [] }));
    result.strengths.forEach(s => {
      docChildren.push(new Paragraph({
        bullet: { level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: s, size: 22, color: COLORS.dark })]
      }));
    });
    docChildren.push(new Paragraph({ children: [] }));
  }

  if (result.weaknesses && result.weaknesses.length > 0) {
    docChildren.push(createColorBar('Aree di Miglioramento', COLORS.warning, COLORS.dark, 20, true));
    docChildren.push(new Paragraph({ spacing: { after: 80 }, children: [] }));
    result.weaknesses.forEach(w => {
      docChildren.push(new Paragraph({
        bullet: { level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: w, size: 22, color: COLORS.dark })]
      }));
    });
  }

  docChildren.push(new Paragraph({ children: [new PageBreak()] }));

  // ==========================================
  // TABLE OF CONTENTS
  // ==========================================

  docChildren.push(...createSectionTitle('Indice'));

  const tocItems = sections.map((s, idx) => `${idx + 1}. ${stripEmoji(s.title).replace(/^\d+\.\s*/, '')}`);

  tocItems.forEach((item) => {
    docChildren.push(new Paragraph({
      spacing: { after: 160 },
      indent: { left: convertInchesToTwip(0.2) },
      children: [
        new TextRun({ text: item, size: 22, color: COLORS.dark }),
      ]
    }));
  });

  docChildren.push(new Paragraph({ children: [new PageBreak()] }));

  // ==========================================
  // CONTENT SECTIONS
  // ==========================================
  
  for (const section of sections) {
    // Section title bar
    docChildren.push(...createSectionTitle(section.title));

    // Parse content (strip emoji from AI-generated text)
    const contentParagraphs = parseMarkdownToDocx(stripEmoji(section.content));
    docChildren.push(...contentParagraphs);

    // Page break after section
    docChildren.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // ==========================================
  // CLOSING PAGE
  // ==========================================

  for (let i = 0; i < 6; i++) {
    docChildren.push(new Paragraph({ children: [] }));
  }

  docChildren.push(createColorBar('STARTUP STUDIO', COLORS.primary, COLORS.white, 28, true));
  docChildren.push(new Paragraph({ children: [] }));

  docChildren.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400 },
    children: [new TextRun({ text: 'Grazie per l\'attenzione.', size: 28, color: COLORS.dark, italics: true })]
  }));

  docChildren.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 400 },
    children: [new TextRun({ text: 'Restiamo a disposizione per qualsiasi approfondimento.', size: 22, color: COLORS.gray })]
  }));

  docChildren.push(new Paragraph({ children: [] }));
  docChildren.push(new Paragraph({ children: [] }));

  docChildren.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Contatti:', bold: true, size: 22, color: COLORS.dark })]
  }));
  docChildren.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'team@startupstudio.com', size: 22, color: COLORS.primary })]
  }));

  docChildren.push(new Paragraph({ children: [] }));
  docChildren.push(new Paragraph({ children: [] }));
  docChildren.push(new Paragraph({ children: [] }));

  docChildren.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    shading: { fill: COLORS.lightGray, type: ShadingType.CLEAR },
    spacing: { before: 200 },
    children: [new TextRun({
      text: `${input.nome} - Proposta di Partnership Strategica | ${dateFormatted} | RISERVATO`,
      size: 16, color: COLORS.gray
    })]
  }));

  // ==========================================
  // CREATE DOCUMENT
  // ==========================================

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22,
          },
          paragraph: {
            spacing: { line: 276 }, // 1.15 line spacing
          }
        }
      },
      paragraphStyles: [
        {
          id: 'Normal',
          name: 'Normal',
          run: { font: 'Calibri', size: 22, color: COLORS.dark },
          paragraph: { spacing: { line: 276, after: 120 } },
        },
      ],
    },
    numbering: {
      config: [{
        reference: 'numbered-list',
        levels: [{
          level: 0,
          format: NumberFormat.DECIMAL,
          text: '%1.',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) } } }
        }]
      }]
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.8),
            bottom: convertInchesToTwip(0.8),
            left: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
          }
        }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.primary } },
              spacing: { after: 100 },
              children: [
                new TextRun({ text: 'Startup Studio', bold: true, size: 16, color: COLORS.primary }),
                new TextRun({ text: `  |  ${input.nome} - Proposta di Partnership Strategica`, size: 16, color: COLORS.gray }),
                new TextRun({ text: '  |  RISERVATO', size: 16, color: COLORS.primary, bold: true }),
              ]
            }),
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              border: { top: { style: BorderStyle.SINGLE, size: 3, color: COLORS.primary } },
              spacing: { before: 100 },
              children: [
                new TextRun({ text: 'Startup Studio  |  ', size: 16, color: COLORS.gray, bold: true }),
                new TextRun({ text: 'Pagina ', size: 16, color: COLORS.gray }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, color: COLORS.gray }),
                new TextRun({ text: ' di ', size: 16, color: COLORS.gray }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: COLORS.gray }),
                new TextRun({ text: `  |  ${dateFormatted}  |  `, size: 16, color: COLORS.gray }),
                new TextRun({ text: 'DOCUMENTO RISERVATO', size: 16, color: COLORS.primary, bold: true }),
              ]
            })
          ]
        })
      },
      children: docChildren
    }]
  });

  // Generate and download
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${input.nome.replace(/\s+/g, '_')}_Proposta_Partnership_Strategica_RISERVATO.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
