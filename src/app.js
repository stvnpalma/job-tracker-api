const express = require("express");
const app = express();

app.use(express.json());

const PORT = 3000;

const applications = [
  {
    id: 1,
    company: "Google",
    role: "Backend Engineer",
    appliedDate: "2024-01-15",
    notes: null,
  },
  {
    id: 2,
    company: "Sripe",
    role: "node.js Developer",
    appliedDate: "2024-01-2020",
    notes: "phone screened scheduled for Friday",
  },
];

app.get("/applications", (req, res) => {
  res.json(applications);
});

app.listen(PORT, () => {
  console.log(`Job Tracker API running on http://localhost: $ {PORT}`);
});
