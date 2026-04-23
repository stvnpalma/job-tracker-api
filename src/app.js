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
    company: "Stripe",
    role: "node.js Developer",
    appliedDate: "2024-01-20",
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

// PUT /applications/:id → update an existing application
app.put("/applications/:id", (req, res) => {
  // 1. GET THE ID FROM THE PARAMS (URL)
  const id = Number(req.params.id);

  // 2. FIND THE INDEX
  const index = applications.findIndex((app) => app.id === id);

  // 3. IF NOT FOUND, RETURN 404 (and 'return' so the rest of the code stops!)
  if (index === -1) {
    return res.status(404).json({ error: "Application not found" });
  }

  // 4. VALIDATE STATUS
  const validateStatuses = ["applied", "interview", "offer", "rejected"];
  if (req.body.status && !validateStatuses.includes(req.body.status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  // 5. MERGE AND SAVE
  const updateApplication = {
    ...applications[index], // Keep everything old
    ...req.body, // Overwrite with new stuff from curl
    id, // Ensure the ID stays as the number from the URL
  };

  applications[index] = updateApplication;

  // 6. SEND THE RESPONSE (Crucial! If you don't do this, curl hangs)
  res.json(updateApplication);
});

app.listen(PORT, () => {
  console.log(`Job Tracker API running on http://localhost: ${PORT}`);
});
