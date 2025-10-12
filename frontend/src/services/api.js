import axios from "axios";
const API_URL = "http://127.0.0.1:5000/api";
export const getCampaigns = (q='') => axios.get(`${API_URL}/campaigns${q ? '?q=' + encodeURIComponent(q) : ''}`);
export const addCampaign = (data) => axios.post(`${API_URL}/campaigns`, data);
export const updateCampaign = (name, data) => axios.put(`${API_URL}/campaigns/${encodeURIComponent(name)}`, data);
export const deleteCampaign = (name) => axios.delete(`${API_URL}/campaigns/${encodeURIComponent(name)}`);
export const login = (creds) => axios.post(`${API_URL}/login`, creds);
