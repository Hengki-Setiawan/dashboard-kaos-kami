import { useMemo } from 'react';
import { AlertCircle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatIDR } from '../utils/constants';

export default function InsightsPanel({ data }) {
  const insights = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    let totalRev = 0;
    let totalDiscount = 0;
    let orders = data.length;
    let repeats = 0;
    const customerCounts = {};
    const productRevs = {};
    
    data.forEach(item => {
      const rev = parseFloat(item['Total Pembayaran']) || 0;
      totalRev += rev;
      totalDiscount += (parseFloat(item['Diskon Dari Penjual']) || 0) + (parseFloat(item['Voucher Ditanggung Penjual']) || 0);
      
      const cust = item['Username (Pembeli)'];
      if (cust) customerCounts[cust] = (customerCounts[cust] || 0) + 1;
      
      const prod = item['Nama Produk'];
      if (prod) productRevs[prod] = (productRevs[prod] || 0) + rev;
    });

    Object.values(customerCounts).forEach(count => {
      if (count > 1) repeats++;
    });

    const repeatRate = Object.keys(customerCounts).length > 0 
      ? (repeats / Object.keys(customerCounts).length) * 100 
      : 0;
      
    const discountRate = totalRev > 0 ? (totalDiscount / (totalRev + totalDiscount)) * 100 : 0;
    
    // Top product
    let topProdName = "Tidak ada";
    let topProdRev = 0;
    Object.entries(productRevs).forEach(([key, val]) => {
      if (val > topProdRev) {
        topProdRev = val;
        topProdName = key;
      }
    });

    return [
      {
        type: 'warning',
        icon: <TrendingDown size={20} className="text-amber-500" />,
        title: 'Tingkat Retensi Rendah',
        desc: `Repeat order hanya ${repeatRate.toFixed(1)}%. Segera aktifkan program loyalitas & retargeting ads.`
      },
      {
        type: 'danger',
        icon: <AlertCircle size={20} className="text-rose-500" />,
        title: 'Beban Diskon Signifikan',
        desc: `Diskon menyita ${discountRate.toFixed(1)}% nilai kotor. Pantau margin jika konversi stagnan.`
      },
      {
        type: 'success',
        icon: <TrendingUp size={20} className="text-emerald-500" />,
        title: 'Produk Bintang (Hero)',
        desc: `Laris! "${topProdName.replace('Kaos Kami ', '').substring(0,18)}..." (Rev: ${formatIDR(topProdRev)}). Pertahankan stok >90%.`
      },
      {
        type: 'info',
        icon: <DollarSign size={20} className="text-blue-500" />,
        title: 'Peluang Upselling',
        desc: `AOV < Rp 100rb. Mulai gunakan fitur Bundling & "Sering Dibeli Bersama".`
      }
    ];
  }, [data]);

  return (
    <section id="ai-insights" className="scroll-mt-24 mt-8 mb-4">
      <div className="bg-card border border-border rounded-xl shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-foreground">
          <span className="p-2 bg-blue-100 rounded-lg text-blue-600">✨</span>
          Smart Insights &amp; Rekomendasi
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, idx) => (
            <div key={idx} className="bg-[hsl(var(--background))]/50 border border-[hsl(var(--border))] p-4 rounded-xl flex gap-4 transition-all hover:bg-[hsl(var(--background))] hover:-translate-y-1">
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--card))] flex items-center justify-center shrink-0 border border-border shadow-inner">
                {insight.icon}
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1 text-[hsl(var(--foreground))]">{insight.title}</h4>
                <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                  {insight.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
