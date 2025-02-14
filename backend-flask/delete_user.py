import requests

url = "http://127.0.0.1:5000/delete_user"
data = {"username": "example_user"}

response = requests.delete(url, json=data)

print(response.json())  # Print the server response