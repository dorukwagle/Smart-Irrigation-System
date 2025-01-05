from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import joblib

crop_type_encodings = {
    "Coffee": 0,
    "Garden Flowers": 1,
    "Groundnuts": 2,
    "Maize": 3,
    "Paddy": 4,
    "Potato": 5,
    "Pulse": 6,
    "Sugercane": 7,
    "Wheat": 8
}

model = joblib.load("./model/random_forest_model.joblib")

# data_order = ["Crop Type", "Crop Days", "Moisture", "Temperature", "Humidity"]
def get_data(crop_type, crop_days, moisture, temperature, humidity):
    return [[crop_type_encodings[crop_type], crop_days, moisture, temperature, humidity]]

def predict(data):
    prediction = model.predict(data)
    return prediction[0]



class MyServer(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        
        data = json.loads(post_data)
        required_fields = ["crop_type", "crop_days", "moisture", "temperature", "humidity"]
        data_dict = {key: data[key] for key in required_fields}
        
        result = predict(get_data(**data_dict))
        
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"irrigate": int(result)}).encode())

def run_server():
    webServer = HTTPServer(("localhost", 1625), MyServer)
    print("Server started http://localhost:1625")

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Server stopped.")

if __name__ == "__main__":
    run_server()
