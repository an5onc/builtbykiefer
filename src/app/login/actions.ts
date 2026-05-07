"use server";

import { redirect } from "next/navigation";
import { getAllowedAdminEmail, isDemoMode } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

function loginUrl(error?: string) {
  const url = new URL("/login", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");

  if (error) {
    url.searchParams.set("error", error);
  }

  return `${url.pathname}${url.search}`;
}

export async function signIn(formData: FormData) {
  if (isDemoMode()) {
    redirect("/admin");
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const allowedAdminEmail = getAllowedAdminEmail()?.toLowerCase();

  if (!email || !password) {
    redirect(loginUrl("Email and password are required."));
  }

  if (allowedAdminEmail && email !== allowedAdminEmail) {
    redirect(loginUrl("This account is not allowed to access the admin console."));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(loginUrl("Invalid admin credentials."));
  }

  redirect("/admin");
}

export async function signOut() {
  if (!isDemoMode()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/login");
}
