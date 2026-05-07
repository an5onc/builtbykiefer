const styles: Record<string, string> = {
  active: "bg-green-50 text-green-700 ring-green-200",
  planning: "bg-amber-50 text-amber-700 ring-amber-200",
  completed: "bg-neutral-100 text-neutral-700 ring-neutral-200",
  draft: "bg-amber-50 text-amber-700 ring-amber-200",
  sent: "bg-blue-50 text-blue-700 ring-blue-200",
  paid: "bg-green-50 text-green-700 ring-green-200",
  qualified: "bg-blue-50 text-blue-700 ring-blue-200",
  proposal: "bg-purple-50 text-purple-700 ring-purple-200",
  contacted: "bg-neutral-100 text-neutral-700 ring-neutral-200",
  new: "bg-[#b92516]/10 text-[#b92516] ring-[#b92516]/20",
  won: "bg-green-50 text-green-700 ring-green-200",
  lost: "bg-neutral-100 text-neutral-500 ring-neutral-200",
  internal: "bg-[#151515] text-white ring-[#151515]",
  customer: "bg-[#b92516]/10 text-[#b92516] ring-[#b92516]/20",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${
        styles[status] ?? styles.completed
      }`}
    >
      {status.replace("-", " ")}
    </span>
  );
}
