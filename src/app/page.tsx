import Link from "next/link";
import { PlaceCard } from "@/components/place-card";
import { PackageCard } from "@/components/package-card";
import { getPlaces, getPackages } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { HeroBanner } from "@/components/hero-banner";

export default async function Home() {
  const featuredPlaces = (await getPlaces()).slice(0, 5);
  const popularPackages = (await getPackages()).slice(0, 3);

  return (
    <div className="animate-fade-in">
      <HeroBanner />

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-headline text-center mb-4">Featured Destinations</h2>
          <p className="text-center max-w-2xl mx-auto text-lg text-muted-foreground mb-12">
            Discover breathtaking locations, handpicked by our travel experts for an unforgettable experience.
          </p>
          <div className="relative">
            <Carousel 
              opts={{
                align: "start",
                loop: true,
              }}
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
              <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2" />
              <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2" />
            </Carousel>
          </div>
           <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/destinations">
                View All Destinations <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
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
      </section>
    </div>
  );
}
