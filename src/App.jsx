import { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import FilterBar from './components/Layout/FilterBar';
import KPICard from './components/Cards/KPICard';
import RevenueTrend from './components/Charts/RevenueTrend';
import WeeklyTrend from './components/Charts/WeeklyTrend';
import TimeHeatmap from './components/Charts/TimeHeatmap';
import ProductPerformance from './components/Charts/ProductPerformance';
import SizeDistribution from './components/Charts/SizeDistribution';
import IndonesiaMap from './components/Charts/IndonesiaMap';
import GeoBarChart from './components/Charts/GeoBarChart';
import PaymentMethods from './components/Charts/PaymentMethods';
import ShippingAnalysis from './components/Charts/ShippingAnalysis';
import ShippingCost from './components/Charts/ShippingCost';
import DiscountWaterfall from './components/Charts/DiscountWaterfall';
import CustomerSegment from './components/Charts/CustomerSegment';
import RFMAnalysis from './components/Charts/RFMAnalysis';
import CohortRetention from './components/Charts/CohortRetention';
import ShippingTimeline from './components/Charts/ShippingTimeline';
import ProfitMargin from './components/Charts/ProfitMargin';
import PaymentSpeed from './components/Charts/PaymentSpeed';
import WeightAnalysis from './components/Charts/WeightAnalysis';
import LeadTime from './components/Charts/LeadTime';
import OrderStatus from './components/Charts/OrderStatus';
import OrderFunnel from './components/Charts/OrderFunnel';
import ParetoChart from './components/Charts/ParetoChart';
import DayOfWeek from './components/Charts/DayOfWeek';
import ShippingPromo from './components/Charts/ShippingPromo';
import RefundReason from './components/Charts/RefundReason';
import BuyerNotes from './components/Charts/BuyerNotes';
import InsightsPanel from './components/InsightsPanel';
import DataTable from './components/Tables/DataTable';
import { useMemo } from 'react';
import { useFilteredData } from './hooks/useFilteredData';
import { 
  DollarSign, ShoppingBag, ShoppingCart, TrendingUp, Users, 
  RefreshCcw, CornerDownLeft, ArrowUp,
  BarChart3, Package, MapPin, Wallet, UserCheck, Truck, Lightbulb
} from 'lucide-react';

/* ── Section Header Component ── */
function SectionHeader({ icon, title, subtitle, color }) {
  return (
    <div className="section-header">
      <div className="section-icon" style={{ background: `${color}12`, color }}>
        {icon}
      </div>
      <div className="section-meta">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function App() {
  const filters = useFilteredData();
  const { filteredData } = filters;
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for Scroll-Spy
  useEffect(() => {
    const observerOptions = {
      rootMargin: '-20% 0px -70% 0px', // Focus window: 20% to 30% from the top of the viewport
      threshold: 0 // Trigger as soon as 1 pixel of the section enters the focus window
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Select all sections with an ID (the navigation IDs)
    const sectionIds = ['overview', 'revenue', 'products', 'geography', 'financials', 'customers', 'shipping', 'insights'];
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const metrics = useMemo(() => {
    let revenue = 0, units = 0, returns = 0;
    const uniqueOrders = new Set();
    const uniqueCustomers = new Set();
    const customerOrderCounts = {};

    filteredData.forEach(item => {
      revenue += parseFloat(item['Total Pembayaran']) || 0;
      units += parseInt(item['Jumlah']) || 0;
      returns += parseInt(item['Returned quantity']) || 0;
      const orderId = item['No. Pesanan'];
      const customer = item['Username (Pembeli)'];
      if (orderId) uniqueOrders.add(orderId);
      if (customer) {
        uniqueCustomers.add(customer);
        customerOrderCounts[customer] = (customerOrderCounts[customer] || 0) + 1;
      }
    });

    const orders = uniqueOrders.size;
    const customers = uniqueCustomers.size;
    const aov = orders > 0 ? revenue / orders : 0;
    const repeatCustomers = Object.values(customerOrderCounts).filter(c => c > 1).length;
    const repeatRate = customers > 0 ? (repeatCustomers / customers) * 100 : 0;
    const returnRate = orders > 0 ? (returns / orders) * 100 : 0;

    return { revenue, orders, units, aov, customers, repeatRate, returnRate };
  }, [filteredData]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Animated Mesh Gradient Background */}
      <div className="animated-bg" />

      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Overlay for Mobile Sidebar */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div 
        className={`flex-1 flex flex-col relative z-10 transition-all duration-300 ease-out min-w-0 ml-0 ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'}`}
      >
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 overflow-x-hidden">
          <FilterBar filters={filters} />

          <div className="flex flex-col gap-10 max-w-[1500px] mx-auto pb-20">

            {/* ═══ OVERVIEW KPI ═══ */}
            <section id="overview" className="scroll-mt-24">
              <SectionHeader
                icon={<BarChart3 size={20} />}
                title="Overview Metrics"
                subtitle="Ringkasan performa penjualan keseluruhan"
                color="#6366f1"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <KPICard title="Total Revenue" value={metrics.revenue} format="compact_idr"
                  icon={<DollarSign size={20} />} accentColor="#6366f1"
                  trend={12.5} trendLabel="vs bulan lalu"
                  dataDef="Total nilai kotor dari seluruh pembayaran pesanan."
                  formula="SUM(Total Pembayaran)"
                  insight="Penurunan revenue sering terjadi setelah musim kampanye."
                  tips="Cek data diskon untuk membandingkan revenue efektif."
                />
                <KPICard title="Total Orders" value={metrics.orders}
                  icon={<ShoppingBag size={20} />} accentColor="#8b5cf6"
                  dataDef="Jumlah pesanan unik yang masuk."
                  formula="COUNT DISTINCT(No. Pesanan)"
                />
                <KPICard title="Units Sold" value={metrics.units}
                  icon={<ShoppingCart size={20} />} accentColor="#0ea5e9"
                  dataDef="Total item fisik / kaos yang terjual."
                  formula="SUM(Jumlah produk per pesanan)"
                />
                <KPICard title="Avg. Order Value" value={metrics.aov} format="currency"
                  icon={<TrendingUp size={20} />} accentColor="#10b981"
                  dataDef="Rata-rata nilai transaksi per pesanan (AOV)."
                  formula="Total Revenue ÷ Total Orders"
                  tips="Tingkatkan AOV dengan bundling produk."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <KPICard title="Unique Customers" value={metrics.customers}
                  icon={<Users size={20} />} accentColor="#0284c7"
                  dataDef="Jumlah pelanggan individu."
                  formula="COUNT DISTINCT(Username Pembeli)"
                />
                <KPICard title="Repeat Buyer Rate" value={metrics.repeatRate} format="percent"
                  icon={<RefreshCcw size={20} />} accentColor="#f59e0b"
                  dataDef="Persentase pelanggan yang belanja lebih dari 1x."
                  formula="(Pelanggan berulang ÷ Total) × 100"
                  insight="Rate di bawah 5% = One-time buyer dominan."
                  tips="Gunakan voucher retensi untuk pembelian kedua."
                />
                <KPICard title="Return Rate" value={metrics.returnRate} format="percent"
                  icon={<CornerDownLeft size={20} />} accentColor="#f43f5e"
                  dataDef="Persentase item yang diretur/batal."
                  formula="(Item Diretur ÷ Total Pesanan) × 100"
                  insight="Return rate 1.2% sangat sehat (rata-rata fashion: 5-10%)."
                />
              </div>
            </section>

            <div className="section-divider" />

            {/* ═══ REVENUE TRENDS ═══ */}
            <section id="revenue" className="scroll-mt-24">
              <SectionHeader
                icon={<TrendingUp size={20} />}
                title="Revenue & Time Trends"
                subtitle="Analisis tren pendapatan dan pola waktu pembelian"
                color="#0ea5e9"
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <RevenueTrend data={filteredData} />
                <WeeklyTrend data={filteredData} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
                <TimeHeatmap data={filteredData} />
                <DayOfWeek data={filteredData} />
              </div>
            </section>

            <div className="section-divider" />

            {/* ═══ PRODUCTS ═══ */}
            <section id="products" className="scroll-mt-24">
              <SectionHeader
                icon={<Package size={20} />}
                title="Product Performance"
                subtitle="Analisis performa produk dan distribusi ukuran"
                color="#8b5cf6"
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <ProductPerformance data={filteredData} />
                <SizeDistribution data={filteredData} />
              </div>
              <div className="mt-5">
                <ParetoChart data={filteredData} />
              </div>
            </section>

            <div className="section-divider" />

            {/* ═══ GEOGRAPHIC ═══ */}
            <section id="geography" className="scroll-mt-24">
              <SectionHeader
                icon={<MapPin size={20} />}
                title="Geographic Distribution"
                subtitle="Peta sebaran pesanan dan distribusi wilayah"
                color="#10b981"
              />
              <div className="w-full mb-5">
                <IndonesiaMap data={filteredData} />
              </div>
              <div className="w-full">
                <GeoBarChart data={filteredData} />
              </div>
            </section>

            <div className="section-divider" />

            {/* ═══ FINANCIALS ═══ */}
            <section id="financials" className="scroll-mt-24">
              <SectionHeader
                icon={<Wallet size={20} />}
                title="Financial Analytics"
                subtitle="Pembayaran, diskon, margin laba, dan status pesanan"
                color="#f59e0b"
              />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <PaymentMethods data={filteredData} />
                <div className="lg:col-span-2">
                  <ProfitMargin data={filteredData} />
                </div>
              </div>
              <div className="mt-5">
                <DiscountWaterfall data={filteredData} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
                <PaymentSpeed data={filteredData} />
                <OrderStatus data={filteredData} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
                <RefundReason data={filteredData} />
                <BuyerNotes data={filteredData} />
              </div>
            </section>

            <div className="section-divider" />

            {/* ═══ CUSTOMERS ═══ */}
            <section id="customers" className="scroll-mt-24">
              <SectionHeader
                icon={<UserCheck size={20} />}
                title="Customer Intelligence"
                subtitle="Segmentasi pelanggan, RFM analysis, dan cohort retention"
                color="#f43f5e"
              />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                <CustomerSegment data={filteredData} />
                <div className="lg:col-span-2">
                  <RFMAnalysis data={filteredData} />
                </div>
              </div>
              <CohortRetention data={filteredData} />
            </section>

            <div className="section-divider" />

            {/* ═══ SHIPPING ═══ */}
            <section id="shipping" className="scroll-mt-24">
              <SectionHeader
                icon={<Truck size={20} />}
                title="Shipping & Logistics"
                subtitle="Analisis pengiriman, biaya ongkir, dan SLA timeline"
                color="#14b8a6"
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                <ShippingAnalysis data={filteredData} />
                <ShippingCost data={filteredData} />
              </div>
              <ShippingTimeline data={filteredData} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
                <WeightAnalysis data={filteredData} />
                <LeadTime data={filteredData} />
                <ShippingPromo data={filteredData} />
              </div>
            </section>

            <div className="section-divider" />

            {/* ═══ INSIGHTS ═══ */}
            <section id="insights" className="scroll-mt-24">
              <SectionHeader
                icon={<Lightbulb size={20} />}
                title="Smart Insights & Data"
                subtitle="Insight otomatis, funnel analysis, dan data explorer"
                color="#f97316"
              />
              <InsightsPanel data={filteredData} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
                <OrderFunnel data={filteredData} />
              </div>
              <div className="mt-5">
                <DataTable data={filteredData} />
              </div>
            </section>

          </div>
        </main>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button 
          className="scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}

export default App;
