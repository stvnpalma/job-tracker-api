// This tests the LOGIC of finding an application
// not the HTTP layer — that comes later with integration tests
// @ts-nocheck

const applications = [
  { id: 1, company: "Google", role: "Backend Engineer", status: "applied" },
  { id: 2, company: "Stripe", role: "Node.js Developer", status: "interview" },
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

  // ── POST /applications logic tests ────────────────────────

  describe("validating a new application", () => {
    test("detects missing required fields", () => {
      const body = { company: "Netflix" };
      const requiredFields = ["company", "role", "status", "appliedDate"];
      const missingFields = [];

      for (const field of requiredFields) {
        if (!body[field]) {
          missingFields.push(field);
        }
      }

      expect(missingFields).toContain("role");
      expect(missingFields).toContain("status");
      expect(missingFields).toContain("appliedDate");
      expect(missingFields).not.toContain("company");
    });

    test("detects a duplicate application", () => {
      const existing = [{ id: 1, company: "Apple", role: "Backend Engineer" }];

      const incoming = { company: "Apple", role: "Backend Engineer" };
      let alreadyApplied = false;

      for (const app of existing) {
        if (app.company === incoming.company && app.role === incoming.role) {
          alreadyApplied = true;
        }
      }

      expect(alreadyApplied).toBe(true);
    });

    test("allows application to same company for different role", () => {
      const existing = [{ id: 1, company: "Apple", role: "Backend Engineer" }];

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

  // ── PUT /applications/:id logic tests ─────────────────────

  describe("updating an application", () => {
    test("finds the correct index by id", () => {
      const applications = [
        { id: 1, company: "Google" },
        { id: 2, company: "Stripe" },
      ];

      const index = applications.findIndex((app) => app.id === 2);
      expect(index).toBe(1);
    });

    test("returns -1 when id does not exist", () => {
      const applications = [{ id: 1, company: "Google" }];

      const index = applications.findIndex((app) => app.id === 99);
      expect(index).toBe(-1);
    });

    test("rejects an invalid status", () => {
      const validStatuses = ["applied", "interview", "offer", "rejected"];
      const incoming = "pending";

      expect(validStatuses.includes(incoming)).toBe(false);
    });

    test("accepts a valid status", () => {
      const validStatuses = ["applied", "interview", "offer", "rejected"];
      const incoming = "interview";

      expect(validStatuses.includes(incoming)).toBe(true);
    });

    test("merges update without overwriting unrelated fields", () => {
      const existing = {
        id: 1,
        company: "Google",
        role: "Backend Engineer",
        status: "applied",
        notes: null,
      };

      const update = { status: "interview", notes: "Phone screen done" };

      const result = { ...existing, ...update, id: existing.id };

      expect(result.status).toBe("interview");
      expect(result.notes).toBe("Phone screen done");
      expect(result.company).toBe("Google"); // untouched
      expect(result.id).toBe(1); // id never changes
    });
  });

  // ── DELETE /applications/:id logic tests ──────────────────

  describe("deleting an application", () => {
    test("removes the correct application by index", () => {
      const applications = [
        { id: 1, company: "Google", role: "Backend Engineer" },
        { id: 2, company: "Stripe", role: "Node.js Developer" },
        { id: 3, company: "Netflix", role: "Backend Engineer" },
      ];

      const index = applications.findIndex((app) => app.id === 2);
      applications.splice(index, 1);

      expect(applications.length).toBe(2);
      expect(applications.find((app) => app.id === 2)).toBeUndefined();
    });

    test("does not remove anything when id is not found", () => {
      const applications = [
        { id: 1, company: "Google" },
        { id: 2, company: "Stripe" },
      ];

      const index = applications.findIndex((app) => app.id === 99);
      expect(index).toBe(-1);

      // confirm nothing was removed
      expect(applications.length).toBe(2);
    });

    test("remaining applications are intact after delete", () => {
      const applications = [
        { id: 1, company: "Google", role: "Backend Engineer" },
        { id: 2, company: "Stripe", role: "Node.js Developer" },
      ];

      const index = applications.findIndex((app) => app.id === 1);
      applications.splice(index, 1);

      expect(applications[0].company).toBe("Stripe");
      expect(applications[0].id).toBe(2);
    });
  });
});
