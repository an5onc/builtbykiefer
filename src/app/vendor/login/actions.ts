"use server";

import { redirect } from "next/navigation";
import { buildAuthCallbackUrl } from "@/lib/admin/auth";
import { parseVendorLoginFormData } from "@/lib/admin/vendor-auth";
import { createClient } from "@/lib/supabase/server";

function vendorLoginUrl({
  error,
  notice,
  next,
}: {
  error?: string;
  notice?: string;
  next?: string;
} = {}) {
  const url = new URL("/vendor/login", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");

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

export async function signInVendor(formData: FormData) {
  const parsed = parseVendorLoginFormData(formData);

  if (!parsed.ok) {
    redirect(vendorLoginUrl({ error: parsed.reason, next: "/vendor" }));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    redirect(vendorLoginUrl({ error: "Invalid vendor credentials.", next: parsed.data.next }));
  }

  redirect(parsed.data.next);
}

export async function sendVendorMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = String(formData.get("next") ?? "/vendor");

  if (!email) {
    redirect(vendorLoginUrl({ error: "Email is required for a sign-in link.", next }));
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: buildAuthCallbackUrl(appUrl, next.startsWith("/") ? next : "/vendor"),
    },
  });

  if (error) {
    redirect(vendorLoginUrl({ error: "Could not send a vendor sign-in link.", next }));
  }

  redirect(vendorLoginUrl({ notice: "Check your email for a Kiefer Built vendor sign-in link.", next }));
}
