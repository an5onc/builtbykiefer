const styles: Record<string, string> = {
  active: "bg-green-50 text-green-700 ring-green-200",
  inactive: "bg-neutral-100 text-neutral-500 ring-neutral-200",
  planning: "bg-[#b92516]/10 text-[#b92516] ring-[#b92516]/20",
  completed: "bg-neutral-100 text-neutral-700 ring-neutral-200",
  draft: "bg-[#b92516]/10 text-[#b92516] ring-[#b92516]/20",
  sent: "bg-neutral-100 text-neutral-700 ring-neutral-200",
  paid: "bg-green-50 text-green-700 ring-green-200",
  approved: "bg-green-50 text-green-700 ring-green-200",
  needed: "bg-[#b92516]/10 text-[#b92516] ring-[#b92516]/20",
  submitted: "bg-neutral-100 text-neutral-700 ring-neutral-200",
  ordered: "bg-neutral-100 text-neutral-700 ring-neutral-200",
  answered: "bg-green-50 text-green-700 ring-green-200",
  closed: "bg-neutral-100 text-neutral-500 ring-neutral-200",
  received: "bg-neutral-100 text-neutral-700 ring-neutral-200",
  "in-progress": "bg-[#b92516]/10 text-[#b92516] ring-[#b92516]/20",
  declined: "bg-neutral-100 text-neutral-500 ring-neutral-200",
  qualified: "bg-neutral-100 text-neutral-700 ring-neutral-200",
  proposal: "bg-neutral-100 text-neutral-700 ring-neutral-200",
  contacted: "bg-neutral-100 text-neutral-700 ring-neutral-200",
  new: "bg-[#b92516]/10 text-[#b92516] ring-[#b92516]/20",
  won: "bg-green-50 text-green-700 ring-green-200",
  lost: "bg-neutral-100 text-neutral-500 ring-neutral-200",
  internal: "bg-[#151515] text-white ring-[#151515]",
  customer: "bg-[#b92516]/10 text-[#b92516] ring-[#b92516]/20",
  open: "bg-neutral-100 text-neutral-700 ring-neutral-200",
  scheduled: "bg-[#b92516]/10 text-[#b92516] ring-[#b92516]/20",
  invited: "bg-neutral-100 text-neutral-700 ring-neutral-200",
  complete: "bg-green-50 text-green-700 ring-green-200",
  "on-track": "bg-green-50 text-green-700 ring-green-200",
  watch: "bg-[#b92516]/10 text-[#b92516] ring-[#b92516]/20",
  "at-risk": "bg-[#b92516]/10 text-[#b92516] ring-[#b92516]/20",
  unset: "bg-neutral-100 text-neutral-500 ring-neutral-200",
  resolved: "bg-green-50 text-green-700 ring-green-200",
  done: "bg-green-50 text-green-700 ring-green-200",
  low: "bg-neutral-100 text-neutral-700 ring-neutral-200",
  normal: "bg-neutral-100 text-neutral-700 ring-neutral-200",
  high: "bg-[#b92516]/10 text-[#b92516] ring-[#b92516]/20",
  urgent: "bg-[#b92516]/10 text-[#b92516] ring-[#b92516]/20",
  reviewed: "bg-neutral-100 text-neutral-700 ring-neutral-200",
  not_a_fit: "bg-neutral-100 text-neutral-500 ring-neutral-200",
  do_not_contact: "bg-[#151515] text-white ring-[#151515]",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex w-fit items-center justify-center self-center justify-self-start whitespace-nowrap rounded-full px-2.5 py-1 text-center text-xs font-semibold leading-none capitalize ring-1 ${
        styles[status] ?? styles.completed
      }`}
    >
      {status.replace(/[-_]/g, " ")}
    </span>
  );
}
