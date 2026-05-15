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
  return `[admin:${scope}] Falling back to demo data: ${getErrorDetail(error)}`;
}

export function logSupabaseFallback(scope: string, error: unknown) {
  console.warn(formatSupabaseFallbackMessage(scope, error));
}
