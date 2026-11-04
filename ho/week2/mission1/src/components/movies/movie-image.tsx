interface MovieImageProps {
  src: string | null;
  alt: string;
  className: string;
}

export function MovieImage({ src, alt, className }: MovieImageProps) {
  return src ? (
    <img src={src} alt={alt} className={className} />
  ) : (
    <div role="img" aria-label={alt} className={`${className} flex items-center justify-center bg-slate-200 text-sm text-slate-500`}>
      이미지 없음
    </div>
  );
}
