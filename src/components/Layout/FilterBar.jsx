import { X } from 'lucide-react';
import { Button } from '../UI/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../UI/select';

export default function FilterBar({ filters }) {
  const {
    dateRange,
    setDateRange,
    selectedProducts,
    setSelectedProducts,
    selectedProvinces,
    setSelectedProvinces,
    selectedPayments,
    setSelectedPayments,
    selectedShippings,
    setSelectedShippings,
  } = filters;

  const handleClearFiters = () => {
    setDateRange(filters.dateBounds || [null, null]);
    setSelectedProducts([]);
    setSelectedProvinces([]);
    setSelectedPayments([]);
    setSelectedShippings([]);
  };

  const hasFilters = selectedProducts.length > 0 || selectedProvinces.length > 0 || 
                     selectedPayments.length > 0 || selectedShippings.length > 0 ||
                     dateRange[0] !== filters.dateBounds?.[0] || dateRange[1] !== filters.dateBounds?.[1];

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-center w-full mb-6 p-4 rounded-xl bg-card border border-border shadow-sm">
      
      <Select 
        value={selectedProducts.length > 0 ? selectedProducts[0] : undefined} 
        onValueChange={(val) => {
          if (val === "semua") setSelectedProducts([]);
          else setSelectedProducts([val]);
        }}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Semua Produk" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="semua">Semua Produk</SelectItem>
          {filters.availableProducts?.map(prod => (
            <SelectItem key={prod} value={prod}>{prod}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={selectedProvinces.length > 0 ? selectedProvinces[0] : undefined} 
        onValueChange={(val) => {
          if (val === "semua") setSelectedProvinces([]);
          else setSelectedProvinces([val]);
        }}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Semua Provinsi" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="semua">Semua Provinsi</SelectItem>
          {filters.availableProvinces?.map(prov => (
            <SelectItem key={prov} value={prov}>{prov}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={selectedPayments.length > 0 ? selectedPayments[0] : undefined} 
        onValueChange={(val) => {
          if (val === "semua") setSelectedPayments([]);
          else setSelectedPayments([val]);
        }}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Semua Pembayaran" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="semua">Semua Pembayaran</SelectItem>
          {filters.availablePayments?.map(pay => (
             <SelectItem key={pay} value={pay}>{pay}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={selectedShippings.length > 0 ? selectedShippings[0] : undefined} 
        onValueChange={(val) => {
          if (val === "semua") setSelectedShippings([]);
          else setSelectedShippings([val]);
        }}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Semua Pengiriman" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="semua">Semua Pengiriman</SelectItem>
          {filters.availableShippings?.map(ship => (
             <SelectItem key={ship} value={ship}>{ship}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-col w-full sm:w-auto sm:flex-row items-start sm:items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground whitespace-nowrap hidden lg:block">Periode:</label>
        <div className="flex gap-2 w-full sm:w-auto">
          <input 
            type="date" 
            className="text-sm px-3 py-2 flex-1 sm:flex-none border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={dateRange[0] || ''}
            min={filters.dateBounds?.[0]}
            max={filters.dateBounds?.[1]}
            onChange={(e) => setDateRange([e.target.value || null, dateRange[1]])}
          />
          <span className="text-muted-foreground flex items-center">-</span>
          <input 
            type="date" 
            className="text-sm px-3 py-2 flex-1 sm:flex-none border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={dateRange[1] || ''}
            min={filters.dateBounds?.[0]}
            max={filters.dateBounds?.[1]}
            onChange={(e) => setDateRange([dateRange[0], e.target.value || null])}
          />
        </div>
      </div>

      {hasFilters && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleClearFiters}
          className="rounded-full gap-2 border-primary/20 text-primary hover:bg-primary/10 ml-auto"
        >
          <X size={14} /> Reset
        </Button>
      )}
    </div>
  );
}
