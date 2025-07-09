'use client';

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const SheetContext = React.createContext<{
    open: boolean
    onOpenChange: (open: boolean) => void
} | null>(null)

const Sheet = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
    open: boolean
    onOpenChange: (open: boolean) => void
}
>(({ children, open, onOpenChange, ...props }, ref) => {
    return (
        <SheetContext.Provider value={{ open, onOpenChange }}>
            <div ref={ref} {...props}>
                {children}
                {open && (
                    <div
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                        onClick={() => onOpenChange(false)}
                    />
                )}
            </div>
        </SheetContext.Provider>
    )
})
Sheet.displayName = "Sheet"

const SheetTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean
}
>(({ className, children, asChild, ...props }, ref) => {
    const context = React.useContext(SheetContext)

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            ...props,
            onClick: () => context?.onOpenChange(true),
        } as any)
    }

    return (
        <button
            ref={ref}
            className={className}
            onClick={() => context?.onOpenChange(true)}
            {...props}
        >
            {children}
        </button>
    )
})
SheetTrigger.displayName = "SheetTrigger"

const SheetContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
    side?: 'top' | 'right' | 'bottom' | 'left'
}
>(({ className, children, side = 'right', ...props }, ref) => {
    const context = React.useContext(SheetContext)

    if (!context?.open) return null

    const sideClasses = {
        top: 'top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom: 'bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
        right: 'right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm'
    }

    return (
        <div
            ref={ref}
            className={cn(
                "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
                sideClasses[side],
                className
            )}
            {...props}
        >
            {children}
            <button
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                onClick={() => context?.onOpenChange(false)}
            >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </button>
        </div>
    )
})
SheetContent.displayName = "SheetContent"

export {
    Sheet,
    SheetTrigger,
    SheetContent,
}