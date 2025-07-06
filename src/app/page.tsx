// src/app/page.tsx

import { getPlaces, getPackages } from "@/lib/data";
import { HomeClient } from "@/components/home-client";
import { HomeVideoHero } from "@/components/video-hero-banner";
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
      <div className="relative">
        {/* Video Hero Banner */}
        <Suspense fallback={
          <div className="h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            <div className="text-white text-xl animate-pulse">Loading experience...</div>
          </div>
        }>
          <HomeVideoHero 
            videoSrc="/videos/home-hero.webm"
            fallbackImage="https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          />
        </Suspense>

        {/* Rest of Home Content */}
        <Suspense fallback={
          <div className="min-h-screen bg-black">
            <div className="container mx-auto px-4 py-16 text-center">
              <div className="text-white">Loading content...</div>
            </div>
          </div>
        }>
          <HomeClient featuredPlaces={featuredPlaces} popularPackages={popularPackages} />
        </Suspense>
      </div>
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