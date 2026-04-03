import { useMemo, useState } from 'react';
import ChartCard from '../UI/ChartCard';
import { COLORS } from '../../utils/constants';

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function TimeHeatmap({ data }) {
  const [hoveredCell, setHoveredCell] = useState(null);

  const { heatmapData, maxValue, peak } = useMemo(() => {
    // Initialize 7x24 grid
    const grid = Array(7).fill().map(() => Array(24).fill(0));
    let max = 0;
    let peakCell = { day: 0, hour: 0, orders: 0 };
    
    data.forEach(item => {
      const dateStr = item['Waktu Pesanan Dibuat'];
      if (!dateStr) return;
      
      const date = new Date(dateStr);
      const day = date.getDay(); // 0 = Sunday
      const hour = date.getHours();
      
      grid[day][hour] += 1; // Count orders
      
      if (grid[day][hour] > max) {
        max = grid[day][hour];
      }
      if (grid[day][hour] > peakCell.orders) {
        peakCell = { day, hour, orders: grid[day][hour] };
      }
    });
    
    return { heatmapData: grid, maxValue: max, peak: peakCell };
  }, [data]);

  const getColor = (value) => {
    if (value === 0) return 'hsl(var(--secondary))';
    
    // Scale opacity based on value/maxValue
    const opacity = 0.2 + (value / maxValue) * 0.8;
    return `rgba(59, 130, 246, ${opacity})`; // Using primary blue color base
  };

  return (
    <ChartCard 
      title="Heatmap Waktu Belanja"
      className="col-span-full xl:col-span-1"
      chartType="Grid Heatmap (Matriks Skala Warna)"
      purpose="Mencari tahu kapan audiens secara fisiologis paling aktif bertransaksi (golden hour)."
      dataDef="Matriks 7 hari (Baris) x 24 jam (Kolom). Warna biru solid menunjukkan puncak volume transaksi tinggi di jam tersebut."
      formula="Frekuensi titik perpotongan: COUNT(Pesanan) di grouping dengan fungsi GROUP_BY(Hari, Jam)."
      insight={`Waktu paling ramai (peak hour) adalah hari ${DAYS[peak.day]} jam ${String(peak.hour).padStart(2, '0')}:00 dengan ${peak.orders} pesanan.`}
      tips="Jadwalkan peluncuran produk baru, promo, atau tembakan email blast tepat 1-2 jam sebelum jam teramai ini."
      dataSummary={JSON.stringify({ puncak_hari: DAYS[peak.day], jam_puncak: peak.hour, jumlah_order_puncak: peak.orders })}
    >
      <div className="w-full h-full min-h-[400px] flex flex-col relative pt-4 pr-4">
        
        {/* X Axis (Hours) */}
        <div className="flex ml-16 mb-2">
          {HOURS.map(hour => (
            <div key={hour} className="flex-1 text-center text-[10px] text-[hsl(var(--muted-foreground))]">
              {hour % 2 === 0 ? String(hour).padStart(2, '0') : ''}
            </div>
          ))}
        </div>
        
        {/* Heatmap Grid */}
        <div className="flex-1 flex flex-col gap-1">
          {DAYS.map((day, dIdx) => (
            <div key={day} className="flex flex-1 items-stretch gap-1">
              {/* Y Axis (Days) */}
              <div className="w-14 text-xs text-[hsl(var(--muted-foreground))] flex items-center justify-end pr-2 font-medium">
                {day.substring(0, 3)}
              </div>
              
              {/* Cells */}
              {HOURS.map((hour, hIdx) => {
                const value = heatmapData[dIdx][hIdx];
                const isPeak = dIdx === peak.day && hIdx === peak.hour;
                const isHovered = hoveredCell?.day === dIdx && hoveredCell?.hour === hIdx;
                
                return (
                  <div 
                    key={`${dIdx}-${hIdx}`}
                    className="flex-1 rounded-sm relative cursor-pointer"
                    style={{ 
                      backgroundColor: getColor(value),
                      transition: 'transform 0.1s',
                      transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                      zIndex: isHovered ? 10 : 1,
                      border: isPeak ? `1px solid ${COLORS.amber}` : 'none'
                    }}
                    onMouseEnter={() => setHoveredCell({ day: dIdx, hour: hIdx, value })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        {/* Tooltip */}
        {hoveredCell && hoveredCell.value > 0 && (
          <div className="absolute top-0 right-0 bg-card border border-border rounded-xl shadow-sm !bg-card text-xs p-2 shadow-lg pointer-events-none z-50">
            <strong>{DAYS[hoveredCell.day]}, {String(hoveredCell.hour).padStart(2, '0')}:00</strong><br/>
            {hoveredCell.value} Pesanan
          </div>
        )}
        
        {/* Legend */}
        <div className="flex items-center justify-end mt-4 gap-2 text-xs text-[hsl(var(--muted-foreground))]">
          <span>Sepi</span>
          <div className="w-32 h-2 rounded-full" style={{ background: `linear-gradient(to right, rgba(59,130,246,0.1), rgba(59,130,246,1))` }}></div>
          <span>Ramai ({maxValue})</span>
        </div>
        
      </div>
    </ChartCard>
  );
}
