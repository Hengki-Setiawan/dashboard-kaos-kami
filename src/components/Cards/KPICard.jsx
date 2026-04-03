import { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from '../UI/AnimatedCounter';
import Modal from '../UI/Modal';
import { Card, CardContent } from '../ui/card';

export default function KPICard({ 
  title, value, format, icon, trend, trendLabel,
  dataDef, formula, insight, tips, accentColor
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const color = accentColor || '#6366f1';

  // formatting is now handled inside AnimatedCounter directly based on the "format" string prop

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        onClick={() => setIsModalOpen(true)}
        className="group cursor-pointer h-full"
      >
        <Card className="h-full relative overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-border transition-all">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1" 
            style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} 
          />
          <CardContent className="p-5 flex flex-col h-full pt-6">
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center relative" style={{ 
                background: `${color}15`,
                color: color
              }}>
                {icon}
              </div>
            </div>

            <div className="font-mono font-bold text-2xl lg:text-xl xl:text-3xl tracking-tight text-foreground mb-2 truncate" title={value?.toString()}>
              <AnimatedCounter value={value} format={format} />
            </div>

            <div className="mt-auto">
              {trend !== undefined && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <span className={`font-semibold ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
                  </span>
                  <span>{trendLabel || 'vs periode lalu'}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        dataDef={dataDef}
        formula={formula}
        insight={insight}
        tips={tips}
      />
    </>
  );
}
