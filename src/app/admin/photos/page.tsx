import Image from "next/image";
import Link from "next/link";
import { Camera, PlusCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatDate } from "@/lib/admin/formatters";
import { getProjectPhotos, getProjects } from "@/lib/admin/queries";

export default async function AdminPhotosPage() {
  const [photos, projects] = await Promise.all([getProjectPhotos(), getProjects()]);
  const projectsById = new Map(projects.map((project) => [project.id, project]));
  const clientVisibleCount = photos.filter((photo) => photo.visibility === "customer").length;

  return (
    <AdminShell title="Project Photos" eyebrow="Files">
      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_0.42fr]">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
                Visual Job Record
              </p>
              <h2 className="mt-2 text-2xl font-bold">Photo Gallery</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#655c52]">
                Organize progress, selection, issue, before, after, and closeout photos by job with internal or client visibility.
              </p>
            </div>
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-2 rounded-md bg-[#b92516] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13]"
            >
              <PlusCircle className="size-4" />
              Pick Job
            </Link>
          </div>
        </section>

        <aside className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-[#655c52]">Photos</p>
            <p className="mt-2 text-3xl font-bold">{photos.length}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-[#655c52]">Client-visible</p>
            <p className="mt-2 text-3xl font-bold">{clientVisibleCount}</p>
          </div>
        </aside>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {photos.length > 0 ? (
          photos.map((photo) => {
            const project = projectsById.get(photo.projectId);

            return (
              <Link
                key={photo.id}
                href={`/admin/projects/${photo.projectId}`}
                className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative h-52 bg-[#f9f6f0]">
                  <Image src={photo.imageUrl} alt={photo.title} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8176]">
                      <Camera className="size-4 text-[#b92516]" />
                      {photo.category}
                    </p>
                    <StatusBadge status={photo.visibility} />
                  </div>
                  <h3 className="font-semibold">{photo.title}</h3>
                  <p className="mt-1 text-sm text-[#655c52]">
                    {project?.name ?? "Unknown job"} · {formatDate(photo.photoDate)}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#655c52]">{photo.caption}</p>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="rounded-lg border border-black/10 bg-white px-5 py-5 text-sm text-[#655c52] shadow-sm">
            No project photos yet.
          </p>
        )}
      </section>
    </AdminShell>
  );
}
