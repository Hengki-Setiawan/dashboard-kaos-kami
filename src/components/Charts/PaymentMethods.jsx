import { useMemo } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import ChartCard from '../UI/ChartCard';
import { aggregateBy } from '../../utils/dataTransformers';
import { COLOR_PALETTE, formatIDR } from '../../utils/constants';

export default function PaymentMethods({ data }) {
  const chartData = useMemo(() => {
    const aggregated = aggregateBy(data, 'Metode Pembayaran', ['Total Pembayaran']);
    
    return aggregated.map(item => ({
      name: item['Metode Pembayaran'],
      revenue: item['Total Pembayaran'],
      orders: item._count
    })).sort((a, b) => b.orders - a.orders);
  }, [data]);

  const totalOrders = chartData.reduce((acc, curr) => acc + curr.orders, 0);

  return (
    <ChartCard 
      title="Distribusi Metode Pembayaran"
      chartType="Donut Chart & Tabel Klasifikasi"
      purpose="Memahami psikologi dompet pelanggan. Menunjukkan tingkat kepercayaan/resiko konsumen bertransaksi di toko Anda."
      dataDef="Donut mewakili persentase penggunaan (COD vs Bayar Langsung), disandingkan dengan detail tabel omset murni dari setiap metode."
      formula="COUNT(Metode Pembayaran) dari kolom data asli dibandingkan proporsinya (pembagian) dengan grand total baris."
      insight={chartData.length > 0 ? `Konsumen COD masih menyumbang rasio sangat krusial. Ini menandakan banyak audiens menengah ke bawah atau new-buyer yang belum percaya penuh.` : ""}
      tips="Pertimbangkan untuk 'mematikan' fitur COD jika Margin Produk terlalu menipis (rawan hancur jika paket retur) atau packing barangnya sulit."
      dataSummary={JSON.stringify(chartData)}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 w-full min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="orders"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                formatter={(value, name, props) => {
                  const percent = ((value / totalOrders) * 100).toFixed(1);
                  return [`${value} pesanan (${percent}%)`, 'Jumlah'];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 bg-secondary rounded-lg overflow-x-auto border border-border shrink-0 max-h-[200px] overflow-y-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-secondary text-[hsl(var(--muted-foreground))] sticky top-0 z-10">
              <tr>
                <th className="py-2 px-3 font-medium">Metode</th>
                <th className="py-2 px-3 font-medium text-right">Pesanan</th>
                <th className="py-2 px-3 font-medium text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))]">
              {chartData.map((row, i) => (
                <tr key={i} className="hover:bg-secondary transition-colors">
                  <td className="py-2 px-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLOR_PALETTE[i % COLOR_PALETTE.length] }}></span>
                    <span className="truncate max-w-[120px]">{row.name}</span>
                  </td>
                  <td className="py-2 px-3 text-right">{row.orders}</td>
                  <td className="py-2 px-3 text-right">{formatIDR(row.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ChartCard>
  );
}
