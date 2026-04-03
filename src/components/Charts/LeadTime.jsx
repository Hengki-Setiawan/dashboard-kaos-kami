import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import ChartCard from '../UI/ChartCard';
import { COLORS } from '../../utils/constants';

export default function LeadTime({ data }) {
  const chartData = useMemo(() => {
    // Process Total Lead Time (Dibuat -> Dikirim)
    // Categories: Same day (< 24h), 1 Days (24-48h), 2 Days (48-72h), > 2 Days
    const buckets = {
      'Same Day (<24 Jam)': 0,
      '1 Hari (24-48 Jam)': 0,
      '2 Hari (48-72 Jam)': 0,
      '> 2 Hari': 0
    };
    
    data.forEach(item => {
      const created = item['Waktu Pesanan Dibuat'] ? new Date(item['Waktu Pesanan Dibuat']) : null;
      const shipped = item['Waktu Pesanan Dikirim'] ? new Date(item['Waktu Pesanan Dikirim']) : null;
      
      if (created && shipped && shipped >= created) {
        const hours = (shipped - created) / 3600000;
        
        if (hours <= 24) buckets['Same Day (<24 Jam)']++;
        else if (hours <= 48) buckets['1 Hari (24-48 Jam)']++;
        else if (hours <= 72) buckets['2 Hari (48-72 Jam)']++;
        else buckets['> 2 Hari']++;
      }
    });

    return [
      { name: 'Same Day (<24 Jam)', value: buckets['Same Day (<24 Jam)'], fill: COLORS.emerald },
      { name: '1 Hari (24-48 Jam)', value: buckets['1 Hari (24-48 Jam)'], fill: COLORS.primary },
      { name: '2 Hari (48-72 Jam)', value: buckets['2 Hari (48-72 Jam)'], fill: COLORS.amber },
      { name: '> 2 Hari', value: buckets['> 2 Hari'], fill: COLORS.rose }
    ];
  }, [data]);

  return (
    <ChartCard 
      title="Waktu Pengiriman Harian (SLA Drop-off)"
      chartType="Horizontal Bar Chart Terurut"
      purpose="Audit kinerja fisik tim Gudang/Fulfillment secara riil terkait janji kecepatan pelayanan e-Commerce."
      dataDef="Mendistribusikan ratusan data pesanan murni ke dalam 4 skala warna kecepatan penyerahan barang ke tangan sopir kurir (Ekspedisi)."
      formula="Ekstrak Timestamp EPOCH Waktu Dibuat dengan waktu dioper ke kurir lalu dirubah menjadi format Jam (Hours)."
      insight="Adanya transaksi di kolom Merah (> 2 Hari) pertanda kelalaian fatal. Toko mall/star-plus bisa kehilangan badgenya karena ini ditegur oleh Marketplace platform."
      tips="Jika anda belum mencapai status biru hijau (Sameday < 24 jam) mayoritas, maka jangan nekat menambah biaya kampanye iklan. Sila resmikan Standar Operasional (SOP) paking harian dulu agar paket tak bolong."
      dataSummary={JSON.stringify(chartData)}
    >
      <div className="w-full h-full min-h-[250px] pt-4">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={140} 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
              formatter={(value) => [value, 'Pesanan']}
            />
            <Bar 
              dataKey="value" 
              radius={[0, 4, 4, 0]}
              barSize={20}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
