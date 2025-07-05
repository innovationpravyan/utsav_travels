"use client";

import Link from "next/link";
import { Plane, Menu, Phone, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const NAV_LINKS = [
  { href: "/destinations", label: "Destinations" },
  { href: "/packages", label: "Packages" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const isMobile = useIsMobile();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const { scrollY } = useScroll();

  // Handle scroll direction and visibility
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY;
    setLastScrollY(latest);
    
    // Show/hide header based on scroll direction
    if (latest > previous && latest > 100) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    
    // Add glass effect when scrolled
    setIsScrolled(latest > 50);
  });

  const NavLinks = ({ className, mobile = false }: { className?: string; mobile?: boolean }) => (
    <nav className={cn("flex items-center gap-4 lg:gap-6", className)}>
      {NAV_LINKS.map((link, index) => (
        <motion.div
          key={link.href}
          initial={mobile ? { opacity: 0, x: -20 } : {}}
          animate={mobile ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: mobile ? index * 0.1 : 0 }}
        >
          <Link
            href={link.href}
            className={cn(
              "relative text-sm font-medium transition-all duration-300 text-foreground/80 hover:text-foreground group",
              mobile && "text-lg py-2"
            )}
            onClick={() => setSheetOpen(false)}
          >
            {link.label}
            {/* Animated underline */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-accent origin-left"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
              style={{ width: "100%" }}
            />
            {/* Glow effect on hover */}
            <motion.div
              className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
              initial={{ scale: 0.8 }}
              whileHover={{ scale: 1 }}
            />
          </Link>
        </motion.div>
      ))}
    </nav>
  );

  return (
    <motion.header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        isScrolled && "glass-nav shadow-2xl",
        !isScrolled && "bg-transparent"
      )}
      initial={{ y: 0 }}
      animate={{ 
        y: isVisible ? 0 : -100,
        backdropFilter: isScrolled ? "blur(20px)" : "blur(0px)"
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Background overlay for better contrast */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-black/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: isScrolled ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="container flex h-16 items-center justify-between px-4 relative z-10">
        {/* Logo with enhanced animation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              className="relative"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Plane className="h-6 w-6 text-primary" />
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 h-6 w-6 text-primary opacity-0 group-hover:opacity-50 blur-sm"
                whileHover={{ scale: 1.5 }}
              >
                <Plane className="h-6 w-6" />
              </motion.div>
            </motion.div>
            <motion.span 
              className="font-headline text-xl font-bold text-gradient"
              whileHover={{ 
                textShadow: "0 0 20px rgba(255,193,7,0.8)" 
              }}
            >
              Utsav Travels
            </motion.span>
          </Link>
        </motion.div>

        {isMobile ? (
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <motion.div
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="glass-subtle hover:glass-strong transition-all duration-300"
                >
                  <motion.div
                    animate={{ rotate: isSheetOpen ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isSheetOpen ? <X /> : <Menu />}
                  </motion.div>
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </motion.div>
            </SheetTrigger>
            <SheetContent side="right" className="glass-strong backdrop-blur-2xl border-white/10">
              <motion.div 
                className="flex flex-col gap-8 pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link href="/" className="flex items-center gap-2" onClick={() => setSheetOpen(false)}>
                    <Plane className="h-6 w-6 text-primary" />
                    <span className="font-headline text-xl font-bold text-gradient">Utsav Travels</span>
                  </Link>
                </motion.div>
                
                <NavLinks className="flex-col items-start gap-4" mobile />
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button 
                    asChild 
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-105"
                  >
                    <Link href="/contact" onClick={() => setSheetOpen(false)}>
                      <Phone className="mr-2 h-4 w-4" />
                      Request a Call
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center gap-6">
            {/* Desktop Navigation */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <NavLinks />
            </motion.div>
            
            {/* CTA Button with enhanced styling */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                asChild
                className={cn(
                  "relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary",
                  "transition-all duration-500 shadow-xl hover:shadow-2xl",
                  "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent",
                  "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
                )}
              >
                <Link href="/contact" className="relative z-10 flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Phone className="h-4 w-4" />
                  </motion.div>
                  Request a Call
                </Link>
              </Button>
            </motion.div>
          </div>
        )}
      </div>
      
      {/* Progress bar at bottom of header */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary origin-left"
        style={{
          scaleX: useScroll().scrollYProgress,
        }}
        initial={{ scaleX: 0 }}
      />
      
      {/* Floating particles for premium feel */}
      {isScrolled && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-2 left-1/4 w-1 h-1 bg-primary/30 rounded-full"
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-3 right-1/3 w-0.5 h-0.5 bg-accent/40 rounded-full"
            animate={{
              y: [0, -8, 0],
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute top-1 right-1/4 w-0.5 h-0.5 bg-primary/50 rounded-full"
            animate={{
              y: [0, -6, 0],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>
      )}
    </motion.header>
  );
}