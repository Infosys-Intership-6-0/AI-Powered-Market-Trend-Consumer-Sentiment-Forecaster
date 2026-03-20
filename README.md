# AI-Powered Market Trend & Consumer Sentiment Forecaster

## 📌 Project Overview

This project builds an AI-powered system to analyze consumer reviews and extract meaningful insights using NLP, LLMs, and a Retrieval-Augmented Generation (RAG) pipeline.

It focuses on sunscreen product reviews to:

* Analyze customer sentiment
* Identify emerging themes
* Answer user queries using real review data

---

## 🚀 Features

### 🔹 Sentiment Analysis

* Implemented using:

  * BERT (nlptown/bert-base-multilingual-uncased-sentiment)
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
  * Price/value

---

### 🔹 RAG (Retrieval-Augmented Generation)

* Retrieves relevant reviews from SQLite database
* Uses LLM (Phi-3) to generate context-aware answers
* Ensures responses are grounded in real customer data

---

### 🔹 Database Integration

* SQLite database used for storing:

  * Reviews
  * Sentiment labels
  * Metadata
* Enables fast querying and analytics

---

## 🧠 System Architecture

1. Data → CSV file
2. Data Cleaning → Preprocessed text
3. NLP Pipeline → Sentiment + Topic Modeling
4. Storage → SQLite Database
5. RAG → Retrieve + Generate responses

---

## 📂 Project Structure

Infosys_AIMarketTrendAnalysis/

├── setup_database.py
├── sentiment_topic_pipeline.py
├── ask_llm.py
├── check_results.py
├── sunscreen_backend_ready.csv
├── sunscreen_data.db
├── requirements.txt
└── .gitignore

---

## ⚙️ Installation

pip install -r requirements.txt

---

## ▶️ How to Run

Step 1: Setup Database
python setup_database.py

Step 2: (Optional) Run NLP Pipeline
python sentiment_topic_pipeline.py

Step 3: Run RAG System
python ask_llm.py

---

## 💬 Example Queries

* oily skin sunscreen
* best sunscreen for sensitive skin
* is this sunscreen greasy

---

## 🧠 Key Concepts Used

* Natural Language Processing (NLP)
* Sentiment Analysis
* Topic Modeling (BERTopic)
* Large Language Models (LLMs)
* Retrieval-Augmented Generation (RAG)
* SQLite Database

---

## ⚠️ Limitations

* Uses keyword-based retrieval (not semantic search)
* Runs on CPU → slower inference
* Can be improved using vector databases (FAISS, Pinecone)

---

## 🔮 Future Improvements

* Semantic search using embeddings
* Vector database integration
* Real-time data ingestion (APIs)
* Dashboard visualization

---

## 👨‍💻 Author

Developed as part of AI Market Trend Analysis Project.

---

## 📌 Conclusion

This project demonstrates how LLMs combined with structured data and retrieval pipelines can generate actionable consumer insights for real-world applications.
