import { useState } from "react";
import { cn } from "../../utils/cn";

interface MovieImageProps {
  src: string | null;
  alt: string;
  className?: string;
}

export default function MovieImage({ src, alt, className }: MovieImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <div
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={cn(
          "flex items-center justify-center bg-gray-200 text-center text-xs text-gray-600",
          className,
        )}
      >
        이미지 없음
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={alt ? "lazy" : "eager"}
      onError={() => setFailedSrc(src)}
      className={className}
    />
  );
}
