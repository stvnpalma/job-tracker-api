// One function per route. Pure logic — no Express setup, just req and res.
// extract logic into named, reusable functions.
//@ts-nocheck

import { Application, Request, Response } from "express";
import { applications, validStatuses } from "../models/application.model";

// ── GET /applications ──────────────────────────────────────
export function getApplications(req: Request, res: Response): void {
  res.json(applications);
}

// ── GET /applications/:id ──────────────────────────────────

export function getApplicationById(req: Request, res: Response) {
  const id = Number(req.params.id);
  const application = applications.find((app) => app.id === id);

  if (!application) {
    res.status(400).json({ error: "Application not found" });
  }
  res.json(application);
}

// ── POST /applications ─────────────────────────────────────
export function createApplication(req: Request, res: Response) {
  const { company, role, status, appliedDate, notes } = req.body;

  // validate required fields
  const requiredFields = ["company", "role", "status", "appliedDate"];
  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    res.status(400).json({
      error: "Missing required fields",
      missing: missingFields,
    });
    return;
  }

  // validate status

  if (!validStatuses.includes(status)) {
    res.json(400).json({ error: "Invalid status", validStatuses });
  }

  // check for duplicates
  const alreadyApplied = applications.some(
    (app) => app.company === company && app.role === role,
  );

  if (alreadyApplied) {
    res
      .status(400)
      .json({ error: "You have already applied to this role at this company" });
    return;
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
}

// ── PUT /applications/:id ──────────────────────────────────

export function updateApplication(req: Request, res: Response) {
  const id = Number(req.params.id);
  const index = applications.findIndex((app) => app.id === id);

  if (index === -1) {
    res.json(400).json({ error: "Application not found" });
  }

  if (req.body.status && !validStatuses.includes(req.body.status)) {
    res.status(400).json({ error: "invalid status", validStatuses });
  }

  const updatedApplication: Application = {
    ...applications[index],
    ...req.body,
    id,
  };

  applications[index] = updatedApplication;
  res.json(updatedApplication);
}

// ── DELETE /applications/:id ───────────────────────────────

export function deleteApplication(req: Request, res: Response) {
  const id = Number(req.params.id);
  const index = applications.findIndex((app) => app.id === id);

  if (index === -1) {
    res.status(400).json({ error: "Application not found" });
  }

  const { company, role } = applications[index];
  applications.splice(index, 1);

  res.json({
    message: `Application to ${company} for ${role} deleted successfully`,
    deletedId: id,
  });
}
