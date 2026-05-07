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
describe('DELETE /applications/:id', () => {
  it('deletes an application successfully', async () => {
    const created = await prisma.application.create({
      data: {
        company: 'Google',
        role: 'Backend Engineer',
        status: 'applied',
        appliedDate: '2024-01-15',
      },
    });

    const res = await request(app).delete(`/applications/${created.id}`);

    expect(res.status).toBe(200);
    expect(res.body.deletedId).toBe(created.id);
    expect(res.body.message).toContain('Google');
  });

  it('confirms delete application is gone', async () => {
    const created = await prisma.application.create({
      data: {
        company: 'Stripe',
        role: 'Node.js Developer',
        status: 'interview',
        appliedDate: '2024-01-20',
      },
    });

    await request(app).delete(`/applications/${created.id}`);
    const res = await request(app).get(`/applications/${created.id}`);
    expect(res.status).toBe(404);
  });

  it('returns status 404 non-existent id', async () => {
    // Added leading "/"
    const res = await request(app).delete('/applications/999999');
    expect(res.status).toBe(404);
  });

  it('returns 400 for invalid id format', async () => {
    const res = await request(app).delete('/applications/abc');
    expect(res.status).toBe(400);
  });
});
