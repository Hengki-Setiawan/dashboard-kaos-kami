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
import { COLORS } from '../../utils/constants';

export default function WeightAnalysis({ data }) {
  const chartData = useMemo(() => {
    // Generate weight buckets mapping Total Berat -> Count
    // Usually weights are strings like "300 gr" or "0.5 kg"
    // Our excel seems to have "Total Berat produk" in grams
    const buckets = {
      '0-250g': 0,
      '251-500g': 0,
      '501-1000g': 0,
      '> 1000g': 0
    };
    
    data.forEach(item => {
      const weightRaw = item['Total Berat'];
      if (!weightRaw) return;
      
      const wGramStr = String(weightRaw).toLowerCase().replace('gr', '').replace('g', '').trim();
      const weight = parseFloat(wGramStr);
      
      if (isNaN(weight)) return;

      if (weight <= 250) buckets['0-250g']++;
      else if (weight <= 500) buckets['251-500g']++;
      else if (weight <= 1000) buckets['501-1000g']++;
      else buckets['> 1000g']++;
    });

    return [
      { name: '0-250g', orders: buckets['0-250g'] },
      { name: '251-500g', orders: buckets['251-500g'] },
      { name: '501-1kg', orders: buckets['501-1000g'] },
      { name: '> 1kg', orders: buckets['> 1000g'] }
    ];
  }, [data]);

  return (
    <ChartCard 
      title="Distribusi Berat Paket"
      chartType="Area Chart (Diagram Lahan)"
      purpose="Analisis efisiensi Logistik & Volume. Melihat batas kewajaran pembeli belanja borongan tanpa harus kena charge kurir berlebih."
      dataDef="Membagi ukuran fisik kemasan paket ke dalam ember (bucket) klasifikasi mulai dari ringan (<250g) hingga paket super gempal (> 1 KG)."
      formula="Membersihkan string 'gr' pada kolom Total Berat dan mengkonversi jadi desimal IF kondisi tertentu (<=250, dst)."
      insight="Mayoritas pembeli berhenti belanja saat trolinya menyentuh angka keramat ~1 kilogram. Mereka fobia terkena kelipatan ongkir berat kedua."
      tips="Sihir Psikologis Tambah Omset: Tulis 'Beli 3 Kaos tetep dihitung 1 KG!'. Ini trik legendaris untuk cross-selling mempromosikan bundling jumlah agar cuan meledak."
      dataSummary={JSON.stringify(chartData)}
    >
      <div className="w-full h-full min-h-[250px] pt-4">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.orange} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS.orange} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            minTickGap={15} />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value) => [value, 'Pesanan']}
            />
            <Area 
              type="monotone" 
              dataKey="orders" 
              stroke={COLORS.orange} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorWeight)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
