import React, { useEffect, useState } from 'react';
import CampaignForm from './components/CampaignForm';
import CampaignList from './components/CampaignList';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { getCampaigns } from './services/api';

export default function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [q, setQ] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const fetchData = async () => {
    const res = await getCampaigns(q);
    setCampaigns(res.data || []);
  };

  useEffect(()=>{ fetchData(); }, [refreshFlag, q]);

  if(!loggedIn){
    return (
      <div className="container">
        <header><h1>Campaign Tracker</h1></header>
        <Login onSuccess={()=>setLoggedIn(true)} />
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <h1>Campaign Tracker</h1>
        <div>
          <input className="search" placeholder="Search campaigns..." value={q} onChange={e=>setQ(e.target.value)} />
          <button onClick={()=>{ setRefreshFlag(f=>f+1) }}>Refresh</button>
        </div>
      </header>

      <Dashboard campaigns={campaigns} />

      <div style={{display:'grid', gridTemplateColumns: '1fr 2fr', gap: 12}}>
        <CampaignForm onAdded={()=>setRefreshFlag(f=>f+1)} />
        <CampaignList campaigns={campaigns} onRefetch={()=>setRefreshFlag(f=>f+1)} />
      </div>
    </div>
  );
}
