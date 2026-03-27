"""
ask_llm.py (FAST RAG with FAISS + Mistral via Ollama)
----------------------------------------------------
Ultra-fast RAG pipeline using:
- FAISS for retrieval
- SentenceTransformers for embeddings
- Mistral (via Ollama) for generation

Prerequisites:
  1. Run build_faiss_index.py first
  2. Run: ollama run mistral
"""

import json
import faiss
import numpy as np
import requests
from sentence_transformers import SentenceTransformer

# ----------------------------------------
# CONFIG
# ----------------------------------------
INDEX_PATH = "faiss_index.bin"
CHUNKS_PATH = "faiss_chunks.json"
EMBED_MODEL = "all-MiniLM-L6-v2"

TOP_K = 3              # 🔥 reduced for speed
TIMEOUT = 300

# ----------------------------------------
# LOAD FAISS + DATA
# ----------------------------------------
print("Loading FAISS index...")
index = faiss.read_index(INDEX_PATH)

with open(CHUNKS_PATH, "r", encoding="utf-8") as f:
    all_chunks = json.load(f)

print(f"Loaded {len(all_chunks)} chunks")

# ----------------------------------------
# LOAD EMBEDDING MODEL
# ----------------------------------------
print("Loading embedding model...")
embedder = SentenceTransformer(EMBED_MODEL)

print("RAG system ready!\n")

# ----------------------------------------
# RETRIEVAL FUNCTION
# ----------------------------------------
def retrieve(query, top_k=TOP_K):
    query_vec = embedder.encode([query], convert_to_numpy=True).astype("float32")
    faiss.normalize_L2(query_vec)

    distances, indices = index.search(query_vec, top_k)

    results = []
    for idx in indices[0]:
        if 0 <= idx < len(all_chunks):
            results.append(all_chunks[idx])

    return "\n\n".join(results)


# ----------------------------------------
# GENERATION (OLLAMA - FAST)
# ----------------------------------------
def generate(prompt):
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "mistral",
            "prompt": prompt,
            "stream": False,
            "options": {
                "num_predict": 100
            }
        },
        timeout=TIMEOUT
    )

    return response.json()["response"]


# ----------------------------------------
# MAIN LOOP
# ----------------------------------------
while True:
    question = input("Ask (or 'exit'): ").strip()

    if question.lower() == "exit":
        break

    if not question:
        continue

    # Retrieve context
    context = retrieve(question)

    # Prompt
    prompt = f"""
You are a skincare expert.

Use the context to answer accurately.

Context:
{context}

Question: {question}

Answer:
"""

    # Generate answer
    answer = generate(prompt)

    print("\n--- ANSWER ---")
    print(answer.strip())
    print("--------------\n")