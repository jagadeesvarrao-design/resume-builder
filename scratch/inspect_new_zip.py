import zipfile
import os
import pandas as pd

downloads_dir = "C:\\Users\\DELL\\Downloads"
crawl_zip_path = os.path.join(downloads_dir, "https___www.zenresume.online_-Crawl-stats-2026-08-01.zip")
perf_zip_path = os.path.join(downloads_dir, "https___www.zenresume.online_-Performance-on-Search-2026-08-01.zip")

extract_dir = "C:\\Users\\DELL\\OneDrive\\Desktop\\PROJECTS\\resume-builder\\gsc-data-new"
os.makedirs(extract_dir, exist_ok=True)

def inspect_zip(zip_path, name):
    print(f"=== Inspecting {name} ===")
    if not os.path.exists(zip_path):
        print(f"File not found: {zip_path}")
        return
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        file_list = zip_ref.namelist()
        print(f"Files in zip: {file_list}")
        for file in file_list:
            if file.endswith('.csv'):
                # Extract and read
                zip_ref.extract(file, extract_dir)
                csv_path = os.path.join(extract_dir, file)
                print(f"\n--- Content of {file} ---")
                try:
                    df = pd.read_csv(csv_path)
                    print(df.head(10))
                except Exception as e:
                    print(f"Error reading CSV {file}: {e}")
                    # Try reading as text
                    with open(csv_path, 'r', encoding='utf-16') as f:
                        print(f.read()[:500])

inspect_zip(crawl_zip_path, "Crawl Stats")
inspect_zip(perf_zip_path, "Performance on Search")
