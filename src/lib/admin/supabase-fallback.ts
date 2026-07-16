interface SupabaseLikeError {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}

function getErrorDetail(error: unknown) {
  if (!error || typeof error !== "object") {
    return error ? String(error) : "Unknown Supabase error";
  }

  const supabaseError = error as SupabaseLikeError;
  const parts = [
    supabaseError.code,
    supabaseError.message,
    supabaseError.details,
    supabaseError.hint,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" ") : JSON.stringify(error);
}

export function formatSupabaseFallbackMessage(scope: string, error: unknown) {
  return `[admin:${scope}] Supabase query failed: ${getErrorDetail(error)}`;
}

/**
 * Remediation H2: fail loud on a live Supabase error instead of silently returning demo data.
 *
 * This function is only ever reached when a REAL Supabase client was created — in demo mode
 * `getSupabaseClientOrNull()` returns `null` and callers return demo data BEFORE running any
 * query, so control never reaches here. That means a query error at this point is a genuine
 * live-database failure. Silently returning demo rows at the call site would render fabricated
 * data as if it were real (e.g. fake leads/finances on the admin dashboard), masking outages
 * and RLS misconfigurations. Throwing lets the Next.js error boundary surface the failure.
 *
 * To intentionally use demo data, set `NEXT_PUBLIC_DEMO_MODE=true` (no client is created).
 *
 * Return type is `never`: existing call sites still type-check — the trailing `return demoX;`
 * simply becomes unreachable. Those dead returns can be removed in a follow-up cleanup, and this
 * function renamed (e.g. `raiseSupabaseError`) now that it no longer merely logs.
 */
export function logSupabaseFallback(scope: string, error: unknown): never {
  const message = formatSupabaseFallbackMessage(scope, error);
  console.error(message);
  throw new Error(message);
}
