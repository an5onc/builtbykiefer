import { assertOwnedRequest } from "./guards.mjs";

const contexts = new WeakMap();

export async function drainBrowserContainment(context) {
  const state = contexts.get(context);
  if (!state) return;
  state.closing = true;
  let timer;
  try {
    await Promise.race([Promise.all([...state.pending]), new Promise((_resolve, reject) => {
      timer = setTimeout(() => reject(new Error("Owned browser requests did not drain before teardown.")), 7000);
    })]);
  } finally { clearTimeout(timer); }
}

export async function installBrowserContainment(context, origin) {
  const outbound = [], state = { pending: new Set(), closing: false };
  contexts.set(context, state);
  const handle = async (route) => {
    try { assertOwnedRequest(route.request().url(), origin); }
    catch { outbound.push(new URL(route.request().url()).origin); await route.abort("blockedbyclient"); return; }
    if (state.closing) { await route.abort("aborted"); return; }
    // Playwright routing may see only the first URL of a redirect chain.
    // Inspect redirects without following them, before returning bytes to the browser.
    try {
      const response = await route.fetch({ maxRedirects: 0, maxRetries: 0, timeout: 10000 });
      const location = response.headers().location;
      if (location && response.status() >= 300 && response.status() < 400) {
        try { assertOwnedRequest(new URL(location, response.url()).href, origin); }
        catch { outbound.push(new URL(location, response.url()).origin); await route.abort("blockedbyclient"); return; }
      }
      // Copy the owned response before returning it. Passing the APIResponse
      // handle lets Playwright read it later during fulfillment, when rapid
      // navigation/teardown may already have disposed its backing fetch entry.
      const status = response.status(), headers = response.headers(), body = await response.body();
      await route.fulfill({ status, headers, body });
    } catch (error) {
      // A late allowed asset can finish after its page has closed in teardown.
      // Only this explicit lifecycle cancellation is safe to discard; live-page
      // failures and all other errors must still fail the check.
      const cancelled = /Fetch response has been disposed|Target page, context or browser has been closed|Target closed/.test(error.message);
      if (cancelled && route.request().frame().page().isClosed()) return;
      throw error;
    }
  };
  await context.route("**/*", async route => {
    let finish;
    const pending = new Promise(resolve => { finish = resolve; });
    state.pending.add(pending);
    try { await handle(route); }
    finally { state.pending.delete(pending); finish(); }
  });
  await context.routeWebSocket("**/*", (socket) => { outbound.push("websocket-refused"); socket.close(); });
  return outbound;
}
