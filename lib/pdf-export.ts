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

  // ========== SCORES ==========
  checkNewPage(50);
  yPos = addSectionHeader(doc, 'SCORE COMPLESSIVO', yPos, [139, 92, 246]);

  const scores = analysis.scores;
  const scoreData = [
    ['Market Size', `${scores.marketSize}/100`],
    ['Competition', `${scores.competition}/100`],
    ['Execution Risk', `${scores.executionRisk}/100`],
    ['Differentiation', `${scores.differentiation}/100`],
    ['Timing', `${scores.timing}/100`],
    ['OVERALL', `${scores.overall}/100`],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [['Metrica', 'Score']],
    body: scoreData,
    theme: 'striped',
    headStyles: { fillColor: [139, 92, 246], textColor: 255 },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'center' },
    },
    margin: { left: 15, right: 15 },
  });

  yPos = doc.lastAutoTable.finalY + 15;

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

  // ========== MARKET SIZE ==========
  checkNewPage(50);
  yPos = addSectionHeader(doc, 'DIMENSIONE MERCATO', yPos, [6, 182, 212]);

  const marketData = [
    ['TAM (Total Addressable Market)', analysis.marketSize.tam.value, analysis.marketSize.tam.description],
    ['SAM (Serviceable Addressable Market)', analysis.marketSize.sam.value, analysis.marketSize.sam.description],
    ['SOM (Serviceable Obtainable Market)', analysis.marketSize.som.value, analysis.marketSize.som.description],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [['Metrica', 'Valore', 'Descrizione']],
    body: marketData,
    theme: 'striped',
    headStyles: { fillColor: [6, 182, 212], textColor: 255 },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 55 },
      1: { cellWidth: 30 },
    },
    margin: { left: 15, right: 15 },
  });

  yPos = doc.lastAutoTable.finalY + 15;

  // ========== GROWTH EXPERIMENTS ==========
  checkNewPage(60);
  yPos = addSectionHeader(doc, 'ESPERIMENTI DI CRESCITA', yPos, [34, 197, 94]);

  if (analysis.growthExperiments.length > 0) {
    const experimentsData = analysis.growthExperiments.map(e => [
      e.title,
      e.description.substring(0, 80) + '...',
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
      styles: { fontSize: 8 },
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
      t.description.substring(0, 60) + '...',
      t.category.charAt(0).toUpperCase() + t.category.slice(1),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Settimana', 'Task', 'Descrizione', 'Categoria']],
      body: roadmapData,
      theme: 'striped',
      headStyles: { fillColor: [249, 115, 22], textColor: 255 },
      styles: { fontSize: 8 },
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
      r.description.substring(0, 60) + '...',
      (r.mitigation || 'N/A').substring(0, 60) + '...',
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Severità', 'Rischio', 'Descrizione', 'Mitigazione']],
      body: riskData,
      theme: 'striped',
      headStyles: { fillColor: [239, 68, 68], textColor: 255 },
      styles: { fontSize: 8 },
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
      c.relevance.substring(0, 50) + '...',
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
