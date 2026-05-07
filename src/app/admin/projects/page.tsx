import Image from "next/image";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import ProjectProgress from "@/components/admin/ProjectProgress";
import StatusBadge from "@/components/admin/StatusBadge";
import { getClient, getProjects } from "@/lib/admin/queries";

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <AdminShell title="Projects" eyebrow="Active Work">
      <div className="grid gap-5 lg:grid-cols-3">
        {projects.map((project) => {
          const client = getClient(project.clientId);

          return (
            <Link
              key={project.id}
              href={`/admin/projects/${project.id}`}
              className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative h-44">
                <Image
                  src={project.heroImage}
                  alt={project.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold">{project.name}</h2>
                    <p className="text-sm text-[#655c52]">
                      {client?.name} · {project.location}
                    </p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
                <p className="mb-4 text-sm text-[#655c52]">{project.notes}</p>
                <ProjectProgress progress={project.progress} />
              </div>
            </Link>
          );
        })}
      </div>
    </AdminShell>
  );
}
