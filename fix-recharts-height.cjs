const fs = require('fs');
const path = require('path');

const chartsDir = path.join(__dirname, 'src', 'components', 'Charts');
const files = fs.readdirSync(chartsDir).filter(f => f.endsWith('.jsx'));

let changedFiles = 0;

files.forEach(f => {
  const filePath = path.join(chartsDir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  const initialContent = content;

  // Replace <ResponsiveContainer width="100%" height="100%"> with minHeight={300}
  // Handles varying spacing
  content = content.replace(/<ResponsiveContainer\s+width="100%"\s+height="100%"\s*>/g, '<ResponsiveContainer width="100%" height="100%" minHeight={300}>');
  
  // Also check single quotes
  content = content.replace(/<ResponsiveContainer\s+width='100%'\s+height='100%'\s*>/g, "<ResponsiveContainer width='100%' height='100%' minHeight={300}>");

  if (content !== initialContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed height collapse in ${f}`);
    changedFiles++;
  }
});

// Also fix some specific ones that might have arbitrary heights that are too small
// OrderFunnel has height={280} which is fine but needs minHeight just in case
// DiscountWaterfall has minHeight={300} already

console.log(`\n🎯 Added minHeight={300} to ${changedFiles} chart files!`);
