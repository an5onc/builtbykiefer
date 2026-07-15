// design-sync shim for next/navigation hooks → inert stubs so client
// components that read router/pathname render statically instead of throwing.
export function usePathname(): string {
  return "/";
}

export function useRouter() {
  const noop = () => {};
  return { push: noop, replace: noop, prefetch: noop, back: noop, forward: noop, refresh: noop };
}

export function useSearchParams(): URLSearchParams {
  return new URLSearchParams();
}

export function useParams(): Record<string, string> {
  return {};
}

export function redirect(): void {}
export function notFound(): void {}
