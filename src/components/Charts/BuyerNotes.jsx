import { useMemo } from 'react';
import ChartCard from '../UI/ChartCard';
import { MessageSquare } from 'lucide-react';

export default function BuyerNotes({ data }) {
  const notes = useMemo(() => {
    return data
      .filter(item => item['Catatan dari Pembeli'] && item['Catatan dari Pembeli'].trim() !== '')
      .map(item => ({
        text: item['Catatan dari Pembeli'],
        user: item['Username (Pembeli)'],
        date: item['Waktu Pesanan Dibuat']
      }));
  }, [data]);

  return (
    <ChartCard 
      title="Catatan Spesial Pembeli"
      chartType="Feed List (Tabel Interaktif)"
      purpose="Pusat komunikasi customer. Memonitor instruksi khusus yang rentan terabaikan oleh tim fulfillment / gudang."
      dataDef="Hanya menampilkan daftar mentah catatan (Notes) yang diketik oleh pembeli sebelum proses pelunasan di aplikasi."
      formula="Filter baris dimana kolom Catatan Pembeli memiliki panjang string/teks."
      insight="Biasanya diisi dengan permintaan yang tidak tercover oleh varian sistem seperti ucapan selamat ulang tahun atau request bungkus khusus."
      tips="Selalu sediakan Spidol/Kertas stiker di area packing agar admin bisa langsung membaca checklist ini sebelum paket dilakban."
      className="col-span-full md:col-span-1"
      dataSummary={JSON.stringify(notes.slice(0, 3))} // top 3 recents
    >
      <div className="w-full h-full min-h-[250px] max-h-[300px] overflow-y-auto custom-scrollbar pr-2 mt-2">
        {notes.length > 0 ? (
          <div className="space-y-3">
            {notes.map((note, idx) => (
              <div key={idx} className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] p-3 rounded-lg flex gap-3">
                <div className="mt-1 flex-shrink-0 text-blue-500 bg-blue-500/10 p-1.5 rounded-full">
                  <MessageSquare size={14} />
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold text-xs text-foreground truncate max-w-[120px]">{note.user}</span>
                    <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                      {new Date(note.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] italic">
                    "{note.text}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 h-full flex flex-col items-center justify-center text-[hsl(var(--muted-foreground))] py-10">
            <p className="text-sm">Tidak ada catatan pembeli.</p>
          </div>
        )}
      </div>
    </ChartCard>
  );
}
