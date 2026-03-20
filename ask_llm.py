import sqlite3
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

# -------------------------------
# 1. Connect to Database
# -------------------------------
conn = sqlite3.connect("sunscreen_data.db")
cur = conn.cursor()

# -------------------------------
# 2. Load LLM
# -------------------------------
print("Loading Phi-3 model...")

model_id = "microsoft/Phi-3-mini-4k-instruct"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id)

llm = pipeline("text-generation", model=model, tokenizer=tokenizer)

print("RAG System Ready!\n")

# -------------------------------
# 3. Question Loop
# -------------------------------
while True:

    question = input("Ask a question (type 'exit' to stop): ")

    if question.lower() == "exit":
        break

    # -------------------------------
    # 4. KEYWORD-BASED RETRIEVAL (FIXED)
    # -------------------------------
    stopwords = ["which", "is", "for", "the", "a", "an", "are", "of"]

    keywords = [w for w in question.lower().split() if w not in stopwords]

    if not keywords:
        keywords = question.lower().split()

    query = " OR ".join(["cleaned_text LIKE ?" for _ in keywords])
    values = [f"%{word}%" for word in keywords]

    sql = f"""
    SELECT cleaned_text 
    FROM sunscreen_reviews
    WHERE {query}
    LIMIT 3
    """

    cur.execute(sql, values)
    rows = cur.fetchall()

    if not rows:
        context = "No relevant reviews found."
    else:
        context = "\n".join([r[0] for r in rows])

    # -------------------------------
    # 5. PROMPT (CLEANED)
    # -------------------------------
    prompt = f"""
    Use the context below to answer.

    Context:
    {context}

    Question: {question}

    Answer:
    """

    # -------------------------------
    # 6. GENERATE RESPONSE (FASTER)
    # -------------------------------
    result = llm(prompt, max_new_tokens=50)

    answer = result[0]["generated_text"]

    print("\nRAG Answer:")
    print(answer.split("Answer:")[-1].strip())
    print("\n-----------------------------\n")

# -------------------------------
# 7. Close DB
# -------------------------------
conn.close()