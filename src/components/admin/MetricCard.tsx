import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export default function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  href,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  href?: string;
}) {
  const content = (
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
  );

  const cardClassName =
    "block h-full rounded-lg border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#b92516]/30";

  if (href) {
    return (
      <Link href={href} aria-label={`View ${label}`} className={cardClassName}>
        {content}
      </Link>
    );
  }

  return (
    <div className={cardClassName}>
      {content}
    </div>
  );
}
