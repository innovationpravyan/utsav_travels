'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, User, MessageSquare } from 'lucide-react';

interface FormData {
    name: string;
    email: string;
    phone: string;
    message: string;
}

export function ContactForm() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', phone: '', message: '' });
        }, 3000);
    };

    if (isSubmitted) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Thank You!</h3>
                <p className="text-white/70">We'll get back to you within 24 hours.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
                <Label htmlFor="name" className="text-white/90 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                </Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                </Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
                <Label htmlFor="phone" className="text-white/90 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                </Label>
                <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter your phone number"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
            </div>

            {/* Message Field */}
            <div className="space-y-2">
                <Label htmlFor="message" className="text-white/90 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Message
                </Label>
                <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us about your travel preferences and requirements..."
                    rows={4}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 resize-none"
                />
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-semibold py-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
                {isSubmitting ? (
                    <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending Message...
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Send Message
                    </span>
                )}
            </Button>

            {/* WhatsApp Alternative */}
            <div className="text-center">
                <p className="text-white/60 text-sm mb-3">Or contact us directly</p>
                <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp Us
                </a>
            </div>
        </form>
    );
}