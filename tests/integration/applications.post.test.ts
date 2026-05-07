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

describe('POST /applications', () => {
  it('creates a new application and returns 201', async () => {
    const res = await request(app).post('/applications').send({
      company: 'Google',
      role: 'Backend Engineer',
      status: 'applied',
      appliedDate: '2024-01-15',
    });

    expect(res.status).toBe(201);
    expect(res.body.company).toBe('Google');
    expect(res.body.id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/applications')
      .send({ company: 'Netflix' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Missing required fields');
  });

  it('returns 400 for invalid status', async () => {
    const res = await request(app).post('/applications').send({
      company: 'Apple',
      role: 'iOS Engineer',
      status: 'pending',
      appliedDate: '2024-01-15',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid status');
  });

  it('returns 409 for duplicate company and role', async () => {
    await prisma.application.create({
      data: {
        company: 'Google',
        role: 'Backend Engineer',
        status: 'applied',
        appliedDate: '2024-01-15',
      },
    });

    const res = await request(app).post('/applications').send({
      company: 'Google',
      role: 'Backend Engineer',
      status: 'applied',
      appliedDate: '2024-01-15',
    });

    expect(res.status).toBe(409);
  });
});
