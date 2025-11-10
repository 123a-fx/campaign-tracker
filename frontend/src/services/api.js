import axios from "axios";

// ✅ FIXED: No leading space, and added /api prefix
const API_URL = "https://campaign-tracker1.onrender.com/api";

// ✅ All routes now use correct endpoints
export const getCampaigns = (q = '') =>
  axios.get(`${API_URL}/campaigns${q ? '?q=' + encodeURIComponent(q) : ''}`);

export const addCampaign = (data) =>
  axios.post(`${API_URL}/campaigns`, data);

export const updateCampaign = (name, data) =>
  axios.put(`${API_URL}/campaigns/${encodeURIComponent(name)}`, data);

export const deleteCampaign = (name) =>
  axios.delete(`${API_URL}/campaigns/${encodeURIComponent(name)}`);

export const login = (creds) =>
  axios.post(`${API_URL}/login`, creds);
