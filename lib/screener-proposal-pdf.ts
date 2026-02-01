// Investment Proposal PDF Generator for Screener
import jsPDF from 'jspdf';
import { StartupInput, ScreenerResult, SETTORI_CONFIG, BUSINESS_MODEL_LABELS } from './screener-types';

// Color palette
const COLORS = {
  primary: [139, 92, 246] as [number, number, number],
  secondary: [59, 130, 246] as [number, number, number],
  accent: [34, 197, 94] as [number, number, number],
  warning: [234, 179, 8] as [number, number, number],
  danger: [239, 68, 68] as [number, number, number],
  dark: [30, 30, 35] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  muted: [113, 113, 122] as [number, number, number],
  lightBg: [248, 250, 252] as [number, number, number],
};

function getVerdettoColor(verdetto: string): [number, number, number] {
  switch (verdetto) {
    case 'CORE': return COLORS.accent;
    case 'SATELLITE': return COLORS.warning;
    default: return COLORS.danger;
  }
}

export function generateInvestmentProposalPDF(input: StartupInput, result: ScreenerResult): void {
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

  const settore = SETTORI_CONFIG.find(s => s.id === input.verticale);
  const bmLabel = BUSINESS_MODEL_LABELS[input.businessModel];
  const verdettoColor = getVerdettoColor(result.verdetto);

  // Helper: add new page if needed
  const checkNewPage = (requiredSpace: number = 30): boolean => {
    if (yPosition + requiredSpace > pageHeight - 30) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  
  // Header gradient background
  pdf.setFillColor(...COLORS.dark);
  pdf.rect(0, 0, pageWidth, 100, 'F');
  
  // Company logo placeholder
  pdf.setFillColor(...COLORS.primary);
  pdf.roundedRect(margin, 25, 15, 15, 3, 3, 'F');
  pdf.setFontSize(10);
  pdf.setTextColor(...COLORS.white);
  pdf.text('FORGE', margin + 2, 34);
  
  // Title
  pdf.setFontSize(28);
  pdf.setTextColor(...COLORS.white);
  pdf.text('PROPOSTA DI INVESTIMENTO', margin, 60);
  
  // Startup name
  pdf.setFontSize(20);
  pdf.setTextColor(...verdettoColor);
  pdf.text(input.nome.toUpperCase(), margin, 75);
  
  // Subtitle
  pdf.setFontSize(11);
  pdf.setTextColor(...COLORS.muted);
  pdf.text(`${bmLabel.label} - ${settore?.label || input.verticale}`, margin, 85);
  
  // Verdetto badge
  pdf.setFillColor(...verdettoColor);
  pdf.roundedRect(pageWidth - margin - 50, 65, 50, 20, 3, 3, 'F');
  pdf.setFontSize(12);
  pdf.setTextColor(...COLORS.white);
  pdf.text(result.verdettoLabel || result.verdetto, pageWidth - margin - 45, 78);
  
  yPosition = 120;
  
  // Executive Summary Box
  pdf.setFillColor(...COLORS.lightBg);
  pdf.roundedRect(margin, yPosition, contentWidth, 50, 3, 3, 'F');
  pdf.setDrawColor(200, 200, 210);
  pdf.roundedRect(margin, yPosition, contentWidth, 50, 3, 3, 'S');
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...COLORS.dark);
  pdf.text('EXECUTIVE SUMMARY', margin + 5, yPosition + 10);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(60, 60, 60);
  const summaryLines = pdf.splitTextToSize(result.reasoning || 'Analisi non disponibile', contentWidth - 10);
  for (let i = 0; i < Math.min(summaryLines.length, 5); i++) {
    pdf.text(summaryLines[i], margin + 5, yPosition + 20 + (i * 5));
  }
  
  yPosition += 60;
  
  // Key Info Grid
  const infoBoxWidth = (contentWidth - 10) / 3;
  const infoBoxes = [
    { label: 'Fase', value: input.fase.toUpperCase() },
    { label: 'Filtri Passati', value: `${result.filtersScore?.passedCount || 0}/5` },
    { label: 'Settore', value: settore?.label || input.verticale }
  ];
  
  infoBoxes.forEach((box, idx) => {
    const boxX = margin + (idx * (infoBoxWidth + 5));
    pdf.setFillColor(...COLORS.primary);
    pdf.roundedRect(boxX, yPosition, infoBoxWidth, 25, 2, 2, 'F');
    pdf.setFontSize(8);
    pdf.setTextColor(...COLORS.white);
    pdf.text(box.label.toUpperCase(), boxX + 5, yPosition + 8);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(box.value, boxX + 5, yPosition + 19);
    pdf.setFont('helvetica', 'normal');
  });
  
  yPosition += 35;
  
  // ==========================================
  // SECTION: VALUTAZIONE AI - 5 FILTRI
  // ==========================================
  checkNewPage(80);
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...COLORS.dark);
  pdf.text('VALUTAZIONE AI - 5 FILTRI', margin, yPosition);
  yPosition += 10;
  
  const filters = [
    { key: 'problemSolving', label: 'Problema', desc: input.problemDescription || 'N/A' },
    { key: 'marketAnalysis', label: 'Mercato', desc: input.marketDescription || 'N/A' },
    { key: 'differentiation', label: 'Unicità', desc: input.uniquenessDescription || 'N/A' },
    { key: 'businessModel', label: 'Business Model', desc: input.revenueModel || 'N/A' },
    { key: 'traction', label: 'Traction', desc: input.tractionDescription || 'N/A' }
  ];
  
  filters.forEach((filter) => {
    checkNewPage(20);
    const passed = result.filtersScore?.[filter.key as keyof typeof result.filtersScore] as boolean;
    const color = passed ? COLORS.accent : COLORS.danger;
    
    // Filter box
    pdf.setFillColor(passed ? 240 : 255, passed ? 253 : 240, passed ? 244 : 240);
    pdf.roundedRect(margin, yPosition, contentWidth, 18, 2, 2, 'F');
    pdf.setDrawColor(...color);
    pdf.roundedRect(margin, yPosition, contentWidth, 18, 2, 2, 'S');
    
    // Status badge
    pdf.setFillColor(...color);
    pdf.roundedRect(margin + 3, yPosition + 3, 25, 12, 2, 2, 'F');
    pdf.setFontSize(8);
    pdf.setTextColor(...COLORS.white);
    pdf.text(passed ? 'OK' : 'NO', margin + 10, yPosition + 11);
    
    // Label
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...COLORS.dark);
    pdf.text(filter.label, margin + 32, yPosition + 11);
    pdf.setFont('helvetica', 'normal');
    
    yPosition += 22;
  });
  
  // ==========================================
  // SECTION: PUNTI DI FORZA & DEBOLEZZA
  // ==========================================
  checkNewPage(60);
  yPosition += 10;
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...COLORS.dark);
  pdf.text('ANALISI STRATEGICA', margin, yPosition);
  yPosition += 10;
  
  // Two columns
  const colWidth = (contentWidth - 10) / 2;
  
  // Strengths column
  pdf.setFillColor(240, 253, 244);
  pdf.roundedRect(margin, yPosition, colWidth, 60, 2, 2, 'F');
  pdf.setDrawColor(...COLORS.accent);
  pdf.roundedRect(margin, yPosition, colWidth, 60, 2, 2, 'S');
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...COLORS.accent);
  pdf.text('PUNTI DI FORZA', margin + 5, yPosition + 10);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(60, 60, 60);
  result.strengths.slice(0, 4).forEach((s, i) => {
    const text = `+ ${s.substring(0, 50)}`;
    pdf.text(text, margin + 5, yPosition + 20 + (i * 10));
  });
  
  // Weaknesses column
  pdf.setFillColor(255, 251, 235);
  pdf.roundedRect(margin + colWidth + 10, yPosition, colWidth, 60, 2, 2, 'F');
  pdf.setDrawColor(...COLORS.warning);
  pdf.roundedRect(margin + colWidth + 10, yPosition, colWidth, 60, 2, 2, 'S');
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...COLORS.warning);
  pdf.text('DA MIGLIORARE', margin + colWidth + 15, yPosition + 10);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(60, 60, 60);
  result.weaknesses.slice(0, 4).forEach((w, i) => {
    const text = `- ${w.substring(0, 50)}`;
    pdf.text(text, margin + colWidth + 15, yPosition + 20 + (i * 10));
  });
  
  yPosition += 70;
  
  // ==========================================
  // SECTION: PACCHETTI PROPOSTI
  // ==========================================
  if (result.packages && result.packages.length > 0) {
    checkNewPage(80);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...COLORS.dark);
    pdf.text('PACCHETTI PROPOSTI', margin, yPosition);
    yPosition += 10;
    
    result.packages.forEach((pkg, idx) => {
      checkNewPage(50);
      
      const tierColor = idx === 0 ? COLORS.primary : idx === 1 ? COLORS.secondary : COLORS.accent;
      
      // Package box
      pdf.setFillColor(...COLORS.lightBg);
      pdf.roundedRect(margin, yPosition, contentWidth, 40, 3, 3, 'F');
      pdf.setDrawColor(...tierColor);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(margin, yPosition, contentWidth, 40, 3, 3, 'S');
      
      // Tier badge
      pdf.setFillColor(...tierColor);
      pdf.roundedRect(margin + 5, yPosition + 5, 30, 10, 2, 2, 'F');
      pdf.setFontSize(7);
      pdf.setTextColor(...COLORS.white);
      const tierLabel = idx === 0 ? 'BASE' : idx === 1 ? 'GROWTH' : 'PREMIUM';
      pdf.text(tierLabel, margin + 12, yPosition + 12);
      
      // Package name
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...COLORS.dark);
      pdf.text(pkg.nome, margin + 40, yPosition + 14);
      
      // Price
      pdf.setFontSize(10);
      pdf.setTextColor(...tierColor);
      pdf.text(pkg.prezzo, pageWidth - margin - 40, yPosition + 14);
      
      // Items
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(80, 80, 80);
      const itemsText = pkg.items.slice(0, 3).map(i => i.titolo).join(' • ');
      pdf.text(itemsText.substring(0, 80), margin + 5, yPosition + 30);
      
      yPosition += 45;
    });
  }
  
  // ==========================================
  // SECTION: NEXT STEPS
  // ==========================================
  if (result.nextSteps && result.nextSteps.length > 0) {
    checkNewPage(50);
    yPosition += 5;
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...COLORS.dark);
    pdf.text('PROSSIMI PASSI', margin, yPosition);
    yPosition += 10;
    
    result.nextSteps.slice(0, 4).forEach((step, idx) => {
      checkNewPage(15);
      
      // Number circle
      pdf.setFillColor(...COLORS.primary);
      pdf.circle(margin + 5, yPosition + 3, 4, 'F');
      pdf.setFontSize(8);
      pdf.setTextColor(...COLORS.white);
      pdf.text(String(idx + 1), margin + 3.5, yPosition + 5);
      
      // Step text
      pdf.setFontSize(9);
      pdf.setTextColor(60, 60, 60);
      pdf.text(step.substring(0, 80), margin + 15, yPosition + 5);
      
      yPosition += 12;
    });
  }
  
  // ==========================================
  // FOOTER ON ALL PAGES
  // ==========================================
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    
    // Footer line
    pdf.setDrawColor(...COLORS.muted);
    pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    // Footer text
    pdf.setFontSize(8);
    pdf.setTextColor(...COLORS.muted);
    pdf.text('Forge Studio • Investment Proposal', margin, pageHeight - 10);
    pdf.text(`Pagina ${i} di ${totalPages}`, pageWidth - margin - 25, pageHeight - 10);
    
    // Date
    const date = new Date().toLocaleDateString('it-IT');
    pdf.text(date, pageWidth / 2 - 10, pageHeight - 10);
  }
  
  // Save PDF
  const filename = `${input.nome.replace(/\s+/g, '_')}_Proposta_Investimento.pdf`;
  pdf.save(filename);
}
