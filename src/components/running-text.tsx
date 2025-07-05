
'use client';

import { cn } from '@/lib/utils';

interface RunningTextProps {
  text: string;
  className?: string;
}

export function RunningText({ text, className }: RunningTextProps) {
  return (
    <span className={cn(
      "font-bold text-white drop-shadow-lg",
      className
    )}>
      {text}
    </span>
  );
}
