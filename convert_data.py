import pandas as pd
import json
import os

excel_file = r"d:\Vibe coding (tugas)\Diagram data simbis\Data penjualan kaos kami.xlsx"
output_file = r"d:\Vibe coding (tugas)\Diagram data simbis\src\data\salesData.json"

# Pastikan folder src/data ada
os.makedirs(os.path.dirname(output_file), exist_ok=True)

try:
    df = pd.read_excel(excel_file)
    
    # Pre-processing dates to ISO format string
    date_columns = [
        'Waktu Pesanan Dibuat', 
        'Waktu Pembayaran Dilakukan', 
        'Waktu Pengiriman Diatur', 
        'Waktu Pesanan Selesai',
        'Pesanan Harus Dikirimkan Sebelum (Menghindari keterlambatan)'
    ]
    
    for col in date_columns:
        if col in df.columns:
            # fillna with None mapped to null in JSON
            df[col] = pd.to_datetime(df[col], errors='coerce').dt.strftime('%Y-%m-%dT%H:%M:%S')
            df[col] = df[col].where(pd.notnull(df[col]), None)
            
    # Handle NaN values explicitly
    df = df.where(pd.notnull(df), None)
            
    # Convert using to_json to automatically handle NaN/NaT serialization
    json_str = df.to_json(orient='records', force_ascii=False)
    records = json.loads(json_str)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully converted {len(records)} records to {output_file}")
    
except Exception as e:
    print("Error:", e)
