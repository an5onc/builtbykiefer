import { describe, expect, it } from "vitest";
import { parseDailyLogCreateFormData } from "./daily-logs";

describe("daily log form parsing", () => {
  it("parses a branded Kiefer field report form payload", () => {
    const result = parseDailyLogCreateFormData(
      new FormDataBuilder()
        .set("reportDate", "2026-05-14")
        .set("superintendent", "Caleb Jensen")
        .set("weather", "Clear, 68F")
        .set("crewCount", "6")
        .set("workPerformed", "Framing crew completed blocking and started porch lid framing.")
        .set("deliveries", "Window flashing and LVL package delivered.")
        .set("inspections", "Rough framing inspection scheduled.")
        .set("delays", "No delays.")
        .set("safetyNotes", "Reviewed ladder setup during morning huddle.")
        .set("nextSteps", "Complete porch framing and prep inspection packet.")
        .set("visibility", "customer")
        .build(),
    );

    expect(result).toEqual({
      ok: true,
      data: {
        reportDate: "2026-05-14",
        superintendent: "Caleb Jensen",
        weather: "Clear, 68F",
        crewCount: 6,
        workPerformed: "Framing crew completed blocking and started porch lid framing.",
        deliveries: "Window flashing and LVL package delivered.",
        inspections: "Rough framing inspection scheduled.",
        delays: "No delays.",
        safetyNotes: "Reviewed ladder setup during morning huddle.",
        nextSteps: "Complete porch framing and prep inspection packet.",
        visibility: "customer",
      },
    });
  });

  it("requires meaningful work performed notes", () => {
    const result = parseDailyLogCreateFormData(
      new FormDataBuilder()
        .set("reportDate", "2026-05-14")
        .set("superintendent", "Caleb Jensen")
        .set("weather", "Clear")
        .set("crewCount", "4")
        .set("workPerformed", "")
        .set("visibility", "internal")
        .build(),
    );

    expect(result).toEqual({ ok: false, reason: "Work performed is required." });
  });

  it("rejects invalid crew counts", () => {
    const result = parseDailyLogCreateFormData(
      new FormDataBuilder()
        .set("reportDate", "2026-05-14")
        .set("superintendent", "Caleb Jensen")
        .set("weather", "Clear")
        .set("crewCount", "-1")
        .set("workPerformed", "Site prep.")
        .set("visibility", "internal")
        .build(),
    );

    expect(result).toEqual({ ok: false, reason: "Use a valid crew count." });
  });
});

class FormDataBuilder {
  private formData = new FormData();

  set(key: string, value: string) {
    this.formData.set(key, value);
    return this;
  }

  build() {
    return this.formData;
  }
}
