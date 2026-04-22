// This tests the LOGIC of finding an application
// not the HTTP layer — that comes later with integration tests

const applications = [
  {
    id: 1,
    company: "Google",
    role: "Backend Engineer",
    status: "applied",
  },
  {
    id: 2,
    company: "Stripe",
    role: "Node.js Developer",
    status: "applied",
  },
];

// describe groups related tests together
describe("finding an application by id", () => {
  // test() defines one specific scenario
  test("returns the correct application when id exists", () => {
    const id = 1;
    const result = applications.find((app) => app.id === id);

    // expect().toBe() is how you assert something is true
    expect(result?.company).toBe("Google");
    expect(result?.role).toBe("Backend Engineer");
  });

  test("returns undefined when id does not exist", () => {
    const id = 99;
    const result = applications.find((app) => app.id === id);

    expect(result).toBeUndefined();
  });
});
