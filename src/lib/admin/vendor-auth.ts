import type { Vendor } from "./types";
import { getTrimmedValue } from "./form-utils";
import { createClient } from "@/lib/supabase/server";

export interface VendorLoginInput {
  email: string;
  password: string;
  next: string;
}

export type VendorLoginParseResult =
  | { ok: true; data: VendorLoginInput }
  | { ok: false; reason: string };

export interface VendorSession {
  email: string;
  vendor: Vendor;
}

export function normalizeVendorEmail(email: string) {
  return email.trim().toLowerCase();
}

export function canUseVendorSession({ userEmail, vendor }: { userEmail: string | null | undefined; vendor: Vendor | null | undefined }) {
  if (!userEmail || !vendor || vendor.status !== "active" || !vendor.portalAccess) {
    return false;
  }

  const normalizedUserEmail = normalizeVendorEmail(userEmail);
  const normalizedAuthEmail = normalizeVendorEmail(vendor.authEmail || vendor.email);

  return normalizedUserEmail === normalizedAuthEmail;
}

export function parseVendorLoginFormData(formData: FormData): VendorLoginParseResult {
  const email = normalizeVendorEmail(getTrimmedValue(formData, "email"));
  const password = String(formData.get("password") ?? "");
  const next = getTrimmedValue(formData, "next") || "/vendor";

  if (!email || !password) {
    return { ok: false, reason: "Email and password are required." };
  }

  return {
    ok: true,
    data: {
      email,
      password,
      next: next.startsWith("/") ? next : "/vendor",
    },
  };
}

export async function getCurrentVendor(): Promise<VendorSession | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  const normalizedEmail = normalizeVendorEmail(user.email);
  const { data: vendors, error } = await supabase
    .from("vendors")
    .select("id, name, company_type, trade, email, auth_email, phone, status, portal_access, notes, created_at")
    .eq("status", "active")
    .eq("portal_access", true)
    .or(`auth_email.eq.${normalizedEmail},email.eq.${normalizedEmail}`);

  if (error || !vendors?.length) {
    return null;
  }

  const vendor = vendors
    .map((row) => ({
      id: row.id,
      name: row.name,
      companyType: row.company_type,
      trade: row.trade,
      email: row.email,
      authEmail: row.auth_email ?? "",
      phone: row.phone,
      status: row.status,
      portalAccess: row.portal_access,
      notes: row.notes,
      createdAt: row.created_at,
    }) satisfies Vendor)
    .find((candidate) => canUseVendorSession({ userEmail: user.email, vendor: candidate }));

  return vendor ? { email: user.email, vendor } : null;
}
