"use client";

import { landLeadStatusOptions } from "@/lib/land-leads/constants";
import type { LandLeadStatus } from "@/lib/land-leads/types";

/**
 * Inline status <select> that submits its enclosing form on change. The form's
 * server action (bound to the lead id) does the persistence.
 */
export default function LandLeadStatusSelect({
  defaultValue,
}: {
  defaultValue: LandLeadStatus;
}) {
  return (
    <select
      name="status"
      defaultValue={defaultValue}
      onChange={(event) => event.currentTarget.form?.requestSubmit()}
      className="w-full rounded-md border border-black/10 bg-[#f9f6f0] px-2 py-1.5 text-xs outline-none transition focus:border-[#b92516]"
      aria-label="Lead status"
    >
      {landLeadStatusOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
