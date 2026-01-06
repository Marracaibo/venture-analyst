import jsPDF from 'jspdf';
import { ARSENAL_ITEMS, ArsenalItemId } from './arsenal-types';

interface ExportOptions {
  itemId: ArsenalItemId;
  content: string;
  ideaTitle: string;
}

// Parse markdown content into structured sections
function parseMarkdownSections(content: string): { title: string; content: string; level: number }[] {
  const sections: { title: string; content: string; level: number }[] = [];
  const lines = content.split('\n');
  let currentSection: { title: string; content: string; level: number } | null = null;

  for (const line of lines) {
    const h1Match = line.match(/^# (.+)$/);
    const h2Match = line.match(/^## (.+)$/);
    const h3Match = line.match(/^### (.+)$/);

    if (h1Match || h2Match || h3Match) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: (h1Match?.[1] || h2Match?.[1] || h3Match?.[1] || '').trim(),
        content: '',
        level: h1Match ? 1 : h2Match ? 2 : 3
      };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

// Color palette
const COLORS = {
  primary: [139, 92, 246] as [number, number, number],      // Purple
  secondary: [59, 130, 246] as [number, number, number],    // Blue
  accent: [34, 197, 94] as [number, number, number],        // Green
  warning: [234, 179, 8] as [number, number, number],       // Yellow
  danger: [239, 68, 68] as [number, number, number],        // Red
  dark: [10, 10, 11] as [number, number, number],           // Background
  light: [250, 250, 250] as [number, number, number],       // Text
  muted: [113, 113, 122] as [number, number, number],       // Muted text
  surface: [31, 31, 35] as [number, number, number],        // Surface
};

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
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkNewPage = (requiredSpace: number = 30) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Draw header background
  pdf.setFillColor(...COLORS.dark);
  pdf.rect(0, 0, pageWidth, 50, 'F');

  // Gradient accent line
  pdf.setFillColor(...COLORS.primary);
  pdf.rect(0, 50, pageWidth * 0.6, 3, 'F');
  pdf.setFillColor(...COLORS.secondary);
  pdf.rect(pageWidth * 0.6, 50, pageWidth * 0.4, 3, 'F');

  // Header icon and title
  pdf.setFontSize(28);
  pdf.setTextColor(...COLORS.light);
  pdf.text(`${item.icon} ${item.name}`, margin, 30);

  // Subtitle
  pdf.setFontSize(11);
  pdf.setTextColor(...COLORS.muted);
  pdf.text(`Generato per: ${ideaTitle}`, margin, 40);

  // Date
  const date = new Date().toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  pdf.text(date, pageWidth - margin - pdf.getTextWidth(date), 40);

  yPosition = 65;

  // Parse sections
  const sections = parseMarkdownSections(content);

  // If no sections parsed, just add content as-is
  if (sections.length === 0) {
    pdf.setFontSize(10);
    pdf.setTextColor(...COLORS.dark);
    const lines = pdf.splitTextToSize(content, contentWidth);
    for (const line of lines) {
      checkNewPage(8);
      pdf.text(line, margin, yPosition);
      yPosition += 5;
    }
  } else {
    // Render sections with styling
    for (const section of sections) {
      checkNewPage(25);

      // Section header
      if (section.level === 1) {
        // Main section - full width colored bar
        pdf.setFillColor(...COLORS.primary);
        pdf.roundedRect(margin, yPosition - 5, contentWidth, 12, 2, 2, 'F');
        pdf.setFontSize(14);
        pdf.setTextColor(...COLORS.light);
        pdf.text(section.title, margin + 4, yPosition + 3);
        yPosition += 15;
      } else if (section.level === 2) {
        // Sub-section - accent line
        pdf.setFillColor(...COLORS.secondary);
        pdf.rect(margin, yPosition - 2, 4, 10, 'F');
        pdf.setFontSize(12);
        pdf.setTextColor(...COLORS.dark);
        pdf.text(section.title, margin + 8, yPosition + 4);
        yPosition += 14;
      } else {
        // Sub-sub-section - bullet style
        pdf.setFillColor(...COLORS.accent);
        pdf.circle(margin + 2, yPosition + 2, 2, 'F');
        pdf.setFontSize(11);
        pdf.setTextColor(...COLORS.dark);
        pdf.text(section.title, margin + 8, yPosition + 4);
        yPosition += 12;
      }

      // Section content
      if (section.content.trim()) {
        pdf.setFontSize(10);
        pdf.setTextColor(60, 60, 60);

        const contentLines = section.content.trim().split('\n');
        for (const line of contentLines) {
          if (!line.trim()) {
            yPosition += 3;
            continue;
          }

          checkNewPage(8);

          // Handle bullet points
          if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            const bulletText = line.trim().substring(2);
            
            // Check if it's a checkbox
            if (bulletText.startsWith('[ ]') || bulletText.startsWith('[x]')) {
              const isChecked = bulletText.startsWith('[x]');
              const checkboxText = bulletText.substring(4);
              
              // Draw checkbox
              pdf.setDrawColor(...COLORS.muted);
              pdf.rect(margin + 2, yPosition - 3, 4, 4);
              if (isChecked) {
                pdf.setFillColor(...COLORS.accent);
                pdf.rect(margin + 3, yPosition - 2, 2, 2, 'F');
              }
              
              const wrappedLines = pdf.splitTextToSize(checkboxText, contentWidth - 12);
              for (let i = 0; i < wrappedLines.length; i++) {
                if (i > 0) checkNewPage(6);
                pdf.text(wrappedLines[i], margin + 10, yPosition);
                yPosition += 5;
              }
            } else {
              // Regular bullet
              pdf.setFillColor(...COLORS.muted);
              pdf.circle(margin + 3, yPosition - 1, 1, 'F');
              
              const wrappedLines = pdf.splitTextToSize(bulletText, contentWidth - 10);
              for (let i = 0; i < wrappedLines.length; i++) {
                if (i > 0) checkNewPage(6);
                pdf.text(wrappedLines[i], margin + 8, yPosition);
                yPosition += 5;
              }
            }
          } else if (line.trim().match(/^\d+\.\s/)) {
            // Numbered list
            const match = line.trim().match(/^(\d+)\.\s(.+)$/);
            if (match) {
              pdf.setFontSize(9);
              pdf.setTextColor(...COLORS.primary);
              pdf.text(match[1] + '.', margin + 2, yPosition);
              pdf.setFontSize(10);
              pdf.setTextColor(60, 60, 60);
              
              const wrappedLines = pdf.splitTextToSize(match[2], contentWidth - 12);
              for (let i = 0; i < wrappedLines.length; i++) {
                if (i > 0) checkNewPage(6);
                pdf.text(wrappedLines[i], margin + 10, yPosition);
                yPosition += 5;
              }
            }
          } else if (line.trim().startsWith('|')) {
            // Table row - simplified rendering
            pdf.setFillColor(245, 245, 245);
            pdf.rect(margin, yPosition - 4, contentWidth, 7, 'F');
            pdf.setFontSize(8);
            pdf.text(line.trim().replace(/\|/g, '  |  ').substring(0, 100), margin + 2, yPosition);
            yPosition += 7;
          } else if (line.trim().startsWith('```')) {
            // Code block marker - skip
            continue;
          } else if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
            // Bold text
            pdf.setFontSize(10);
            pdf.setTextColor(...COLORS.dark);
            const boldText = line.trim().replace(/\*\*/g, '');
            pdf.text(boldText, margin, yPosition);
            yPosition += 6;
          } else {
            // Regular text
            const wrappedLines = pdf.splitTextToSize(line.trim(), contentWidth);
            for (const wrappedLine of wrappedLines) {
              checkNewPage(6);
              pdf.text(wrappedLine, margin, yPosition);
              yPosition += 5;
            }
          }
        }
        yPosition += 5;
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
  // First, handle tables separately
  const tableRegex = /(\|.+\|[\r\n]+)+/g;
  let processedContent = content.replace(tableRegex, (tableBlock) => {
    const rows = tableBlock.trim().split('\n').filter(r => r.trim());
    if (rows.length < 2) return tableBlock;
    
    // Check if second row is separator
    const isSeparator = (row: string) => row.split('|').filter(c => c.trim()).every(c => /^[-:]+$/.test(c.trim()));
    
    let html = '<div class="overflow-x-auto my-4"><table class="w-full border-collapse rounded-lg overflow-hidden">';
    let isHeader = true;
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (isSeparator(row)) {
        isHeader = false;
        continue;
      }
      
      const cells = row.split('|').filter(c => c !== '');
      const tag = isHeader && i === 0 ? 'th' : 'td';
      const cellClass = isHeader && i === 0 
        ? 'bg-accent-purple/20 text-text-primary font-semibold px-4 py-2 text-left text-sm border-b border-border-subtle' 
        : 'bg-background-elevated px-4 py-2 text-text-secondary text-sm border-b border-border-subtle';
      
      html += '<tr>';
      for (const cell of cells) {
        const cellContent = cell.trim()
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/✅|☑️/g, '<span class="text-accent-green">✓</span>')
          .replace(/❌|✗/g, '<span class="text-accent-red">✗</span>');
        html += `<${tag} class="${cellClass}">${cellContent}</${tag}>`;
      }
      html += '</tr>';
      
      if (i === 0) isHeader = false;
    }
    
    html += '</table></div>';
    return html;
  });

  // Then process the rest
  let html = processedContent
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-accent-cyan mt-4 mb-2 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-accent-cyan"></span>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-accent-purple mt-6 mb-3 pb-2 border-b border-border-subtle">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-text-primary mt-8 mb-4 pb-2 border-b-2 border-accent-purple">$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>')
    // Italic  
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em class="text-text-secondary italic">$1</em>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-background p-4 rounded-lg overflow-x-auto my-4 border border-border-subtle"><code class="text-sm text-accent-green font-mono">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-background px-1.5 py-0.5 rounded text-accent-cyan text-sm font-mono">$1</code>')
    // Checkboxes
    .replace(/- \[ \] (.+)/g, '<div class="flex items-start gap-3 my-1.5"><span class="w-4 h-4 mt-0.5 border-2 border-border-strong rounded flex-shrink-0"></span><span class="text-text-secondary">$1</span></div>')
    .replace(/- \[x\] (.+)/gi, '<div class="flex items-start gap-3 my-1.5"><span class="w-4 h-4 mt-0.5 bg-accent-green rounded flex items-center justify-center flex-shrink-0 text-white text-xs">✓</span><span class="text-text-primary">$1</span></div>')
    // Bullet points
    .replace(/^- (.+)$/gm, '<div class="flex items-start gap-3 my-1.5"><span class="w-1.5 h-1.5 mt-2 rounded-full bg-accent-purple flex-shrink-0"></span><span class="text-text-secondary">$1</span></div>')
    .replace(/^\* (.+)$/gm, '<div class="flex items-start gap-3 my-1.5"><span class="w-1.5 h-1.5 mt-2 rounded-full bg-accent-purple flex-shrink-0"></span><span class="text-text-secondary">$1</span></div>')
    // Numbered lists
    .replace(/^(\d+)\. (.+)$/gm, '<div class="flex items-start gap-3 my-1.5"><span class="w-6 h-6 rounded-full bg-accent-purple/20 text-accent-purple text-xs font-bold flex items-center justify-center flex-shrink-0">$1</span><span class="text-text-secondary">$2</span></div>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="my-6 border-border-subtle">')
    // Emoji highlights
    .replace(/🟢/g, '<span class="text-accent-green">🟢</span>')
    .replace(/🔴/g, '<span class="text-accent-red">🔴</span>')
    .replace(/🟡/g, '<span class="text-accent-yellow">🟡</span>')
    // Line breaks
    .replace(/\n\n/g, '</p><p class="my-3">')
    .replace(/\n/g, '<br>');

  return `<div class="prose-custom">${html}</div>`;
}
