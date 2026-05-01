// One function per route. Pure logic — no Express setup, just req and res.
// extract logic into named, reusable functions.
//@ts-nocheck

import { RequestHandler } from 'express';
import {
  Application,
  applications,
  validStatuses,
} from '../models/application.model';

// ── GET /applications ──────────────────────────────────────
// now supports ?status=applied and ?company=Google
export const getApplications: RequestHandler = (req, res) => {
  const { status, company } = req.query;

  let results = applications;

  // .filter() with arrow function
  if (status) {
    results = results.filter((app) => app.status === status);
  }

  if (company) {
    results = results.filter(
      (app) => app.company.toLowerCase() === (company as string).toLowerCase(),
    );
  }

  res.json({
    total: results.length,
    data: results,
  });
};

// ── GET /applications/:id ──────────────────────────────────
export const getApplicationById: RequestHandler = (req, res) => {
  const id = Number(req.params.id);
  const application = applications.find((app) => app.id === id);

  if (!application) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }

  res.json(application);
};

// ── GET /applications/stats ────────────────────────────────
export const getStats: RequestHandler = (req, res) => {
  // group applications by status using reduce
  const byStatus = applications.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // total active — filter then length
  const active = applications.filter(
    (app) => app.status === 'applied' || app.status === 'interview',
  ).length;

  res.json({
    total: applications.length,
    active,
    byStatus,
  });
};

// ── POST /applications ─────────────────────────────────────
export const createApplication: RequestHandler = (req, res) => {
  const { company, role, status, appliedDate, notes } = req.body;

  const requiredFields = ['company', 'role', 'status', 'appliedDate'];
  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    res.status(400).json({
      error: 'Missing required fields',
      missing: missingFields,
    });
    return;
  }

  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: 'Invalid status', validStatuses });
    return;
  }

  // .some() — cleaner than a for loop for duplicate check
  const alreadyApplied = applications.some(
    (app) => app.company === company && app.role === role,
  );

  if (alreadyApplied) {
    res.status(400).json({
      error: 'You have already applied to this role at this company',
    });
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
};

// ── PUT /applications/:id ──────────────────────────────────
export const updateApplication: RequestHandler = (req, res) => {
  const id = Number(req.params.id);
  const index = applications.findIndex((app) => app.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }

  if (req.body.status && !validStatuses.includes(req.body.status)) {
    res.status(400).json({ error: 'Invalid status', validStatuses });
    return;
  }

  const updatedApplication: Application = {
    ...applications[index],
    ...req.body,
    id,
  };

  applications[index] = updatedApplication;
  res.json(updatedApplication);
};

// ── DELETE /applications/:id ───────────────────────────────
export const deleteApplication: RequestHandler = (req, res) => {
  const id = Number(req.params.id);
  const index = applications.findIndex((app) => app.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }

  const { company, role } = applications[index];
  applications.splice(index, 1);

  res.json({
    message: `Application to ${company} for ${role} deleted successfully`,
    deletedId: id,
  });
};
