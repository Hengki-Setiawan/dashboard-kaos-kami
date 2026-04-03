import { useMemo, useState } from 'react';
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
import { COLORS, formatIDR } from '../../utils/constants';

export default function GeoBarChart({ data }) {
  const [view, setView] = useState('provinsi'); // provinsi or kota

  const chartData = useMemo(() => {
    const key = view === 'provinsi' ? 'Provinsi' : 'Kota/Kabupaten';
    const aggregated = aggregateBy(data, key, ['Total Pembayaran', 'Jumlah']);
    
    // Sort logic to get top 10
    return aggregated
      .map(item => ({
        name: item[key].replace('KAB. ', '').replace('KOTA ', ''),
        revenue: item['Total Pembayaran'],
        orders: item._count
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [data, view]);

  return (
    <ChartCard 
      title={`Top 10 ${view === 'provinsi' ? 'Provinsi' : 'Kota'}`}
      chartType="Horizontal Bar Chart (Diagram Batang Mendatar)"
      purpose="Memformulasikan peta kekuatan regional. Mengidentifikasi lokasi di mana produk Anda memiliki 'product-market fit' terbaik."
      dataDef="Sumbu Y memuat nama Provinsi/Kota yang paling aktif, sedangkan Sumbu X melambangkan nilai rupiah kontribusinya. Dibatasi hanya 10 teratas."
      formula={`SUM(Total Pembayaran) di-grouping per ${view === 'provinsi' ? 'Provinsi' : 'Kota/Kabupaten'}, lalu diurutkan dari nilai terbesar (DESC) dengan limit 10.`}
      insight={`${chartData[0]?.name} merajai pendapatan dengan margin yang biasanya sangat jauh dibanding peringkat ke-2 dan ke-3.`}
      tips={`Arahkan 80% budget Ads (Facebook/Tiktok) Anda hanya ke 3 besar kota mendominasi ini. Buat konten yang sangat lokal/relate dengan bahasa daerah mereka!`}
      dataSummary={JSON.stringify(chartData)}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-end mb-4">
          <div className="bg-secondary rounded-lg p-1 flex text-xs border border-border">
            <button 
              className={`px-3 py-1 rounded-md transition-colors ${view === 'provinsi' ? 'bg-blue-500 text-white' : 'text-[hsl(var(--muted-foreground))] hover:text-foreground'}`}
              onClick={() => setView('provinsi')}
            >
              Provinsi
            </button>
            <button 
              className={`px-3 py-1 rounded-md transition-colors ${view === 'kota' ? 'bg-blue-500 text-white' : 'text-[hsl(var(--muted-foreground))] hover:text-foreground'}`}
              onClick={() => setView('kota')}
            >
              Kota
            </button>
          </div>
        </div>

        <div className="flex-1 w-full min-h-[450px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={450}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={120} 
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--muted))' }}
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                formatter={(value) => [formatIDR(value), 'Pendapatan']}
              />
              <Bar 
                dataKey="revenue" 
                radius={[0, 4, 4, 0]} 
                barSize={20}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 0 ? COLORS.amber : COLORS.indigo} 
                    fillOpacity={1 - (index * 0.05)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ChartCard>
  );
}
