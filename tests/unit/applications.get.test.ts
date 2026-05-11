/// <reference types="jest" />
const applications = [
  {
    id: 1,
    company: 'Google',
    role: 'Backend Engineer',
    status: 'applied',
  },
  {
    id: 2,
    company: 'Stripe',
    role: 'Node.js Developer',
    status: 'interview',
  },
];

describe('GET /applications', () => {
  it('returns all applications', () => {
    expect(applications.length).toBe(2);
    expect(Array.isArray(applications)).toBe(true);
  });
});

describe('GET /applications/:id', () => {
  it('returns the correct application when id exists', () => {
    const result = applications.find((app) => app.id === 1);
    expect(result?.company).toBe('Google');
    expect(result?.role).toBe('Backend Engineer');
  });
});

it('returns undefined when application does not exist', () => {
  const result = applications.find((app) => app.id === 99);
  expect(result).toBe(undefined);
});

// ── filtering tests ────────────────────────────────────────
describe('GET /applications with filters', () => {
  const applications = [
    {
      id: 1,
      company: 'Google',
      role: 'Backend Engineer',
      status: 'applied',
    },
    {
      id: 2,
      company: 'Stripe',
      role: 'Node.js Developer',
      status: 'interview',
    },
    {
      id: 3,
      company: 'Netflix',
      role: 'Backend Engineer',
      status: 'applied',
    },
  ];

  it('filters by status correctly ', () => {
    const status = 'applied';
    const results = applications.filter((app) => app.status === status);

    expect(results.length).toBe(2);
    expect(results.every((app) => app.status === 'applied')).toBe(true);
  });

  it('it filters by company insensitively', () => {
    const company = 'gOoGlE';
    const results = applications.filter(
      (app) => app.company.toLowerCase() === company.toLowerCase(),
    );
    expect(results.length).toBe(1);
    expect(results[0].company).toBe('Google');
  });

  it('returns an empty array when no match is found ', () => {
    const results = applications.filter((app) => app.status === 'offer');
    expect(results.length).toBe(0);
    expect(Array.isArray(results)).toBe(true);
  });
});

// ── stats tests ────────────────────────────────────────────

describe('GET /applications/stats', () => {
  const applications = [
    {
      id: 1,
      company: 'Google',
      status: 'applied',
    },
    {
      id: 2,
      company: 'Stripe',
      status: 'interview',
    },
    {
      id: 3,
      company: 'Netflix',
      status: 'offer',
    },
    {
      id: 4,
      company: 'Apple',
      status: 'rejected',
    },
  ];
  it('counts total applications correctly', () => {
    expect(applications.length).toBe(4);
  });

  test('counts active applications correctly', () => {
    const active = applications.filter(
      (app) => app.status === 'applied' || app.status === 'interview',
    ).length;
    expect(active).toBe(2);
  });

  test('groups applications by status correctly', () => {
    const byStatus = applications.reduce(
      (acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    expect(byStatus.applied).toBe(1);
    expect(byStatus.interview).toBe(1);
    expect(byStatus.offer).toBe(1);
    expect(byStatus.rejected).toBe(1);
  });
});
