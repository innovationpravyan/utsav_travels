import { getPackages } from '@/lib/data';
import { PageBanner, type BannerItem } from '@/components/page-banner';
import { PackagesClient } from './packages-client';

export default async function PackagesPage() {
  const allPackages = await getPackages();
  
  const bannerItems: BannerItem[] = allPackages.slice(0, 5).map(p => ({
    id: p.id,
    image: p.images[0] || p.thumbnail,
    name: p.name,
    tagline: p.tagline
  }));

  return (
    <div className="animate-fade-in">
       <PageBanner title="Our Travel Packages" items={bannerItems} />
       <div className="container mx-auto px-4 py-16">
         <p className="text-center max-w-2xl mx-auto text-lg text-muted-foreground mb-12">
            Curated journeys designed to offer you an immersive spiritual and cultural experience.
         </p>
         <PackagesClient packages={allPackages} />
       </div>
    </div>
  );
}
