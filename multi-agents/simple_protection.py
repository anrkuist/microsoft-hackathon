from promptflow import tool
from datetime import datetime, timedelta
from typing import Dict
import os

class SimpleProtection:
    """Proteção minimalista para desenvolvimento"""
    
    def __init__(self):
        # Contador simples em memória
        self.requests_today = 0
        self.total_cost_today = 0.0
        self.last_reset = datetime.utcnow().date()
        
        # Limites super simples
        self.MAX_REQUESTS_PER_DAY = int(os.getenv("MAX_REQUESTS_PER_DAY", "200"))
        self.MAX_COST_PER_DAY = float(os.getenv("MAX_COST_PER_DAY", "5.0"))
    
    def check_and_increment(self) -> Dict:
        """Verifica limites e incrementa contador"""
        
        # Reset diário
        today = datetime.utcnow().date()
        if today > self.last_reset:
            self.requests_today = 0
            self.total_cost_today = 0.0
            self.last_reset = today
        
        # Verifica limites
        if self.requests_today >= self.MAX_REQUESTS_PER_DAY:
            return {
                "allowed": False,
                "reason": f"Daily limit reached ({self.MAX_REQUESTS_PER_DAY} requests/day)"
            }
        
        if self.total_cost_today >= self.MAX_COST_PER_DAY:
            return {
                "allowed": False,
                "reason": f"Daily cost limit reached (${self.MAX_COST_PER_DAY}/day)"
            }
        
        # Incrementa
        self.requests_today += 1
        
        return {
            "allowed": True,
            "requests_today": self.requests_today,
            "requests_remaining": self.MAX_REQUESTS_PER_DAY - self.requests_today,
            "cost_today": round(self.total_cost_today, 2),
            "cost_remaining": round(self.MAX_COST_PER_DAY - self.total_cost_today, 2)
        }
    
    def record_cost(self, cost_usd: float):
        """Registra custo"""
        self.total_cost_today += cost_usd
        print(f"💰 Cost: ${cost_usd:.4f} | Today: ${self.total_cost_today:.2f}")


# Instância global
_protection = SimpleProtection()


@tool
def simple_check() -> dict:
    """Tool para Prompt Flow - verifica limites simples"""
    return _protection.check_and_increment()


@tool
def simple_cost_track(total_tokens: int, avg_cost_per_1k: float = 0.006) -> dict:
    """Tool para Prompt Flow - tracking simples de custo"""
    estimated_cost = (total_tokens / 1000) * avg_cost_per_1k
    _protection.record_cost(estimated_cost)
    
    return {
        "tokens": total_tokens,
        "estimated_cost": round(estimated_cost, 4),
        "cost_today": round(_protection.total_cost_today, 2)
    }