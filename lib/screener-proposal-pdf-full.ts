// Full Investment Proposal PDF Generator - EnoGen Style
import jsPDF from 'jspdf';
import { StartupInput, ScreenerResult, SETTORI_CONFIG, BUSINESS_MODEL_LABELS } from './screener-types';

// Colori
const COLORS = {
  primary: [41, 98, 255] as [number, number, number],      // Blu EnoGen
  primaryLight: [230, 240, 255] as [number, number, number],
  accent: [0, 150, 136] as [number, number, number],       // Teal
  dark: [26, 32, 44] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  gray: [113, 128, 150] as [number, number, number],
  lightGray: [247, 250, 252] as [number, number, number],
  success: [34, 197, 94] as [number, number, number],
  warning: [234, 179, 8] as [number, number, number],
};

interface ProposalSection {
  id: string;
  title: string;
  content: string;
}

export async function generateFullProposalPDF(
  input: StartupInput, 
  result: ScreenerResult,
  sections: ProposalSection[]
): Promise<void> {
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
  let currentPage = 1;

  const settore = SETTORI_CONFIG.find(s => s.id === input.verticale);

  // Helper functions
  const addNewPage = () => {
    pdf.addPage();
    currentPage++;
    yPosition = margin;
  };

  const checkNewPage = (requiredSpace: number = 30): boolean => {
    if (yPosition + requiredSpace > pageHeight - 25) {
      addNewPage();
      return true;
    }
    return false;
  };

  const addFooter = () => {
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(...COLORS.gray);
      pdf.text(`${i}/${totalPages}`, pageWidth - margin, pageHeight - 10);
    }
  };

  // ==========================================
  // COVER PAGE
  // ==========================================
  
  // Background gradient (simulated with rectangles)
  pdf.setFillColor(41, 98, 255);
  pdf.rect(0, 0, pageWidth, pageHeight * 0.7, 'F');
  
  // Gradient effect
  for (let i = 0; i < 50; i++) {
    const alpha = i / 50;
    const r = Math.round(41 + (100 - 41) * alpha);
    const g = Math.round(98 + (180 - 98) * alpha);
    const b = Math.round(255);
    pdf.setFillColor(r, g, b);
    pdf.rect(0, pageHeight * 0.7 * (i/50), pageWidth, pageHeight * 0.7 / 50, 'F');
  }
  
  // White bottom
  pdf.setFillColor(...COLORS.white);
  pdf.rect(0, pageHeight * 0.7, pageWidth, pageHeight * 0.3, 'F');
  
  // Startup Name - Main Title
  pdf.setFontSize(42);
  pdf.setTextColor(...COLORS.white);
  pdf.setFont('helvetica', 'bold');
  pdf.text(input.nome, pageWidth / 2, 80, { align: 'center' });
  
  // Subtitle
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Proposta di Partnership', pageWidth / 2, 100, { align: 'center' });
  pdf.text('Strategica', pageWidth / 2, 112, { align: 'center' });
  pdf.text('e Investimento Manageriale', pageWidth / 2, 124, { align: 'center' });
  
  // Tagline
  pdf.setFontSize(12);
  pdf.text('Piano di Collaborazione per lo Sviluppo e la Crescita', pageWidth / 2, 145, { align: 'center' });
  
  // Team Manageriale
  pdf.setFontSize(11);
  pdf.setTextColor(...COLORS.dark);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Team Manageriale:', pageWidth / 2, pageHeight * 0.75, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.text('(CFO) • (CMO) • (CEO)', pageWidth / 2, pageHeight * 0.75 + 8, { align: 'center' });
  
  // Date and Confidential
  const date = new Date().toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
  pdf.setFontSize(10);
  pdf.setTextColor(...COLORS.gray);
  pdf.text(date.charAt(0).toUpperCase() + date.slice(1), pageWidth / 2, pageHeight - 35, { align: 'center' });
  pdf.setTextColor(...COLORS.primary);
  pdf.text('CONFIDENZIALE', pageWidth / 2, pageHeight - 25, { align: 'center' });

  // ==========================================
  // TABLE OF CONTENTS
  // ==========================================
  addNewPage();
  
  pdf.setFontSize(28);
  pdf.setTextColor(...COLORS.primary);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Indice', margin, 40);
  
  // Underline
  pdf.setDrawColor(...COLORS.primary);
  pdf.setLineWidth(1);
  pdf.line(margin, 45, margin + 40, 45);
  
  yPosition = 70;
  
  const tocItems = [
    { num: '1', title: 'Executive Summary', page: 3 },
    { num: '2', title: 'Presentazione Team Manageriale', page: 7 },
    { num: '3', title: `Analisi ${input.nome}`, page: 12 },
    { num: '4', title: 'Valutazione Aziendale Pre-Money', page: 21 },
    { num: '5', title: 'OPZIONE A: Costituzione Societaria con Equity Immediata', page: 25 },
    { num: '6', title: 'OPZIONE B: Work for Equity Progressivo', page: 32 },
    { num: '7', title: 'Roadmap 24 Mesi e Milestones', page: 40 },
    { num: '8', title: 'Strategia Go-to-Market', page: 44 },
    { num: '9', title: 'Piano Fundraising', page: 48 },
    { num: '10', title: 'Exit Strategy', page: 52 },
    { num: '11', title: 'Servizi e Supporto Offerti dal Team Manageriale', page: 57 },
    { num: '12', title: 'Termini e Condizioni', page: 62 },
    { num: '13', title: 'Conclusioni e Call to Action', page: 66 },
  ];
  
  pdf.setFont('helvetica', 'normal');
  tocItems.forEach((item) => {
    pdf.setFontSize(11);
    pdf.setTextColor(...COLORS.dark);
    pdf.text(`${item.num}. ${item.title}`, margin, yPosition);
    
    // Dotted line
    const textWidth = pdf.getTextWidth(`${item.num}. ${item.title}`);
    const dotsStart = margin + textWidth + 5;
    const dotsEnd = pageWidth - margin - 15;
    pdf.setTextColor(...COLORS.gray);
    let x = dotsStart;
    while (x < dotsEnd) {
      pdf.text('.', x, yPosition);
      x += 2;
    }
    
    // Page number
    pdf.text(String(item.page), pageWidth - margin - 5, yPosition);
    
    yPosition += 12;
  });

  // ==========================================
  // CONTENT SECTIONS
  // ==========================================
  
  for (const section of sections) {
    addNewPage();
    yPosition = margin;
    
    // Section Title
    pdf.setFontSize(24);
    pdf.setTextColor(...COLORS.primary);
    pdf.setFont('helvetica', 'bold');
    
    const titleLines = pdf.splitTextToSize(section.title, contentWidth);
    titleLines.forEach((line: string) => {
      pdf.text(line, margin, yPosition + 10);
      yPosition += 12;
    });
    
    // Underline
    pdf.setDrawColor(...COLORS.primary);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition + 5, margin + 60, yPosition + 5);
    yPosition += 20;
    
    // Parse and render markdown content
    const lines = section.content.split('\n');
    
    for (const line of lines) {
      checkNewPage(15);
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        yPosition += 4;
        continue;
      }
      
      // Headers
      if (trimmedLine.startsWith('####')) {
        pdf.setFontSize(11);
        pdf.setTextColor(...COLORS.dark);
        pdf.setFont('helvetica', 'bold');
        const text = trimmedLine.replace(/^####\s*/, '');
        pdf.text(text, margin, yPosition);
        yPosition += 8;
      } else if (trimmedLine.startsWith('###')) {
        checkNewPage(20);
        pdf.setFontSize(12);
        pdf.setTextColor(...COLORS.primary);
        pdf.setFont('helvetica', 'bold');
        const text = trimmedLine.replace(/^###\s*/, '');
        pdf.text(text, margin, yPosition);
        yPosition += 10;
      } else if (trimmedLine.startsWith('##')) {
        checkNewPage(25);
        pdf.setFontSize(14);
        pdf.setTextColor(...COLORS.primary);
        pdf.setFont('helvetica', 'bold');
        const text = trimmedLine.replace(/^##\s*/, '');
        pdf.text(text, margin, yPosition);
        yPosition += 12;
      } else if (trimmedLine.startsWith('#')) {
        checkNewPage(30);
        pdf.setFontSize(16);
        pdf.setTextColor(...COLORS.dark);
        pdf.setFont('helvetica', 'bold');
        const text = trimmedLine.replace(/^#\s*/, '');
        pdf.text(text, margin, yPosition);
        yPosition += 14;
      }
      // Bullet points
      else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        pdf.setFontSize(10);
        pdf.setTextColor(...COLORS.dark);
        pdf.setFont('helvetica', 'normal');
        const text = trimmedLine.replace(/^[-*]\s*/, '');
        const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '');
        
        // Bullet
        pdf.setFillColor(...COLORS.primary);
        pdf.circle(margin + 2, yPosition - 1.5, 1, 'F');
        
        const wrappedLines = pdf.splitTextToSize(cleanText, contentWidth - 10);
        wrappedLines.forEach((wLine: string, idx: number) => {
          pdf.text(wLine, margin + 8, yPosition + (idx * 5));
        });
        yPosition += wrappedLines.length * 5 + 2;
      }
      // Numbered lists
      else if (/^\d+\.\s/.test(trimmedLine)) {
        pdf.setFontSize(10);
        pdf.setTextColor(...COLORS.dark);
        pdf.setFont('helvetica', 'normal');
        const match = trimmedLine.match(/^(\d+)\.\s*(.*)/);
        if (match) {
          const num = match[1];
          const text = match[2].replace(/\*\*/g, '').replace(/\*/g, '');
          
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${num}.`, margin, yPosition);
          pdf.setFont('helvetica', 'normal');
          
          const wrappedLines = pdf.splitTextToSize(text, contentWidth - 10);
          wrappedLines.forEach((wLine: string, idx: number) => {
            pdf.text(wLine, margin + 8, yPosition + (idx * 5));
          });
          yPosition += wrappedLines.length * 5 + 2;
        }
      }
      // Tables (simple detection)
      else if (trimmedLine.startsWith('|')) {
        // Skip table separator lines
        if (trimmedLine.includes('---')) {
          continue;
        }
        
        pdf.setFontSize(9);
        const cells = trimmedLine.split('|').filter(c => c.trim());
        const cellWidth = contentWidth / cells.length;
        
        // Check if header row (first row after |)
        const isHeader = lines.indexOf(line) === lines.findIndex(l => l.trim().startsWith('|'));
        
        if (isHeader) {
          pdf.setFillColor(...COLORS.primaryLight);
          pdf.rect(margin, yPosition - 4, contentWidth, 8, 'F');
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(...COLORS.primary);
        } else {
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(...COLORS.dark);
        }
        
        cells.forEach((cell, idx) => {
          const cellText = cell.trim().replace(/\*\*/g, '').substring(0, 25);
          pdf.text(cellText, margin + (idx * cellWidth) + 2, yPosition);
        });
        
        // Row border
        pdf.setDrawColor(220, 220, 220);
        pdf.line(margin, yPosition + 2, margin + contentWidth, yPosition + 2);
        
        yPosition += 8;
      }
      // Blockquotes / Boxes
      else if (trimmedLine.startsWith('>')) {
        checkNewPage(25);
        const text = trimmedLine.replace(/^>\s*/, '').replace(/\*\*/g, '');
        
        pdf.setFillColor(...COLORS.primaryLight);
        pdf.roundedRect(margin, yPosition - 4, contentWidth, 20, 2, 2, 'F');
        pdf.setDrawColor(...COLORS.primary);
        pdf.roundedRect(margin, yPosition - 4, contentWidth, 20, 2, 2, 'S');
        
        pdf.setFontSize(10);
        pdf.setTextColor(...COLORS.primary);
        const wrappedLines = pdf.splitTextToSize(text, contentWidth - 10);
        wrappedLines.slice(0, 2).forEach((wLine: string, idx: number) => {
          pdf.text(wLine, margin + 5, yPosition + 2 + (idx * 5));
        });
        yPosition += 22;
      }
      // Regular text
      else {
        pdf.setFontSize(10);
        pdf.setTextColor(...COLORS.dark);
        pdf.setFont('helvetica', 'normal');
        
        // Handle bold text
        let text = trimmedLine;
        if (text.includes('**')) {
          text = text.replace(/\*\*/g, '');
        }
        
        const wrappedLines = pdf.splitTextToSize(text, contentWidth);
        wrappedLines.forEach((wLine: string) => {
          checkNewPage(8);
          pdf.text(wLine, margin, yPosition);
          yPosition += 5;
        });
        yPosition += 2;
      }
    }
  }

  // Add footers
  addFooter();

  // Save
  const filename = `${input.nome.replace(/\s+/g, '_')}_Proposta_Partnership_Strategica.pdf`;
  pdf.save(filename);
}
