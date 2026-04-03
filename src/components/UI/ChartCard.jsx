import { Info } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/card';
import Modal from './Modal';
import { useState, useEffect, useRef } from 'react';

export default function ChartCard({ 
  title, 
  children, 
  className = '', 
  chartType,
  purpose,
  dataDef, 
  formula, 
  insight, 
  tips,
  dataSummary,
  reanimate = true
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(!reanimate);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!reanimate) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            // Unmount when out of viewport so it re-animates when coming back
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.15 } 
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [reanimate]);

  return (
    <>
      <Card ref={cardRef} className={`flex flex-col ${className}`}>
        <CardHeader className="p-4 md:p-6 pb-2 md:pb-4 flex flex-row items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="chart-actions p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <Info size={18} />
          </button>
        </CardHeader>
        <CardContent className="flex-1 p-4 md:p-6 pt-0 min-h-[350px]">
          {isVisible ? children : (
            <div className="w-full h-full min-h-[300px] bg-muted/20 rounded-xl animate-pulse-glow flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* PDF EXPORT MODE ONLY: Detailed Descriptions mapped from Modal data */}
          <div className="export-mode-data mt-6 pt-4 border-t border-[hsl(var(--border))] text-sm">
            <div className="grid grid-cols-2 gap-4 text-left">
               <div>
                  <p className="font-bold mb-1 text-[hsl(var(--primary))] uppercase tracking-wider text-[10px]">🎯 Tujuan Diagram</p>
                  <p className="text-[hsl(var(--muted-foreground))] mb-3 text-xs leading-relaxed">{purpose}</p>
                  <p className="font-bold mb-1 text-[hsl(var(--primary))] uppercase tracking-wider text-[10px]">✨ Insight Utama</p>
                  <p className="text-[hsl(var(--muted-foreground))] text-xs leading-relaxed">{insight}</p>
               </div>
               <div>
                  <p className="font-bold mb-1 text-[hsl(var(--primary))] uppercase tracking-wider text-[10px]">📊 Definisi Data & Formula</p>
                  <p className="text-[hsl(var(--muted-foreground))] mb-3 text-xs leading-relaxed">{dataDef} {formula}</p>
                  <p className="font-bold mb-1 text-[hsl(var(--primary))] uppercase tracking-wider text-[10px]">💡 Saran Aksi</p>
                  <p className="text-[hsl(var(--muted-foreground))] text-xs leading-relaxed">{tips}</p>
               </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        chartType={chartType}
        purpose={purpose}
        dataDef={dataDef}
        formula={formula}
        insight={insight}
        tips={tips}
        dataSummary={dataSummary}
      />
    </>
  );
}
