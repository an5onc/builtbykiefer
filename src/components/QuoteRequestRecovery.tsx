"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Copy } from "lucide-react";
import { businessContact } from "@/lib/public-site/business";

type CopyState = "idle" | "copying" | "copied" | "unavailable";

export default function QuoteRequestRecovery({ text }: { text: string }) {
  const detailsId = useId();
  const detailsRef = useRef<HTMLTextAreaElement>(null);
  const copyingRef = useRef(false);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (showDetails && copyState === "unavailable") {
      detailsRef.current?.focus();
      detailsRef.current?.select();
    }
  }, [showDetails, copyState]);

  async function copyDetails() {
    if (copyingRef.current) return;
    copyingRef.current = true;
    setCopyState("copying");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
    } catch {
      setCopyState("unavailable");
      setShowDetails(true);
    } finally {
      copyingRef.current = false;
    }
  }

  return (
    <section className="rounded-md border border-black/10 bg-[#f9f6f0] p-4 text-sm leading-6 text-[#171717]" aria-label="Recover your quote request">
      <p className="font-bold">Keep a copy of your request</p>
      <p className="mt-1">These are the details from your last submission attempt. You can paste them into an email to {businessContact.email}.</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={copyDetails}
          disabled={copyState === "copying"}
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[#c9281c] px-3 py-2 font-bold text-[#a91f16] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9281c] disabled:opacity-70"
        >
          <Copy className="size-4" aria-hidden="true" />
          {copyState === "copying" ? "Copying details" : "Copy request details"}
        </button>
        <button
          type="button"
          aria-expanded={showDetails}
          aria-controls={detailsId}
          onClick={() => setShowDetails((shown) => !shown)}
          className="min-h-11 rounded-md px-3 py-2 font-bold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9281c]"
        >
          {showDetails ? "Hide request details" : "Show request details"}
        </button>
      </div>
      <p className="mt-2" role="status">
        {copyState === "copied"
          ? "Request details copied. Copying does not send your request."
          : copyState === "unavailable"
            ? "Automatic copying is unavailable. Select and copy the details below, then paste them into your email."
            : "Copying or viewing these details does not send your request."}
      </p>
      <div id={detailsId} hidden={!showDetails} className="mt-3">
        <label htmlFor={`${detailsId}-text`} className="block font-bold">Request details to copy</label>
        <textarea
          id={`${detailsId}-text`}
          ref={detailsRef}
          readOnly
          value={text}
          rows={10}
          spellCheck={false}
          onFocus={(event) => event.currentTarget.select()}
          className="mt-2 w-full rounded-md border border-black/20 bg-white p-3 text-sm leading-6 focus:outline-2 focus:outline-offset-2 focus:outline-[#c9281c]"
        />
      </div>
    </section>
  );
}
