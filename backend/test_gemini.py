import requests

api_key = "AQ.Ab8RN6K0PBibECWVSZFDvPNY1_jeCqdk6IO1GwI6adSlNhAuxw"

url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"

data = {
    "contents": [
        {
            "parts": [{"text": "Hello, how are you?"}]
        }
    ]
}

res = requests.post(url, json=data)

print("STATUS:", res.status_code)
print("RESPONSE:", res.text)