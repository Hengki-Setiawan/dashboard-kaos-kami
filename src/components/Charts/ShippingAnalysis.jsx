import { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import ChartCard from '../UI/ChartCard';
import { aggregateBy } from '../../utils/dataTransformers';
import { COLORS } from '../../utils/constants';

export default function ShippingAnalysis({ data }) {
  const { chartData, pickupData } = useMemo(() => {
    const aggregated = aggregateBy(data, 'Opsi Pengiriman', ['Perkiraan Ongkos Kirim']);
    
    const shortenName = (name) => {
      if (!name) return '';
      return name
        .replace(/\(Cashless\)/gi, '')
        .replace(/Standard/gi, 'Std')
        .replace(/Express/gi, 'Exp')
        .replace(/Reguler/gi, 'Reg')
        .replace(/Anteraja/gi, 'Anteraja')
        .replace(/SiCepat/gi, 'SiCepat')
        .replace(/Indopaket \(Ambil di Indomaret\)/gi, 'Indopaket')
        .replace(/\s+/g, ' ')
        .trim();
    };

    const couriers = aggregated.map(item => ({
      name: shortenName(item['Opsi Pengiriman']),
      avgFee: item['Perkiraan Ongkos Kirim'] / item._count,
      orders: item._count
    })).sort((a, b) => b.orders - a.orders);
    
    // Antar counter vs pickup
    const pickupTypeInfo = aggregateBy(data, 'Antar ke counter/ pick-up', []);
    const pickupChart = pickupTypeInfo.map((item, idx) => ({
      name: item['Antar ke counter/ pick-up'].replace('Sistem ', ''),
      value: item._count,
      fill: idx === 0 ? COLORS.primary : COLORS.amber
    }));

    return { chartData: couriers, pickupData: pickupChart };
  }, [data]);

  return (
    <ChartCard 
      title="Analisis Jasa Ekspedisi Logistik"
      chartType="Bar Chart Interaktif & Mini Donut"
      purpose="Audit efisiensi Supply Chain. Memantau mitra kurir mana yang paling dipercaya pelanggan, serta evaluasi kemalasan admin melalui rasio Antar/Pickup."
      dataDef="Menampilkan jasa pengiriman (Reguler/Ekonomi) yang terurut berdasarkan order. Terdapat mini-diagram rasio antara admin kurir menjemput barang (Pickup) atau admin Drop-off."
      formula="Mengelompokkan isi dataset `Opsi Pengiriman`, menghitung Average ongkir dan order Count."
      insight="Pengiriman 'Reguler (Cashless)' sangat mendominasi. Ini artinya konsumen rela bayar 30% lebih asalkan produk tiba lusa dibanding opsi 'Hemat' yang makan waktu seminggu."
      tips="Ubah prioritas kurir default di akun toko Anda ke JNT atau SPX Reguler untuk menekan waktu Transit seminimal mungkin."
      dataSummary={JSON.stringify({ chartData, pickupData })}
    >
      <div className="flex flex-col h-full gap-4">
        
        {/* Courier Horizontal Bar */}
        <div className="flex-1 w-full min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
              <XAxis type="number" hide minTickGap={15} />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={110} 
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--muted))' }}
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                formatter={(value, name) => [value, name === 'orders' ? 'Pesanan' : 'Avg Ongkir']}
              />
              <Bar 
                dataKey="orders" 
                radius={[0, 4, 4, 0]} 
                barSize={20}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS.indigo} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Counter vs Pickup Mini Pie */}
        <div className="bg-secondary rounded-lg p-3 border border-border flex items-center justify-between">
          <div className="text-sm">
            <p className="text-[hsl(var(--muted-foreground))] mb-1">Metode Pengiriman:</p>
            {pickupData.map(p => (
              <div key={p.name} className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.fill }}></span>
                <span className="font-semibold text-foreground">{p.value}</span>
                <span className="text-xs">{p.name}</span>
              </div>
            ))}
          </div>
          <div className="w-24 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pickupData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={35}
                  dataKey="value"
                  stroke="none"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '10px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
    </ChartCard>
  );
}
