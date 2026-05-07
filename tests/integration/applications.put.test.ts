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

describe('PUT /applications/:id', () => {
  it('updates an application successfully', async () => {
    const created = await prisma.application.create({
      data: {
        company: 'Google',
        role: 'Backend Engineer',
        status: 'applied',
        appliedDate: '2024-01-15',
      },
    });

    const res = await request(app)
      .put(`/applications/${created.id}`)
      .send({ status: 'interview' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('interview');
    expect(res.body.company).toBe('Google');
  });

  it('returns 404 for non-existent id', async () => {
    const res = await request(app)
      .put('/applications/999999')
      .send({ status: 'interview' });

    expect(res.status).toBe(404);
  });

  it('returns 400 for invalid status', async () => {
    const created = await prisma.application.create({
      data: {
        company: 'Stripe',
        role: 'Node.js Developer',
        status: 'applied',
        appliedDate: '2024-01-20',
      },
    });

    const res = await request(app)
      .put(`/applications/${created.id}`)
      .send({ status: 'pending' });

    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid id format', async () => {
    const res = await request(app)
      .put('/applications/abc')
      .send({ status: 'interview' });

    expect(res.status).toBe(400);
  });
});
