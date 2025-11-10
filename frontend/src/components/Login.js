import React, { useState } from "react";
import { login } from "../services/api";

export default function Login({ onSuccess }) {
  const [creds, setCreds] = useState({ username: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(creds);
      if (res.data.success) {
        alert("Login successful!");
        onSuccess(); // ✅ moves to next page
      } else {
        alert("Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>🚀 Campaign Tracker Login</h3>
      <input
        placeholder="Username"
        value={creds.username}
        onChange={(e) => setCreds({ ...creds, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={creds.password}
        onChange={(e) => setCreds({ ...creds, password: e.target.value })}
      />
      <button className="btn-primary" type="submit">
        Login
      </button>
    </form>
  );
}
