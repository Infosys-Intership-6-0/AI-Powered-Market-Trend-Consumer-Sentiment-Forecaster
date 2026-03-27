import sqlite3
import pandas as pd
from transformers import pipeline
from bertopic import BERTopic

# --------------------------------
# 1 Connect to SQLite Database
# --------------------------------

conn = sqlite3.connect("sunscreen_data.db")
cur = conn.cursor()

# --------------------------------
# 2 Load Dataset (small sample)
# --------------------------------

df = pd.read_csv("sunscreen_backend_ready.csv")

print("\nDataset Loaded:")
print(df.head())

# --------------------------------
# 3 Load BERT Sentiment Model
# --------------------------------

print("\nLoading BERT sentiment model...")


sentiment_model = pipeline(
    "sentiment-analysis",
    model="nlptown/bert-base-multilingual-uncased-sentiment"
)


# --------------------------------
# 4 Run Sentiment Analysis
# --------------------------------

print("\nRunning sentiment analysis...")

sentiments = []

for text in df["cleaned_text"]:

    result = sentiment_model(str(text))[0]

    label = result["label"]

    if "4" in label or "5" in label:
        sentiments.append("Positive")

    elif "1" in label or "2" in label:
        sentiments.append("Negative")

    else:
        sentiments.append("Neutral")

df["sentiment_label"] = sentiments

print("\nSample Sentiment Results:\n")
print(df[["cleaned_text", "sentiment_label"]].head())

# --------------------------------
# 5 Topic Modeling (Themes)
# --------------------------------

print("\nRunning Topic Modeling...")

reviews = df["cleaned_text"].tolist()

topic_model = BERTopic()

topics, probs = topic_model.fit_transform(reviews)

topic_info = topic_model.get_topic_info()

print("\nExtracted Consumer Themes:\n")

for topic_id in topic_info["Topic"]:

    if topic_id == -1:
        continue   # skip outlier cluster

    words = topic_model.get_topic(topic_id)

    keywords = [word for word, score in words[:5]]

    print(f"Theme {topic_id}: {', '.join(keywords)}")

# --------------------------------
# 6 Save Results to Database
# --------------------------------

df.to_sql("sunscreen_reviews", conn, if_exists="append", index=False)

conn.commit()

print("\nData inserted into database successfully!")

# --------------------------------
# 7 Sentiment Summary
# --------------------------------

print("\nSentiment Summary:")

cur.execute("""
SELECT sentiment_label, COUNT(*)
FROM sunscreen_reviews
GROUP BY sentiment_label
""")

for row in cur.fetchall():
    print(row)

# --------------------------------
# 8 Close Database
# --------------------------------

conn.close()

print("\nProcess Completed Successfully!")