'use client';

import { useState, useEffect } from 'react';
import { X, Phone, MessageCircle, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/glass-card';

// Import constants from utils
import {
    GUIDE_CONTACT_OPTIONS,
    GUIDE_CONFIG
} from '@/lib/utils';

// Icon mapping for dynamic icons
const ICON_MAP = {
    Phone,
    MessageCircle,
    Mail
} as const;

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

    return (
        <div className={cn(
            "fixed bottom-24 left-6 z-40 transition-all duration-500",
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
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {isExpanded ? (
                    <div className="space-y-2">
                        {GUIDE_CONTACT_OPTIONS.map((option) => {
                            const IconComponent = ICON_MAP[option.icon as keyof typeof ICON_MAP];
                            return (
                                <a
                                    key={option.label}
                                    href={option.href}
                                    target={option.href.startsWith('http') ? '_blank' : '_self'}
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors group"
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