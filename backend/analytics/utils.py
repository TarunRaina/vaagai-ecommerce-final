import requests
import os
import json
from dotenv import load_dotenv

load_dotenv()

def get_ai_analytics_summary(data):
    api_key = os.getenv("OPENROUTER_API_KEY", "")
    model = os.getenv("OPENROUTER_MODEL", "google/gemini-2.0-flash-lite-preview-02-05:free")

    if not api_key or api_key == "YOUR_OPENROUTER_API_KEY":
        return "Intelligence requires configuration. Please configure OPENROUTER_API_KEY in the backend .env file."
    
    prompt = f"""
    You are the Artisanal Intelligence Assistant for Vaagai Academy & Artifacts, a luxury e-commerce brand.
    
    Current Snapshot:
    - Revenue: INR {data['kpis']['total_revenue']:,}
    - Orders: {data['kpis']['total_orders']}
    - Clients: {data['kpis']['total_customers']}
    - B2B Partners: {data['kpis']['b2b_partners']}
    - Avg Rating: {data['kpis']['avg_rating']}
    
    Context: We are in early-stage operations. If sales are zero, focus your strategic suggestion on client acquisition and brand positioning.
    
    Task: Provide a concise, executive-level summary. Mention one strength (e.g., growing client base) and one strategic action. 
    Use a professional, "luxury brand" tone. Keep it under 150 words. No markdown headers.
    """
    
    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "Vaagai Admin Console", 
            },
            json={
                "model": model,
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            },
            timeout=30
        )
        
        if response.status_code == 200:
            return response.json()['choices'][0]['message']['content']
        else:
            return f"Strategic engine temporarily unavailable (Status: {response.status_code}). Please review raw data below."
    except Exception as e:
        return f"Intelligence synthesis interrupted: {str(e)}. Proceeding with manual data review."
