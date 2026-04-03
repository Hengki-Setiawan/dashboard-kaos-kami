import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid
} from 'recharts';
import ChartCard from '../UI/ChartCard';
import { formatCompact, formatIDR, COLORS } from '../../utils/constants';

export default function DiscountWaterfall({ data }) {
  const { totalHarga, totalDiskon, totalBayar, deductions } = useMemo(() => {
    let hargaAwal = 0, diskonPenjual = 0, diskonShopee = 0, voucherPenjual = 0, voucherShopee = 0, koinShopee = 0;
    
    data.forEach(item => {
      hargaAwal += parseFloat(item['Harga Awal']) || 0;
      diskonPenjual += parseFloat(item['Diskon Dari Penjual']) || 0;
      diskonShopee += parseFloat(item['Diskon Dari Shopee']) || 0;
      voucherPenjual += parseFloat(item['Voucher Ditanggung Penjual']) || 0;
      voucherShopee += parseFloat(item['Voucher Ditanggung Shopee']) || 0;
      koinShopee += parseFloat(item['Potongan Koin Shopee']) || 0;
    });

    const tb = hargaAwal - diskonPenjual - diskonShopee - voucherPenjual - voucherShopee - koinShopee;
    const td = diskonPenjual + diskonShopee + voucherPenjual + voucherShopee + koinShopee;

    const list = [
      { name: 'Diskon Penjual', val: diskonPenjual, fill: COLORS.rose },
      { name: 'Diskon Shopee', val: diskonShopee, fill: COLORS.rose },
      { name: 'Voucher Penjual', val: voucherPenjual, fill: COLORS.orange },
      { name: 'Voucher Shopee', val: voucherShopee, fill: COLORS.orange },
      { name: 'Koin Shopee', val: koinShopee, fill: COLORS.amber }
    ];

    return { 
      totalHarga: hargaAwal, 
      totalDiskon: td, 
      totalBayar: tb, 
      deductions: list.filter(x => x.val > 0).sort((a,b) => b.val - a.val) 
    };
  }, [data]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataInfo = payload[0].payload;
      return (
        <div className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] p-3 rounded-xl shadow-lg">
          <p className="font-bold text-sm mb-1 text-[hsl(var(--foreground))]">{dataInfo.name}</p>
          <p className="text-sm" style={{ color: dataInfo.fill }}>{formatIDR(dataInfo.val)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartCard 
      title="Rincian Komposisi Diskon & Voucher"
      chartType="Horizontal Bar Chart (Breakdown Analysis)"
      purpose="Memberikan transparansi aliran uang (Cash Flow) yang terpotong akibat program promo, subsidi, dan koin."
      dataDef="3 Indikator KPI: Nilai Kotor, Total Potongan, Margin Bersih. Serta rincian potongan dipecah berdasarkan sumber (Penjual vs Platform)."
      formula="Total Harga Awal - (Setiap varian diskon) = Harga Bersih. Ditampilkan murni nilainya agar bisa dinilai cost proportion-nya."
      insight="Jika nilai 'Voucher Ditanggung Penjual' lebih besar >20% dari Harga Kotor, Anda pada dasarnya merusak margin untung."
      tips="Pindahkan ketergantungan dari 'Voucher Penjual' ke 'Voucher Shopee/Platform' dengan mendaftar ke campaign official gratis ongkir."
      className="lg:col-span-2"
      dataSummary={JSON.stringify({ kotor: totalHarga, potongan: totalDiskon, bersih: totalBayar })}
    >
      <div className="flex flex-col h-full">
        {/* KPI Scorecard header for Waterfall replacement */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 pt-4">
           <div className="bg-indigo-500/10 p-4 rounded-xl flex-1 border border-indigo-500/20">
              <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">Harga Kotor</p>
              <p className="text-xl font-bold text-foreground">{formatIDR(totalHarga)}</p>
           </div>
           <div className="bg-rose-500/10 p-4 rounded-xl flex-1 border border-rose-500/20">
              <p className="text-xs text-rose-600 font-bold uppercase tracking-wider mb-1">Total Potongan</p>
              <p className="text-xl font-bold text-rose-600">-{formatIDR(totalDiskon)}</p>
           </div>
           <div className="bg-emerald-500/10 p-4 rounded-xl flex-1 border border-emerald-500/20">
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Harga Bersih</p>
              <p className="text-xl font-bold text-emerald-600">{formatIDR(totalBayar)}</p>
           </div>
        </div>

        <div className="w-full h-[260px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={deductions}
              layout="vertical"
              margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
              <XAxis 
                type="number"
                stroke="hsl(var(--muted-foreground))" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                tickFormatter={(value) => formatCompact(value)}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                dataKey="name" 
                type="category"
                width={120}
                stroke="hsl(var(--muted-foreground))" 
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
              
              <Bar dataKey="val" radius={[0, 4, 4, 0]} barSize={28}>
                {deductions.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ChartCard>
  );
}
