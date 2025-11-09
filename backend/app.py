from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
import os


load_dotenv()


app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "*"}})


MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client["campaignDB"]
collection = db["campaigns"]


def serialize(doc):
    return {
        "Campaign Name": doc.get("Campaign Name"),
        "Client Name": doc.get("Client Name"),
        "Start Date": doc.get("Start Date"),
        "Status": doc.get("Status", "Active")
    }

@app.route("/api/campaigns", methods=["GET"])
def get_campaigns():
    q = request.args.get("q", "")
    docs = list(collection.find({}))
    results = [serialize(d) for d in docs]
    if q:
        q_lower = q.lower()
        results = [
            r for r in results
            if q_lower in (r.get("Campaign Name") or "").lower()
            or q_lower in (r.get("Client Name") or "").lower()
        ]
    return jsonify(results)

@app.route("/api/campaigns", methods=["POST"])
def add_campaign():
    data = request.json
    if not data.get("Campaign Name"):
        return jsonify({"error": "Campaign Name required"}), 400
    collection.insert_one({
        "Campaign Name": data.get("Campaign Name"),
        "Client Name": data.get("Client Name"),
        "Start Date": data.get("Start Date"),
        "Status": data.get("Status", "Active")
    })
    return jsonify({"message": "Campaign added!"}), 201

@app.route("/api/campaigns/<string:name>", methods=["PUT"])
def update_campaign(name):
    data = request.json
    result = collection.update_one({"Campaign Name": name}, {"$set": data})
    if result.modified_count == 0:
        return jsonify({"message": "No changes made"}), 200
    return jsonify({"message": "Updated successfully"})

@app.route("/api/campaigns/<string:name>", methods=["DELETE"])
def delete_campaign(name):
    collection.delete_one({"Campaign Name": name})
    return jsonify({"message": "Deleted successfully"})


users_collection = db["users"]


if not users_collection.find_one({"username": "admin"}):
    users_collection.insert_one({
        "username": "admin",
        "password": generate_password_hash("1234")
    })
    print("Admin user created in MongoDB")

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json or {}
    username = data.get("username")
    password = data.get("password")

    user = users_collection.find_one({"username": username})
    if user and check_password_hash(user["password"], password):
        return jsonify({"success": True})
    return jsonify({"success": False}), 401

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)

