"use client";

import { useFormStatus } from "react-dom";
import { UploadCloud } from "lucide-react";
import {
  LAND_LEAD_MAX_UPLOAD_BYTES,
  LAND_LEAD_MAX_UPLOAD_LABEL,
} from "@/lib/land-leads/constants";

/** Submit button for the CSV upload form with a pending state. */
export default function LandLeadUploadButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        const form = event.currentTarget.form;
        const fileInput = form?.elements.namedItem("file");

        if (!(fileInput instanceof HTMLInputElement) || fileInput.files?.length !== 1) {
          return;
        }

        const file = fileInput.files[0];

        if (file.size <= LAND_LEAD_MAX_UPLOAD_BYTES) {
          fileInput.setCustomValidity("");
          return;
        }

        event.preventDefault();
        fileInput.setCustomValidity(
          `Choose a CSV file ${LAND_LEAD_MAX_UPLOAD_LABEL} or smaller.`,
        );
        fileInput.reportValidity();
      }}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-[#b92516] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <UploadCloud className="size-4" />
      {pending ? "Importing…" : "Import CSV"}
    </button>
  );
}
