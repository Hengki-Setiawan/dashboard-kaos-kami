import { useMemo } from 'react';
import ChartCard from '../UI/ChartCard';
import { aggregateBy } from '../../utils/dataTransformers';
import { COLOR_PALETTE } from '../../utils/constants';

export default function OrderStatus({ data }) {
  const chartData = useMemo(() => {
    const aggregated = aggregateBy(data, 'Status Pesanan', []);
    return aggregated.map(item => ({
      name: item['Status Pesanan'],
      value: item._count
    })).sort((a, b) => b.value - a.value);
  }, [data]);

  const total = data.length;

  const getColor = (name) => {
    if (name.toLowerCase() === 'selesai') return COLOR_PALETTE[0]; // indigo
    if (name.toLowerCase() === 'batal') return COLOR_PALETTE[3]; // rose
    return COLOR_PALETTE[1]; // amber
  };

  return (
    <ChartCard 
      title="Status Penyelesian Akhir"
      chartType="Linear Progress Bar Segment (Custom)"
      purpose="Metrik pengawasan (quality control). Sebuah overview fundamental untuk menyadari berapa % potensi profit kita yang menguap lewat Retur/Batal."
      dataDef="Terdiri dari batang visual interaktif yang mewakili persentase Selesai, Batal, Dikirim, atau sedang Diproses."
      formula="Memetakan enumerasi `Status Pesanan` yang persis sama dan mengumpulkan nilai frekuensinya (COUNTIF)."
      insight="Ideal rate untuk pesanan Batal di industri fashion (pakaian kaos) sebaiknya dipelihara keras dibawah 5-8%. Jika >10%, ada yang salah dengan ekspektasi produk."
      tips="Analisis diagram Alasan Pengembalian (Refund Reason) segera jika porsi merah 'Batal' di chart ini terlihat dominan memanjang."
      dataSummary={JSON.stringify({ chartData, total })}
    >
      <div className="w-full h-full min-h-[250px] flex flex-col justify-center gap-6 px-2">
        <div className="w-full flex h-6 rounded-full overflow-hidden border border-border/50 shadow-inner bg-secondary">
          {chartData.map((item, idx) => {
             const percent = total > 0 ? (item.value / total) * 100 : 0;
             if (percent === 0) return null;
             return (
               <div 
                 key={idx} 
                 style={{ width: `${percent}%`, backgroundColor: getColor(item.name) }} 
                 className="h-full transition-all duration-500 hover:brightness-110 cursor-pointer"
                 title={`${item.name}: ${item.value} (${percent.toFixed(1)}%)`}
               />
             );
          })}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-2">
          {chartData.map((item, idx) => {
             const percent = total > 0 ? (item.value / total) * 100 : 0;
             return (
               <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/50 shadow-sm transition-hover hover:border-border">
                 <span className="w-3 h-3 rounded-full mt-1 shrink-0" style={{ backgroundColor: getColor(item.name) }} />
                 <div>
                   <p className="text-xs text-muted-foreground font-medium mb-1">{item.name}</p>
                   <p className="font-bold text-foreground text-sm flex items-end gap-2">
                     {item.value} <span className="text-xs font-normal text-muted-foreground">({percent.toFixed(1)}%)</span>
                   </p>
                 </div>
               </div>
             );
          })}
        </div>
      </div>
    </ChartCard>
  );
}
