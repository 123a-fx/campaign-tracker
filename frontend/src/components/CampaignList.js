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

  // set campaign status (Active, Paused, Completed)
  const setStatus = async (name, status) => {
    await updateCampaign(name, { Status: status });
    onRefetch && onRefetch();
  };

  // delete campaign
  const remove = async (name) => {
    if (!window.confirm("Delete campaign?")) return;
    await deleteCampaign(name);
    onRefetch && onRefetch();
  };

  // start editing
  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setUpdatedCampaign({
      "Campaign Name": campaign["Campaign Name"] || "",
      "Client Name": campaign["Client Name"] || "",
      "Start Date": campaign["Start Date"] || "",
      Status: campaign["Status"] || "",
    });
  };

  // handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCampaign((prev) => ({ ...prev, [name]: value }));
  };

  // save updated campaign
  const handleUpdate = async () => {
    if (!editingCampaign) return;

    await updateCampaign(editingCampaign["Campaign Name"], updatedCampaign);
    alert("Campaign updated successfully!");
    setEditingCampaign(null);
    onRefetch && onRefetch();
  };

  return (
    <div className="card">
      <h3>Campaigns</h3>

      <table>
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
              <td className="actions">
                <button
                  onClick={() => setStatus(c["Campaign Name"], "Active")}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatus(c["Campaign Name"], "Paused")}
                >
                  Pause
                </button>
                <button
                  onClick={() =>
                    setStatus(c["Campaign Name"], "Completed")
                  }
                >
                  Complete
                </button>
                <button onClick={() => handleEdit(c)}>Update</button>
                <button onClick={() => remove(c["Campaign Name"])}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit form appears below the table */}
      {editingCampaign && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "30px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              backgroundColor: "#f0f7ff",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              border: "2px solid #007bff",
            }}
          >
            <h3
              style={{
                color: "#004aad",
                marginBottom: "18px",
                textAlign: "center",
              }}
            >
              ✏️ Update Campaign:{" "}
              <span style={{ color: "#000" }}>
                {editingCampaign["Campaign Name"]}
              </span>
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <label>
                <strong>Campaign Name:</strong>
                <input
                  type="text"
                  name="Campaign Name"
                  value={updatedCampaign["Campaign Name"]}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              </label>

              <label>
                <strong>Client Name:</strong>
                <input
                  type="text"
                  name="Client Name"
                  value={updatedCampaign["Client Name"]}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              </label>

              <label>
                <strong>Start Date:</strong>
                <input
                  type="date"
                  name="Start Date"
                  value={updatedCampaign["Start Date"]}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              </label>

              <label>
                <strong>Status:</strong>
                <select
                  name="Status"
                  value={updatedCampaign["Status"]}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Completed">Completed</option>
                </select>
              </label>

              <div
                style={{
                  marginTop: "15px",
                  display: "flex",
                  justifyContent: "center",
                  gap: "12px",
                }}
              >
                <button
                  onClick={handleUpdate}
                  style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    padding: "8px 14px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  💾 Save Changes
                </button>
                <button
                  onClick={() => setEditingCampaign(null)}
                  style={{
                    backgroundColor: "#ccc",
                    color: "black",
                    padding: "8px 14px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  ✖ Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
