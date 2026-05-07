export default function ProjectProgress({ progress }: { progress: number }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-[#655c52]">Progress</span>
        <span className="font-semibold text-[#171717]">{progress}%</span>
      </div>
      <div className="h-2 rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-[#b92516]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
