import { useMemo } from 'react';
import { 
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
import { COLOR_PALETTE } from '../../utils/constants';

export default function SizeDistribution({ data }) {
  const chartData = useMemo(() => {
    // We want to see cross-tab: Product X Size
    const sizeMap = {};
    const productNames = new Set();
    
    data.forEach(item => {
      let sizeRaw = item['Nama Variasi'];
      const productRaw = item['Nama Produk'];
      const qty = parseInt(item['Jumlah']) || 0;
      
      if (!sizeRaw || !productRaw) return;
      
      // Clean up the size (e.g. "Ukuran: XL" -> "XL")
      const sizeStr = sizeRaw.toLowerCase().replace('ukuran:', '').trim().toUpperCase();
      const productStr = productRaw.replace('Kaos Kami ', '').trim();
      
      productNames.add(productStr);
      
      if (!sizeMap[sizeStr]) {
        sizeMap[sizeStr] = { name: sizeStr, total: 0 };
      }
      
      if (!sizeMap[sizeStr][productStr]) {
        sizeMap[sizeStr][productStr] = 0;
      }
      
      sizeMap[sizeStr][productStr] += qty;
      sizeMap[sizeStr].total += qty;
    });
    
    const sizes = Object.values(sizeMap).sort((a, b) => b.total - a.total);
    return { sizes, products: Array.from(productNames) };
  }, [data]);

  const { sizes, products } = chartData;

  // Custom Tooltip function to show total as well
  const renderTooltip = (props) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      const total = payload.reduce((acc, curr) => acc + curr.value, 0);
      return (
        <div className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] p-3 rounded-lg shadow-lg">
          <p className="font-bold border-b border-[hsl(var(--border))] pb-2 mb-2">Ukuran: {label} (Total: {total})</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value} pcs
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ChartCard 
      title="Distribusi Ukuran"
      chartType="Stacked Column Chart (Diagram Kolom Bertumpuk)"
      purpose="Panduan krusial bagi PPIC (Production Planning) & Pembelian. Menurunkan risiko salah sablon ukuran baju mati (dead stock)."
      dataDef="Sumbu horizontal (S, M, L, XL, XXL) adalah standar ukuran. Warna-warni di dalamnya menandakan pembagian untuk masing-masing varian desain produk."
      formula="SUM(Jumlah Unit Terjual) diagregasikan secara Cross-Tab antara 'Ukuran' dan 'Nama Produk'."
      insight="Varian ukuran L ke atas mendominasi hampir seluruh pasar kaos lokal saat ini."
      tips="Saat melakukan PO massal ke penjahit/pabrik, patuhi kaidah hukum Paretto. Kurangi atau hapus sama sekali PO untuk ukuran ekstrem (XS, XXL) jika stok lamanya mengendap lama."
      dataSummary={JSON.stringify(sizes.slice(0, 4))}
    >
      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <BarChart
          data={sizes}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="name" 
            stroke="hsl(var(--muted-foreground))" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))" 
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
            dx={-10}
          />
          <Tooltip content={renderTooltip} cursor={{ fill: 'hsl(var(--muted))' }} />
          <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
          
          {products.map((prod, index) => (
            <Bar 
              key={prod} 
              dataKey={prod} 
              stackId="a" 
              fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} 
              radius={index === products.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} 
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
