// Harmonious color palette matching the new design system
export const COLORS = {
  primary: '#6366f1',    // Indigo
  cyan: '#22d3ee',       // Cyan
  purple: '#a78bfa',     // Violet
  green: '#34d399',      // Emerald
  amber: '#fbbf24',      // Amber
  rose: '#fb7185',       // Rose
  pink: '#f472b6',       // Pink
  orange: '#fb923c',     // Orange
  teal: '#2dd4bf',       // Teal
  indigo: '#818cf8',     // Lighter indigo
  sky: '#38bdf8',        // Sky
};

export const COLOR_PALETTE = [
  COLORS.primary,
  COLORS.cyan,
  COLORS.purple,
  COLORS.green,
  COLORS.amber,
  COLORS.rose,
  COLORS.pink,
  COLORS.orange,
  COLORS.teal,
  COLORS.sky,
];

// Format currency to IDR
export const formatIDR = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Format large numbers (1.2K, 3.4M)
export const formatCompact = (value) => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(value);
};

// Format IDR nicely with 'Jt'
export const formatCompactIDR = (value) => {
  if (value >= 1000000) {
    return 'Rp ' + (value / 1000000).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 1 }) + ' Jt';
  } else if (value >= 1000) {
    return 'Rp ' + (value / 1000).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 1 }) + ' Rb';
  }
  return formatIDR(value);
};

export const PROVINCE_MAP = {};
