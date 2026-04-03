import { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import ChartCard from '../UI/ChartCard';
import { aggregateBy } from '../../utils/dataTransformers';
import { COLORS } from '../../utils/constants';

export default function RefundReason({ data }) {
  const chartData = useMemo(() => {
    // We only care about orders that have "Alasan Pembembalian" not empty
    const returns = data.filter(item => item['Alasan Pembembalian'] && item['Alasan Pembembalian'].trim() !== '');
    
    const aggregated = aggregateBy(returns, 'Alasan Pembembalian', []);
    
    return aggregated.map(item => ({
      name: item['Alasan Pembembalian'],
      value: item._count
    })).sort((a, b) => b.value - a.value);
  }, [data]);

  return (
    <ChartCard 
      title="Alasan Pengembalian Barang"
      chartType="Bar Chart (Diagram Batang Mendatar)"
      purpose="Mengaudit sisi negatif operasional toko. Mengetahui kelemahan terbesar rantai pasok agar tidak terjadi penumpukan komplain/bintang 1."
      dataDef="Semua record yang memiliki kolom `Alasan Pengembalian` berisi teks. Ditampilkan secara frekuensi menurun (Descending)."
      formula="Filter seluruh data khusus untuk status Batal/Retur, lalu COUNT berdasarkan tipe alasan tertulis."
      insight={chartData.length > 0 ? `Alasan retur paling tinggi adalah "${chartData[0]?.name}". Kebocoran cuan paling krusial di toko Anda!` : "Tidak ada data pengembalian yang disorot, pertanda baik untuk operasional toko."}
      tips="Jika banyak Batal karena 'Lama dikirim', pecat/ubah jam kerja admin packing. Jika karena 'Barang Cacat', komplain ke Vendor produksi Anda."
      className="col-span-full md:col-span-1"
      dataSummary={JSON.stringify(chartData)}
    >
      <div className="flex flex-col h-full w-full">
        {chartData.length > 0 ? (
          <div className="flex-1 w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <XAxis type="number" hide / minTickGap={15}>
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={140} 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  formatter={(value) => [value, 'Retur/Batal']}
                />
                <Bar 
                  dataKey="value" 
                  radius={[0, 4, 4, 0]} 
                  barSize={20}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? COLORS.rose : COLORS.orange} 
                      fillOpacity={1 - (index * 0.1)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[hsl(var(--muted-foreground))]">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-sm font-medium">Bagus, tidak ada data retur signifikan!</p>
          </div>
        )}
      </div>
    </ChartCard>
  );
}
