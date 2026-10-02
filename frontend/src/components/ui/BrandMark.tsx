import { cn } from "@/lib/cn";

interface BrandMarkProps {
  size?: number;
  className?: string;
}

export function BrandMark({ size = 32, className }: BrandMarkProps) {
  return (
    <img
      src="/logo.png"
      alt="Logo"
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
    />
  );
}
