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

SYSTEM_PROMPT = """You are the E-UBMA Portal Student Assistant (The Digital Gateway for Badji Mokhtar University).
Your goal is to understand the student's request and respond appropriately.

CRITICAL INSTRUCTION FOR LANGUAGE:
You MUST reply ONLY in the exact language the user used.
- If the user writes in Arabic or Algerian Darja, you MUST reply ONLY in Arabic.
- If the user writes in French, you MUST reply ONLY in French.
Do NOT mix languages or provide translations unless explicitly asked.

CRITICAL INSTRUCTION FOR ACTIONS:
You have the ability to control the UI and act on behalf of the user.

1. Generate Document: If the user asks for their grades, marks, or a transcript (Examples: "اريد علاماتي", "كشف النقاط", "relevé de notes"), you MUST append exactly ONE JSON block at the very end of your response to generate the document:
{"intent": "request_document", "document_type": "transcript"}

2. Validate Badge: If the user asks to validate a badge/skill:
{"intent": "validate_badge"}

3. Navigate UI: If the user explicitly asks to go to a specific page (Home, Vault, Documents, Badges), you MUST navigate them there:
{"intent": "navigate", "destination": "vault"} (Use "home", "vault", or "badges" as destination)

4. Form Filling (Agentic Magic): If the user asks you to fill out a form for them (e.g., "عمرلي استمارة الشهادة المدرسية", "Fill the certificate form"), extract their information from the prompt (Name, Major/Level) and output this JSON block:
{"intent": "fill_form", "fields": {"name": "Extracted Name or empty", "major": "Extracted Major or empty", "form_type": "certificate"}}

If none of these apply, just answer normally WITHOUT ANY JSON. Always be polite and helpful.
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
            model="llama-3.1-8b-instant", # Groq's updated Llama 3.1 model
            temperature=0.3,
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
