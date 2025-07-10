'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { cn, COMPANY_INFO, WHATSAPP_TEMPLATES, createWhatsAppUrl } from '@/utils/utils';

export function WhatsappButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 2000); // Show after 2 seconds

        return () => clearTimeout(timer);
    }, []);

    const handleClick = () => {
        const whatsappUrl = createWhatsAppUrl(WHATSAPP_TEMPLATES.default);
        window.open(whatsappUrl, '_blank');
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group",
                "animate-bounce hover:animate-none",
                isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
            )}
            aria-label="Contact us on WhatsApp"
        >
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />

            {/* Pulse animation */}
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
        </button>
    );
}