import Link from "next/link";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Home,
  ListChecks,
  UserRound,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatDate } from "@/lib/admin/formatters";
import { getLeads, getProjects, getTasks } from "@/lib/admin/queries";
import {
  buildScheduleEvents,
  getWeekRange,
  type ScheduleEvent,
  type ScheduleEventBucket,
  type ScheduleEventKind,
} from "@/lib/admin/schedule";

const bucketLabels: Record<ScheduleEventBucket, { title: string; eyebrow: string }> = {
  overdue: { title: "Past Due", eyebrow: "Needs attention" },
  today: { title: "Today", eyebrow: "Current day" },
  "this-week": { title: "Next 7 Days", eyebrow: "Weekly agenda" },
  upcoming: { title: "Upcoming", eyebrow: "Later schedule" },
};

const eventIcon = {
  lead: UserRound,
  project: Home,
  task: ListChecks,
} satisfies Record<ScheduleEventKind, typeof CalendarDays>;

function ScheduleEventRow({ event }: { event: ScheduleEvent }) {
  const Icon = eventIcon[event.kind];

  return (
    <Link
      href={event.href}
      className="grid gap-4 border-b border-black/10 px-5 py-4 transition hover:bg-[#f9f6f0] last:border-b-0 md:grid-cols-[112px_1fr_auto]"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a8176]">
          {formatDate(event.date)}
        </p>
      </div>
      <div className="min-w-0">
        <p className="flex items-center gap-2 font-semibold">
          <Icon className="size-4 shrink-0 text-[#b92516]" />
          <span className="min-w-0">{event.title}</span>
        </p>
        <p className="mt-1 text-sm leading-5 text-[#655c52]">{event.subtitle}</p>
      </div>
      <StatusBadge status={event.status} />
    </Link>
  );
}

function ScheduleBucket({
  bucket,
  events,
}: {
  bucket: ScheduleEventBucket;
  events: ScheduleEvent[];
}) {
  const label = bucketLabels[bucket];

  return (
    <section className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
            {label.eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-bold">{label.title}</h2>
        </div>
        <span className="rounded-full bg-[#f4efe7] px-3 py-1 text-sm font-bold">
          {events.length}
        </span>
      </div>

      {events.length > 0 ? (
        <div>
          {events.map((event) => (
            <ScheduleEventRow key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="px-5 py-5 text-sm text-[#655c52]">No items in this window.</p>
      )}
    </section>
  );
}

export default async function SchedulePage() {
  const [tasks, leads, projects] = await Promise.all([getTasks(), getLeads(), getProjects()]);
  const events = buildScheduleEvents({ tasks, leads, projects });
  const weekRange = getWeekRange();
  const eventsByBucket = new Map<ScheduleEventBucket, ScheduleEvent[]>(
    (["overdue", "today", "this-week", "upcoming"] as const).map((bucket) => [
      bucket,
      events.filter((event) => event.bucket === bucket),
    ]),
  );
  const taskCount = events.filter((event) => event.kind === "task").length;
  const leadCount = events.filter((event) => event.kind === "lead").length;
  const projectCount = events.filter((event) => event.kind === "project").length;

  return (
    <AdminShell title="Schedule" eyebrow="Project Management">
      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_0.42fr]">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
                Weekly Agenda
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                {formatDate(weekRange.start)} - {formatDate(weekRange.end)}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#655c52]">
                Review commitments that affect field work, sales follow-up, and
                project delivery.
              </p>
            </div>
            <Link
              href="/admin/tasks"
              className="inline-flex items-center gap-2 rounded-md bg-[#b92516] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13]"
            >
              <ListChecks className="size-4" />
              Tasks
            </Link>
          </div>
        </section>

        <aside className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#655c52]">
              <ListChecks className="size-4 text-[#b92516]" />
              Tasks
            </p>
            <p className="mt-2 text-3xl font-bold">{taskCount}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#655c52]">
              <UserRound className="size-4 text-[#b92516]" />
              Lead Follow-Ups
            </p>
            <p className="mt-2 text-3xl font-bold">{leadCount}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#655c52]">
              <Home className="size-4 text-[#b92516]" />
              Job Milestones
            </p>
            <p className="mt-2 text-3xl font-bold">{projectCount}</p>
          </div>
        </aside>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.48fr]">
        <div className="space-y-6">
          <ScheduleBucket bucket="overdue" events={eventsByBucket.get("overdue") ?? []} />
          <ScheduleBucket bucket="today" events={eventsByBucket.get("today") ?? []} />
          <ScheduleBucket bucket="this-week" events={eventsByBucket.get("this-week") ?? []} />
        </div>

        <aside className="space-y-6">
          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <AlertTriangle className="size-5 text-[#b92516]" />
              Manager Focus
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              <p className="flex items-center justify-between rounded-md bg-[#f9f6f0] p-3">
                <span>Past due</span>
                <strong>{eventsByBucket.get("overdue")?.length ?? 0}</strong>
              </p>
              <p className="flex items-center justify-between rounded-md bg-[#f9f6f0] p-3">
                <span>Due today</span>
                <strong>{eventsByBucket.get("today")?.length ?? 0}</strong>
              </p>
              <p className="flex items-center justify-between rounded-md bg-[#f9f6f0] p-3">
                <span>Later this week</span>
                <strong>{eventsByBucket.get("this-week")?.length ?? 0}</strong>
              </p>
            </div>
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <CheckCircle2 className="size-5 text-[#b92516]" />
              Schedule Sources
            </h2>
            <div className="mt-4 grid gap-3 text-sm text-[#655c52]">
              <p className="rounded-md border border-black/10 p-3">Open task due dates</p>
              <p className="rounded-md border border-black/10 p-3">Lead follow-up dates</p>
              <p className="rounded-md border border-black/10 p-3">Job start dates</p>
              <p className="rounded-md border border-black/10 p-3">Target completion dates</p>
            </div>
          </section>

          <ScheduleBucket bucket="upcoming" events={eventsByBucket.get("upcoming") ?? []} />
        </aside>
      </div>
    </AdminShell>
  );
}
