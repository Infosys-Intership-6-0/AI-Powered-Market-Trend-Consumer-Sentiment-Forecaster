import sqlite3

conn = sqlite3.connect("sunscreen_data.db")
cur = conn.cursor()

print("\nTotal Reviews Stored:")
cur.execute("SELECT COUNT(*) FROM sunscreen_reviews")
print(cur.fetchone())

print("\nSample Data:")
cur.execute("SELECT product_name, sentiment_label FROM sunscreen_reviews LIMIT 10")
rows = cur.fetchall()

for r in rows:
    print(r)

print("\nSentiment Summary:")
cur.execute("""
SELECT sentiment_label, COUNT(*)
FROM sunscreen_reviews
GROUP BY sentiment_label
""")

for r in cur.fetchall():
    print(r)

conn.close()