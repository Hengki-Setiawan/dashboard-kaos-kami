import { useState } from 'react';
import { Table, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const formatCurrency = (val) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val);
};

export default function DataTable({ data }) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const rowsPerPage = 10;

  // Filter with term
  const filteredRows = data.filter(row => 
    Object.values(row).some(
      val => String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

  const selectedCols = [
    'No. Pesanan',
    'Waktu Pesanan Dibuat',
    'Status Pesanan',
    'Total Pembayaran',
    'Kota/Kabupaten',
    'Kurir'
  ];

  return (
    <div className="panel overflow-hidden flex flex-col w-full bg-card rounded-2xl shadow-sm border border-border">
      <div className="flex px-5 py-4 flex-col sm:flex-row gap-3 border-b border-border items-center justify-between bg-card shrink-0">
        <h3 className="font-semibold flex items-center gap-2 m-0 text-base">
          <Table size={18} className="text-primary" />
          Raw Data Penjualan
        </h3>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Cari pesanan..." 
            className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border border-border bg-transparent text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs uppercase bg-accent/50 text-muted-foreground">
            <tr>
              {selectedCols.map((col, idx) => (
                 <th key={idx} className="px-4 py-3 font-semibold">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {currentRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-accent/40 transition-colors">
                <td className="px-4 py-3 font-mono text-xs">{row['No. Pesanan']}</td>
                <td className="px-4 py-3 text-muted-foreground">{row['Waktu Pesanan Dibuat']?.slice(0, 10)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-medium border ${
                    row['Status Pesanan'] === 'Selesai' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                    row['Status Pesanan']?.includes('Batal') ? 'bg-red-500/10 text-red-600 border-red-500/20' : 
                    'bg-slate-500/10 text-slate-600 border-slate-500/20'
                  }`}>
                    {row['Status Pesanan'] || 'Unknown'}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(row['Total Pembayaran'] || 0)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{row['Kota/Kabupaten']}</td>
                <td className="px-4 py-3 text-muted-foreground">{row['Kurir']}</td>
              </tr>
            ))}
            {currentRows.length === 0 && (
              <tr>
                <td colSpan={selectedCols.length} className="px-4 py-8 text-center text-muted-foreground">
                  Data tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t border-border bg-card shrink-0">
        <span className="text-xs text-muted-foreground text-center sm:text-left">
          Menampilkan {filteredRows.length === 0 ? 0 : startIndex + 1} hingga {Math.min(startIndex + rowsPerPage, filteredRows.length)} dari {filteredRows.length} entri
        </span>
        <div className="flex items-center gap-2">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="p-1.5 rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed border border-transparent disabled:hover:bg-transparent"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium px-2">{page} / {totalPages || 1}</span>
          <button 
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(p => p + 1)}
            className="p-1.5 rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed border border-transparent disabled:hover:bg-transparent"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
