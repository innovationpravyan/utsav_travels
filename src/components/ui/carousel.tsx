"use client"

import * as React from "react"
import useEmblaCarousel, {
    type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/utils/utils"
import { Button } from "@/components/ui/button"
import { usePerformancePreference } from "@/hooks/use-mobile"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
    opts?: CarouselOptions
    plugins?: CarouselPlugin
    orientation?: "horizontal" | "vertical"
    setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
    carouselRef: ReturnType<typeof useEmblaCarousel>[0]
    api: ReturnType<typeof useEmblaCarousel>[1]
    scrollPrev: () => void
    scrollNext: () => void
    canScrollPrev: boolean
    canScrollNext: boolean
    orientation: "horizontal" | "vertical"
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
    const context = React.useContext(CarouselContext)

    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />")
    }

    return context
}

const Carousel = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
    (
        {
            orientation = "horizontal",
            opts,
            setApi,
            plugins,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const { shouldReduceMotion } = usePerformancePreference()

        // Optimize options based on performance preferences
        const optimizedOpts = React.useMemo(() => ({
            ...opts,
            dragFree: shouldReduceMotion ? false : opts?.dragFree,
            duration: shouldReduceMotion ? 0 : (opts?.duration || 25),
            skipSnaps: shouldReduceMotion ? true : opts?.skipSnaps,
        }), [opts, shouldReduceMotion])

        const [carouselRef, api] = useEmblaCarousel()
        const [canScrollPrev, setCanScrollPrev] = React.useState(false)
        const [canScrollNext, setCanScrollNext] = React.useState(false)

        const onSelect = React.useCallback((api: CarouselApi) => {
            if (!api) {
                return
            }

            setCanScrollPrev(api.canScrollPrev())
            setCanScrollNext(api.canScrollNext())
        }, [])

        const scrollPrev = React.useCallback(() => {
            api?.scrollPrev()
        }, [api])

        const scrollNext = React.useCallback(() => {
            api?.scrollNext()
        }, [api])

        const handleKeyDown = React.useCallback(
            (event: React.KeyboardEvent<HTMLDivElement>) => {
                if (event.key === "ArrowLeft") {
                    event.preventDefault()
                    scrollPrev()
                } else if (event.key === "ArrowRight") {
                    event.preventDefault()
                    scrollNext()
                }
            },
            [scrollPrev, scrollNext]
        )

        React.useEffect(() => {
            if (!api || !setApi) {
                return
            }

            setApi(api)
        }, [api, setApi])

        React.useEffect(() => {
            if (!api) {
                return
            }

            onSelect(api)
            api.on("reInit", onSelect)
            api.on("select", onSelect)

            return () => {
                api?.off("select", onSelect)
            }
        }, [api, onSelect])

        return (
            <CarouselContext.Provider
                value={{
                    carouselRef,
                    api: api,
                    orientation:
                        orientation || (optimizedOpts?.axis === "y" ? "vertical" : "horizontal"),
                    scrollPrev,
                    scrollNext,
                    canScrollPrev,
                    canScrollNext,
                }}
            >
                <div
                    ref={ref}
                    onKeyDownCapture={handleKeyDown}
                    className={cn("relative", className)}
                    role="region"
                    aria-roledescription="carousel"
                    {...props}
                >
                    {children}
                </div>
            </CarouselContext.Provider>
        )
    }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel()

    return (
        <div ref={carouselRef} className="overflow-hidden">
            <div
                ref={ref}
                className={cn(
                    "flex",
                    orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
                    className
                )}
                {...props}
            />
        </div>
    )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const { orientation } = useCarousel()

    return (
        <div
            ref={ref}
            role="group"
            aria-roledescription="slide"
            className={cn(
                "min-w-0 shrink-0 grow-0 basis-full",
                orientation === "horizontal" ? "pl-4" : "pt-4",
                className
            )}
            {...props}
        />
    )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button> & {
    showOnMobile?: boolean
}
>(({ className, variant = "outline", size = "icon", showOnMobile = false, ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel()

    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(
                "absolute h-8 w-8 rounded-full",
                orientation === "horizontal"
                    ? "-left-12 top-1/2 -translate-y-1/2"
                    : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
                !showOnMobile && "hidden sm:flex",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-200 hover:scale-110",
                className
            )}
            disabled={!canScrollPrev}
            onClick={scrollPrev}
            aria-label="Previous slide"
            {...props}
        >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Previous slide</span>
        </Button>
    )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button> & {
    showOnMobile?: boolean
}
>(({ className, variant = "outline", size = "icon", showOnMobile = false, ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel()

    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(
                "absolute h-8 w-8 rounded-full",
                orientation === "horizontal"
                    ? "-right-12 top-1/2 -translate-y-1/2"
                    : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
                !showOnMobile && "hidden sm:flex",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-200 hover:scale-110",
                className
            )}
            disabled={!canScrollNext}
            onClick={scrollNext}
            aria-label="Next slide"
            {...props}
        >
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Next slide</span>
        </Button>
    )
})
CarouselNext.displayName = "CarouselNext"

// Carousel dots/indicators component
const CarouselIndicators = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
    count?: number
}
>(({ className, count, ...props }, ref) => {
    const { api } = useCarousel()
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])

    React.useEffect(() => {
        if (!api) return

        setScrollSnaps(api.scrollSnapList())
        setSelectedIndex(api.selectedScrollSnap())

        api.on("select", () => {
            setSelectedIndex(api.selectedScrollSnap())
        })
    }, [api])

    const slideCount = count || scrollSnaps.length

    if (slideCount <= 1) return null

    return (
        <div
            ref={ref}
            className={cn(
                "flex justify-center space-x-2 mt-4",
                className
            )}
            {...props}
        >
            {Array.from({ length: slideCount }).map((_, index) => (
                <button
                    key={index}
                    className={cn(
                        "w-2 h-2 rounded-full transition-all duration-200",
                        index === selectedIndex
                            ? "bg-primary scale-125"
                            : "bg-white/30 hover:bg-white/50"
                    )}
                    onClick={() => api?.scrollTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
    )
})
CarouselIndicators.displayName = "CarouselIndicators"

// Auto-play carousel hook
export function useCarouselAutoplay(delay: number = 3000) {
    const { api } = useCarousel()
    const [isPlaying, setIsPlaying] = React.useState(true)
    const timeoutRef = React.useRef<NodeJS.Timeout>()
    const { shouldReduceMotion } = usePerformancePreference()

    const play = React.useCallback(() => {
        if (!api || shouldReduceMotion) return

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            if (api.canScrollNext()) {
                api.scrollNext()
            } else {
                api.scrollTo(0)
            }
        }, delay)
    }, [api, delay, shouldReduceMotion])

    const stop = React.useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setIsPlaying(false)
    }, [])

    const start = React.useCallback(() => {
        setIsPlaying(true)
    }, [])

    React.useEffect(() => {
        if (!api || !isPlaying) return

        api.on("select", play)
        play()

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
            api.off("select", play)
        }
    }, [api, play, isPlaying])

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    return { isPlaying, play, stop, start }
}

// Responsive carousel component
export const ResponsiveCarousel = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & CarouselProps & {
    autoplay?: boolean
    autoplayDelay?: number
    showIndicators?: boolean
    itemsPerView?: {
        default: number
        sm?: number
        md?: number
        lg?: number
        xl?: number
    }
}
>(({
       autoplay = false,
       autoplayDelay = 3000,
       showIndicators = true,
       itemsPerView = { default: 1 },
       children,
       opts,
       ...props
   }, ref) => {
    const responsiveOpts = React.useMemo(() => ({
        ...opts,
        breakpoints: {
            '(min-width: 640px)': {
                slidesToScroll: itemsPerView.sm || itemsPerView.default
            },
            '(min-width: 768px)': {
                slidesToScroll: itemsPerView.md || itemsPerView.sm || itemsPerView.default
            },
            '(min-width: 1024px)': {
                slidesToScroll: itemsPerView.lg || itemsPerView.md || itemsPerView.default
            },
            '(min-width: 1280px)': {
                slidesToScroll: itemsPerView.xl || itemsPerView.lg || itemsPerView.default
            },
        }
    }), [opts, itemsPerView])

    return (
        <Carousel ref={ref} opts={responsiveOpts} {...props}>
            <CarouselContent>
                {children}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            {showIndicators && <CarouselIndicators />}
            {autoplay && <AutoplayController delay={autoplayDelay} />}
        </Carousel>
    )
})
ResponsiveCarousel.displayName = "ResponsiveCarousel"

// Autoplay controller component
const AutoplayController = ({ delay }: { delay: number }) => {
    useCarouselAutoplay(delay)
    return null
}

export {
    type CarouselApi,
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
    CarouselIndicators,
}