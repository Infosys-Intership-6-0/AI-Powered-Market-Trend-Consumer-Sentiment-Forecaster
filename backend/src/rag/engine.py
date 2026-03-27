import os
import json
import faiss
import requests
import numpy as np
from datetime import datetime, timezone
from typing import Any, Dict, List
from threading import RLock

from sentence_transformers import SentenceTransformer

_RAG_LOCK = RLock()
_FAISS_ENGINE = {}

def _get_faiss_engine():
    with _RAG_LOCK:
        if "index" in _FAISS_ENGINE:
            return _FAISS_ENGINE
            
        # Path resolution pointing up from backend/src/rag/engine.py to the root /rag folder
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        index_path = os.path.join(base_dir, "rag", "faiss_index.bin")
        chunks_path = os.path.join(base_dir, "rag", "faiss_chunks.json")
        
        if not os.path.exists(index_path) or not os.path.exists(chunks_path):
            return None
            
        print("[RAG] Loading FAISS index...")
        _FAISS_ENGINE["index"] = faiss.read_index(index_path)
        with open(chunks_path, "r", encoding="utf-8") as f:
            _FAISS_ENGINE["chunks"] = json.load(f)
            
        print("[RAG] Loading SentenceTransformer...")
        _FAISS_ENGINE["embedder"] = SentenceTransformer("all-MiniLM-L6-v2")
        return _FAISS_ENGINE


def rag_status() -> Dict[str, Any]:
    engine = _get_faiss_engine()
    if not engine:
        return {"enabled": False, "documents_indexed": 0, "indexed_at": None, "products": {}}
    return {
        "enabled": True,
        "documents_indexed": len(engine["chunks"]),
        "indexed_at": datetime.now(timezone.utc).isoformat(),
        "products": {}
    }


def ask_rag(question: str, product: str | None = None, top_k: int = 3) -> Dict[str, Any]:
    query = (question or "").strip()
    if len(query) < 3:
        return {"question": query, "product": product, "answer": "Please provide a more specific question.", "retrieved": [], "summary": {}}

    engine = _get_faiss_engine()
    if not engine:
        return {
            "question": query, 
            "product": product, 
            "answer": "FAISS index or chunks not found. Ensure `build_faiss_index.py` was run.", 
            "retrieved": [], 
            "summary": {}
        }

    # 1. Encode query
    query_vec = engine["embedder"].encode([query], convert_to_numpy=True).astype("float32")
    faiss.normalize_L2(query_vec)
    
    # 2. Retrieve top-K chunks
    k = max(1, min(int(top_k), 5))
    distances, indices = engine["index"].search(query_vec, k)
    
    results = []
    retrieved = []
    for i, idx in enumerate(indices[0]):
        if 0 <= idx < len(engine["chunks"]):
            chunk = engine["chunks"][idx]
            results.append(chunk)
            retrieved.append({
                "snippet": chunk[:280],
                "score": float(distances[0][i])
            })
            
    context = "\n\n".join(results)
    
    # 3. Generate via Groq API
    groq_api_key = os.environ.get("GROQ_API_KEY")
    if not groq_api_key:
        return {
            "question": query,
            "product": product,
            "answer": "The GROQ_API_KEY environment variable is not set. Please get a free API key from console.groq.com and set it in your backend/.env file or export it.",
            "retrieved": retrieved,
            "summary": {"documents_matched": len(results)}
        }

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {groq_api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama3-8b-8192",
                "messages": [
                    {"role": "system", "content": "You are a skincare expert. Use the context to answer accurately."},
                    {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"}
                ],
                "max_tokens": 150,
                "temperature": 0.3
            },
            timeout=15
        )
        response.raise_for_status()
        answer = response.json()["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"[RAG] Groq Generation failed: {e}")
        answer = "I'm sorry, I couldn't connect to the Groq AI service. Please verify your API key and connection."
        
    return {
        "question": query,
        "product": product,
        "answer": answer,
        "retrieved": retrieved,
        "summary": {"documents_matched": len(results)}
    }
