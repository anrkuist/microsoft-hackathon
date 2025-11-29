from datetime import datetime, timedelta
import os
from passlib.context import CryptContext
from jose import jwt

# Load secret from environment for security (see SENSITIVE_DATA_MIGRATION.md)
SECRET_KEY = os.environ.get("AUTH_SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("Missing required environment variable: AUTH_SECRET_KEY")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 300

# MUDANÇA AQUI: Usar argon2 em vez de bcrypt
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)