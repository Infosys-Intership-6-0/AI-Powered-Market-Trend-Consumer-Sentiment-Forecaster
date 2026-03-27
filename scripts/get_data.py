# ============================================================
#
#  🧴 SUNSCREEN DATA MASTER COLLECTOR
#  
#  1. Reddit (JSON) + YouTube + Google News
#  2. Google Trends (5 years)
#  3. Trend Analysis + Sentiment
#  4. Product Pricing & Details (Amazon + Google Shopping)
#
#  Output: Ready for NLP Pipeline
#
# ============================================================
#
#  INSTALL:
#  pip install requests pandas feedparser google-api-python-client 
#  pip install pytrends textblob beautifulsoup4 matplotlib
#  python -m textblob.download_corpora
#
# ============================================================

import requests
import pandas as pd
import time
import json
import feedparser
import matplotlib.pyplot as plt
from datetime import datetime
from textblob import TextBlob
from bs4 import BeautifulSoup

# ============================================================
#  CONFIGURATION — EDIT THESE
# ============================================================

YOUTUBE_API_KEY = "AIzaSyC94DhcAygusJbradtC4O-JlIF9sCOgWOU"      # ← Required
SERPAPI_KEY     = ""                           # ← Optional (leave "" to skip)

# ============================================================
#  PRODUCT DEFINITIONS
# ============================================================

PRODUCTS = {
    "Neutrogena Ultra Sheer Dry-Touch Sunscreen": {
        "reddit_terms": [
            "Neutrogena Ultra Sheer",
            "Neutrogena Dry-Touch sunscreen",
            "Neutrogena sunscreen review"
        ],
        "youtube_terms": [
            "Neutrogena Ultra Sheer Dry-Touch Sunscreen review",
            "Neutrogena Ultra Sheer sunscreen honest review 2024"
        ],
        "news_terms": [
            "Neutrogena+Ultra+Sheer+Sunscreen",
            "Neutrogena+sunscreen+review"
        ],
        "amazon_search": "Neutrogena+Ultra+Sheer+Dry-Touch+Sunscreen",
        "google_trend_keyword": "Neutrogena Ultra Sheer",
        "beauty_search": "neutrogena ultra sheer"
    },
    "La Roche-Posay Anthelios Melt-in Milk Sunscreen": {
        "reddit_terms": [
            "La Roche-Posay Anthelios",
            "LRP Anthelios Melt-in Milk",
            "La Roche Posay sunscreen review"
        ],
        "youtube_terms": [
            "La Roche-Posay Anthelios Melt-in Milk review",
            "La Roche-Posay Anthelios sunscreen review 2024"
        ],
        "news_terms": [
            "La+Roche-Posay+Anthelios+sunscreen",
            "La+Roche+Posay+sunscreen+review"
        ],
        "amazon_search": "La+Roche-Posay+Anthelios+Melt-in+Milk+Sunscreen",
        "google_trend_keyword": "La Roche-Posay Anthelios",
        "beauty_search": "la roche posay anthelios"
    },
    "CeraVe Hydrating Mineral Sunscreen SPF 50": {
        "reddit_terms": [
            "CeraVe mineral sunscreen",
            "CeraVe sunscreen SPF 50",
            "CeraVe hydrating sunscreen review"
        ],
        "youtube_terms": [
            "CeraVe Hydrating Mineral Sunscreen SPF 50 review",
            "CeraVe mineral sunscreen honest review 2024"
        ],
        "news_terms": [
            "CeraVe+Mineral+Sunscreen",
            "CeraVe+sunscreen+review"
        ],
        "amazon_search": "CeraVe+Hydrating+Mineral+Sunscreen+SPF+50",
        "google_trend_keyword": "CeraVe sunscreen",
        "beauty_search": "cerave sunscreen"
    },
    "Supergoop Unseen Sunscreen SPF 40": {
        "reddit_terms": [
            "Supergoop Unseen Sunscreen",
            "Supergoop Unseen SPF 40",
            "Supergoop unseen review"
        ],
        "youtube_terms": [
            "Supergoop Unseen Sunscreen SPF 40 review",
            "Supergoop Unseen sunscreen honest review 2024"
        ],
        "news_terms": [
            "Supergoop+Unseen+Sunscreen",
            "Supergoop+sunscreen+review"
        ],
        "amazon_search": "Supergoop+Unseen+Sunscreen+SPF+40",
        "google_trend_keyword": "Supergoop Unseen",
        "beauty_search": "supergoop unseen"
    }
}

SUBREDDITS = [
    "SkincareAddiction",
    "AsianBeauty",
    "beauty",
    "30PlusSkinCare",
    "MakeupAddiction"
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/605.1.15 (KHTML, like Gecko) "
                  "Version/17.2.1 Safari/605.1.15",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Cache-Control": "max-age=0"
}


# ============================================================
#  HELPER FUNCTIONS
# ============================================================

def get_sentiment(text):
    """Returns polarity score: -1 (negative) to +1 (positive)"""
    try:
        return round(TextBlob(str(text)).sentiment.polarity, 4)
    except:
        return 0.0

def get_subjectivity(text):
    """Returns subjectivity: 0 (objective) to 1 (subjective)"""
    try:
        return round(TextBlob(str(text)).sentiment.subjectivity, 4)
    except:
        return 0.0

def get_sentiment_label(score):
    if score > 0.1:
        return "positive"
    elif score < -0.1:
        return "negative"
    return "neutral"

def safe_request(url, headers=HEADERS, params=None, timeout=15):
    """Make HTTP request with error handling"""
    try:
        resp = requests.get(url, headers=headers, params=params, timeout=timeout)
        if resp.status_code == 200:
            return resp
        elif resp.status_code == 429:
            print(f"    ⏳ Rate limited. Waiting 60s...")
            time.sleep(60)
            return requests.get(url, headers=headers, params=params, timeout=timeout)
        else:
            print(f"    ⚠️ Status: {resp.status_code}")
            return None
    except Exception as e:
        print(f"    ❌ Request error: {e}")
        return None


# ============================================================
#  PART 1: REDDIT DATA COLLECTION (JSON Method)
# ============================================================

def collect_reddit():
    print("\n" + "=" * 70)
    print("🔴 PART 1A: REDDIT DATA COLLECTION")
    print("=" * 70)
    
    data = []
    seen = set()
    
    for product_name, config in PRODUCTS.items():
        print(f"\n📦 {product_name}")
        print("-" * 50)
        
        for term in config["reddit_terms"]:
            for sub in SUBREDDITS:
                
                # ---- Search Posts ----
                url = (
                    f"https://old.reddit.com/r/{sub}/search.json"
                    f"?q={requests.utils.quote(term)}"
                    f"&restrict_sr=1&limit=25&sort=relevance&t=all"
                )
                
                resp = safe_request(url)
                if resp is None:
                    time.sleep(3)
                    continue
                
                try:
                    posts = resp.json().get("data", {}).get("children", [])
                except:
                    time.sleep(3)
                    continue
                
                post_count = 0
                for post in posts:
                    p = post["data"]
                    permalink = p.get("permalink", "")
                    post_url = f"https://old.reddit.com{permalink}"
                    
                    if post_url in seen:
                        continue
                    seen.add(post_url)
                    
                    text = p.get("selftext", "")
                    title = p.get("title", "")
                    combined_text = f"{title} {text}".strip()
                    
                    data.append({
                        "product": product_name,
                        "source": "reddit",
                        "type": "post",
                        "subreddit": sub,
                        "title": title,
                        "text": text[:3000],
                        "combined_text": combined_text[:3000],
                        "score": p.get("score", 0),
                        "num_comments": p.get("num_comments", 0),
                        "author": str(p.get("author", "")),
                        "date": datetime.fromtimestamp(
                            p.get("created_utc", 0)
                        ).strftime('%Y-%m-%d'),
                        "url": post_url
                    })
                    post_count += 1
                
                if post_count > 0:
                    print(f"  ✅ r/{sub} → '{term}': {post_count} posts")
                
                # ---- Get Comments for Top Posts ----
                for post in posts[:3]:
                    permalink = post["data"]["permalink"]
                    c_url = f"https://www.reddit.com{permalink}.json?limit=50&sort=top"
                    
                    c_resp = safe_request(c_url)
                    if c_resp is None:
                        time.sleep(2)
                        continue
                    
                    try:
                        tree = c_resp.json()
                        if len(tree) < 2:
                            continue
                        
                        comments = tree[1]["data"]["children"]
                        c_count = 0
                        
                        for c in comments:
                            if c["kind"] != "t1":
                                continue
                            
                            body = c["data"].get("body", "")
                            c_perm = c["data"].get("permalink", "")
                            c_link = f"https://reddit.com{c_perm}"
                            
                            if len(body) < 20 or c_link in seen:
                                continue
                            seen.add(c_link)
                            
                            data.append({
                                "product": product_name,
                                "source": "reddit",
                                "type": "comment",
                                "subreddit": sub,
                                "title": post["data"].get("title", ""),
                                "text": body[:3000],
                                "combined_text": body[:3000],
                                "score": c["data"].get("score", 0),
                                "num_comments": 0,
                                "author": str(c["data"].get("author", "")),
                                "date": datetime.fromtimestamp(
                                    c["data"].get("created_utc", 0)
                                ).strftime('%Y-%m-%d'),
                                "url": c_link
                            })
                            c_count += 1
                        
                        if c_count > 0:
                            print(f"    💬 {c_count} comments from: {post['data']['title'][:50]}...")
                    except:
                        pass
                    
                    time.sleep(2)
                
                time.sleep(3)
    
    df = pd.DataFrame(data)
    df.drop_duplicates(subset=["combined_text"], inplace=True)
    df.to_csv("1_reddit_data.csv", index=False)
    
    print(f"\n🔴 REDDIT TOTAL: {len(df)} records")
    if len(df) > 0:
        print(df["product"].value_counts().to_string())
    
    return df


# ============================================================
#  PART 1B: YOUTUBE DATA COLLECTION
# ============================================================

def collect_youtube():
    print("\n" + "=" * 70)
    print("🔵 PART 1B: YOUTUBE DATA COLLECTION")
    print("=" * 70)
    
    data = []
    seen = set()
    
    try:
        from googleapiclient.discovery import build
        youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)
    except Exception as e:
        print(f"❌ YouTube API Error: {e}")
        print("   Replace YOUR_YOUTUBE_API_KEY with your actual key")
        return pd.DataFrame()
    
    for product_name, config in PRODUCTS.items():
        print(f"\n📦 {product_name}")
        print("-" * 50)
        
        for query in config["youtube_terms"]:
            try:
                search = youtube.search().list(
                    q=query,
                    part="snippet",
                    maxResults=15,
                    type="video",
                    order="relevance",
                    relevanceLanguage="en"
                ).execute()
                
                videos = search.get("items", [])
                print(f"  🔍 '{query}' → {len(videos)} videos")
                
                for item in videos:
                    vid = item["id"]["videoId"]
                    title = item["snippet"]["title"]
                    channel = item["snippet"]["channelTitle"]
                    desc = item["snippet"].get("description", "")
                    pub_date = item["snippet"]["publishedAt"][:10]
                    video_url = f"https://youtube.com/watch?v={vid}"
                    
                    # Get stats
                    views, likes, comment_total = 0, 0, 0
                    try:
                        stats = youtube.videos().list(
                            part="statistics", id=vid
                        ).execute()["items"][0]["statistics"]
                        views = int(stats.get("viewCount", 0))
                        likes = int(stats.get("likeCount", 0))
                        comment_total = int(stats.get("commentCount", 0))
                    except:
                        pass
                    
                    # Save video
                    data.append({
                        "product": product_name,
                        "source": "youtube",
                        "type": "video",
                        "title": title,
                        "text": desc[:3000],
                        "combined_text": f"{title} {desc}"[:3000],
                        "channel": channel,
                        "score": likes,
                        "views": views,
                        "total_comments": comment_total,
                        "date": pub_date,
                        "url": video_url,
                        "video_id": vid
                    })
                    
                    print(f"  📹 {title[:55]}... | 👁️ {views:,} | 👍 {likes}")
                    
                    # Get comments
                    try:
                        coms = youtube.commentThreads().list(
                            part="snippet",
                            videoId=vid,
                            maxResults=30,
                            order="relevance",
                            textFormat="plainText"
                        ).execute()
                        
                        c_count = 0
                        for c in coms.get("items", []):
                            cd = c["snippet"]["topLevelComment"]["snippet"]
                            ct = cd["textDisplay"]
                            
                            if ct[:100] in seen or len(ct) < 15:
                                continue
                            seen.add(ct[:100])
                            
                            data.append({
                                "product": product_name,
                                "source": "youtube",
                                "type": "comment",
                                "title": title,
                                "text": ct[:3000],
                                "combined_text": ct[:3000],
                                "channel": cd.get("authorDisplayName", ""),
                                "score": cd.get("likeCount", 0),
                                "views": views,
                                "total_comments": 0,
                                "date": cd["publishedAt"][:10],
                                "url": video_url,
                                "video_id": vid
                            })
                            c_count += 1
                        
                        if c_count > 0:
                            print(f"    💬 {c_count} comments")
                    except Exception as e:
                        err = str(e)
                        if "commentsDisabled" in err:
                            print(f"    🚫 Comments disabled")
                        elif "quotaExceeded" in err:
                            print(f"    ⛔ YouTube quota exceeded! Stopping YouTube collection.")
                            df = pd.DataFrame(data)
                            df.to_csv("2_youtube_data.csv", index=False)
                            return df
                    
                    time.sleep(0.5)
            except Exception as e:
                if "quotaExceeded" in str(e):
                    print(f"  ⛔ YouTube quota exceeded!")
                    break
                print(f"  ❌ Error: {e}")
    
    df = pd.DataFrame(data)
    df.drop_duplicates(subset=["combined_text"], inplace=True)
    df.to_csv("2_youtube_data.csv", index=False)
    
    print(f"\n🔵 YOUTUBE TOTAL: {len(df)} records")
    if len(df) > 0:
        print(df["product"].value_counts().to_string())
    
    return df


# ============================================================
#  PART 1C: NEWS DATA COLLECTION
# ============================================================

def collect_news():
    print("\n" + "=" * 70)
    print("📰 PART 1C: NEWS DATA COLLECTION")
    print("=" * 70)
    
    data = []
    seen = set()
    
    for product_name, config in PRODUCTS.items():
        print(f"\n📦 {product_name}")
        
        all_terms = config["news_terms"] + [
            f"{product_name.split()[0]}+sunscreen+review",
            f"{product_name.split()[0]}+sunscreen+2024"
        ]
        
        for term in all_terms:
            url = f"https://news.google.com/rss/search?q={term}&hl=en-US&gl=US&ceid=US:en"
            
            try:
                feed = feedparser.parse(url)
                count = 0
                
                for entry in feed.entries:
                    title = entry.get("title", "")
                    if title in seen:
                        continue
                    seen.add(title)
                    
                    # Parse date
                    pub = entry.get("published", "")
                    try:
                        parsed_date = datetime.strptime(
                            pub, "%a, %d %b %Y %H:%M:%S %Z"
                        ).strftime('%Y-%m-%d')
                    except:
                        parsed_date = pub[:10] if pub else ""
                    
                    # Extract news source
                    news_source = ""
                    clean_title = title
                    if " - " in title:
                        parts = title.rsplit(" - ", 1)
                        clean_title = parts[0]
                        news_source = parts[1] if len(parts) > 1 else ""
                    
                    summary = entry.get("summary", "")
                    
                    data.append({
                        "product": product_name,
                        "source": "google_news",
                        "type": "article",
                        "title": clean_title,
                        "text": summary[:3000],
                        "combined_text": f"{clean_title} {summary}"[:3000],
                        "news_source": news_source,
                        "date": parsed_date,
                        "url": entry.get("link", "")
                    })
                    count += 1
                
                if count > 0:
                    print(f"  ✅ '{term}': {count} articles")
            except Exception as e:
                print(f"  ❌ Error: {e}")
            
            time.sleep(1)
    
    df = pd.DataFrame(data)
    df.drop_duplicates(subset=["title"], inplace=True)
    df.to_csv("3_news_data.csv", index=False)
    
    print(f"\n📰 NEWS TOTAL: {len(df)} records")
    if len(df) > 0:
        print(df["product"].value_counts().to_string())
    
    return df


# ============================================================
#  PART 2: GOOGLE TRENDS
# ============================================================

def collect_google_trends():
    print("\n" + "=" * 70)
    print("📈 PART 2: GOOGLE TRENDS")
    print("=" * 70)
    
    try:
        from pytrends.request import TrendReq
    except ImportError:
        print("❌ pytrends not installed. Run: pip install pytrends")
        return pd.DataFrame(), pd.DataFrame(), pd.DataFrame()
    
    pytrends = TrendReq(hl='en-US', tz=360)
    
    keywords = [
        config["google_trend_keyword"] 
        for config in PRODUCTS.values()
    ]
    
    # ---- 2A: Interest Over Time (5 years) ----
    print("\n📈 2A: Interest Over Time (5 years)")
    
    try:
        pytrends.build_payload(keywords, timeframe='today 5-y', geo='US')
        df_time = pytrends.interest_over_time()
        
        if not df_time.empty:
            df_time = df_time.drop(columns=["isPartial"], errors="ignore")
            df_time.to_csv("4_google_trends_time.csv")
            print(f"  ✅ Saved: 4_google_trends_time.csv ({len(df_time)} weeks)")
            
            # Quick summary
            print(f"\n  📊 Current Interest (latest week):")
            latest = df_time.iloc[-1]
            for kw in keywords:
                print(f"    {kw}: {latest[kw]}")
        else:
            print("  ⚠️ No trend data returned")
            df_time = pd.DataFrame()
    except Exception as e:
        print(f"  ❌ Error: {e}")
        df_time = pd.DataFrame()
    
    time.sleep(5)
    
    # ---- 2B: Seasonal Patterns ----
    print("\n📈 2B: Seasonal Patterns")
    
    df_seasonal = pd.DataFrame()
    if not df_time.empty:
        temp = df_time.copy()
        temp["month"] = temp.index.month
        df_seasonal = temp.groupby("month")[keywords].mean()
        
        month_names = ['Jan','Feb','Mar','Apr','May','Jun',
                       'Jul','Aug','Sep','Oct','Nov','Dec']
        df_seasonal.index = month_names
        df_seasonal.to_csv("5_google_trends_seasonal.csv")
        
        print(f"  ✅ Saved: 5_google_trends_seasonal.csv")
        print(f"\n  🌞 Peak months:")
        for kw in keywords:
            peak_month = df_seasonal[kw].idxmax()
            print(f"    {kw}: {peak_month} ({df_seasonal[kw].max():.1f})")
    
    time.sleep(5)
    
    # ---- 2C: Year-over-Year Growth ----
    print("\n📈 2C: Year-over-Year Growth")
    
    df_yearly = pd.DataFrame()
    if not df_time.empty:
        temp = df_time.copy()
        temp["year"] = temp.index.year
        df_yearly = temp.groupby("year")[keywords].mean()
        
        growth = df_yearly.pct_change() * 100
        
        df_yearly.to_csv("6_google_trends_yearly.csv")
        growth.to_csv("7_google_trends_growth.csv")
        
        print(f"  ✅ Saved: 6_google_trends_yearly.csv")
        print(f"  ✅ Saved: 7_google_trends_growth.csv")
        
        print(f"\n  📊 Latest Year Growth:")
        latest_growth = growth.iloc[-1]
        for kw in keywords:
            val = latest_growth[kw]
            arrow = "📈" if val > 0 else "📉"
            print(f"    {arrow} {kw}: {val:+.1f}%")
    
    time.sleep(5)
    
    # ---- 2D: Related Queries ----
    print("\n📈 2D: Related Queries (Rising Trends)")
    
    related_data = []
    for kw in keywords:
        try:
            pytrends.build_payload([kw], timeframe='today 12-m', geo='US')
            related = pytrends.related_queries()
            
            top = related[kw].get("top")
            if top is not None:
                for _, row in top.head(10).iterrows():
                    related_data.append({
                        "product_keyword": kw,
                        "type": "top",
                        "query": row["query"],
                        "value": row["value"]
                    })
            
            rising = related[kw].get("rising")
            if rising is not None:
                for _, row in rising.head(10).iterrows():
                    related_data.append({
                        "product_keyword": kw,
                        "type": "rising",
                        "query": row["query"],
                        "value": row["value"]
                    })
            
            print(f"  ✅ {kw}: Related queries found")
        except:
            print(f"  ⚠️ {kw}: No related queries")
        
        time.sleep(3)
    
    df_related = pd.DataFrame(related_data)
    if len(df_related) > 0:
        df_related.to_csv("8_google_trends_related.csv", index=False)
        print(f"  ✅ Saved: 8_google_trends_related.csv ({len(df_related)} queries)")
    
    # ---- 2E: Regional Interest ----
    print("\n📈 2E: Regional Interest (US States)")
    
    try:
        pytrends.build_payload(keywords, timeframe='today 12-m', geo='US')
        df_region = pytrends.interest_by_region(resolution='REGION', inc_low_vol=True)
        df_region = df_region.sort_values(keywords[0], ascending=False)
        df_region.to_csv("9_google_trends_regional.csv")
        
        print(f"  ✅ Saved: 9_google_trends_regional.csv")
        print(f"\n  🗺️ Top 5 States for '{keywords[0]}':")
        print(df_region[keywords[0]].head(5).to_string())
    except Exception as e:
        print(f"  ❌ Regional error: {e}")
    
    return df_time, df_seasonal, df_yearly


# ============================================================
#  PART 3: TREND ANALYSIS FROM COLLECTED DATA
# ============================================================

def analyze_trends(df_reddit, df_youtube, df_news):
    print("\n" + "=" * 70)
    print("📊 PART 3: TREND ANALYSIS")
    print("=" * 70)
    
    # ---- Combine all text data ----
    frames = []
    
    if len(df_reddit) > 0:
        r = df_reddit[["product","source","type","title","text",
                        "combined_text","score","date","url"]].copy()
        frames.append(r)
    
    if len(df_youtube) > 0:
        y = df_youtube[["product","source","type","title","text",
                         "combined_text","score","date","url"]].copy()
        frames.append(y)
    
    if len(df_news) > 0:
        n = df_news[["product","source","type","title","text",
                      "combined_text","date","url"]].copy()
        n["score"] = 0
        frames.append(n)
    
    if not frames:
        print("❌ No data to analyze!")
        return pd.DataFrame()
    
    df_all = pd.concat(frames, ignore_index=True)
    df_all["date"] = pd.to_datetime(df_all["date"], errors="coerce")
    
    # ---- 3A: Sentiment Analysis ----
    print("\n📊 3A: Sentiment Analysis")
    print("  ⏳ Calculating sentiment (this may take a few minutes)...")
    
    df_all["sentiment_score"] = df_all["combined_text"].apply(get_sentiment)
    df_all["subjectivity"] = df_all["combined_text"].apply(get_subjectivity)
    df_all["sentiment_label"] = df_all["sentiment_score"].apply(get_sentiment_label)
    
    print("  ✅ Sentiment calculated!")
    
    # Sentiment summary
    print(f"\n  📊 Sentiment Summary:")
    print("-" * 60)
    for product in PRODUCTS.keys():
        pdata = df_all[df_all["product"] == product]
        if len(pdata) == 0:
            continue
        total = len(pdata)
        pos = len(pdata[pdata["sentiment_label"] == "positive"])
        neg = len(pdata[pdata["sentiment_label"] == "negative"])
        neu = len(pdata[pdata["sentiment_label"] == "neutral"])
        avg = pdata["sentiment_score"].mean()
        
        print(f"\n  📦 {product}")
        print(f"     Avg Sentiment: {avg:.3f}")
        print(f"     ✅ Positive: {pos} ({pos/total*100:.1f}%)")
        print(f"     ❌ Negative: {neg} ({neg/total*100:.1f}%)")
        print(f"     ⚪ Neutral:  {neu} ({neu/total*100:.1f}%)")
    
    # ---- 3B: Monthly Mention Volume ----
    print("\n📊 3B: Monthly Mention Volume")
    
    df_dated = df_all.dropna(subset=["date"])
    df_dated["year_month"] = df_dated["date"].dt.to_period("M").astype(str)
    
    mention_volume = df_dated.groupby(
        ["year_month", "product"]
    ).size().unstack(fill_value=0)
    
    mention_volume.to_csv("10_trend_mention_volume.csv")
    print(f"  ✅ Saved: 10_trend_mention_volume.csv")
    
    # ---- 3C: Sentiment Over Time ----
    print("\n📊 3C: Sentiment Over Time")
    
    sentiment_time = df_dated.groupby(
        ["year_month", "product"]
    )["sentiment_score"].mean().unstack(fill_value=0)
    
    sentiment_time.to_csv("11_trend_sentiment_time.csv")
    print(f"  ✅ Saved: 11_trend_sentiment_time.csv")
    
    # ---- 3D: Engagement Over Time ----
    print("\n📊 3D: Engagement Over Time")
    
    engagement_time = df_dated.groupby(
        ["year_month", "product"]
    )["score"].mean().unstack(fill_value=0)
    
    engagement_time.to_csv("12_trend_engagement_time.csv")
    print(f"  ✅ Saved: 12_trend_engagement_time.csv")
    
    # ---- 3E: Source Breakdown ----
    print("\n📊 3E: Source Breakdown")
    
    source_breakdown = pd.crosstab(df_all["product"], df_all["source"])
    source_breakdown.to_csv("13_source_breakdown.csv")
    print(source_breakdown.to_string())
    
    # ---- Save Master Data ----
    df_all.to_csv("14_all_text_data_with_sentiment.csv", index=False)
    print(f"\n  ✅ Saved: 14_all_text_data_with_sentiment.csv ({len(df_all)} records)")
    
    return df_all


# ============================================================
#  PART 4: PRODUCT PRICING & DETAILS
# ============================================================

def collect_product_details():
    print("\n" + "=" * 70)
    print("💲 PART 4: PRODUCT PRICING & DETAILS")
    print("=" * 70)
    
    all_pricing = []
    all_details = []
    all_reviews = []
    
    # ---- 4A: Amazon Scraping ----
    print("\n💲 4A: Amazon Product Data")
    
    for product_name, config in PRODUCTS.items():
        print(f"\n  🔍 {product_name}")
        
        url = f"https://www.amazon.com/s?k={config['amazon_search']}"
        resp = safe_request(url)
        
        if resp is None:
            time.sleep(5)
            continue
        
        soup = BeautifulSoup(resp.content, "html.parser")
        results = soup.find_all("div", {"data-component-type": "s-search-result"})
        
        for item in results[:5]:
            try:
                # Title
                title_tag = item.find("h2")
                title = title_tag.get_text(strip=True) if title_tag else "N/A"
                
                # Price
                price_whole = item.find("span", {"class": "a-price-whole"})
                price_frac = item.find("span", {"class": "a-price-fraction"})
                if price_whole:
                    price_str = f"{price_whole.get_text(strip=True)}{price_frac.get_text(strip=True) if price_frac else '00'}"
                    price = float(price_str.replace(",", ""))
                    price_display = f"${price:.2f}"
                else:
                    price = None
                    price_display = "N/A"
                
                # Rating
                rating_tag = item.find("span", {"class": "a-icon-alt"})
                rating_text = rating_tag.get_text(strip=True) if rating_tag else "N/A"
                try:
                    rating = float(rating_text.split()[0])
                except:
                    rating = None
                
                # Review count
                review_tag = item.find("span", {"class": "a-size-base s-underline-text"})
                review_text = review_tag.get_text(strip=True) if review_tag else "0"
                try:
                    review_count = int(review_text.replace(",", "").replace(".", ""))
                except:
                    review_count = 0
                
                # ASIN
                asin = item.get("data-asin", "N/A")
                
                # Link
                link_tag = title_tag.find("a") if title_tag else None
                link = f"https://amazon.com{link_tag['href']}" if link_tag else "N/A"
                
                all_pricing.append({
                    "product": product_name,
                    "source": "amazon",
                    "title": title,
                    "price": price,
                    "price_display": price_display,
                    "rating": rating,
                    "rating_display": rating_text,
                    "review_count": review_count,
                    "asin": asin,
                    "url": link
                })
                
                print(f"    📦 {title[:55]}...")
                print(f"       💲 {price_display} | ⭐ {rating_text} | 📝 {review_count} reviews")
                
                # ---- Get Individual Reviews ----
                if asin and asin != "N/A":
                    review_url = (
                        f"https://www.amazon.com/product-reviews/{asin}"
                        f"/ref=cm_cr_dp_d_show_all_btm"
                        f"?ie=UTF8&reviewerType=all_reviews&sortBy=recent"
                    )
                    
                    r_resp = safe_request(review_url)
                    if r_resp:
                        r_soup = BeautifulSoup(r_resp.content, "html.parser")
                        review_divs = r_soup.find_all("div", {"data-hook": "review"})
                        
                        for rev in review_divs[:10]:
                            try:
                                star = rev.find("i", {"data-hook": "review-star-rating"})
                                r_title = rev.find("a", {"data-hook": "review-title"})
                                r_body = rev.find("span", {"data-hook": "review-body"})
                                r_date = rev.find("span", {"data-hook": "review-date"})
                                
                                all_reviews.append({
                                    "product": product_name,
                                    "source": "amazon_review",
                                    "asin": asin,
                                    "star_rating": star.get_text(strip=True) if star else "N/A",
                                    "review_title": r_title.get_text(strip=True) if r_title else "N/A",
                                    "review_text": r_body.get_text(strip=True)[:2000] if r_body else "N/A",
                                    "date": r_date.get_text(strip=True) if r_date else "N/A"
                                })
                            except:
                                continue
                        
                        if review_divs:
                            print(f"       📝 Got {min(len(review_divs), 10)} reviews")
                    
                    time.sleep(3)
                    
            except Exception as e:
                continue
        
        time.sleep(5)
    
    # ---- 4B: Open Beauty Facts (Ingredients & Details) ----
    print("\n\n💲 4B: Product Details (Open Beauty Facts)")
    
    for product_name, config in PRODUCTS.items():
        print(f"\n  🔍 {product_name}")
        
        url = "https://world.openbeautyfacts.org/cgi/search.pl"
        params = {
            "search_terms": config["beauty_search"],
            "json": 1,
            "page_size": 5
        }
        
        try:
            resp = requests.get(url, params=params, timeout=15)
            results = resp.json().get("products", [])
            
            for p in results:
                all_details.append({
                    "product": product_name,
                    "source": "open_beauty_facts",
                    "name": p.get("product_name", "N/A"),
                    "brand": p.get("brands", "N/A"),
                    "categories": p.get("categories", "N/A"),
                    "ingredients": p.get("ingredients_text", "N/A"),
                    "quantity": p.get("quantity", "N/A"),
                    "packaging": p.get("packaging", "N/A"),
                    "labels": p.get("labels", "N/A"),
                    "countries": p.get("countries", "N/A"),
                    "stores": p.get("stores", "N/A"),
                    "image_url": p.get("image_url", "N/A"),
                    "barcode": p.get("code", "N/A")
                })
            
            if results:
                print(f"    ✅ Found {len(results)} products")
                print(f"    🏷️ Brand: {results[0].get('brands', 'N/A')}")
                ing = results[0].get('ingredients_text', 'N/A')
                if ing and ing != 'N/A':
                    print(f"    🧪 Ingredients: {ing[:150]}...")
            else:
                print(f"    ⚠️ No product details found")
        except Exception as e:
            print(f"    ❌ Error: {e}")
        
        time.sleep(1)
    
    # ---- 4C: Google Shopping via SerpAPI (if key provided) ----
    if SERPAPI_KEY:
        print("\n\n💲 4C: Google Shopping (SerpAPI)")
        
        try:
            from serpapi import GoogleSearch
            
            for product_name in PRODUCTS.keys():
                print(f"\n  🔍 {product_name}")
                
                params = {
                    "engine": "google_shopping",
                    "q": product_name,
                    "api_key": SERPAPI_KEY,
                    "hl": "en",
                    "gl": "us",
                    "num": 10
                }
                
                search = GoogleSearch(params)
                results = search.get_dict()
                
                for item in results.get("shopping_results", []):
                    all_pricing.append({
                        "product": product_name,
                        "source": "google_shopping",
                        "title": item.get("title"),
                        "price": item.get("extracted_price"),
                        "price_display": item.get("price"),
                        "rating": item.get("rating"),
                        "rating_display": str(item.get("rating", "")),
                        "review_count": item.get("reviews", 0),
                        "asin": "N/A",
                        "url": item.get("link", "")
                    })
                
                print(f"    ✅ {len(results.get('shopping_results', []))} listings")
                time.sleep(2)
        except ImportError:
            print("  ⚠️ Install serpapi: pip install google-search-results")
    else:
        print("\n\n💲 4C: Google Shopping — SKIPPED (no SERPAPI_KEY)")
    
    # ---- Save All Product Data ----
    df_pricing = pd.DataFrame(all_pricing)
    df_details = pd.DataFrame(all_details)
    df_reviews = pd.DataFrame(all_reviews)
    
    df_pricing.to_csv("15_product_pricing.csv", index=False)
    df_details.to_csv("16_product_details.csv", index=False)
    df_reviews.to_csv("17_amazon_reviews.csv", index=False)
    
    print(f"\n{'='*50}")
    print(f"💲 PRICING: {len(df_pricing)} listings saved")
    print(f"📋 DETAILS: {len(df_details)} products saved")
    print(f"📝 REVIEWS: {len(df_reviews)} Amazon reviews saved")
    
    # ---- Create Price Summary ----
    if len(df_pricing) > 0:
        print(f"\n📊 PRICE SUMMARY:")
        print("-" * 60)
        
        price_summary = []
        for product in PRODUCTS.keys():
            pdata = df_pricing[df_pricing["product"] == product]
            prices = pdata["price"].dropna()
            ratings = pdata["rating"].dropna()
            
            summary = {
                "product": product,
                "avg_price": f"${prices.mean():.2f}" if len(prices) > 0 else "N/A",
                "min_price": f"${prices.min():.2f}" if len(prices) > 0 else "N/A",
                "max_price": f"${prices.max():.2f}" if len(prices) > 0 else "N/A",
                "avg_rating": f"{ratings.mean():.1f}" if len(ratings) > 0 else "N/A",
                "total_listings": len(pdata),
                "total_review_count": pdata["review_count"].sum()
            }
            price_summary.append(summary)
            
            print(f"\n  📦 {product}")
            print(f"     💲 Price: {summary['min_price']} - {summary['max_price']} (avg: {summary['avg_price']})")
            print(f"     ⭐ Rating: {summary['avg_rating']}")
            print(f"     📝 Reviews: {summary['total_review_count']:,}")
        
        df_summary = pd.DataFrame(price_summary)
        df_summary.to_csv("18_product_summary.csv", index=False)
        print(f"\n  ✅ Saved: 18_product_summary.csv")
    
    return df_pricing, df_details, df_reviews


# ============================================================
#  MAIN: RUN EVERYTHING
# ============================================================

if __name__ == "__main__":
    
    total_start = time.time()
    
    print("\n" + "🌟" * 35)
    print("   🧴 SUNSCREEN MASTER DATA COLLECTOR")
    print("   4 Products | 4 Parts | All-in-One")
    print("🌟" * 35)
    print(f"\n   Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # ========== PART 1: DATA COLLECTION ==========
    print("\n\n" + "🔷" * 35)
    print("   PART 1: DATA COLLECTION")
    print("🔷" * 35)
    
    df_reddit  = collect_reddit()
    df_youtube = collect_youtube()
    df_news    = collect_news()
    
    # ========== PART 2: GOOGLE TRENDS ==========
    print("\n\n" + "🔷" * 35)
    print("   PART 2: GOOGLE TRENDS")
    print("🔷" * 35)
    
    df_trends, df_seasonal, df_yearly = collect_google_trends()
    
    # ========== PART 3: TREND ANALYSIS ==========
    print("\n\n" + "🔷" * 35)
    print("   PART 3: TREND ANALYSIS + SENTIMENT")
    print("🔷" * 35)
    
    df_analyzed = analyze_trends(df_reddit, df_youtube, df_news)
    
    # ========== PART 4: PRICING & DETAILS ==========
    print("\n\n" + "🔷" * 35)
    print("   PART 4: PRICING & PRODUCT DETAILS")
    print("🔷" * 35)
    
    df_pricing, df_details, df_reviews = collect_product_details()
    
    
    # ============================================================
    #  FINAL REPORT
    # ============================================================
    
    elapsed = time.time() - total_start
    minutes = int(elapsed // 60)
    seconds = int(elapsed % 60)
    
    print("\n\n" + "=" * 70)
    print("🎉 COLLECTION COMPLETE!")
    print("=" * 70)
    
    print(f"\n📁 ALL OUTPUT FILES:")
    print("-" * 70)
    
    files = {
        "1_reddit_data.csv": len(df_reddit),
        "2_youtube_data.csv": len(df_youtube),
        "3_news_data.csv": len(df_news),
        "4_google_trends_time.csv": "5-year weekly data",
        "5_google_trends_seasonal.csv": "Monthly patterns",
        "6_google_trends_yearly.csv": "Yearly averages",
        "7_google_trends_growth.csv": "YoY growth %",
        "8_google_trends_related.csv": "Related queries",
        "9_google_trends_regional.csv": "US state data",
        "10_trend_mention_volume.csv": "Monthly mentions",
        "11_trend_sentiment_time.csv": "Sentiment over time",
        "12_trend_engagement_time.csv": "Engagement over time",
        "13_source_breakdown.csv": "Source × Product",
        "14_all_text_data_with_sentiment.csv": len(df_analyzed) if len(df_analyzed) > 0 else 0,
        "15_product_pricing.csv": len(df_pricing),
        "16_product_details.csv": len(df_details),
        "17_amazon_reviews.csv": len(df_reviews),
        "18_product_summary.csv": "Price & Rating summary"
    }
    
    for fname, info in files.items():
        if isinstance(info, int):
            print(f"  📄 {fname:<45} → {info:,} records")
        else:
            print(f"  📄 {fname:<45} → {info}")
    
    total_records = len(df_reddit) + len(df_youtube) + len(df_news) + len(df_pricing) + len(df_reviews)
    
    print(f"\n{'='*70}")
    print(f"  📊 TOTAL DATA RECORDS: {total_records:,}")
    print(f"  📁 TOTAL FILES: {len(files)}")
    print(f"  ⏱️  TIME TAKEN: {minutes}m {seconds}s")
    print(f"  🕐 FINISHED: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*70}")
    
    print("\n\n🚀 READY FOR NLP PIPELINE!")
    print("-" * 70)
    print("  Key files for your NLP pipeline:")
    print("  📝 14_all_text_data_with_sentiment.csv  ← All text + sentiment")
    print("  💲 15_product_pricing.csv                ← Prices & ratings")
    print("  🧪 16_product_details.csv                ← Ingredients & info")
    print("  📝 17_amazon_reviews.csv                 ← Amazon reviews")
    print("  📈 4_google_trends_time.csv              ← Search trends")
    print("=" * 70)
    print("✅ DONE!")