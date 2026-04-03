import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import ChartCard from '../UI/ChartCard';
import { COLORS } from '../../utils/constants';

export default function ShippingTimeline({ data }) {
  const chartData = useMemo(() => {
    // We want to calculate AVG time difference:
    // 1. Waktu Pesanan Dibuat -> Waktu Pembayaran Dilakukan (Payment SLA)
    // 2. Waktu Pembayaran Dilakukan -> Waktu Pengiriman Diatur (Packing SLA)
    // 3. Waktu Pengiriman Diatur -> Waktu Pesanan Dikirim (Handover SLA)
    
    let totalPayment = 0, countPayment = 0;
    let totalPacking = 0, countPacking = 0;
    let totalHandover = 0, countHandover = 0;
    
    data.forEach(item => {
      const created = item['Waktu Pesanan Dibuat'] ? new Date(item['Waktu Pesanan Dibuat']) : null;
      const paid = item['Waktu Pembayaran Dilakukan'] ? new Date(item['Waktu Pembayaran Dilakukan']) : null;
      const arranged = item['Waktu Pengiriman Diatur'] ? new Date(item['Waktu Pengiriman Diatur']) : null;
      const shipped = item['Waktu Pesanan Dikirim'] ? new Date(item['Waktu Pesanan Dikirim']) : null;
      
      if (created && paid && paid >= created) {
        totalPayment += (paid - created) / 3600000; // in hours
        countPayment++;
      }
      
      if (paid && arranged && arranged >= paid) {
        totalPacking += (arranged - paid) / 3600000;
        countPacking++;
      }
      
      if (arranged && shipped && shipped >= arranged) {
        totalHandover += (shipped - arranged) / 3600000;
        countHandover++;
      }
    });

    return [
      {
        step: 'Waktu Pembayaran (Customer)',
        hours: countPayment > 0 ? (totalPayment / countPayment) : 0,
        fill: COLORS.indigo
      },
      {
        step: 'Waktu Packing (Seller)',
        hours: countPacking > 0 ? (totalPacking / countPacking) : 0,
        fill: COLORS.cyan
      },
      {
        step: 'Waktu Handover (Kurir)',
        hours: countHandover > 0 ? (totalHandover / countHandover) : 0,
        fill: COLORS.rose
      }
    ];
  }, [data]);

  return (
    <ChartCard 
      title="SLA Pemrosesan Pesanan (Kecepatan)"
      chartType="Bar Chart Horizontal (Service Level Agreement)"
      purpose="Rapor Operasional Internal. Memantau sejauh mana tim gudang (Fulfillment) loyo atau cepat bergerak dalam memproses pesanan."
      dataDef="Durasi penyelesaian transaksi yang disajikan rata-rata (AVG) berdasar JAM. Mengukur Waktu Bayar, Waktu Packing (Seller), hingga Handover resi ke kurir."
      formula="Selisih perbandingan waktu Waktu Dibuat dengan event lanjutan. (Disajikan dalam proporsi jam)."
      insight="Waktu Packing Seller (Biru Muda) adalah Dosa Internal. Semakin batang grafik biru muda panjang, semakin buruk manajemen operasional packing harian Anda."
      tips="Pecut admin packager Anda. Berikan denda harian jika bar Waktu Packing di atas > 24 Jam berturut-turut! Pelanggan membenci penjual yang telat mengirim barang stausnya lama 'Dikemas'."
      dataSummary={JSON.stringify(chartData)}
    >
      <div className="w-full h-full min-h-[250px] pt-4">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            barSize={30}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
            <XAxis type="number" hide / minTickGap={15}>
            <YAxis 
              dataKey="step" 
              type="category" 
              width={160} 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
              formatter={(value) => [`${value.toFixed(1)} Jam`, 'Rata-rata']}
            />
            <Bar 
              dataKey="hours" 
              radius={[0, 4, 4, 0]}
              animationDuration={2000}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
