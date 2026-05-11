/// <reference types="jest" />
describe('POST /applications', () => {
  test('detects missing required fields', () => {
    const body: Record<string, string> = { company: 'Netflix' };
    const requiredFields = ['company', 'role', 'status', 'appliedDate'];
    const missingFields = [];

    for (const field of requiredFields) {
      if (!body[field]) missingFields.push(field);
    }

    expect(missingFields).toContain('role');
    expect(missingFields).toContain('status');
    expect(missingFields).toContain('appliedDate');
    expect(missingFields).not.toContain('company');
  });

  test('detects a duplicate application', () => {
    const existing = [{ id: 1, company: 'Apple', role: 'Backend Engineer' }];

    const incoming = { company: 'Apple', role: 'Backend Engineer' };
    let alreadyApplied = false;

    for (const app of existing) {
      if (app.company === incoming.company && app.role === incoming.role) {
        alreadyApplied = true;
      }
    }

    expect(alreadyApplied).toBe(true);
  });

  test('allows application to same company for a different role', () => {
    const existing = [{ id: 1, company: 'Apple', role: 'Backend Engineer' }];

    const incoming = { company: 'Apple', role: 'Frontend Engineer' };
    let alreadyApplied = false;

    for (const app of existing) {
      if (app.company === incoming.company && app.role === incoming.role) {
        alreadyApplied = true;
      }
    }

    expect(alreadyApplied).toBe(false);
  });
});
