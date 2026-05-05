import { Status } from '@prisma/client';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { NotFoundError, ValidationError } from '../lib/errors';
import prisma from '../lib/prisma';
import { validStatuses } from '../models/application.model';

// This removes the need for try/catch blocks in every controller!
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// ── GET /applications ──────────────────────────────────────
export const getApplications = asyncHandler(async (req, res) => {
  const { status, company } = req.query;

  const applications = await prisma.application.findMany({
    where: {
      ...(status && { status: status as Status }),
      ...(company && {
        company: {
          equals: company as string,
          mode: 'insensitive',
        },
      }),
    },
    orderBy: { createdAt: 'desc' },
  });

  return res.json({
    total: applications.length,
    data: applications,
  });
});

// ── GET /applications/stats ────────────────────────────────
export const getStats = asyncHandler(async (req, res) => {
  const applications = await prisma.application.findMany();

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
});

// ── GET /applications/:id ──────────────────────────────────
export const getApplicationById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    throw new ValidationError('Invalid ID format. Must be a number.');
  }

  const application = await prisma.application.findUnique({
    where: { id },
  });

  if (!application) {
    throw new NotFoundError('Application not found');
  }

  return res.json(application);
});

// ── POST /applications ─────────────────────────────────────
export const createApplication = asyncHandler(async (req, res) => {
  const { company, role, status, appliedDate, notes } = req.body;

  // Validate presence
  const requiredFields = ['company', 'role', 'status', 'appliedDate'];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    throw new ValidationError(
      `Missing required fields: ${missingFields.join(', ')}`,
    );
  }

  // Validate status enum
  if (!validStatuses.includes(status)) {
    throw new ValidationError(
      `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
    );
  }

  // Let the database write. Prisma unique constraint errors (P2002)
  // will throw and be caught automatically by your error middleware!
  const newApplication = await prisma.application.create({
    data: {
      company,
      role,
      status,
      appliedDate,
      notes: notes || null,
    },
  });

  return res.status(201).json(newApplication);
});

// ── PUT /applications/:id ──────────────────────────────────
export const updateApplication = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    throw new ValidationError('Invalid ID format. Must be a number.');
  }

  if (req.body.status && !validStatuses.includes(req.body.status)) {
    throw new ValidationError(
      `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
    );
  }

  // Let Prisma write. If the ID is missing, Prisma throws P2025,
  // which your new middleware translates into a 404 "Record not found"!
  const updatedApplication = await prisma.application.update({
    where: { id },
    data: req.body,
  });

  return res.json(updatedApplication);
});

// ── DELETE /applications/:id ───────────────────────────────
export const deleteApplication = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    throw new ValidationError('Invalid ID format. Must be a number.');
  }

  // If ID doesn't exist, Prisma throws P2025, and middleware replies with a 404.
  const deleted = await prisma.application.delete({
    where: { id },
  });

  return res.json({
    message: `Application to ${deleted.company} for ${deleted.role} deleted successfully`,
    deletedId: id,
  });
});
