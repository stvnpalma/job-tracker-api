//@ts-ignore

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
    status: "interview",
  },
];

describe("GET /applications", () => {
  it("returns all applications", () => {
    expect(applications.length).toBe(2);
    expect(Array.isArray(applications)).toBe(true);
  });
});

describe("GET /applications/:id", () => {
  it("returns the correct application when id exists", () => {
    const result = applications.find((app) => app.id === 1);
    expect(result?.company).toBe("Google");
    expect(result?.role).toBe("Backend Engineer");
  });
});

describe("returns undefined when application does not exist", () => {
  const result = applications.find((app) => app.id === 99);
  expect(result).toBe(undefined);
});
