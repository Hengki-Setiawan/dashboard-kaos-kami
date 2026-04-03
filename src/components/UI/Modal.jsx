import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Info, Calculator, Lightbulb, Zap, PieChart, Target, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { useAIInsight } from '../../hooks/useAIInsight';

export default function Modal({ 
  isOpen, onClose, title, 
  chartType, purpose, 
  dataDef, formula, insight, tips,
  dataSummary
}) {
  const { insight: aiInsight, isLoading, error, fetchInsight } = useAIInsight();

  useEffect(() => {
    // Only attempt to fetch if the modal is actively opened
    if (isOpen) {
      fetchInsight(title, chartType, purpose, dataSummary);
    }
  }, [isOpen, fetchInsight, title, chartType, purpose, dataSummary]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden gap-0 border-border bg-card">
        <DialogHeader className="p-6 pb-4 border-b border-border bg-muted/30">
          <DialogTitle className="text-xl flex items-center justify-between">
            {title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            Metrics Information & Insights Guide
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          
          {/* AI Insight Section */}
          <div>
            <h4 className="flex items-center gap-2 font-semibold text-sm text-indigo-600 dark:text-indigo-400 mb-2">
              <Sparkles size={16} /> Analisis AI Otomatis (Groq)
            </h4>
            <div className="text-sm bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20 text-card-foreground">
              {isLoading ? (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 size={16} className="animate-spin" /> Memproses pola data...
                </div>
              ) : error ? (
                <div className="flex items-center gap-2 text-rose-500">
                  <AlertTriangle size={16} /> {error}
                </div>
              ) : aiInsight ? (
                <p className="leading-relaxed font-medium italic">"{aiInsight}"</p>
              ) : (
                <p className="text-muted-foreground">Tidak ada data dinamis untuk dianalisis AI.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Jenis Diagram */}
            {chartType && (
              <div className="bg-muted/50 p-3 rounded-lg border border-border">
                <h4 className="flex items-center gap-2 font-semibold text-xs text-blue-600 mb-1">
                  <PieChart size={14} /> Jenis Diagram
                </h4>
                <p className="text-xs text-muted-foreground">{chartType}</p>
              </div>
            )}
            
            {/* Fungsi & Kegunaan */}
            {purpose && (
              <div className="bg-muted/50 p-3 rounded-lg border border-border">
                <h4 className="flex items-center gap-2 font-semibold text-xs text-purple-600 mb-1">
                  <Target size={14} /> Fungsi Tabel
                </h4>
                <p className="text-xs text-muted-foreground">{purpose}</p>
              </div>
            )}
          </div>

          {/* Definisi Data */}
          <div>
            <h4 className="flex items-center gap-2 font-semibold text-sm text-primary mb-2">
              <Info size={16} /> Definisi Data
            </h4>
            <p className="text-sm text-card-foreground leading-relaxed">
              {dataDef || "Tidak ada definisi data."}
            </p>
          </div>

          {/* Formula */}
          {formula && (
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-sm text-cyan-600 dark:text-cyan-500 mb-2">
                <Calculator size={16} /> Formula / Logika
              </h4>
              <div className="bg-muted p-3 rounded-lg border border-border">
                <code className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                  {formula}
                </code>
              </div>
            </div>
          )}

          {/* Insight Statis */}
          {insight && (
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-sm text-emerald-600 dark:text-emerald-500 mb-2">
                <Lightbulb size={16} /> Catatan Khusus
              </h4>
              <p className="text-sm text-card-foreground bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 italic">
                "{insight}"
              </p>
            </div>
          )}

          {/* Actionable Tips */}
          {tips && (
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-sm text-amber-600 dark:text-amber-500 mb-2">
                <Zap size={16} /> Actionable Tips
              </h4>
              <p className="text-sm text-card-foreground bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                {tips}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
