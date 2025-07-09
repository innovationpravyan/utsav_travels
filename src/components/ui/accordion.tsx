'use client';

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const AccordionContext = React.createContext<{
    type: 'single' | 'multiple'
    value?: string | string[]
    onValueChange?: (value: string | string[]) => void
    collapsible?: boolean
} | null>(null)

const Accordion = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
    type: 'single' | 'multiple'
    value?: string | string[]
    onValueChange?: (value: string | string[]) => void
    collapsible?: boolean
}
>(({ className, children, type, value, onValueChange, collapsible, ...props }, ref) => {
    return (
        <AccordionContext.Provider value={{ type, value, onValueChange, collapsible }}>
            <div ref={ref} className={className} {...props}>
                {children}
            </div>
        </AccordionContext.Provider>
    )
})
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
    value: string
}
>(({ className, children, value, ...props }, ref) => (
    <div ref={ref} className={cn("border-b", className)} {...props}>
        {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, { value } as any)
            }
            return child
        })}
    </div>
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
    value?: string
}
>(({ className, children, value, ...props }, ref) => {
    const context = React.useContext(AccordionContext)
    const [isOpen, setIsOpen] = React.useState(false)

    const handleClick = () => {
        if (context && value) {
            if (context.type === 'single') {
                const newValue = isOpen && context.collapsible ? '' : value
                context.onValueChange?.(newValue)
                setIsOpen(!isOpen && !context.collapsible ? true : !isOpen)
            }
        } else {
            setIsOpen(!isOpen)
        }
    }

    React.useEffect(() => {
        if (context && value) {
            if (context.type === 'single' && typeof context.value === 'string') {
                setIsOpen(context.value === value)
            }
        }
    }, [context, value])

    return (
        <button
            ref={ref}
            className={cn(
                "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                className
            )}
            onClick={handleClick}
            {...props}
        >
            {children}
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
        </button>
    )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
    value?: string
}
>(({ className, children, value, ...props }, ref) => {
    const context = React.useContext(AccordionContext)
    const [isOpen, setIsOpen] = React.useState(false)

    React.useEffect(() => {
        if (context && value) {
            if (context.type === 'single' && typeof context.value === 'string') {
                setIsOpen(context.value === value)
            }
        }
    }, [context, value])

    if (!isOpen) return null

    return (
        <div
            ref={ref}
            className="overflow-hidden text-sm transition-all"
            {...props}
        >
            <div className={cn("pb-4 pt-0", className)}>{children}</div>
        </div>
    )
})
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }