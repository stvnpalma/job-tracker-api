import { Status } from '@prisma/client';
import { RequestHandler } from 'express';
import prisma from '../lib/prisma';
import { validStatuses } from '../models/application.model';

// ── GET /applications ──────────────────────────────────────
export const getApplications: RequestHandler = async (req, res) => {
  try {
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
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

// ── GET /applications/stats ────────────────────────────────
export const getStats: RequestHandler = async (req, res) => {
  try {
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
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

// ── GET /applications/:id ──────────────────────────────────
export const getApplicationById: RequestHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Prevent querying the DB with NaN
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: 'Invalid ID format. Must be a number.' });
    }

    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    return res.json(application);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch application' });
  }
};

// ── POST /applications ─────────────────────────────────────
export const createApplication: RequestHandler = async (req, res) => {
  try {
    const {
      company,
      role,
      status,
      appliedDate,
      notes,
    }: {
      company: string;
      role: string;
      status: Status;
      appliedDate: string;
      notes?: string;
    } = req.body;

    const requiredFields = ['company', 'role', 'status', 'appliedDate'];
    const missingFields: string[] = [];

    for (const field of requiredFields) {
      if (!req.body[field]) missingFields.push(field);
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missing: missingFields,
      });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status', validStatuses });
    }

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
  } catch (err: any) {
    if (err.code === 'P2002') {
      return res.status(400).json({
        error: 'You have already applied to this role at this company',
      });
    }
    return res.status(500).json({ error: 'Failed to create application' });
  }
};

// ── PUT /applications/:id ──────────────────────────────────
export const updateApplication: RequestHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: 'Invalid ID format. Must be a number.' });
    }

    if (req.body.status && !validStatuses.includes(req.body.status)) {
      return res.status(400).json({ error: 'Invalid status', validStatuses });
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: req.body,
    });

    return res.json(updatedApplication);
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Application not found' });
    }
    return res.status(500).json({ error: 'Failed to update application' });
  }
};

// ── DELETE /applications/:id ───────────────────────────────
export const deleteApplication: RequestHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: 'Invalid ID format. Must be a number.' });
    }

    const deleted = await prisma.application.delete({
      where: { id },
    });

    return res.json({
      message: `Application to ${deleted.company} for ${deleted.role} deleted successfully`,
      deletedId: id,
    });
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Application not found' });
    }
    return res.status(500).json({ error: 'Failed to delete application' });
  }
};
