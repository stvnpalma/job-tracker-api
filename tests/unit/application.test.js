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

  // ── PUT /applications/:id logic tests ─────────────────────
  describe("updating an application", () => {
    it("finds the correctly index by id", () => {
      const application = [
        {
          id: 1,
          company: "Google",
        },
        {
          id: 2,
          company: "Stripe",
        },
      ];
    });
    const index = applications.findIndex((app) => app.id === 2);
  });
  it("returns -1 when id does not exist", () => {
    const application = {
      id: 1,
      company: "Google",
    };
    const index = applications.findIndex((app) => app.id === 99);
    expect(index).toBe(-1);
  });
  it("accepts a valid status", () => {
    const validateStatuses = ["applied", "interview", "offer", "rejected"];
    const incoming = "interview";

    expect(validateStatuses.includes(incoming)).toBe(true);
  });
  it("merge update without overwriting unrelated fields", () => {
    const existing = {
      id: 1,
      company: "Google",
      role: "Backend Engineer",
      status: "applied",
      notes: "null",
    };
    const update = { status: "interview", notes: "Phone screen done" };
    const result = { ...existing, ...update, id: existing.id };

    expect(result.status).toBe("interview");
    expect(result.notes).toBe("Phone screen done");
    expect(result.company).toBe("Google");
    expect(result.id).toBe(1);
  });
});
