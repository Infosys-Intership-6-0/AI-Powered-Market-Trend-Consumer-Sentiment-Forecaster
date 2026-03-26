# AI-Powered Market Trend & Consumer Sentiment Forecaster

## 📌 Project Overview

This project builds an AI-powered system to analyze consumer reviews and extract meaningful insights using NLP, LLMs, and a Retrieval-Augmented Generation (RAG) pipeline.

It focuses on sunscreen product reviews to:

* Analyze customer sentiment
* Identify emerging consumer themes
* Answer user queries using a semantic RAG pipeline grounded in real review data and expert skincare knowledge

---

## 🚀 Features

### 🔹 Sentiment Analysis

* Implemented using:
  * BERT (`nlptown/bert-base-multilingual-uncased-sentiment`)
  * LLM (Phi-3)
* Classifies reviews into:
  * Positive
  * Negative
  * Neutral

---

### 🔹 Topic Modeling

* Implemented using BERTopic
* Extracts key consumer themes such as:
  * Texture
  * Skin compatibility
  * Price / value

---

### 🔹 RAG (Retrieval-Augmented Generation)

* Uses **FAISS vector database** for fast semantic similarity search
* Retrieves relevant content from two sources:
  * Sunscreen product reviews (from SQLite)
  * `skincare_knowledge.txt` — a curated expert knowledge base covering SPF science, ingredients, skin types, brand profiles, and skincare myths
* Uses **sentence-transformers** (`all-MiniLM-L6-v2`) to embed queries and chunks
* LLM (Phi-3) generates context-aware answers grounded in retrieved data
* Model acts as a **skincare expert**, combining real review signals with general dermatological knowledge

---

### 🔹 Vector Database (FAISS)

* Replaces keyword-based SQL `LIKE` retrieval with **cosine similarity search**
* Embeds all review chunks + knowledge document at build time
* Enables semantic retrieval — finds relevant results even when exact keywords don't match
* Persisted as `faiss_index.bin` + `faiss_chunks.json` for fast reuse

---

### 🔹 Database Integration

* SQLite database for storing reviews, sentiment labels, and metadata
* Enables structured querying and analytics alongside the vector layer

---

## 🧠 System Architecture

```
Data (CSV)
    ↓
Data Cleaning → Preprocessed text
    ↓
NLP Pipeline → Sentiment Analysis + Topic Modeling
    ↓
Storage → SQLite Database
    ↓
Embedding → SentenceTransformer (all-MiniLM-L6-v2)
    ↓
Vector Index → FAISS (reviews + skincare knowledge)
    ↓
RAG → Semantic Retrieve → Phi-3 Generate → Expert Answer
```

---

## 📂 Project Structure

```
Infosys_AIMarketTrendAnalysis/
├── setup_database.py           # Creates SQLite schema
├── sentiment_topic_pipeline.py # BERT sentiment + BERTopic modeling
├── build_faiss_index.py        # Builds FAISS index from DB + knowledge doc
├── ask_llm.py                  # Semantic RAG chatbot (FAISS + Phi-3)
├── check_results.py            # Inspect DB contents and sentiment summary
├── skincare_knowledge.txt      # Expert skincare knowledge base for RAG
├── sunscreen_backend_ready.csv # Source review dataset
├── sunscreen_data.db           # SQLite database
├── faiss_index.bin             # FAISS vector index (generated)
├── faiss_chunks.json           # Chunk text mapping (generated)
├── requirements.txt
└── .gitignore
```

---

## ⚙️ Installation

```bash
pip install -r requirements.txt
```

**requirements.txt** should include:

```
transformers
sentence-transformers
faiss-cpu
bertopic
pandas
torch
```

---

## ▶️ How to Run

**Step 1: Setup Database**
```bash
python setup_database.py
```

**Step 2: Run NLP Pipeline** *(Optional — adds sentiment labels to DB)*
```bash
python sentiment_topic_pipeline.py
```

**Step 3: Build FAISS Index** *(Run once — or after DB updates)*
```bash
python build_faiss_index.py
```

**Step 4: Run RAG Chatbot**
```bash
python ask_llm.py
```

---

## 💬 Example Queries

* `Which sunscreen is best for oily skin?`
* `Does this sunscreen leave a white cast?`
* `What is SPF and how does it work?`
* `Is mineral sunscreen better than chemical?`
* `Best sunscreen for acne-prone sensitive skin`

---

## 🧠 Key Concepts Used

* Natural Language Processing (NLP)
* Sentiment Analysis (BERT + LLM)
* Topic Modeling (BERTopic)
* Large Language Models — Phi-3 Mini 4k Instruct
* Retrieval-Augmented Generation (RAG)
* Semantic Search with Sentence Transformers
* Vector Databases (FAISS)
* SQLite for structured storage

---

## ⚠️ Known Limitations

* Runs on CPU — inference is slower than GPU deployment
* Phi-3 Mini has a 4k context window; very long review sets may need chunking
* `skincare_knowledge.txt` is manually curated — not dynamically updated

---

## 🔮 Future Improvements

* GPU acceleration for faster Phi-3 inference
* Real-time data ingestion via e-commerce / social media APIs
* Swap FAISS for a cloud vector DB (Pinecone, Weaviate, Qdrant) for scalability
* Dashboard visualization of sentiment trends and topic clusters
* Expand knowledge base with ingredient safety databases (e.g., EWG, INCIDecoder)
* Fine-tune LLM on skincare-domain data for improved answer quality

---

## 👨‍💻 Author

Developed as part of the AI Market Trend Analysis Project — Infosys Springboard.

---

## 📌 Conclusion

This project demonstrates how LLMs combined with semantic vector retrieval and domain-specific knowledge can generate accurate, expert-level consumer insights. By integrating FAISS and a curated skincare knowledge base, the system moves beyond keyword matching to understand the intent behind user queries — making it suitable for real-world product analysis and recommendation workflows.