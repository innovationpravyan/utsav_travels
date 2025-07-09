import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'subtle' | 'default' | 'strong'
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        const variantClasses = {
            subtle: 'glass-subtle',
            default: 'glass-card',
            strong: 'glass-strong'
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-lg",
                    variantClasses[variant],
                    className
                )}
                {...props}
            />
        )
    }
)
GlassCard.displayName = "GlassCard"

export { GlassCard }