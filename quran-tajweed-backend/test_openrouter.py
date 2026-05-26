import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

def test_reasoning():
    api_key = os.getenv("OPENROUTER_API_KEY")
    url = "https://openrouter.ai/api/v1/chat/completions"
    
    payload = {
        "model": "google/gemma-2-9b-it:free",
        "messages": [
            {
                "role": "user",
                "content": "How many r's are in the word 'strawberry'?"
            }
        ],
        "reasoning": {"enabled": True}
    }

    print(f"Testing OpenRouter with Key: {api_key[:10]}...")
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=30)
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            data = resp.json()
            message = data['choices'][0]['message']
            content = message.get('content', 'No content')
            reasoning = message.get('reasoning_details', 'No reasoning details (might be interleaved)')
            
            print("\nAssistant Response:", content)
            print("\nReasoning Info:", str(reasoning)[:300] + "...")
        else:
            print(f"Error Body: {resp.text}")
    except Exception as e:
        print(f"Test Failed: {e}")

if __name__ == "__main__":
    test_reasoning()
创新创业
