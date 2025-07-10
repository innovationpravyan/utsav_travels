'use client';

import { useState, useEffect } from 'react';
import { X, Phone, MessageCircle, Mail } from 'lucide-react';
import { cn } from '@/utils/utils';
import { GlassCard } from '@/components/ui/glass-card';

// Import constants from utils
import {
    CONTACT_METHODS,
    COMPANY_INFO
} from '@/utils/utils';

// Guide-specific configuration (inline since removed from utils)
const GUIDE_CONFIG = {
    showDelay: 5000, // Show after 5 seconds
    title: "Need Help Planning?",
    description: "Our travel experts are here to assist",
    buttonText: "Get Assistance",
    expandButtonText: "Show Less",
} as const;

// Icon mapping for dynamic icons
const ICON_MAP = {
    Phone,
    MessageCircle,
    Mail
} as const;

// Helper function to get icon component
const getIconComponent = (iconName: string) => {
    return ICON_MAP[iconName as keyof typeof ICON_MAP];
};

// Transform CONTACT_METHODS to guide-friendly format
const getGuideContactOptions = () => {
    return CONTACT_METHODS.slice(0, 3).map(method => ({
        icon: method.icon,
        label: method.title,
        value: method.title === 'Call Us' ? COMPANY_INFO.contact.phoneDisplay :
            method.title === 'WhatsApp' ? 'Chat Now' :
                method.title === 'Email Us' ? COMPANY_INFO.contact.email :
                    method.value,
        href: method.href,
        color: method.title === 'Call Us' ? 'text-blue-400' :
            method.title === 'WhatsApp' ? 'text-green-400' :
                method.title === 'Email Us' ? 'text-purple-400' :
                    'text-gray-400'
    }));
};

export function Guide() {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, GUIDE_CONFIG.showDelay);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    const guideContactOptions = getGuideContactOptions();

    return (
        <div className={cn(
            "fixed bottom-50 right-6 z-40 transition-all duration-500",
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        )}>
            <GlassCard className="p-4 max-w-sm">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="text-white font-semibold text-sm">{GUIDE_CONFIG.title}</h3>
                        <p className="text-white/70 text-xs">{GUIDE_CONFIG.description}</p>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-white/50 hover:text-white transition-colors"
                        aria-label="Close guide"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {isExpanded ? (
                    <div className="space-y-2">
                        {guideContactOptions.map((option) => {
                            const IconComponent = getIconComponent(option.icon);
                            return (
                                <a
                                    key={option.label}
                                    href={option.href}
                                    target={option.href.startsWith('http') ? '_blank' : '_self'}
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors group"
                                    aria-label={`${option.label}: ${option.value}`}
                                >
                                    {IconComponent && (
                                        <IconComponent className={cn(
                                            "w-4 h-4",
                                            option.color,
                                            "group-hover:scale-110 transition-transform"
                                        )} />
                                    )}
                                    <div>
                                        <div className="text-white text-xs font-medium">{option.label}</div>
                                        <div className="text-white/60 text-xs">{option.value}</div>
                                    </div>
                                </a>
                            );
                        })}
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="w-full text-center text-white/60 text-xs py-1 hover:text-white transition-colors"
                        >
                            {GUIDE_CONFIG.expandButtonText}
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="w-full text-center bg-primary hover:bg-primary/80 text-white text-sm py-2 rounded-lg transition-colors font-medium"
                    >
                        {GUIDE_CONFIG.buttonText}
                    </button>
                )}
            </GlassCard>
        </div>
    );
}