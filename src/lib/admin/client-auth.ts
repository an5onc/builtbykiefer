import { buildAuthCallbackUrl, isDemoMode } from "./auth";
import { clients as demoClients } from "./demo-data";
import type { Client } from "./types";
import { getTrimmedValue } from "./form-utils";
import { createClient } from "@/lib/supabase/server";

export interface ClientLoginInput {
  email: string;
  password: string;
  next: string;
}

export type ClientLoginParseResult =
  | { ok: true; data: ClientLoginInput }
  | { ok: false; reason: string };

export interface ClientSession {
  email: string;
  client: Client;
  isDemo: boolean;
}

export function normalizeClientEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizePortalNextPath(next: string) {
  return next.startsWith("/portal") ? next : "/portal";
}

export function portalLoginUrl({
  error,
  notice,
  next,
}: {
  error?: string;
  notice?: string;
  next?: string;
} = {}) {
  const url = new URL("/portal/login", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");

  if (error) {
    url.searchParams.set("error", error);
  }

  if (notice) {
    url.searchParams.set("notice", notice);
  }

  if (next) {
    url.searchParams.set("next", normalizePortalNextPath(next));
  }

  return `${url.pathname}${url.search}`;
}

export function parseClientLoginFormData(formData: FormData): ClientLoginParseResult {
  const email = normalizeClientEmail(getTrimmedValue(formData, "email"));
  const password = String(formData.get("password") ?? "");
  const next = getTrimmedValue(formData, "next") || "/portal";

  if (!email || !password) {
    return { ok: false, reason: "Email and password are required." };
  }

  return {
    ok: true,
    data: {
      email,
      password,
      next: normalizePortalNextPath(next),
    },
  };
}

export function canUseClientSession({
  userId,
  userEmail,
  client,
}: {
  userId: string | null | undefined;
  userEmail: string | null | undefined;
  client: Client | null | undefined;
}) {
  if (!userEmail || !client) {
    return false;
  }

  if (client.authUserId && userId) {
    return client.authUserId === userId;
  }

  return normalizeClientEmail(userEmail) === normalizeClientEmail(client.email);
}

export function buildClientAuthCallbackUrl(origin: string, next = "/portal") {
  return buildAuthCallbackUrl(origin, normalizePortalNextPath(next));
}

export async function getCurrentClient(): Promise<ClientSession | null> {
  if (isDemoMode()) {
    const client = demoClients[0];
    return client
      ? {
          email: client.email,
          client,
          isDemo: true,
        }
      : null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  const normalizedEmail = normalizeClientEmail(user.email);
  const { data: clients, error } = await supabase
    .from("clients")
    .select("id, name, email, phone, auth_user_id")
    .or(`auth_user_id.eq.${user.id},email.eq.${normalizedEmail}`);

  if (error || !clients?.length) {
    return null;
  }

  const client = clients
    .map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      authUserId: row.auth_user_id ?? null,
    }) satisfies Client)
    .find((candidate) =>
      canUseClientSession({
        userId: user.id,
        userEmail: user.email,
        client: candidate,
      }),
    );

  return client
    ? {
        email: user.email,
        client,
        isDemo: false,
      }
    : null;
}
