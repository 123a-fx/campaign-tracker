from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import os
from pathlib import Path

# ----------------------------
# 1️⃣ Load environment variables
# ----------------------------
env_path = Path('.') / '.env'
print(f"🔍 Loading .env from: {env_path.resolve()}")
load_dotenv(dotenv_path=env_path)

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("❌ MONGO_URI environment variable is not set!")

print("✅ MONGO_URI loaded successfully")

# ----------------------------
# 2️⃣ Setup MongoDB Connection
# ----------------------------
client = MongoClient(MONGO_URI)
db = client["campaignDB"]
campaigns_collection = db["campaigns"]
users_collection = db["users"]

# ----------------------------
# 3️⃣ Initialize Flask App
# ----------------------------
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ----------------------------
# 4️⃣ Helper Function
# ----------------------------
def serialize_campaign(doc):
    return {
        "Campaign Name": doc.get("Campaign Name"),
        "Client Name": doc.get("Client Name"),
        "Start Date": doc.get("Start Date"),
        "Status": doc.get("Status", "Active")
    }

# ----------------------------
# 5️⃣ Routes
# ----------------------------
@app.route("/")
def index():
    return "🚀 Campaign Tracker API is running! Use /api/campaigns or /api/login"


# ✅ GET all campaigns
@app.route("/api/campaigns", methods=["GET"])
def get_campaigns():
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


# ✅ POST new campaign
@app.route("/api/campaigns", methods=["POST"])
def add_campaign():
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


# ✅ PUT update campaign
@app.route("/api/campaigns/<string:name>", methods=["PUT"])
def update_campaign(name):
    data = request.json
    result = campaigns_collection.update_one({"Campaign Name": name}, {"$set": data})
    if result.modified_count == 0:
        return jsonify({"message": "No changes made"}), 200
    return jsonify({"message": "Updated successfully"})


# ✅ DELETE campaign
@app.route("/api/campaigns/<string:name>", methods=["DELETE"])
def delete_campaign(name):
    campaigns_collection.delete_one({"Campaign Name": name})
    return jsonify({"message": "Deleted successfully"})


# ✅ Create admin user if not exists
if not users_collection.find_one({"username": "admin"}):
    users_collection.insert_one({
        "username": "admin",
        "password": generate_password_hash("1234")
    })
    print("👤 Admin user created in MongoDB")


# ✅ Login route
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json or {}
    username = data.get("username")
    password = data.get("password")

    user = users_collection.find_one({"username": username})
    if user and check_password_hash(user["password"], password):
        return jsonify({"success": True})
    return jsonify({"success": False}), 401


# ----------------------------
# 6️⃣ Run the Flask App
# ----------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug_mode = os.environ.get("FLASK_DEBUG", "False").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug_mode)
