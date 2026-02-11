// Word Document Generator for Forge/WarRoom Investment Proposal
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
  convertInchesToTwip,
  VerticalAlign,
} from 'docx';
import { saveAs } from 'file-saver';
import { StartupIdea, AnalysisResult } from './types';

// Colori
const COLORS = {
  primary: '2962FF',
  primaryDark: '1A47B0',
  accent: '00BFA5',
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

// Parse markdown to docx elements
function parseMarkdownToDocx(content: string): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];
  const lines = content.split('\n');
  let inTable = false;
  let tableRows: string[][] = [];
  let tableHeaders: string[] = [];

  const flushTable = () => {
    if (tableHeaders.length > 0 || tableRows.length > 0) {
      const rows: TableRow[] = [];
      
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
      
      tableRows.forEach((row, idx) => {
        while (row.length < tableHeaders.length) {
          row.push('');
        }
        rows.push(new TableRow({
          children: row.slice(0, tableHeaders.length).map(cell => new TableCell({
            shading: idx % 2 === 0 ? { fill: COLORS.lightGray, type: ShadingType.SOLID } : undefined,
            width: { size: 100 / tableHeaders.length, type: WidthType.PERCENTAGE },
            children: [new Paragraph({
              children: [new TextRun({ 
                text: cell.trim(), 
                size: 20,
                color: COLORS.dark
              })]
            })],
            verticalAlign: VerticalAlign.CENTER,
          }))
        }));
      });

      if (rows.length > 0) {
        elements.push(new Paragraph({ children: [] }));
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
        elements.push(new Paragraph({ children: [] }));
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

    // Table detection
    if (trimmed.startsWith('|')) {
      if (trimmed.includes('---')) continue;
      
      const cells = trimmed.split('|').filter(c => c.trim()).map(c => c.replace(/\*\*/g, '').trim());
      
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
          text: trimmed.replace(/^####\s*/, ''), 
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
          text: trimmed.replace(/^###\s*/, ''), 
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
          text: trimmed.replace(/^##\s*/, ''), 
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
          text: trimmed.replace(/^#\s*/, ''), 
          bold: true,
          color: COLORS.dark,
          size: 32
        })]
      }));
    }
    // Bullet lists
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
    // Blockquotes
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
    if (match.index > lastIndex) {
      runs.push(new TextRun({ text: text.slice(lastIndex, match.index), size: 22 }));
    }
    runs.push(new TextRun({ text: match[1], bold: true, size: 22 }));
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    runs.push(new TextRun({ text: text.slice(lastIndex), size: 22 }));
  }

  if (runs.length === 0) {
    runs.push(new TextRun({ text, size: 22 }));
  }

  return runs;
}

// Create cover page
function createCoverPage(idea: StartupIdea, analysis: AnalysisResult): (Paragraph | Table)[] {
  const date = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
  
  return [
    new Paragraph({ children: [] }),
    new Paragraph({ children: [] }),
    new Paragraph({ children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({
        text: 'PROPOSTA DI',
        size: 28,
        color: COLORS.gray,
      })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({
        text: 'PARTNERSHIP STRATEGICA',
        size: 48,
        bold: true,
        color: COLORS.primary,
      })]
    }),
    new Paragraph({ children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
      children: [new TextRun({
        text: analysis.ideaTitle,
        size: 44,
        bold: true,
        color: COLORS.dark,
      })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200 },
      children: [new TextRun({
        text: analysis.ideaDescription.substring(0, 200) + (analysis.ideaDescription.length > 200 ? '...' : ''),
        size: 24,
        color: COLORS.gray,
        italics: true,
      })]
    }),
    new Paragraph({ children: [] }),
    new Paragraph({ children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 600 },
      shading: { 
        fill: analysis.verdict === 'green' ? COLORS.success : 
              analysis.verdict === 'yellow' ? COLORS.warning : 'EF4444',
        type: ShadingType.SOLID 
      },
      children: [new TextRun({
        text: `  VERDETTO: ${analysis.verdict === 'green' ? 'PROMETTENTE' : analysis.verdict === 'yellow' ? 'CAUTO' : 'PROBLEMATICO'}  `,
        size: 28,
        bold: true,
        color: COLORS.white,
      })]
    }),
    new Paragraph({ children: [] }),
    new Paragraph({ children: [] }),
    new Paragraph({ children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({
        text: date,
        size: 22,
        color: COLORS.gray,
      })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({
        text: 'CONFIDENZIALE',
        size: 20,
        color: COLORS.primary,
        bold: true,
      })]
    }),
    new Paragraph({
      children: [new PageBreak()]
    }),
  ];
}

// Main export function
export async function generateForgeProposalWord(
  idea: StartupIdea,
  analysis: AnalysisResult,
  sections: ProposalSection[]
): Promise<void> {
  const allElements: (Paragraph | Table)[] = [];

  // Cover page
  allElements.push(...createCoverPage(idea, analysis));

  // Table of Contents placeholder
  allElements.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: 'Indice', bold: true, size: 36, color: COLORS.dark })]
    }),
    new Paragraph({ children: [] })
  );

  sections.forEach((section, idx) => {
    allElements.push(new Paragraph({
      spacing: { after: 100 },
      children: [new TextRun({ 
        text: `${idx + 1}. ${section.title.replace(/^\d+\.\s*/, '')}`,
        size: 22 
      })]
    }));
  });

  allElements.push(new Paragraph({ children: [new PageBreak()] }));

  // Sections content
  for (const section of sections) {
    // Section title
    allElements.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 12, color: COLORS.primary }
        },
        children: [new TextRun({
          text: stripEmoji(section.title),
          bold: true,
          size: 32,
          color: COLORS.primary,
        })]
      })
    );

    // Section content (strip emoji from AI-generated text)
    const contentElements = parseMarkdownToDocx(stripEmoji(section.content));
    allElements.push(...contentElements);

    // Page break after each section
    allElements.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // Create document
  const doc = new Document({
    numbering: {
      config: [{
        reference: 'numbered-list',
        levels: [{
          level: 0,
          format: NumberFormat.DECIMAL,
          text: '%1.',
          alignment: AlignmentType.START,
          style: { paragraph: { indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) } } }
        }]
      }]
    },
    styles: {
      paragraphStyles: [
        {
          id: 'Normal',
          name: 'Normal',
          run: { font: 'Calibri', size: 22 },
        },
      ],
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
              text: `${analysis.ideaTitle} - Proposta Strategica`,
              size: 18,
              color: COLORS.gray,
            })]
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Pagina ', size: 18, color: COLORS.gray }),
              new TextRun({ children: [PageNumber.CURRENT], size: 18, color: COLORS.gray }),
              new TextRun({ text: ' | ', size: 18, color: COLORS.gray }),
              new TextRun({ 
                text: new Date().toLocaleDateString('it-IT', { month: 'long', year: 'numeric' }),
                size: 18, 
                color: COLORS.gray 
              }),
              new TextRun({ text: ' | CONFIDENZIALE', size: 18, color: COLORS.gray }),
            ]
          })]
        })
      },
      children: allElements,
    }]
  });

  // Generate and save
  const blob = await Packer.toBlob(doc);
  const filename = `${analysis.ideaTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Proposta_Investimento.docx`;
  saveAs(blob, filename);
}
