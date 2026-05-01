from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from .chatbot.groq_service import get_chat_response
from .database import engine, Base
from . import models

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="E-UBMA API", description="Official backend for Badji Mokhtar University Portal")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to GNU E-UBMA API", "status": "operational"}

@app.post("/api/chat")
async def chat_endpoint(payload: dict):
    message = payload.get("message")
    context = payload.get("context", {})
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")
    
    response = await get_chat_response(message, context)
    return response

@app.post("/api/crypto/encrypt")
async def encrypt_file(file: UploadFile = File(...)):
    # Simulated encryption for frontend demo
    content = await file.read()
    return content

@app.post("/api/crypto/decrypt")
async def decrypt_file(file: UploadFile = File(...)):
    # Simulated decryption for frontend demo
    content = await file.read()
    return content

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
