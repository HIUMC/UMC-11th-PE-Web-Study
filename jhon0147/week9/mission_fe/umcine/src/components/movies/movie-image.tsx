"use client";

import { useState } from "react";
import Image from "next/image";

interface MovieImageProps {
  src: string;
  alt: string;
  className?: string;
  decorative?: boolean;
}

export function MovieImage({ src, alt, className, decorative = false }: MovieImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const failed = failedSource === src;
  return <Image src={failed ? "/images/poster-placeholder.svg" : src}
    alt={alt} className={className} aria-hidden={decorative || undefined}
    width={decorative ? 1280 : 500} height={decorative ? 720 : 625}
    sizes={decorative ? "100vw" : "(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 260px"}
    onError={() => { if (!failed) setFailedSource(src); }} />;
}
