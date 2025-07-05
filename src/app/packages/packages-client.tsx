'use client';

import { useState, useMemo } from 'react';
import { type Package } from '@/lib/data';
import { PackageCard } from '@/components/package-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

export function PackagesClient({ packages }: { packages: Package[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

  const cities = useMemo(() => ['all', ...Array.from(new Set(packages.flatMap(p => p.cities)))], [packages]);

  const filteredPackages = useMemo(() => {
    return packages.filter(pkg => {
      const matchesSearch = searchQuery.trim() === '' || 
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCity = selectedCity === 'all' || pkg.cities.includes(selectedCity);
      
      return matchesSearch && matchesCity;
    });
  }, [packages, searchQuery, selectedCity]);

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
      </div>

      {filteredPackages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg col-span-full">No packages found matching your criteria.</p>
      )}
    </>
  );
}
