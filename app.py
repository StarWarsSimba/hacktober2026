from flask import Flask, jsonify, send_from_directory

app = Flask(__name__, static_folder="static", static_url_path="")

@app.get("/")
def index():
    return send_from_directory("static", "index.html")

@app.get("/api/hello")
def hello():
    return jsonify(message="Hello from Python!")

if __name__ == "__main__":
    app.run(debug=True, port=8000)