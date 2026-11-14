import { configDefaults, defineConfig } from "vitest/config";

// Explicit ESM for both today's loader and Node 24 native config loading.
export default defineConfig({
  test: {
    // Retained copies/browser checks and the separately run Node test fixture are not Vitest suites.
    exclude: [...configDefaults.exclude, "output/**", "outputs/**", "tmp/**", ".worktrees/**", "tools/browser-checks/**", "scripts/quote-protection/encoded-preview-probes.test.mjs"],
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
});
