"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, FileText, Loader2, Upload } from "lucide-react";
import { businessContact } from "@/lib/public-site/business";
import { CAREER_ATTEMPT_HEADER, careerDetails, careerPositions, careerSchema, resumeInputError } from "@/lib/careers/application";
import { selectCareerAttempt, type CareerAttempt } from "@/lib/careers/attempt";

const subscribe = () => () => {};
const inputClass = "w-full min-w-0 rounded-md border border-[#c4bbb0] bg-white px-4 py-3 text-base text-[#171717] outline-none focus:border-[#a91f16] focus:ring-2 focus:ring-[#a91f16]/20";

export default function CareersApplicationForm() {
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const status = useRef<HTMLDivElement>(null), fileInput = useRef<HTMLInputElement>(null), selectable = useRef<HTMLTextAreaElement>(null);
  const sending = useRef(false), attempt = useRef<CareerAttempt | null>(null);
  useEffect(() => { if (message) status.current?.focus(); }, [message]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();if (sending.current) return;
    const form = event.currentTarget, data = new FormData(form);
    const parsed = careerSchema.safeParse(Object.fromEntries(["name", "email", "phone", "position", "note", "company"].map(key => [key, String(data.get(key) || "")])));
    const fileError = resumeInputError(file);
    setCopyMessage("");setMessage("");
    if (!parsed.success || fileError || !file) { setState("error");setMessage(fileError || "Please check your contact details and position.");return; }
    const selectedFile = file;
    setDetails(careerDetails(parsed.data, selectedFile.name));
    sending.current = true;setState("sending");
    try {
      attempt.current = await selectCareerAttempt(attempt.current, parsed.data, selectedFile);
      const body = new FormData();for (const [key, value] of Object.entries(parsed.data)) body.set(key, value);body.set("resume", selectedFile);
      const response = await fetch("/api/career-application", { method: "POST", headers: { [CAREER_ATTEMPT_HEADER]: attempt.current.id }, body, signal: AbortSignal.timeout(18000) });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true || result?.emailSent !== true) {
        setState("error");setMessage(response.status === 429 ? "There have been too many recent applications. Your details and résumé are still here. Please wait before trying again, or call the team." : typeof result?.error === "string" ? result.error : "We couldn't confirm your application. It may already have reached the team. Your details and résumé are still here; please call to check or retry this unchanged application.");return;
      }
      setState("success");setMessage("Your application and résumé were accepted for email delivery to Kiefer Built. Thank you for your interest in our team.");
      setDetails("");setFile(null);attempt.current = null;form.reset();
    } catch (error) {
      setState("error");setMessage(error instanceof Error && !["TypeError", "TimeoutError", "AbortError"].includes(error.name) ? error.message : "We couldn't confirm your application. It may already have reached the team. Your details and résumé are still here; please call to check or retry this unchanged application.");
    } finally { sending.current = false; }
  }

  async function copy() {
    try { await navigator.clipboard.writeText(details);setCopyMessage("Application details copied. Attach your résumé manually if you email them."); }
    catch { setCopyMessage("Copy wasn't available. Select and copy the details below, then attach your résumé manually.");selectable.current?.focus();selectable.current?.select(); }
  }

  return (
    <section id="apply" tabIndex={-1} aria-labelledby="apply-heading" className="scroll-mt-24 bg-[#f9f6f0] px-6 py-20 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1fr] lg:gap-20">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#a91f16]">Careers at Kiefer Built</p>
          <h2 id="apply-heading" tabIndex={-1} className="mt-4 text-4xl font-bold leading-tight outline-offset-4 md:text-5xl">Bring your skills.<br />Build with us.</h2>
          <p className="mt-6 max-w-lg text-base leading-8 text-[#655c52]">Tell us a little about yourself and attach your résumé. You can apply for a role below or introduce yourself for future opportunities.</p>
          <div className="mt-8 flex items-start gap-3 rounded-md border border-black/10 bg-white p-5">
            <FileText className="mt-1 h-5 w-5 shrink-0 text-[#a91f16]" aria-hidden="true" />
            <p className="text-sm leading-7 text-[#655c52]">One PDF or DOCX, up to 3 MB. Please leave out sensitive personal information, such as Social Security or bank account numbers.</p>
          </div>
          <p className="mt-8 text-sm leading-7 text-[#655c52]">Questions about applying? Call <a href={businessContact.telHref} className="font-bold text-[#171717] underline underline-offset-4">{businessContact.phone}</a> or email <a href={businessContact.mailtoHref} className="whitespace-nowrap font-bold text-[#171717] underline underline-offset-4">{businessContact.email}</a>.</p>
        </div>
        <form method="post" action="/api/career-application" encType="multipart/form-data" onSubmit={submit} aria-label="Career application" className="min-w-0 rounded-lg border border-black/10 bg-white p-6 shadow-sm md:p-8">
          <p className="mb-6 text-sm text-[#655c52]">Fields marked * are required.</p>
          <fieldset disabled={!ready || state === "sending"} className="min-w-0 space-y-5 disabled:opacity-70">
            <div className="grid gap-5 sm:grid-cols-2">
              <div><label htmlFor="career-name" className="mb-2 block text-sm font-semibold">Full name *</label><input id="career-name" name="name" autoComplete="name" maxLength={120} required className={inputClass} /></div>
              <div><label htmlFor="career-email" className="mb-2 block text-sm font-semibold">Email *</label><input id="career-email" name="email" type="email" autoComplete="email" maxLength={254} required className={inputClass} /></div>
              <div><label htmlFor="career-phone" className="mb-2 block text-sm font-semibold">Phone *</label><input id="career-phone" name="phone" type="tel" autoComplete="tel" maxLength={50} required className={inputClass} /></div>
              <div><label htmlFor="career-position" className="mb-2 block text-sm font-semibold">Position of interest *</label><select id="career-position" name="position" required defaultValue="" className={inputClass}><option value="" disabled>Select a position</option>{careerPositions.map(position => <option key={position}>{position}</option>)}</select></div>
            </div>
            <div><label htmlFor="career-note" className="mb-2 block text-sm font-semibold">Anything you’d like us to know? <span className="font-normal text-[#655c52]">(optional)</span></label><textarea id="career-note" name="note" maxLength={3000} rows={4} className={inputClass} /></div>
            <div>
              <label htmlFor="career-resume" className="mb-2 flex items-center gap-2 text-sm font-semibold"><Upload className="h-4 w-4" aria-hidden="true" /> Résumé *</label>
              <input ref={fileInput} id="career-resume" name="resume" type="file" required accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" aria-describedby="career-file-help" className={`${inputClass} overflow-hidden p-2 file:mr-3 file:rounded file:border-0 file:bg-[#f4efe7] file:px-3 file:py-2 file:font-semibold file:text-[#171717]`} onChange={event => { const next = event.target.files?.[0] || null;setFile(next);const error = next && resumeInputError(next);if (error) { setMessage(error);setState("error"); } else { setMessage("");setState("idle"); } }} />
              <p id="career-file-help" className="mt-2 text-xs leading-6 text-[#655c52]">PDF or DOCX · Maximum 3 MB</p>
              {file ? <div className="mt-2 flex min-w-0 items-start justify-between gap-3 text-sm"><span className="break-all text-[#655c52]">Selected: {file.name}</span><button type="button" className="shrink-0 font-semibold text-[#a91f16] underline underline-offset-4" onClick={() => { setFile(null);if (fileInput.current) fileInput.current.value = "";setMessage("");setState("idle"); }}>Remove file</button></div> : null}
            </div>
            <div aria-hidden="true" className="hidden"><label htmlFor="career-company">Company</label><input id="career-company" name="company" autoComplete="off" tabIndex={-1} /></div>
            <p className="text-xs leading-6 text-[#655c52]">Your application and résumé will be emailed to Kiefer Built for recruitment review. <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">How we use your information (opens in a new tab)</a>. An unfinished application stays only on this page; refreshing or leaving can lose it, including the selected file.</p>
            <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-md bg-[#a91f16] px-6 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#89180f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a91f16] disabled:cursor-wait" disabled={!ready || state === "sending"}>
              {state === "sending" ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />Submitting…</> : <>Submit Application<ArrowRight className="h-4 w-4" aria-hidden="true" /></>}
            </button>
          </fieldset>
          {!ready ? <p className="mt-4 text-sm leading-6 text-[#655c52]">The online form needs JavaScript. If it doesn’t become available, please call or email the team above.</p> : null}
          {message ? <div ref={status} tabIndex={-1} role={state === "success" ? "status" : "alert"} className={`mt-6 rounded-md border p-4 text-sm leading-7 outline-offset-4 ${state === "success" ? "border-green-700/30 bg-green-50 text-green-950" : "border-[#a91f16]/30 bg-red-50 text-[#7d1710]"}`}>{state === "success" ? <CheckCircle2 className="mb-2 h-5 w-5" aria-hidden="true" /> : null}{message}</div> : null}
          {state === "error" && details ? <div className="mt-5 space-y-3 border-t border-black/10 pt-5" role="region" aria-label="Recover your application">
            <button type="button" onClick={copy} className="font-semibold text-[#a91f16] underline underline-offset-4">Copy application details</button>
            <p className="text-xs leading-6 text-[#655c52]">Copying doesn’t submit your application. Email {businessContact.email} and attach your résumé manually, or call to check on an uncertain submission.</p>
            {copyMessage ? <p role="status" className="text-sm leading-6">{copyMessage}</p> : null}
            <label htmlFor="career-recovery" className="block text-sm font-semibold">Application details to copy</label><textarea ref={selectable} id="career-recovery" readOnly value={details} rows={8} className={`${inputClass} text-sm`} />
          </div> : null}
        </form>
      </div>
    </section>
  );
}
