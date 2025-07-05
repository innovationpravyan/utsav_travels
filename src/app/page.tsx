import Link from "next/link";
import { HeroBanner } from "@/components/hero-banner";
import { PlaceCard } from "@/components/place-card";
import { PackageCard } from "@/components/package-card";
import { getPlaces, getPackages } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const featuredPlaces = getPlaces().slice(0, 3);
  const popularPackages = getPackages().slice(0, 3);

  return (
    <div className="animate-fade-in">
      <HeroBanner />

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-headline text-center mb-4">Featured Destinations</h2>
          <p className="text-center max-w-2xl mx-auto text-lg text-muted-foreground mb-12">
            Discover breathtaking locations, handpicked by our travel experts for an unforgettable experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
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
