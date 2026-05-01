import os
import json
from groq import AsyncGroq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Async Groq client
client = AsyncGroq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

SYSTEM_PROMPT = """You are the 'E-UBMA Smart Assistant' for the 'Guichet Numerique Unique' (GNU) at Badji Mokhtar University.
You are a highly professional, academic assistant that helps students manage their documents, badges, and university requests.

LANGUAGE RULES:
1. You MUST detect the student's language (Arabic, Algerian Darja, or French).
2. You MUST reply ONLY in the same language the student uses.
3. If the user context specifies a 'ui_language', prioritize it for the tone and formatting.
4. For Arabic users, use a professional Algerian academic tone (avoid mixing French words in Arabic unless necessary).

GNU SERVICES (Context):
- Vault (Coffre-fort): Secure storage for PAdES signed documents.
- Open Badges: Certification for skills.

UI ACTIONS (JSON ONLY AT THE END):
1. REQUEST DOCUMENT: {"intent": "request_document", "document_type": "transcript"}
2. VALIDATE BADGE: {"intent": "validate_badge"}
3. NAVIGATION: {"intent": "navigate", "destination": "vault"} (vault, home, badges, forms)
4. FORM FILLING: {"intent": "fill_form", "fields": {"name": "...", "major": "...", "form_type": "certificate"}}

Keep your answer concise and do not show the JSON to the user.
"""

async def process_chat_with_groq(message: str, user_id: str = "anonymous", user_context: dict = None):
    try:
        # Inject dynamic context into the system prompt if provided
        dynamic_prompt = SYSTEM_PROMPT
        if user_context:
            context_str = json.dumps(user_context, ensure_ascii=False, indent=2)
            dynamic_prompt += f"\n\nCURRENT USER CONTEXT (Use this to answer their questions accurately):\n{context_str}"

        chat_completion = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": dynamic_prompt},
                {"role": "user", "content": message}
            ],
            model="llama3-70b-8192", # Using 70B for better logic and language adherence
            temperature=0.2,
            max_tokens=1024,
        )
        
        response_text = chat_completion.choices[0].message.content
        
        # Robust extraction logic for our custom intents
        intent_data = None
        if "{" in response_text and "}" in response_text:
            for i in range(len(response_text)):
                if response_text[i] == '{':
                    for j in range(len(response_text), i, -1):
                        if response_text[j-1] == '}':
                            json_str = response_text[i:j]
                            try:
                                intent_data = json.loads(json_str)
                                # Remove the JSON from the user-facing text
                                response_text = response_text[:i].strip()
                                break
                            except Exception:
                                pass
                    if intent_data:
                        break
                
        return {
            "reply": response_text,
            "intent_data": intent_data
        }
        
    except Exception as e:
        print(f"Groq API Error: {e}")
        return {
            "reply": "Désolé, une erreur technique est survenue avec le serveur d'intelligence artificielle. / عذراً، حدث خطأ تقني في خادم الذكاء الاصطناعي.",
            "intent_data": None
        }
