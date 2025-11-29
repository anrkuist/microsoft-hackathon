from promptflow.core import tool

@tool
def evaluate_intent(
    predicted_intent: str, 
    expected_intent: str
) -> dict:
    """
    Compara a intenção prevista com a esperada.
    Custo: $0 (Python puro)
    """
    # Normaliza strings
    pred = predicted_intent.lower().strip() if predicted_intent else ""
    exp = expected_intent.lower().strip() if expected_intent else ""
    
    is_match = (pred == exp)
    
    return {
        "intent_accuracy": 1.0 if is_match else 0.0,
        "actual": pred,
        "expected": exp
    }