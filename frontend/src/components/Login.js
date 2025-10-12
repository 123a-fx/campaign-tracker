import React, { useState } from "react";
import { login } from "../services/api";

export default function Login({ onSuccess }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username: u, password: p });
      if (res.data && res.data.success) {
        onSuccess && onSuccess();
      } else {
        alert("Invalid credentials ");
      }
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "lightgrey", 
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <form
        className="card"
        onSubmit={submit}
        style={{
          backgroundColor: "white",
          padding: "40px 50px",
          borderRadius: "15px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#004aad",
            marginBottom: "25px",
            fontWeight: "600",
          }}
        >
          🚀 Campaign Tracker Login
        </h2>

        <input
          placeholder="Username"
          value={u}
          onChange={(e) => setU(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
            outline: "none",
          }}
        />

        <input
          placeholder="Password"
          type="password"
          value={p}
          onChange={(e) => setP(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
            outline: "none",
          }}
        />

        <button
          className="btn-primary"
          type="submit"
          style={{
            width: "100%",
            backgroundColor: "lightblue",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          
        >
          Login
        </button>

        <p style={{ marginTop: "20px", color: "#666", fontSize: "14px" }}>
          
        </p>
      </form>
    </div>
  );
}
