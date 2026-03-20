import sqlite3
import pandas as pd
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline



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

print("Table created successfully!")

print("\nDatabase Schema:")
cur.execute("PRAGMA table_info(sunscreen_reviews);")
for column in cur.fetchall():
    print(column)


df = pd.read_csv("sunscreen_backend_ready.csv")

print("\nDataset Loaded:")
print(df.head())



print("\nLoading Phi-3 model...")

model_id = "microsoft/Phi-3-mini-4k-instruct"

tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id)

sentiment_pipe = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer
)

print("Phi-3 model loaded successfully!")


def analyze_sentiment(text):

    prompt = f"""
    Classify the sentiment of this sunscreen product review as
    Positive, Negative, or Neutral.

    Review: {text}

    Sentiment:
    """

    result = sentiment_pipe(prompt, max_new_tokens=10)

    output = result[0]["generated_text"]

    if "Positive" in output:
        return 1, "Positive"
    elif "Negative" in output:
        return -1, "Negative"
    else:
        return 0, "Neutral"



print("\nRunning sentiment analysis with Phi-3...")

results = df["cleaned_text"].apply(analyze_sentiment)

df["sentiment_score"] = results.apply(lambda x: x[0])
df["sentiment_label"] = results.apply(lambda x: x[1])

print("\nSample Sentiment Results:")
print(df[["cleaned_text", "sentiment_label"]].head())

df.to_sql("sunscreen_reviews", conn, if_exists="append", index=False)

conn.commit()

print("\nData inserted successfully!")



print("\nSample Data (First 5 Rows):")

cur.execute("SELECT * FROM sunscreen_reviews LIMIT 5;")

for row in cur.fetchall():
    print(row)



print("\nSentiment Summary:")

cur.execute("""
SELECT sentiment_label, COUNT(*)
FROM sunscreen_reviews
GROUP BY sentiment_label
""")

for row in cur.fetchall():
    print(row)


print("\nAverage Sentiment Per Product:")

cur.execute("""
SELECT product_name, ROUND(AVG(sentiment_score), 3)
FROM sunscreen_reviews
GROUP BY product_name
""")

avg_results = cur.fetchall()

for row in avg_results:
    print(row)



print("\nFinal Product Sentiment Verdict:")

for product, avg_score in avg_results:

    if avg_score > 0.25:
        verdict = "GOOD"
    elif avg_score < -0.25:
        verdict = "BAD"
    else:
        verdict = "NEUTRAL"

    print(f"{product} → Avg Score: {avg_score} → {verdict}")



conn.close()

print("\nProcess Completed Successfully!")