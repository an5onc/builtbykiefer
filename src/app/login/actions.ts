"use server";

import { redirect } from "next/navigation";
import { buildAuthCallbackUrl, getAllowedAdminEmail, isDemoMode } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

function loginUrl({
  error,
  notice,
  next,
}: {
  error?: string;
  notice?: string;
  next?: string;
} = {}) {
  const url = new URL("/login", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");

  if (error) {
    url.searchParams.set("error", error);
  }

  if (notice) {
    url.searchParams.set("notice", notice);
  }

  if (next) {
    url.searchParams.set("next", next);
  }

  return `${url.pathname}${url.search}`;
}

export async function signIn(formData: FormData) {
  if (isDemoMode()) {
    redirect("/admin");
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  const allowedAdminEmail = getAllowedAdminEmail()?.toLowerCase();

  if (!email || !password) {
    redirect(loginUrl({ error: "Email and password are required.", next }));
  }

  if (allowedAdminEmail && email !== allowedAdminEmail) {
    redirect(loginUrl({ error: "This account is not allowed to access the admin console.", next }));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(loginUrl({ error: "Invalid admin credentials.", next }));
  }

  redirect(next.startsWith("/") ? next : "/admin");
}

export async function sendMagicLink(formData: FormData) {
  if (isDemoMode()) {
    redirect("/admin");
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = String(formData.get("next") ?? "/admin");
  const allowedAdminEmail = getAllowedAdminEmail()?.toLowerCase();

  if (!email) {
    redirect(loginUrl({ error: "Email is required for a sign-in link.", next }));
  }

  if (allowedAdminEmail && email !== allowedAdminEmail) {
    redirect(loginUrl({ error: "This account is not allowed to access the admin console.", next }));
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: buildAuthCallbackUrl(appUrl, next),
    },
  });

  if (error) {
    redirect(loginUrl({ error: "Could not send a sign-in link. Check Supabase Auth email settings.", next }));
  }

  redirect(loginUrl({ notice: "Check your email for a Kiefer Built sign-in link.", next }));
}

export async function signOut() {
  if (!isDemoMode()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/login");
}
