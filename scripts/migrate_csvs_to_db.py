import pandas as pd
from get_data import save_reviews_to_db, save_trends_to_db, save_pricing_to_db, PRODUCTS
import os

print("Starting to copy CSV data into your new PostgreSQL database...")

if os.path.exists("1_reddit_data.csv"):
    print("Migrating Reddit...")
    df_reddit = pd.read_csv("1_reddit_data.csv")
    save_reviews_to_db(df_reddit)

if os.path.exists("2_youtube_data.csv"):
    print("Migrating YouTube...")
    df_youtube = pd.read_csv("2_youtube_data.csv")
    save_reviews_to_db(df_youtube)

if os.path.exists("3_news_data.csv"):
    print("Migrating News...")
    df_news = pd.read_csv("3_news_data.csv")
    save_reviews_to_db(df_news)

if os.path.exists("15_product_pricing.csv"):
    print("Migrating Pricing...")
    df_pricing = pd.read_csv("15_product_pricing.csv")
    save_pricing_to_db(df_pricing)

if os.path.exists("4_google_trends_time.csv"):
    print("Migrating Trends...")
    try:
        df_trends = pd.read_csv("4_google_trends_time.csv", parse_dates=True)
        if "date" in df_trends.columns:
            df_trends.set_index("date", inplace=True)
        elif "Unnamed: 0" in df_trends.columns:
            # Sometime index is unnamed in pandas to_csv
            df_trends["date"] = pd.to_datetime(df_trends["Unnamed: 0"])
            df_trends.set_index("date", inplace=True)
            
        kw_map = {k: v["google_trend_keyword"] for k, v in PRODUCTS.items()}
        save_trends_to_db(df_trends, kw_map)
    except Exception as e:
        print(f"Skipping trends due to format issue: {e}")

print("\nSuccess! Your database is fully populated with your original data!")
