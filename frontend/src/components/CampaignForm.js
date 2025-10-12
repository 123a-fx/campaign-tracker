import React, { useState } from 'react';
import { addCampaign } from '../services/api';

export default function CampaignForm({ onAdded }) {
  const [form, setForm] = useState({
    "Campaign Name": "",
    "Client Name": "",
    "Start Date": "",
    "Status": "Active"
  });

  const submit = async (e) => {
    e.preventDefault();
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
      alert("Failed to add campaign");
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h3>Add Campaign</h3>
      <input
        value={form["Campaign Name"]}
        placeholder="Campaign Name"
        onChange={e => setForm({ ...form, "Campaign Name": e.target.value })}
        required
      />
      <input
        value={form["Client Name"]}
        placeholder="Client Name"
        onChange={e => setForm({ ...form, "Client Name": e.target.value })}
      />
      <input
        value={form["Start Date"]}
        placeholder="Start Date (YYYY-MM-DD)"
        onChange={e => setForm({ ...form, "Start Date": e.target.value })}
      />
      <select
        value={form.Status}
        onChange={e => setForm({ ...form, Status: e.target.value })}
      >
        <option>Active</option>
        <option>Paused</option>
        <option>Completed</option>
      </select>
      <button className="btn-primary" type="submit">Add Campaign</button>
    </form>
  );
}
