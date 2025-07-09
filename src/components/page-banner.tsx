'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { OptimizedMotionDiv } from '@/components/optimized-motion-div';
import { GlassCard } from '@/components/ui/glass-card';

interface PageBannerProps {
    title: string;
    subtitle: string;
    description: string;
    items?: Array<{
        id: string;
        image: string;
        name: string;
        tagline: string;
    }>;
    variant?: 'default' | 'cinematic';
    height?: string;
    showStats?: boolean;
    showFloatingElements?: boolean;
    className?: string;
    children?: ReactNode;
}

export function PageBanner({
                               title,
                               subtitle,
                               description,
                               items = [],
                               variant = 'default',
                               height = '60vh',
                               showStats = false,
                               showFloatingElements = false,
                               className,
                               children
                           }: PageBannerProps) {
    const backgroundImage = items[0]?.image || 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop';

    return (
        <section
            className={cn('relative w-full overflow-hidden', className)}
            style={{ height }}
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            {/* Floating Elements */}
            {showFloatingElements && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="absolute top-20 left-10 w-2 h-2 bg-white/30 rounded-full animate-ping" />
                    <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-blue-400/40 rounded-full animate-ping animation-delay-2000" />
                    <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-ping animation-delay-1000" />
                </div>
            )}

            {/* Content */}
            <div className="relative z-20 h-full flex items-center justify-center">
                <div className="text-center max-w-4xl mx-auto px-4">
                    <OptimizedMotionDiv preset="slideUp">
                        <h1 className="text-5xl md:text-7xl font-headline font-bold text-white mb-6 text-shadow-lg">
                            {title}
                        </h1>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="fadeIn">
                        <p className="text-xl md:text-2xl text-primary/90 font-light mb-6 text-shadow">
                            {subtitle}
                        </p>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="fadeIn">
                        <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed text-shadow">
                            {description}
                        </p>
                    </OptimizedMotionDiv>

                    {children}
                </div>
            </div>

            {/* Stats */}
            {showStats && items.length > 0 && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
                    <GlassCard className="px-6 py-3">
                        <div className="text-center text-white">
                            <div className="text-2xl font-bold">{items.length}+</div>
                            <div className="text-sm opacity-80">Destinations</div>
                        </div>
                    </GlassCard>
                </div>
            )}
        </section>
    );
}