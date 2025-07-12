'use client';

import Link from 'next/link';
import React, {memo} from 'react';
import {
    Award,
    Clock,
    ExternalLink,
    Facebook,
    Heart,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Plane,
    Shield,
    Twitter,
    Users,
    Youtube,
    Crown,
    Gem,
    Sparkles
} from 'lucide-react';
// Import constants from utils - Updated to match new structure
import {
    cn,
    COMPANY_INFO,
    CONTACT_METHODS,
    FOOTER_SECTIONS,
    LEGAL_LINKS,
    SCHEMA_MARKUP,
    SOCIAL_LINKS,
    TRUST_INDICATORS
} from '@/utils/utils';
import {Button} from '@/components/ui/button';
import {GlassCard} from '@/components/ui/glass-card';
import {OptimizedMotionDiv, StaggerContainer} from '@/components/optimized-motion-div';
import {usePerformancePreference} from '@/hooks/use-mobile';

// Newsletter configuration (inline since it was removed from utils)
const NEWSLETTER_CONFIG = {
    title: "Get Luxury Travel Inspiration",
    description: "Subscribe to receive exclusive travel insights, destination guides, and luxury offers.",
    placeholder: "Enter your email",
    buttonText: "Subscribe",
    privacyText: "We respect your privacy. Unsubscribe at any time.",
} as const;

// Types
interface FooterSection {
    title: string;
    links: Array<{
        label: string;
        href: string;
        external?: boolean;
        description?: string;
    }>;
}

interface SocialLink {
    name: string;
    href: string;
    icon: React.ReactNode;
    color: string;
    followers?: string;
}

interface ContactInfo {
    icon: React.ReactNode;
    title: string;
    value: string;
    href?: string;
    description?: string;
}

// Icon mapping for dynamic icons
const ICON_MAP = {
    Phone,
    Mail,
    MapPin,
    Clock,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Shield,
    Award,
    Users,
    Crown,
    Gem,
    Sparkles
} as const;

// Helper function to get icon component
const getIconComponent = (iconName: string) => {
    return ICON_MAP[iconName as keyof typeof ICON_MAP];
};

// Memoized footer section component
const FooterSection = memo(({section, index}: { section: FooterSection; index: number }) => (
    <OptimizedMotionDiv preset="slideUp" delay={index * 100}>
        <div className="space-y-4 md:space-y-6">
            <h3 className="text-white font-heading font-semibold text-lg md:text-xl">{section.title}</h3>
            <ul className="space-y-3 md:space-y-4">
                {section.links.map((link) => (
                    <li key={link.label}>
                        <Link
                            href={link.href}
                            className={cn(
                                "text-white/70 hover:text-white transition-all duration-300 text-sm md:text-base",
                                "flex items-center gap-2 group hover:translate-x-1"
                            )}
                            {...(link.external && {
                                target: "_blank",
                                rel: "noopener noreferrer",
                                'aria-label': `${link.label} (opens in new tab)`
                            })}
                        >
                            <span className="group-hover:text-carnation-300 transition-colors">
                                {link.label}
                            </span>
                            {link.external && <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity"/>}
                        </Link>
                        {link.description && (
                            <p className="text-white/50 text-xs md:text-sm mt-1 ml-0 leading-relaxed">{link.description}</p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    </OptimizedMotionDiv>
));

FooterSection.displayName = 'FooterSection';

// Memoized contact info component - Updated for new structure
const ContactInfoItem = memo(({info, index}: { info: ContactInfo; index: number }) => {
    const IconComponent = getIconComponent(info.icon as string);

    return (
        <OptimizedMotionDiv preset="fadeIn" delay={index * 100}>
            <div className="flex items-start gap-3 md:gap-4 group">
                <div className="flex-shrink-0 p-2 md:p-3 glass-luxury rounded-xl group-hover:bg-white/20 transition-all duration-300">
                    {IconComponent && <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-white"/>}
                </div>
                <div className="flex-1">
                    <p className="text-white/60 text-xs md:text-sm font-medium">{info.title}</p>
                    {info.href ? (
                        <Link
                            href={info.href}
                            className="text-white hover:text-carnation-300 transition-colors text-sm md:text-base font-medium"
                        >
                            {info.value}
                        </Link>
                    ) : (
                        <p className="text-white text-sm md:text-base font-medium">{info.value}</p>
                    )}
                    {info.description && (
                        <p className="text-white/50 text-xs md:text-sm mt-1 leading-relaxed">{info.description}</p>
                    )}
                </div>
            </div>
        </OptimizedMotionDiv>
    );
});

ContactInfoItem.displayName = 'ContactInfoItem';

// Memoized social links component
const SocialLinks = memo(() => {
    const {shouldReduceEffects} = usePerformancePreference();

    return (
        <OptimizedMotionDiv preset="slideUp" delay={400}>
            <div className="space-y-4 md:space-y-6">
                <h4 className="text-white font-heading font-medium text-lg md:text-xl">Follow Our Journey</h4>
                <div className="flex gap-3 md:gap-4">
                    {SOCIAL_LINKS.map((social) => {
                        const IconComponent = getIconComponent(social.icon);
                        return (
                            <Link
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    "p-3 md:p-4 glass-luxury rounded-xl transition-all duration-300 text-white/70",
                                    social.color,
                                    "hover:bg-white/20 hover:text-white",
                                    !shouldReduceEffects && "hover:scale-110 hover:-translate-y-1"
                                )}
                                aria-label={`Follow us on ${social.name}${social.followers ? ` - ${social.followers} followers` : ''}`}
                            >
                                {IconComponent && <IconComponent className="w-5 h-5 md:w-6 md:h-6"/>}
                            </Link>
                        );
                    })}
                </div>
                <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm text-white/50">
                    {SOCIAL_LINKS.map((social) => (
                        social.followers && (
                            <span key={social.name} className="flex items-center gap-1">
                                <span className="font-medium">{social.name}:</span>
                                <span>{social.followers}</span>
                            </span>
                        )
                    ))}
                </div>
            </div>
        </OptimizedMotionDiv>
    );
});

SocialLinks.displayName = 'SocialLinks';

// Memoized newsletter component
const Newsletter = memo(() => (
    <OptimizedMotionDiv preset="slideUp" delay={500}>
        <div className="card-luxury p-6 md:p-8 space-y-4 md:space-y-6 bg-gradient-to-br from-thistle-500/20 to-fairy-500/20">
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-thistle-500 to-fairy-500 rounded-full flex items-center justify-center">
                        <Crown className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                </div>
                <h4 className="text-white font-heading font-semibold text-lg md:text-xl mb-2">
                    {NEWSLETTER_CONFIG.title}
                </h4>
                <p className="text-white/70 text-sm md:text-base leading-relaxed">
                    {NEWSLETTER_CONFIG.description}
                </p>
            </div>

            <form className="space-y-3 md:space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                    <input
                        type="email"
                        placeholder={NEWSLETTER_CONFIG.placeholder}
                        className={cn(
                            "flex-1 px-4 py-3 md:py-4 glass-luxury border border-white/20 rounded-xl",
                            "text-white placeholder:text-white/50 text-sm md:text-base",
                            "focus:outline-none focus:ring-2 focus:ring-carnation-400/50 focus:border-carnation-400/50",
                            "transition-all duration-300"
                        )}
                        required
                    />
                    <Button
                        type="submit"
                        className="btn-accent px-6 py-3 md:py-4 text-sm md:text-base whitespace-nowrap"
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {NEWSLETTER_CONFIG.buttonText}
                    </Button>
                </div>
                <p className="text-white/50 text-xs md:text-sm leading-relaxed">
                    {NEWSLETTER_CONFIG.privacyText}
                </p>
            </form>
        </div>
    </OptimizedMotionDiv>
));

Newsletter.displayName = 'Newsletter';

// Memoized trust indicators
const TrustIndicators = memo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {TRUST_INDICATORS.map((indicator, index) => {
            const IconComponent = getIconComponent(indicator.icon);
            return (
                <OptimizedMotionDiv key={indicator.label} preset="fadeIn" delay={index * 100}>
                    <div className="flex items-center gap-3 md:gap-4 text-center sm:text-left p-4 glass-luxury rounded-xl hover:bg-white/10 transition-all duration-300">
                        {IconComponent && <IconComponent className={cn("w-5 h-5 md:w-6 md:h-6 flex-shrink-0", indicator.color)}/>}
                        <div>
                            <p className="text-white text-sm md:text-base font-medium">{indicator.label}</p>
                            <p className="text-white/60 text-xs md:text-sm">{indicator.value}</p>
                        </div>
                    </div>
                </OptimizedMotionDiv>
            );
        })}
    </div>
));

TrustIndicators.displayName = 'TrustIndicators';

// Main footer component
export const Footer = memo(() => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative section-elegant text-white overflow-hidden">
            {/* Luxury background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_1px)] bg-[length:32px_32px]"/>
            </div>

            {/* Floating luxury elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-thistle-400/10 to-fairy-400/10 rounded-full blur-3xl animate-float-elegant" />
                <div className="absolute bottom-20 right-20 w-56 h-56 bg-gradient-to-r from-carnation-400/10 to-uranian-400/10 rounded-full blur-3xl animate-float-elegant delay-1000" />
            </div>

            <div className="relative z-10">
                {/* Main footer content */}
                <div className="container-luxury section-padding-sm">
                    <StaggerContainer staggerDelay={100}>
                        {/* Top section */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">

                            {/* Company info and contact */}
                            <div className="lg:col-span-1 space-y-6 md:space-y-8">
                                <OptimizedMotionDiv preset="slideUp">
                                    <div className="space-y-4 md:space-y-6">
                                        {/* Logo and tagline */}
                                        <Link href="/" className="flex items-center gap-3 group">
                                            <div className="relative">
                                                <Plane className="h-8 w-8 md:h-10 md:w-10 text-thistle-400 group-hover:rotate-12 transition-transform duration-300"/>
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-carnation-400 rounded-full animate-ping opacity-75" />
                                            </div>
                                            <div>
                                                <span className="text-2xl md:text-3xl font-display font-bold text-gradient-luxury">
                                                    {COMPANY_INFO.name}
                                                </span>
                                                <p className="text-white/60 text-sm md:text-base font-heading">{COMPANY_INFO.tagline}</p>
                                            </div>
                                        </Link>

                                        <p className="text-white/70 leading-relaxed text-sm md:text-base">
                                            {COMPANY_INFO.footerDescription}
                                        </p>
                                    </div>
                                </OptimizedMotionDiv>

                                {/* Contact information - Updated to use CONTACT_METHODS */}
                                <div className="space-y-4 md:space-y-6">
                                    {CONTACT_METHODS.map((info, index) => (
                                        <ContactInfoItem key={info.title} info={info} index={index}/>
                                    ))}
                                </div>
                            </div>

                            {/* Footer sections */}
                            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
                                {FOOTER_SECTIONS.map((section, index) => (
                                    <FooterSection key={section.title} section={section} index={index}/>
                                ))}
                            </div>

                            {/* Social and newsletter */}
                            <div className="lg:col-span-1 space-y-6 md:space-y-8">
                                <SocialLinks/>
                                <Newsletter/>
                            </div>
                        </div>

                        {/* Trust indicators */}
                        <OptimizedMotionDiv preset="fadeIn" delay={600}>
                            <div className="py-8 md:py-12 border-t border-white/10">
                                <TrustIndicators/>
                            </div>
                        </OptimizedMotionDiv>

                        {/* Bottom section */}
                        <OptimizedMotionDiv preset="fadeIn" delay={700}>
                            <div className="pt-8 md:pt-12 border-t border-white/10">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">

                                    {/* Copyright */}
                                    <div className="text-center md:text-left">
                                        <p className="text-white/60 text-sm md:text-base">
                                            © {currentYear} {COMPANY_INFO.name}. All rights reserved.
                                        </p>
                                        <p className="text-white/50 text-xs md:text-sm mt-1 flex items-center justify-center md:justify-start gap-1">
                                            Made with <Heart className="w-3 h-3 md:w-4 md:h-4 text-carnation-400 fill-current animate-pulse"/> in India
                                        </p>
                                    </div>

                                    {/* Legal links */}
                                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base">
                                        {LEGAL_LINKS.map((link) => (
                                            <Link
                                                key={link.label}
                                                href={link.href}
                                                className="text-white/60 hover:text-white hover:text-carnation-300 transition-colors duration-300"
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </OptimizedMotionDiv>
                    </StaggerContainer>
                </div>

                {/* Back to top button */}
                <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8">
                    <Button
                        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                        size="icon"
                        className={cn(
                            "w-12 h-12 md:w-14 md:h-14 rounded-full glass-luxury hover:bg-white/20",
                            "text-white border border-white/20 shadow-luxury transition-all duration-300",
                            "hover:scale-110 hover:-translate-y-1"
                        )}
                        aria-label="Scroll to top"
                    >
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                        </svg>
                    </Button>
                </div>
            </div>

            {/* Schema markup for organization */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(SCHEMA_MARKUP.organization)
                }}
            />
        </footer>
    );
});

Footer.displayName = 'Footer';