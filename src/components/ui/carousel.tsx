'use client';

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const CarouselContext = React.createContext<{
    currentIndex: number
    setCurrentIndex: (index: number) => void
    itemCount: number
    setItemCount: (count: number) => void
} | null>(null)

const Carousel = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
    opts?: {
        align?: 'start' | 'center' | 'end'
        loop?: boolean
    }
}
>(({ className, children, opts, ...props }, ref) => {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [itemCount, setItemCount] = React.useState(0)

    return (
        <CarouselContext.Provider value={{ currentIndex, setCurrentIndex, itemCount, setItemCount }}>
            <div
                ref={ref}
                className={cn("relative", className)}
                {...props}
            >
                {children}
            </div>
        </CarouselContext.Provider>
    )
})
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const context = React.useContext(CarouselContext)
    const childrenArray = React.Children.toArray(children)

    React.useEffect(() => {
        if (context) {
            context.setItemCount(childrenArray.length)
        }
    }, [childrenArray.length, context])

    return (
        <div className="overflow-hidden" ref={ref} {...props}>
            <div
                className={cn("flex transition-transform duration-300 ease-in-out", className)}
                style={{
                    transform: `translateX(-${(context?.currentIndex || 0) * 100}%)`
                }}
            >
                {children}
            </div>
        </div>
    )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
        {...props}
    />
))
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const context = React.useContext(CarouselContext)

    const handlePrevious = () => {
        if (context) {
            const newIndex = context.currentIndex > 0
                ? context.currentIndex - 1
                : context.itemCount - 1
            context.setCurrentIndex(newIndex)
        }
    }

    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(
                "absolute h-8 w-8 rounded-full",
                className
            )}
            onClick={handlePrevious}
            {...props}
        >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous slide</span>
        </Button>
    )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const context = React.useContext(CarouselContext)

    const handleNext = () => {
        if (context) {
            const newIndex = context.currentIndex < context.itemCount - 1
                ? context.currentIndex + 1
                : 0
            context.setCurrentIndex(newIndex)
        }
    }

    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(
                "absolute h-8 w-8 rounded-full",
                className
            )}
            onClick={handleNext}
            {...props}
        >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next slide</span>
        </Button>
    )
})
CarouselNext.displayName = "CarouselNext"

export {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
}