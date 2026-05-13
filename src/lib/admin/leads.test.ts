import { describe, expect, it } from "vitest";
import { parseLeadCreateFormData, parseLeadUpdateFormData } from "./leads";

describe("lead workflow helpers", () => {
  it("normalizes valid lead create form data with a new status", () => {
    const formData = new FormData();
    formData.set("name", "  Jordan Lee  ");
    formData.set("email", "  JORDAN@example.com ");
    formData.set("phone", " (970) 555-0100 ");
    formData.set("projectType", " Custom Home ");
    formData.set("budgetRange", " $800k-$1M ");
    formData.set("nextFollowUp", "2026-05-22");
    formData.set("notes", "  Needs first consultation. ");

    expect(parseLeadCreateFormData(formData)).toEqual({
      name: "Jordan Lee",
      email: "jordan@example.com",
      phone: "(970) 555-0100",
      projectType: "Custom Home",
      budgetRange: "$800k-$1M",
      status: "new",
      nextFollowUp: "2026-05-22",
      notes: "Needs first consultation.",
    });
  });

  it("requires contact fields for new leads", () => {
    const formData = new FormData();
    formData.set("name", "");
    formData.set("email", "jordan@example.com");
    formData.set("phone", "(970) 555-0100");
    formData.set("projectType", "Custom Home");
    formData.set("budgetRange", "$800k-$1M");
    formData.set("nextFollowUp", "2026-05-22");
    formData.set("notes", "Needs first consultation.");

    expect(() => parseLeadCreateFormData(formData)).toThrow("Lead name is required.");
  });

  it("normalizes valid lead update form data", () => {
    const formData = new FormData();
    formData.set("status", "proposal");
    formData.set("nextFollowUp", "2026-05-18");
    formData.set("notes", "  Send revised budget range.  ");

    expect(parseLeadUpdateFormData(formData)).toEqual({
      status: "proposal",
      nextFollowUp: "2026-05-18",
      notes: "Send revised budget range.",
    });
  });

  it("rejects unsupported lead statuses", () => {
    const formData = new FormData();
    formData.set("status", "archived");
    formData.set("nextFollowUp", "2026-05-18");
    formData.set("notes", "Follow up.");

    expect(() => parseLeadUpdateFormData(formData)).toThrow("Choose a valid lead status.");
  });

  it("requires ISO date input for follow-up dates", () => {
    const formData = new FormData();
    formData.set("status", "qualified");
    formData.set("nextFollowUp", "May 18");
    formData.set("notes", "Follow up.");

    expect(() => parseLeadUpdateFormData(formData)).toThrow("Use a valid follow-up date.");
  });
});
