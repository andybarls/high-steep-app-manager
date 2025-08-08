import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function App() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetch('/.netlify/functions/vendors')
      .then(res => res.json())
      .then(data => setVendors(data));
  }, []);

  return (
    <>
      <header>
        <img src="/logo.png" alt="High Steep Logo" />
        <h1>High Steep Application Manager</h1>
      </header>

      <div className="dashboard">
        <div className="metric">
          <h2>Total Vendors: {vendors.length}</h2>
        </div>

        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ width: '50%' }}>
            <h3>Licence Allocation</h3>
            <Pie data={{
              labels: vendors.map(v => v.name),
              datasets: [{
                data: vendors.map(v => v.licences),
                backgroundColor: ['#4FBAE0', '#66A181', '#ADA6DD', '#7C537C', '#284B5A']
              }]
            }} />
          </div>
          <div style={{ width: '50%' }}>
            <h3>Monthly Spend</h3>
            <Bar data={{
              labels: vendors.map(v => v.name),
              datasets: [{
                label: '£ per month',
                data: vendors.map(v => v.monthlySpend),
                backgroundColor: '#17293F'
              }]
            }} />
          </div>
        </div>
      </div>
    </>
  );
}