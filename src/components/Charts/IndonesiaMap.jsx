import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip as LTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ChartCard from '../UI/ChartCard';
import { formatIDR } from '../../utils/constants';

// Approximate lat/lng for Indonesian provinces
const PROVINCE_COORDS = {
  'JAWA BARAT': [-6.9, 107.6],
  'DKI JAKARTA': [-6.2, 106.85],
  'JAWA TENGAH': [-7.15, 110.4],
  'JAWA TIMUR': [-7.5, 112.75],
  'BANTEN': [-6.4, 106.15],
  'DI YOGYAKARTA': [-7.8, 110.36],
  'SUMATERA UTARA': [2.6, 98.7],
  'SUMATERA BARAT': [-0.95, 100.35],
  'SUMATERA SELATAN': [-3.32, 104.75],
  'RIAU': [0.5, 101.45],
  'LAMPUNG': [-5.45, 105.26],
  'KALIMANTAN BARAT': [-0.05, 109.35],
  'KALIMANTAN SELATAN': [-3.3, 114.6],
  'KALIMANTAN TIMUR': [1.0, 116.5],
  'KALIMANTAN TENGAH': [-1.7, 113.9],
  'SULAWESI SELATAN': [-3.7, 119.97],
  'SULAWESI UTARA': [1.5, 124.85],
  'SULAWESI TENGAH': [-1.4, 121.4],
  'BALI': [-8.4, 115.2],
  'NUSA TENGGARA BARAT': [-8.65, 117.4],
  'NUSA TENGGARA TIMUR': [-8.65, 121.1],
  'PAPUA': [-4.3, 138.5],
  'MALUKU': [-3.7, 128.2],
  'BENGKULU': [-3.8, 102.3],
  'JAMBI': [-1.6, 103.6],
  'KEPULAUAN RIAU': [1.1, 104.0],
  'ACEH': [4.7, 96.75],
  'KEPULAUAN BANGKA BELITUNG': [-2.7, 106.6],
  'GORONTALO': [0.5, 123.1],
  'SULAWESI TENGGARA': [-4.0, 122.5],
  'MALUKU UTARA': [1.6, 127.8],
  'SULAWESI BARAT': [-2.8, 119.0],
  'PAPUA BARAT': [-1.5, 133.2],
  'KALIMANTAN UTARA': [3.0, 116.5],
};

export default function IndonesiaMap({ data }) {
  const { regionData, maxValue } = useMemo(() => {
    const map = {};
    let max = 0;

    data.forEach(item => {
      const pRaw = item['Provinsi'];
      if (!pRaw) return;
      const province = pRaw.toUpperCase().trim();
      if (!map[province]) {
        map[province] = { revenue: 0, orders: 0, name: province };
      }
      map[province].revenue += parseFloat(item['Total Pembayaran']) || 0;
      map[province].orders += 1;
      if (map[province].orders > max) max = map[province].orders;
    });

    // Attach coordinates
    const regions = Object.values(map).map(r => ({
      ...r,
      coords: PROVINCE_COORDS[r.name] || null
    })).filter(r => r.coords !== null);

    return { regionData: regions, maxValue: max };
  }, [data]);

  const getRadius = (orders) => {
    const minR = 6, maxR = 30;
    return minR + ((orders / (maxValue || 1)) * (maxR - minR));
  };

  const getColor = (orders) => {
    const ratio = orders / (maxValue || 1);
    if (ratio > 0.7) return '#6366f1';
    if (ratio > 0.4) return '#818cf8';
    if (ratio > 0.2) return '#a5b4fc';
    return '#c7d2fe';
  };

  return (
    <ChartCard 
      title="Peta Sebaran Pelanggan (Geografis)"
      chartType="Interactive Choropleth Maps (Peta Geografis)"
      purpose="Visualisasi spasial impresif untuk melihat apakah pemasaran Anda sudah menjangkau titik demografi nasional atau hanya berpusat di lokasi pengiriman."
      dataDef="Lingkaran (Marker) diposisikan pada koordinat (Latitude/Longitude) spesifik ibukota provinsi. Radius lingkaran mewakili besarnya pesanan."
      formula="Menghubungkan 'Provinsi' pada data dengan Object Dictionary Koordinat Peta, kemudian menghitung COUNT() & SUM(Rupiah)."
      insight="Jawa Barat adalah pusat utama, tapi lihat juga potensi pasar di luar pulau Jawa. Seringkali pasar yang minim saingan ini memiliki nilai 'Cart Size' yang jumbo."
      tips="Gunakan sistem subsidi ongkir untuk pulau terluar (seperti Sumatera atau Sulawesi) yang markernya mulai membesar agar konversi makin meledak."
      dataSummary={JSON.stringify(regionData.sort((a,b) => b.orders - a.orders).slice(0, 5))}
      reanimate={false}
    >
      <div className="w-full h-full rounded-lg overflow-hidden" style={{ minHeight: '350px' }}>
        <MapContainer
          center={[-2.5, 118]}
          zoom={5}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', minHeight: '350px', borderRadius: '8px' }}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          {regionData.map((region) => (
            <CircleMarker
              key={region.name}
              center={region.coords}
              radius={getRadius(region.orders)}
              pathOptions={{
                color: getColor(region.orders),
                fillColor: getColor(region.orders),
                fillOpacity: 0.6,
                weight: 2,
              }}
            >
              <LTooltip direction="top" offset={[0, -10]}>
                <div className="text-sm font-medium">
                  <strong>{region.name.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}</strong>
                  <br />
                  📦 {region.orders} Pesanan
                  <br />
                  💰 {formatIDR(region.revenue)}
                </div>
              </LTooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </ChartCard>
  );
}
