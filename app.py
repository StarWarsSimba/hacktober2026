# Import Flask to create the web app, jsonify to return JSON, and
# send_from_directory to serve the HTML page.
from flask import Flask, jsonify, send_from_directory

# Serve files from the static folder directly from the site root.
app = Flask(__name__, static_folder="static", static_url_path="")

# Show the main HTML page when someone visits the site root.
@app.get("/")
def index():
    return send_from_directory("static", "index.html")

# Provide a small API endpoint that returns a greeting as JSON.
@app.get("/api/hello")
def hello():
    return jsonify(message="Hello from Python!")

# Start the Flask development server when this file is run directly.
if __name__ == "__main__":
    app.run(debug=True, port=8000)