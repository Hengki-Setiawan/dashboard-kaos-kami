import pandas as pd
import json

file_path = "d:\\Vibe coding (tugas)\\Diagram data simbis\\Data penjualan kaos kami.xlsx"
try:
    df = pd.read_excel(file_path)
    with open("data_summary.txt", "w") as f:
        f.write("================ COLUMNS ================\n")
        f.write(str(df.columns.tolist()) + "\n")
        f.write("\n================ SHAPE ================\n")
        f.write(str(df.shape) + "\n")
        f.write("\n================ DATATYPES ================\n")
        f.write(str(df.dtypes) + "\n")
        f.write("\n================ HEAD ================\n")
        f.write(str(df.head()) + "\n")
        f.write("\n================ NULL COUNTS ================\n")
        f.write(str(df.isnull().sum()) + "\n")
        f.write("\n================ UNIQUE VALUES ================\n")
        for col in df.columns:
            if df[col].dtype == 'object':
                f.write(f"{col}: {df[col].nunique()} unique values\n")
            f.write(f"Sample unique for {col}: {str(df[col].dropna().unique()[:5])}\n")
except Exception as e:
    print("Error:", e)
