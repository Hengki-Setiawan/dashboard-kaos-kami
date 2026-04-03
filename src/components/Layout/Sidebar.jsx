import { useState } from 'react';
import { 
  LayoutDashboard, TrendingUp, Users, MapPin, Truck, 
  DollarSign, Package, Lightbulb, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeSection, collapsed, setCollapsed }) {
  const links = [
    { id: 'overview',   label: 'Overview',       icon: <LayoutDashboard size={20} />, color: '#6366f1' },
    { id: 'revenue',    label: 'Revenue Trends',  icon: <TrendingUp size={20} />,      color: '#0ea5e9' },
    { id: 'products',   label: 'Product Stats',   icon: <Package size={20} />,         color: '#8b5cf6' },
    { id: 'geography',  label: 'Geographic',      icon: <MapPin size={20} />,          color: '#10b981' },
    { id: 'financials', label: 'Financials',      icon: <DollarSign size={20} />,      color: '#f59e0b' },
    { id: 'customers',  label: 'Customers',       icon: <Users size={20} />,           color: '#f43f5e' },
    { id: 'shipping',   label: 'Shipping',        icon: <Truck size={20} />,           color: '#14b8a6' },
    { id: 'insights',   label: 'Insights & Data', icon: <Lightbulb size={20} />,       color: '#f97316' },
  ];

  return (
    <aside 
      className="fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-card border-r border-border overflow-y-auto overflow-x-hidden transition-all duration-300"
      style={{ width: collapsed ? '72px' : '260px' }}
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <img 
          src="/logo.png" 
          alt="Kaos Kami" 
          className="flex-shrink-0 w-10 h-10 object-contain rounded-xl"
        />
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold tracking-tight whitespace-nowrap" style={{ fontFamily: 'var(--font-heading)' }}>
              Kaos Kami
            </h1>
            <p className="text-[10px] text-muted-foreground whitespace-nowrap">
              Analytics Dashboard
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <div className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-3 text-muted-foreground">
            Menu
          </div>
        )}
        
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline ${
              activeSection === link.id 
                ? 'bg-primary/10 text-primary font-semibold' 
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
            style={collapsed ? { justifyContent: 'center', padding: '12px' } : {}}
            title={collapsed ? link.label : ''}
          >
            <span style={{ color: activeSection === link.id ? link.color : undefined }}>
              {link.icon}
            </span>
            {!collapsed && <span>{link.label}</span>}
          </a>
        ))}
      </nav>

      {/* Status Badge */}
      {!collapsed && (
        <div className="mx-3 mb-3 p-4 rounded-xl bg-secondary border border-border">
          <h4 className="font-semibold text-xs mb-1 text-foreground">Status Data</h4>
          <p className="text-[11px] flex items-center gap-2 text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-glow"></span>
            Live · Jun 2024
          </p>
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-3 mb-4 p-2 rounded-lg flex items-center justify-center transition-colors hover:bg-accent text-muted-foreground"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
}
