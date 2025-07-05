import { getPackages } from '@/lib/data';
import { PageBanner, type BannerItem } from '@/components/page-banner';
import { PackagesClient } from './packages-client';
import { Suspense } from 'react';

export default async function PackagesPage() {
  try {
    const allPackages = await getPackages();
    
    const bannerItems: BannerItem[] = allPackages.slice(0, 5).map(p => ({
      id: p.id,
      image: p.images?.[0] || p.thumbnail || '/placeholder-image.jpg',
      name: p.name || 'Unknown Package',
      tagline: p.duration || 'Duration not specified'
    }));

    return (
      <div className="animate-fade-in">
        <Suspense fallback={<div className="h-64 bg-gray-200 animate-pulse" />}>
          <PageBanner title="Our Travel Packages" items={bannerItems} />
        </Suspense>
        <div className="container mx-auto px-4 py-16">
          <p className="text-center max-w-2xl mx-auto text-lg text-muted-foreground mb-12">
            Curated journeys designed to offer you an immersive spiritual and cultural experience.
          </p>
          <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>}>
            <PackagesClient packages={allPackages} />
          </Suspense>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading packages:', error);
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-headline text-center mb-8">Our Travel Packages</h1>
        <div className="text-center">
          <p className="text-muted-foreground">Unable to load packages. Please try again later.</p>
        </div>
      </div>
    );
  }
}