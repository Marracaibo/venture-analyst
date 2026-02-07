import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AnalysisResult } from './types';

// Extend jsPDF type for autotable
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: { finalY: number };
  }
}

// Helper to add section header
function addSectionHeader(doc: jsPDF, title: string, yPos: number, color: number[]): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Section bar
  doc.setFillColor(color[0], color[1], color[2]);
  doc.rect(15, yPos, 4, 12, 'F');
  
  // Section title
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 24, yPos + 9);
  
  // Underline
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.5);
  doc.line(15, yPos + 15, pageWidth - 15, yPos + 15);
  
  return yPos + 22;
}

export function generateAnalysisPDF(analysis: AnalysisResult): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - 30;
  let yPos = 20;

  // Helper function to add new page if needed
  const checkNewPage = (requiredSpace: number) => {
    if (yPos + requiredSpace > 270) {
      doc.addPage();
      yPos = 20;
    }
  };

  // ========== HEADER ==========
  // Gradient-like header with two colors
  doc.setFillColor(139, 92, 246); // Purple
  doc.rect(0, 0, pageWidth, 50, 'F');
  doc.setFillColor(99, 52, 206); // Darker purple
  doc.rect(0, 40, pageWidth, 10, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('VIRTUAL VENTURE ANALYST', 15, 25);
  
  // Subtitle
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Report di Analisi Startup', 15, 35);
  
  // Date on the right
  doc.setFontSize(10);
  const dateStr = new Date().toLocaleDateString('it-IT', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  });
  doc.text(dateStr, pageWidth - 15, 35, { align: 'right' });

  yPos = 60;

  // ========== IDEA TITLE ==========
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(analysis.ideaTitle, 15, yPos);
  yPos += 10;

  // ========== VERDICT BOX ==========
  const verdictColors = {
    green: { bg: [34, 197, 94], text: 'PROMETTENTE' },
    yellow: { bg: [234, 179, 8], text: 'CAUTO' },
    red: { bg: [239, 68, 68], text: 'PROBLEMATICO' },
  };
  const verdict = verdictColors[analysis.verdict];
  
  doc.setFillColor(verdict.bg[0], verdict.bg[1], verdict.bg[2]);
  doc.roundedRect(15, yPos, pageWidth - 30, 25, 3, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Verdetto: ${verdict.text}`, 20, yPos + 10);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const reasonLines = doc.splitTextToSize(analysis.verdictReason, pageWidth - 40);
  doc.text(reasonLines.slice(0, 2), 20, yPos + 18);
  
  yPos += 35;

  // ========== SCORES WITH VISUAL BARS ==========
  checkNewPage(90);
  yPos = addSectionHeader(doc, 'SCORE COMPLESSIVO', yPos, [139, 92, 246]);

  const scores = analysis.scores;
  const scoreItems = [
    { label: 'Market Size', value: scores.marketSize, color: [59, 130, 246] as [number, number, number] },
    { label: 'Competition', value: scores.competition, color: [249, 115, 22] as [number, number, number] },
    { label: 'Execution Risk', value: scores.executionRisk, color: [234, 179, 8] as [number, number, number] },
    { label: 'Differentiation', value: scores.differentiation, color: [139, 92, 246] as [number, number, number] },
    { label: 'Timing', value: scores.timing, color: [34, 197, 94] as [number, number, number] },
  ];

  const barWidth = 100;
  const barHeight = 8;
  const barX = 65;

  scoreItems.forEach((item) => {
    // Label
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text(item.label, 15, yPos + 6);

    // Background bar
    doc.setFillColor(230, 230, 235);
    doc.roundedRect(barX, yPos, barWidth, barHeight, 2, 2, 'F');

    // Filled bar
    const fillWidth = (item.value / 100) * barWidth;
    doc.setFillColor(item.color[0], item.color[1], item.color[2]);
    doc.roundedRect(barX, yPos, Math.max(fillWidth, 4), barHeight, 2, 2, 'F');

    // Score text
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(item.color[0], item.color[1], item.color[2]);
    doc.text(`${item.value}`, barX + barWidth + 5, yPos + 6);

    yPos += 14;
  });

  // Overall score - larger display
  yPos += 5;
  const overallColor = scores.overall >= 70 ? [34, 197, 94] : scores.overall >= 40 ? [234, 179, 8] : [239, 68, 68];
  doc.setFillColor(overallColor[0], overallColor[1], overallColor[2]);
  doc.roundedRect(15, yPos, contentWidth, 18, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`SCORE COMPLESSIVO: ${scores.overall}/100`, contentWidth / 2 + 15, yPos + 12, { align: 'center' });

  yPos += 28;

  // ========== COMPETITORS ==========
  checkNewPage(60);
  yPos = addSectionHeader(doc, 'ANALISI COMPETITOR', yPos, [59, 130, 246]);

  if (analysis.competitors.length > 0) {
    const competitorData = analysis.competitors.map(c => [
      c.name,
      c.type === 'direct' ? 'Diretto' : 'Indiretto',
      c.strengths.slice(0, 2).join(', '),
      c.weaknesses.slice(0, 2).join(', '),
      c.funding || 'N/A',
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Nome', 'Tipo', 'Punti di Forza', 'Debolezze', 'Funding']],
      body: competitorData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 30 },
        1: { cellWidth: 20 },
        2: { cellWidth: 50 },
        3: { cellWidth: 50 },
        4: { cellWidth: 25 },
      },
      margin: { left: 15, right: 15 },
    });

    yPos = doc.lastAutoTable.finalY + 15;
  }

  // ========== MARKET SIZE WITH CONCENTRIC CIRCLES ==========
  checkNewPage(100);
  yPos = addSectionHeader(doc, 'DIMENSIONE MERCATO', yPos, [6, 182, 212]);

  // Draw concentric circles (TAM > SAM > SOM)
  const circleX = 55;
  const circleY = yPos + 40;
  const tamRadius = 35;
  const samRadius = 24;
  const somRadius = 14;

  // TAM circle
  doc.setFillColor(6, 182, 212);
  doc.circle(circleX, circleY, tamRadius, 'F');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('TAM', circleX - 4, circleY - tamRadius + 8);

  // SAM circle
  doc.setFillColor(34, 150, 190);
  doc.circle(circleX, circleY, samRadius, 'F');
  doc.setFontSize(8);
  doc.text('SAM', circleX - 4, circleY - samRadius + 8);

  // SOM circle
  doc.setFillColor(20, 120, 160);
  doc.circle(circleX, circleY, somRadius, 'F');
  doc.setFontSize(7);
  doc.text('SOM', circleX - 4, circleY + 2);

  // Market data text on the right
  const textX = 100;
  let textY = yPos + 10;

  const marketItems = [
    { label: 'TAM', full: 'Total Addressable Market', data: analysis.marketSize.tam, color: [6, 182, 212] as [number, number, number] },
    { label: 'SAM', full: 'Serviceable Addressable Market', data: analysis.marketSize.sam, color: [34, 150, 190] as [number, number, number] },
    { label: 'SOM', full: 'Serviceable Obtainable Market', data: analysis.marketSize.som, color: [20, 120, 160] as [number, number, number] },
  ];

  marketItems.forEach((item) => {
    // Color dot
    doc.setFillColor(item.color[0], item.color[1], item.color[2]);
    doc.circle(textX, textY - 1.5, 3, 'F');

    // Label
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text(`${item.label}: ${item.data.value}`, textX + 6, textY);

    // Description
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    const descLines = doc.splitTextToSize(item.data.description, 85);
    descLines.slice(0, 3).forEach((line: string, idx: number) => {
      doc.text(line, textX + 6, textY + 5 + (idx * 4));
    });

    textY += 22;
  });

  yPos += 85;

  // ========== GROWTH EXPERIMENTS ==========
  checkNewPage(60);
  yPos = addSectionHeader(doc, 'ESPERIMENTI DI CRESCITA', yPos, [34, 197, 94]);

  if (analysis.growthExperiments.length > 0) {
    const experimentsData = analysis.growthExperiments.map(e => [
      e.title,
      e.description,
      e.budget,
      e.timeframe,
      e.priority.toUpperCase(),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Esperimento', 'Descrizione', 'Budget', 'Timeframe', 'Priorità']],
      body: experimentsData,
      theme: 'striped',
      headStyles: { fillColor: [34, 197, 94], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 35 },
        1: { cellWidth: 65 },
        2: { cellWidth: 22 },
        3: { cellWidth: 22 },
        4: { cellWidth: 18, halign: 'center' },
      },
      margin: { left: 15, right: 15 },
    });

    yPos = doc.lastAutoTable.finalY + 15;
  }

  // ========== ROADMAP ==========
  checkNewPage(60);
  yPos = addSectionHeader(doc, 'ROADMAP 4 SETTIMANE', yPos, [249, 115, 22]);

  if (analysis.roadmap.length > 0) {
    const roadmapData = analysis.roadmap.map(t => [
      `Week ${t.week}`,
      t.title,
      t.description,
      t.category.charAt(0).toUpperCase() + t.category.slice(1),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Settimana', 'Task', 'Descrizione', 'Categoria']],
      body: roadmapData,
      theme: 'striped',
      headStyles: { fillColor: [249, 115, 22], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 22, halign: 'center' },
        1: { fontStyle: 'bold', cellWidth: 45 },
        2: { cellWidth: 80 },
        3: { cellWidth: 22, halign: 'center' },
      },
      margin: { left: 15, right: 15 },
    });

    yPos = doc.lastAutoTable.finalY + 15;
  }

  // ========== RISKS ==========
  checkNewPage(60);
  yPos = addSectionHeader(doc, 'RISCHI IDENTIFICATI', yPos, [239, 68, 68]);

  if (analysis.risks.length > 0) {
    const riskData = analysis.risks.map(r => [
      r.severity.toUpperCase(),
      r.title,
      r.description,
      r.mitigation || 'N/A',
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Severità', 'Rischio', 'Descrizione', 'Mitigazione']],
      body: riskData,
      theme: 'striped',
      headStyles: { fillColor: [239, 68, 68], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 20, halign: 'center' },
        1: { fontStyle: 'bold', cellWidth: 35 },
        2: { cellWidth: 55 },
        3: { cellWidth: 55 },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 0) {
          const severity = data.cell.text[0];
          if (severity === 'CRITICAL') {
            data.cell.styles.fillColor = [239, 68, 68];
            data.cell.styles.textColor = 255;
          } else if (severity === 'HIGH') {
            data.cell.styles.fillColor = [249, 115, 22];
            data.cell.styles.textColor = 255;
          }
        }
      },
      margin: { left: 15, right: 15 },
    });

    yPos = doc.lastAutoTable.finalY + 15;
  }

  // ========== EARLY ADOPTERS ==========
  checkNewPage(50);
  yPos = addSectionHeader(doc, 'EARLY ADOPTER PERSONAS', yPos, [139, 92, 246]);

  if (analysis.earlyAdopters.length > 0) {
    const personaData = analysis.earlyAdopters.map(p => [
      p.name || 'N/A',
      p.role || 'N/A',
      p.company || 'N/A',
      (p.painPoints || []).slice(0, 2).join(', ') || 'N/A',
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Persona', 'Ruolo', 'Azienda', 'Pain Points']],
      body: personaData,
      theme: 'striped',
      headStyles: { fillColor: [139, 92, 246], textColor: 255 },
      styles: { fontSize: 9 },
      margin: { left: 15, right: 15 },
    });

    yPos = doc.lastAutoTable.finalY + 15;
  }

  // ========== CONTACTS ==========
  checkNewPage(50);
  yPos = addSectionHeader(doc, 'CONTATTI SUGGERITI', yPos, [6, 182, 212]);

  if (analysis.contacts.length > 0) {
    const contactData = analysis.contacts.map(c => [
      c.name,
      c.role,
      c.company,
      c.relevance,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Nome', 'Ruolo', 'Azienda', 'Rilevanza']],
      body: contactData,
      theme: 'striped',
      headStyles: { fillColor: [6, 182, 212], textColor: 255 },
      styles: { fontSize: 9 },
      margin: { left: 15, right: 15 },
    });
  }

  // ========== FOOTER ==========
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(15, 282, pageWidth - 15, 282);
    
    // Footer text
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('Virtual Venture Analyst', 15, 288);
    doc.text(
      `Pagina ${i} di ${pageCount}`,
      pageWidth - 15,
      288,
      { align: 'right' }
    );
  }

  // Save the PDF
  const fileName = `VVA_Report_${analysis.ideaTitle.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20)}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
