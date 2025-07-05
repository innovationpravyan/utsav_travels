import { getPlaces } from '@/lib/data';
import { PageBanner, type BannerItem } from '@/components/page-banner';
import { DestinationsClient } from './destinations-client';

export default async function DestinationsPage() {
  const allPlaces = await getPlaces();
  
  const bannerItems: BannerItem[] = allPlaces.slice(0, 5).map(p => ({
    id: p.id,
    image: p.images[0] || p.thumbnail,
    name: p.name,
    tagline: p.tagline
  }));

  return (
    <div className="animate-fade-in">
       <PageBanner title="Explore Our Destinations" items={bannerItems} />
       <div className="container mx-auto px-4 py-16">
         <p className="text-center max-w-2xl mx-auto text-lg text-muted-foreground mb-12">
            Journey through sacred cities and timeless landmarks. Find your next spiritual adventure.
         </p>
         <DestinationsClient places={allPlaces} />
       </div>
    </div>
  );
}
