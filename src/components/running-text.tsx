
'use client';

import { cn } from '@/lib/utils';

interface RunningTextProps {
  text: string;
  className?: string;
}

export function RunningText({ text, className }: RunningTextProps) {
  return (
    <span className={cn(
      "font-bold drop-shadow-2xl",
      "animate-text-shimmer bg-gradient-to-r from-white via-neutral-300 to-white bg-[200%_auto] bg-clip-text text-transparent",
      className
    )}>
      {text}
    </span>
  );
}
