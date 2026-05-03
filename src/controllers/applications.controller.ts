import { RequestHandler } from 'express';
import {
  Application,
  applications,
  validStatuses,
} from '../models/application.model';

// ── GET /applications ──────────────────────────────────────
export const getApplications: RequestHandler = (req, res) => {
  const { status, company } = req.query;
  let results = applications;

  if (status) {
    results = results.filter((app) => app.status === status);
  }

  if (company) {
    results = results.filter(
      (app) => app.company.toLowerCase() === (company as string).toLowerCase(),
    );
  }

  // No return needed here as it's the last line, but good for consistency
  return res.json({
    total: results.length,
    data: results,
  });
};

// ── GET /applications/:id ──────────────────────────────────
export const getApplicationById: RequestHandler = (req, res) => {
  const id = Number(req.params.id);
  const application = applications.find((app) => app.id === id);

  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }

  return res.json(application);
};

// ── GET /applications/stats ────────────────────────────────
export const getStats: RequestHandler = (req, res) => {
  const byStatus = applications.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const active = applications.filter(
    (app) => app.status === 'applied' || app.status === 'interview',
  ).length;

  return res.json({
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
    return res.status(400).json({
      error: 'Missing required fields',
      missing: missingFields,
    });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status',
      validStatuses,
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
  return res.status(201).json(newApplication);
};

// ── PUT /applications/:id ──────────────────────────────────
export const updateApplication: RequestHandler = (req, res) => {
  const id = Number(req.params.id);
  const index = applications.findIndex((app) => app.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }

  if (req.body.status && !validStatuses.includes(req.body.status)) {
    return res.status(400).json({ error: 'Invalid status', validStatuses });
  }

  const updatedApplication: Application = {
    ...applications[index],
    ...req.body,
    id,
  };

  applications[index] = updatedApplication;
  return res.json(updatedApplication);
};

// ── DELETE /applications/:id ───────────────────────────────
export const deleteApplication: RequestHandler = (req, res) => {
  const id = Number(req.params.id);
  const index = applications.findIndex((app) => app.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }

  const { company, role } = applications[index];
  applications.splice(index, 1);

  return res.json({
    message: `Application to ${company} for ${role} deleted successfully`,
    deletedId: id,
  });
};
