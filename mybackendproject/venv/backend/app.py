from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Flask Backend is Connected to React Native!"})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)  # Allow external access
