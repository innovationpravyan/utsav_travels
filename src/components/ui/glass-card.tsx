'use client';

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { usePerformancePreference } from "@/hooks/use-mobile";

// Glass card variants using CVA for consistent styling
const glassCardVariants = cva(
    "relative overflow-hidden rounded-lg transition-all duration-200",
    {
        variants: {
            variant: {
                default: "bg-white/10 backdrop-blur-sm border border-white/20",
                subtle: "bg-white/5 backdrop-blur-xs border border-white/10",
                strong: "bg-white/15 backdrop-blur-md border border-white/30",
                nav: "bg-black/50 backdrop-blur-md border-b border-white/10",
                card: "bg-white/8 backdrop-blur-sm border border-white/15 shadow-lg",
                panel: "bg-white/12 backdrop-blur-lg border border-white/25 shadow-xl",
                overlay: "bg-black/20 backdrop-blur-sm border border-white/5"
            },
            hover: {
                none: "",
                subtle: "hover:bg-white/15 hover:border-white/25",
                lift: "hover:bg-white/15 hover:border-white/25 hover:shadow-lg hover:-translate-y-1",
                glow: "hover:bg-white/15 hover:border-white/25 hover:shadow-2xl hover:shadow-primary/20",
                scale: "hover:bg-white/15 hover:border-white/25 hover:scale-[1.02]"
            },
            size: {
                sm: "p-3",
                default: "p-4",
                lg: "p-6",
                xl: "p-8"
            },
            radius: {
                none: "rounded-none",
                sm: "rounded-sm",
                default: "rounded-lg",
                lg: "rounded-xl",
                xl: "rounded-2xl",
                full: "rounded-full"
            }
        },
        defaultVariants: {
            variant: "default",
            hover: "subtle",
            size: "default",
            radius: "default"
        },
    }
);

export interface GlassCardProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof glassCardVariants> {
    asChild?: boolean;
    interactive?: boolean;
    disabled?: boolean;
    loading?: boolean;
    blur?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

// Glass effect utilities
const getBlurClass = (blur: GlassCardProps['blur']) => {
    switch (blur) {
        case 'none': return '';
        case 'xs': return 'backdrop-blur-xs';
        case 'sm': return 'backdrop-blur-sm';
        case 'md': return 'backdrop-blur-md';
        case 'lg': return 'backdrop-blur-lg';
        case 'xl': return 'backdrop-blur-xl';
        default: return '';
    }
};

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({
         className,
         variant,
         hover,
         size,
         radius,
         asChild = false,
         interactive = false,
         disabled = false,
         loading = false,
         blur,
         children,
         onClick,
         onKeyDown,
         tabIndex,
         role,
         ...props
     }, ref) => {
        const { shouldReduceEffects } = usePerformancePreference();

        // Determine if the card should be interactive
        const isInteractive = interactive || onClick || onKeyDown;

        // Handle keyboard interaction for accessibility
        const handleKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
            if (isInteractive && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                onClick?.(event as any);
            }
            onKeyDown?.(event);
        }, [isInteractive, onClick, onKeyDown]);

        // Reduce effects for performance
        const effectiveHover = shouldReduceEffects ? "none" : hover;
        const effectiveBlur = shouldReduceEffects ? 'sm' : blur;

        const Component = asChild ? React.Fragment : "div";

        if (asChild) {
            return (
                <React.Fragment>
                    {React.cloneElement(
                        React.Children.only(children as React.ReactElement),
                        {
                            className: cn(
                                glassCardVariants({ variant, hover: effectiveHover, size, radius }),
                                effectiveBlur && getBlurClass(effectiveBlur),
                                isInteractive && [
                                    "cursor-pointer",
                                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black",
                                    disabled && "cursor-not-allowed opacity-50"
                                ],
                                loading && "animate-pulse",
                                className
                            ),
                            ...props
                        }
                    )}
                </React.Fragment>
            );
        }

        return (
            <Component
                ref={ref}
                className={cn(
                    glassCardVariants({ variant, hover: effectiveHover, size, radius }),
                    effectiveBlur && getBlurClass(effectiveBlur),
                    isInteractive && [
                        "cursor-pointer",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black",
                        disabled && "cursor-not-allowed opacity-50"
                    ],
                    loading && "animate-pulse",
                    className
                )}
                onClick={disabled ? undefined : onClick}
                onKeyDown={disabled ? undefined : handleKeyDown}
                tabIndex={isInteractive && !disabled ? (tabIndex ?? 0) : undefined}
                role={role || (isInteractive ? "button" : undefined)}
                aria-disabled={disabled}
                {...(loading && { "aria-busy": true })}
                {...props}
            >
                {loading ? (
                    <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                ) : (
                    children
                )}
            </Component>
        );
    }
);

GlassCard.displayName = "GlassCard";

// Specialized glass card components
export const GlassPanel = React.forwardRef<HTMLDivElement, Omit<GlassCardProps, 'variant'>>(
    (props, ref) => <GlassCard ref={ref} variant="panel" {...props} />
);
GlassPanel.displayName = "GlassPanel";

export const GlassNavigation = React.forwardRef<HTMLDivElement, Omit<GlassCardProps, 'variant'>>(
    (props, ref) => <GlassCard ref={ref} variant="nav" {...props} />
);
GlassNavigation.displayName = "GlassNavigation";

export const GlassOverlay = React.forwardRef<HTMLDivElement, Omit<GlassCardProps, 'variant'>>(
    (props, ref) => <GlassCard ref={ref} variant="overlay" {...props} />
);
GlassOverlay.displayName = "GlassOverlay";

// Glass button component
export const GlassButton = React.forwardRef<HTMLButtonElement,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> & VariantProps<typeof glassCardVariants>
>(({ className, variant = "default", hover = "lift", size = "default", radius = "default", children, ...props }, ref) => {
    const { shouldReduceEffects } = usePerformancePreference();
    const effectiveHover = shouldReduceEffects ? "none" : hover;

    return (
        <button
            ref={ref}
            className={cn(
                glassCardVariants({ variant, hover: effectiveHover, size, radius }),
                "cursor-pointer transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "active:scale-95",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
});
GlassButton.displayName = "GlassButton";

// Glass input wrapper
export const GlassInput = React.forwardRef<HTMLDivElement, GlassCardProps & {
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    label?: string;
    error?: string;
}>(({ className, inputProps, label, error, children, ...props }, ref) => {
    return (
        <GlassCard
            ref={ref}
            variant="subtle"
            size="default"
            className={cn("space-y-2", className)}
            {...props}
        >
            {label && (
                <label className="text-sm font-medium text-white/80 block">
                    {label}
                </label>
            )}
            <div className="relative">
                {children || (
                    <input
                        className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/50 text-sm"
                        {...inputProps}
                    />
                )}
            </div>
            {error && (
                <p className="text-xs text-red-400 mt-1">{error}</p>
            )}
        </GlassCard>
    );
});
GlassInput.displayName = "GlassInput";

export { GlassCard, glassCardVariants };