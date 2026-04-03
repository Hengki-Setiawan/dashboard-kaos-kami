import { useMemo } from 'react';
import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from '../UI/ChartCard';
import { calculateRFM } from '../../utils/dataTransformers';
import { COLORS } from '../../utils/constants';

// Define segment colors
const SEGMENT_COLORS = {
  'Champions': COLORS.green,       // Best customers
  'Loyal': COLORS.cyan,            // Repeat buyers
  'New Customers': COLORS.primary, // Just bought recently
  'At Risk': COLORS.amber,         // Bought in past, but not recently
  'Hibernating': COLORS.rose       // Haven't bought in a long time
};

export default function RFMAnalysis({ data }) {
  const chartData = useMemo(() => {
    // data transformers utility calculates RFM internally
    const rfmData = calculateRFM(data);
    
    // Group by segment
    const segments = {};
    rfmData.forEach(c => {
      if (!segments[c.segment]) segments[c.segment] = 0;
      segments[c.segment] += 1;
    });

    return Object.keys(segments).map(key => ({
      name: key,
      size: segments[key]
    })).sort((a, b) => b.size - a.size);
  }, [data]);

  const CustomizedContent = (props) => {
    const { depth, x, y, width, height, index, payload, name, size } = props;
    
    // Ignore root node to prevent weird floating text
    if (!SEGMENT_COLORS[name]) return null;
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: SEGMENT_COLORS[name] || COLORS.indigo,
            stroke: 'hsl(var(--background))',
            strokeWidth: 2,
            strokeOpacity: 1,
            fillOpacity: 0.8
          }}
        />
        {width > 80 && height > 30 && (
          <text 
            x={x + width / 2} 
            y={y + height / 2} 
            textAnchor="middle" 
            fill="#0f172a" 
            stroke="none"
            fontSize={13} 
            fontWeight="bold"
            pointerEvents="none"
          >
            {name} ({size})
          </text>
        )}
      </g>
    );
  };

  return (
    <ChartCard 
      title="Analisis RFM Lanjutan"
      chartType="Treemap Hierarchy (Peta Pohon Hierarki)"
      purpose="Standar emas industri retail (Recency, Frequency, Monetary). Mengkalsifikasi basis jutaan data pelanggan ke dalam 5 status mental komersial mereka."
      dataDef="Besar blok mewakili proporsi jumlah populasi (orang). Champions=Terbaik, Loyal=Sering beli, At Risk=Mantan pembeli aktif yang makin jarang, Hibernating=Mati/Lupa."
      formula="R=EPOCH Last Order, F=Total Orders, M=Total Spend Rupiah. Didistribusikan ke kriteria matriks if-else bertingkat."
      insight="Terlalu banyak box merah (Hibernating) dan box kuning muda berarti Anda punya banyak mantan yang move on. Toko kehilangan kharisma jangka menengah."
      tips="Abaikan blok merah (buang budget). Fokuskan energi kirim Blast WA Promo/Voucher reaktivasi hanya ke audiens di kotak 'At Risk' untuk dicegah agar tidak hibernasi."
      className="lg:col-span-2"
      dataSummary={JSON.stringify(chartData)}
    >
      <div className="w-full h-full min-h-[300px] flex flex-col pt-2">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <Treemap
            data={chartData}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            content={<CustomizedContent />}
          >
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value) => [value, 'Pelanggan']} 
            />
          </Treemap>
        </ResponsiveContainer>
        
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-[10px] text-[hsl(var(--muted-foreground))]">
          {Object.entries(SEGMENT_COLORS).map(([key, color]) => (
            <div key={key} className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
              {key}
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}
