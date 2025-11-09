import React, { useState } from "react";
import { updateCampaign, deleteCampaign } from "../services/api";

export default function CampaignList({ campaigns, onRefetch }) {
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [updatedCampaign, setUpdatedCampaign] = useState({
    "Campaign Name": "",
    "Client Name": "",
    "Start Date": "",
    Status: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setStatus = async (name, status) => {
    setLoading(true);
    setError("");
    try {
      await updateCampaign(name, { Status: status });
      onRefetch && onRefetch();
    } catch {
      setError("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (name) => {
    if (!window.confirm("Delete campaign?")) return;
    setLoading(true);
    setError("");
    try {
      await deleteCampaign(name);
      onRefetch && onRefetch();
    } catch {
      setError("Failed to delete campaign.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setUpdatedCampaign({
      "Campaign Name": campaign["Campaign Name"] || "",
      "Client Name": campaign["Client Name"] || "",
      "Start Date": campaign["Start Date"] || "",
      Status: campaign["Status"] || "",
    });
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCampaign((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!editingCampaign) return;
    setLoading(true);
    setError("");
    try {
      await updateCampaign(editingCampaign["Campaign Name"], updatedCampaign);
      setEditingCampaign(null);
      onRefetch && onRefetch();
    } catch {
      setError("Failed to update campaign.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: "20px", borderRadius: "12px" }}>
      <h3 style={{ marginBottom: "15px", color: "#004aad" }}>Campaigns</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Client</th>
            <th>Start</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c["Campaign Name"]}>
              <td>{c["Campaign Name"]}</td>
              <td>{c["Client Name"]}</td>
              <td>{c["Start Date"]}</td>
              <td>{c.Status}</td>
              <td style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                <button onClick={() => setStatus(c["Campaign Name"], "Active")} disabled={loading}>Active</button>
                <button onClick={() => setStatus(c["Campaign Name"], "Paused")} disabled={loading}>Pause</button>
                <button onClick={() => setStatus(c["Campaign Name"], "Completed")} disabled={loading}>Complete</button>
                <button onClick={() => handleEdit(c)}>Update</button>
                <button onClick={() => remove(c["Campaign Name"])} disabled={loading}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingCampaign && (
        <div style={{ marginTop: "20px" }}>
          <h4 style={{ color: "#004aad" }}>Editing: {editingCampaign["Campaign Name"]}</h4>
          <input
            name="Campaign Name"
            value={updatedCampaign["Campaign Name"]}
            onChange={handleChange}
            placeholder="Campaign Name"
          />
          <input
            name="Client Name"
            value={updatedCampaign["Client Name"]}
            onChange={handleChange}
            placeholder="Client Name"
          />
          <input
            type="date"
            name="Start Date"
            value={updatedCampaign["Start Date"]}
            onChange={handleChange}
          />
          <select name="Status" value={updatedCampaign["Status"]} onChange={handleChange}>
            <option>Active</option>
            <option>Paused</option>
            <option>Completed</option>
          </select>
          <div style={{ marginTop: "10px" }}>
            <button onClick={handleUpdate} disabled={loading}>Save</button>
            <button onClick={() => setEditingCampaign(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
