import os
from fastapi import FastAPI, HTTPException, Request, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

from backend.vault.notifications import NotificationManager
from backend.vault.qr_service import generate_qr_verification_url
from backend.badges.linkedin import generate_linkedin_add_url
from backend.chatbot.groq_service import process_chat_with_groq

# Database & Security
from backend.database import SessionLocal, engine
from backend import models
from backend.vault import crypto, sharing

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="E-UBMA Portal API",
    description="The Digital Gateway for Badji Mokhtar University - Secure Backend",
    version="2.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ph = PasswordHasher(time_cost=2, memory_cost=10240, parallelism=2)
notification_manager = NotificationManager()
UPLOAD_DIR = "backend/uploads"

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Models ---
class ChatRequest(BaseModel):
    message: str
    user_id: str = "anonymous"
    context: dict | None = None

class UserCreate(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    major: str

class UserLogin(BaseModel):
    email: str
    password: str

# --- Endpoints ---

@app.post("/api/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = ph.hash(user.password)
    new_user = models.User(
        email=user.email,
        hashed_password=hashed_pwd,
        first_name=user.first_name,
        last_name=user.last_name,
        major=user.major
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "user_id": new_user.id}

@app.post("/api/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    try:
        ph.verify(db_user.hashed_password, user.password)
    except VerifyMismatchError:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        "message": "Login successful", 
        "user_id": db_user.id,
        "first_name": db_user.first_name,
        "major": db_user.major
    }

@app.post("/api/documents/upload")
async def upload_document(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Uploads a file, encrypts it with AES-256 in memory, generates Hash & QR, and saves it."""
    file_data = await file.read()
    
    # Generate Hash for Authenticity
    file_hash = crypto.generate_file_hash(file_data)
    
    # Encrypt file data
    encrypted_data = crypto.encrypt_file(file_data)
    
    # Ensure dir exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, f"{file_hash}.enc")
    
    # Save encrypted data
    with open(file_path, "wb") as f:
        f.write(encrypted_data)
        
    new_doc = models.Document(
        filename=file.filename,
        file_path=file_path,
        file_hash=file_hash,
        owner_id=user_id
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    
    # Get dynamic base URL from request or environment
    base_url = os.environ.get("VERCEL_URL", "localhost:8000")
    if not base_url.startswith("http"):
        base_url = f"https://{base_url}"
    
    qr_url = f"{base_url}/api/documents/verify/{file_hash}"
    
    return {
        "message": "File encrypted and uploaded securely",
        "document_id": new_doc.id,
        "qr_verification_url": qr_url
    }

@app.get("/api/documents")
def get_user_documents(user_id: int, db: Session = Depends(get_db)):
    docs = db.query(models.Document).filter(models.Document.owner_id == user_id).all()
    return [{"id": d.id, "filename": d.filename, "hash": d.file_hash} for d in docs]

@app.get("/api/documents/share/{doc_id}")
def generate_share_link(doc_id: int, db: Session = Depends(get_db)):
    """Generate a temporary JWT link to share the document."""
    doc = db.query(models.Document).filter(models.Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    token = sharing.create_temporary_link(doc_id, expires_delta_hours=24)
    # Return a frontend URL (same as base URL but without /api)
    base_url = os.environ.get("VERCEL_URL", "localhost:5173")
    if not base_url.startswith("http"):
        base_url = f"https://{base_url}"
    
    return {"temporary_link": f"{base_url}/shared?token={token}"}

@app.get("/api/documents/verify/{file_hash}")
def verify_document_authenticity(file_hash: str, db: Session = Depends(get_db)):
    doc = db.query(models.Document).filter(models.Document.file_hash == file_hash).first()
    if not doc:
        return {"status": "Fake", "message": "This document does NOT exist in the university vault."}
    
    owner = db.query(models.User).filter(models.User.id == doc.owner_id).first()
    return {
        "status": "Authentic",
        "message": "This is a verified E-UBMA document.",
        "filename": doc.filename,
        "owner": f"{owner.first_name} {owner.last_name}",
        "major": owner.major
    }

@app.post("/api/chat")
async def chat_with_assistant(req: ChatRequest):
    """Main Chatbot Endpoint using Groq API"""
    result = await process_chat_with_groq(req.message, req.user_id, req.context)
    intent_data = result.get("intent_data")
    
    if intent_data:
        intent = intent_data.get("intent")
        ui_language = req.context.get("ui_language", "fr") if req.context else "fr"
            
        if intent == "request_document":
            doc_type = intent_data.get("document_type", "document")
            if ui_language == 'ar':
                result["reply"] += f"\n\n[نظام] : جاري بدء المعاملة لاستخراج: {doc_type}."
            else:
                result["reply"] += f"\n\n[SYSTÈME] : Démarrage du processus de génération pour : {doc_type}."
        elif intent == "fill_form":
            if ui_language == 'ar':
                result["reply"] += "\n\n[نظام] : تم استخراج البيانات، جاري نقلك لصفحة الاستمارات لملئها تلقائياً..."
            else:
                result["reply"] += "\n\n[SYSTÈME] : Données extraites, redirection vers le formulaire pour remplissage automatique..."
        elif intent == "validate_badge":
            if ui_language == 'ar':
                result["reply"] += "\n\n[نظام] : تم إرسال طلب اعتماد الشارة بنجاح."
            else:
                result["reply"] += "\n\n[SYSTÈME] : Demande de validation de badge envoyée à l'administration."
            
    return {
        "reply": result["reply"],
        "intent_detected": intent_data
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
