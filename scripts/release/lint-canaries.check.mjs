import assert from "node:assert/strict";
import { test } from "node:test";
import { ESLint } from "eslint";

test("real configured lint detects hook errors and image accessibility at existing severity", async () => {
  const eslint = new ESLint();
  const [bad] = await eslint.lintText(`import { useState } from "react";
export default function Canary({ enabled }: { enabled: boolean }) {
  if (enabled) useState(0);
  return <img src="/fixture.png" />;
}`, { filePath: "src/components/LintCanary.tsx" });
  const errors = bad.messages.filter((message) => message.severity === 2).map((message) => message.ruleId);
  assert.ok(errors.includes("react-hooks/rules-of-hooks"), "Hook rule must reject a conditional hook.");
  assert.ok(bad.messages.some((message) => message.ruleId === "jsx-a11y/alt-text" && message.severity >= 1), "Accessibility rule must report an image without alt.");
  const [good] = await eslint.lintText(`import { useState } from "react";
export default function Canary() {
  const [value] = useState(0);
  return <button type="button">{value}</button>;
}`, { filePath: "src/components/LintCanary.tsx" });
  assert.equal(good.errorCount, 0, "Valid fixture must pass the same configuration.");
});
