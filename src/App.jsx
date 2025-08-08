import React, { useEffect, useMemo, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const VENDOR_KEY = 'hsam_vendors';
const APP_KEY = 'hsam_apps';

function useList(key) {
  const [list, setList] = useState([]);
  useEffect(() => {
    const cached = localStorage.getItem(key);
    if (cached) setList(JSON.parse(cached));
  }, [key]);
  useEffect(() => localStorage.setItem(key, JSON.stringify(list)), [key, list]);
  return [list, setList];
}

export default function App() {
  const [view, setView] = useState('dashboard');
  const [vendors, setVendors] = useList(VENDOR_KEY);
  const [apps, setApps] = useList(APP_KEY);

  function loadSampleData() {
    const seedVendors = [
      { name: "Adobe", licences: 15, monthlySpend: 750 },
      { name: "Zoom", licences: 30, monthlySpend: 360 },
      { name: "Slack", licences: 25, monthlySpend: 500 },
      { name: "Atlassian", licences: 12, monthlySpend: 144 },
      { name: "AWS", licences: 8, monthlySpend: 450 },
      { name: "Dropbox", licences: 20, monthlySpend: 240 },
      { name: "Canva", licences: 5, monthlySpend: 55 },
      { name: "HubSpot", licences: 6, monthlySpend: 252 }
    ];
    const seedApps = [
      { name: "Adobe Creative Cloud", vendor: "Adobe", category: "Design", owner: "Marketing", monthlyCost: 50 },
      { name: "Zoom Pro", vendor: "Zoom", category: "Meetings", owner: "Ops", monthlyCost: 12 },
      { name: "Slack Standard", vendor: "Slack", category: "Comms", owner: "All", monthlyCost: 6.25 }
    ];
    setVendors(seedVendors);
    setApps(seedApps);
  }

  function resetDemo() {
    localStorage.removeItem(VENDOR_KEY);
    localStorage.removeItem(APP_KEY);
    location.reload();
  }

  const totals = useMemo(() => ({
    totalVendors: vendors.length,
    totalApps: apps.length,
    monthlySpend:
      vendors.reduce((s,v)=>s+Number(v.monthlySpend||0),0) +
      apps.reduce((s,a)=>s+Number(a.monthlyCost||0),0)
  }), [vendors, apps]);

  const pieData = useMemo(() => ({
    labels: vendors.map(v=>v.name),
    datasets: [{ data: vendors.map(v=>v.licences),
      backgroundColor: ['#4FBAE0','#66A181','#ADA6DD','#7C537C','#284B5A','#8bb3c9','#c6d3e1','#17293F'] }]
  }), [vendors]);

  const barData = useMemo(() => ({
    labels: vendors.map(v=>v.name),
    datasets: [{ label:'£ per month', data: vendors.map(v=>Number(v.monthlySpend||0)), backgroundColor:'#17293F' }]
  }), [vendors]);

  const navBtn = (active)=>({ background: active ? '#4FBAE0' : 'transparent',
    border:'1px solid rgba(255,255,255,0.5)', color:'#fff', padding:'6px 10px', borderRadius:6, cursor:'pointer' });
  const card = { background:'#fff', borderRadius:8, padding:16 };
  const th = { textAlign:'left', padding:'8px 6px', borderBottom:'1px solid #e5e7eb' };
  const td = { padding:'8px 6px', borderBottom:'1px solid #f2f2f2' };
  const tdC = { ...td, textAlign:'center' };
  const input = { width:'100%', padding:'8px 10px', border:'1px solid #e5e7eb', borderRadius:6, fontSize:14 };
  const primaryBtn = { background:'#17293F', color:'#fff', border:'none', padding:'10px 12px', borderRadius:6, cursor:'pointer' };
  const delBtn = { background:'#7C537C', color:'#fff', border:'none', padding:'6px 10px', borderRadius:6, cursor:'pointer' };

  return (
    <>
      <header style={{ background:'#17293F', color:'#fff', padding:'12px 16px', display:'flex', alignItems:'center', gap:12 }}>
        <img src="/logo.png" alt="High Steep Logo" style={{height:40}} />
        <h1 style={{margin:0}}>High Steep Application Manager</h1>
        <div style={{ marginLeft:'auto', display:'flex', gap:12 }}>
          <button onClick={() => setView('dashboard')} style={navBtn(view==='dashboard')}>Dashboard</button>
          <button onClick={() => setView('vendors')} style={navBtn(view==='vendors')}>Vendors</button>
          <button onClick={() => setView('apps')} style={navBtn(view==='apps')}>Applications</button>
          <button onClick={resetDemo} style={navBtn(false)}>Reset Demo Data</button>
        </div>
      </header>

      <div style={{ padding:'24px' }}>
        <div style={{ fontSize:12, opacity:0.7, marginBottom:8 }}>Demo Mode: all data is fictional</div>

        {view === 'dashboard' && (
          <>
            <div style={card}>
              <h2 style={{margin:'0 0 8px 0'}}>At a glance</h2>
              <div style={{display:'flex', gap:16, flexWrap:'wrap', alignItems:'center'}}>
                <Badge label="Total Vendors" value={totals.totalVendors} />
                <Badge label="Total Applications" value={totals.totalApps} />
                <Badge label="Monthly Spend" value={`£${totals.monthlySpend.toLocaleString()}`} />
                <button onClick={loadSampleData} style={{...primaryBtn, marginLeft:'auto'}}>Load Sample Data</button>
              </div>
            </div>

            <div style={{ display:'flex', gap:'2rem', flexWrap:'wrap' }}>
              <div style={{ flex:'1 1 420px', minWidth:320 }}>
                <h3>Licence Allocation</h3>
                <Pie data={pieData} />
              </div>
              <div style={{ flex:'1 1 420px', minWidth:320 }}>
                <h3>Monthly Spend (Vendors)</h3>
                <Bar data={barData} />
              </div>
            </div>
          </>
        )}

        {view === 'vendors' && <VendorsView {...{vendors, setVendors, th, td, tdC, input, primaryBtn, delBtn, card}} />}
        {view === 'apps' && <AppsView {...{apps, setApps, vendors, th, td, tdC, input, primaryBtn, delBtn, card}} />}
      </div>
    </>
  );
}

function VendorsView({vendors, setVendors, th, td, tdC, input, primaryBtn, delBtn, card}) {
  const [form, setForm] = useState({ name:'', licences:'', monthlySpend:'' });
  function add(e){ e.preventDefault();
    if(!form.name) return;
    setVendors(prev=>[...prev,{ name:form.name.trim(), licences:Number(form.licences||0), monthlySpend:Number(form.monthlySpend||0)}]);
    setForm({name:'', licences:'', monthlySpend:''});
  }
  function del(name){ setVendors(prev=>prev.filter(v=>v.name!==name)); }
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:24 }}>
      <div style={card}>
        <h2 style={{marginTop:0}}>Vendors</h2>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr><th style={th}>Name</th><th style={th}>Licences</th><th style={th}>Monthly Spend (£)</th><th style={th}></th></tr></thead>
          <tbody>
            {vendors.map(v=>(
              <tr key={v.name}>
                <td style={td}>{v.name}</td>
                <td style={tdC}>{v.licences}</td>
                <td style={tdC}>{v.monthlySpend}</td>
                <td style={tdC}><button style={delBtn} onClick={()=>del(v.name)}>Delete</button></td>
              </tr>
            ))}
            {!vendors.length && <tr><td style={td} colSpan={4}>No vendors yet.</td></tr>}
          </tbody>
        </table>
      </div>
      <div style={card}>
        <h3 style={{marginTop:0}}>Add Vendor</h3>
        <form onSubmit={add} style={{ display:'grid', gap:12 }}>
          <label>Name<input style={input} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required/></label>
          <label>Licences<input type="number" min="0" style={input} value={form.licences} onChange={e=>setForm(f=>({...f,licences:e.target.value}))}/></label>
          <label>Monthly Spend (£)<input type="number" min="0" style={input} value={form.monthlySpend} onChange={e=>setForm(f=>({...f,monthlySpend:e.target.value}))}/></label>
          <button type="submit" style={primaryBtn}>Add Vendor</button>
        </form>
      </div>
    </div>
  );
}

function AppsView({apps, setApps, vendors, th, td, tdC, input, primaryBtn, delBtn, card}) {
  const [form, setForm] = useState({ name:'', vendor:'', category:'', owner:'', monthlyCost:'' });
  function add(e){ e.preventDefault();
    if(!form.name) return;
    setApps(prev=>[...prev,{ name:form.name.trim(), vendor:form.vendor, category:form.category, owner:form.owner,
      monthlyCost:Number(form.monthlyCost||0)}]);
    setForm({ name:'', vendor:'', category:'', owner:'', monthlyCost:'' });
  }
  function del(name){ setApps(prev=>prev.filter(a=>a.name!==name)); }
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:24 }}>
      <div style={card}>
        <h2 style={{marginTop:0}}>Applications</h2>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr><th style={th}>Name</th><th style={th}>Vendor</th><th style={th}>Category</th><th style={th}>Owner</th><th style={th}>£/mo</th><th style={th}></th></tr></thead>
        <tbody>
          {apps.map(a=>(
            <tr key={a.name}>
              <td style={td}>{a.name}</td>
              <td style={td}>{a.vendor}</td>
              <td style={td}>{a.category}</td>
              <td style={td}>{a.owner}</td>
              <td style={tdC}>{a.monthlyCost}</td>
              <td style={tdC}><button style={delBtn} onClick={()=>del(a.name)}>Delete</button></td>
            </tr>
          ))}
          {!apps.length && <tr><td style={td} colSpan={6}>No applications yet.</td></tr>}
        </tbody>
        </table>
      </div>
      <div style={card}>
        <h3 style={{marginTop:0}}>Add Application</h3>
        <form onSubmit={add} style={{ display:'grid', gap:12 }}>
          <label>Name<input style={input} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required/></label>
          <label>Vendor
            <select style={input} value={form.vendor} onChange={e=>setForm(f=>({...f,vendor:e.target.value}))}>
              <option value="">Select vendor</option>
              {vendors.map(v=><option key={v.name} value={v.name}>{v.name}</option>)}
            </select>
          </label>
          <label>Category<input style={input} value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}/></label>
          <label>Owner<input style={input} value={form.owner} onChange={e=>setForm(f=>({...f,owner:e.target.value}))}/></label>
          <label>Monthly Cost (£)<input type="number" min="0" style={input} value={form.monthlyCost} onChange={e=>setForm(f=>({...f,monthlyCost:e.target.value}))}/></label>
          <button type="submit" style={primaryBtn}>Add Application</button>
        </form>
      </div>
    </div>
  );
}

function Badge({label, value}) {
  return (
    <div style={{ background:'#fff', padding:'12px 14px', borderRadius:8, minWidth:180 }}>
      <div style={{ fontSize:12, opacity:0.7 }}>{label}</div>
      <div style={{ fontSize:22, fontWeight:700 }}>{value}</div>
    </div>
  );
}
