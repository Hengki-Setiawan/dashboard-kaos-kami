import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import ChartCard from '../UI/ChartCard';
import { formatCompact, formatIDR, COLORS } from '../../utils/constants';

export default function WeeklyTrend({ data }) {
  const chartData = useMemo(() => {
    // Group by week (using simple ISO week logic or grouping by 7-day windows)
    const weeklyData = {};
    
    data.forEach(item => {
      const dateStr = item['Waktu Pesanan Dibuat'];
      if (!dateStr) return;
      const date = new Date(dateStr);
      
      // Get the week number and year
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
      const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
      
      const key = `W${weekNumber} '${date.getFullYear().toString().substring(2)}`;
      
      if (!weeklyData[key]) {
        weeklyData[key] = {
          name: key,
          weekNum: weekNumber,
          revenue: 0
        };
      }
      
      weeklyData[key].revenue += parseFloat(item['Total Pembayaran']) || 0;
    });
    
    return Object.values(weeklyData).sort((a, b) => a.weekNum - b.weekNum);
  }, [data]);

  return (
    <ChartCard 
      title="Tren Mingguan"
      chartType="Area Chart (Grafik Area Halus)"
      purpose="Mendeteksi fluktuasi (naik-turun) omset dalam rentang waktu pendek mingguan untuk melihat efektivitas program taktis."
      dataDef="Sumbu horisontal adalah urutan minggu (W1, W2, dst). Sumbu vertikal menandakan jumlah revenue kotor mingguan."
      formula="Setiap pesanan di-mapping ke ISO Week. Lalu dihitung SUM(Total Pembayaran) untuk setiap minggu."
      insight="Granularitas mingguan lebih jelas menampilkan lonjakan (spike) pendapatan harian yang tidak terlihat di chart bulanan."
      tips="Jangan biarkan stok menipis di minggu-minggu akhir bulan (payday). Lonjakan mingguan selalu berkorelasi dengan payday."
      dataSummary={JSON.stringify(chartData)}
    >
      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.cyan} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={COLORS.cyan} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="hsl(var(--muted-foreground))" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            dy={10}
            minTickGap={15}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))" 
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => formatCompact(value)}
            axisLine={false}
            tickLine={false}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }}
            formatter={(value) => [formatIDR(value), 'Pendapatan']}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke={COLORS.cyan} 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
