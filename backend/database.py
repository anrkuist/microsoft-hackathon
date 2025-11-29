import os
import uuid
from azure.cosmos import CosmosClient, PartitionKey
from auth_utils import get_password_hash

# Pega credenciais das variáveis de ambiente (Azure App Service)
URL = os.environ.get("AZURE_COSMOS_ENDPOINT")
KEY = os.environ.get("AZURE_COSMOS_KEY")
DB_NAME = "CitizenAppDB"

class DatabaseManager:
    def __init__(self):
        if not URL or not KEY:
            print("⚠️ AVISO: Cosmos DB não configurado. Auth falhará.")
            self.users = None
            self.history = None
            return

        # Conecta ao Cosmos
        self.client = CosmosClient(URL, credential=KEY)
        self.db = self.client.create_database_if_not_exists(id=DB_NAME)

        # Cria Container de Usuários (Partição: email)
        self.users = self.db.create_container_if_not_exists(
            id="Users",
            partition_key=PartitionKey(path="/email")
        )

        # Cria Container de Histórico (Partição: session_id)
        self.history = self.db.create_container_if_not_exists(
            id="ChatHistory",
            partition_key=PartitionKey(path="/session_id")
        )

    # --- USUÁRIOS ---
    def create_user(self, name, email, password):
        # Verifica se já existe
        existing = list(self.users.query_items(
            query="SELECT * FROM c WHERE c.email=@email",
            parameters=[{"name": "@email", "value": email}],
            enable_cross_partition_query=True
        ))
        if existing:
            return None # Email já cadastrado

        user_data = {
            "id": str(uuid.uuid4()),
            "email": email,
            "name": name,
            "password_hash": get_password_hash(password),
            "created_at": str(datetime.utcnow())
        }
        self.users.create_item(body=user_data)
        return user_data

    def get_user_by_email(self, email):
        items = list(self.users.query_items(
            query="SELECT * FROM c WHERE c.email=@email",
            parameters=[{"name": "@email", "value": email}],
            enable_cross_partition_query=True
        ))
        return items[0] if items else None

    # --- HISTÓRICO ---
    def save_message(self, session_id, role, content):
        msg = {
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "role": role, # "user" ou "assistant"
            "content": content,
            "timestamp": str(datetime.utcnow())
        }
        self.history.create_item(body=msg)

    def get_history(self, session_id):
        # Pega mensagens ordenadas por tempo
        return list(self.history.query_items(
            query="SELECT * FROM c WHERE c.session_id=@sid ORDER BY c.timestamp ASC",
            parameters=[{"name": "@sid", "value": session_id}]
        ))

from datetime import datetime
db = DatabaseManager()