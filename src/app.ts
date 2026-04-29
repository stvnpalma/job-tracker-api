import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

const PORT = 3000;

// ── Type definition ────────────────────────────────────────
// This is the core of TypeScript — we define exactly what
// an Application looks like. Every application object in
// this project must match this shape or TypeScript will
// throw an error at compile time, not runtime.
interface Application {
  id: number;
  company: string;
  role: string;
  status: "applied" | "interview" | "offer" | "rejected";
  appliedDate: string;
  notes: string | null;
}

// ── In-memory data store ───────────────────────────────────
// Notice: Application[] means "array of Application"
// TypeScript now knows exactly what's inside this array
const applications: Application[] = [
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

// ── GET /applications ──────────────────────────────────────
// Request and Response are imported from Express
// They give you full type safety on req and res
app.get("/applications", (req: Request, res: Response) => {
  res.json(applications);
});

// ── GET /applications/:id ──────────────────────────────────
app.get("/applications/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const application = applications.find((app) => app.id === id);

  if (!application) {
    return res.status(404).json({ error: "Application not found" });
  }

  res.json(application);
});

// ── POST /applications ─────────────────────────────────────
app.post("/applications", (req: Request, res: Response) => {
  const { company, role, status, appliedDate, notes } = req.body;

  const requiredFields = ["company", "role", "status", "appliedDate"];
  const missingFields: string[] = [];

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

  const validStatuses = ["applied", "interview", "offer", "rejected"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: "Invalid status",
      validStatuses,
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

  const newApplication: Application = {
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

// ── PUT /applications/:id ──────────────────────────────────
app.put("/applications/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = applications.findIndex((app) => app.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Application not found" });
  }

  const validStatuses: Application["status"][] = [
    "applied",
    "interview",
    "offer",
    "rejected",
  ];

  if (req.body.status && !validStatuses.includes(req.body.status)) {
    return res.status(400).json({
      error: "Invalid status",
      validStatuses,
    });
  }

  const updatedApplication: Application = {
    ...applications[index],
    ...req.body,
    id,
  };

  applications[index] = updatedApplication;
  res.json(updatedApplication);
});

// ── DELETE /applications/:id ───────────────────────────────
app.delete("/applications/:id", (req: Request, res: Response) => {
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

// ── Start server ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Job Tracker API running on http://localhost:${PORT}`);
});

export default app;
