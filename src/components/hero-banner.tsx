
'use client';

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { type Place } from '@/lib/data';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { RunningText } from './running-text';

export function HeroBanner({ places }: { places: Place[] }) {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const currentPlace = places[current];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-background">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="absolute inset-0 w-full h-full z-0"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{ loop: true }}
      >
        <CarouselContent className="h-full">
          {places.map((place, index) => (
            <CarouselItem key={place.id} className="h-full relative">
              <Image
                src={place.images[0] || place.thumbnail}
                alt={place.name}
                fill
                className="object-cover"
                priority={index === 0}
                data-ai-hint="sacred landscape"
              />
              <div className="absolute inset-0 bg-black/60" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white p-4">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 drop-shadow-2xl">
          <RunningText text="Discover Sacred" />
          <br />
          <RunningText text="Destinations" className="font-headline" />
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-white/90 drop-shadow-lg">
          Embark on a spiritual journey through Varanasi, Prayagraj, and Ayodhya.
          <br className="hidden md:block" />
          Experience the rich heritage and timeless beauty of India.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild size="lg" className="text-lg py-7 px-10">
            <Link href="/destinations">Explore Destinations</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-lg py-7 px-10 border-white/50 bg-black/20 hover:bg-white/10 text-white"
          >
            <Link href="/packages">View Packages</Link>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-10 flex flex-col items-center justify-center gap-4 text-white px-4">
        {currentPlace && (
          <p className="text-sm font-medium tracking-wider hidden sm:block drop-shadow-md">
            Now Showing: {currentPlace.name}, {currentPlace.city}
          </p>
        )}
        <div className="flex items-center gap-3">
          {places.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                'h-2 w-2 rounded-full transition-all duration-300',
                current === index ? 'w-6 bg-primary' : 'bg-white/50 hover:bg-white'
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
