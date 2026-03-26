# AI-Powered Market Trend & Consumer Sentiment Forecaster

## 📌 Project Overview

This project builds an AI-powered system to analyze consumer reviews and extract meaningful insights using NLP, topic modeling, and a fast Retrieval-Augmented Generation (RAG) pipeline.

It focuses on sunscreen product reviews to:

* Analyze customer sentiment
* Identify emerging consumer themes
* Answer user queries using a semantic RAG pipeline grounded in real review data and expert skincare knowledge

---

## 🚀 Features

### 🔹 Sentiment Analysis (BERT)

* Implemented using Hugging Face Transformers
* Classifies reviews into:

  * Positive
  * Negative
  * Neutral
* Generates both:

  * Sentiment label
  * Sentiment score (-1, 0, 1)

---

### 🔹 Topic Modeling (BERTopic)

* Extracts key consumer themes such as:

  * Texture
  * Skin compatibility
  * Price / value
* Helps identify emerging trends in consumer feedback

---

### 🔹 RAG (Retrieval-Augmented Generation)

* Uses **FAISS vector database** for fast semantic search
* Retrieves relevant context from:

  * Sunscreen product reviews (SQLite database)
  * `skincare_knowledge.txt` (expert knowledge base)
* Uses **Sentence Transformers (`all-MiniLM-L6-v2`)** for embeddings
* Uses **Mistral 7B (via Ollama)** for fast local LLM inference

---

### 🔹 Vector Database (FAISS)

* Enables semantic similarity search instead of keyword matching
* Stores embeddings of:

  * Review data
  * Knowledge base
* Persisted as:

  * `faiss_index.bin`
  * `faiss_chunks.json`

---

### 🔹 Database Integration

* SQLite database for structured storage of:

  * Reviews
  * Sentiment scores
  * Metadata

---

## 🧠 System Architecture

```
Data (CSV)
    ↓
Data Cleaning
    ↓
BERT Sentiment + BERTopic Topic Modeling
    ↓
SQLite Database
    ↓
Embedding (SentenceTransformer - MiniLM)
    ↓
FAISS Vector Index
    ↓
RAG Pipeline
    ↓
Mistral (Ollama) → Context-Aware Answer
```

---

## 📂 Project Structure

```
Infosys_AIMarketTrendAnalysis/
├── setup_database.py
├── sentiment_topic_pipeline.py
├── build_faiss_index.py
├── ask_llm.py
├── check_results.py
├── skincare_knowledge.txt
├── sunscreen_backend_ready.csv
├── sunscreen_data.db
├── faiss_index.bin
├── faiss_chunks.json
├── requirements.txt
└── .gitignore
```

---

## ⚙️ Installation

```bash
pip install -r requirements.txt
```

### Requirements

```
transformers
sentence-transformers
faiss-cpu
bertopic
pandas
torch
requests
```

---

## ▶️ How to Run

### Step 1: Setup Database

```bash
python setup_database.py
```

### Step 2: Run NLP Pipeline (Optional)

```bash
python sentiment_topic_pipeline.py
```

### Step 3: Build FAISS Index

```bash
python build_faiss_index.py
```

### Step 4: Start LLM (Ollama)

```bash
ollama run mistral
```

### Step 5: Run RAG Chatbot

```bash
python ask_llm.py
```

---

## 💬 Example Queries

* Which sunscreen is best for oily skin?
* Does this sunscreen leave a white cast?
* What is SPF and how does it work?
* Is mineral sunscreen better than chemical?
* Best sunscreen for acne-prone sensitive skin

---

## 🧠 Key Technologies Used

* Natural Language Processing (NLP)
* BERT for Sentiment Analysis
* BERTopic for Topic Modeling
* FAISS for Vector Search
* Sentence Transformers (MiniLM)
* Retrieval-Augmented Generation (RAG)
* Mistral 7B (via Ollama) for LLM inference
* SQLite Database

---

## ⚡ Improvements Over Previous Version

* Replaced **Phi-3** with **Mistral (Ollama)** for significantly faster inference
* Reduced latency using optimized retrieval (TOP_K tuning)
* Separated retrieval and generation layers cleanly
* Improved scalability and local performance

---

## ⚠️ Limitations

* Runs on CPU (performance depends on system specs)
* FAISS is local (not distributed like Pinecone)
* Knowledge base is static (not dynamically updated)

---

## 🔮 Future Improvements

* Integrate LangChain for modular RAG pipelines
* Replace FAISS with Pinecone / Weaviate for scalability
* Add dashboard (Plotly / React) for visualization
* Real-time data ingestion from APIs
* Add source attribution in responses

---

## 👨‍💻 Author

Developed as part of the AI Market Trend Analysis Project — Infosys Springboard.

---

## 📌 Conclusion

This project demonstrates how combining BERT-based sentiment analysis, topic modeling, and a fast RAG pipeline can generate accurate, context-aware consumer insights. By integrating FAISS with both expert knowledge and real-world reviews, the system provides meaningful and actionable intelligence for product and marketing decisions.
