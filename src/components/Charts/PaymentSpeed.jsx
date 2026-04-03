import { useMemo } from 'react';
import ChartCard from '../UI/ChartCard';
import { COLORS } from '../../utils/constants';

export default function PaymentSpeed({ data }) {
  const { segments, total } = useMemo(() => {
    const s = {
      'Instan (0 Jam)': 0,
      'Cepat (1-2 Jam)': 0,
      'Normal (3-12 Jam)': 0,
      'Lambat (>12 Jam)': 0
    };
    
    let t = 0;
    data.forEach(item => {
      const created = item['Waktu Pesanan Dibuat'] ? new Date(item['Waktu Pesanan Dibuat']) : null;
      const paid = item['Waktu Pembayaran Dilakukan'] ? new Date(item['Waktu Pembayaran Dilakukan']) : null;
      
      if (created && paid && paid >= created) {
        const hoursDiff = (paid - created) / 3600000;
        if (hoursDiff === 0 || hoursDiff < 1) s['Instan (0 Jam)']++;
        else if (hoursDiff <= 2) s['Cepat (1-2 Jam)']++;
        else if (hoursDiff <= 12) s['Normal (3-12 Jam)']++;
        else s['Lambat (>12 Jam)']++;
        t++;
      }
    });

    return { segments: s, total: t };
  }, [data]);

  const items = [
    { name: 'Instan (0 Jam)', value: segments['Instan (0 Jam)'], color: COLORS.green },
    { name: 'Cepat (1-2 Jam)', value: segments['Cepat (1-2 Jam)'], color: COLORS.primary },
    { name: 'Normal (3-12 Jam)', value: segments['Normal (3-12 Jam)'], color: COLORS.amber },
    { name: 'Lambat (>12 Jam)', value: segments['Lambat (>12 Jam)'], color: COLORS.rose }
  ];

  return (
    <ChartCard 
      title="Metrik Kecepatan Pembayaran"
      chartType="Linear Progress Bar Segment (Custom)"
      purpose="Indikator tingkat impulsion/FOMO konsumen. Pembeli yang instan membayar merepresentasikan keinginan belanja emosional yang tinggi."
      dataDef="Membagi rentetan pesanan ke dalam 4 bracket waktu: Instan (0 jam), Cepat (1-2 jam), Normal (3-12), dan Lambat (hingga auto-cancel oleh sistem > 12)."
      formula="Ekstraksi nilai EPOCH (Selisih waktu antara status dibuat dan dibayar) kemudian diklasifikasi if/else ke struktur keranjang (bucket)."
      insight="Pembayaran > 12 jam (Merah Muda) selalu merupakan momok yang paling beresiko 'Batal/Gagal Transfer' atau di-ghosting oleh user."
      tips="Kombinasikan waktu 'Instan' dengan diskon flash sale batas waktu terbatas 2 jam."
      dataSummary={JSON.stringify({ segments, total })}
    >
      <div className="w-full h-full min-h-[250px] flex flex-col justify-center gap-6 px-2">
        <div className="w-full flex h-6 rounded-full overflow-hidden border border-border/50 shadow-inner">
          {items.map((item, idx) => {
             const percent = total > 0 ? (item.value / total) * 100 : 0;
             if (percent === 0) return null;
             return (
               <div 
                 key={idx} 
                 style={{ width: `${percent}%`, backgroundColor: item.color }} 
                 className="h-full transition-all duration-500 hover:brightness-110 cursor-pointer"
                 title={`${item.name}: ${item.value} (${percent.toFixed(1)}%)`}
               />
             );
          })}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-2">
          {items.map((item, idx) => {
             const percent = total > 0 ? (item.value / total) * 100 : 0;
             return (
               <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/50 shadow-sm transition-hover hover:border-border">
                 <span className="w-3 h-3 rounded-full mt-1 shrink-0" style={{ backgroundColor: item.color }} />
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
