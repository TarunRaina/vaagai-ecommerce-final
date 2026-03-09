import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY", "")
model = os.getenv("OPENROUTER_MODEL", "google/gemini-2.0-flash-lite-preview-02-05:free")

url = "https://openrouter.ai/api/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {api_key}",
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "Vaagai Admin Console", 
}

payload = {
    "model": model,
    "messages": [
        {"role": "user", "content": "test"}
    ]
}

response = requests.post(url=url, headers=headers, json=payload)
with open("error.json", "w", encoding="utf-8") as f:
    json.dump(response.json(), f, indent=2)
print("Saved to error.json")
