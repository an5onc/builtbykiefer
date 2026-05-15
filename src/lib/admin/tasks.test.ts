import { describe, expect, it } from "vitest";
import { parseProjectTaskCreateFormData, taskPriorityOptions, taskStatusOptions } from "./tasks";

function formData(values: Record<string, string>) {
  const data = new FormData();

  Object.entries(values).forEach(([key, value]) => data.set(key, value));

  return data;
}

describe("task helpers", () => {
  it("parses a project task with assignee, due date, priority, and notes", () => {
    expect(
      parseProjectTaskCreateFormData(
        formData({
          title: "Confirm cabinet layout",
          assignedWorkerId: "worker-1",
          dueDate: "2026-05-18",
          priority: "high",
          notes: "Review with client before ordering.",
        }),
      ),
    ).toEqual({
      ok: true,
      data: {
        title: "Confirm cabinet layout",
        assignedWorkerId: "worker-1",
        dueDate: "2026-05-18",
        priority: "high",
        notes: "Review with client before ordering.",
      },
    });
  });

  it("rejects missing task title with a clear first error", () => {
    expect(
      parseProjectTaskCreateFormData(
        formData({
          title: "",
          assignedWorkerId: "",
          dueDate: "2026-05-18",
          priority: "normal",
          notes: "",
        }),
      ),
    ).toEqual({ ok: false, reason: "Task title is required." });
  });

  it("exposes expected statuses and priorities", () => {
    expect(taskStatusOptions.map((option) => option.value)).toEqual([
      "open",
      "in-progress",
      "done",
    ]);
    expect(taskPriorityOptions.map((option) => option.value)).toEqual([
      "low",
      "normal",
      "high",
      "urgent",
    ]);
  });
});
