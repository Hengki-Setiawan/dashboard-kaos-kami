import { useMemo } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import ChartCard from '../UI/ChartCard';
import { COLORS } from '../../utils/constants';

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function DayOfWeek({ data }) {
  const chartData = useMemo(() => {
    const daysCount = [
      { name: 'Minggu', orders: 0 },
      { name: 'Senin', orders: 0 },
      { name: 'Selasa', orders: 0 },
      { name: 'Rabu', orders: 0 },
      { name: 'Kamis', orders: 0 },
      { name: 'Jumat', orders: 0 },
      { name: 'Sabtu', orders: 0 },
    ];
    
    data.forEach(item => {
      const dateStr = item['Waktu Pesanan Dibuat'];
      if (!dateStr) return;
      const date = new Date(dateStr);
      daysCount[date.getDay()].orders++;
    });

    return daysCount;
  }, [data]);

  return (
    <ChartCard 
      title="Performa Hari dalam Seminggu"
      className="lg:col-span-1"
      chartType="Radar Chart (Diagram Jaring Laba-Laba)"
      purpose="Visualisasi keseimbangan rentang harian. Titik yang tertarik keluar menandakan hari terkuat, titik yang menyusut ke dalam adalah hari terlemah."
      dataDef="Ketujuh ujung mewakili hari (Senin-Minggu). Semakin jauh garis warna ditarik menjauhi pusat, semakin tinggi volume pesanannya."
      formula="COUNT(Waktu Pesanan Dibuat) diagregasi berdasarkan index hari (0=Minggu, 6=Sabtu)."
      insight="Radar chart dengan sangat tegas menunjukkan asimetri penjualan Anda; akhir pekan (Sabtu-Minggu) menang telak melawan hari biasa."
      tips="Aktifkan program 'Mid-Week Crisis Promo' (Diskon khusus Rabu/Kamis) jika salah satu sumbu radar terlihat cacat/melemah parah."
      dataSummary={JSON.stringify(chartData)}
    >
      <div className="w-full h-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis 
              dataKey="name" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} 
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 'auto']} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Radar
              name="Jumlah Pesanan"
              dataKey="orders"
              stroke={COLORS.indigo}
              fill={COLORS.indigo}
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
