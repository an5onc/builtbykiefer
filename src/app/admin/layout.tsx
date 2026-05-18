import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Kiefer Built Operations",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/login");
  }

  return children;
}
