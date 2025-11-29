# mock_rag_retriever.py (Nó Python no Prompt Flow)

from promptflow import tool
import json

@tool
def mock_rag_retriever(intent: str, entities: dict, original_query: str, session_id: str) -> dict:
    """
    Mock do RAG - Retorna chunks pré-definidos baseados no candidato e tópico
    """
    
    # Base de dados mockada (você expande conforme necessário)
    MOCK_DATABASE = {
        "Maria Silva": {
            "educacao": [
                {
                    "chunk_id": "chunk_001",
                    "content": "A proposta de reforma educacional da Maria Silva estabelece tres pilares fundamentais: valorizacao dos professores atraves de aumento salarial de 15%, expansao do acesso a educacao infantil para criancas de 0 a 5 anos, e investimento massivo em infraestrutura tecnologica nas escolas publicas.",
                    "page_number": 5,
                    "section_title": "Politica de Educacao",
                    "candidate": "Maria Silva",
                    "document_type": "proposta",
                    "document_id": "doc_maria_2024",
                    "relevance_score": 0.92
                },
                {
                    "chunk_id": "chunk_002",
                    "content": "O orcamento destinado a educacao sera aumentado em 20% nos proximos 4 anos, com foco especial em regioes carentes. A meta e reduzir a evasao escolar de 15% para 8% ate 2028.",
                    "page_number": 6,
                    "section_title": "Orcamento Educacional",
                    "candidate": "Maria Silva",
                    "document_type": "proposta",
                    "document_id": "doc_maria_2024",
                    "relevance_score": 0.87
                }
            ],
            "saude": [
                {
                    "chunk_id": "chunk_ms_001",
                    "content": "Maria Silva propoe cobertura universal de saude, com acesso gratuito a servicos basicos para toda a populacao. Expansao de 200 postos de saude em areas carentes.",
                    "page_number": 10,
                    "section_title": "Politica de Saude",
                    "candidate": "Maria Silva",
                    "document_type": "proposta",
                    "document_id": "doc_maria_2024",
                    "relevance_score": 0.91
                }
            ]
        },
        "Joao Pereira": {
            "saude": [
                {
                    "chunk_id": "chunk_jp_001",
                    "content": "Joao Pereira defende modelo de parceria publico-privada na saude, com subsidios governamentais para planos privados de baixa renda. Modernizacao de hospitais publicos atraves de investimento privado.",
                    "page_number": 15,
                    "section_title": "Politica de Saude",
                    "candidate": "Joao Pereira",
                    "document_type": "proposta",
                    "document_id": "doc_joao_2024",
                    "relevance_score": 0.89
                }
            ],
            "educacao": [
                {
                    "chunk_id": "chunk_jp_002",
                    "content": "Joao Pereira propoe vouchers educacionais para familias de baixa renda escolherem escolas particulares, alem de incentivos fiscais para empresas investirem em educacao tecnica.",
                    "page_number": 8,
                    "section_title": "Politica Educacional",
                    "candidate": "Joao Pereira",
                    "document_type": "proposta",
                    "document_id": "doc_joao_2024",
                    "relevance_score": 0.88
                }
            ]
        }
    }
    
    # Extrai candidatos e tópico das entities
    candidate_names = entities.get("candidate_names", [])
    policy_topic = entities.get("policy_topic", "").lower()
    
    # Se for comparação, busca para múltiplos candidatos
    if intent == "candidate_comparison":
        retrieved_chunks = {}
        for candidate in candidate_names:
            if candidate in MOCK_DATABASE and policy_topic in MOCK_DATABASE[candidate]:
                retrieved_chunks[candidate] = MOCK_DATABASE[candidate][policy_topic]
            else:
                retrieved_chunks[candidate] = []
        
        return {
            "intent": intent,
            "entities": entities,
            "original_query": original_query,
            "session_id": session_id,
            "retrieved_chunks": retrieved_chunks,
            "total_chunks_found": sum(len(chunks) for chunks in retrieved_chunks.values())
        }
    
    # Se for query simples, busca para um candidato
    else:
        retrieved_chunks = []
        if candidate_names and candidate_names[0] in MOCK_DATABASE:
            candidate = candidate_names[0]
            if policy_topic in MOCK_DATABASE[candidate]:
                retrieved_chunks = MOCK_DATABASE[candidate][policy_topic]
        
        return {
            "intent": intent,
            "entities": entities,
            "original_query": original_query,
            "session_id": session_id,
            "retrieved_chunks": retrieved_chunks,
            "total_chunks_found": len(retrieved_chunks)
        }