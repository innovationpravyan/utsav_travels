'use client';
import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

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
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

      <div className="relative z-10 flex h-full items-center justify-center p-4 text-center text-white">
        <h1 className="text-5xl font-headline font-bold drop-shadow-2xl md:text-7xl">
          {title}
        </h1>
      </div>
    </section>
  );
}
