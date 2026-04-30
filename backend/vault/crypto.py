import os
from cryptography.fernet import Fernet
import hashlib

# In production, this key should be securely stored in environment variables
# This is a master key for AES encryption
ENCRYPTION_KEY = os.environ.get("VAULT_ENCRYPTION_KEY", Fernet.generate_key().decode())
fernet = Fernet(ENCRYPTION_KEY.encode())

def encrypt_file(file_data: bytes) -> bytes:
    """Encrypts file data using AES (via Fernet)."""
    return fernet.encrypt(file_data)

def decrypt_file(encrypted_data: bytes) -> bytes:
    """Decrypts file data using AES (via Fernet)."""
    return fernet.decrypt(encrypted_data)

def generate_file_hash(file_data: bytes) -> str:
    """Generates a SHA-256 hash of the original file data for verification."""
    return hashlib.sha256(file_data).hexdigest()
