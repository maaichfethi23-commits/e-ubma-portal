import jwt
from datetime import datetime, timedelta

SECRET_KEY = "super_secret_temporary_key_for_sharing"
ALGORITHM = "HS256"

def create_temporary_link(document_id: int, expires_delta_hours: int = 24) -> str:
    """Generates a JWT token to grant temporary access to a document."""
    expire = datetime.utcnow() + timedelta(hours=expires_delta_hours)
    to_encode = {"doc_id": document_id, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_temporary_link(token: str) -> int:
    """Verifies the JWT and returns the document ID if valid. Raises exception if expired or invalid."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        doc_id: int = payload.get("doc_id")
        if doc_id is None:
            raise ValueError("Invalid token")
        return doc_id
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.PyJWTError:
        raise ValueError("Invalid token")
