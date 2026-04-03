import { useState } from 'react';
import { Moon, Sun, Download, Share2, Loader2, Check, Menu } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../UI/button';
import { generateDashboardPDF } from '../../utils/exportPdf';

export default function Header({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      await generateDashboardPDF();
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000); // clear tick after 3s
    } catch (err) {
      alert("Gagal melakukan export PDF. Pastikan halaman sudah sepenuhnya dimuat.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center gap-2 sm:gap-3">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-primary hover:bg-primary/10 rounded-md"
        >
          <Menu size={20} />
        </button>
        <img 
          src="/logo.png" 
          alt="Kaos Kami" 
          className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-lg hidden xs:block"
        />
        <div className="overflow-hidden">
          <h1 className="text-[13px] sm:text-base font-bold tracking-tight truncate line-clamp-1" style={{ fontFamily: 'var(--font-heading)' }}>
            Kaos Kami Analytics
          </h1>
          <p className="hidden sm:block text-[11px] font-medium" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Shopee Data: Feb 2024 — Jun 2024
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          size="sm" 
          onClick={handleExport}
          disabled={isExporting}
          className="gap-1.5 px-2.5 sm:px-3 shadow-sm shadow-primary/20 bg-gradient-to-r from-primary to-indigo-500 transition-all hover:scale-105 active:scale-95"
        >
          {isExporting ? <Loader2 size={14} className="animate-spin" /> : (exportSuccess ? <Check size={14}/> : <Download size={14} />)}
          <span className="hidden sm:inline">
            {isExporting ? 'Memproses...' : (exportSuccess ? 'Sukses!' : 'Export PDF')}
          </span>
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground ml-2 hover:bg-slate-200 dark:hover:bg-slate-800">
          <Share2 size={18} />
        </Button>
        <div className="w-px h-5 mx-1" style={{ background: 'hsl(var(--border))' }}></div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
      </div>
    </header>
  );
}
