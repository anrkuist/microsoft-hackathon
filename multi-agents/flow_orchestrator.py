from promptflow import tool

@tool
def route_to_agent_5(intent: str, summary: dict, verification: dict) -> dict:
    """
    Decide se precisa do Agente 5 (Comparison) ou pula direto para Agente 6
    """
    
    if intent == "candidate_comparison":
        # Precisa do Agente 5
        return {
            "needs_comparison": True,
            "intent": intent,
            "summary": summary,
            "verification": verification
        }
    else:
        # Pula Agente 5, vai direto para Agente 6
        return {
            "needs_comparison": False,
            "intent": intent,
            "summary": summary,
            "verification": verification,
            "comparison": None  # Null porque não foi necessário
        }