import { toCanvas, toPng } from 'html-to-image';
import jsPDF from 'jspdf';

/**
 * Exports targeted dashboard sections into a comprehensive PDF report.
 */
export async function generateDashboardPDF() {
  // Prevent UI scrolling issues during capture by adding specific styling
  const opt = {
    quality: 0.95,
    backgroundColor: '#ffffff',
    pixelRatio: 2,
    skipFonts: false,
    filter: (node) => {
      // Don't capture the header itself again
      if (node.tagName === 'HEADER') return false;
      return true;
    }
  };

  // Sections to capture
  const sections = [
    { id: 'overview', title: 'Ringkasan Utama' },
    { id: 'revenue', title: 'Tren Keuangan' },
    { id: 'products', title: 'Performa Produk' },
    { id: 'geography', title: 'Geografis Penjualan' },
    { id: 'financials', title: 'Data Keuangan Terperinci' },
    { id: 'customers', title: 'Pelanggan & Retensi' },
    { id: 'shipping', title: 'Ekspedisi & Logistik' },
    { id: 'insights', title: 'AI Insights' }
  ];

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    
    // Page 1: Cover / Header
    pdf.setFillColor(99, 102, 241); // indigo primary
    pdf.rect(0, 0, pdfWidth, 40, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.text("Kaos Kami Analytics Report", margin, 25);
    pdf.setFontSize(10);
    pdf.text(`Periode Data: Feb 2024 - Jun 2024 | Dibuat pada: ${new Date().toLocaleString('id-ID')}`, margin, 32);

    let isFirstPage = true;
    let currY = 50;

    // Enable detailed text rendering for PDF mode
    document.body.classList.add('export-mode');
    await new Promise(r => setTimeout(r, 500)); // allow DOM to paint the new nodes

    for (const sec of sections) {
      const element = document.getElementById(sec.id);
      if (!element) continue;

      // Ensure the element is visible for capture
      const originalDisplay = element.style.display;
      element.style.display = 'block';

      // Capture section
      const canvas = await toCanvas(element, opt);
      element.style.display = originalDisplay; // restore

      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);
      
      // Calculate scaled dimensions fitting page width
      const drawWidth = pdfWidth - (margin * 2);
      const drawHeight = (imgProps.height * drawWidth) / imgProps.width;

      // Check if it fits on current page
      if (currY + drawHeight > pdfHeight - margin && !isFirstPage) {
        pdf.addPage();
        currY = margin;
      }
      if (isFirstPage) isFirstPage = false;

      // Add section title
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      if (currY > 50) pdf.text(sec.title, margin, currY); // Don't print if it's top of cover page
      
      const imgYOffset = currY > 50 ? currY + 5 : currY;

      // Add image
      pdf.addImage(imgData, 'PNG', margin, imgYOffset, drawWidth, drawHeight);
      
      currY = imgYOffset + drawHeight + 15;
    }

    // Revert export DOM state
    document.body.classList.remove('export-mode');

    // Add general footer to all pages
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setTextColor(150, 150, 150);
        pdf.setFontSize(8);
        pdf.text(
            `Halaman ${i} dari ${pageCount} - Kaos Kami Analytics Dashboard (AI Generated)`,
            pdfWidth / 2, 
            pdfHeight - 5,
            { align: 'center' }
        );
    }

    pdf.save(`Kaos_Kami_Report_${new Date().getTime()}.pdf`);
    return true;
  } catch (error) {
    console.error("PDF Export failed:", error);
    throw error;
  }
}
