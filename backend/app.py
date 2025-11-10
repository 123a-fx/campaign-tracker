from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os

app = Flask(__name__)
CORS(app)

# --- MongoDB Connection ---
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://127.0.0.1:27017/campaign_tracker")
client = MongoClient(MONGO_URI)
db = client["campaign_tracker"]
campaigns_collection = db["campaigns"]
users_collection = db["users"]

# --- Routes ---
@app.route("/")
def home():
    return jsonify({"message": "Campaign Tracker API is running! Use /api/campaigns or /api/login"})

# --- LOGIN ---
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = users_collection.find_one({"username": username, "password": password})
    if user:
        return jsonify({"success": True, "message": "Login successful"})
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

# --- GET CAMPAIGNS ---
@app.route("/api/campaigns", methods=["GET"])
def get_campaigns():
    q = request.args.get("q", "")
    campaigns = list(campaigns_collection.find({"Campaign Name": {"$regex": q, "$options": "i"}}))
    for c in campaigns:
        c["_id"] = str(c["_id"])
    return jsonify(campaigns)

# --- ADD CAMPAIGN ---
@app.route("/api/campaigns", methods=["POST"])
def add_campaign():
    data = request.get_json()
    campaigns_collection.insert_one(data)
    return jsonify({"message": "Campaign added successfully"})

# --- UPDATE CAMPAIGN ---
@app.route("/api/campaigns/<string:name>", methods=["PUT"])
def update_campaign(name):
    data = request.get_json()
    result = campaigns_collection.update_one({"Campaign Name": name}, {"$set": data})
    if result.matched_count > 0:
        return jsonify({"message": "Campaign updated successfully"})
    else:
        return jsonify({"error": "Campaign not found"}), 404

# --- DELETE CAMPAIGN ---
@app.route("/api/campaigns/<string:name>", methods=["DELETE"])
def delete_campaign(name):
    result = campaigns_collection.delete_one({"Campaign Name": name})
    if result.deleted_count > 0:
        return jsonify({"message": "Campaign deleted successfully"})
    else:
        return jsonify({"error": "Campaign not found"}), 404

# --- SAFE INITIALIZATION ---
def init_admin():
    """Create a default admin user if not present."""
    try:
        if not users_collection.find_one({"username": "admin"}):
            users_collection.insert_one({"username": "admin", "password": "admin"})
            print("✅ Default admin user created (username: admin, password: admin)")
        else:
            print("ℹ️ Admin user already exists.")
    except Exception as e:
        print("⚠️ Skipping admin creation:", e)

# --- MAIN ENTRY ---
if __name__ == "__main__":
    init_admin()
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
