import axios from "axios";

const API_URL = "https://campaign-tracker1.onrender.com";

export const login = (creds) => axios.post(`${API_URL}/api/login`, creds);
export const getCampaigns = (q='') => axios.get(`${API_URL}/api/campaigns${q ? '?q=' + encodeURIComponent(q) : ''}`);
export const addCampaign = (data) => axios.post(`${API_URL}/api/campaigns`, data);
export const updateCampaign = (name, data) => axios.put(`${API_URL}/api/campaigns/${encodeURIComponent(name)}`, data);
export const deleteCampaign = (name) => axios.delete(`${API_URL}/api/campaigns/${encodeURIComponent(name)}`);
