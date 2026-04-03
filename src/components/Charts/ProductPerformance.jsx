import { useMemo, useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import ChartCard from '../UI/ChartCard';
import { aggregateBy } from '../../utils/dataTransformers';
import { COLOR_PALETTE, formatIDR } from '../../utils/constants';

export default function ProductPerformance({ data }) {
  const [activeSegment, setActiveSegment] = useState('revenue'); // revenue or orders

  const chartData = useMemo(() => {
    const aggregated = aggregateBy(data, 'Nama Produk', ['Total Pembayaran', 'Jumlah']);
    
    return aggregated.map(item => ({
      name: item['Nama Produk'].replace('Kaos Kami ', '').trim(), // Simplify long names
      fullName: item['Nama Produk'],
      revenue: item['Total Pembayaran'],
      orders: item._count,
      units: item['Jumlah']
    })).sort((a, b) => b[activeSegment] - a[activeSegment]);
  }, [data, activeSegment]);

  return (
    <ChartCard 
      title="Performa Produk"
      chartType="Pie Chart & Horizontal Bar Chart"
      purpose="Mengidentifikasi produk 'Pahlawan' (Hero Products) pembawa omset terbesar vs produk ampas (Dead Stock)."
      dataDef="Berisi 2 jenis grafik; Donut untuk melihat porsi pangsa pasar penjualan. Bar untuk melihat murni adu balap total nilai barang."
      formula="SUM(Total Pembayaran) dan SUM(Jumlah) dipisah (grouping) berdasarkan Nama Produk."
      insight={`Produk paling laris adalah ${chartData[0]?.name} yang menyumbang mayoritas penjualan toko.`}
      tips="Jika lingkaran donat dikuasai 1 warna (1 produk dominan), bisnis Anda rawan kolaps jika suplai produk tersebut terhenti. Mulailah riset varian baru."
      dataSummary={JSON.stringify(chartData.slice(0, 5))}
    >
      <div className="flex flex-col h-full w-full">
        <div className="flex justify-end mb-4">
          <div className="bg-secondary rounded-lg p-1 flex text-xs border border-border">
            <button 
              className={`px-3 py-1 rounded-md transition-colors ${activeSegment === 'revenue' ? 'bg-blue-500 text-white' : 'text-[hsl(var(--muted-foreground))] hover:text-foreground'}`}
              onClick={() => setActiveSegment('revenue')}
            >
              Pendapatan
            </button>
            <button 
              className={`px-3 py-1 rounded-md transition-colors ${activeSegment === 'units' ? 'bg-blue-500 text-white' : 'text-[hsl(var(--muted-foreground))] hover:text-foreground'}`}
              onClick={() => setActiveSegment('units')}
            >
              Unit Terjual
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-[300px]">
          {/* Donut Chart */}
          <div className="flex-1 h-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey={activeSegment}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  formatter={(value) => activeSegment === 'revenue' ? formatIDR(value) : value}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Bar Chart */}
          <div className="flex-1 h-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                <XAxis type="number" hide / minTickGap={15}>
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100} 
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + '...' : val}
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  formatter={(value) => [activeSegment === 'revenue' ? formatIDR(value) : value, 'Total']}
                />
                <Bar 
                  dataKey={activeSegment} 
                  radius={[0, 4, 4, 0]} 
                  barSize={20}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}
