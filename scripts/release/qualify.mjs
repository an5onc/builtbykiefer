import { execFileSync, spawn } from "node:child_process";
import { createServer } from "node:net";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { qualifyCandidate } from "./qualification.mjs";
import { verifyManifest } from "./inventory.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
if (Number(process.versions.node.split(".")[0]) !== 24) throw new Error("Use the declared Node 24 runtime.");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const npmVersion = execFileSync(npm, ["--version"], { encoding: "utf8" }).trim();
if (!npmVersion.startsWith("11.")) throw new Error("Use npm 11.");
const env = { ...process.env, RESEND_API_KEY: "", CONTACT_EMAIL_FROM: "", CONTACT_EMAIL_TO: "", NEXT_TELEMETRY_DISABLED: "1" };
const args = process.argv.slice(2);
if (args.length && !(args.length === 2 && args[0] === "--manifest")) throw new Error("Usage: qualify.mjs [--manifest <manifest.json>]");
const selection = args.length ? { manifestPath: resolve(args[1]) }
  : JSON.parse(execFileSync(process.execPath, [join(root, "scripts/release/prepare.mjs")], { cwd: root, env, encoding: "utf8" }));
const verified = await verifyManifest(selection.manifestPath);
const selected = { candidateRoot: verified.candidateRoot, manifestPath: verified.manifestPath,
  digest: verified.manifest.digest, fileCount: verified.manifest.fileCount };
console.log(`Checking isolated candidate ${selected.digest} (${selected.fileCount} files)`);
const checks = [["ci", "--no-fund"], ["run", "lint"], ["run", "release:test"], ["test"], ["run", "build"], ["run", "typecheck"], ["audit", "--omit=dev"]].map((args) => ({
  name: args.join(" "), run: () => execFileSync(npm, args, { cwd: selected.candidateRoot, env, stdio: "inherit" }),
}));
checks.push({ name: "GET-only loopback smoke", run: async () => {
const probe = createServer();
await new Promise((resolve, reject) => { probe.once("error", reject); probe.listen(0, "127.0.0.1", resolve); });
const port = probe.address().port;
await new Promise((resolve) => probe.close(resolve));
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, [join(selected.candidateRoot, "node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", String(port)], { cwd: selected.candidateRoot, env, stdio: ["ignore", "inherit", "inherit"] });
try {
  let ready = false;
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error("Local candidate server exited before readiness.");
    try { ready = (await fetch(origin, { signal: AbortSignal.timeout(Math.max(1, Math.min(1000, deadline - Date.now()))) })).ok; } catch { /* Bounded local startup wait. */ }
    if (ready) break;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error("Local candidate server did not become ready within 20 seconds.");
  execFileSync(process.execPath, [join(root, "scripts/release/smoke.mjs"), selected.manifestPath, origin], { cwd: selected.candidateRoot, env, stdio: "inherit" });
} finally {
  server.kill("SIGTERM");
  await Promise.race([new Promise((resolve) => server.once("exit", resolve)), new Promise((resolve) => setTimeout(resolve, 3000))]);
  if (server.exitCode === null) server.kill("SIGKILL");
}
} });
const result = await qualifyCandidate(selected.manifestPath, checks, { node: process.version, npm: npmVersion });
console.log(JSON.stringify({ ...selected, qualificationPath: join(result.runRoot, "qualification.json"), checks: "passed", liveEmail: false, deployed: false }, null, 2));
