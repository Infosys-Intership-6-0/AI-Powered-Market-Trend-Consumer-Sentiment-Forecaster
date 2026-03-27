import sqlite3
import pandas as pd
import os
import shutil

print("Clearing database tables...")
DB_PATH = 'backend/data/app.db'
if os.path.exists(DB_PATH):
    conn = sqlite3.connect(DB_PATH)
    try:
        conn.execute('DELETE FROM reviews_raw')
        conn.execute('DELETE FROM trend_data')
        conn.execute('DELETE FROM product_pricing')
        conn.execute('DELETE FROM reviews_processed')
        # Removing metadata ensures it fully calculates fresh!
        conn.execute('DELETE FROM dataset_versions')
        conn.execute('DELETE FROM preprocessing_audits')
        conn.commit()
        print("Database tables wiped empty successfully.")
    except Exception as e:
        print(f"Error wiping DB tables: {e}")
    finally:
        conn.close()

# Wiping the data cache to force a new pull
for d in ['backend/data/processed', 'backend/data/raw']:
    if os.path.exists(d):
        try:
            shutil.rmtree(d)
            print(f"Wiped file cache: {d}")
        except Exception as e:
            print(f"Could restrict file cache: {d}")

print("Proceeding to populate from the newly generated active data...")
import migrate_csvs_to_db

# Tell the API to instantly refresh
import urllib.request
try:
    urllib.request.urlopen("http://127.0.0.1:8002/data/status")
    print("Backend has been alerted to refresh the data stream.")
except Exception as e:
    print(f"Failed to refresh backend: {e}")
