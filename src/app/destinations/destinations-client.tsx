'use client';

import { useState, useMemo, useEffect } from 'react';
import { type Place } from '@/lib/data';
import { PlaceCard } from '@/components/place-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MotionDiv, StaggerContainer } from '@/components/motion-div';

/**
 * Enhanced Destinations Client Component with Mobile Responsiveness
 * 
 * This component provides a fully responsive destination filtering and display system.
 * Major improvements for mobile usability and accessibility.
 * 
 * Features:
 * - Touch-friendly filter controls
 * - Collapsible mobile filter panel
 * - Improved search input size
 * - Better select dropdown handling
 * - Responsive grid layout
 * - Enhanced accessibility
 * - Smooth animations
 * - SSR-safe window access
 */

export function DestinationsClient({ places }: { places: Place[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Handle client-side hydration and window access
  useEffect(() => {
    setIsClient(true);
    
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    
    return () => {
      window.removeEventListener('resize', checkDesktop);
    };
  }, []);

  // Auto-hide mobile filters on desktop
  useEffect(() => {
    if (isDesktop && showMobileFilters) {
      setShowMobileFilters(false);
    }
  }, [isDesktop, showMobileFilters]);

  // Extract unique cities and categories
  const cities = useMemo(() => ['all', ...Array.from(new Set(places.map(p => p.city)))], [places]);
  const categories = useMemo(() => ['all', ...Array.from(new Set(places.map(p => p.category)))], [places]);

  // Filter places based on search and selections
  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      const matchesSearch = searchQuery.trim() === '' || 
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCity = selectedCity === 'all' || place.city === selectedCity;
      const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
      
      return matchesSearch && matchesCity && matchesCategory;
    });
  }, [places, searchQuery, selectedCity, selectedCategory]);

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('all');
    setSelectedCategory('all');
    setShowMobileFilters(false);
  };

  /**
   * Get active filter count for mobile display
   */
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim() !== '') count++;
    if (selectedCity !== 'all') count++;
    if (selectedCategory !== 'all') count++;
    return count;
  }, [searchQuery, selectedCity, selectedCategory]);

  // Determine if filters should be shown
  const shouldShowFilters = isDesktop || showMobileFilters;

  return (
    <div className="space-y-6">
      {/* Mobile Filter Toggle Button */}
      <div className="block lg:hidden">
        <Button
          variant="outline"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full h-14 bg-white/5 border-white/20 text-white hover:bg-white/10 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-5 w-5" />
            <span className="text-base font-medium">
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </span>
          </div>
          {showMobileFilters ? <X className="h-5 w-5" /> : <Filter className="h-5 w-5" />}
        </Button>
      </div>

      {/* Filter Controls */}
      <MotionDiv
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: shouldShowFilters ? 'auto' : 0,
          opacity: shouldShowFilters ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden lg:!h-auto lg:!opacity-100"
      >
        <Card className="p-4 lg:p-6 bg-white/5 backdrop-blur-sm border-white/10 glass-card">
          <div className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-4">
            {/* Search Input - Mobile Optimized */}
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
              <Input 
                placeholder="Search destinations, cities, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 lg:h-12 pl-12 pr-4 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-base lg:text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* City Filter - Mobile Optimized */}
            <div className="w-full lg:w-[220px]">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="h-14 lg:h-12 bg-white/10 border-white/20 text-white text-base lg:text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Filter by City" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 backdrop-blur-md border-white/20">
                  {cities.map(city => (
                    <SelectItem 
                      key={city} 
                      value={city}
                      className="text-white hover:bg-white/10 focus:bg-white/10 text-base lg:text-sm py-3 lg:py-2"
                    >
                      {city === 'all' ? 'All Cities' : city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter - Mobile Optimized */}
            <div className="w-full lg:w-[220px]">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-14 lg:h-12 bg-white/10 border-white/20 text-white text-base lg:text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 backdrop-blur-md border-white/20">
                  {categories.map(cat => (
                    <SelectItem 
                      key={cat} 
                      value={cat}
                      className="text-white hover:bg-white/10 focus:bg-white/10 text-base lg:text-sm py-3 lg:py-2"
                    >
                      {cat === 'all' ? 'All Categories' : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            {activeFilterCount > 0 && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="h-14 lg:h-12 px-6 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 whitespace-nowrap"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
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
                    Search: "{searchQuery}" <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                
                {selectedCity !== 'all' && (
                  <Badge 
                    variant="secondary" 
                    className="bg-blue-500/20 text-blue-400 border-blue-500/30 cursor-pointer hover:bg-blue-500/30"
                    onClick={() => setSelectedCity('all')}
                  >
                    City: {selectedCity} <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                
                {selectedCategory !== 'all' && (
                  <Badge 
                    variant="secondary" 
                    className="bg-green-500/20 text-green-400 border-green-500/30 cursor-pointer hover:bg-green-500/30"
                    onClick={() => setSelectedCategory('all')}
                  >
                    Category: {selectedCategory} <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </Card>
      </MotionDiv>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-white/70 text-sm px-2">
        <span>
          Showing {filteredPlaces.length} of {places.length} destinations
        </span>
        {filteredPlaces.length !== places.length && (
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

      {/* Places Grid */}
      {filteredPlaces.length > 0 ? (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 xl:gap-8">
          {filteredPlaces.map((place, index) => (
            <MotionDiv
              key={place.id}
              preset="slideUp"
              delay={index * 0.1}
              className="w-full"
            >
              <PlaceCard place={place} />
            </MotionDiv>
          ))}
        </StaggerContainer>
      ) : (
        <MotionDiv 
          preset="fadeIn"
          className="text-center py-16 px-4"
        >
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-white/50" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No destinations found
            </h3>
            <p className="text-white/60 mb-6">
              We couldn't find any destinations matching your criteria. Try adjusting your filters or search terms.
            </p>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              Clear filters and show all
            </Button>
          </div>
        </MotionDiv>
      )}
    </div>
  );
}