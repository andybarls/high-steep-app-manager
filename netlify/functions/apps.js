export const handler = async () => {
  const apps = [
    { name: "Adobe Creative Cloud", vendor: "Adobe", category: "Design", owner: "Marketing" },
    { name: "Zoom Pro", vendor: "Zoom", category: "Meetings", owner: "Operations" },
    { name: "Slack Standard", vendor: "Slack", category: "Communication", owner: "All Staff" },
    { name: "Jira Software", vendor: "Atlassian", category: "Development", owner: "Tech" },
    { name: "AWS EC2", vendor: "AWS", category: "Infrastructure", owner: "IT" },
    { name: "Dropbox Business", vendor: "Dropbox", category: "Storage", owner: "Ops" },
    { name: "Canva Pro", vendor: "Canva", category: "Design", owner: "Marketing" },
    { name: "HubSpot CRM Starter", vendor: "HubSpot", category: "CRM", owner: "Sales" }
  ];

  return {
    statusCode: 200,
    body: JSON.stringify(apps)
  };
};