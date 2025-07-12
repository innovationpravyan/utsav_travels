'use client';

import Link from "next/link";
import { Menu, Phone, Plane, X, User, MapPin, Compass, Sparkles, Crown, Star, Globe } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCallback, useEffect, useRef, useState, memo } from "react";
import { cn } from "@/utils/utils";
import { useOptimizedScroll, useSafeWindow } from "@/utils/three-utils";
import { usePerformancePreference } from "@/hooks/use-mobile";

// Import constants from utils
import {
    NAV_LINKS,
    COMPANY_INFO
} from '@/utils/utils';

// Enhanced icon mapping for luxury travel theme
const ICON_MAP = {
    MapPin,
    Plane,
    User,
    Phone,
    Compass,
    Globe,
    Star
} as const;

// Types for better type safety
interface HeaderState {
    isScrolled: boolean;
    isVisible: boolean;
    scrollProgress: number;
    isAtTop: boolean;
}

interface NavLinksProps {
    className?: string;
    mobile?: boolean;
    onLinkClick?: () => void;
}

// Memoized navigation links component with luxury styling
const NavLinks = memo(({ className, mobile = false, onLinkClick }: NavLinksProps) => {
    const { shouldReduceMotion } = usePerformancePreference();

    return (
        <nav className={cn("flex items-center gap-2 lg:gap-8", className)} role="navigation">
            {NAV_LINKS.map((link, index) => {
                const IconComponent = ICON_MAP[link.icon as keyof typeof ICON_MAP];
                return (
                    <div
                        key={link.href}
                        className={cn(
                            "nav-link-container relative",
                            mobile && !shouldReduceMotion && "animate-slide-up",
                            mobile && shouldReduceMotion && "opacity-100"
                        )}
                        style={mobile && !shouldReduceMotion ? { animationDelay: `${index * 150}ms` } : undefined}
                    >
                        <Link
                            href={link.href}
                            className={cn(
                                "relative group transition-all duration-400 ease-out",
                                "text-sm lg:text-base font-semibold",
                                mobile ?
                                    "flex items-center gap-4 text-lg py-4 px-4 rounded-2xl glass-dreamy hover:glass-luxury text-white" :
                                    "text-white/90 hover:text-white hover:scale-110",
                                "focus:outline-none focus:ring-2 focus:ring-carnation-400 focus:ring-offset-2 focus:ring-offset-transparent rounded-xl"
                            )}
                            onClick={onLinkClick!}
                            aria-label={`Navigate to ${link.label} - ${link.description}`}
                        >
                            {mobile && IconComponent && (
                                <div className="p-2 rounded-xl bg-gradient-to-r from-thistle-500/20 to-fairy-500/20">
                                    <IconComponent className="w-5 h-5 text-carnation-400" />
                                </div>
                            )}
                            <span className="relative z-10">{link.label}</span>
                            {!mobile && (
                                <>
                                    {/* Luxury gradient underline */}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-carnation-500 via-fairy-500 to-thistle-500 transition-all duration-400 group-hover:w-full rounded-full" />
                                    {/* Floating sparkle effect */}
                                    <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-carnation-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:rotate-12" />
                                </>
                            )}
                        </Link>
                    </div>
                );
            })}
        </nav>
    );
});

NavLinks.displayName = 'NavLinks';

// Memoized luxury logo component
const LuxuryLogo = memo(({ mobile = false }: { mobile?: boolean }) => {
    const { shouldReduceEffects } = usePerformancePreference();

    return (
        <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-carnation-400 focus:ring-offset-2 focus:ring-offset-transparent rounded-xl p-2"
            aria-label={`${COMPANY_INFO.name} - Luxury Travel Home`}
        >
            <div className={cn(
                "relative p-2 rounded-xl bg-gradient-to-r from-thistle-500/20 to-carnation-500/20 backdrop-blur-sm",
                "transition-all duration-400 ease-out",
                !shouldReduceEffects && "group-hover:rotate-12 group-hover:scale-110 group-hover:from-carnation-500/30 group-hover:to-fairy-500/30"
            )}>
                <Plane className="h-6 w-6 lg:h-7 lg:w-7 text-white group-hover:text-carnation-200 transition-colors duration-300" />
                {/* Floating crown effect */}
                <Crown className="absolute -top-1 -right-1 w-3 h-3 text-carnation-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </div>
            <div className="flex flex-col">
                <span className={cn(
                    "font-bold text-gradient-luxury leading-tight transition-all duration-300",
                    mobile ? "text-2xl" : "text-xl lg:text-2xl",
                    !shouldReduceEffects && "group-hover:scale-105"
                )}>
                    {COMPANY_INFO.name}
                </span>
                <span className="text-xs text-white/70 font-medium tracking-wider">LUXURY TRAVEL</span>
            </div>
        </Link>
    );
});

LuxuryLogo.displayName = 'LuxuryLogo';

// Memoized premium CTA button component
const PremiumCTAButton = memo(({ mobile = false, className }: { mobile?: boolean; className?: string }) => {
    const { shouldReduceEffects } = usePerformancePreference();

    return (
        <Button
            asChild
            className={cn(
                "relative overflow-hidden group",
                "bg-gradient-to-r from-carnation-500 via-fairy-500 to-thistle-500",
                "hover:from-carnation-600 hover:via-fairy-600 hover:to-thistle-600",
                "shadow-luxury hover:shadow-dreamy",
                "transition-all duration-400 ease-out",
                !shouldReduceEffects && "hover:scale-105 hover:-translate-y-1",
                mobile ? "w-full text-lg py-6 px-8 rounded-2xl" : "px-6 py-3 rounded-xl",
                className
            )}
        >
            <Link
                href="/contact"
                className="relative z-10 flex items-center gap-3"
                aria-label="Request premium travel consultation"
            >
                {/* Animated background shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                <div className="p-1 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
                    <Phone className={cn(
                        "animate-pulse transition-transform duration-300",
                        mobile ? "h-5 w-5" : "h-4 w-4",
                        "group-hover:rotate-12"
                    )} />
                </div>
                <span className="font-semibold tracking-wide">
                    {mobile ? "Request Premium Consultation" : "Get Quote"}
                </span>
                <Sparkles className="w-4 h-4 group-hover:animate-spin transition-transform duration-300" />
            </Link>
        </Button>
    );
});

PremiumCTAButton.displayName = 'PremiumCTAButton';

// Luxury mobile menu component
const LuxuryMobileMenu = memo(({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) => {
    const handleLinkClick = useCallback(() => {
        onOpenChange(false);
    }, [onOpenChange]);

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "relative glass-dreamy hover:glass-luxury",
                        "transition-all duration-400 ease-out hover:scale-110 lg:hidden",
                        "rounded-xl p-3 backdrop-blur-md"
                    )}
                    aria-label={isOpen ? "Close luxury menu" : "Open luxury menu"}
                >
                    <div className={cn(
                        "transition-all duration-300 ease-out",
                        isOpen && "rotate-90 scale-110"
                    )}>
                        {isOpen ?
                            <X className="h-6 w-6 text-white" /> :
                            <Menu className="h-6 w-6 text-white" />
                        }
                    </div>
                    {/* Floating particles */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1 right-1 w-1 h-1 bg-carnation-400 rounded-full animate-ping" />
                        <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-fairy-400 rounded-full animate-ping animation-delay-500" />
                    </div>
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className={cn(
                    "glass-luxury backdrop-blur-2xl border-white/20 w-80 lg:w-96",
                    "bg-gradient-to-br from-thistle-900/90 via-fairy-900/90 to-carnation-900/90"
                )}
                aria-label="Luxury navigation menu"
            >
                <div className="flex flex-col gap-8 pt-8 h-full relative">
                    {/* Floating background effects */}
                    <div className="absolute inset-0 pointer-events-none opacity-30">
                        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-thistle-400/20 to-fairy-400/20 rounded-full blur-2xl animate-float-elegant" />
                        <div className="absolute bottom-40 right-10 w-40 h-40 bg-gradient-to-r from-carnation-400/15 to-uranian-400/15 rounded-full blur-3xl animate-float-elegant delay-1000" />
                    </div>

                    {/* Mobile Logo */}
                    <div className="px-2 relative z-10">
                        <LuxuryLogo mobile />
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 relative z-10">
                        <div className="mb-6">
                            <h3 className="text-white/60 text-sm font-semibold tracking-widest uppercase mb-4 px-4">
                                Explore Destinations
                            </h3>
                            <NavLinks
                                className="flex-col items-start gap-3"
                                mobile
                                onLinkClick={handleLinkClick}
                            />
                        </div>
                    </div>

                    {/* Premium CTA */}
                    <div className="px-2 pb-6 relative z-10">
                        <PremiumCTAButton mobile />
                    </div>

                    {/* Quick contact info with luxury styling */}
                    <div className="px-4 py-6 border-t border-white/20 relative z-10">
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="p-3 rounded-full bg-gradient-to-r from-thistle-500/20 to-carnation-500/20">
                                    <Phone className="w-6 h-6 text-carnation-400" />
                                </div>
                            </div>
                            <div>
                                <p className="text-white/60 text-sm mb-2">24/7 Luxury Concierge</p>
                                <a
                                    href={`tel:${COMPANY_INFO.contact.phone}`}
                                    className="text-carnation-400 font-semibold text-lg hover:text-carnation-300 transition-colors"
                                    onClick={handleLinkClick}
                                >
                                    {COMPANY_INFO.contact.phoneDisplay}
                                </a>
                            </div>
                            <div className="flex justify-center gap-2">
                                <Star className="w-4 h-4 text-carnation-400 fill-current" />
                                <Star className="w-4 h-4 text-fairy-400 fill-current" />
                                <Star className="w-4 h-4 text-thistle-400 fill-current" />
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
});

LuxuryMobileMenu.displayName = 'LuxuryMobileMenu';

// Header scroll progress indicator with luxury styling
const LuxuryScrollProgress = memo(({ progress }: { progress: number }) => (
    <div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-carnation-500 via-fairy-500 to-thistle-500 origin-left transition-transform duration-100 shadow-luxury"
        style={{ transform: `scaleX(${progress})` }}
        role="progressbar"
        aria-label="Page scroll progress"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
    />
));

LuxuryScrollProgress.displayName = 'LuxuryScrollProgress';

// Enhanced floating particles effect
const LuxuryFloatingParticles = memo(({ show }: { show: boolean }) => {
    if (!show) return null;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60" aria-hidden="true">
            <div className="absolute top-2 left-1/4 w-1 h-1 bg-carnation-400 rounded-full animate-ping" />
            <div className="absolute top-3 right-1/3 w-0.5 h-0.5 bg-fairy-400 rounded-full animate-ping animation-delay-1000" />
            <div className="absolute top-1 right-1/4 w-0.5 h-0.5 bg-thistle-400 rounded-full animate-ping animation-delay-2000" />
            <div className="absolute top-4 left-1/3 w-0.5 h-0.5 bg-uranian-400 rounded-full animate-ping animation-delay-1500" />
        </div>
    );
});

LuxuryFloatingParticles.displayName = 'LuxuryFloatingParticles';

// Main ultra pro max header component
export function Header() {
    const isMobile = useIsMobile();
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [headerState, setHeaderState] = useState<HeaderState>({
        isScrolled: false,
        isVisible: true,
        scrollProgress: 0,
        isAtTop: true
    });

    const lastScrollY = useRef(0);
    const windowObj = useSafeWindow();
    const { shouldReduceEffects } = usePerformancePreference();

    // Optimized scroll handler with luxury effects
    const handleScroll = useCallback((scrollY: number) => {
        const scrollDelta = scrollY - lastScrollY.current;
        const isScrollingDown = scrollDelta > 0;
        const isAtTop = scrollY <= 10;

        // Show/hide header based on scroll direction and position
        const shouldHide = isScrollingDown && scrollY > 100 && !isSheetOpen;
        const isVisible = !shouldHide || isAtTop;

        // Enhanced glass effect threshold for luxury appearance
        const isScrolled = scrollY > 20;

        // Calculate scroll progress safely
        let scrollProgress = 0;
        if (windowObj?.document) {
            const totalHeight = windowObj.document.documentElement.scrollHeight - windowObj.innerHeight;
            scrollProgress = totalHeight > 0 ? Math.min(scrollY / totalHeight, 1) : 0;
        }

        setHeaderState({
            isScrolled,
            isVisible,
            scrollProgress,
            isAtTop
        });

        lastScrollY.current = scrollY;
    }, [isSheetOpen, windowObj]);

    // Setup scroll listener
    useOptimizedScroll(handleScroll, 16);

    // Close mobile menu on escape key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isSheetOpen) {
                setSheetOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isSheetOpen]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isSheetOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isSheetOpen]);

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-400 ease-out",
                headerState.isScrolled && "glass-nav shadow-luxury backdrop-blur-2xl border-b border-white/10",
                !headerState.isScrolled && "bg-transparent",
                headerState.isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
            )}
            role="banner"
        >
            {/* Enhanced background overlay with luxury gradients */}
            <div
                className={cn(
                    "absolute inset-0 transition-all duration-400",
                    headerState.isScrolled
                        ? "bg-gradient-to-r from-thistle-900/95 via-fairy-900/95 to-carnation-900/95 opacity-100"
                        : "bg-gradient-to-r from-black/40 via-black/20 to-black/40 opacity-0"
                )}
            />

            {/* Luxury shimmer effect */}
            {headerState.isScrolled && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-shimmerLuxury" />
            )}

            {/* Main header content */}
            <div className="container-luxury flex h-16 lg:h-20 items-center justify-between px-4 lg:px-8 relative z-10">

                {/* Logo Section */}
                <div className="logo-container">
                    <LuxuryLogo />
                </div>

                {/* Desktop Navigation */}
                {!isMobile ? (
                    <div className="flex items-center gap-8">
                        <NavLinks />
                        <PremiumCTAButton />
                    </div>
                ) : (
                    /* Mobile Menu */
                    <LuxuryMobileMenu isOpen={isSheetOpen} onOpenChange={setSheetOpen} />
                )}
            </div>

            {/* Luxury Scroll Progress Indicator */}
            <LuxuryScrollProgress progress={headerState.scrollProgress} />

            {/* Enhanced Floating Particles Effect */}
            {!shouldReduceEffects && (
                <LuxuryFloatingParticles show={headerState.isScrolled} />
            )}

            {/* Luxury border gradient */}
            {headerState.isScrolled && (
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-carnation-400/50 to-transparent" />
            )}
        </header>
    );
}

// Hook for header state (if needed by other components)
export function useHeaderState() {
    const [headerHeight, setHeaderHeight] = useState(80); // 5rem default for luxury spacing

    useEffect(() => {
        const updateHeaderHeight = () => {
            const header = document.querySelector('header');
            if (header) {
                setHeaderHeight(header.offsetHeight);
            }
        };

        updateHeaderHeight();
        window.addEventListener('resize', updateHeaderHeight);

        return () => window.removeEventListener('resize', updateHeaderHeight);
    }, []);

    return { headerHeight };
}