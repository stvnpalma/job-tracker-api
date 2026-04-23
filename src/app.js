const { application } = require("express");
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

// GET /applications/:id -> find. one application by ID
//:id is the URLparameter - Express captures whatever is is that position
app.get("/applications/:id", (req, res) => {
  //req.params.id comes in as a STRING from the URL - "2" not 2
  //number() converts it to an actual number so === works correctly
  const id = Number(req.params.id);
  // find() loops through the array and returns the first match
  // This is logic — for each application, check if its id matches
  const application = applications.find((app) => app.id === id);

  // if no match was found, .find() returns undefined
  if (!application) {
    return res.status(404).json({ error: "Application not found" });
  }
  res.json(application);
});

app.post("/applications", (req, res) => {
  // req.body is the data sent by the client
  // we destructure exactly what we expect - OBJECTS
  const { company, role, status, appliedDate, notes } = req.body;
  // ── Validation — never trust data coming in ────────────
  // loops concept: we check required fields using an array
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
  // ── Business logic — no duplicate applications ─────────
  // loops concept: iterate over existing applications to find a match

  let alreadyApplied = false;

  for (const app of applications) {
    if (app.company === company && app.role === role) {
      alreadyApplied = true;
    }
  }
  if (alreadyApplied) {
    return res.status(400).json({
      error: "You have already appled to this role at this company",
    });
  }
  // ── Build the new application object ───────────────────
  // id is generated from the current array length + 1

  const newApplication = {
    id: applications.length + 1,
    company,
    role,
    status,
    appliedDate,
    notes: notes || null, // if notes wasn't sent, default to null
  };
  // push it into our in-memory array
  applications.push(newApplication);

  // 201 = Created — the correct status code for a new resource
  res.status(201).json(application);
});

app.listen(PORT, () => {
  console.log(`Job Tracker API running on http://localhost: $ {PORT}`);
});
