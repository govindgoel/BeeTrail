from datetime import datetime

def get_context(domain: str = "beckn.org/farmer", action: str = "on_search") -> dict:
    return {
        "domain": domain,
        "country": "IN",
        "city": "std:080",  # standard Bangalore code or change
        "action": action,
        "core_version": "0.9.4",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

def beckn_response(message: dict, domain: str = "beckn.org/farmer", action: str = "on_search") -> dict:
    return {
        "context": get_context(domain, action),
        "message": message
    }
