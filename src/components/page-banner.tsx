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
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <section className="relative h-[50vh] w-full overflow-hidden bg-secondary">
      {items && items.length > 0 && (
        <Carousel
          plugins={[plugin.current]}
          className="w-full h-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent className="h-full">
            {items.map((item) => (
              <CarouselItem key={item.id} className="relative h-full">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  priority
                  data-ai-hint="travel background"
                />
                 <div className="absolute inset-0 bg-black/50" />
                 <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 text-white">
                    <h3 className="text-3xl font-bold font-headline">{item.name}</h3>
                    <p className="text-lg text-primary">{item.tagline}</p>
                 </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
      <div className="absolute inset-0 flex container mx-auto px-4 h-full flex-col justify-center items-center text-center text-white z-20 pointer-events-none">
        <h1 className="text-5xl md:text-7xl lg:text-8xl">
          <RunningText text={title} />
        </h1>
      </div>
    </section>
  );
}
