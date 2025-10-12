import React from 'react';
export default function Dashboard({ campaigns }) {
  const total = campaigns.length;
  const active = campaigns.filter(c=>c.Status==="Active").length;
  const paused = campaigns.filter(c=>c.Status==="Paused").length;
  const completed = campaigns.filter(c=>c.Status==="Completed").length;
  return (
    <div className="card dashboard">
      <div className="chip">Total: {total}</div>
      <div className="chip">Active: {active}</div>
      <div className="chip">Paused: {paused}</div>
      <div className="chip">Completed: {completed}</div>
    </div>
  );
}
