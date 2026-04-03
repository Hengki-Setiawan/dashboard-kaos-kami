import { useState, useMemo } from 'react';
import salesData from '../data/salesData.json';

const computeDateBounds = () => {
  let min = Infinity;
  let max = -Infinity;
  salesData.forEach(item => {
    const d = new Date(item['Waktu Pesanan Dibuat']).getTime();
    if (!isNaN(d)) {
      if (d < min) min = d;
      if (d > max) max = d;
    }
  });
  if (min === Infinity) return [null, null];
  
  // Format as YYYY-MM-DD in local time
  const minDate = new Date(min);
  const maxDate = new Date(max);
  
  return [
    `${minDate.getFullYear()}-${String(minDate.getMonth()+1).padStart(2,'0')}-${String(minDate.getDate()).padStart(2,'0')}`,
    `${maxDate.getFullYear()}-${String(maxDate.getMonth()+1).padStart(2,'0')}-${String(maxDate.getDate()).padStart(2,'0')}`
  ];
};

const DEFAULT_DATE_BOUNDS = computeDateBounds();

export function useFilteredData() {
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_BOUNDS);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [selectedShippings, setSelectedShippings] = useState([]);

  const availableProducts = useMemo(() => {
    return [...new Set(salesData.map(item => item['Nama Produk']))].filter(Boolean);
  }, []);

  const availableProvinces = useMemo(() => {
    return [...new Set(salesData.map(item => item['Provinsi']))].filter(Boolean);
  }, []);

  const availablePayments = useMemo(() => {
    return [...new Set(salesData.map(item => item['Metode Pembayaran']))].filter(Boolean);
  }, []);

  const availableShippings = useMemo(() => {
    return [...new Set(salesData.map(item => item['Opsi Pengiriman']))].filter(Boolean);
  }, []);

  const filteredData = useMemo(() => {
    // Escalate financial numbers globally so all charts reflect realistic amounts
    const scaledData = salesData.map(item => {
      const THOUSAND_FIELDS = [
        'Harga Awal', 'Harga Setelah Diskon', 'Total Harga Produk', 
        'Total Diskon', 'Diskon Dari Penjual', 'Diskon Dari Shopee', 
        'Ongkos Kirim Dibayar oleh Pembeli', 'Estimasi Potongan Biaya Pengiriman', 
        'Ongkos Kirim Pengembalian Barang', 'Total Pembayaran', 'Perkiraan Ongkos Kirim'
      ];
      const newItem = { ...item };
      THOUSAND_FIELDS.forEach(field => {
        if (newItem[field] !== undefined && newItem[field] !== null) {
          newItem[field] = (parseFloat(newItem[field]) || 0) * 1000;
        }
      });
      return newItem;
    });

    return scaledData.filter(item => {
      // Product Filter
      if (selectedProducts.length > 0 && !selectedProducts.includes(item['Nama Produk'])) return false;
      
      // Province Filter
      if (selectedProvinces.length > 0 && !selectedProvinces.includes(item['Provinsi'])) return false;
      
      // Payment Filter
      if (selectedPayments.length > 0 && !selectedPayments.includes(item['Metode Pembayaran'])) return false;
      
      // Shipping Filter
      if (selectedShippings.length > 0 && !selectedShippings.includes(item['Opsi Pengiriman'])) return false;
      
      // Date Filter
      if (dateRange[0] || dateRange[1]) {
        const itemDate = new Date(item['Waktu Pesanan Dibuat']).getTime();
        
        if (dateRange[0]) {
          const start = new Date(dateRange[0] + "T00:00:00").getTime();
          if (itemDate < start) return false;
        }
        
        if (dateRange[1]) {
          const end = new Date(dateRange[1] + "T23:59:59.999").getTime();
          if (itemDate > end) return false;
        }
      }
      
      return true;
    });
  }, [dateRange, selectedProducts, selectedProvinces, selectedPayments, selectedShippings]);

  return {
    filteredData,
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
    availableProducts,
    availableProvinces,
    availablePayments,
    availableShippings,
    dateBounds: DEFAULT_DATE_BOUNDS
  };
}
