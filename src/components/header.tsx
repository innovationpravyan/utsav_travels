"use client";

import Link from "next/link";
import {Menu, Phone, Plane, X} from "lucide-react";
import {useIsMobile} from "@/hooks/use-mobile";
import {Button} from "./ui/button";
import {Sheet, SheetContent, SheetTrigger} from "./ui/sheet";
import {useRef, useState} from "react";
import {cn} from "@/lib/utils";
import {useOptimizedScroll, useSafeWindow} from "./three-utils";

const NAV_LINKS = [
    {href: "/destinations", label: "Destinations"},
    {href: "/packages", label: "Packages"},
    {href: "/about", label: "About Us"},
    {href: "/contact", label: "Contact"},
];

export function Header() {
    const isMobile = useIsMobile();
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);
    const lastScrollY = useRef(0);
    const windowObj = useSafeWindow();

    // Optimized scroll handler
    useOptimizedScroll((scrollY) => {
        // Show/hide header based on scroll direction
        if (scrollY > lastScrollY.current && scrollY > 100) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }

        // Add glass effect when scrolled
        setIsScrolled(scrollY > 50);

        // Calculate scroll progress safely
        if (windowObj?.document) {
            const totalHeight = windowObj.document.documentElement.scrollHeight - windowObj.innerHeight;
            const progress = totalHeight > 0 ? Math.min(scrollY / totalHeight, 1) : 0;
            setScrollProgress(progress);
        }

        lastScrollY.current = scrollY;
    }, 8);

    const NavLinks = ({className, mobile = false}: { className?: string; mobile?: boolean }) => (
        <nav className={cn("flex items-center gap-4 lg:gap-6", className)}>
            {NAV_LINKS.map((link, index) => (
                <div
                    key={link.href}
                    className={cn(
                        "nav-link-container",
                        mobile && "animate-slide-up"
                    )}
                >
                    <Link
                        href={link.href}
                        className={cn(
                            "relative text-sm font-medium transition-all duration-200 text-foreground/80 hover:text-foreground group",
                            "hover:scale-105",
                            mobile && "text-lg py-2"
                        )}
                        onClick={() => setSheetOpen(false)}
                    >
                        {link.label}
                        <span
                            className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-200 group-hover:w-full"/>
                    </Link>
                </div>
            ))}
        </nav>
    );

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300",
                isScrolled && "glass-nav shadow-2xl backdrop-blur-md",
                !isScrolled && "bg-transparent",
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
            )}
        >
            {/* Background overlay */}
            <div
                className={cn(
                    "absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-black/20 transition-opacity duration-200",
                    isScrolled ? "opacity-100" : "opacity-0"
                )}
            />

            <div className="container flex h-16 items-center justify-between px-4 relative z-10">
                {/* Logo */}
                <div className="logo-container">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div
                            className="relative transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110">
                            <Plane className="h-6 w-6 text-primary"/>
                        </div>
                        <span
                            className="font-headline text-xl font-bold text-gradient transition-all duration-200 group-hover:scale-105">
              Utsav Travels
            </span>
                    </Link>
                </div>

                {isMobile ? (
                    <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="glass-subtle hover:glass-strong transition-all duration-200 hover:scale-110"
                            >
                                <div className={cn("transition-transform duration-200", isSheetOpen && "rotate-90")}>
                                    {isSheetOpen ? <X/> : <Menu/>}
                                </div>
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="glass-strong backdrop-blur-2xl border-white/10">
                            <div className="flex flex-col gap-8 pt-8">
                                <div>
                                    <Link href="/" className="flex items-center gap-2"
                                          onClick={() => setSheetOpen(false)}>
                                        <Plane className="h-6 w-6 text-primary"/>
                                        <span
                                            className="font-headline text-xl font-bold text-gradient">Utsav Travels</span>
                                    </Link>
                                </div>

                                <NavLinks className="flex-col items-start gap-4" mobile/>

                                <div>
                                    <Button
                                        asChild
                                        className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                                    >
                                        <Link href="/contact" onClick={() => setSheetOpen(false)}>
                                            <Phone className="mr-2 h-4 w-4"/>
                                            Request a Call
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                ) : (
                    <div className="flex items-center gap-6">
                        {/* Desktop Navigation */}
                        <div>
                            <NavLinks/>
                        </div>

                        {/* CTA Button */}
                        <div>
                            <Button
                                asChild
                                className={cn(
                                    "relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary",
                                    "transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                                )}
                            >
                                <Link href="/contact" className="relative z-10 flex items-center gap-2">
                                    <Phone className="h-4 w-4 animate-pulse"/>
                                    Request a Call
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Scroll progress bar */}
            <div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary origin-left transition-transform duration-100"
                style={{
                    transform: `scaleX(${scrollProgress})`,
                }}
            />

            {/* Floating particles */}
            {isScrolled && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                    <div className="absolute top-2 left-1/4 w-1 h-1 bg-primary rounded-full animate-ping"/>
                    <div
                        className="absolute top-3 right-1/3 w-0.5 h-0.5 bg-accent rounded-full animate-ping animation-delay-1000"/>
                    <div
                        className="absolute top-1 right-1/4 w-0.5 h-0.5 bg-primary rounded-full animate-ping animation-delay-2000"/>
                </div>
            )}
        </header>
    );
}