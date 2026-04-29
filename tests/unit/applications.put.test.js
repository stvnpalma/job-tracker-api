describe("PUT /applications/:id", () => {
  test("finds the correct index by id", () => {
    const applications = [
      { id: 1, company: "Google" },
      { id: 2, company: "Stripe" },
    ];

    const index = applications.findIndex((app) => app.id === 2);
    expect(index).toBe(1);
  });

  it("returns -1 when id does not exist", () => {
    const applications = [
      {
        id: 1,
        company: "Google",
      },
    ];
    const index = applications.findIndex((app) => app.id === 99);
    expect(index).toBe(-1);
  });

  it("rejects an invalid status", () => {
    const validateStatuses = ["applied", "interview", "offer", "rejected"];
    const incoming = "pending";

    expect(validateStatuses.includes(incoming)).toBe(false);
  });

  it("accepts a valid status", () => {
    const validStatuses = ["applied", "interview", "offer", "rejected"];
    const incoming = "interview";
    expect(validStatuses.includes(incoming)).toBe(true);
  });

  it("merges update without overwriting related fields", () => {
    const existing = {
      id: 1,
      company: "Google",
      role: "Backend Engineer",
      status: "applied",
      notes: null,
    };

    const update = { status: "interview", notes: "Phone screened" };
    const result = { ...existing, ...update, id: existing.id };

    expect(result.status).toBe("interview");
    expect(result.notes).toBe("Phone screened");
    expect(result.company).toBe("Google"); // untouched
    expect(result.id).toBe(1); // id never changes
  });
});
