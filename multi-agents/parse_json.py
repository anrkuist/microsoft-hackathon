from promptflow import tool
import json
import re

@tool
def parse_json_output(llm_output: str) -> dict:
    """
    Parser exclusivo para o policy_summarizer:
    - SEMPRE retorna "summary" como objeto válido
    - Nunca retorna summary=None
    - Nunca cria "verification"
    - Evita JSON truncado gerar null
    """

    # Estrutura segura para fallback
    safe_summary = {
        "summary_bullets": [],
        "explanation": "Não consegui interpretar completamente os dados retornados. Você deseja tentar reformular a pergunta?",
        "complexity_level": "simples",
        "not_found": True,
        "documentation_url": None
    }

    fallback = {
        "intent": None,
        "entities": None,
        "original_query": None,
        "retrieved_chunks": None,
        "summary": safe_summary
    }

    if not llm_output:
        fallback["error"] = "empty_output"
        fallback["raw_output"] = llm_output
        return fallback

    # Remove markdown fences
    text = re.sub(r"```[a-zA-Z0-9]*", "", llm_output).strip()

    # Normalize JSON
    text = text.replace("None", "null")
    text = text.replace("True", "true").replace("False", "false")

    # Fix single quoted keys
    text = re.sub(r"'([^']+)':", r'"\1":', text)
    text = re.sub(r": '([^']+)'", r': "\1"', text)

    # Fix accidental merges
    text = text.replace("}\n{", "}, {")

    # Attempt parse
    try:
        parsed = json.loads(text)

        # Guarantee summary ALWAYS exists and is an object
        if "summary" not in parsed or parsed["summary"] is None:
            parsed["summary"] = safe_summary

        return parsed

    except Exception as e:
        # Safe fallback
        fallback["error"] = str(e)
        fallback["cleaned_text_attempt"] = text
        fallback["raw_output"] = llm_output
        return fallback
