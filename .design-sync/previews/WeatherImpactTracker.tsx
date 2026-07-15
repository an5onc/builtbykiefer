import { WeatherImpactTracker } from "builtbykiefer-tmp";

const weatherData = [
  { date: "2026-03-02", condition: "clear" as const, workable: true },
  { date: "2026-03-03", condition: "clear" as const, workable: true },
  { date: "2026-03-04", condition: "snow" as const, workable: false, impact: "6\" snow — framing paused" },
  { date: "2026-03-05", condition: "wind" as const, workable: false, impact: "45mph gusts — no crane lifts" },
  { date: "2026-03-06", condition: "clear" as const, workable: true },
  { date: "2026-03-09", condition: "rain" as const, workable: false, impact: "Site too wet for excavation" },
  { date: "2026-03-10", condition: "clear" as const, workable: true },
  { date: "2026-03-11", condition: "clear" as const, workable: true },
  { date: "2026-03-12", condition: "clear" as const, workable: true },
  { date: "2026-03-13", condition: "extreme" as const, workable: false, impact: "Hard freeze — no concrete pour" },
];

// Weather-impact summary for a project month: workable vs delayed days.
export function MarchSchedule() {
  return (
    <WeatherImpactTracker
      projectName="Severance Custom Ranch"
      month="March"
      year={2026}
      weatherData={weatherData}
    />
  );
}
