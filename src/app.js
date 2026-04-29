const express = require("express");
const app = express();

app.use(express.json());

const PORT = 3000;

const applications = [
  {
    id: 1,
    company: "Google",
    role: "Backend Engineer",
    status: "applied",
    appliedDate: "2024-01-15",
    notes: null,
  },
  {
    id: 2,
    company: "Stripe",
    role: "Node.js Developer",
    status: "interview",
    appliedDate: "2024-01-20",
    notes: "Phone screen scheduled for Friday",
  },
];

// GET /applications → return all applications
app.get("/applications", (req, res) => {
  res.json(applications);
});

// GET /applications/:id → find one application by ID
app.get("/applications/:id", (req, res) => {
  const id = Number(req.params.id);
  const application = applications.find((app) => app.id === id);

  if (!application) {
    return res.status(404).json({ error: "Application not found" });
  }

  res.json(application);
});

// POST /applications → add a new application
app.post("/applications", (req, res) => {
  const { company, role, status, appliedDate, notes } = req.body;

  const requiredFields = ["company", "role", "status", "appliedDate"];
  const missingFields = [];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Missing required fields",
      missing: missingFields,
    });
  }

  let alreadyApplied = false;

  for (const app of applications) {
    if (app.company === company && app.role === role) {
      alreadyApplied = true;
    }
  }

  if (alreadyApplied) {
    return res.status(400).json({
      error: "You have already applied to this role at this company",
    });
  }

  const newApplication = {
    id: applications.length + 1,
    company,
    role,
    status,
    appliedDate,
    notes: notes || null,
  };

  applications.push(newApplication);
  res.status(201).json(newApplication);
});

// PUT /applications/:id → update an existing application
app.put("/applications/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = applications.findIndex((app) => app.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Application not found" });
  }

  const validStatuses = ["applied", "interview", "offer", "rejected"];

  if (req.body.status && !validStatuses.includes(req.body.status)) {
    return res.status(400).json({
      error: "Invalid status",
      validStatuses,
    });
  }

  const updatedApplication = {
    ...applications[index],
    ...req.body,
    id,
  };

  applications[index] = updatedApplication;
  res.json(updatedApplication);
});

// DELETE /applications/:id → remove an application
app.delete("/applications/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = applications.findIndex((app) => app.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Application not found" });
  }

  const { company, role } = applications[index];
  applications.splice(index, 1);

  res.json({
    message: `Application to ${company} for ${role} deleted successfully`,
    deletedId: id,
  });
});

app.listen(PORT, () => {
  console.log(`Job Tracker API running on http://localhost:${PORT}`);
});
