"""
ask_llm.py  (FAISS + Skincare Expert RAG)
------------------------------------------
Uses FAISS semantic search to retrieve relevant context
from sunscreen reviews + skincare knowledge document,
then passes it to Phi-3 for answer generation.

Prerequisites:
  1. Run build_faiss_index.py once to generate:
       - faiss_index.bin
       - faiss_chunks.json
"""

import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

# ----------------------------------------
# CONFIG
# ----------------------------------------
INDEX_PATH = "faiss_index.bin"
CHUNKS_PATH = "faiss_chunks.json"
EMBED_MODEL = "all-MiniLM-L6-v2"
LLM_MODEL = "microsoft/Phi-3-mini-4k-instruct"
TOP_K = 5          # Number of chunks to retrieve per query
MAX_NEW_TOKENS = 150

# ----------------------------------------
# 1. Load FAISS index + chunk texts
# ----------------------------------------
print("Loading FAISS index...")
index = faiss.read_index(INDEX_PATH)

with open(CHUNKS_PATH, "r", encoding="utf-8") as f:
    all_chunks = json.load(f)

print(f"  → Index loaded: {index.ntotal} vectors, {len(all_chunks)} chunks")

# ----------------------------------------
# 2. Load embedding model
# ----------------------------------------
print("Loading embedding model...")
embedder = SentenceTransformer(EMBED_MODEL)

# ----------------------------------------
# 3. Load Phi-3 LLM
# ----------------------------------------
print("Loading Phi-3 model...")
tokenizer = AutoTokenizer.from_pretrained(LLM_MODEL)
model = AutoModelForCausalLM.from_pretrained(LLM_MODEL)
llm = pipeline("text-generation", model=model, tokenizer=tokenizer)
print("RAG System Ready!\n")

# ----------------------------------------
# 4. Retrieval function
# ----------------------------------------
def retrieve(question: str, top_k: int = TOP_K) -> str:
    """Embed the question and retrieve top-k most similar chunks via FAISS."""
    query_vec = embedder.encode([question], convert_to_numpy=True).astype("float32")
    faiss.normalize_L2(query_vec)

    distances, indices = index.search(query_vec, top_k)

    retrieved = []
    for idx in indices[0]:
        if 0 <= idx < len(all_chunks):
            retrieved.append(all_chunks[idx])

    return "\n\n".join(retrieved) if retrieved else "No relevant information found."

# ----------------------------------------
# 5. Question loop
# ----------------------------------------
while True:
    question = input("Ask a skincare question (type 'exit' to stop): ").strip()

    if question.lower() == "exit":
        break

    if not question:
        continue

    # --- Retrieve context ---
    context = retrieve(question)

    # --- Build prompt ---
    prompt = f"""You are a skincare expert assistant specializing in sunscreen and skincare products.
Use the context below (from product reviews and skincare knowledge) to give an accurate, helpful answer.
If the context doesn't fully answer the question, use your general skincare knowledge to help.

Context:
{context}

Question: {question}

Answer:"""

    # --- Generate response ---
    result = llm(prompt, max_new_tokens=MAX_NEW_TOKENS, do_sample=False)
    answer = result[0]["generated_text"]

    print("\n--- Skincare Expert Answer ---")
    print(answer.split("Answer:")[-1].strip())
    print("------------------------------\n")