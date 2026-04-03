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
import { COLOR_PALETTE, formatIDR } from '../../utils/constants';

export default function CustomerSegment({ data }) {
  const { chartData, topSpenders, oneTime, repeat } = useMemo(() => {
    const customerMap = {};
    
    data.forEach(item => {
      const cust = item['Username (Pembeli)'];
      const revenue = parseFloat(item['Total Pembayaran']) || 0;
      if (!cust) return;
      
      if (!customerMap[cust]) {
        customerMap[cust] = { name: cust, orders: 0, revenue: 0 };
      }
      customerMap[cust].orders += 1;
      customerMap[cust].revenue += revenue;
    });

    const customers = Object.values(customerMap);
    
    // Segmentation: 1x vs 2x+
    let oneTime = 0;
    let repeat = 0;
    
    customers.forEach(c => {
      if (c.orders > 1) repeat++;
      else oneTime++;
    });

    const segments = [
      { name: 'Satu Kali Beli', value: oneTime },
      { name: 'Lebih dari Sekali', value: repeat }
    ];

    // Top 5 Spenders
    const top = customers.sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    return { chartData: segments, topSpenders: top, oneTime, repeat };
  }, [data]);

  return (
    <ChartCard 
      title="Segmentasi Pelanggan"
      chartType="Pie Chart & Top Table"
      purpose="Menakar seberapa 'setia' pembeli Anda (Customer Loyalty) dan mengenali 'Cetak Biru' pembeli premium yang paling jor-joran belanja."
      dataDef="Donut Chart secara sederhana melacak rasio 1 kali VS 2 kali pembelian. Sedang di bawahnya disajikan daftar riwayat Sultan."
      formula="Grouping nama Username, hitung transaksi. Jika = 1 (Baru), jika > 1 (Repeat)."
      insight="Jika warna porsi 'Satu Kali Beli' sangat besar hingga nyaris utuh, marketing Anda sukses jaring mangsa baru tapi gagal buat mereka rindu produk Anda."
      tips="Identifikasi nama ke-5 Sultan di Top Spender, lalu diam-diam kirimi mereka Merchandise/Gift tak terduga ke alamat lamanya. Garansi repeat order seumur hidup!"
      dataSummary={JSON.stringify({ oneTime, repeat, topSpenders })}
    >
      <div className="flex flex-col h-full w-full">
        <div className="flex-1 w-full min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? COLOR_PALETTE[0] : COLOR_PALETTE[3]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                formatter={(value) => [`${value} Orang`, 'Jumlah']}
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-2 bg-secondary rounded-lg border border-border p-3">
          <h4 className="text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-2">🏆 Top 5 Spender</h4>
          <div className="space-y-2">
            {topSpenders.map((cust, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="truncate max-w-[120px] font-medium" title={cust.name}>{cust.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[hsl(var(--muted-foreground))]">{cust.orders}x</span>
                  <span className="text-emerald-600 font-medium min-w-[70px] text-right">{formatIDR(cust.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ChartCard>
  );
}
