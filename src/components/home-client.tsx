'use client';

import Link from "next/link";
import { PlaceCard } from "@/components/place-card";
import { PackageCard } from "@/components/package-card";
import { type Place, type Package } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { motion } from 'framer-motion';
import { HeroBanner } from "@/components/hero-banner";
import { Skeleton } from "./ui/skeleton";

interface HomeClientProps {
  featuredPlaces: Place[];
  popularPackages: Package[];
}

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};


export function HomeClient({ featuredPlaces, popularPackages }: HomeClientProps) {
  return (
    <div className="animate-fade-in">
      <HeroBanner />

      <motion.section 
        className="py-16 md:py-24 bg-secondary"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-headline text-center mb-4">Featured Destinations</h2>
          <p className="text-center max-w-2xl mx-auto text-lg text-muted-foreground mb-12">
            Discover breathtaking locations, handpicked by our travel experts for an unforgettable experience.
          </p>
          <Carousel 
              opts={{ align: "start", loop: true, }}
              className="w-full"
            >
              <CarouselContent>
                {featuredPlaces.map((place) => (
                  <CarouselItem key={place.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                      <PlaceCard place={place} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden lg:flex" />
              <CarouselNext className="hidden lg:flex" />
            </Carousel>
           <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/destinations">
                View All Destinations <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="py-16 md:py-24 bg-background"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-headline text-center mb-4">Popular Packages</h2>
          <p className="text-center max-w-2xl mx-auto text-lg text-muted-foreground mb-12">
            Curated journeys that blend adventure, culture, and relaxation. Find your perfect getaway.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/packages">
                View All Packages <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
