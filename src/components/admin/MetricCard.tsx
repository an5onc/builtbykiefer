import type { LucideIcon } from "lucide-react";

export default function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8176]">
            {label}
          </p>
          <p className="mt-3 text-3xl font-bold text-[#171717]">{value}</p>
          <p className="mt-2 text-sm text-[#655c52]">{detail}</p>
        </div>
        <div className="rounded-md bg-[#b92516]/10 p-2 text-[#b92516]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
