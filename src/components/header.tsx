'use client';

import Link from "next/link";
import { Menu, Phone, Plane, X, User, MapPin } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCallback, useEffect, useRef, useState, memo } from "react";
import { cn } from "@/lib/utils";
import { useOptimizedScroll, useSafeWindow } from "@/utils/three-utils";
import { usePerformancePreference } from "@/hooks/use-mobile";

// Navigation links configuration
const NAV_LINKS = [
    { href: "/destinations", label: "Destinations", icon: MapPin, description: "Sacred places to visit" },
    { href: "/packages", label: "Packages", icon: Plane, description: "Curated travel experiences" },
    { href: "/about", label: "About Us", icon: User, description: "Our story and mission" },
    { href: "/contact", label: "Contact", icon: Phone, description: "Get in touch with us" },
] as const;

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

// Memoized navigation links component
const NavLinks = memo(({ className, mobile = false, onLinkClick }: NavLinksProps) => {
    const { shouldReduceMotion } = usePerformancePreference();

    return (
        <nav className={cn("flex items-center gap-4 lg:gap-6", className)} role="navigation">
            {NAV_LINKS.map((link, index) => (
                <div
                    key={link.href}
                    className={cn(
                        "nav-link-container",
                        mobile && !shouldReduceMotion && "animate-slide-up",
                        mobile && shouldReduceMotion && "opacity-100"
                    )}
                    style={mobile && !shouldReduceMotion ? { animationDelay: `${index * 100}ms` } : undefined}
                >
                    <Link
                        href={link.href}
                        className={cn(
                            "relative group transition-all duration-200",
                            "text-sm font-medium text-foreground/80 hover:text-foreground",
                            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black rounded-md",
                            mobile ? "flex items-center gap-3 text-lg py-3 px-2" : "hover:scale-105"
                        )}
                        onClick={onLinkClick!}
                        aria-label={`Navigate to ${link.label} - ${link.description}`}
                    >
                        {mobile && <link.icon className="w-5 h-5 text-primary" />}
                        <span>{link.label}</span>
                        {!mobile && (
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-200 group-hover:w-full" />
                        )}
                    </Link>
                </div>
            ))}
        </nav>
    );
});

NavLinks.displayName = 'NavLinks';

// Memoized logo component
const Logo = memo(({ mobile = false }: { mobile?: boolean }) => {
    const { shouldReduceEffects } = usePerformancePreference();

    return (
        <Link
            href="/"
            className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black rounded-lg p-1"
            aria-label="Utsav Travels - Home"
        >
            <div className={cn(
                "relative transition-transform duration-200",
                !shouldReduceEffects && "group-hover:rotate-12 group-hover:scale-110"
            )}>
                <Plane className="h-6 w-6 text-primary" />
            </div>
            <span className={cn(
                "font-bold text-gradient transition-all duration-200",
                mobile ? "text-2xl" : "text-xl",
                !shouldReduceEffects && "group-hover:scale-105"
            )}>
        Utsav Travels
      </span>
        </Link>
    );
});

Logo.displayName = 'Logo';

// Memoized CTA button component
const CTAButton = memo(({ mobile = false, className }: { mobile?: boolean; className?: string }) => {
    const { shouldReduceEffects } = usePerformancePreference();

    return (
        <Button
            asChild
            className={cn(
                "relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary",
                "transition-all duration-300 shadow-xl hover:shadow-2xl",
                !shouldReduceEffects && "hover:scale-105",
                mobile && "w-full text-lg py-6",
                className
            )}
        >
            <Link
                href="/contact"
                className="relative z-10 flex items-center gap-2"
                aria-label="Request a callback from our travel experts"
            >
                <Phone className={cn("animate-pulse", mobile ? "h-5 w-5" : "h-4 w-4")} />
                Request a Call
            </Link>
        </Button>
    );
});

CTAButton.displayName = 'CTAButton';

// Mobile menu component
const MobileMenu = memo(({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) => {
    const handleLinkClick = useCallback(() => {
        onOpenChange(false);
    }, [onOpenChange]);

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="glass-subtle hover:glass-strong transition-all duration-200 hover:scale-110 lg:hidden"
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                    <div className={cn("transition-transform duration-200", isOpen && "rotate-90")}>
                        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </div>
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="glass-strong backdrop-blur-2xl border-white/10 w-80"
                aria-label="Navigation menu"
            >
                <div className="flex flex-col gap-8 pt-8 h-full">
                    {/* Mobile Logo */}
                    <div className="px-2">
                        <Logo mobile />
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1">
                        <NavLinks
                            className="flex-col items-start gap-2"
                            mobile
                            onLinkClick={handleLinkClick}
                        />
                    </div>

                    {/* Mobile CTA */}
                    <div className="px-2 pb-6">
                        <CTAButton mobile />
                    </div>

                    {/* Quick contact info */}
                    <div className="px-2 py-4 border-t border-white/10">
                        <div className="text-center">
                            <p className="text-white/60 text-sm mb-2">Need immediate assistance?</p>
                            <a
                                href="tel:+919876543210"
                                className="text-primary font-semibold hover:text-accent transition-colors"
                                onClick={handleLinkClick}
                            >
                                +91 98765 43210
                            </a>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
});

MobileMenu.displayName = 'MobileMenu';

// Header scroll progress indicator
const ScrollProgress = memo(({ progress }: { progress: number }) => (
    <div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary origin-left transition-transform duration-100"
        style={{ transform: `scaleX(${progress})` }}
        role="progressbar"
        aria-label="Page scroll progress"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
    />
));

ScrollProgress.displayName = 'ScrollProgress';

// Floating particles effect
const FloatingParticles = memo(({ show }: { show: boolean }) => {
    if (!show) return null;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30" aria-hidden="true">
            <div className="absolute top-2 left-1/4 w-1 h-1 bg-primary rounded-full animate-ping" />
            <div className="absolute top-3 right-1/3 w-0.5 h-0.5 bg-accent rounded-full animate-ping animation-delay-1000" />
            <div className="absolute top-1 right-1/4 w-0.5 h-0.5 bg-primary rounded-full animate-ping animation-delay-2000" />
        </div>
    );
});

FloatingParticles.displayName = 'FloatingParticles';

// Main header component
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

    // Optimized scroll handler with performance optimizations
    const handleScroll = useCallback((scrollY: number) => {
        const scrollDelta = scrollY - lastScrollY.current;
        const isScrollingDown = scrollDelta > 0;
        const isAtTop = scrollY <= 10;

        // Show/hide header based on scroll direction and position
        const shouldHide = isScrollingDown && scrollY > 100 && !isSheetOpen;
        const isVisible = !shouldHide || isAtTop;

        // Glass effect threshold
        const isScrolled = scrollY > 50;

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
                "fixed top-0 z-50 w-full transition-all duration-300",
                headerState.isScrolled && "glass-nav shadow-2xl backdrop-blur-md",
                !headerState.isScrolled && "bg-transparent",
                headerState.isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
            )}
            role="banner"
        >
            {/* Background overlay for better contrast */}
            <div
                className={cn(
                    "absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-black/20 transition-opacity duration-200",
                    headerState.isScrolled ? "opacity-100" : "opacity-0"
                )}
            />

            {/* Main header content */}
            <div className="container flex h-16 items-center justify-between px-4 relative z-10">

                {/* Logo Section */}
                <div className="logo-container">
                    <Logo />
                </div>

                {/* Desktop Navigation */}
                {!isMobile ? (
                    <div className="flex items-center gap-6">
                        <NavLinks />
                        <CTAButton />
                    </div>
                ) : (
                    /* Mobile Menu */
                    <MobileMenu isOpen={isSheetOpen} onOpenChange={setSheetOpen} />
                )}
            </div>

            {/* Scroll Progress Indicator */}
            <ScrollProgress progress={headerState.scrollProgress} />

            {/* Floating Particles Effect */}
            {!shouldReduceEffects && (
                <FloatingParticles show={headerState.isScrolled} />
            )}
        </header>
    );
}

// Hook for header state (if needed by other components)