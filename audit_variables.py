import pandas as pd

file_path = r"d:\Vibe coding (tugas)\Diagram data simbis\Data penjualan kaos kami.xlsx"
df = pd.read_excel(file_path)

# All 48 columns
all_cols = df.columns.tolist()

# Columns that ARE used in current blueprint
used_cols = [
    'No. Pesanan',                    # KPI: total orders, drill-down ID
    'Status Pesanan',                 # (all "Selesai" - only 1 value)
    'Status Pembatalan/ Pengembalian',# Return analysis
    'Opsi Pengiriman',                # Shipping analysis
    'Antar ke counter/ pick-up',      # Shipping analysis (counter vs pickup)
    'Waktu Pesanan Dibuat',           # Time analysis, trends
    'Waktu Pembayaran Dilakukan',     # (used for lead time partially)
    'Waktu Pesanan Selesai',          # Lead time calc
    'Metode Pembayaran',              # Payment methods
    'Nama Produk',                    # Product performance
    'Nama Variasi',                   # Size distribution
    'Harga Awal',                     # Price distribution
    'Harga Setelah Diskon',           # Discount analysis
    'Jumlah',                         # Units sold
    'Returned quantity',              # Return analysis
    'Total Harga Produk',             # Financial
    'Total Diskon',                   # Discount analysis
    'Diskon Dari Penjual',            # Discount breakdown
    'Diskon Dari Shopee',             # Discount breakdown
    'Jumlah Produk di Pesan',         # Basket analysis
    'Voucher Ditanggung Penjual',     # Voucher analysis
    'Cashback Koin',                  # (all 0)
    'Voucher Ditanggung Shopee',      # Voucher analysis
    'Potongan Koin Shopee',           # Koin analysis
    'Ongkos Kirim Dibayar oleh Pembeli',  # Shipping cost
    'Estimasi Potongan Biaya Pengiriman', # Shipping subsidy
    'Total Pembayaran',               # Revenue KPI
    'Perkiraan Ongkos Kirim',         # Shipping cost
    'Username (Pembeli)',             # Customer analysis
    'Kota/Kabupaten',                 # Geographic
    'Provinsi',                       # Geographic
]

# Columns NOT used
unused = [c for c in all_cols if c not in used_cols]

with open("variable_audit.txt", "w", encoding="utf-8") as f:
    f.write("=" * 60 + "\n")
    f.write("AUDIT: KOLOM YANG BELUM DIGUNAKAN\n")
    f.write("=" * 60 + "\n\n")
    
    for col in unused:
        f.write(f"\n--- {col} ---\n")
        f.write(f"  Tipe: {df[col].dtype}\n")
        f.write(f"  Null: {df[col].isnull().sum()} / {len(df)}\n")
        if df[col].dtype == 'object':
            f.write(f"  Unique: {df[col].nunique()}\n")
            sample = df[col].dropna().unique()[:5]
            f.write(f"  Sample: {sample}\n")
        else:
            f.write(f"  Min: {df[col].min()}, Max: {df[col].max()}, Mean: {df[col].mean():.2f}\n")
            f.write(f"  Unique values: {sorted(df[col].dropna().unique()[:10])}\n")

    f.write("\n\n" + "=" * 60 + "\n")
    f.write("KOLOM YANG SUDAH DIGUNAKAN\n")
    f.write("=" * 60 + "\n")
    for c in used_cols:
        f.write(f"  ✅ {c}\n")
    
    f.write(f"\n\nTotal kolom: {len(all_cols)}\n")
    f.write(f"Digunakan: {len(used_cols)}\n")
    f.write(f"Belum digunakan: {len(unused)}\n")

    # Extra analysis for unused columns
    f.write("\n\n" + "=" * 60 + "\n")
    f.write("ANALISIS MENDALAM KOLOM YANG BELUM DIGUNAKAN\n")
    f.write("=" * 60 + "\n")
    
    # No. Resi - shipping tracking
    f.write("\n--- No. Resi ---\n")
    f.write(f"  Bisa digunakan untuk: Identifikasi unik paket, tracking\n")
    f.write(f"  Unique: {df['No. Resi'].nunique()}\n")
    
    # Pesanan Harus Dikirimkan Sebelum
    f.write("\n--- Pesanan Harus Dikirimkan Sebelum ---\n")
    df['deadline'] = pd.to_datetime(df['Pesanan Harus Dikirimkan Sebelum (Menghindari keterlambatan)'])
    df['created'] = pd.to_datetime(df['Waktu Pesanan Dibuat'])
    df['shipped'] = pd.to_datetime(df['Waktu Pengiriman Diatur'])
    df['deadline_hours'] = (df['deadline'] - df['created']).dt.total_seconds() / 3600
    f.write(f"  Rata-rata deadline dari pesanan dibuat: {df['deadline_hours'].mean():.1f} jam\n")
    
    # Check if any orders shipped AFTER deadline
    late = df[df['shipped'] > df['deadline']]
    f.write(f"  Pesanan terlambat kirim (shipped after deadline): {len(late)}\n")
    ontime = df[df['shipped'] <= df['deadline']]
    f.write(f"  Pesanan tepat waktu: {len(ontime.dropna())}\n")
    
    # Waktu Pengiriman Diatur
    f.write("\n--- Waktu Pengiriman Diatur ---\n")
    df['ship_time'] = (df['shipped'] - df['created']).dt.total_seconds() / 3600
    f.write(f"  Rata-rata waktu pengaturan pengiriman: {df['ship_time'].mean():.1f} jam\n")
    f.write(f"  Min: {df['ship_time'].min():.1f} jam\n")
    f.write(f"  Max: {df['ship_time'].max():.1f} jam\n")
    
    # SKU Induk & Nomor Referensi SKU
    f.write("\n--- SKU Induk ---\n")
    f.write(f"  Semua NULL ({df['SKU Induk'].isnull().sum()}/{len(df)}) - TIDAK BERGUNA\n")
    f.write("\n--- Nomor Referensi SKU ---\n")
    f.write(f"  Semua NULL ({df['Nomor Referensi SKU'].isnull().sum()}/{len(df)}) - TIDAK BERGUNA\n")
    
    # Berat Produk & Total Berat
    f.write("\n--- Berat Produk ---\n")
    f.write(f"  Values: {df['Berat Produk'].value_counts().to_dict()}\n")
    f.write("\n--- Total Berat ---\n")
    f.write(f"  Values: {df['Total Berat'].value_counts().to_dict()}\n")
    
    # Paket Diskon columns
    f.write("\n--- Paket Diskon ---\n")
    f.write(f"  Semua 'N' - TIDAK BERGUNA (tidak ada paket diskon)\n")
    f.write("\n--- Paket Diskon (Diskon dari Shopee) ---\n")
    f.write(f"  Semua 0 - TIDAK BERGUNA\n")
    f.write("\n--- Paket Diskon (Diskon dari Penjual) ---\n")
    f.write(f"  Semua 0 - TIDAK BERGUNA\n")
    
    # Diskon Kartu Kredit
    f.write("\n--- Diskon Kartu Kredit ---\n")
    f.write(f"  Semua 0 - TIDAK BERGUNA\n")
    
    # Ongkos Kirim Pengembalian
    f.write("\n--- Ongkos Kirim Pengembalian Barang ---\n")
    f.write(f"  Semua 0 - TIDAK BERGUNA\n")
    
    # Catatan dari Pembeli
    f.write("\n--- Catatan dari Pembeli ---\n")
    f.write(f"  Non-null: {df['Catatan dari Pembeli'].notna().sum()}\n")
    notes = df['Catatan dari Pembeli'].dropna().tolist()
    for n in notes[:10]:
        f.write(f"    - \"{n}\"\n")
    
    # Catatan (seller notes)
    f.write("\n--- Catatan ---\n")
    f.write(f"  Semua NULL - TIDAK BERGUNA\n")
    
    # Personal data columns
    f.write("\n--- Nama Penerima ---\n")
    f.write(f"  Data privasi (masked) - TIDAK dipakai di dashboard\n")
    f.write("\n--- No. Telepon ---\n")
    f.write(f"  Data privasi (masked) - TIDAK dipakai di dashboard\n")
    f.write("\n--- Alamat Pengiriman ---\n")
    f.write(f"  Data privasi (partial masked) - TIDAK dipakai langsung\n")
    f.write(f"  TAPI bisa extract kode pos untuk analisis area\n")
    
    # Waktu Pembayaran
    f.write("\n--- Waktu Pembayaran Dilakukan (analysis) ---\n")
    df['pay_time'] = pd.to_datetime(df['Waktu Pembayaran Dilakukan'])
    df['payment_delay'] = (df['pay_time'] - df['created']).dt.total_seconds() / 60
    f.write(f"  Rata-rata delay pembayaran: {df['payment_delay'].mean():.1f} menit\n")
    f.write(f"  Median: {df['payment_delay'].median():.1f} menit\n")
    f.write(f"  Max: {df['payment_delay'].max():.1f} menit\n")

print("Audit selesai! Lihat variable_audit.txt")
