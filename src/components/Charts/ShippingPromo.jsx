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
import { COLOR_PALETTE } from '../../utils/constants';

export default function ShippingPromo({ data }) {
  const chartData = useMemo(() => {
    let freeOngkir = 0;
    let diskonOngkir = 0;
    let fullOngkir = 0;
    
    data.forEach(item => {
      const buyerFee = parseFloat(item['Ongkos Kirim Dibayar oleh Pembeli']) || 0;
      const shopeeSubsidy = parseFloat(item['Estimasi Potongan Biaya Pengiriman']) || 0;
      
      if (buyerFee === 0 && shopeeSubsidy > 0) freeOngkir++;
      else if (buyerFee > 0 && shopeeSubsidy > 0) diskonOngkir++;
      else fullOngkir++;
    });

    return [
      { name: 'Gratis Ongkir Full', value: freeOngkir },
      { name: 'Diskon Sebagian', value: diskonOngkir },
      { name: 'Bayar Penuh', value: fullOngkir }
    ].sort((a, b) => b.value - a.value);
  }, [data]);

  const total = data.length;

  return (
    <ChartCard 
      title="Ketergantungan Gratis Ongkir"
      chartType="Donut Chart Proporsional"
      purpose="Mengukur sensitivitas (Price Elasticity) pembeli terhadap harga kirim. Apakah jualan kita hanya laku jika ongkirnya murah/gratis?"
      dataDef="Persentase order utuh berdasarkan tagihan ongkirnya. Kuning (Tanpa Potongan), Abu (Hanya diskon tipis), Biru Muda (Customer Tidak Keluar Rp 1 sama sekali untuk Ongkir)."
      formula="Filter IF/ELSE: Ongkir Rp 0 & Diskon Shopee > 0 = Full Gratis. Ongkir > 0 & Diskon SHokee > 0 = Sebagian."
      insight="Ketergantungan terhadap subsidi platform Mengerikan. Potongan 'Gratis Ongkir Full' yang super mendominasi sangat bahaya jika platform tiba-tiba menghentikan program ini."
      tips="Evolusi bisnis pelan-pelan ke Live/Video Shopping. Promo ongkir biasa lebih memanjakan via konten Live daripada katalog keranjang pencarian di halaman utama reguler."
      className="lg:col-span-1"
      dataSummary={JSON.stringify(chartData)}
    >
      <div className="flex flex-col h-full w-full">
        <div className="flex-1 w-full min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={80}
                dataKey="value"
                stroke="hsl(var(--card))"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={
                      entry.name.includes('Gratis') ? COLOR_PALETTE[0] : 
                      entry.name.includes('Diskon') ? COLOR_PALETTE[1] : 
                      COLOR_PALETTE[3]
                    } 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                formatter={(value) => {
                  const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                  return [`${value} (${percent}%)`, 'Pesanan'];
                }}
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ChartCard>
  );
}
