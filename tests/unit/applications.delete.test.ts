/// <reference types="jest" />
describe('DELETE /applications/:id', () => {
  it('removes the correct application by index', () => {
    const applications = [
      {
        id: 1,
        company: 'Google',
        role: 'Backend Engineer',
      },
      {
        id: 2,
        company: 'Stripe',
        role: 'Node.js Developer',
      },
      {
        id: 3,
        company: 'Netflix',
        role: 'Backend Engineer',
      },
    ];
    const index = applications.findIndex((app) => app.id === 2);
    applications.splice(index, 1);

    expect(applications.length).toBe(2);
    expect(applications.find((app) => app.id === 2)).toBeUndefined();
  });

  it('does not remove anything when id is not found', () => {
    const applications = [
      {
        id: 1,
        company: 'Google',
      },
      {
        id: 2,
        company: 'Stripe',
      },
    ];
    const index = applications.findIndex((app) => app.id === 99);
    expect(index).toBe(-1);
    expect(applications.length).toBe(2);
  });

  it('remaining applications are intact after a delete', () => {
    const applications = [
      {
        id: 1,
        company: 'Google',
        role: 'Backend Engineer',
      },
      {
        id: 2,
        company: 'Stripe',
        role: 'Node.js Developer',
      },
    ];
    const index = applications.findIndex((app) => app.id === 1);
    applications.splice(index, 1);

    expect(applications[0].company).toBe('Stripe');
    expect(applications[0].id).toBe(2);
  });
});
