# Campaign Tracker (Flask + React + MongoDB)

## Overview
Simple web app to add/view/update/delete marketing campaigns.
Frontend: React
Backend: Flask
Database: MongoDB

## Quick start (backend)
1. Create a Python virtualenv and activate it.
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Set environment variable `MONGO_URI` (or edit .env) e.g.
   ```
   MONGO_URI=mongodb://localhost:27017/
   ```
4. Run:
   ```
   python app.py
   ```
Backend will run on http://127.0.0.1:5000

## Quick start (frontend)
1. From `frontend/` run:
   ```
   npm install
   npm start
   ```

   Login with
   Username:admin
   Password:1234
3. The React app expects the Flask API at http://127.0.0.1:5000/api
