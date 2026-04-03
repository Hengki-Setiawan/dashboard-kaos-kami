import { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import ChartCard from '../UI/ChartCard';
import { formatCompact, formatIDR, COLORS } from '../../utils/constants';

export default function ProfitMargin({ data }) {
  const chartData = useMemo(() => {
    // Simulasi COGS (Harga Pokok Penjualan)
    // Berdasarkan info harga awal berkisar 100rb-150rb, kita asumsikan base HPP adalah 60% dari Harga Awal 
    // untuk menggambarkan laba kotor sebelum dipotong fee admin shopee dll.
    
    const monthlyData = {};
    
    data.forEach(item => {
      const dateStr = item['Waktu Pesanan Dibuat'];
      if (!dateStr) return;
      const date = new Date(dateStr);
      const month = date.toLocaleString('id-ID', { month: 'short' });
      
      if (!monthlyData[month]) {
        monthlyData[month] = {
          name: month,
          revenue: 0,
          cogs: 0,
          grossProfit: 0,
          margin: 0
        };
      }
      
      const totalBayar = parseFloat(item['Total Pembayaran']) || 0;
      const hargaAwal = parseFloat(item['Harga Awal']) || 0;
      
      // Asumsi COGS 60% dari Base Price. Jika Harga Awal tidak tersedia, fallback ke 1.5x Total Pembayaran
      const fallbackHargaAwal = totalBayar * 1.5;
      const cogs = (hargaAwal > 0 ? hargaAwal : fallbackHargaAwal) * 0.6;
      
      monthlyData[month].revenue += totalBayar;
      monthlyData[month].cogs += cogs;
    });
    
    const monthOrder = { 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mei': 4, 'Jun': 5 };
    
    return Object.values(monthlyData).map(m => {
      // Calculate Gross Profit and Margin %
      m.grossProfit = m.revenue - m.cogs;
      m.margin = m.revenue > 0 ? (m.grossProfit / m.revenue) * 100 : 0;
      return m;
    }).sort((a, b) => {
      return (monthOrder[a.name] || 0) - (monthOrder[b.name] || 0);
    });
  }, [data]);

  return (
    <ChartCard 
      title="Estimasi Laba Kotor (Perkiraan Margin)"
      chartType="Composed Chart (Bar + Garis Persentase)"
      purpose="Indikator kebebasan finansial bisnis. Volume/Omset besar tidak ada gunanya jika garis kuning (Margin Laba) Anda menipis habis dimakan promo."
      dataDef="Bar Hijau (Revenue), Biru (Laba Bersih). Garis Kuning (Persen ROI Laba). Diasumsikan HPP/Modal kaos adalah 60% dari Harga Coret."
      formula="Laba = (Total Pembayaran) - (Harga Dasar × 60%). Margin = Laba / Total Omset."
      insight="Ini fenomena mematikan: Ketika bulan promo besar, revenue (biru) melesat naik, tapi persentase margin (Garis Kuning) jatuh! Penyakit 'bakar uang' murni."
      tips="Berhenti subsidi diskon besar-besaran! Margin ideal jualan baju minimal >30%. Gunakan skema Bundling 'Buy 2 Get 1 Free Aksesoris' agar Margin tetap tebal."
      dataSummary={JSON.stringify(chartData)}
    >
      <div className="w-full h-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            minTickGap={15} />
            <YAxis 
              yAxisId="left" 
              stroke="hsl(var(--muted-foreground))" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              tickFormatter={(value) => formatCompact(value)}
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="hsl(var(--muted-foreground))" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              tickFormatter={(val) => `${val.toFixed(0)}%`}
              axisLine={false}
              tickLine={false}
              dx={10}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value, name) => {
                if (name === 'Margin %' || name === 'margin') return [`${value.toFixed(1)}%`, 'Margin Laba'];
                if (name === 'Pendapatan' || name === 'revenue') return [formatIDR(value), 'Pendapatan'];
                if (name === 'Laba Kotor' || name === 'grossProfit') return [formatIDR(value), 'Laba Kotor'];
                return [value, name];
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '11px' }} />
            
            <Bar 
              yAxisId="left" 
              dataKey="revenue" 
              barSize={20} 
              fill={COLORS.primary} 
              radius={[4, 4, 0, 0]} 
              name="Pendapatan" 
            />
            
            <Bar 
              yAxisId="left" 
              dataKey="grossProfit" 
              barSize={20} 
              fill={COLORS.green} 
              radius={[4, 4, 0, 0]} 
              name="Laba Kotor" 
            />
            
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="margin" 
              stroke={COLORS.amber} 
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--background))' }}
              name="Margin %" 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
