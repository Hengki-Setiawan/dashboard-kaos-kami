// Extract unique values for filters
export function getUniqueValues(data, key) {
  if (!data || !Array.isArray(data)) return [];
  const validValues = data.map(item => item[key]).filter(v => v !== null && v !== undefined && v !== '');
  return [...new Set(validValues)].sort();
}

// Group by and aggregate 
export function aggregateBy(data, groupKey, aggKeys, aggType = 'sum') {
  const result = {};
  
  data.forEach(item => {
    const key = item[groupKey];
    if (!key) return;
    
    if (!result[key]) {
      result[key] = { [groupKey]: key, _count: 0 };
      aggKeys.forEach(k => result[key][k] = 0);
    }
    
    result[key]._count += 1;
    
    aggKeys.forEach(k => {
      const val = parseFloat(item[k]) || 0;
      if (aggType === 'sum') {
        result[key][k] += val;
      } else if (aggType === 'count') {
        result[key][k] += 1;
      }
    });
  });
  
  const arrayResult = Object.values(result);
  
  // Calculate averages if needed
  if (aggType === 'avg') {
    arrayResult.forEach(item => {
      aggKeys.forEach(k => {
        item[k] = item[k] / item._count;
      });
    });
  }
  
  return arrayResult;
}

// Calculate RFM Score
export function calculateRFM(data) {
  const customerMap = {};
  const currentDate = new Date('2024-06-30').getTime(); // Reference date just after data ends
  
  data.forEach(item => {
    const cust = item['Username (Pembeli)'];
    const dateStr = item['Waktu Pesanan Dibuat'];
    const amount = parseFloat(item['Total Pembayaran']) || 0;
    
    if (!cust || !dateStr) return;
    const date = new Date(dateStr).getTime();
    
    if (!customerMap[cust]) {
      customerMap[cust] = {
        name: cust,
        lastPurchase: date,
        frequency: 0,
        monetary: 0
      };
    }
    
    // Update last purchase if newer
    if (date > customerMap[cust].lastPurchase) {
      customerMap[cust].lastPurchase = date;
    }
    
    customerMap[cust].frequency += 1;
    customerMap[cust].monetary += amount;
  });
  
  return Object.values(customerMap).map(c => {
    // Recency in days
    c.recency = (currentDate - c.lastPurchase) / (1000 * 3600 * 24);
    
    // Very simple segmentation logic
    if (c.frequency >= 2 && c.recency <= 30) c.segment = 'Champions';
    else if (c.frequency >= 2) c.segment = 'Loyal';
    else if (c.recency <= 30) c.segment = 'New Customers';
    else if (c.recency <= 90) c.segment = 'At Risk';
    else c.segment = 'Hibernating';
    
    return c;
  });
}
