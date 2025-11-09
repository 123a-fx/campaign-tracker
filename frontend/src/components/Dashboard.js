import React from 'react';

export default function Dashboard({ campaigns }) {
  const total = campaigns.length;
  const statusCounts = campaigns.reduce((acc, c) => {
    acc[c.Status] = (acc[c.Status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div 
      className="card dashboard" 
      style={{
        display: "flex", 
        gap: "15px", 
        flexWrap: "wrap", 
        padding: "15px",
        marginBottom: "20px",
        backgroundColor: "#f5f7fa",
        borderRadius: "12px"
      }}
    >
      <div className="chip" style={chipStyle}>Total: {total}</div>
      <div className="chip" style={chipStyle}>Active: {statusCounts["Active"] || 0}</div>
      <div className="chip" style={chipStyle}>Paused: {statusCounts["Paused"] || 0}</div>
      <div className="chip" style={chipStyle}>Completed: {statusCounts["Completed"] || 0}</div>
    </div>
  );
}

const chipStyle = {
  backgroundColor: "#004aad",
  color: "#fff",
  padding: "8px 14px",
  borderRadius: "20px",
  fontWeight: "500",
};
