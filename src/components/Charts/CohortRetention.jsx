import { useMemo, useState } from 'react';
import ChartCard from '../UI/ChartCard';
import { COLORS } from '../../utils/constants';

export default function CohortRetention({ data }) {
  const [hoveredCell, setHoveredCell] = useState(null);

  const { cohorts, maxMonths } = useMemo(() => {
    const firstPurchase = {};
    const purchases = [];

    // Identify first purchase date for each user
    data.forEach(item => {
      const cust = item['Username (Pembeli)'];
      const dateStr = item['Waktu Pesanan Dibuat'];
      if (!cust || !dateStr) return;
      
      const date = new Date(dateStr);
      // Format as YYYY-MM
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!firstPurchase[cust] || date < new Date(firstPurchase[cust])) {
        firstPurchase[cust] = monthStr;
      }
      purchases.push({ cust, month: monthStr });
    });

    // Group users by cohort (first purchase month)
    const cohortMap = {};
    Object.values(firstPurchase).forEach(month => {
      if (!cohortMap[month]) cohortMap[month] = { users: new Set(), retention: {} };
    });

    // Populate cohort user sets
    Object.keys(firstPurchase).forEach(cust => {
      const cohortMonth = firstPurchase[cust];
      cohortMap[cohortMonth].users.add(cust);
    });

    // Calculate month offsets (M+0, M+1, etc)
    let maxCols = 0;
    
    purchases.forEach(p => {
      const cohortMonth = firstPurchase[p.cust];
      const pYear = parseInt(p.month.split('-')[0]);
      const pMonth = parseInt(p.month.split('-')[1]);
      const cYear = parseInt(cohortMonth.split('-')[0]);
      const cMonth = parseInt(cohortMonth.split('-')[1]);
      
      // Calculate diff in months
      const diffMonths = (pYear - cYear) * 12 + (pMonth - cMonth);
      
      // Track retention
      if (!cohortMap[cohortMonth].retention[diffMonths]) {
        cohortMap[cohortMonth].retention[diffMonths] = new Set();
      }
      cohortMap[cohortMonth].retention[diffMonths].add(p.cust);
      
      if (diffMonths > maxCols) maxCols = diffMonths;
    });

    // Format final data array
    const sortedCohorts = Object.keys(cohortMap).sort().map(month => {
      const cohortSize = cohortMap[month].users.size;
      const retentionData = [];
      
      for (let i = 0; i <= maxCols; i++) {
        if (cohortMap[month].retention[i]) {
          const count = cohortMap[month].retention[i].size;
          retentionData.push({
            monthIndex: i,
            count: count,
            percentage: (count / cohortSize) * 100
          });
        }
      }
      return {
        month,
        size: cohortSize,
        retention: retentionData
      };
    });

    return { cohorts: sortedCohorts, maxMonths: maxCols };
  }, [data]);

  const getColor = (percent, index) => {
    if (index === 0) return 'rgba(59, 130, 246, 0.9)'; // Primary blue for M0
    if (!percent || percent === 0) return 'hsla(var(--muted), 0.3)'; // Faint background for 0
    
    // Scale color brightness based on percentage
    const opacity = Math.max(0.15, Math.min(1, percent / 20)); // Capped at 20% for pure emerald
    return `rgba(16, 185, 129, ${opacity})`; // Emerald tint
  };

  return (
    <ChartCard 
      title="Peta Retensi Pelanggan (Kohort)"
      className="col-span-full xl:col-span-1"
      chartType="Matriks Heatmap Vertikal/Horizontal (Kustom)"
      purpose="Alat validasi kualitas produk murni. Secara kejam memperlihatkan seberapa bertahan konsumen pasca pembelian perdananya."
      dataDef="Baris pertama (Bulan Bergabung) dihitung mulai dari 100% pada Bulan 0. Sisa kolom di kanan menunjukkan sisa % populasi yang kembali di bulan +1, +2 dst."
      formula="Matrix intersection: Jika array Username di Bulan X beririsan/ada kembali pada Array transaksi di Bulan Y (X+1 dst)."
      insight="Sangat wajar jika Retensi Drop ekstrem ke angka 5-15% pasca +1 Bulan di industri e-Commerce konsumtif kaos/baju."
      tips="Strategi 'Subsidi Silang': Pakai margin bersih dari angka-angka kecil berwarna hijau untuk mengakuisisi pengguna baru (Bulan 0). Ini dinamakan LTV (Life-Time Value) arbitrage."
      dataSummary={JSON.stringify(cohorts.map(c => ({ bulan_akuisisi: c.month, jumlah: c.size, bulan_ke_1_persen: c.retention.find(r=>r.monthIndex===1)?.percentage || 0})))}
    >
      <div className="w-full h-full min-h-[300px] flex flex-col overflow-x-auto custom-scrollbar pt-2">
        <div className="w-full min-w-[600px] pb-4">
          
          {/* Header Row */}
          <div className="flex text-xs font-semibold text-[hsl(var(--muted-foreground))] mb-2 px-1">
            <div className="w-32 shrink-0">Bulan Bergabung</div>
            <div className="w-24 shrink-0 text-center pr-2">Total Pelanggan</div>
            {Array.from({ length: maxMonths + 1 }).map((_, i) => (
              <div key={i} className="flex-1 min-w-[60px] text-center">
                {i === 0 ? 'Bulan 0' : `+${i} Bln`}
              </div>
            ))}
          </div>
          
          {/* Data Rows */}
          <div className="flex flex-col gap-1 px-1">
            {cohorts.map((cohort, cIdx) => (
              <div key={cohort.month} className="flex items-stretch text-xs">
                {/* Cohort Name */}
                <div className="w-32 shrink-0 flex items-center font-bold text-[hsl(var(--foreground))]">
                  {new Date(`${cohort.month}-01`).toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
                </div>
                
                {/* Cohort Size */}
                <div className="w-24 shrink-0 flex items-center justify-center pr-2 text-foreground font-medium">
                  {cohort.size} <span className="opacity-60 ml-1">org</span>
                </div>
                
                {/* Retention Cells */}
                {Array.from({ length: maxMonths + 1 }).map((_, i) => {
                  const dataPoint = cohort.retention.find(r => r.monthIndex === i);
                  
                  // Future months stay empty
                  if (cIdx + i > maxMonths && !dataPoint) {
                    return <div key={i} className="flex-1 min-w-[60px] shrink-0 m-0.5" />;
                  }

                  const percent = dataPoint ? dataPoint.percentage : 0;
                  const count = dataPoint ? dataPoint.count : 0;
                  const isHovered = hoveredCell?.cohort === cohort.month && hoveredCell?.month === i;

                  return (
                    <div 
                      key={i} 
                      className="flex-1 min-w-[60px] h-11 shrink-0 m-0.5 rounded cursor-pointer relative flex flex-col items-center justify-center shadow-sm"
                      style={{ 
                        backgroundColor: getColor(percent, i),
                        color: i === 0 || percent > 15 ? 'white' : 'hsl(var(--foreground))',
                        border: isHovered ? `1px solid ${COLORS.amber}` : '1px solid rgba(0,0,0,0.05)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={() => setHoveredCell({ cohort: cohort.month, month: i, percent, count })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {percent > 0 ? (
                        i === 0 ? (
                          <span className="text-[13px] font-bold">{count}</span>
                        ) : (
                          <>
                            <span className="text-[12px] font-bold leading-none">{percent.toFixed(0)}%</span>
                            <span className="text-[9px] mt-[2px] opacity-80 font-medium">({count} org)</span>
                          </>
                        )
                      ) : (
                        <span className="opacity-30 font-bold">-</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

        </div>
      </div>
    </ChartCard>
  );
}
