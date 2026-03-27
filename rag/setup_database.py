import sqlite3
import pandas as pd
from transformers import pipeline

conn = sqlite3.connect("sunscreen_data.db")
cur = conn.cursor()

cur.execute("DROP TABLE IF EXISTS sunscreen_reviews")

cur.execute("""
CREATE TABLE sunscreen_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT,
    product_name TEXT,
    source TEXT,
    cleaned_text TEXT,
    timestamp TEXT,
    star_rating INTEGER,
    skin_type TEXT,
    region TEXT,
    sentiment_score REAL,
    sentiment_label TEXT
)
""")

print("Database ready")

df = pd.read_csv("sunscreen_backend_ready.csv")

print("Loading fast sentiment model...")
sentiment_model = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased"
)

print("Running sentiment analysis...")

texts = df["cleaned_text"].astype(str).tolist()

results = sentiment_model(texts, batch_size=32, truncation=True)

sentiment_scores = []
sentiment_labels = []

for r in results:
    label = r["label"]

    if "POSITIVE" in label:
        sentiment_scores.append(1)
        sentiment_labels.append("Positive")
    elif "NEGATIVE" in label:
        sentiment_scores.append(-1)
        sentiment_labels.append("Negative")
    else:
        sentiment_scores.append(0)
        sentiment_labels.append("Neutral")

df["sentiment_score"] = sentiment_scores
df["sentiment_label"] = sentiment_labels

df.to_sql("sunscreen_reviews", conn, if_exists="append", index=False)
conn.commit()

print("Data inserted successfully")

conn.close()