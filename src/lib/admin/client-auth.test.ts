import { describe, expect, it } from "vitest";
import { canUseClientSession, parseClientLoginFormData } from "./client-auth";
import type { Client } from "./types";

function formData(values: Record<string, string>) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

const client: Client = {
  id: "client-1",
  name: "Avery Thompson",
  email: "avery@example.com",
  phone: "(970) 555-0181",
  authUserId: "auth-user-1",
};

describe("client auth helpers", () => {
  it("allows clients by linked Supabase auth user id", () => {
    expect(
      canUseClientSession({
        userId: "auth-user-1",
        userEmail: "different@example.com",
        client,
      }),
    ).toBe(true);
  });

  it("falls back to client email when no auth user id is linked", () => {
    expect(
      canUseClientSession({
        userId: "auth-user-2",
        userEmail: "AVERY@example.com",
        client: { ...client, authUserId: null },
      }),
    ).toBe(true);
  });

  it("rejects mismatched client sessions", () => {
    expect(
      canUseClientSession({
        userId: "auth-user-2",
        userEmail: "avery@example.com",
        client,
      }),
    ).toBe(false);
  });

  it("parses client login form data", () => {
    expect(
      parseClientLoginFormData(
        formData({
          email: "  AVERY@example.com  ",
          password: "temporary-password",
          next: "/portal/projects/project-1",
        }),
      ),
    ).toEqual({
      ok: true,
      data: {
        email: "avery@example.com",
        password: "temporary-password",
        next: "/portal/projects/project-1",
      },
    });
  });

  it("keeps unsafe next values inside the client portal", () => {
    expect(
      parseClientLoginFormData(
        formData({
          email: "avery@example.com",
          password: "temporary-password",
          next: "https://example.com",
        }),
      ),
    ).toEqual({
      ok: true,
      data: {
        email: "avery@example.com",
        password: "temporary-password",
        next: "/portal",
      },
    });
  });
});
