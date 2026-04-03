import { useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import ChartCard from '../UI/ChartCard';
import { aggregateBy } from '../../utils/dataTransformers';
import { COLORS, formatIDR } from '../../utils/constants';

export default function ParetoChart({ data }) {
  const chartData = useMemo(() => {
    // Need top products by revenue to calculate 80/20 rule
    const aggregated = aggregateBy(data, 'Nama Produk', ['Total Pembayaran']);
    const sortedDetails = aggregated
      .map(item => ({
        name: item['Nama Produk'].replace('Kaos Kami ', '').trim(),
        revenue: item['Total Pembayaran']
      }))
      .sort((a, b) => b.revenue - a.revenue);

    const totalRevenue = sortedDetails.reduce((acc, curr) => acc + curr.revenue, 0);

    let cumulativeRevenue = 0;
    return sortedDetails.map((item, index) => {
      cumulativeRevenue += item.revenue;
      const cumulativePercent = totalRevenue > 0 ? (cumulativeRevenue / totalRevenue) * 100 : 0;
      return {
        ...item,
        cumulativePercent,
        isPareto: cumulativePercent <= 80
      };
    }).slice(0, 15); // Show only top 15 to keep chart legible
  }, [data]);

  return (
    <ChartCard 
      title="Prinsip Pareto Produk (Aturan 80/20)"
      className="lg:col-span-2"
      chartType="Pareto Composed (Bar + Kumulatif Line)"
      purpose="Menganalisis teori Pareto: Apakah terbukti bahwa 80% kekayaan toko Anda secara eksklusif dihasilkan hanya oleh 20% varian produk?"
      dataDef="Bar Biru: Omset tunggal per produk. Garis Kuning: Penjumlahan dari persen omset (kumulatif). Batas kiri adah produk paling laris, ke kanan makin jelek."
      formula="Menghitung total dari [Omset Produk A + B + C...] dan membaginya dengan [Total Keseluruhan] hingga mencapai garis potong di 80%."
      insight="Sangat umum terjadi! Hanya segelintir produk di sisi kiri grafik yang menghidupi ratusan produk sampah (dead-stock) yang mengendap di rak."
      tips="Fokuskan Modal! Anda bisa menghemat jutaan rupiah dengan menyetop impor/produksi barang di ekor kanan grafik ini tanpa berdampak besar pada revenue bulanan."
      dataSummary={JSON.stringify(chartData)}
    >
      <div className="w-full h-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-45}
              textAnchor="end"
            />
            <YAxis 
              yAxisId="left" 
              stroke="hsl(var(--muted-foreground))" 
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => formatIDR(value).replace('Rp', '')}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="hsl(var(--muted-foreground))" 
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(val) => `${val.toFixed(0)}%`}
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value, name) => {
                if (name === 'Pendapatan Individu' || name === 'revenue') return [formatIDR(value), 'Pendapatan'];
                if (name === 'Kumulatif (%)' || name === 'cumulativePercent') return [`${value.toFixed(1)}%`, 'Persen Kumulatif'];
                return [value, name];
              }}
            />
            
            <Bar 
              yAxisId="left" 
              dataKey="revenue" 
              name="Pendapatan Individu" 
              barSize={20}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isPareto ? COLORS.primary : 'hsl(var(--muted))'} 
                />
              ))}
            </Bar>
            
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="cumulativePercent" 
              stroke={COLORS.amber} 
              strokeWidth={3}
              dot={{ r: 3 }}
              name="Kumulatif (%)" 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
