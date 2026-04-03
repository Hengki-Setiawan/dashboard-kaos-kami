import { useState, useMemo } from 'react';
import { Table, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const CURRENCY_COLS = new Set([
  'Harga Awal', 'Harga Setelah Diskon', 'Total Harga Produk', 'Total Diskon',
  'Diskon Dari Penjual', 'Diskon Dari Shopee', 'Voucher Ditanggung Penjual',
  'Cashback Koin', 'Voucher Ditanggung Shopee', 'Potongan Koin Shopee',
  'Diskon Kartu Kredit', 'Ongkos Kirim Dibayar oleh Pembeli',
  'Estimasi Potongan Biaya Pengiriman', 'Ongkos Kirim Pengembalian Barang',
  'Total Pembayaran', 'Perkiraan Ongkos Kirim'
]);

const formatCurrency = (val) => {
  const num = parseFloat(val);
  if (isNaN(num)) return '-';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0
  }).format(num * 1000);
};

const formatCell = (val, col) => {
  if (val === null || val === undefined || val === '' || (typeof val === 'number' && isNaN(val))) return '-';
  if (CURRENCY_COLS.has(col)) return formatCurrency(val);
  return String(val);
};

export default function DataTable({ data }) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const rowsPerPage = 15;

  // Dynamically get ALL columns from first data row
  const allCols = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  // Filter with search term
  const filteredRows = useMemo(() =>
    data.filter(row =>
      Object.values(row).some(
        val => String(val ?? '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    ), [data, searchTerm]);

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="panel overflow-hidden flex flex-col w-full bg-card rounded-2xl shadow-sm border border-border">
      {/* Header */}
      <div className="flex px-4 sm:px-5 py-4 flex-col sm:flex-row gap-3 border-b border-border items-center justify-between bg-card shrink-0">
        <h3 className="font-semibold flex items-center gap-2 m-0 text-base whitespace-nowrap">
          <Table size={18} className="text-primary" />
          Raw Data Penjualan
          <span className="text-xs font-normal text-muted-foreground">({allCols.length} kolom)</span>
        </h3>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari pesanan..."
            className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border border-border bg-transparent text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {/* Scrollable table */}
      <div className="overflow-x-auto w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
        <table className="text-sm text-left whitespace-nowrap" style={{ minWidth: `${allCols.length * 160}px` }}>
          <thead className="text-[10px] uppercase bg-accent/50 text-muted-foreground sticky top-0 z-10">
            <tr>
              <th className="px-3 py-3 font-semibold bg-accent/80 sticky left-0 z-20 min-w-[140px]">No. Pesanan</th>
              {allCols.filter(c => c !== 'No. Pesanan').map((col, idx) => (
                <th key={idx} className="px-3 py-3 font-semibold min-w-[140px]">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {currentRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-accent/40 transition-colors">
                {/* Sticky first column */}
                <td className="px-3 py-2.5 font-mono text-[11px] bg-card sticky left-0 z-10 border-r border-border">
                  {row['No. Pesanan'] || '-'}
                </td>
                {allCols.filter(c => c !== 'No. Pesanan').map((col, cIdx) => (
                  <td key={cIdx} className={`px-3 py-2.5 text-xs ${
                    col === 'Status Pesanan' ? '' :
                    CURRENCY_COLS.has(col) ? 'font-semibold text-emerald-600 dark:text-emerald-400' :
                    'text-muted-foreground'
                  }`}>
                    {col === 'Status Pesanan' ? (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                        row[col] === 'Selesai' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                        String(row[col]).includes('Batal') ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                        'bg-slate-500/10 text-slate-600 border-slate-500/20'
                      }`}>{row[col] || '-'}</span>
                    ) : formatCell(row[col], col)}
                  </td>
                ))}
              </tr>
            ))}
            {currentRows.length === 0 && (
              <tr>
                <td colSpan={allCols.length} className="px-4 py-8 text-center text-muted-foreground">
                  Data tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Scroll hint */}
      <div className="text-center text-[10px] text-muted-foreground py-1 border-t border-border bg-accent/20">
        ← Geser tabel ke kiri/kanan untuk melihat semua kolom →
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-border bg-card shrink-0">
        <span className="text-xs text-muted-foreground text-center sm:text-left">
          Menampilkan {filteredRows.length === 0 ? 0 : startIndex + 1} – {Math.min(startIndex + rowsPerPage, filteredRows.length)} dari {filteredRows.length} entri
        </span>
        <div className="flex items-center gap-1">
          <button disabled={page === 1} onClick={() => setPage(1)}
            className="p-1.5 rounded-md hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronsLeft size={14} />
          </button>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="p-1.5 rounded-md hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-medium px-2 tabular-nums">{page} / {totalPages || 1}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
            className="p-1.5 rounded-md hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight size={16} />
          </button>
          <button disabled={page >= totalPages} onClick={() => setPage(totalPages)}
            className="p-1.5 rounded-md hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronsRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
