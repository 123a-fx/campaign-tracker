import React, { useState } from 'react';
import { addCampaign } from '../services/api';

export default function CampaignForm({ onAdded }) {
  const [form, setForm] = useState({
    "Campaign Name": "",
    "Client Name": "",
    "Start Date": "",
    "Status": "Active"
  });
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); 

  const submit = async (e) => {
    e.preventDefault();
    setError(""); 
    if (!form["Campaign Name"]) {
      setError("Campaign Name is required");
      return;
    }

    setLoading(true);
    try {
      await addCampaign(form);
      setForm({
        "Campaign Name": "",
        "Client Name": "",
        "Start Date": "",
        "Status": "Active"
      });
      onAdded && onAdded();
    } catch (err) {
      setError("Failed to add campaign. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={submit} style={{ padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <h3 style={{ marginBottom: "15px", color: "#004aad" }}>Add Campaign</h3>

      {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

      <input
        value={form["Campaign Name"]}
        placeholder="Campaign Name"
        onChange={e => setForm({ ...form, "Campaign Name": e.target.value })}
        required
        style={{ marginBottom: "10px", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", width: "100%" }}
      />

      <input
        value={form["Client Name"]}
        placeholder="Client Name"
        onChange={e => setForm({ ...form, "Client Name": e.target.value })}
        style={{ marginBottom: "10px", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", width: "100%" }}
      />

      <input
        type="date"
        value={form["Start Date"]}
        onChange={e => setForm({ ...form, "Start Date": e.target.value })}
        style={{ marginBottom: "10px", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", width: "100%" }}
      />

      <select
        value={form.Status}
        onChange={e => setForm({ ...form, Status: e.target.value })}
        style={{ marginBottom: "10px", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", width: "100%" }}
      >
        <option>Active</option>
        <option>Paused</option>
        <option>Completed</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#004aad",
          color: "white",
          fontWeight: "600",
          cursor: "pointer",
          transition: "0.3s"
        }}
        onMouseOver={e => e.target.style.backgroundColor = "#0056b3"}
        onMouseOut={e => e.target.style.backgroundColor = "#004aad"}
      >
        {loading ? "Adding..." : "Add Campaign"}
      </button>
    </form>
  );
}
