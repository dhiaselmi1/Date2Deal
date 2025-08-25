import requests

url = "http://127.0.0.1:5000/run-orchestrator"
data = {
    "company_name": "NovaConnect",
    "region": "Paris"
}

response = requests.post(url, json=data)
print(response.status_code)
print(response.json())
