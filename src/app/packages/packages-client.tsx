'use client';

import {useMemo, useState} from 'react';
import {type Package} from '@/lib/data';
import {OptimizedPackageCard} from '@/components/optimized-package-card';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Search, X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {OptimizedMotionDiv} from '@/components/optimized-motion-div';
import { PLACEHOLDERS } from '@/utils/utils';

export function PackagesClient({packages}: { packages: Package[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('all');

    // Safe packages with defaults using constants
    const safePackages = useMemo(() => {
        return packages?.map(pkg => ({
            id: pkg?.id || Math.random().toString(),
            name: pkg?.name || PLACEHOLDERS.text.unknownPackage,
            tagline: pkg?.tagline || PLACEHOLDERS.text.defaultTagline,
            description: pkg?.description || '',
            duration: pkg?.duration || PLACEHOLDERS.text.defaultDuration,
            cities: pkg?.cities || [],
            price: pkg?.price || PLACEHOLDERS.text.contactForPricing,
            thumbnail: pkg?.thumbnail || PLACEHOLDERS.images.package,
            images: pkg?.images || [],
            tags: pkg?.tags || [],
            highlights: pkg?.highlights || [],
            inclusions: pkg?.inclusions || [],
            itinerary: pkg?.itinerary || []
        })) || [];
    }, [packages]);

    const cities = useMemo(() => {
        const citySet = new Set(['all']);
        safePackages.forEach(pkg => {
            pkg.cities.forEach(city => citySet.add(city));
        });
        return Array.from(citySet);
    }, [safePackages]);

    const filteredPackages = useMemo(() => {
        return safePackages.filter(pkg => {
            const matchesSearch = searchQuery.trim() === '' ||
                pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pkg.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesCity = selectedCity === 'all' || pkg.cities.includes(selectedCity);

            return matchesSearch && matchesCity;
        });
    }, [safePackages, searchQuery, selectedCity]);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCity('all');
    };

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (searchQuery.trim() !== '') count++;
        if (selectedCity !== 'all') count++;
        return count;
    }, [searchQuery, selectedCity]);

    return (
        <div className="space-y-6">
            {/* Filter Controls */}
            <Card className="p-4 lg:p-6 bg-white/5 backdrop-blur-sm border-white/10 glass-card">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Input */}
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50"/>
                        <Input
                            placeholder="Search by name or tag..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                            >
                                <X className="h-4 w-4"/>
                            </button>
                        )}
                    </div>

                    {/* City Filter */}
                    <div className="w-full md:w-[200px]">
                        <Select value={selectedCity} onValueChange={setSelectedCity}>
                            <SelectTrigger
                                className="bg-white/10 border-white/20 text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20">
                                <SelectValue placeholder="Filter by City"/>
                            </SelectTrigger>
                            <SelectContent className="bg-black/90 backdrop-blur-md border-white/20">
                                {cities.map(city => (
                                    <SelectItem
                                        key={city}
                                        value={city}
                                        className="text-white hover:bg-white/10 focus:bg-white/10"
                                    >
                                        {city === 'all' ? 'All Cities' : city}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Clear Filters */}
                    {activeFilterCount > 0 && (
                        <Button
                            variant="outline"
                            onClick={clearFilters}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 whitespace-nowrap"
                        >
                            <X className="h-4 w-4 mr-2"/>
                            Clear All
                        </Button>
                    )}
                </div>

                {/* Active Filters */}
                {activeFilterCount > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex flex-wrap gap-2">
                            <span className="text-white/70 text-sm mr-2">Active filters:</span>

                            {searchQuery && (
                                <Badge
                                    variant="secondary"
                                    className="bg-primary/20 text-primary border-primary/30 cursor-pointer hover:bg-primary/30"
                                    onClick={() => setSearchQuery('')}
                                >
                                    Search: "{searchQuery}" <X className="h-3 w-3 ml-1"/>
                                </Badge>
                            )}

                            {selectedCity !== 'all' && (
                                <Badge
                                    variant="secondary"
                                    className="bg-blue-500/20 text-blue-400 border-blue-500/30 cursor-pointer hover:bg-blue-500/30"
                                    onClick={() => setSelectedCity('all')}
                                >
                                    City: {selectedCity} <X className="h-3 w-3 ml-1"/>
                                </Badge>
                            )}
                        </div>
                    </div>
                )}
            </Card>

            {/* Results Summary */}
            <div className="flex items-center justify-between text-white/70 text-sm px-2">
                <span>
                    Showing {filteredPackages.length} of {safePackages.length} packages
                </span>
                {filteredPackages.length !== safePackages.length && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-primary hover:text-primary/80"
                    >
                        Show all
                    </Button>
                )}
            </div>

            {/* Packages Grid */}
            {filteredPackages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPackages.map((pkg, index) => (
                        <OptimizedMotionDiv
                            key={pkg.id}
                            preset="fadeIn"
                            className="w-full"
                        >
                            <OptimizedPackageCard pkg={pkg} index={index} showAnimation={false}/>
                        </OptimizedMotionDiv>
                    ))}
                </div>
            ) : (
                <OptimizedMotionDiv preset="fadeIn" className="text-center py-16 px-4">
                    <div className="max-w-md mx-auto">
                        <div
                            className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="h-8 w-8 text-white/50"/>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            No packages found
                        </h3>
                        <p className="text-white/60 mb-6">
                            We couldn't find any packages matching your criteria. Try adjusting your filters or search
                            terms.
                        </p>
                        <Button
                            variant="outline"
                            onClick={clearFilters}
                            className="border-primary/30 text-primary hover:bg-primary/10"
                        >
                            Clear filters and show all
                        </Button>
                    </div>
                </OptimizedMotionDiv>
            )}
        </div>
    );
}