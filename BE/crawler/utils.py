# utils.py
import json
import requests

def send_to_server(articles, endpoint):
    try:
        payload = json.dumps(articles)
        print(f"Sending request to: {endpoint}")
        print(f"Payload: {payload[:500]}...")  # In dữ liệu gửi đi
        headers = {"Content-Type": "application/json"}
        response = requests.post(endpoint, data=payload, headers=headers)
        print(f"Response status: {response.status_code}")
        print(f"Response text: {response.text}")
        if response.status_code == 200 or response.status_code == 201:  # Chấp nhận cả 200 và 201
            print("Data sent successfully")
        else:
            print(f"Failed to send data: {response.status_code}")
    except Exception as e:
        print(f"Error sending data: {e}")