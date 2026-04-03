import os

directory = r'd:\Vibe coding (tugas)\Diagram data simbis\src\components\Charts'

for filename in os.listdir(directory):
    if filename.endswith(".jsx"):
        path = os.path.join(directory, filename)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Revert the broken insertion, e.g., `/ minTickGap={15}>` becomes ` minTickGap={15} />`
        content = content.replace('/ minTickGap={15}>', 'minTickGap={15} />')
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
print("Fixed broken JSX syntax")
