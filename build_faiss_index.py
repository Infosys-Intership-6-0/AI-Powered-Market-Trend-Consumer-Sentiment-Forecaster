"""
build_faiss_index.py
--------------------
Run this ONCE to build the FAISS vector index from:
  1. Sunscreen reviews stored in SQLite
  2. skincare_knowledge.txt (general skincare expert document)

Output:
  - faiss_index.bin       → FAISS index file
  - faiss_chunks.json     → Matching text chunks for each index entry
"""

import sqlite3
import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# ----------------------------------------
# CONFIG
# ----------------------------------------
DB_PATH = "sunscreen_data.db"
KNOWLEDGE_PATH = "skincare_knowledge.txt"
INDEX_PATH = "faiss_index.bin"
CHUNKS_PATH = "faiss_chunks.json"
EMBED_MODEL = "all-MiniLM-L6-v2"   # Fast, good quality, 384-dim embeddings

# ----------------------------------------
# 1. Load embedding model
# ----------------------------------------
print("Loading embedding model...")
embedder = SentenceTransformer(EMBED_MODEL)

# ----------------------------------------
# 2. Load review texts from SQLite
# ----------------------------------------
print("Loading reviews from database...")
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()
cur.execute("SELECT cleaned_text FROM sunscreen_reviews WHERE cleaned_text IS NOT NULL")
rows = cur.fetchall()
conn.close()

review_chunks = [r[0].strip() for r in rows if r[0] and r[0].strip()]
print(f"  → Loaded {len(review_chunks)} reviews")

# ----------------------------------------
# 3. Load and chunk the knowledge document
# ----------------------------------------
print("Loading skincare knowledge document...")

def chunk_knowledge_doc(filepath, chunk_size=5):
    """Split the knowledge doc by non-empty lines, group into chunks."""
    with open(filepath, "r", encoding="utf-8") as f:
        lines = [l.strip() for l in f.readlines() if l.strip()]

    chunks = []
    for i in range(0, len(lines), chunk_size):
        chunk = " ".join(lines[i:i + chunk_size])
        chunks.append(chunk)
    return chunks

knowledge_chunks = chunk_knowledge_doc(KNOWLEDGE_PATH, chunk_size=5)
print(f"  → Loaded {len(knowledge_chunks)} knowledge chunks")

# ----------------------------------------
# 4. Combine all chunks
# ----------------------------------------
all_chunks = knowledge_chunks + review_chunks    # knowledge first = higher priority in search
print(f"\nTotal chunks to index: {len(all_chunks)}")

# ----------------------------------------
# 5. Embed all chunks
# ----------------------------------------
print("Embedding all chunks (this may take a minute)...")
embeddings = embedder.encode(all_chunks, batch_size=64, show_progress_bar=True)
embeddings = np.array(embeddings).astype("float32")

# Normalize for cosine similarity
faiss.normalize_L2(embeddings)

# ----------------------------------------
# 6. Build FAISS index
# ----------------------------------------
print("Building FAISS index...")
dimension = embeddings.shape[1]
index = faiss.IndexFlatIP(dimension)   # Inner Product = cosine similarity after L2 norm
index.add(embeddings)

faiss.write_index(index, INDEX_PATH)
print(f"  → FAISS index saved to: {INDEX_PATH}  ({index.ntotal} vectors)")

# ----------------------------------------
# 7. Save chunks mapping
# ----------------------------------------
with open(CHUNKS_PATH, "w", encoding="utf-8") as f:
    json.dump(all_chunks, f, ensure_ascii=False, indent=2)

print(f"  → Chunk texts saved to: {CHUNKS_PATH}")
print("\nIndex build complete! You can now run ask_llm.py")