import { toCanvas, toPng } from 'html-to-image';
import jsPDF from 'jspdf';

/**
 * Exports targeted dashboard sections into a comprehensive PDF report.
 */
export async function generateDashboardPDF() {
  // Prevent UI scrolling issues during capture by adding specific styling
  const opt = {
    quality: 0.7,
    backgroundColor: '#ffffff',
    pixelRatio: 1, // Reduced to prevent 200MB massive sizes
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
    
    // Dispatch event to force charts to mount/load (bypassing scroll-intersection observer)
    window.dispatchEvent(new Event('pdf-export-start'));
    await new Promise(r => setTimeout(r, 1200)); // Wait deep enough for Framer Motion & IntersectionObserver to realize they need to paint

    for (const sec of sections) {
      const element = document.getElementById(sec.id);
      if (!element) continue;

      // Ensure the element is visible for capture
      const originalDisplay = element.style.display;
      element.style.display = 'block';

      // Capture section as JPEG for massive compression (drops 30MB+ to ~2MB)
      const canvas = await toCanvas(element, opt);
      const imgData = canvas.toDataURL('image/jpeg', 0.85);
      const imgProps = pdf.getImageProperties(imgData);
      
      // Calculate scaled dimensions fitting page width
      let drawWidth = pdfWidth - (margin * 2);
      let drawHeight = (imgProps.height * drawWidth) / imgProps.width;

      // Check if it fits on current page. If it doesn't fit on a NEW page either, scale it down.
      const maxAvailableHeight = pdfHeight - margin * 2;
      
      if (currY + drawHeight > pdfHeight - margin && !isFirstPage) {
        pdf.addPage();
        currY = margin + 10; // Extra padding for new page
      }
      if (isFirstPage) isFirstPage = false;
      
      // Auto-scale to fix "terpotong" (cutoff) sections like financials
      if (drawHeight > maxAvailableHeight) {
        const ratio = maxAvailableHeight / drawHeight;
        drawHeight = maxAvailableHeight - 10;
        drawWidth = drawWidth * ratio;
      }

      // Add section title
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      if (currY > 50) pdf.text(sec.title, margin, currY); // Don't print if it's top of cover page
      
      const imgYOffset = currY > 50 ? currY + 5 : currY;

      // Add image
      pdf.addImage(imgData, 'JPEG', margin, imgYOffset, drawWidth, drawHeight);
      
      currY = imgYOffset + drawHeight + 15;
    }

    // Revert export DOM state and components
    document.body.classList.remove('export-mode');
    window.dispatchEvent(new Event('pdf-export-end'));

    // compress PDF directly to reduce output size
    const pdfData = pdf.output('arraybuffer');
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
