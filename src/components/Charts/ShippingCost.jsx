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
import { formatCompact, formatIDR, COLORS } from '../../utils/constants';

export default function ShippingCost({ data }) {
  const chartData = useMemo(() => {
    // Group by month
    const monthlyData = {};
    
    data.forEach(item => {
      const dateStr = item['Waktu Pesanan Dibuat'];
      if (!dateStr) return;
      const date = new Date(dateStr);
      const month = date.toLocaleString('id-ID', { month: 'short' });
      
      if (!monthlyData[month]) {
        monthlyData[month] = {
          name: month,
          pembeli: 0,
          subsidi: 0,
          total: 0
        };
      }
      
      const buyerFee = parseFloat(item['Ongkos Kirim Dibayar oleh Pembeli']) || 0;
      const shopeeSubsidy = parseFloat(item['Estimasi Potongan Biaya Pengiriman']) || 0;
      
      monthlyData[month].pembeli += buyerFee;
      monthlyData[month].subsidi += shopeeSubsidy;
      monthlyData[month].total += (buyerFee + shopeeSubsidy);
    });
    
    const monthOrder = { 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mei': 4, 'Jun': 5 };
    
    return Object.values(monthlyData).sort((a, b) => {
      return (monthOrder[a.name] || 0) - (monthOrder[b.name] || 0);
    });
  }, [data]);

  // Kalkulasi Free Ongkir Rate (Pesanan yang ongkir dibayar pembeli = 0 & subsidi > 0)
  const freeOngkirRate = useMemo(() => {
    if (!data.length) return 0;
    const freeOrders = data.filter(item => {
      const buyerFee = parseFloat(item['Ongkos Kirim Dibayar oleh Pembeli']) || 0;
      const shopeeSubsidy = parseFloat(item['Estimasi Potongan Biaya Pengiriman']) || 0;
      return buyerFee === 0 && shopeeSubsidy > 0;
    }).length;
    
    return ((freeOrders / data.length) * 100).toFixed(1);
  }, [data]);

  return (
    <ChartCard 
      title="Beban Ongkos Kirim (Bantuan Platform)"
      chartType="Stacked Bar Chart (Diagram Bertumpuk)"
      purpose="Memvalidasi apakah Anda sukses 'mengeruk / memanfaatkan' program subsidi/Xtra Ongkir yang diselenggarakan oleh Platform (Shopee) secara maksimal."
      dataDef="Bar biru = Ongkir mosi yang dibayar real (cash) oleh customer. Bar hijau = Potongan siluman yang rela dibayarkan oleh Aplikasi Shopee untuk subsidi customer."
      formula="Akumulasi bulanan SUM(Ongkos Bayar Pembeli) menumpuk dengan SUM(Nilai Subsidi/Diskon)."
      insight={`Tingkat Gratis Penuh mencapai angka emas ${freeOngkirRate}%. Artinya customer benar-benar di-spoiled (dimanjakan) secara finansial oleh iklim platform masa kini.`}
      tips="Kunci keberhasilan bisnis e-commerce Indonesia bukan cuma di Diskon Produk, tapi Ongkos Kirim RP 0. Wajib ikuti program Gratis Ongkir Xtra dari Shopee apapun biayanya!"
      dataSummary={JSON.stringify(chartData)}
    >
      <div className="flex flex-col h-full">
        {/* KPI Badge */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-sm font-semibold">
            <span>🚚</span> Free Ongkir Rate: {freeOngkirRate}%
          </div>
        </div>

        <div className="flex-1 w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <BarChart
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
              minTickGap={15} />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                tickFormatter={(value) => formatCompact(value)}
                axisLine={false}
                tickLine={false}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value) => formatIDR(value)}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              
              <Bar 
                dataKey="pembeli" 
                stackId="a" 
                fill={COLORS.primary} 
                name="Dibayar Pembeli" 
                barSize={40} 
              />
              <Bar 
                dataKey="subsidi" 
                stackId="a" 
                fill={COLORS.green} 
                name="Subsidi Shopee" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ChartCard>
  );
}
