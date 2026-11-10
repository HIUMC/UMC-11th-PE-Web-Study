import { cn } from "../../utils/cn";

interface ProfileAvatarProps {
  imageUrl: string | null;
  className?: string;
}

export function ProfileAvatar({ imageUrl, className }: ProfileAvatarProps) {
  return (
    <span
      className={cn(
        "flex h-[82px] w-[82px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-border",
        className,
      )}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <img src="/icons/person.svg" alt="" className="h-12 w-12" />
      )}
    </span>
  );
}
