import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell
} from 'recharts';
import ChartCard from '../UI/ChartCard';
import { COLORS } from '../../utils/constants';

export default function OrderFunnel({ data }) {
  const chartData = useMemo(() => {
    let pesananDibuat = 0;
    let pesananDibayar = 0;
    let pesananDikirim = 0;
    let pesananSelesai = 0;
    
    data.forEach(item => {
      if (item['Waktu Pesanan Dibuat']) pesananDibuat++;
      if (item['Waktu Pembayaran Dilakukan']) pesananDibayar++;
      if (item['Waktu Pengiriman Diatur']) pesananDikirim++;
      if (item['Waktu Pesanan Selesai']) pesananSelesai++;
    });

    return [
      { step: '1. Dibuat', value: pesananDibuat, prev: pesananDibuat },
      { step: '2. Dibayar', value: pesananDibayar, prev: pesananDibuat },
      { step: '3. Dikirim', value: pesananDikirim, prev: pesananDibayar },
      { step: '4. Selesai', value: pesananSelesai, prev: pesananDikirim }
    ];
  }, [data]);

  return (
    <ChartCard 
      title="Funnel Pemrosesan Pesanan"
      chartType="Horizontal Bar Chart (Funnel / Corong Penjualan)"
      purpose="Visualisasi 'Kebocoran' proses (Drop-off rate). Melacak titik terlemah dari perjalanan belanja customer dari memasukkan ke keranjang hingga paket tiba."
      dataDef="Dimulai dari 100% Pesanan Dibuat di fase paling atas, dan menyusut perlahan menjadi Selesai di fase bawah."
      formula="COUNT pada kolom timestamp event: Waktu Dibuat > Dibayar > Dikirim > Selesai. Selisih antar tahap disebut Drop (%)"
      insight="Normalnya drop dari Dibuat->Dibayar wajar tinggi (orang sekedar iseng Add to Cart). Namun drop-off dari Dibayar->Dikirim adalah salah murni toko Anda."
      tips="Perbaiki ketersediaan stok! Batalkan pesanan sepihak oleh admin (dari Dibayar->Batal) akan sangat menghancurkan reputasi algoritma toko Anda."
      className="col-span-full md:col-span-1"
      dataSummary={JSON.stringify(chartData)}
    >
      <div className="w-full h-full min-h-[300px] pt-4 flex flex-col items-center">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 40, left: 10, bottom: 20 }}
            barSize={30}
          >
            <XAxis type="number" hide domain={[0, 'dataMax']} / minTickGap={15}>
            <YAxis 
              dataKey="step" 
              type="category" 
              width={80} 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
              formatter={(value, name, props) => {
                const drop = props.payload.prev > 0 
                  ? (((props.payload.prev - value) / props.payload.prev) * 100).toFixed(1) 
                  : 0;
                return [`${value} (Drop: ${drop}%)`, 'Volume Pesanan'];
              }}
            />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 4, 4]}
            >
              <LabelList dataKey="value" position="right" fill="hsl(var(--foreground))" fontSize={12} />
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS.indigo} 
                  fillOpacity={1 - (index * 0.15)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
