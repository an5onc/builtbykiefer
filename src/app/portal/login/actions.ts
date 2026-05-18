"use server";

import { redirect } from "next/navigation";
import { buildClientAuthCallbackUrl, parseClientLoginFormData, portalLoginUrl } from "@/lib/admin/client-auth";
import { createClient } from "@/lib/supabase/server";

export async function signInClient(formData: FormData) {
  const parsed = parseClientLoginFormData(formData);

  if (!parsed.ok) {
    redirect(portalLoginUrl({ error: parsed.reason, next: "/portal" }));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    redirect(portalLoginUrl({ error: "Invalid client portal credentials.", next: parsed.data.next }));
  }

  redirect(parsed.data.next);
}

export async function sendClientMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = String(formData.get("next") ?? "/portal");

  if (!email) {
    redirect(portalLoginUrl({ error: "Email is required for a sign-in link.", next }));
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: buildClientAuthCallbackUrl(appUrl, next.startsWith("/") ? next : "/portal"),
    },
  });

  if (error) {
    redirect(portalLoginUrl({ error: "Could not send a client portal sign-in link.", next }));
  }

  redirect(portalLoginUrl({ notice: "Check your email for a Kiefer Built client portal sign-in link.", next }));
}

export async function signOutClient() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/portal/login");
}
