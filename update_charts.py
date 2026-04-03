import os
import re

directory = r'd:\Vibe coding (tugas)\Diagram data simbis\src\components\Charts'

for filename in os.listdir(directory):
    if filename.endswith(".jsx"):
        path = os.path.join(directory, filename)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Update tick fonts
        content = content.replace(
            "tick={{ fill: 'hsl(var(--muted-foreground))' }}",
            "tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}"
        )
        
        # Add minTickGap to XAxis
        # Most start with `<XAxis \n` or `<XAxis\n`
        content = re.sub(
            r'<XAxis\b(.*?)(?=>)',
            lambda m: m.group(0) if 'minTickGap' in m.group(0) else getattr(m, 'group')(0) + ' minTickGap={15}',
            content,
            flags=re.DOTALL
        )
        
        # Update typical margins
        content = re.sub(
            r'margin=\{\{\s*top:\s*20,\s*right:\s*20,\s*bottom:\s*20,\s*left:\s*20\s*\}\}',
            r'margin={{ top: 15, right: 10, bottom: 15, left: -15 }}',
            content
        )
        content = re.sub(
            r'margin=\{\{\s*top:\s*10,\s*right:\s*30,\s*left:\s*0,\s*bottom:\s*0\s*\}\}',
            r'margin={{ top: 10, right: 10, left: -20, bottom: 0 }}',
            content
        )
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
print("Updated all charts formatting for mobile.")
