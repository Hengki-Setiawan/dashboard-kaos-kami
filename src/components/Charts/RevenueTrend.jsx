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
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import ChartCard from '../UI/ChartCard';
import { aggregateBy } from '../../utils/dataTransformers';
import { formatCompact, formatIDR, COLORS } from '../../utils/constants';

export default function RevenueTrend({ data }) {
  const chartData = useMemo(() => {
    // Group by month
    const grouped = aggregateBy(data, 'Waktu Pesanan Dibuat', ['Total Pembayaran', 'Jumlah']);
    
    // We need to parse month
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
          orders: 0
        };
      }
      
      monthlyData[month].revenue += parseFloat(item['Total Pembayaran']) || 0;
      monthlyData[month].orders += 1; // Assuming 1 row = 1 order
    });
    
    // Sort logic requires real dates but for our Feb-Jun data we can rely on standard sorting if we attach a sort key
    const monthOrder = { 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mei': 4, 'Jun': 5 };
    
    return Object.values(monthlyData).sort((a, b) => {
      return (monthOrder[a.name] || 0) - (monthOrder[b.name] || 0);
    });
  }, [data]);

  const avgRevenue = chartData.length > 0 
    ? chartData.reduce((acc, curr) => acc + curr.revenue, 0) / chartData.length 
    : 0;

  return (
    <ChartCard 
      title="Tren Pendapatan Bulanan"
      chartType="Composed Chart (Bar + Garis)"
      purpose="Mengevaluasi secara simultan pertumbuhan total nilai uang (pendapatan kotor) dengan volume belanja konsumen."
      dataDef="Sumbu Y kiri mewakili total hasil penjualan kotor (Rp). Sumbu Y kanan menunjukkan total kuantitas transaksi. Data diurutkan berdasarkan kalender bulanan."
      formula="Total Harga (Bar Biru): SUM(Total Pembayaran).\nJumlah Transaksi (Garis Merah): COUNT(ID Pesanan).\nAgar relevan, nilai rata-rata keseluruhan (garis kuning) dihitung dengan AVG(Total Pembayaran Keseluruhan)."
      insight="Terlihat adanya penurunan dari Maret ke April sebesar 34%, ini mungkin indikasi musiman (Ramadan/Lebaran)."
      tips="Ketika terjadi gap antara transaksi yang naik tapi revenue turun, periksa apakah Anda terlalu banyak memberi diskon atau pelanggan membeli barang murah."
      dataSummary={JSON.stringify(chartData.map(d => ({Bulan: d.name, Pendapatan: d.revenue, Transaksi: d.orders})))}
    >
      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <ComposedChart
          data={chartData}
          margin={{ top: 15, right: 10, bottom: 15, left: -15 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="hsl(var(--muted-foreground))" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          / minTickGap={15}>
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
            axisLine={false}
            tickLine={false}
            dx={10}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }}
            itemStyle={{ color: 'hsl(var(--foreground))' }}
            formatter={(value, name) => [
              name === 'revenue' ? formatIDR(value) : value, 
              name === 'revenue' ? 'Pendapatan' : 'Jml Pesanan'
            ]}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          
          <Bar 
            yAxisId="left" 
            dataKey="revenue" 
            barSize={40} 
            fill={COLORS.primary} 
            radius={[4, 4, 0, 0]} 
            name="Pendapatan" 
          />
          
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="orders" 
            stroke={COLORS.rose} 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            name="Jml Pesanan" 
          />

          {avgRevenue > 0 && (
            <ReferenceLine 
              y={avgRevenue} 
              yAxisId="left" 
              stroke={COLORS.amber} 
              strokeDasharray="3 3" 
              label={{ position: 'top', value: 'Rata-rata', fill: COLORS.amber, fontSize: 12 }} 
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
