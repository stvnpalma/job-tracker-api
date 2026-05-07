/// <reference types="jest" />
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/lib/prisma';

beforeEach(async () => {
  await prisma.application.deleteMany();
});

afterAll(async () => {
  await prisma.application.deleteMany();
  await prisma.$disconnect();
});

describe('GET /applications', () => {
  it('returns empty array when no applications exist', async () => {
    const res = await request(app).get('/applications');

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(0);
    expect(res.body.data).toEqual([]);
  });

  it('returns all applications', async () => {
    await prisma.application.create({
      data: {
        company: 'Google',
        role: 'Backend Engineer',
        status: 'applied',
        appliedDate: '2024-01-15', // Changed back to string
      },
    });

    const res = await request(app).get('/applications');

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.data[0].company).toBe('Google');
  });

  it('filters by status', async () => {
    await prisma.application.createMany({
      data: [
        {
          company: 'Google',
          role: 'Backend Engineer',
          status: 'applied',
          appliedDate: '2024-01-15',
        },
        {
          company: 'Stripe',
          role: 'Node.js Developer',
          status: 'interview',
          appliedDate: '2024-01-20',
        },
      ],
    });

    const res = await request(app).get('/applications?status=applied');

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.data[0].company).toBe('Google');
  });
});

describe('GET /applications/:id', () => {
  it('returns the correct application', async () => {
    const created = await prisma.application.create({
      data: {
        company: 'Stripe',
        role: 'Node.js Developer',
        status: 'interview',
        appliedDate: '2024-01-20',
      },
    });

    const res = await request(app).get(`/applications/${created.id}`);

    expect(res.status).toBe(200);
    expect(res.body.company).toBe('Stripe');
    expect(res.body.role).toBe('Node.js Developer');
  });

  it('returns 404 when application does not exist', async () => {
    const res = await request(app).get('/applications/999999');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Application not found');
  });

  it('returns 400 for invalid id format', async () => {
    const res = await request(app).get('/applications/abc');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid ID format. Must be a number.');
  });
});
