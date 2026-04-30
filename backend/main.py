from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.vault.notifications import NotificationManager
from backend.vault.qr_service import generate_qr_verification_url
from backend.badges.linkedin import generate_linkedin_add_url
from backend.chatbot.groq_service import process_chat_with_groq

app = FastAPI(
    title="E-UBMA Portal API",
    description="The Digital Gateway for Badji Mokhtar University - Backend Services",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
notification_manager = NotificationManager()

# --- Models ---
class DocumentNotificationRequest(BaseModel):
    student_id: str
    student_email: str
    document_name: str
    document_hash: str

class BadgeRequest(BaseModel):
    badge_name: str
    year: str
    month: str
    vault_link: str

class ChatRequest(BaseModel):
    message: str
    user_id: str = "anonymous"
    context: dict | None = None

# --- Endpoints ---
@app.get("/")
def read_root():
    return {"message": "Welcome to E-UBMA Portal API"}

@app.post("/api/vault/notify")
async def notify_student_document(req: DocumentNotificationRequest):
    """Notify a student via official email that a PAdES document is ready."""
    success = notification_manager.send_document_ready_email(
        email=req.student_email,
        student_id=req.student_id,
        document_name=req.document_name
    )
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send email notification")
    
    # Generate verification link
    qr_url = generate_qr_verification_url(req.document_hash)
    
    return {
        "status": "success",
        "message": f"Notification sent to {req.student_email}",
        "verify_url": qr_url
    }

@app.post("/api/badges/linkedin-url")
def get_linkedin_badge_url(req: BadgeRequest):
    """Generate the LinkedIn Add-to-Profile URL for a validated skill."""
    url = generate_linkedin_add_url(
        badge_name=req.badge_name,
        year=req.year,
        month=req.month,
        vault_link=req.vault_link
    )
    return {"linkedin_add_url": url}

@app.post("/api/chat")
async def chat_with_assistant(req: ChatRequest):
    """Main Chatbot Endpoint using Groq API"""
    result = await process_chat_with_groq(req.message, req.user_id, req.context)
    
    # Check if there is an actionable intent
    intent_data = result.get("intent_data")
    if intent_data:
        intent = intent_data.get("intent")
        if intent == "request_document":
            doc_type = intent_data.get("document_type", "document")
            # Here we would normally trigger Vault logic
            result["reply"] += f"\n\n[SYSTÈME] : Démarrage du processus de génération pour : {doc_type}. / جاري بدء المعاملة لاستخراج: {doc_type}."
        elif intent == "inquire_grades":
            # Here we would fetch grades from R1-R14
            result["reply"] += "\n\n[SYSTÈME] : Vos notes du semestre en cours (R1-R14) : Algorithmique (14/20), Base de Données (16/20). / علاماتك: خوارزميات (14)، قواعد بيانات (16)."
        elif intent == "validate_badge":
            # Here we would trigger the badge validation workflow
            result["reply"] += "\n\n[SYSTÈME] : Demande de validation de badge envoyée à l'administration. / تم إرسال طلب اعتماد الشارة."
            
    return {
        "reply": result["reply"],
        "intent_detected": intent_data
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
