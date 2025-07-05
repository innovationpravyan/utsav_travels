'use client';

import { useState, useMemo } from 'react';
import { type Place } from '@/lib/data';
import { PlaceCard } from '@/components/place-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

export function DestinationsClient({ places }: { places: Place[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const cities = useMemo(() => ['all', ...Array.from(new Set(places.map(p => p.city)))], [places]);
  const categories = useMemo(() => ['all', ...Array.from(new Set(places.map(p => p.category)))], [places]);

  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      const matchesSearch = searchQuery.trim() === '' || 
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCity = selectedCity === 'all' || place.city === selectedCity;
      const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
      
      return matchesSearch && matchesCity && matchesCategory;
    });
  }, [places, searchQuery, selectedCity, selectedCategory]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-12 p-4 bg-secondary rounded-lg">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search by name or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by City" />
          </SelectTrigger>
          <SelectContent>
            {cities.map(city => (
              <SelectItem key={city} value={city}>{city === 'all' ? 'All Cities' : city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredPlaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      ) : (
         <p className="text-center text-muted-foreground text-lg col-span-full">No destinations found matching your criteria.</p>
      )}
    </>
  );
}
