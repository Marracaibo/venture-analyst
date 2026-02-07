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

  // Helper: write a paragraph of wrapped text
  const writeParagraph = (text: string, x: number, maxWidth: number, fontSize: number = 10, color: [number, number, number] = [60, 60, 60]) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(color[0], color[1], color[2]);
    const lines: string[] = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      checkNewPage(8);
      doc.text(line, x, yPos);
      yPos += fontSize * 0.5;
    });
    yPos += 3;
  };

  // ========== HEADER ==========
  doc.setFillColor(139, 92, 246); // Purple
  doc.rect(0, 0, pageWidth, 55, 'F');
  doc.setFillColor(99, 52, 206); // Darker purple
  doc.rect(0, 45, pageWidth, 10, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('FORGE STUDIO', 15, 22);
  
  // Subtitle
  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.text(`Report di Analisi: ${analysis.ideaTitle}`, 15, 34);
  
  // Date on the right
  doc.setFontSize(10);
  const dateStr = new Date().toLocaleDateString('it-IT', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  });
  doc.text(dateStr, pageWidth - 15, 22, { align: 'right' });
  doc.setFontSize(9);
  doc.text('Documento riservato', pageWidth - 15, 30, { align: 'right' });

  yPos = 65;

  // ========== INTRODUZIONE ==========
  yPos = addSectionHeader(doc, 'INTRODUZIONE', yPos, [139, 92, 246]);

  const introText1 = `Forge Studio e' uno startup studio che opera come co-founder tecnico e strategico per startup early-stage. Il nostro modello si basa sulla selezione accurata di progetti ad alto potenziale, ai quali offriamo competenze operative (CTO, CMO, CFO), risorse tecnologiche e un network qualificato in cambio di equity. Non siamo un incubatore tradizionale: entriamo nel progetto come soci operativi, con skin in the game reale.`;

  const introText2 = `Il presente documento rappresenta un'analisi approfondita del progetto "${analysis.ideaTitle}", condotta dal nostro team attraverso un processo strutturato che valuta il mercato di riferimento, il panorama competitivo, i rischi, le opportunita' di crescita e i possibili early adopter. L'obiettivo non e' dare un giudizio, ma fornire una mappa chiara per prendere decisioni informate e costruire qualcosa di solido.`;

  const introText3 = `Ogni sezione del report contiene indicazioni operative e suggerimenti concreti. Ti incoraggiamo a leggere con attenzione non solo i punti di forza, ma soprattutto le aree di miglioramento e le strategie di mitigazione dei rischi: e' li' che si costruisce il vantaggio competitivo reale.`;

  writeParagraph(introText1, 15, contentWidth);
  yPos += 2;
  writeParagraph(introText2, 15, contentWidth);
  yPos += 2;
  writeParagraph(introText3, 15, contentWidth);
  yPos += 5;

  // ========== SINTESI DELLA VALUTAZIONE ==========
  checkNewPage(50);
  yPos = addSectionHeader(doc, 'SINTESI DELLA VALUTAZIONE', yPos, [139, 92, 246]);

  // Verdict reason as a highlighted box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, yPos, contentWidth, 5, 3, 3, 'F'); // placeholder height, will expand
  doc.setDrawColor(139, 92, 246);
  doc.setLineWidth(0.8);
  doc.line(15, yPos, 15, yPos + 4); // left accent bar
  
  const reasonText = analysis.verdictReason || 'Analisi non disponibile';
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 55);
  const reasonLines: string[] = doc.splitTextToSize(reasonText, contentWidth - 16);
  const boxHeight = reasonLines.length * 5 + 10;
  
  // Redraw box with correct height
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, yPos, contentWidth, boxHeight, 3, 3, 'F');
  doc.setDrawColor(139, 92, 246);
  doc.setLineWidth(1);
  doc.line(15, yPos + 2, 15, yPos + boxHeight - 2); // left accent bar
  
  reasonLines.forEach((line: string, idx: number) => {
    doc.text(line, 21, yPos + 8 + (idx * 5));
  });
  
  yPos += boxHeight + 10;

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

  // ========== CONCLUSIONE E RACCOMANDAZIONI ==========
  doc.addPage();
  yPos = 20;
  yPos = addSectionHeader(doc, 'CONCLUSIONE E RACCOMANDAZIONI', yPos, [139, 92, 246]);

  // Build dynamic recommendations based on analysis data
  const scores = analysis.scores;
  const recommendations: string[] = [];

  // Market-based recommendations
  if (scores.marketSize >= 70) {
    recommendations.push(`Il mercato di riferimento per "${analysis.ideaTitle}" presenta dimensioni interessanti. Questo e' un asset importante, ma richiede una strategia di posizionamento chiara per catturare la quota di mercato accessibile (SOM). Consigliamo di validare il pricing con almeno 20 potenziali clienti prima di scalare.`);
  } else {
    recommendations.push(`La dimensione del mercato richiede attenzione. Ti consigliamo di esplorare segmenti adiacenti o verticali complementari per ampliare il mercato addressable. Una strategia efficace puo' essere partire da una nicchia specifica dove potete diventare leader indiscussi, per poi espandervi.`);
  }

  // Competition-based recommendations
  if (scores.competition < 50) {
    recommendations.push(`Il panorama competitivo e' significativo. Per costruire un vantaggio difendibile, concentrati su uno o piu' di questi elementi: (1) costruire un moat tecnologico con proprietà intellettuale o effetti di rete, (2) creare switching costs attraverso integrazioni profonde con i workflow dei clienti, (3) accumulare un data advantage che migliori il prodotto nel tempo. Non cercare di competere su tutti i fronti: scegli la battaglia che potete vincere.`);
  } else {
    recommendations.push(`La posizione competitiva e' favorevole. Per mantenerla, investi nella velocità di esecuzione e nella costruzione di barriere all'ingresso. Documenta e proteggi la proprieta' intellettuale, costruisci relazioni esclusive con i primi clienti e crea un brand riconoscibile nel tuo segmento.`);
  }

  // Execution risk recommendations
  if (scores.executionRisk < 50) {
    recommendations.push(`Il rischio di esecuzione e' un'area critica. Per mitigarlo: (1) riduci la complessità del prodotto iniziale - lancia con le feature minime che risolvono il problema core, (2) stabilisci milestone chiare ogni 2 settimane con metriche misurabili, (3) identifica le competenze mancanti nel team e colmale prima di scalare. Forge Studio puo' supportarti operativamente su tecnologia, marketing e finanza.`);
  } else {
    recommendations.push(`L'esecuzione appare fattibile. Per mantenere il ritmo: stabilisci un ciclo di sprint bisettimanali con obiettivi SMART, implementa analytics dal giorno uno per misurare ogni ipotesi, e crea un processo di feedback strutturato con i primi utenti.`);
  }

  // Differentiation recommendations
  if (scores.differentiation < 50) {
    recommendations.push(`La differenziazione e' l'area dove investire di piu'. Un prodotto simile agli altri lotta sempre sul prezzo. Chiediti: cosa puoi offrire che nessun altro puo' replicare facilmente? Puo' essere un'esperienza utente superiore, un accesso esclusivo a dati, una tecnologia proprietaria, o un modello di business innovativo. Identifica il tuo "10x factor" - quella cosa che rende il tuo prodotto 10 volte migliore dell'alternativa attuale.`);
  } else {
    recommendations.push(`La differenziazione e' un punto di forza. Comunicala in modo chiaro e misurabile: non "siamo migliori", ma "riduciamo i tempi del 70%" o "risparmiamo X euro all'anno". Ogni claim deve essere supportato da dati reali o testimonianze di clienti.`);
  }

  // Timing recommendations
  if (scores.timing >= 60) {
    recommendations.push(`Il timing di mercato e' favorevole. Questo e' un vantaggio temporaneo - sfruttalo con velocita' di esecuzione. Il "first mover advantage" esiste solo se accompagnato da una rapida acquisizione di clienti e costruzione di brand. Obiettivo: essere riconosciuti come riferimento del settore entro 12 mesi.`);
  } else {
    recommendations.push(`Il timing richiede una strategia di posizionamento piu' attenta. Valuta se il mercato e' pronto per la tua soluzione o se serve educazione del cliente. In questo caso, investi in content marketing e thought leadership per preparare il mercato mentre costruisci il prodotto.`);
  }

  // Write recommendations
  recommendations.forEach((rec, idx) => {
    checkNewPage(35);
    
    // Numbered recommendation
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(139, 92, 246);
    doc.text(`${idx + 1}.`, 15, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const recLines: string[] = doc.splitTextToSize(rec, contentWidth - 10);
    recLines.forEach((line: string) => {
      checkNewPage(7);
      doc.text(line, 22, yPos);
      yPos += 5;
    });
    yPos += 5;
  });

  // ========== PROSSIMI PASSI IMMEDIATI ==========
  checkNewPage(60);
  yPos += 5;
  yPos = addSectionHeader(doc, 'PROSSIMI PASSI IMMEDIATI', yPos, [34, 197, 94]);

  const nextSteps = [
    `Validazione del problema: Conduci 15-20 interviste con potenziali clienti target. Non presentare la soluzione - ascolta i loro problemi, quanto spendono per risolverli oggi, e cosa li frustra delle alternative attuali.`,
    `MVP focalizzato: Identifica la singola feature che risolve il problema piu' urgente del tuo cliente ideale. Costruisci solo quella. Il primo obiettivo non e' un prodotto completo, ma una prova che qualcuno e' disposto a pagare.`,
    `Metriche dal giorno uno: Definisci 3 KPI chiave (es. CAC, retention a 30 giorni, NPS) e implementa il tracking prima del lancio. Senza dati, ogni decisione e' un'opinione.`,
    `Costruisci in pubblico: Documenta il percorso su LinkedIn o un blog di settore. Questo attira early adopter, potenziali partner e talenti. La trasparenza e' un asset competitivo sottovalutato.`,
    `Definisci il modello di revenue: Anche se offri una versione gratuita iniziale, stabilisci fin da subito come monetizzerai. I clienti che pagano dal primo giorno sono il miglior segnale di product-market fit.`,
  ];

  nextSteps.forEach((step, idx) => {
    checkNewPage(25);
    
    // Green checkmark circle
    doc.setFillColor(34, 197, 94);
    doc.circle(19, yPos - 1.5, 3, 'F');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(`${idx + 1}`, 17.5, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 55);
    const stepLines: string[] = doc.splitTextToSize(step, contentWidth - 15);
    stepLines.forEach((line: string) => {
      checkNewPage(6);
      doc.text(line, 26, yPos);
      yPos += 4.5;
    });
    yPos += 4;
  });

  // ========== CLOSING NOTE ==========
  checkNewPage(50);
  yPos += 5;
  
  // Closing box
  doc.setFillColor(139, 92, 246);
  doc.roundedRect(15, yPos, contentWidth, 40, 3, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Come possiamo aiutarti', 20, yPos + 10);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const closingText = `Forge Studio non e' un consulente che ti da' un report e sparisce. Se crediamo nel progetto, ci mettiamo in gioco come co-founder operativi. Questo significa che il nostro successo e' legato al tuo. Se vuoi approfondire questa analisi o esplorare una collaborazione, contattaci per una call di 30 minuti senza impegno.`;
  const closingLines: string[] = doc.splitTextToSize(closingText, contentWidth - 14);
  closingLines.forEach((line: string, idx: number) => {
    doc.text(line, 20, yPos + 18 + (idx * 4.5));
  });

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
    doc.text('Forge Studio - Documento riservato', 15, 288);
    doc.text(
      `Pagina ${i} di ${pageCount}`,
      pageWidth - 15,
      288,
      { align: 'right' }
    );
  }

  // Save the PDF
  const fileName = `Forge_Report_${analysis.ideaTitle.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20)}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
