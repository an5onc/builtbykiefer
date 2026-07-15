// design-sync shim for next/link → plain <a>.
import * as React from "react";

type NextLinkProps = {
  href: string | { pathname?: string };
  children?: React.ReactNode;
  className?: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  [key: string]: unknown;
};

export default function Link(props: NextLinkProps) {
  const {
    href,
    children,
    prefetch: _prefetch,
    replace: _replace,
    scroll: _scroll,
    shallow: _shallow,
    ...rest
  } = props;
  const resolvedHref = typeof href === "object" && href !== null ? href.pathname ?? "#" : href;
  return (
    <a href={resolvedHref} {...(rest as Record<string, unknown>)}>
      {children}
    </a>
  );
}
