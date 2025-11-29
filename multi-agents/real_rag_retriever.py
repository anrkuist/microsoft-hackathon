import os
import logging
import warnings
from typing import cast
from promptflow.core import tool
from promptflow.connections import AzureOpenAIConnection, CognitiveSearchConnection
from azure.search.documents import SearchClient
from azure.search.documents.models import VectorizedQuery
from azure.core.credentials import AzureKeyCredential
import openai
import requests

logger = logging.getLogger(__name__)

@tool
def real_rag_retriever(
    original_query: str,
    intent: str,
    entities: dict,
    openai_connection: AzureOpenAIConnection,
    index_name: str,
    search_connection: object = None, # Opcional
    top_k: int = 5
) -> dict:
    """
    RAG real: busca documentos no Azure AI Search usando vetores.
    """

    # 0. Proteção de input
    if not original_query or str(original_query).strip() == "":
        return {
            "intent": intent,
            "entities": entities,
            "original_query": original_query,
            "retrieved_chunks": [],
            "total_chunks_found": 0
        }

    # 1. Resolver credenciais do OpenAI
    openai_api_key = openai_connection.api_key or os.environ.get("AZURE_OPENAI_API_KEY")
    openai_api_base = openai_connection.api_base or os.environ.get("AZURE_OPENAI_ENDPOINT")
    openai_api_version = openai_connection.api_version or os.environ.get("AZURE_OPENAI_API_VERSION", "2024-02-15-preview")

    if not openai_api_key or not openai_api_base:
        raise ValueError("Missing OpenAI connection info.")

    embeddings_deployment = os.environ.get("AZURE_OPENAI_EMBEDDING_DEPLOYMENT", "text-embedding-3-small")

    # 2. Gerar Embeddings (REST ou SDK)
    query_vector = None
    try:
        url = f"{openai_api_base.rstrip('/')}/openai/deployments/{embeddings_deployment}/embeddings?api-version={openai_api_version}"
        headers = {"Content-Type": "application/json", "api-key": openai_api_key}
        payload = {"input": [original_query]}
        
        r = requests.post(url, headers=headers, json=payload, timeout=30)
        r.raise_for_status()
        
        body = r.json().get("body") or r.json()
        items = body.get("data", [])
        if items:
            query_vector = items[0].get("embedding")
    except Exception as e:
        logger.warning(f"Embedding error: {e}")
        # Tenta SDK como fallback
        try:
            client = openai.AzureOpenAI(
                api_key=openai_api_key,
                api_version=openai_api_version,
                azure_endpoint=openai_api_base
            )
            embed_resp = client.embeddings.create(
                model=embeddings_deployment,
                input=[original_query]
            )
            query_vector = embed_resp.data[0].embedding
        except Exception as sdk_e:
            logger.error(f"SDK fallback failed: {sdk_e}")

    # 3. Configurar Search Client (CORREÇÃO DO ERRO)
    # Inicializa variáveis com None para evitar NameError
    conn_endpoint = None
    conn_key = None

    if search_connection:
        conn_endpoint = getattr(search_connection, "api_base", None)
        conn_key = getattr(search_connection, "api_key", None)

    # Usa conexão OU variáveis de ambiente (Fallback)
    search_endpoint = conn_endpoint or os.environ.get("AZURE_SEARCH_ENDPOINT")
    search_key = conn_key or os.environ.get("AZURE_SEARCH_KEY")
    resolved_index = index_name or os.environ.get("AZURE_SEARCH_INDEX")

    if not search_endpoint or not search_key or not resolved_index:
        raise ValueError(f"Missing Azure Search config. Endpoint: {search_endpoint}, Key: {'***' if search_key else 'None'}")

    search_client = SearchClient(
        endpoint=str(search_endpoint),
        index_name=str(resolved_index),
        credential=AzureKeyCredential(str(search_key)),
    )

    # 4. Busca
    try:
        if query_vector:
            vector_query = VectorizedQuery(
                vector=cast(list[float], query_vector),
                k_nearest_neighbors=top_k,
                fields="contentVector"
            )
            results = search_client.search(
                search_text=original_query,
                vector_queries=[vector_query],
                select=["content", "title", "filepath", "url"],
                top=top_k
            )
        else:
            results = search_client.search(
                search_text=original_query,
                select=["content", "title", "filepath", "url"],
                top=top_k
            )
    except Exception as e:  
        logger.error(f"Search failed: {e}")
        return {
            "intent": intent,
            "entities": entities,
            "original_query": original_query,
            "retrieved_chunks": [],
            "error": str(e)
        }

    # 5. Formatar Resultados
    retrieved_chunks = []
    for result in results:
        retrieved_chunks.append({
            "content": result.get("content", ""),
            "source": result.get("title") or result.get("filepath") or "unknown",
            "url": result.get("url"),
            "page_number": result.get("page_number", "N/A"),
            "relevance_score": result.get("@search.score", 0)
        })

    return {
        "intent": intent,
        "entities": entities,
        "original_query": original_query,
        "retrieved_chunks": retrieved_chunks,
        "total_chunks_found": len(retrieved_chunks)
    }