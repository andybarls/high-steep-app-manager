export const handler = async () => {
  const contracts = [
    { application: "Adobe Creative Cloud", start: "2024-01-01", end: "2024-12-31", cost: 9000 },
    { application: "Zoom Pro", start: "2024-03-01", end: "2025-02-28", cost: 4320 },
    { application: "Slack Standard", start: "2024-05-01", end: "2025-04-30", cost: 6000 },
    { application: "Jira Software", start: "2024-04-01", end: "2025-03-31", cost: 1728 },
    { application: "AWS EC2", start: "2024-06-01", end: "2025-05-31", cost: 5400 },
    { application: "Dropbox Business", start: "2024-02-01", end: "2025-01-31", cost: 2880 }
  ];

  return {
    statusCode: 200,
    body: JSON.stringify(contracts)
  };
};