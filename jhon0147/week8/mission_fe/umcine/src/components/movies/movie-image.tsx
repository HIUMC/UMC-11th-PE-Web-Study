import { useState } from "react";

interface MovieImageProps {
  src: string;
  alt: string;
  className?: string;
  decorative?: boolean;
}

export function MovieImage({ src, alt, className, decorative = false }: MovieImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const failed = failedSource === src;
  return <img src={failed ? "/images/poster-placeholder.svg" : src}
    alt={alt} className={className} aria-hidden={decorative || undefined}
    onError={() => { if (!failed) setFailedSource(src); }} />;
}
