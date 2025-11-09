from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient, errors
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


MONGO_URI = os.getenv("MONGO_URI")

client = None
db = None
campaigns_collection = None
users_collection = None

if MONGO_URI:
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        client.server_info()  
        db = client["campaignDB"]
        campaigns_collection = db["campaigns"]
        users_collection = db["users"]
        print(" Connected to MongoDB")
    except errors.ServerSelectionTimeoutError as e:
        print(f" Could not connect to MongoDB: {e}")
else:
    print(" MONGO_URI environment variable is not set!")


def serialize_campaign(doc):
    return {
        "Campaign Name": doc.get("Campaign Name"),
        "Client Name": doc.get("Client Name"),
        "Start Date": doc.get("Start Date"),
        "Status": doc.get("Status", "Active")
    }

@app.route("/")
def index():
    return jsonify({"message": "Service is running!"})


@app.route("/api/campaigns", methods=["GET"])
def get_campaigns():
    if not campaigns_collection:
        return jsonify({"error": "Database not connected"}), 500
    q = request.args.get("q", "")
    docs = list(campaigns_collection.find({}))
    results = [serialize_campaign(d) for d in docs]

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
    if not campaigns_collection:
        return jsonify({"error": "Database not connected"}), 500
    data = request.json
    if not data.get("Campaign Name"):
        return jsonify({"error": "Campaign Name required"}), 400
    campaigns_collection.insert_one({
        "Campaign Name": data.get("Campaign Name"),
        "Client Name": data.get("Client Name"),
        "Start Date": data.get("Start Date"),
        "Status": data.get("Status", "Active")
    })
    return jsonify({"message": "Campaign added!"}), 201

@app.route("/api/campaigns/<string:name>", methods=["PUT"])
def update_campaign(name):
    if not campaigns_collection:
        return jsonify({"error": "Database not connected"}), 500
    data = request.json
    result = campaigns_collection.update_one({"Campaign Name": name}, {"$set": data})
    if result.modified_count == 0:
        return jsonify({"message": "No changes made"}), 200
    return jsonify({"message": "Updated successfully"})

@app.route("/api/campaigns/<string:name>", methods=["DELETE"])
def delete_campaign(name):
    if not campaigns_collection:
        return jsonify({"error": "Database not connected"}), 500
    campaigns_collection.delete_one({"Campaign Name": name})
    return jsonify({"message": "Deleted successfully"})


if users_collection:
    if not users_collection.find_one({"username": "admin"}):
        users_collection.insert_one({
            "username": "admin",
            "password": generate_password_hash("1234")
        })
        print("Admin user created in MongoDB")

@app.route("/api/login", methods=["POST"])
def login():
    if not users_collection:
        return jsonify({"error": "Database not connected"}), 500
    data = request.json or {}
    username = data.get("username")
    password = data.get("password")

    user = users_collection.find_one({"username": username})
    if user and check_password_hash(user["password"], password):
        return jsonify({"success": True})
    return jsonify({"success": False}), 401


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug_mode = os.environ.get("FLASK_DEBUG", "False").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug_mode)
