export type FloatingAction = "quote" | "updates";

export function getFloatingActionForPathname(pathname: string): FloatingAction | null {
  if (pathname === "/login" || pathname.startsWith("/admin")) {
    return null;
  }

  if (pathname.startsWith("/portal")) {
    return "updates";
  }

  return "quote";
}
