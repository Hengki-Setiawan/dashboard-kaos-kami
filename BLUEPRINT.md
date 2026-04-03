# 🏗️ BLUEPRINT FINAL v3: Dashboard Analitik Penjualan "Kaos Kami"

Dashboard web interaktif premium — **27 section visualisasi**, peta Indonesia interaktif, data storytelling, drill-down, export PDF/PNG, dan desain mewah. Semua variabel dataset dimanfaatkan secara maksimal.

---

## 📋 Dataset

| Info | Detail |
|---|---|
| File | `Data penjualan kaos kami.xlsx` |
| Baris / Kolom | 327 / 48 |
| Pesanan Unik | 309 |
| Pelanggan Unik | 294 |
| Periode | Feb 2024 – Jun 2024 |
| Platform | Shopee |

### Audit Penggunaan 48 Kolom

| Status | Jumlah | Keterangan |
|---|---|---|
| ✅ Digunakan | **39** kolom | Sudah dipetakan ke visualisasi |
| ⬜ Tidak berguna | **9** kolom | Semua NULL/0/konstan — diabaikan |

**9 kolom yang diabaikan** (karena datanya kosong/konstan):
`SKU Induk` (all NULL), `Nomor Referensi SKU` (all NULL), `Catatan` seller (all NULL), `Paket Diskon` (all "N"), `Paket Diskon Shopee` (all 0), `Paket Diskon Penjual` (all 0), `Diskon Kartu Kredit` (all 0), `Ongkos Kirim Pengembalian` (all 0), `Cashback Koin` (all 0).

**39 kolom yang digunakan** — dipetakan ke section berikut:

---

## 🛠️ Technology Stack & Libraries

### npm packages (semua gratis & open-source)

```bash
npm install react recharts react-simple-maps framer-motion
npm install @tanstack/react-table lucide-react
npm install html-to-image jspdf
npm install topojson-client d3-scale d3-array
```

| Library | Fungsi |
|---|---|
| **Vite + React** | Build tool + UI framework |
| **Recharts** | Grafik (line, bar, pie, area, funnel, radar, composed) |
| **react-simple-maps** | Peta Indonesia SVG interaktif (choropleth, tanpa API key) |
| **Indonesia TopoJSON** | Data bentuk 38 provinsi (dari GitHub, disimpan lokal) |
| **Framer Motion** | Animasi: counter-up, fade-in, modal spring, layout transition |
| **TanStack Table v8** | Data table headless: sort, search, filter, pagination |
| **html-to-image** | Screenshot chart → PNG/SVG (lebih baik dari html2canvas untuk SVG) |
| **jspdf** | Export dashboard → PDF |
| **d3-scale + d3-array** | Color scale choropleth peta + binning histogram |
| **Lucide React** | Icon set modern (600+ icon) |
| **Google Fonts** | Inter (body) + JetBrains Mono (angka KPI) |

---

## 🎨 Design System

### Dark Premium Theme (default) + Light Mode

```css
/* Dark */                          /* Light */
--bg-primary:     #0a0f1e;         --bg-primary:     #f8fafc;
--bg-card:        rgba(15,23,42,.6);--bg-card:       rgba(255,255,255,.8);
--text-primary:   #f1f5f9;         --text-primary:   #0f172a;
--text-secondary: #94a3b8;         --text-secondary: #64748b;
```

### Palet Warna Grafik
`#3b82f6` Blue · `#06b6d4` Cyan · `#8b5cf6` Purple · `#10b981` Green · `#f59e0b` Amber · `#f43f5e` Rose · `#ec4899` Pink · `#f97316` Orange · `#14b8a6` Teal · `#6366f1` Indigo

### Efek Visual
- **Glassmorphism**: `backdrop-filter: blur(16px)` + semi-transparent bg + subtle border
- **Hover glow**: `box-shadow: 0 0 30px rgba(59,130,246,0.2)` + `scale(1.02)`
- **Transitions**: `cubic-bezier(0.4, 0, 0.2, 1)` 0.3s
- **Stagger animation**: Children fade-in satu per satu 0.1s delay

### Animasi (Framer Motion)
| Animasi | Trigger |
|---|---|
| Counter-up angka KPI | Scroll masuk viewport |
| Fade-in + slide-up card | Scroll masuk viewport |
| Modal scale-in + backdrop | Klik ℹ️ |
| Bar/line grow | Data load / filter change |
| Pulse glow KPI | Hover |

---

## 📁 Struktur Proyek

```
src/
├── main.jsx
├── App.jsx                          # Root: filter state + theme + layout
├── index.css                        # Design system CSS
│
├── data/
│   └── salesData.json               # Excel → JSON (pre-processed)
│
├── hooks/
│   ├── useFilteredData.js           # Global filter → filtered dataset
│   └── useTheme.js                  # Dark/Light toggle + localStorage
│
├── components/
│   ├── Layout/
│   │   ├── Header.jsx               # Title + theme toggle + export all
│   │   ├── Sidebar.jsx              # Section nav + active indicator
│   │   ├── FilterBar.jsx            # Global filters
│   │   └── InsightsPanel.jsx        # Auto-generated insight alerts
│   │
│   ├── Cards/
│   │   └── KPICard.jsx              # Icon + AnimatedCounter + trend + click→modal
│   │
│   ├── Charts/
│   │   ├── RevenueTrend.jsx         # Sec 2: Bulanan (composed chart + annotations)
│   │   ├── WeeklyTrend.jsx          # Sec 3: Mingguan (area chart)
│   │   ├── TimeHeatmap.jsx          # Sec 4: Hari × Jam heatmap
│   │   ├── ProductPerformance.jsx   # Sec 5: Produk (donut + bar + drill-down)
│   │   ├── SizeDistribution.jsx     # Sec 6: Ukuran (bar + stacked cross-tab)
│   │   ├── IndonesiaMap.jsx         # Sec 7: PETA INDONESIA INTERAKTIF ⭐
│   │   ├── GeoBarChart.jsx          # Sec 8: Top provinsi & kota
│   │   ├── PaymentMethods.jsx       # Sec 9: Metode bayar (donut + table)
│   │   ├── ShippingAnalysis.jsx     # Sec 10: Ekspedisi (bar + counter/pickup)
│   │   ├── ShippingCost.jsx         # Sec 11: Ongkir & subsidi (stacked bar)
│   │   ├── DiscountWaterfall.jsx    # Sec 12: Diskon/voucher (waterfall)
│   │   ├── CustomerSegment.jsx      # Sec 13: Segmentasi pelanggan
│   │   ├── RFMAnalysis.jsx          # Sec 14: RFM segmentation ⭐
│   │   ├── CohortRetention.jsx      # Sec 15: Cohort retention heatmap ⭐
│   │   ├── ShippingTimeline.jsx     # Sec 16: Timeline pengiriman ⭐ BARU
│   │   ├── PaymentSpeed.jsx         # Sec 17: Kecepatan pembayaran ⭐ BARU
│   │   ├── WeightAnalysis.jsx       # Sec 18: Analisis berat ⭐ BARU
│   │   ├── LeadTimeHistogram.jsx    # Sec 19: Lead time (histogram)
│   │   ├── OrderFunnel.jsx          # Sec 20: Funnel pesanan ⭐
│   │   ├── ParetoChart.jsx          # Sec 21: Pareto 80/20 ⭐
│   │   ├── ReturnAnalysis.jsx       # Sec 22: Pengembalian
│   │   ├── PriceDistribution.jsx    # Sec 23: Distribusi harga
│   │   ├── BasketAnalysis.jsx       # Sec 24: Kombinasi pesanan ⭐
│   │   └── BuyerNotes.jsx           # Sec 25: Word cloud catatan ⭐ BARU
│   │
│   └── UI/
│       ├── Modal.jsx                # Popup: deskripsi + rumus + insight + tips
│       ├── ChartCard.jsx            # Glass card + judul + ℹ️ + 📊 + ⬇️
│       ├── AnimatedCounter.jsx      # Counter-up (Framer Motion)
│       ├── DataTable.jsx            # TanStack Table wrapper
│       ├── DrillDownBreadcrumb.jsx  # Breadcrumb navigasi drill-down
│       ├── ExportButton.jsx         # Download PNG/PDF per section
│       └── ComparisonToggle.jsx     # Toggle bandingkan 2 periode
│
└── utils/
    ├── dataTransformers.js          # Aggregasi, groupBy, RFM scoring
    ├── constants.js                 # Warna, teks penjelasan, konfigurasi
    ├── exportUtils.js               # html-to-image + jspdf helpers
    └── insightGenerator.js          # Auto-generate smart insights
```

---

## 🖥️ 27 Section Dashboard

### Section 1: 🏆 Hero KPI Cards
**Kolom**: `Total Pembayaran`, `No. Pesanan`, `Jumlah`, `Username (Pembeli)`, `Returned quantity`

| KPI | Nilai | Rumus |
|---|---|---|
| Total Revenue | Rp 36.4M | SUM(Total Pembayaran) |
| Total Orders | 309 | COUNT DISTINCT(No. Pesanan) |
| Total Units | 329 | SUM(Jumlah) |
| AOV | Rp 118K | Revenue ÷ Orders |
| Unique Customers | 294 | COUNT DISTINCT(Username) |
| Repeat Rate | 4.8% | Repeat Buyers ÷ Total Buyers × 100 |
| Return Rate | 1.2% | Returns ÷ Orders × 100 |

- Counter-up animation saat scroll
- Hover → glow + scale
- Klik → modal popup penjelasan

---

### Section 2: 📈 Tren Pendapatan Bulanan
**Kolom**: `Waktu Pesanan Dibuat`, `Total Pembayaran`, `No. Pesanan`
- ComposedChart: Bar (revenue) + Line (orders) dual Y-axis
- Annotation MoM%: `"-34.2%"` langsung di chart
- Target line rata-rata revenue
- Klik bar → drill-down ke minggu

### Section 3: 📊 Tren Mingguan
**Kolom**: `Waktu Pesanan Dibuat`, `Total Pembayaran`
- Area Chart gradient — granularitas lebih halus

### Section 4: 🔥 Heatmap Waktu Belanja
**Kolom**: `Waktu Pesanan Dibuat` (extract hari & jam)
- Grid 7×24 (hari × jam), warna gradient
- Annotation: "🔥 Peak" di sel tertinggi (Minggu 20:00)

### Section 5: 👕 Performa Produk
**Kolom**: `Nama Produk`, `Jumlah`, `Total Pembayaran`, `Harga Awal`
- Donut (share revenue) + Horizontal Bar (unit)
- Drill-down: klik produk → breakdown per ukuran
- Breadcrumb: `Semua > Lost Kitten Hitam > per Ukuran`

### Section 6: 📐 Distribusi Ukuran
**Kolom**: `Nama Variasi`, `Nama Produk`, `Jumlah`
- Bar Chart + Stacked Bar cross-tab (Produk × Ukuran)
- Annotation: "XL + L = 77.8%"

### Section 7: 🗺️ Peta Indonesia Interaktif ⭐
**Kolom**: `Provinsi`, `Kota/Kabupaten`, `Total Pembayaran`, `No. Pesanan`
- **react-simple-maps** + TopoJSON 38 provinsi
- Choropleth: warna berdasarkan jumlah pesanan (d3-scale)
- Hover → tooltip (provinsi, pesanan, revenue)
- Klik provinsi → drill-down ke kota
- Legend warna, zoom/pan
- Provinsi tanpa data = abu-abu

### Section 8: 📍 Top Provinsi & Kota
**Kolom**: `Provinsi`, `Kota/Kabupaten`, `Total Pembayaran`
- Horizontal bar top 10 masing-masing

### Section 9: 💳 Metode Pembayaran
**Kolom**: `Metode Pembayaran`, `Total Pembayaran`, `No. Pesanan`
- Donut Chart + expandable data table
- Annotation: "COD dominan 39.1%"

### Section 10: 🚚 Analisis Ekspedisi
**Kolom**: `Opsi Pengiriman`, `Perkiraan Ongkos Kirim`, `Antar ke counter/ pick-up`
- Horizontal Bar ekspedisi + avg ongkir
- Pie Chart: Counter (312) vs Pickup (15)

### Section 11: 📦 Ongkir & Subsidi
**Kolom**: `Ongkos Kirim Dibayar oleh Pembeli`, `Estimasi Potongan Biaya Pengiriman`, `Perkiraan Ongkos Kirim`
- Stacked Bar per bulan (dibayar vs subsidi)
- KPI: Free Ongkir Rate 15.6%

### Section 12: 🏷️ Diskon & Voucher Waterfall
**Kolom**: `Harga Awal`, `Harga Setelah Diskon`, `Total Diskon`, `Diskon Dari Penjual`, `Diskon Dari Shopee`, `Voucher Ditanggung Penjual`, `Voucher Ditanggung Shopee`, `Potongan Koin Shopee`, `Total Pembayaran`
- Waterfall: Harga Awal → −Diskon → −Voucher → −Koin → Total Bayar
- Comparison AOV: dengan vs tanpa diskon

### Section 13: 👥 Segmentasi Pelanggan
**Kolom**: `Username (Pembeli)`, `No. Pesanan`, `Total Pembayaran`, `Jumlah`
- Pie (1× vs 2× buyers) + Table Top 10 Spender

### Section 14: 🧑‍🤝‍🧑 RFM Analysis ⭐
**Kolom**: `Username (Pembeli)`, `Waktu Pesanan Dibuat`, `No. Pesanan`, `Total Pembayaran`
- Treemap segmen: Champions, Loyal, At Risk, New, Hibernating
- Skor R/F/M dihitung dari data
- Klik segmen → list pelanggan

### Section 15: 📅 Cohort Retention ⭐
**Kolom**: `Username (Pembeli)`, `Waktu Pesanan Dibuat`
- Grid Heatmap: bulan cohort × periode retensi
- Warna = % pelanggan yang kembali

### Section 16: 🚀 Timeline Pengiriman ⭐ BARU
**Kolom**: `Waktu Pesanan Dibuat`, `Waktu Pengiriman Diatur`, `Pesanan Harus Dikirimkan Sebelum`, `Waktu Pesanan Selesai`
- **Horizontal timeline chart** menampilkan rata-rata durasi setiap fase:
  - Pesanan Dibuat → Pengiriman Diatur (rata-rata 43.1 jam)
  - Pengiriman Diatur → Pesanan Selesai
  - vs Deadline yang diberikan (rata-rata 261.7 jam)
- Bar chart: distribusi waktu pengaturan pengiriman (min 1.4 jam – max 149.8 jam)
- KPI: "Tidak ada pesanan terlambat kirim! ✅"

### Section 17: ⚡ Kecepatan Pembayaran ⭐ BARU
**Kolom**: `Waktu Pesanan Dibuat`, `Waktu Pembayaran Dilakukan`, `Metode Pembayaran`
- Histogram: distribusi delay pembayaran (rata-rata 18.2 menit, median 0 menit)
- Grouped bar: rata-rata delay per metode pembayaran
  - COD, ShopeePay (instant) vs Transfer Bank (lebih lama)
- Insight: "Mayoritas pembayaran instan (median 0 menit)"

### Section 18: ⚖️ Analisis Berat & Quantity ⭐ BARU
**Kolom**: `Berat Produk`, `Total Berat`, `Jumlah Produk di Pesan`, `Perkiraan Ongkos Kirim`
- Scatter plot: Total Berat vs Ongkos Kirim (korelasi)
- Bar: distribusi single (200gr) vs multi-item (400gr) pesanan
- Insights:
  - 289 pesanan single item (200gr) vs 38 multi-item (400gr)
  - Korelasi berat → ongkir
  - Apakah pesanan multi-item memiliki AOV lebih tinggi?

### Section 19: ⏱️ Lead Time Pengiriman
**Kolom**: `Waktu Pesanan Dibuat`, `Waktu Pesanan Selesai`
- Histogram distribusi
- KPI: avg 6.6 hari, min 2.2, max 25.6, median 6.3

### Section 20: 🔄 Order Funnel ⭐
**Kolom**: `No. Pesanan`, `Status Pesanan`, `Status Pembatalan/ Pengembalian`, `Waktu Pesanan Dibuat`, `Waktu Pembayaran Dilakukan`, `Waktu Pengiriman Diatur`, `Waktu Pesanan Selesai`
- Funnel: Dibuat → Dibayar → Dikirim → Selesai
- Conversion rate setiap tahap
- Drop-off: berapa yang di-cancel/return

### Section 21: 📊 Pareto Chart (80/20) ⭐
**Kolom**: `Provinsi` / `Username (Pembeli)`, `Total Pembayaran`
- Bar (revenue descending) + Cumulative Line (%)
- Garis 80% threshold
- "20% provinsi menyumbang X% revenue"

### Section 22: ↩️ Analisis Pengembalian
**Kolom**: `Status Pembatalan/ Pengembalian`, `Returned quantity`, `Nama Produk`, `Nama Variasi`
- KPI badge: return rate 1.2% (hijau)
- Detail table: produk & variasi mana yang dikembalikan

### Section 23: 💰 Distribusi Harga
**Kolom**: `Harga Awal`, `Harga Setelah Diskon`
- Bar: Rp 89K (88.7%), Rp 99K (7.3%), Rp 105K (4%)
- Perbandingan harga awal vs rata-rata harga setelah diskon

### Section 24: 🛒 Basket Analysis ⭐
**Kolom**: `No. Pesanan`, `Nama Produk`, `Nama Variasi`, `Jumlah Produk di Pesan`
- Filter pesanan dengan >1 item
- Tabel: kombinasi produk + variasi dalam 1 pesanan
- KPI: % pesanan multi-item, avg items per order

### Section 25: 💬 Catatan Pembeli (Word Cloud) ⭐ BARU
**Kolom**: `Catatan dari Pembeli`
- Word cloud / bubble chart dari kata-kata yang muncul di catatan (14 catatan non-null)
- Tabel daftar catatan asli pembeli
- Insight: Apa yang diminta/diperhatikan pembeli? (ukuran, warna, instruksi pengiriman)

### Section 26: 🔔 Smart Insights Panel ⭐
**Kolom**: (kalkulasi otomatis dari semua data)
- Auto-generated alert cards:
  - `"⚠️ Penjualan Juni turun 46% dari Mei"`
  - `"💡 95% pelanggan hanya beli 1 kali"`
  - `"🔥 Minggu jam 20:00 paling ramai"`
  - `"✅ Return rate 1.2% — kualitas terjaga"`
  - `"📦 Rata-rata kirim 43 jam setelah pesanan dibuat"`
  - `"⚡ Median pembayaran instan (0 menit)"`

### Section 27: 📋 Data Explorer ⭐
**Kolom**: Semua 39 kolom yang digunakan
- Full data table TanStack: sort, global search, column filter
- Pagination 10/25/50 rows
- Export CSV
- Klik row → detail pesanan lengkap

---

## 🖱️ Fitur Interaktivitas

### A. Klik ℹ️ → Modal Penjelasan
Setiap section punya tombol info. Modal berisi 4 bagian:
1. **Deskripsi** — "Apa data ini?"
2. **Rumus/Perhitungan** — misal `AOV = Rp 36.448 ÷ 309 = Rp 118K`
3. **Insight Bisnis** — misal "Penurunan 34% dari Mar→Apr"
4. **Tips Aksi** — misal "Buat kampanye retargeting"

### B. Klik 📊 → Expandable Data Table
Tabel TanStack muncul di bawah chart — sortable, searchable.

### C. Klik ⬇️ → Export
- PNG per chart (html-to-image)
- PDF seluruh dashboard (jspdf)
- CSV dari data explorer

### D. Drill-Down Navigation
- Klik elemen chart → detail level berikutnya
- Breadcrumb: `Semua > Jawa Barat > KAB. Bogor`

### E. Smart Annotations
- Label peak/drop otomatis langsung di chart
- Garis target/rata-rata sebagai referensi visual

### F. Comparison Mode
- Toggle "⚖️ Bandingkan" → pilih 2 periode
- Side-by-side bars + delta indicators

### G. Sidebar Navigation
- Klik section → smooth scroll
- Active indicator saat scrolling
- Grouped: Overview, Produk, Pelanggan, Geografis, Logistik, Keuangan

### H. Dark/Light Theme Toggle
- Smooth CSS transition
- Simpan di localStorage

### I. Global Filters
- 📅 Date range | 👕 Produk | 📍 Provinsi | 💳 Pembayaran | 🚚 Ekspedisi
- Semua chart update secara real-time

---

## 📱 Layout Responsif

```
Desktop (≥1200px): 4 kolom
┌────┬────┬────┬────┐
│KPI │KPI │KPI │KPI │
├────┴────┴────┴────┤
│   PETA INDONESIA  │  ← full width
├─────────┬─────────┤
│ Revenue │ Heatmap │
├─────────┼─────────┤
│ Produk  │ Ukuran  │
└─────────┴─────────┘

Tablet (768-1199px): 2 kolom
Mobile (<768px): 1 kolom + hamburger sidebar
```

---

## 🔄 Data Flow

```
Excel (.xlsx)
  │ convert_data.py
  ▼
salesData.json ──► App.jsx (filter + theme state)
                     │
                     ├── FilterBar → update filters
                     ├── ComparisonToggle → comparison state
                     ▼
                  useFilteredData.js
                     │
                     ├──► insightGenerator.js → Insights Panel
                     ▼
                  All Chart Components
                     │ wrapped by
                     ▼
                  ChartCard.jsx
                     ├── ℹ️ → Modal.jsx
                     ├── 📊 → DataTable.jsx
                     ├── ⬇️ → ExportButton.jsx
                     └── 🔎 → DrillDownBreadcrumb.jsx
```

---

## ✅ Verification Plan

1. `npm run build` → 0 error
2. `npm run dev` → buka browser localhost
3. Verifikasi semua 27 section ter-render
4. Klik ℹ️ → modal muncul + berisi rumus
5. Klik peta Indonesia → tooltip + drill-down
6. Ubah filter → semua chart update real-time
7. Toggle dark/light → transisi mulus
8. Export PNG + PDF
9. Cek responsif (desktop/tablet/mobile)
10. Screenshot bukti

---

## 📊 Peta Kolom → Section (39 dari 48 kolom digunakan)

| Kolom | Section |
|---|---|
| No. Pesanan | 1, 2, 8, 13, 20, 21, 24, 27 |
| Status Pesanan | 20 |
| Status Pembatalan/ Pengembalian | 20, 22 |
| No. Resi | 16 (tracking reference) |
| Opsi Pengiriman | 10 |
| Antar ke counter/ pick-up | 10 |
| Pesanan Harus Dikirimkan Sebelum | 16 ⭐ |
| Waktu Pengiriman Diatur | 16, 20 ⭐ |
| Waktu Pesanan Dibuat | 1-4, 14-17, 19-20 |
| Waktu Pembayaran Dilakukan | 17, 20 ⭐ |
| Metode Pembayaran | 9, 17 |
| Nama Produk | 5, 6, 22, 24 |
| Nama Variasi | 6, 22, 24 |
| Harga Awal | 5, 12, 23 |
| Harga Setelah Diskon | 12, 23 |
| Jumlah | 1-3, 5, 6, 13 |
| Returned quantity | 1, 22 |
| Total Harga Produk | 12 |
| Total Diskon | 12, 26 |
| Diskon Dari Penjual | 12 |
| Diskon Dari Shopee | 12 |
| Berat Produk | 18 ⭐ |
| Jumlah Produk di Pesan | 18, 24 |
| Total Berat | 18 ⭐ |
| Voucher Ditanggung Penjual | 12 |
| Voucher Ditanggung Shopee | 12 |
| Potongan Koin Shopee | 12 |
| Ongkos Kirim Dibayar oleh Pembeli | 11 |
| Estimasi Potongan Biaya Pengiriman | 11 |
| Perkiraan Ongkos Kirim | 10, 11, 18 |
| Total Pembayaran | 1-3, 7-9, 11-14, 21, 27 |
| Catatan dari Pembeli | 25 ⭐ |
| Username (Pembeli) | 1, 13, 14, 15, 21 |
| Nama Penerima | 27 (data explorer) |
| No. Telepon | 27 (data explorer, masked) |
| Alamat Pengiriman | 27 (data explorer, masked) |
| Kota/Kabupaten | 7, 8 |
| Provinsi | 7, 8, 21 |
| Waktu Pesanan Selesai | 16, 19, 20 |

**⭐ = kolom yang baru ditambahkan di v3 (sebelumnya belum digunakan)**

---

*Blueprint Final v3.0 — 2 April 2026*
*27 sections · 39/48 kolom digunakan · 10 npm packages · 100% gratis*
