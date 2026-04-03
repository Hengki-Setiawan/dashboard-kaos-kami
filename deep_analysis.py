import pandas as pd
import json
from datetime import datetime

file_path = r"d:\Vibe coding (tugas)\Diagram data simbis\Data penjualan kaos kami.xlsx"
df = pd.read_excel(file_path)

with open("deep_analysis.txt", "w", encoding="utf-8") as f:

    # === 1. TIME ANALYSIS ===
    f.write("=" * 60 + "\n")
    f.write("1. ANALISIS WAKTU (TIME ANALYSIS)\n")
    f.write("=" * 60 + "\n")
    
    df['Waktu Pesanan Dibuat'] = pd.to_datetime(df['Waktu Pesanan Dibuat'])
    df['Waktu Pembayaran Dilakukan'] = pd.to_datetime(df['Waktu Pembayaran Dilakukan'])
    df['Waktu Pesanan Selesai'] = pd.to_datetime(df['Waktu Pesanan Selesai'])
    
    f.write(f"Rentang Data: {df['Waktu Pesanan Dibuat'].min()} s/d {df['Waktu Pesanan Dibuat'].max()}\n")
    
    df['Bulan'] = df['Waktu Pesanan Dibuat'].dt.to_period('M')
    df['Hari'] = df['Waktu Pesanan Dibuat'].dt.day_name()
    df['Jam'] = df['Waktu Pesanan Dibuat'].dt.hour
    
    f.write("\n--- Pesanan per Bulan ---\n")
    monthly = df.groupby('Bulan').agg(
        jumlah_pesanan=('No. Pesanan', 'nunique'),
        total_revenue=('Total Pembayaran', 'sum'),
        total_qty=('Jumlah', 'sum')
    )
    f.write(monthly.to_string() + "\n")
    
    f.write("\n--- Pesanan per Hari dalam Seminggu ---\n")
    daily = df['Hari'].value_counts()
    f.write(daily.to_string() + "\n")
    
    f.write("\n--- Pesanan per Jam ---\n")
    hourly = df['Jam'].value_counts().sort_index()
    f.write(hourly.to_string() + "\n")
    
    # Lead time (waktu proses pesanan)
    df['Lead_Time_Jam'] = (df['Waktu Pesanan Selesai'] - df['Waktu Pesanan Dibuat']).dt.total_seconds() / 3600
    f.write(f"\n--- Lead Time (Pesanan Dibuat -> Selesai) ---\n")
    f.write(f"Rata-rata: {df['Lead_Time_Jam'].mean():.1f} jam\n")
    f.write(f"Min: {df['Lead_Time_Jam'].min():.1f} jam\n")
    f.write(f"Max: {df['Lead_Time_Jam'].max():.1f} jam\n")
    f.write(f"Median: {df['Lead_Time_Jam'].median():.1f} jam\n")

    # === 2. PRODUCT ANALYSIS ===
    f.write("\n" + "=" * 60 + "\n")
    f.write("2. ANALISIS PRODUK (PRODUCT ANALYSIS)\n")
    f.write("=" * 60 + "\n")
    
    f.write("\n--- Penjualan per Produk ---\n")
    prod = df.groupby('Nama Produk').agg(
        jumlah_pesanan=('No. Pesanan', 'count'),
        total_qty=('Jumlah', 'sum'),
        total_revenue=('Total Pembayaran', 'sum'),
        avg_price=('Harga Awal', 'mean')
    ).sort_values('total_revenue', ascending=False)
    f.write(prod.to_string() + "\n")
    
    f.write("\n--- Penjualan per Variasi/Ukuran ---\n")
    var = df.groupby('Nama Variasi').agg(
        jumlah=('No. Pesanan', 'count'),
        total_qty=('Jumlah', 'sum'),
        total_revenue=('Total Pembayaran', 'sum')
    ).sort_values('total_revenue', ascending=False)
    f.write(var.to_string() + "\n")
    
    f.write("\n--- Produk x Variasi (Cross-tab) ---\n")
    cross = pd.crosstab(df['Nama Produk'], df['Nama Variasi'], values=df['Jumlah'], aggfunc='sum', margins=True)
    f.write(cross.to_string() + "\n")

    # === 3. GEOGRAPHICAL ANALYSIS ===
    f.write("\n" + "=" * 60 + "\n")
    f.write("3. ANALISIS GEOGRAFIS (GEOGRAPHICAL ANALYSIS)\n")
    f.write("=" * 60 + "\n")
    
    f.write("\n--- Pesanan per Provinsi ---\n")
    prov = df.groupby('Provinsi').agg(
        jumlah_pesanan=('No. Pesanan', 'nunique'),
        total_revenue=('Total Pembayaran', 'sum'),
        total_qty=('Jumlah', 'sum')
    ).sort_values('total_revenue', ascending=False)
    f.write(prov.to_string() + "\n")
    
    f.write("\n--- Top 15 Kota/Kabupaten ---\n")
    kota = df.groupby('Kota/Kabupaten').agg(
        jumlah_pesanan=('No. Pesanan', 'nunique'),
        total_revenue=('Total Pembayaran', 'sum')
    ).sort_values('total_revenue', ascending=False).head(15)
    f.write(kota.to_string() + "\n")

    # === 4. FINANCIAL ANALYSIS ===
    f.write("\n" + "=" * 60 + "\n")
    f.write("4. ANALISIS KEUANGAN (FINANCIAL ANALYSIS)\n")
    f.write("=" * 60 + "\n")
    
    f.write(f"\nTotal Pendapatan (Total Pembayaran): Rp {df['Total Pembayaran'].sum():,.0f}\n")
    f.write(f"Rata-rata Nilai Pesanan (AOV): Rp {df.groupby('No. Pesanan')['Total Pembayaran'].sum().mean():,.0f}\n")
    f.write(f"Total Harga Produk (sebelum ongkir/diskon): Rp {df['Total Harga Produk'].sum():,.0f}\n")
    f.write(f"Total Diskon Keseluruhan: Rp {df['Total Diskon'].sum():,.0f}\n")
    f.write(f"Total Diskon Dari Penjual: Rp {df['Diskon Dari Penjual'].sum():,.0f}\n")
    f.write(f"Total Diskon Dari Shopee: Rp {df['Diskon Dari Shopee'].sum():,.0f}\n")
    f.write(f"Total Voucher Ditanggung Penjual: Rp {df['Voucher Ditanggung Penjual'].sum():,.0f}\n")
    f.write(f"Total Voucher Ditanggung Shopee: Rp {df['Voucher Ditanggung Shopee'].sum():,.0f}\n")
    f.write(f"Total Potongan Koin Shopee: Rp {df['Potongan Koin Shopee'].sum():,.0f}\n")
    f.write(f"Total Ongkir Dibayar Pembeli: Rp {df['Ongkos Kirim Dibayar oleh Pembeli'].sum():,.0f}\n")
    f.write(f"Total Estimasi Potongan Ongkir: Rp {df['Estimasi Potongan Biaya Pengiriman'].sum():,.0f}\n")
    f.write(f"Total Perkiraan Ongkos Kirim: Rp {df['Perkiraan Ongkos Kirim'].sum():,.0f}\n")

    # Harga distribution
    f.write("\n--- Distribusi Harga Awal ---\n")
    f.write(df['Harga Awal'].value_counts().to_string() + "\n")

    # === 5. PAYMENT METHOD ANALYSIS ===
    f.write("\n" + "=" * 60 + "\n")
    f.write("5. ANALISIS METODE PEMBAYARAN\n")
    f.write("=" * 60 + "\n")
    
    pay = df.groupby('Metode Pembayaran').agg(
        jumlah=('No. Pesanan', 'count'),
        total_revenue=('Total Pembayaran', 'sum')
    ).sort_values('total_revenue', ascending=False)
    f.write(pay.to_string() + "\n")

    # === 6. SHIPPING ANALYSIS ===
    f.write("\n" + "=" * 60 + "\n")
    f.write("6. ANALISIS PENGIRIMAN (SHIPPING)\n")
    f.write("=" * 60 + "\n")
    
    f.write("\n--- Opsi Pengiriman ---\n")
    ship = df.groupby('Opsi Pengiriman').agg(
        jumlah=('No. Pesanan', 'count'),
        avg_ongkir=('Perkiraan Ongkos Kirim', 'mean')
    ).sort_values('jumlah', ascending=False)
    f.write(ship.to_string() + "\n")
    
    f.write("\n--- Antar ke Counter vs Pickup ---\n")
    pickup = df['Antar ke counter/ pick-up'].value_counts()
    f.write(pickup.to_string() + "\n")

    # === 7. CUSTOMER ANALYSIS ===
    f.write("\n" + "=" * 60 + "\n")
    f.write("7. ANALISIS PELANGGAN (CUSTOMER)\n")
    f.write("=" * 60 + "\n")
    
    cust = df.groupby('Username (Pembeli)').agg(
        jumlah_pesanan=('No. Pesanan', 'nunique'),
        total_spent=('Total Pembayaran', 'sum'),
        total_qty=('Jumlah', 'sum')
    ).sort_values('total_spent', ascending=False)
    
    f.write(f"\nTotal Pelanggan Unik: {cust.shape[0]}\n")
    f.write(f"Pelanggan Repeat (>1 pesanan): {(cust['jumlah_pesanan'] > 1).sum()}\n")
    f.write(f"Repeat Rate: {(cust['jumlah_pesanan'] > 1).sum() / cust.shape[0] * 100:.1f}%\n")
    
    f.write("\n--- Top 10 Pelanggan (by Revenue) ---\n")
    f.write(cust.head(10).to_string() + "\n")
    
    # Customer segmentation
    f.write("\n--- Segmentasi Pelanggan ---\n")
    f.write(f"1 pesanan: {(cust['jumlah_pesanan'] == 1).sum()} pelanggan\n")
    f.write(f"2 pesanan: {(cust['jumlah_pesanan'] == 2).sum()} pelanggan\n")
    f.write(f"3+ pesanan: {(cust['jumlah_pesanan'] >= 3).sum()} pelanggan\n")

    # === 8. RETURN / CANCELLATION ===
    f.write("\n" + "=" * 60 + "\n")
    f.write("8. ANALISIS PENGEMBALIAN/PEMBATALAN\n")
    f.write("=" * 60 + "\n")
    
    returned = df[df['Returned quantity'].notna() & (df['Returned quantity'] > 0)]
    f.write(f"Jumlah pesanan dengan pengembalian: {len(returned)}\n")
    cancelled = df[df['Status Pembatalan/ Pengembalian'].notna()]
    f.write(f"Jumlah pesanan dengan status pembatalan/pengembalian: {len(cancelled)}\n")
    if len(cancelled) > 0:
        f.write(f"Status: {cancelled['Status Pembatalan/ Pengembalian'].value_counts().to_string()}\n")

    # === 9. MONTHLY GROWTH ===
    f.write("\n" + "=" * 60 + "\n")
    f.write("9. PERTUMBUHAN BULANAN (MONTH-OVER-MONTH)\n")
    f.write("=" * 60 + "\n")
    
    monthly_rev = df.groupby(df['Waktu Pesanan Dibuat'].dt.to_period('M'))['Total Pembayaran'].sum()
    monthly_rev_pct = monthly_rev.pct_change() * 100
    for period, rev in monthly_rev.items():
        growth = monthly_rev_pct.get(period)
        growth_str = f" ({growth:+.1f}%)" if pd.notna(growth) else ""
        f.write(f"{period}: Rp {rev:,.0f}{growth_str}\n")

    # === 10. DISCOUNT IMPACT ===
    f.write("\n" + "=" * 60 + "\n")
    f.write("10. ANALISIS DAMPAK DISKON\n")
    f.write("=" * 60 + "\n")
    
    df['has_discount'] = df['Total Diskon'] > 0
    disc = df.groupby('has_discount').agg(
        jumlah=('No. Pesanan', 'count'),
        avg_total=('Total Pembayaran', 'mean')
    )
    f.write(disc.to_string() + "\n")
    
    df['has_voucher_penjual'] = df['Voucher Ditanggung Penjual'] > 0
    voucher = df.groupby('has_voucher_penjual').agg(
        jumlah=('No. Pesanan', 'count'),
        avg_total=('Total Pembayaran', 'mean')
    )
    f.write("\n--- Dengan/Tanpa Voucher Penjual ---\n")
    f.write(voucher.to_string() + "\n")
    
    df['has_koin'] = df['Potongan Koin Shopee'] > 0
    koin = df.groupby('has_koin').agg(
        jumlah=('No. Pesanan', 'count'),
        avg_total=('Total Pembayaran', 'mean')
    )
    f.write("\n--- Dengan/Tanpa Potongan Koin ---\n")
    f.write(koin.to_string() + "\n")

    # === 11. ONGKIR ANALYSIS ===
    f.write("\n" + "=" * 60 + "\n")
    f.write("11. ANALISIS ONGKOS KIRIM\n")
    f.write("=" * 60 + "\n")
    
    f.write(f"Rata-rata ongkir yang dibayar pembeli: Rp {df['Ongkos Kirim Dibayar oleh Pembeli'].mean():,.0f}\n")
    f.write(f"Rata-rata subsidi ongkir (estimasi potongan): Rp {df['Estimasi Potongan Biaya Pengiriman'].mean():,.0f}\n")
    f.write(f"Pesanan dengan gratis ongkir (pembeli bayar 0): {(df['Ongkos Kirim Dibayar oleh Pembeli'] == 0).sum()}\n")
    f.write(f"Persentase gratis ongkir: {(df['Ongkos Kirim Dibayar oleh Pembeli'] == 0).sum() / len(df) * 100:.1f}%\n")

print("Deep analysis selesai! Lihat deep_analysis.txt")
