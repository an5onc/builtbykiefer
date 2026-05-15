import { getTrimmedValue, isIsoDate } from "./form-utils";
import type { FileVisibility } from "./types";

export interface DailyLogCreateInput {
  reportDate: string;
  superintendent: string;
  weather: string;
  crewCount: number;
  workPerformed: string;
  deliveries: string;
  inspections: string;
  delays: string;
  safetyNotes: string;
  nextSteps: string;
  visibility: FileVisibility;
}

type ParseResult<T> = { ok: true; data: T } | { ok: false; reason: string };

export const dailyLogVisibilityOptions: { value: FileVisibility; label: string }[] = [
  { value: "internal", label: "Internal" },
  { value: "customer", label: "Customer" },
];

const visibilityValues = new Set<FileVisibility>(dailyLogVisibilityOptions.map((option) => option.value));

function parseCrewCount(value: string) {
  const crewCount = Number(value);
  return Number.isInteger(crewCount) && crewCount >= 0 ? crewCount : null;
}

export function parseDailyLogCreateFormData(formData: FormData): ParseResult<DailyLogCreateInput> {
  const reportDate = getTrimmedValue(formData, "reportDate");
  const superintendent = getTrimmedValue(formData, "superintendent");
  const weather = getTrimmedValue(formData, "weather");
  const crewCount = parseCrewCount(getTrimmedValue(formData, "crewCount"));
  const workPerformed = getTrimmedValue(formData, "workPerformed");
  const deliveries = getTrimmedValue(formData, "deliveries");
  const inspections = getTrimmedValue(formData, "inspections");
  const delays = getTrimmedValue(formData, "delays");
  const safetyNotes = getTrimmedValue(formData, "safetyNotes");
  const nextSteps = getTrimmedValue(formData, "nextSteps");
  const visibility = getTrimmedValue(formData, "visibility");

  if (!reportDate || !isIsoDate(reportDate)) {
    return { ok: false, reason: "Use a valid report date." };
  }

  if (!superintendent) {
    return { ok: false, reason: "Superintendent is required." };
  }

  if (!weather) {
    return { ok: false, reason: "Weather is required." };
  }

  if (crewCount === null) {
    return { ok: false, reason: "Use a valid crew count." };
  }

  if (!workPerformed) {
    return { ok: false, reason: "Work performed is required." };
  }

  if (!visibilityValues.has(visibility as FileVisibility)) {
    return { ok: false, reason: "Choose a valid daily log visibility." };
  }

  return {
    ok: true,
    data: {
      reportDate,
      superintendent,
      weather,
      crewCount,
      workPerformed,
      deliveries,
      inspections,
      delays,
      safetyNotes,
      nextSteps,
      visibility: visibility as FileVisibility,
    },
  };
}
