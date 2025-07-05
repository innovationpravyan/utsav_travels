import { getPlaces, getPackages } from "@/lib/data";
import { HomeClient } from "@/components/home-client";

export default async function Home() {
  const featuredPlaces = (await getPlaces()).slice(0, 5);
  const popularPackages = (await getPackages()).slice(0, 3);

  return <HomeClient featuredPlaces={featuredPlaces} popularPackages={popularPackages} />;
}
