from __future__ import annotations

import os
import json
import logging
import requests
import numpy as np
import pandas as pd
from datetime import datetime, timezone
from typing import Any, Dict, List
from threading import RLock

logger = logging.getLogger("src.rag.engine")

_RAG_LOCK = RLock()
_FAISS_ENGINE: Dict[str, Any] = {}

# Resolve paths relative to this file: backend/src/rag/engine.py -> backend/data/processed/
_BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
_PROCESSED_CSV = os.path.join(_BACKEND_DIR, "data", "processed", "cleaned_reviews.csv")

# ──────────────────────────────────────────────────────────────────────────────
# SKINCARE EXPERT KNOWLEDGE BASE
# This is indexed alongside user reviews so the chatbot has both real feedback
# AND authoritative skincare knowledge to draw from.
# ──────────────────────────────────────────────────────────────────────────────
SKINCARE_KNOWLEDGE = [
    {
        "category": "sunscreen",
        "content": (
            "SUNSCREEN COMPREHENSIVE GUIDE:\n"
            "TYPES OF SUNSCREEN:\n"
            "1. Chemical/Organic Sunscreen: Active ingredients include Avobenzone, Octinoxate, Oxybenzone, Homosalate, Octisalate. "
            "Absorbs UV rays and converts them to heat. Lightweight, no white cast, cosmetically elegant. "
            "May irritate sensitive skin, needs 15-20 min to activate. Best for oily skin, darker skin tones, daily wear under makeup.\n"
            "2. Mineral/Physical Sunscreen: Active ingredients Zinc Oxide, Titanium Dioxide. "
            "Sits on skin surface, reflects and scatters UV rays. Gentle, works immediately, reef-safe, non-comedogenic. "
            "Can leave white cast, may feel heavy. Best for sensitive skin, acne-prone skin, children, post-procedure skin.\n"
            "3. Hybrid Sunscreen: Combines both chemical and mineral filters. Best of both worlds.\n"
            "SPF RATINGS: SPF 15 blocks ~93% UVB. SPF 30 blocks ~97% UVB (recommended daily minimum). "
            "SPF 50 blocks ~98% UVB (extended outdoor activities). SPF 100 blocks ~99% UVB.\n"
            "PA RATINGS (UVA Protection): PA+ some, PA++ moderate, PA+++ high, PA++++ extremely high.\n"
            "APPLICATION RULES: Apply 1/4 teaspoon (2 finger lengths) for face. Apply 1 oz (shot glass) for full body. "
            "Reapply every 2 hours. Reapply after swimming, sweating, or towel drying. "
            "Use even on cloudy days (80% UV penetrates clouds). UV rays penetrate windows."
        ),
    },
    {
        "category": "skin_types",
        "content": (
            "SKIN TYPE GUIDE:\n"
            "1. OILY SKIN: Shiny appearance, enlarged pores, prone to acne/blackheads. "
            "Best ingredients: Salicylic acid, Niacinamide, Hyaluronic acid, Clay, Retinol. "
            "Avoid: Heavy oils, Coconut oil, Cocoa butter, Over-washing. Use lightweight oil-free matte finish chemical SPF.\n"
            "2. DRY SKIN: Tight feeling, flaking, rough texture, dull complexion. "
            "Best ingredients: Hyaluronic acid, Ceramides, Squalane, Glycerin, Shea butter. "
            "Avoid: Alcohol, Fragrance, Harsh sulfates, Hot water. Use hydrating sunscreen formula.\n"
            "3. COMBINATION SKIN: Oily T-zone, dry/normal cheeks. "
            "Best ingredients: Niacinamide, Hyaluronic acid, Green tea, Light moisturizers. Use lightweight gel-based SPF.\n"
            "4. SENSITIVE SKIN: Redness, burning, stinging, reactive to products. "
            "Best ingredients: Centella asiatica, Aloe vera, Oat extract, Ceramides, Allantoin. "
            "Avoid: Fragrance, Alcohol, Essential oils, Harsh exfoliants. Use mineral-only zinc oxide sunscreen.\n"
            "5. NORMAL SKIN: Balanced, few imperfections. Best ingredients: Vitamin C, Peptides, Hyaluronic acid, Retinol."
        ),
    },
    {
        "category": "ingredients",
        "content": (
            "SKINCARE INGREDIENTS ENCYCLOPEDIA:\n"
            "1. RETINOL (Vitamin A): Anti-aging, reduces wrinkles, treats acne, promotes cell turnover. "
            "Start 0.25%, work up to 0.5-1%. Night only, 2-3 times/week initially. "
            "Causes purging initially, increases sun sensitivity. MUST use sunscreen. Avoid during pregnancy. "
            "Don't mix with AHA/BHA or Vitamin C in same routine. Pairs well with Hyaluronic acid, Niacinamide, Ceramides.\n"
            "2. VITAMIN C (L-Ascorbic Acid): Brightening, antioxidant, collagen boost, fades dark spots. "
            "10-20% concentration. Morning before sunscreen. Unstable, store in dark cool place.\n"
            "3. NIACINAMIDE (Vitamin B3): Minimizes pores, controls oil, brightens, strengthens barrier. 2-10%. Very versatile.\n"
            "4. HYALURONIC ACID: Intense hydration, plumps skin. Apply to DAMP skin, follow with moisturizer.\n"
            "5. SALICYLIC ACID (BHA): Unclogs pores, reduces acne. 0.5-2%. Best for oily, acne-prone skin.\n"
            "6. AHA (Glycolic, Lactic, Mandelic Acid): Surface exfoliation, brightening, anti-aging. Increases sun sensitivity.\n"
            "7. CERAMIDES: Repairs skin barrier, locks in moisture. Good for all skin types.\n"
            "8. PEPTIDES: Anti-aging, supports collagen, firms skin. Don't mix with AHA/BHA or Vitamin C.\n"
            "9. CENTELLA ASIATICA (Cica): Calming, healing, anti-inflammatory, barrier repair.\n"
            "10. BENZOYL PEROXIDE: Kills acne bacteria. 2.5% as effective as 10% with less irritation."
        ),
    },
    {
        "category": "routines",
        "content": (
            "SKINCARE ROUTINE GUIDE:\n"
            "BASIC MORNING ROUTINE: 1. Cleanser 2. Toner/Essence 3. Serum (Vitamin C, Niacinamide, or HA) "
            "4. Eye Cream 5. Moisturizer 6. SUNSCREEN SPF 30+ (NON-NEGOTIABLE!)\n"
            "BASIC EVENING ROUTINE: 1. Oil Cleanser/Micellar Water 2. Water-based Cleanser (double cleanse) "
            "3. Exfoliant (AHA/BHA 2-3x/week) 4. Toner 5. Serum/Treatment (Retinol, etc.) 6. Eye Cream 7. Moisturizer 8. Face Oil (optional)\n"
            "BEGINNER ROUTINE: Morning: Cleanser → Moisturizer → Sunscreen. Evening: Cleanser → Moisturizer.\n"
            "LAYERING RULE: Thinnest to thickest. Water-based before oil-based. Actives before moisturizer. Sunscreen ALWAYS last.\n"
            "INGREDIENT PAIRING: CAN combine Niacinamide+HA, Vitamin C+Sunscreen, Retinol+HA. "
            "DON'T combine Retinol+AHA/BHA or Vitamin C+AHA/BHA in same routine. Alternate nights.\n"
            "RESULTS TIMELINE: Hydration 1 week. Acne 4-6 weeks. Brightening 4-8 weeks. Anti-aging 8-12 weeks. Hyperpigmentation 8-16 weeks."
        ),
    },
    {
        "category": "concerns",
        "content": (
            "SKIN CONCERN TREATMENT GUIDE:\n"
            "1. ACNE: Mild → Salicylic acid cleanser + Niacinamide + Non-comedogenic moisturizer. "
            "Moderate → Add Benzoyl Peroxide or Retinol. Severe/Cystic → See a dermatologist.\n"
            "2. HYPERPIGMENTATION: Key ingredients: Vitamin C, Niacinamide, Alpha Arbutin, Kojic Acid, Azelaic Acid, Tranexamic Acid. "
            "SPF is CRITICAL. Takes 2-4 months.\n"
            "3. ANTI-AGING: Sunscreen is #1 anti-aging product! Key: Retinol, Vitamin C, Peptides, HA, Niacinamide.\n"
            "4. DEHYDRATION vs DRY: Dehydrated lacks WATER → Hyaluronic acid. Dry lacks OIL → Ceramides, facial oils, rich creams.\n"
            "5. ROSACEA: Avoid hot beverages, spicy food, alcohol. Use gentle products, mineral sunscreen, azelaic acid, centella.\n"
            "6. DARK CIRCLES: Causes: Genetics, sleep, allergies. Ingredients: Caffeine, Vitamin K, Retinol, Peptides, Vitamin C."
        ),
    },
    {
        "category": "products",
        "content": (
            "PRODUCT RECOMMENDATIONS:\n"
            "SUNSCREENS: Budget → Neutrogena Ultra Sheer SPF 55 (chemical), CeraVe Hydrating Mineral SPF 30, Sun Bum SPF 50. "
            "Mid-Range → La Roche-Posay Anthelios Melt-In Milk SPF 60, EltaMD UV Clear SPF 46 (acne-prone), "
            "Supergoop Unseen SPF 40, Biore UV Aqua Rich SPF 50 (Japanese, no white cast). "
            "Premium → Tatcha Silken Pore SPF 35, Drunk Elephant Umbra Sheer SPF 30.\n"
            "CLEANSERS: CeraVe Hydrating (dry/normal), CeraVe Foaming (oily), La Roche-Posay Toleriane (sensitive), Cetaphil Gentle (all).\n"
            "SERUMS: The Ordinary Niacinamide 10%+Zinc (oily/acne), The Ordinary HA 2%+B5 (hydration), "
            "Paula's Choice 2% BHA (acne), Skinceuticals C E Ferulic (gold standard Vitamin C).\n"
            "MOISTURIZERS: CeraVe Moisturizing Cream (dry), Neutrogena Hydro Boost Gel (oily), "
            "La Roche-Posay Cicaplast Baume B5 (sensitive/repair).\n"
            "RETINOL: The Ordinary Retinol 0.5% in Squalane (beginner), Paula's Choice Clinical 1% (mid).\n"
            "Always patch test new products! Consult a dermatologist for persistent concerns."
        ),
    },
]


def _get_faiss_engine():
    """Lazily build a FAISS index from review CSV + expert skincare knowledge."""
    with _RAG_LOCK:
        if "index" in _FAISS_ENGINE:
            return _FAISS_ENGINE

        # Guard: heavy imports only when needed
        try:
            import faiss
            from sentence_transformers import SentenceTransformer
        except ImportError as e:
            logger.error("[RAG] Missing dependency: %s. Install faiss-cpu and sentence-transformers.", e)
            return None

        # ── 1. Load review chunks from CSV ──
        review_chunks: List[str] = []
        if os.path.exists(_PROCESSED_CSV):
            logger.info("[RAG] Loading reviews from %s ...", _PROCESSED_CSV)
            df = pd.read_csv(_PROCESSED_CSV)
            text_col = None
            for candidate in ("cleaned_text", "review_text", "text"):
                if candidate in df.columns:
                    text_col = candidate
                    break
            if text_col:
                review_chunks = df[text_col].dropna().astype(str).str.strip().tolist()
                review_chunks = [c for c in review_chunks if len(c) > 10]
        else:
            logger.warning("[RAG] Processed CSV not found at %s", _PROCESSED_CSV)

        # ── 2. Load expert skincare knowledge chunks ──
        knowledge_chunks: List[str] = []
        for entry in SKINCARE_KNOWLEDGE:
            content = entry.get("content", "").strip()
            if content:
                # Split large knowledge entries into smaller paragraphs for better retrieval
                paragraphs = [p.strip() for p in content.split("\n") if len(p.strip()) > 20]
                knowledge_chunks.extend(paragraphs)

        # ── 3. Combine: knowledge first (higher priority), then reviews ──
        all_chunks = knowledge_chunks + review_chunks
        if not all_chunks:
            logger.warning("[RAG] No chunks available to index.")
            return None

        logger.info(
            "[RAG] Encoding %d chunks (%d knowledge + %d reviews) ...",
            len(all_chunks), len(knowledge_chunks), len(review_chunks),
        )
        embedder = SentenceTransformer("all-MiniLM-L6-v2")
        embeddings = embedder.encode(all_chunks, batch_size=64, show_progress_bar=False)
        embeddings = np.array(embeddings).astype("float32")
        faiss.normalize_L2(embeddings)

        # Build FAISS index (Inner Product = cosine similarity after L2 norm)
        dimension = embeddings.shape[1]
        index = faiss.IndexFlatIP(dimension)
        index.add(embeddings)

        _FAISS_ENGINE["index"] = index
        _FAISS_ENGINE["chunks"] = all_chunks
        _FAISS_ENGINE["embedder"] = embedder
        _FAISS_ENGINE["built_at"] = datetime.now(timezone.utc).isoformat()
        logger.info("[RAG] FAISS index ready with %d vectors.", index.ntotal)
        return _FAISS_ENGINE


def rag_status() -> Dict[str, Any]:
    engine = _get_faiss_engine()
    if not engine:
        return {"enabled": False, "documents_indexed": 0, "indexed_at": None, "products": {}}
    return {
        "enabled": True,
        "documents_indexed": len(engine["chunks"]),
        "indexed_at": engine.get("built_at"),
        "products": {},
    }


def ask_rag(question: str, product: str | None = None, top_k: int = 5) -> Dict[str, Any]:
    query = (question or "").strip()
    if len(query) < 3:
        return {
            "question": query,
            "product": product,
            "answer": "Please provide a more specific question.",
            "retrieved": [],
            "summary": {},
        }

    engine = _get_faiss_engine()
    if not engine:
        return {
            "question": query,
            "product": product,
            "answer": "The RAG index could not be built. Ensure processed review data exists in backend/data/processed/.",
            "retrieved": [],
            "summary": {},
        }

    import faiss

    # 1. Encode query
    query_vec = engine["embedder"].encode([query], convert_to_numpy=True).astype("float32")
    faiss.normalize_L2(query_vec)

    # 2. Retrieve top-K chunks
    k = max(1, min(int(top_k), 8))
    distances, indices = engine["index"].search(query_vec, k)

    results = []
    retrieved = []
    for i, idx in enumerate(indices[0]):
        if 0 <= idx < len(engine["chunks"]):
            chunk = engine["chunks"][idx]
            results.append(chunk)
            retrieved.append({"snippet": chunk[:280], "score": round(float(distances[0][i]), 4)})

    context = "\n\n".join(results)
    # Truncate context to avoid exceeding Groq's token limit
    if len(context) > 3000:
        context = context[:3000]

    # 3. Generate via Groq API
    groq_api_key = os.environ.get("GROQ_API_KEY")
    if not groq_api_key:
        return {
            "question": query,
            "product": product,
            "answer": "The GROQ_API_KEY environment variable is not set. Please get a free API key from console.groq.com and set it in your backend/.env file.",
            "retrieved": retrieved,
            "summary": {"documents_matched": len(results)},
        }

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {groq_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.1-8b-instant",
                "messages": [
                    {
                        "role": "system",
                        "content": (
                            "You are a friendly, knowledgeable skincare expert chatbot. "
                            "You MUST format ALL responses using proper Markdown syntax.\n\n"
                            "STRICT FORMATTING RULES:\n"
                            "- Use ## for section headings\n"
                            "- Use **bold** for key terms, product names, and ingredients\n"
                            "- Use numbered lists (1. 2. 3.) for steps\n"
                            "- Use bullet lists (- ) for options or features\n"
                            "- Use emojis sparingly: 🌸 📌 💡 ⚠️ 🤔\n\n"
                            "RESPONSE TEMPLATE (follow this structure every time):\n"
                            "```\n"
                            "🌸 [One empathetic sentence acknowledging the user's concern]\n\n"
                            "## 📌 [Main Topic Heading]\n\n"
                            "1. **[Point 1]** – explanation\n"
                            "2. **[Point 2]** – explanation\n"
                            "3. **[Point 3]** – explanation\n\n"
                            "## 💡 Pro Tip\n"
                            "[One useful extra tip]\n\n"
                            "⚠️ *If the issue persists, please consult a dermatologist.*\n\n"
                            "## 🤔 You might also want to ask:\n"
                            "- [Follow-up question 1]\n"
                            "- [Follow-up question 2]\n"
                            "```\n\n"
                            "IMPORTANT RULES:\n"
                            "- Use ONLY the provided context to answer\n"
                            "- Keep answers 150-300 words\n"
                            "- Tone: warm, professional, reassuring\n"
                            "- Always include the disclaimer and follow-up questions\n"
                            "- If you don't have enough context, say so honestly"
                        ),
                    },
                    {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"},
                ],
                "max_tokens": 500,
                "temperature": 0.7,
            },
            timeout=20,
        )
        response.raise_for_status()
        answer = response.json()["choices"][0]["message"]["content"].strip()
    except Exception as e:
        logger.error("[RAG] Groq generation failed: %s", e)
        answer = "I'm sorry, I couldn't connect to the Groq AI service. Please verify your API key and internet connection."

    return {
        "question": query,
        "product": product,
        "answer": answer,
        "retrieved": retrieved,
        "summary": {"documents_matched": len(results)},
    }
