export const handler = async () => {
  const vendors = [
    { name: "Adobe", licences: 15, monthlySpend: 750 },
    { name: "Zoom", licences: 30, monthlySpend: 360 },
    { name: "Slack", licences: 25, monthlySpend: 500 },
    { name: "Atlassian", licences: 12, monthlySpend: 144 },
    { name: "AWS", licences: 8, monthlySpend: 450 },
    { name: "Dropbox", licences: 20, monthlySpend: 240 },
    { name: "Canva", licences: 5, monthlySpend: 55 },
    { name: "HubSpot", licences: 6, monthlySpend: 252 }
  ];

  return {
    statusCode: 200,
    body: JSON.stringify(vendors)
  };
};