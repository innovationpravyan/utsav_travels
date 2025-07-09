'use client';

import { useState, useEffect } from 'react';
import { X, Phone, MessageCircle, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/glass-card';

export function Guide() {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 5000); // Show after 5 seconds

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    const contactOptions = [
        {
            icon: Phone,
            label: "Call Us now",
            value: "+91 98765 43210",
            href: "tel:+919876543210",
            color: "text-blue-400"
        },
        {
            icon: MessageCircle,
            label: "WhatsApp",
            value: "Chat Now",
            href: "https://wa.me/919876543210",
            color: "text-green-400"
        },
        {
            icon: Mail,
            label: "Email",
            value: "info@utsavtravels.com",
            href: "mailto:info@utsavtravels.com",
            color: "text-purple-400"
        }
    ];

    return (
        <div className={cn(
            "fixed bottom-24 left-6 z-40 transition-all duration-500",
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        )}>
            <GlassCard className="p-4 max-w-sm">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="text-white font-semibold text-sm">Need Help Planning?</h3>
                        <p className="text-white/70 text-xs">Our travel experts are here to assist</p>
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
                        {contactOptions.map((option) => (
                            <a
                                key={option.label}
                                href={option.href}
                                target={option.href.startsWith('http') ? '_blank' : '_self'}
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors group"
                            >
                                <option.icon className={cn("w-4 h-4", option.color, "group-hover:scale-110 transition-transform")} />
                                <div>
                                    <div className="text-white text-xs font-medium">{option.label}</div>
                                    <div className="text-white/60 text-xs">{option.value}</div>
                                </div>
                            </a>
                        ))}
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="w-full text-center text-white/60 text-xs py-1 hover:text-white transition-colors"
                        >
                            Show Less
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="w-full text-center bg-primary hover:bg-primary/80 text-white text-sm py-2 rounded-lg transition-colors font-medium"
                    >
                        Get Assistance
                    </button>
                )}
            </GlassCard>
        </div>
    );
}