import os
import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field, validator
import re
import httpx

# Imports locais
from database import db
from auth_utils import verify_password, create_access_token

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prompt Flow URL (Variável de Ambiente)
PF_ENDPOINT_URL = os.getenv("PF_ENDPOINT_URL", "https://civic-flow-api.azurewebsites.net/score")

# --- Modelos de Dados ---
class UserSignup(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    email: EmailStr  # Valida se tem @, domínio, etc.
    password: str = Field(..., min_length=8, description="Senha")

    # Validação de força da senha (Letra, Número e Especial)
    @validator('password')
    def validate_password_strength(cls, v):
        # Regex: Pelo menos 1 maiúscula [A-Z], 1 minúscula [a-z], 1 número [0-9]
        if not re.search(r'[A-Z]', v):
            raise ValueError('A senha precisa ter pelo menos uma letra maiúscula')
        if not re.search(r'[a-z]', v):
            raise ValueError('A senha precisa ter pelo menos uma letra minúscula')
        if not re.search(r'[0-9]', v):
            raise ValueError('A senha precisa ter pelo menos um número')
        return v

class UserLogin(BaseModel):
    email: str
    password: str

class ChatRequest(BaseModel):
    message: str
    session_id: str

# --- Endpoints de Auth ---

@app.post("/signup")
async def signup(user: UserSignup):
    new_user = db.create_user(user.name, user.email, user.password)
    if not new_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    token = create_access_token({"sub": new_user["email"]})
    return {"access_token": token, "user_name": new_user["name"]}

@app.post("/signin")
async def signin(user: UserLogin):
    db_user = db.get_user_by_email(user.email)
    if not db_user or not verify_password(user.password, db_user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": db_user["email"]})
    return {"access_token": token, "user_name": db_user["name"]}

# --- Endpoint de Chat (Com Persistência) ---

@app.post("/chat")
async def chat(req: ChatRequest):
    # 1. Salva mensagem do usuário no Cosmos
    db.save_message(req.session_id, "user", req.message)

    # 2. Chama a IA (Prompt Flow)
    headers = {"Content-Type": "application/json"}
    payload = {
        "user_query": req.message,
        "session_id": req.session_id,
        "user_tier": "default"
    }

    ai_text = "Desculpe, erro na IA."
    
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(PF_ENDPOINT_URL, json=payload, headers=headers, timeout=60)
            if resp.status_code == 200:
                data = resp.json()
                # Tenta extrair a resposta de vários formatos possíveis
                ai_text = data.get("final_response", {}).get("answer") or str(data)
            else:
                ai_text = f"Erro IA: {resp.text}"
    except Exception as e:
        ai_text = f"Erro conexão: {str(e)}"

    # 3. Salva resposta da IA no Cosmos
    db.save_message(req.session_id, "assistant", ai_text)

    return {"final_response": {"answer": ai_text}}

# --- Endpoint de Histórico ---
@app.get("/history/{session_id}")
async def get_chat_history(session_id: str):
    return db.get_history(session_id)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)