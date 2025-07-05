
'use client';
import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { RunningText } from './running-text';

export interface BannerItem {
  id: string;
  image: string;
  name: string;
  tagline: string;
}

interface PageBannerProps {
  title: string;
  items: BannerItem[];
}

export function PageBanner({ title, items }: PageBannerProps) {
  const plugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  return (
    <section className="relative h-[50vh] w-full overflow-hidden bg-secondary">
      {/* Layer 1: Background Carousel */}
      {items && items.length > 0 && (
        <Carousel
          plugins={[plugin.current]}
          className="absolute inset-0 z-0"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{ loop: true }}
        >
          <CarouselContent className="h-full">
            {items.map((item, index) => (
              <CarouselItem key={item.id} className="relative h-full">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  data-ai-hint="travel background"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-x-0 bottom-0 z-10 p-8 text-white drop-shadow-lg">
                  <h3 className="text-3xl font-bold font-headline">{item.name}</h3>
                  <p className="text-lg text-white/90">{item.tagline}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}

      {/* Layer 2: Main Title Overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center text-center">
        <div className="container px-4">
            <h1 className="text-5xl md:text-7xl drop-shadow-2xl">
              <RunningText text={title} />
            </h1>
        </div>
      </div>
    </section>
  );
}
