import { getPlaces, getPackages } from "@/lib/data";
import { HomeClient } from "@/components/home-client";
import { Suspense } from 'react';

export default async function Home() {
  try {
    const [places, packages] = await Promise.all([
      getPlaces().catch(() => []),
      getPackages().catch(() => [])
    ]);

    const featuredPlaces = places.slice(0, 5);
    const popularPackages = packages.slice(0, 3);

    return (
      <Suspense fallback={<div className="h-screen w-full bg-black animate-pulse" />}>
        <HomeClient featuredPlaces={featuredPlaces} popularPackages={popularPackages} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error loading home page data:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome</h1>
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </div>
    );
  }
}