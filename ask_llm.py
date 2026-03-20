import sqlite3
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

# Load DB
conn = sqlite3.connect("sunscreen_data.db")
cur = conn.cursor()

# Load LLM
model_id = "microsoft/Phi-3-mini-4k-instruct"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id)

llm = pipeline("text-generation", model=model, tokenizer=tokenizer)

print("RAG System Ready!\n")

while True:

    question = input("Ask a question (type 'exit' to stop): ")

    if question.lower() == "exit":
        break

    # 🔹 STEP 1: Retrieve relevant reviews (simple keyword match)
    cur.execute("""
    SELECT cleaned_text 
    FROM sunscreen_reviews
    WHERE cleaned_text LIKE ?
    LIMIT 5
    """, ('%' + question + '%',))

    rows = cur.fetchall()

    if not rows:
        context = "No relevant reviews found."
    else:
        context = "\n".join([r[0] for r in rows])

    # 🔹 STEP 2: Augment prompt with context
    prompt = f"""
    You are an AI assistant analyzing sunscreen reviews.

    Use ONLY the context below to answer.

    Context:
    {context}

    Question: {question}

    Answer:
    """

    # 🔹 STEP 3: Generate answer
    result = llm(prompt, max_new_tokens=120)

    answer = result[0]["generated_text"]

    print("\nRAG Answer:")
    print(answer)
    print("\n-----------------------------\n")