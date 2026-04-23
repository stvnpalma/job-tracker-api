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

// ── POST /applications logic tests ────────────────────────

describe("validating a new application", () => {
  test("detects missing required fields", () => {
    const body = { company: "Netflix" };
    const requiredFields = ["company", "role", "status", "appliedDate"];
    const missingFields = [];

    for (const field of requiredFields) {
      if (!(field in body)) {
        missingFields.push(field);
      }
    }

    expect(missingFields).toContain("role");
    expect(missingFields).toContain("status");
    expect(missingFields).toContain("appliedDate");
    expect(missingFields).not.toContain("company");
  });

  it("detects a duplicate application", () => {
    const existing = [
      {
        id: 1,
        company: "Apple",
        role: "Backend Engineer",
      },
    ];
    const incoming = { company: "Apple", role: "Backend Engineer" };
    let alreadyApplied = false;

    for (const app of existing) {
      if (app.company === incoming.company && app.role === incoming.role) {
        alreadyApplied = true;
      }
    }
    expect(alreadyApplied).toBe(true);
  });

  it("allows applications for the same company for different roles", () => {
    const existing = [
      {
        id: 1,
        company: "Apple",
        role: "Backend Engineer",
      },
    ];
    const incoming = { company: "Apple", role: "Frontend Engineer" };
    let alreadyApplied = false;

    for (const app of existing) {
      if (app.company === incoming.company && app.role === incoming.role) {
        alreadyApplied = true;
      }
    }
    expect(alreadyApplied).toBe(false);
  });
});
