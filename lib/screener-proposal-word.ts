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
            shading: { fill: COLORS.primary, type: ShadingType.SOLID },
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
            shading: { fill: idx % 2 === 0 ? COLORS.lightGray : COLORS.white, type: ShadingType.SOLID },
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
        shading: { fill: 'E8F0FE', type: ShadingType.SOLID },
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

export async function generateProposalWord(
  input: StartupInput,
  result: ScreenerResult,
  sections: ProposalSection[]
): Promise<void> {
  const settore = SETTORI_CONFIG.find(s => s.id === input.verticale);
  const date = new Date().toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
  const dateFormatted = date.charAt(0).toUpperCase() + date.slice(1);

  // Build document sections
  const docChildren: (Paragraph | Table)[] = [];

  // ==========================================
  // COVER PAGE
  // ==========================================
  
  // Spacer
  for (let i = 0; i < 8; i++) {
    docChildren.push(new Paragraph({ children: [] }));
  }

  // Startup Name
  docChildren.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({
      text: input.nome,
      bold: true,
      size: 72,
      color: COLORS.primary,
    })]
  }));

  docChildren.push(new Paragraph({ children: [] }));
  docChildren.push(new Paragraph({ children: [] }));

  // Subtitle
  docChildren.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({
      text: 'Proposta di Partnership',
      size: 40,
      color: COLORS.primary,
    })]
  }));
  docChildren.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({
      text: 'Strategica',
      size: 40,
      color: COLORS.primary,
    })]
  }));
  docChildren.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({
      text: 'e Investimento Manageriale',
      size: 40,
      color: COLORS.primary,
    })]
  }));

  docChildren.push(new Paragraph({ children: [] }));
  docChildren.push(new Paragraph({ children: [] }));

  // Tagline
  docChildren.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({
      text: 'Piano di Collaborazione per lo Sviluppo e la Crescita',
      size: 24,
      color: COLORS.gray,
    })]
  }));

  // Spacer
  for (let i = 0; i < 6; i++) {
    docChildren.push(new Paragraph({ children: [] }));
  }

  // Team Manageriale
  docChildren.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({
      text: 'Team Manageriale:',
      bold: true,
      size: 22,
      color: COLORS.dark,
    })]
  }));
  docChildren.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({
      text: '(CFO) • (CMO) • (CEO)',
      size: 22,
      color: COLORS.gray,
    })]
  }));

  // Spacer
  for (let i = 0; i < 4; i++) {
    docChildren.push(new Paragraph({ children: [] }));
  }

  // Date and Confidential
  docChildren.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({
      text: dateFormatted,
      size: 20,
      color: COLORS.gray,
    })]
  }));
  docChildren.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({
      text: 'CONFIDENZIALE',
      bold: true,
      size: 20,
      color: COLORS.primary,
    })]
  }));

  // Page break
  docChildren.push(new Paragraph({
    children: [new PageBreak()]
  }));

  // ==========================================
  // TABLE OF CONTENTS
  // ==========================================
  
  docChildren.push(new Paragraph({
    heading: HeadingLevel.TITLE,
    children: [new TextRun({
      text: 'Indice',
      bold: true,
      size: 48,
      color: COLORS.primary,
    })]
  }));

  // Underline
  docChildren.push(new Paragraph({
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 12, color: COLORS.primary }
    },
    children: []
  }));

  docChildren.push(new Paragraph({ children: [] }));
  docChildren.push(new Paragraph({ children: [] }));

  // TOC items
  const tocItems = [
    '1. Executive Summary',
    '2. Presentazione Team Manageriale',
    `3. Analisi ${input.nome}`,
    '4. Valutazione Aziendale Pre-Money',
    '5. OPZIONE A: Costituzione Societaria con Equity Immediata',
    '6. OPZIONE B: Work for Equity Progressivo',
    '7. Roadmap 24 Mesi e Milestones',
    '8. Strategia Go-to-Market',
    '9. Piano Fundraising',
    '10. Exit Strategy',
    '11. Servizi e Supporto Offerti dal Team Manageriale',
    '12. Termini e Condizioni',
    '13. Conclusioni e Call to Action',
  ];

  tocItems.forEach((item, idx) => {
    docChildren.push(new Paragraph({
      spacing: { after: 200 },
      tabStops: [{ type: 'right', position: convertInchesToTwip(6), leader: 'dot' }],
      children: [
        new TextRun({ text: item, size: 24, color: COLORS.dark }),
        new TextRun({ text: '\t' }),
        new TextRun({ text: String((idx + 1) * 4), size: 24, color: COLORS.gray }),
      ]
    }));
  });

  // Page break
  docChildren.push(new Paragraph({
    children: [new PageBreak()]
  }));

  // ==========================================
  // CONTENT SECTIONS
  // ==========================================
  
  for (const section of sections) {
    // Section Title
    docChildren.push(new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      children: [new TextRun({
        text: stripEmoji(section.title),
        bold: true,
        size: 36,
        color: COLORS.primary,
      })]
    }));

    // Underline
    docChildren.push(new Paragraph({
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.primary }
      },
      spacing: { after: 300 },
      children: []
    }));

    // Parse content (strip emoji from AI-generated text)
    const contentParagraphs = parseMarkdownToDocx(stripEmoji(section.content));
    docChildren.push(...contentParagraphs);

    // Page break after section
    docChildren.push(new Paragraph({
      children: [new PageBreak()]
    }));
  }

  // Create document
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22,
          }
        }
      }
    },
    numbering: {
      config: [{
        reference: 'numbered-list',
        levels: [{
          level: 0,
          format: NumberFormat.DECIMAL,
          text: '%1.',
          alignment: AlignmentType.LEFT,
        }]
      }]
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
          }
        }
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({
              text: `${input.nome} - Proposta di Partnership`,
              size: 18,
              color: COLORS.gray,
              italics: true,
            })]
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Pagina ',
                size: 18,
                color: COLORS.gray,
              }),
              new TextRun({
                children: [PageNumber.CURRENT],
                size: 18,
                color: COLORS.gray,
              }),
              new TextRun({
                text: ' di ',
                size: 18,
                color: COLORS.gray,
              }),
              new TextRun({
                children: [PageNumber.TOTAL_PAGES],
                size: 18,
                color: COLORS.gray,
              }),
              new TextRun({
                text: ` | ${dateFormatted} | CONFIDENZIALE`,
                size: 18,
                color: COLORS.gray,
              }),
            ]
          })]
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
  link.download = `${input.nome.replace(/\s+/g, '_')}_Proposta_Partnership_Strategica.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
