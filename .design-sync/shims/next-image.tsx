// design-sync shim for next/image → plain <img>, so components render
// outside the Next runtime. Handles `fill`, imported-asset src objects, and
// drops Next-only props that a bare <img> would warn on.
import * as React from "react";

type ImgSrc = string | { src: string };

type NextImageProps = {
  src: ImgSrc;
  alt?: string;
  fill?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: string;
  loading?: "eager" | "lazy";
  unoptimized?: boolean;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  [key: string]: unknown;
};

export default function Image(props: NextImageProps) {
  const {
    src,
    alt = "",
    fill,
    width,
    height,
    className,
    style,
    sizes: _sizes,
    priority: _priority,
    quality: _quality,
    placeholder: _placeholder,
    blurDataURL: _blur,
    unoptimized: _unopt,
    loader: _loader,
    onLoadingComplete: _olc,
    fetchPriority,
    loading,
    ...rest
  } = props;

  const resolvedSrc = typeof src === "object" && src !== null ? src.src : src;
  const fillStyle: React.CSSProperties = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style }
    : { ...style };

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      style={fillStyle}
      width={fill ? undefined : (width as number | undefined)}
      height={fill ? undefined : (height as number | undefined)}
      loading={loading ?? "lazy"}
      // @ts-expect-error fetchPriority passthrough
      fetchpriority={fetchPriority}
      {...(rest as Record<string, unknown>)}
    />
  );
}
