'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RunningTextProps {
  text: string;
  className?: string;
}

export function RunningText({ text, className }: RunningTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const period = 2000;

  useEffect(() => {
    let ticker: NodeJS.Timeout;
    const handleTick = () => {
      const fullText = text;
      const updatedText = isDeleting
        ? fullText.substring(0, displayedText.length - 1)
        : fullText.substring(0, displayedText.length + 1);

      setDisplayedText(updatedText);

      if (!isDeleting && updatedText === fullText) {
        ticker = setTimeout(() => setIsDeleting(true), period);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      } else {
         const delta = isDeleting ? 100 : 200 - Math.random() * 100;
         ticker = setTimeout(handleTick, delta);
      }
    };

    ticker = setTimeout(handleTick, 500);

    return () => clearTimeout(ticker);
  }, [displayedText, isDeleting, text, loopNum, period]);

  return (
    <span className={cn("font-headline font-bold text-white drop-shadow-2xl", className)}>
      {displayedText}
      <span className="border-r-4 border-primary animate-pulse">&nbsp;</span>
    </span>
  );
}
