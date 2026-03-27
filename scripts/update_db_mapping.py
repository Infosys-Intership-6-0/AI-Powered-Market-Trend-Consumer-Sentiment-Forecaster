import sqlite3

DB_PATH = 'backend/data/app.db'
conn = sqlite3.connect(DB_PATH)

MAPPING = {
    "Neutrogena Ultra Sheer Dry-Touch Sunscreen": "neutrogena",
    "La Roche-Posay Anthelios Melt-in Milk Sunscreen": "la_roche_posay",
    "CeraVe Hydrating Mineral Sunscreen": "cerave",
    "Supergoop! Unseen Sunscreen": "supergoop"
}

for long_name, short_name in MAPPING.items():
    # Update ReviewRaw
    conn.execute("UPDATE reviews_raw SET product = ? WHERE product = ?", (short_name, long_name))
    
    # Update TrendData
    conn.execute("UPDATE trend_data SET product = ? WHERE product = ?", (short_name, long_name))
    
    # Update ProductPricing
    conn.execute("UPDATE product_pricing SET product = ? WHERE product = ?", (short_name, long_name))

conn.commit()
conn.close()
print("Successfully mapped product long names to short IDs!")
