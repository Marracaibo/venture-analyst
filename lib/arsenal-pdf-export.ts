import jsPDF from 'jspdf';
import { ARSENAL_ITEMS, ArsenalItemId } from './arsenal-types';

interface ExportOptions {
  itemId: ArsenalItemId;
  content: string;
  ideaTitle: string;
}

// Map of item IDs to simple text icons (no emoji)
const ITEM_ICONS: Record<string, string> = {
  'pitch-deck': '[PITCH]',
  'business-plan': '[PLAN]',
  'financial-model': '[FIN]',
  'executive-summary': '[EXEC]',
  'competitor-analysis': '[COMP]',
  'market-research': '[MKT]',
  'roadmap': '[ROAD]',
  'legal-pack': '[LEGAL]',
  'investor-deck': '[INV]',
  'one-pager': '[1P]',
  'landing-page': '[WEB]',
  'email-sequence': '[EMAIL]',
  'linkedin-strategy': '[LI]',
  'cold-outreach': '[OUT]',
  'partnership-proposal': '[PART]',
  'pricing-strategy': '[PRICE]',
  'unit-economics': '[UNIT]',
  'cap-table': '[CAP]',
  'funding-timeline': '[FUND]',
  'investor-qa': '[Q&A]',
  'mvp-spec': '[MVP]',
  'user-interview': '[USER]',
  'ab-testing': '[A/B]',
  'metrics-dashboard': '[DASH]',
  'growth-hacks': '[GROW]'
};

// Clean content from markdown artifacts and emoji - keep only ASCII printable chars
function cleanContent(text: string): string {
  // Remove markdown bold/italic markers
  let cleaned = text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1');
  
  // Remove emoji and non-printable characters by keeping only safe ASCII range
  let result = '';
  for (let i = 0; i < cleaned.length; i++) {
    const code = cleaned.charCodeAt(i);
    // Keep ASCII printable (32-126), newlines, tabs
    if ((code >= 32 && code <= 126) || code === 10 || code === 13 || code === 9) {
      result += cleaned[i];
    } else if (code >= 192 && code <= 687) {
      // Keep extended Latin characters (accented letters like è, à, ü, etc.)
      result += cleaned[i];
    }
    // Everything else (emoji, special symbols) gets removed
  }
  
  return result.replace(/\s+/g, ' ').trim();
}

// Parse markdown content into structured sections
function parseMarkdownSections(content: string): { title: string; content: string; level: number }[] {
  const sections: { title: string; content: string; level: number }[] = [];
  const lines = content.split('\n');
  let currentSection: { title: string; content: string; level: number } | null = null;
  const seenTitles = new Set<string>();

  for (const line of lines) {
    // Only match headers at START of line with proper spacing (H1-H4)
    const h1Match = line.match(/^#\s+(.+)$/);
    const h2Match = line.match(/^##\s+(.+)$/);
    const h3Match = line.match(/^###\s+(.+)$/);
    const h4Match = line.match(/^####\s+(.+)$/);

    if (h1Match || h2Match || h3Match || h4Match) {
      const rawTitle = (h4Match?.[1] || h3Match?.[1] || h2Match?.[1] || h1Match?.[1] || '').trim();
      const cleanTitle = cleanContent(rawTitle);
      
      // Skip duplicate titles and empty titles
      if (!cleanTitle || seenTitles.has(cleanTitle.toLowerCase())) {
        continue;
      }
      
      if (currentSection) {
        sections.push(currentSection);
      }
      
      seenTitles.add(cleanTitle.toLowerCase());
      // Determine level: H4 match must be checked first (most specific)
      const level = h4Match ? 4 : h3Match ? 3 : h2Match ? 2 : 1;
      currentSection = {
        title: cleanTitle,
        content: '',
        level
      };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
    // Skip content before first header (level 0) - it's usually duplicate intro
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  // Safety limit: max 50 sections
  return sections.slice(0, 50);
}

// Parse table from markdown
function parseTable(tableText: string): { headers: string[]; rows: string[][] } | null {
  const lines = tableText.trim().split('\n').filter(l => l.trim().startsWith('|'));
  if (lines.length < 2) return null;

  const parseRow = (line: string): string[] => {
    return line.split('|')
      .map(cell => cleanContent(cell.trim()))
      .filter(cell => cell !== '');
  };

  const headers = parseRow(lines[0]);
  const rows: string[][] = [];

  for (let i = 1; i < lines.length; i++) {
    // Skip separator row
    if (lines[i].replace(/[\|\-\:\s]/g, '') === '') continue;
    rows.push(parseRow(lines[i]));
  }

  return { headers, rows };
}

// Color palette
const COLORS = {
  primary: [139, 92, 246] as [number, number, number],      // Purple
  secondary: [59, 130, 246] as [number, number, number],    // Blue
  accent: [34, 197, 94] as [number, number, number],        // Green
  warning: [234, 179, 8] as [number, number, number],       // Yellow
  danger: [239, 68, 68] as [number, number, number],        // Red
  dark: [30, 30, 35] as [number, number, number],           // Background
  light: [250, 250, 250] as [number, number, number],       // Text
  muted: [113, 113, 122] as [number, number, number],       // Muted text
  surface: [45, 45, 50] as [number, number, number],        // Surface
  white: [255, 255, 255] as [number, number, number],       // White
  tableHeader: [100, 70, 180] as [number, number, number],  // Table header
  tableRow1: [248, 248, 252] as [number, number, number],   // Table row alt 1
  tableRow2: [240, 240, 248] as [number, number, number],   // Table row alt 2
};

// Render a table in PDF - IMPROVED for readability
function renderTable(
  pdf: jsPDF, 
  tableData: { headers: string[]; rows: string[][] },
  margin: number,
  contentWidth: number,
  yPosition: number,
  checkNewPage: (space: number) => boolean
): number {
  const colCount = tableData.headers.length;
  // Dynamic column width based on content
  const colWidth = Math.min(contentWidth / colCount, 45);
  const actualTableWidth = colWidth * colCount;
  const rowHeight = 10; // Increased from 8
  const cellPadding = 3; // Increased from 2

  // Header row with rounded corners
  checkNewPage(rowHeight + 10);
  pdf.setFillColor(...COLORS.primary);
  pdf.roundedRect(margin, yPosition, actualTableWidth, rowHeight, 2, 2, 'F');
  pdf.setFontSize(9);
  pdf.setTextColor(...COLORS.white);
  
  for (let i = 0; i < tableData.headers.length; i++) {
    const cellX = margin + (i * colWidth) + cellPadding;
    const headerText = tableData.headers[i].substring(0, 18);
    pdf.text(headerText, cellX, yPosition + 6.5);
  }
  yPosition += rowHeight;

  // Data rows with better styling
  pdf.setFontSize(9);
  for (let rowIdx = 0; rowIdx < tableData.rows.length; rowIdx++) {
    checkNewPage(rowHeight);
    
    // Alternating row colors with subtle difference
    const rowColor = rowIdx % 2 === 0 ? COLORS.tableRow1 : COLORS.tableRow2;
    pdf.setFillColor(...rowColor);
    pdf.rect(margin, yPosition, actualTableWidth, rowHeight, 'F');
    
    const row = tableData.rows[rowIdx];
    for (let i = 0; i < row.length && i < colCount; i++) {
      const cellX = margin + (i * colWidth) + cellPadding;
      let cellText = row[i].substring(0, 20);
      
      // Highlight numbers and percentages
      if (/^[€$]?[\d,.]+[%KMB]?$/.test(cellText.trim())) {
        pdf.setTextColor(...COLORS.primary);
        pdf.setFont('helvetica', 'bold');
      } else if (cellText.includes('OK') || cellText.includes('Sano')) {
        pdf.setTextColor(...COLORS.accent);
      } else if (cellText.includes('Warning') || cellText.includes('Rischioso')) {
        pdf.setTextColor(...COLORS.warning);
      } else if (cellText.includes('Risk') || cellText.includes('Insostenibile')) {
        pdf.setTextColor(...COLORS.danger);
      } else {
        pdf.setTextColor(50, 50, 50);
        pdf.setFont('helvetica', 'normal');
      }
      
      pdf.text(cellText, cellX, yPosition + 6.5);
      pdf.setFont('helvetica', 'normal');
    }
    yPosition += rowHeight;
  }

  // Draw subtle border around table
  pdf.setDrawColor(180, 180, 190);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(margin, yPosition - (tableData.rows.length + 1) * rowHeight, actualTableWidth, (tableData.rows.length + 1) * rowHeight, 2, 2, 'S');
  
  return yPosition + 8; // More space after table
}

export function generateArsenalPDF({ itemId, content, ideaTitle }: ExportOptions): void {
  const item = ARSENAL_ITEMS.find(i => i.id === itemId);
  if (!item) return;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 25;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Parse sections first to build TOC (skip level 0 - content before first header)
  const sections = parseMarkdownSections(content);
  const mainSections = sections.filter(s => s.level === 1 || s.level === 2);

  // Helper function to add new page if needed
  // Reserve 25mm at bottom for footer (line at -15, text at -10)
  const FOOTER_SPACE = 25;
  const checkNewPage = (requiredSpace: number = 30): boolean => {
    if (yPosition + requiredSpace > pageHeight - FOOTER_SPACE) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  const date = new Date().toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const cleanIdeaTitle = cleanContent(ideaTitle).substring(0, 60);

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  
  // Full page gradient background
  pdf.setFillColor(...COLORS.dark);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Decorative elements
  pdf.setFillColor(...COLORS.primary);
  pdf.rect(0, 0, 8, pageHeight, 'F');
  pdf.setFillColor(...COLORS.secondary);
  pdf.rect(0, pageHeight - 60, pageWidth, 60, 'F');
  
  // Document type badge
  pdf.setFillColor(...COLORS.primary);
  pdf.roundedRect(margin + 10, 50, 120, 12, 3, 3, 'F');
  pdf.setFontSize(10);
  pdf.setTextColor(...COLORS.white);
  pdf.text('STARTUP ARSENAL DOCUMENT', margin + 20, 58);
  
  // Main title
  pdf.setFontSize(32);
  pdf.setTextColor(...COLORS.light);
  pdf.text(item.name.toUpperCase(), margin + 10, 100);
  
  // Subtitle line
  pdf.setFillColor(...COLORS.accent);
  pdf.rect(margin + 10, 110, 60, 2, 'F');
  
  // Project name
  pdf.setFontSize(16);
  pdf.setTextColor(...COLORS.muted);
  pdf.text('Documento generato per:', margin + 10, 135);
  pdf.setFontSize(20);
  pdf.setTextColor(...COLORS.light);
  const titleLines = pdf.splitTextToSize(cleanIdeaTitle, contentWidth - 20);
  pdf.text(titleLines, margin + 10, 150);
  
  // Description
  pdf.setFontSize(11);
  pdf.setTextColor(...COLORS.muted);
  const descLines = pdf.splitTextToSize(item.description, contentWidth - 20);
  pdf.text(descLines, margin + 10, 180);
  
  // Footer info on cover
  pdf.setFontSize(10);
  pdf.setTextColor(...COLORS.dark);
  pdf.text(`Data: ${date}`, margin + 10, pageHeight - 35);
  pdf.text(`Versione: 1.0`, margin + 10, pageHeight - 25);
  pdf.text('Generato da Virtual Venture Analyst', pageWidth - margin - 80, pageHeight - 25);

  // ==========================================
  // PAGE 2: TABLE OF CONTENTS
  // ==========================================
  pdf.addPage();
  yPosition = margin;
  
  // TOC Header
  pdf.setFillColor(...COLORS.primary);
  pdf.roundedRect(margin, yPosition, contentWidth, 15, 3, 3, 'F');
  pdf.setFontSize(14);
  pdf.setTextColor(...COLORS.white);
  pdf.text('INDICE DEI CONTENUTI', margin + 10, yPosition + 10);
  yPosition += 25;
  
  // TOC entries
  pdf.setFontSize(11);
  let tocIndex = 1;
  for (const section of mainSections) {
    if (!section.title) continue;
    
    const indent = section.level === 2 ? 10 : 0;
    const prefix = section.level === 1 ? `${tocIndex}.` : '  -';
    
    if (section.level === 1) {
      pdf.setTextColor(...COLORS.dark);
      pdf.setFont('helvetica', 'bold');
      tocIndex++;
    } else {
      pdf.setTextColor(...COLORS.muted);
      pdf.setFont('helvetica', 'normal');
    }
    
    const tocText = `${prefix} ${section.title.substring(0, 60)}`;
    pdf.text(tocText, margin + indent, yPosition);
    
    // Dotted line
    const textWidth = pdf.getTextWidth(tocText);
    pdf.setDrawColor(...COLORS.muted);
    pdf.setLineDashPattern([1, 2], 0);
    pdf.line(margin + indent + textWidth + 5, yPosition - 1, contentWidth + margin - 15, yPosition - 1);
    pdf.setLineDashPattern([], 0);
    
    yPosition += 8;
    
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = margin;
    }
  }
  pdf.setFont('helvetica', 'normal');
  
  // ==========================================
  // PAGE 3: INTRODUCTION
  // ==========================================
  pdf.addPage();
  yPosition = margin;
  
  // Introduction header
  pdf.setFillColor(...COLORS.secondary);
  pdf.roundedRect(margin, yPosition, contentWidth, 15, 3, 3, 'F');
  pdf.setFontSize(14);
  pdf.setTextColor(...COLORS.white);
  pdf.text('INTRODUZIONE', margin + 10, yPosition + 10);
  yPosition += 25;
  
  // Introduction text
  pdf.setFontSize(11);
  pdf.setTextColor(50, 50, 50);
  
  const introText = `Questo documento presenta ${item.name.toLowerCase()} per il progetto "${cleanIdeaTitle}". ` +
    `Il contenuto e stato generato attraverso un'analisi approfondita del mercato, dei competitor e del modello di business proposto. ` +
    `\n\nL'obiettivo di questo documento e fornire una base solida per le decisioni strategiche, ` +
    `offrendo dati concreti, proiezioni realistiche e raccomandazioni pratiche. ` +
    `\n\nIl documento e strutturato in ${mainSections.filter(s => s.level === 1).length} sezioni principali, ` +
    `ciascuna dedicata a un aspetto specifico dell'analisi. Si consiglia di leggere il documento nella sua interezza ` +
    `per avere una visione completa del progetto.`;
  
  const introLines = pdf.splitTextToSize(introText, contentWidth);
  for (const line of introLines) {
    checkNewPage(8);
    pdf.text(line, margin, yPosition);
    yPosition += 7;
  }
  
  yPosition += 10;
  
  // Key info box
  checkNewPage(50);
  pdf.setFillColor(245, 247, 250);
  pdf.roundedRect(margin, yPosition, contentWidth, 40, 3, 3, 'F');
  pdf.setDrawColor(...COLORS.primary);
  pdf.roundedRect(margin, yPosition, contentWidth, 40, 3, 3, 'S');
  
  pdf.setFontSize(10);
  pdf.setTextColor(...COLORS.primary);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INFORMAZIONI DOCUMENTO', margin + 10, yPosition + 10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(60, 60, 60);
  pdf.text(`Tipo: ${item.name}`, margin + 10, yPosition + 20);
  pdf.text(`Progetto: ${cleanIdeaTitle.substring(0, 40)}`, margin + 10, yPosition + 28);
  pdf.text(`Data generazione: ${date}`, contentWidth - 30, yPosition + 20);
  pdf.text(`Sezioni: ${mainSections.filter(s => s.level === 1).length}`, contentWidth - 30, yPosition + 28);
  
  yPosition += 55;

  // ==========================================
  // CONTENT PAGES
  // ==========================================
  pdf.addPage();
  yPosition = margin;

  // If no sections parsed, just add content as-is (cleaned)
  if (sections.length === 0) {
    pdf.setFontSize(10);
    pdf.setTextColor(...COLORS.dark);
    const cleanedContent = cleanContent(content);
    const lines = pdf.splitTextToSize(cleanedContent, contentWidth);
    for (const line of lines) {
      checkNewPage(8);
      pdf.text(line, margin, yPosition);
      yPosition += 5;
    }
  } else {
    // Track if we're inside a table
    let tableLines: string[] = [];
    let inTable = false;
    let sectionNumber = 0;

    // Filter out level 0 sections and limit to max 20 main sections
    const contentSections = sections.filter(s => s.level > 0).slice(0, 30);
    const MAX_PAGES = 50; // Safety limit

    // Process each section
    for (const section of contentSections) {
      // Safety: stop if too many pages
      if (pdf.getNumberOfPages() > MAX_PAGES) {
        console.warn('[PDF] Max pages reached, stopping generation');
        break;
      }
      
      // For level 1 sections, start a new page (but not the first one - we already have a page)
      if (section.level === 1 && section.title && sectionNumber > 0) {
        pdf.addPage();
        yPosition = margin;
      }
      
      if (section.level === 1 && section.title) {
        sectionNumber++;
        
        // Page header for content pages
        pdf.setFillColor(250, 250, 252);
        pdf.rect(0, 0, pageWidth, 15, 'F');
        pdf.setFontSize(8);
        pdf.setTextColor(...COLORS.muted);
        pdf.text(item.name, margin, 10);
        pdf.text(cleanIdeaTitle.substring(0, 30), pageWidth - margin - 50, 10);
        pdf.setDrawColor(230, 230, 235);
        pdf.line(0, 15, pageWidth, 15);
        
        yPosition = 25;
      } else {
        checkNewPage(30);
      }

      // Section header (if has title)
      if (section.title) {
        const cleanTitle = cleanContent(section.title);
        
        if (section.level === 1) {
          // Main section - prominent header with number
          pdf.setFillColor(...COLORS.primary);
          pdf.roundedRect(margin, yPosition, contentWidth, 18, 3, 3, 'F');
          
          // Section number circle
          pdf.setFillColor(...COLORS.white);
          pdf.circle(margin + 12, yPosition + 9, 7, 'F');
          pdf.setFontSize(12);
          pdf.setTextColor(...COLORS.primary);
          pdf.text(String(sectionNumber), margin + 9.5, yPosition + 12);
          
          // Section title
          pdf.setFontSize(14);
          pdf.setTextColor(...COLORS.white);
          pdf.text(cleanTitle.substring(0, 55), margin + 25, yPosition + 12);
          yPosition += 28;
          
        } else if (section.level === 2) {
          // Sub-section - clean header with accent
          yPosition += 5;
          pdf.setFillColor(...COLORS.secondary);
          pdf.roundedRect(margin, yPosition, 4, 14, 1, 1, 'F');
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(...COLORS.dark);
          pdf.text(cleanTitle.substring(0, 65), margin + 10, yPosition + 10);
          pdf.setFont('helvetica', 'normal');
          yPosition += 20;
          
        } else if (section.level === 3) {
          // Sub-sub-section (H3) - subtle header with dot
          yPosition += 3;
          pdf.setFillColor(...COLORS.accent);
          pdf.circle(margin + 3, yPosition + 4, 2, 'F');
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(60, 60, 60);
          pdf.text(cleanTitle.substring(0, 70), margin + 10, yPosition + 6);
          pdf.setFont('helvetica', 'normal');
          yPosition += 14;
        } else {
          // H4 section - minimal header
          yPosition += 2;
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(80, 80, 80);
          pdf.text(cleanTitle.substring(0, 75), margin + 5, yPosition + 5);
          pdf.setFont('helvetica', 'normal');
          yPosition += 12;
        }
      }

      // Section content
      if (section.content.trim()) {
        pdf.setFontSize(10);
        pdf.setTextColor(60, 60, 60);

        // Limit content lines to prevent infinite loops
        const contentLines = section.content.trim().split('\n').slice(0, 500);
        let inCodeBlock = false;
        let codeBlockLines: string[] = [];
        let lineCount = 0;
        
        for (const line of contentLines) {
          // Safety: check page limit in content loop too
          if (pdf.getNumberOfPages() > MAX_PAGES || lineCount > 300) break;
          lineCount++;
          
          const trimmedLine = line.trim();
          
          // Handle code block start/end
          if (trimmedLine.startsWith('```')) {
            if (inCodeBlock) {
              // End of code block - render it
              if (codeBlockLines.length > 0) {
                checkNewPage(codeBlockLines.length * 5 + 10);
                
                // Draw code block background
                const codeHeight = codeBlockLines.length * 5 + 6;
                pdf.setFillColor(245, 245, 250);
                pdf.roundedRect(margin, yPosition - 2, contentWidth, codeHeight, 2, 2, 'F');
                pdf.setDrawColor(200, 200, 210);
                pdf.roundedRect(margin, yPosition - 2, contentWidth, codeHeight, 2, 2, 'S');
                
                // Render code lines
                pdf.setFontSize(8);
                pdf.setTextColor(80, 80, 100);
                for (const codeLine of codeBlockLines) {
                  const cleanCode = codeLine.substring(0, 80); // Limit line length
                  pdf.text(cleanCode, margin + 4, yPosition + 2);
                  yPosition += 5;
                }
                yPosition += 6;
                codeBlockLines = [];
              }
              inCodeBlock = false;
            } else {
              inCodeBlock = true;
            }
            continue;
          }
          
          // Collect code block lines
          if (inCodeBlock) {
            codeBlockLines.push(line);
            continue;
          }
          
          // Skip empty lines
          if (!trimmedLine) {
            if (inTable && tableLines.length > 0) {
              const tableText = tableLines.join('\n');
              const tableData = parseTable(tableText);
              if (tableData && tableData.rows.length > 0) {
                yPosition = renderTable(pdf, tableData, margin, contentWidth, yPosition, checkNewPage);
              }
              tableLines = [];
              inTable = false;
            }
            yPosition += 4; // Increased spacing
            continue;
          }

          // Handle table rows - check for lines containing | (table cells)
          const isTableRow = trimmedLine.startsWith('|') || 
            (trimmedLine.includes('|') && trimmedLine.split('|').length >= 3);
          
          if (isTableRow) {
            inTable = true;
            // Normalize: ensure line starts and ends with |
            let normalizedLine = trimmedLine;
            if (!normalizedLine.startsWith('|')) normalizedLine = '|' + normalizedLine;
            if (!normalizedLine.endsWith('|')) normalizedLine = normalizedLine + '|';
            tableLines.push(normalizedLine);
            continue;
          } else if (inTable && tableLines.length > 0) {
            const tableText = tableLines.join('\n');
            const tableData = parseTable(tableText);
            if (tableData && tableData.rows.length > 0) {
              yPosition = renderTable(pdf, tableData, margin, contentWidth, yPosition, checkNewPage);
            }
            tableLines = [];
            inTable = false;
          }

          checkNewPage(10);

          // Skip table separator rows that weren't caught
          if (/^[\|\-\:\s]+$/.test(trimmedLine) && trimmedLine.includes('-')) {
            continue; // Skip malformed table separators
          }
          
          // Skip horizontal rules
          if (trimmedLine === '---') {
            pdf.setDrawColor(...COLORS.muted);
            pdf.setLineWidth(0.3);
            pdf.line(margin, yPosition, margin + contentWidth, yPosition);
            yPosition += 6;
            continue;
          }

          // Handle blockquotes
          if (trimmedLine.startsWith('>')) {
            const quoteText = cleanContent(trimmedLine.substring(1).trim());
            
            // Draw quote bar
            pdf.setFillColor(...COLORS.secondary);
            pdf.rect(margin, yPosition - 3, 3, 12, 'F');
            
            // Draw quote background
            pdf.setFillColor(240, 245, 255);
            pdf.rect(margin + 3, yPosition - 3, contentWidth - 3, 12, 'F');
            
            pdf.setFontSize(10);
            pdf.setTextColor(60, 80, 120);
            pdf.setFont('helvetica', 'italic');
            const wrappedLines = pdf.splitTextToSize(quoteText, contentWidth - 12);
            pdf.text(wrappedLines[0] || '', margin + 8, yPosition + 3);
            pdf.setFont('helvetica', 'normal');
            yPosition += 14;
            continue;
          }

          // Handle bullet points
          if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
            const bulletText = cleanContent(trimmedLine.substring(2));
            
            if (bulletText.startsWith('[ ]') || bulletText.startsWith('[x]')) {
              const isChecked = bulletText.startsWith('[x]');
              const checkboxText = bulletText.substring(4);
              
              pdf.setDrawColor(...COLORS.muted);
              pdf.rect(margin + 2, yPosition - 3, 4, 4);
              if (isChecked) {
                pdf.setFillColor(...COLORS.accent);
                pdf.rect(margin + 3, yPosition - 2, 2, 2, 'F');
              }
              
              pdf.setTextColor(60, 60, 60);
              const wrappedLines = pdf.splitTextToSize(checkboxText, contentWidth - 14);
              for (let i = 0; i < wrappedLines.length; i++) {
                if (i > 0) checkNewPage(7);
                pdf.text(wrappedLines[i], margin + 10, yPosition);
                yPosition += 6;
              }
            } else {
              // Regular bullet with better styling
              pdf.setFillColor(...COLORS.primary);
              pdf.circle(margin + 3, yPosition - 1, 1.5, 'F');
              
              pdf.setTextColor(60, 60, 60);
              const wrappedLines = pdf.splitTextToSize(bulletText, contentWidth - 12);
              for (let i = 0; i < wrappedLines.length; i++) {
                if (i > 0) checkNewPage(7);
                pdf.text(wrappedLines[i], margin + 10, yPosition);
                yPosition += 6;
              }
            }
          } else if (trimmedLine.match(/^\d+\.\s/)) {
            // Numbered list with better styling
            const match = trimmedLine.match(/^(\d+)\.\s(.+)$/);
            if (match) {
              // Draw number circle
              pdf.setFillColor(...COLORS.secondary);
              pdf.circle(margin + 4, yPosition - 1, 3.5, 'F');
              pdf.setFontSize(8);
              pdf.setTextColor(...COLORS.white);
              pdf.text(match[1], margin + 2.5, yPosition + 0.5);
              
              pdf.setFontSize(10);
              pdf.setTextColor(60, 60, 60);
              
              const cleanedText = cleanContent(match[2]);
              const wrappedLines = pdf.splitTextToSize(cleanedText, contentWidth - 14);
              for (let i = 0; i < wrappedLines.length; i++) {
                if (i > 0) checkNewPage(7);
                pdf.text(wrappedLines[i], margin + 12, yPosition);
                yPosition += 6;
              }
            }
          } else {
            // Regular text with improved line height
            const cleanedLine = cleanContent(trimmedLine);
            if (cleanedLine) {
              pdf.setTextColor(60, 60, 60);
              const wrappedLines = pdf.splitTextToSize(cleanedLine, contentWidth);
              for (const wrappedLine of wrappedLines) {
                checkNewPage(7);
                pdf.text(wrappedLine, margin, yPosition);
                yPosition += 6; // Increased line height
              }
            }
          }
        }
        
        // Flush any pending table at end of section
        if (inTable && tableLines.length > 0) {
          const tableText = tableLines.join('\n');
          const tableData = parseTable(tableText);
          if (tableData && tableData.rows.length > 0) {
            yPosition = renderTable(pdf, tableData, margin, contentWidth, yPosition, checkNewPage);
          }
          tableLines = [];
          inTable = false;
        }
        
        yPosition += 8; // More space after section content
      }
    }
  }

  // Footer on each page
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    
    // Footer line
    pdf.setDrawColor(...COLORS.muted);
    pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    // Footer text
    pdf.setFontSize(8);
    pdf.setTextColor(...COLORS.muted);
    pdf.text('Startup Arsenal • Virtual Venture Analyst', margin, pageHeight - 10);
    pdf.text(`Pagina ${i} di ${totalPages}`, pageWidth - margin - 25, pageHeight - 10);
  }

  // Save
  const filename = `${itemId}-${ideaTitle.toLowerCase().replace(/\s+/g, '-').substring(0, 30)}.pdf`;
  pdf.save(filename);
}

// Generate HTML for better preview
export function generatePreviewHTML(content: string): string {
  // Step 1: Handle code blocks with ASCII art - render as styled boxes
  let processedContent = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, _lang, code) => {
    // Check if it's ASCII art (contains box drawing characters)
    const isAsciiArt = /[┌┐└┘│─═║╔╗╚╝├┤┬┴┼█░▓▒●○◆◇★☆✓✗→←↑↓]/.test(code);
    
    if (isAsciiArt) {
      // Render as a styled info box
      return `<div class="my-4 p-4 bg-gradient-to-br from-accent-purple/10 to-accent-cyan/10 border border-accent-purple/30 rounded-xl">
        <pre class="text-xs font-mono text-text-primary whitespace-pre overflow-x-auto leading-relaxed">${code}</pre>
      </div>`;
    }
    
    // Regular code block
    return `<pre class="bg-background p-4 rounded-lg overflow-x-auto my-4 border border-border-subtle"><code class="text-sm text-accent-green font-mono">${code}</code></pre>`;
  });

  // Step 2: Handle tables
  const tableRegex = /(\|.+\|[\r\n]+)+/g;
  processedContent = processedContent.replace(tableRegex, (tableBlock) => {
    const rows = tableBlock.trim().split('\n').filter(r => r.trim());
    if (rows.length < 2) return tableBlock;
    
    const isSeparator = (row: string) => row.split('|').filter(c => c.trim()).every(c => /^[-:]+$/.test(c.trim()));
    
    let html = '<div class="overflow-x-auto my-4"><table class="w-full border-collapse rounded-lg overflow-hidden text-sm">';
    let headerDone = false;
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (isSeparator(row)) {
        headerDone = true;
        continue;
      }
      
      const cells = row.split('|').filter(c => c !== '');
      const isHeaderRow = !headerDone && i === 0;
      const tag = isHeaderRow ? 'th' : 'td';
      const cellClass = isHeaderRow 
        ? 'bg-accent-purple/20 text-text-primary font-semibold px-3 py-2 text-left border-b border-accent-purple/30' 
        : 'bg-background-elevated/50 px-3 py-2 text-text-secondary border-b border-border-subtle';
      
      html += '<tr>';
      for (const cell of cells) {
        let cellContent = cell.trim()
          .replace(/\*\*(.+?)\*\*/g, '<strong class="text-text-primary">$1</strong>')
          .replace(/✅/g, '<span class="text-accent-green font-bold">✓</span>')
          .replace(/❌/g, '<span class="text-red-500 font-bold">✗</span>')
          .replace(/⚠️/g, '<span class="text-yellow-500">⚠</span>')
          .replace(/🔴/g, '<span class="inline-block w-2 h-2 rounded-full bg-red-500"></span>')
          .replace(/🟠/g, '<span class="inline-block w-2 h-2 rounded-full bg-orange-500"></span>')
          .replace(/🟡/g, '<span class="inline-block w-2 h-2 rounded-full bg-yellow-500"></span>')
          .replace(/🟢/g, '<span class="inline-block w-2 h-2 rounded-full bg-green-500"></span>');
        html += `<${tag} class="${cellClass}">${cellContent}</${tag}>`;
      }
      html += '</tr>';
      
      if (isHeaderRow) headerDone = true;
    }
    
    html += '</table></div>';
    return html;
  });

  // Step 3: Process rest of markdown
  let html = processedContent
    // Headers with better styling
    .replace(/^#### (.+)$/gm, '<h4 class="text-sm font-semibold text-text-primary mt-4 mb-2">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-accent-cyan mt-5 mb-2 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-accent-cyan"></span>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-accent-purple mt-6 mb-3 pb-2 border-b border-border-subtle">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-text-primary mt-8 mb-4 pb-2 border-b-2 border-accent-purple">$1</h1>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-accent-purple pl-4 my-4 text-text-secondary italic">$1</blockquote>')
    // Bold and italic
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>')
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em class="text-text-secondary italic">$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-background px-1.5 py-0.5 rounded text-accent-cyan text-sm font-mono">$1</code>')
    // Checkboxes
    .replace(/- \[ \] (.+)/g, '<div class="flex items-start gap-3 my-1.5"><span class="w-4 h-4 mt-0.5 border-2 border-border-strong rounded flex-shrink-0"></span><span class="text-text-secondary">$1</span></div>')
    .replace(/- \[x\] (.+)/gi, '<div class="flex items-start gap-3 my-1.5"><span class="w-4 h-4 mt-0.5 bg-accent-green rounded flex items-center justify-center flex-shrink-0 text-white text-xs">✓</span><span class="text-text-primary">$1</span></div>')
    // Bullet points
    .replace(/^- (.+)$/gm, '<div class="flex items-start gap-3 my-1.5 ml-2"><span class="w-1.5 h-1.5 mt-2 rounded-full bg-accent-purple flex-shrink-0"></span><span class="text-text-secondary">$1</span></div>')
    .replace(/^\* (.+)$/gm, '<div class="flex items-start gap-3 my-1.5 ml-2"><span class="w-1.5 h-1.5 mt-2 rounded-full bg-accent-purple flex-shrink-0"></span><span class="text-text-secondary">$1</span></div>')
    // Numbered lists
    .replace(/^(\d+)\. (.+)$/gm, '<div class="flex items-start gap-3 my-1.5"><span class="w-6 h-6 rounded-full bg-accent-purple/20 text-accent-purple text-xs font-bold flex items-center justify-center flex-shrink-0">$1</span><span class="text-text-secondary">$2</span></div>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="my-6 border-border-subtle">')
    // Status indicators
    .replace(/✅/g, '<span class="text-accent-green font-bold">✓</span>')
    .replace(/❌/g, '<span class="text-red-500 font-bold">✗</span>')
    .replace(/⚠️/g, '<span class="text-yellow-500">⚠</span>')
    // Line breaks - be more careful
    .replace(/\n\n+/g, '</p><p class="my-3 text-text-secondary">')
    .replace(/\n/g, '<br>');

  return `<div class="prose-custom text-text-secondary">${html}</div>`;
}
