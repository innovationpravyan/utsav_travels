"use client";

import { motion, useInView, useAnimation, Variants } from "framer-motion";
import { useRef, useEffect, forwardRef } from "react";
import { useScrollReveal } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";

/**
 * Animation preset types
 */
export type AnimationPreset = 
  | 'fadeIn' 
  | 'slideUp' 
  | 'slideDown' 
  | 'slideLeft' 
  | 'slideRight'
  | 'scaleIn' 
  | 'scaleOut'
  | 'rotateIn' 
  | 'flipX' 
  | 'flipY'
  | 'bounce'
  | 'elastic'
  | 'zoom'
  | 'float'
  | 'shake'
  | 'pulse'
  | 'glow'
  | 'liquid'
  | 'morphing'
  | 'spiral'
  | 'wave'
  | 'typewriter'
  | 'magnetic'
  | 'parallax'
  | 'custom';

/**
 * Animation trigger types
 */
export type AnimationTrigger = 'viewport' | 'hover' | 'tap' | 'scroll' | 'immediate' | 'delay';

/**
 * Stagger configuration
 */
export interface StaggerConfig {
  enabled: boolean;
  delay?: number;
  from?: 'first' | 'last' | 'center' | number;
  direction?: 'normal' | 'reverse';
}

/**
 * Enhanced motion div props
 */
export interface MotionDivProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  preset?: AnimationPreset;
  trigger?: AnimationTrigger;
  duration?: number;
  delay?: number;
  ease?: string | number[];
  repeat?: number;
  repeatType?: 'loop' | 'reverse' | 'mirror';
  scale?: number;
  rotate?: number;
  x?: number;
  y?: number;
  opacity?: number;
  stagger?: StaggerConfig;
  viewport?: {
    once?: boolean;
    amount?: number;
    margin?: string;
  };
  hover?: boolean;
  tap?: boolean;
  whileInView?: Variants;
  exit?: Variants;
  layoutId?: string;
  dragEnabled?: boolean;
  magnetic?: boolean;
  parallax?: boolean;
  parallaxSpeed?: number;
  glowColor?: string;
  customVariants?: Variants;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Animation variants library
 */
const animationVariants: Record<AnimationPreset, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  slideUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },
  slideDown: {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },
  slideLeft: {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },
  slideRight: {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },
  scaleOut: {
    hidden: { opacity: 0, scale: 1.2 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },
  rotateIn: {
    hidden: { opacity: 0, rotate: -180, scale: 0.5 },
    visible: { 
      opacity: 1, 
      rotate: 0, 
      scale: 1,
      transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }
    }
  },
  flipX: {
    hidden: { opacity: 0, rotateX: -90 },
    visible: { 
      opacity: 1, 
      rotateX: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },
  flipY: {
    hidden: { opacity: 0, rotateY: -90 },
    visible: { 
      opacity: 1, 
      rotateY: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },
  bounce: {
    hidden: { opacity: 0, y: -100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.68, -0.55, 0.265, 1.55],
        type: "spring",
        damping: 10,
        stiffness: 100
      }
    }
  },
  elastic: {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.8,
        type: "spring",
        damping: 8,
        stiffness: 100
      }
    }
  },
  zoom: {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  },
  float: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  shake: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 }
    }
  },
  pulse: {
    hidden: { opacity: 0, scale: 1 },
    visible: { 
      opacity: 1, 
      scale: [1, 1.05, 1],
      transition: { 
        duration: 0.6,
        times: [0, 0.5, 1],
        repeat: 2,
        repeatType: "reverse"
      }
    }
  },
  glow: {
    hidden: { opacity: 0, filter: "drop-shadow(0 0 0 transparent)" },
    visible: { 
      opacity: 1,
      filter: [
        "drop-shadow(0 0 0 transparent)",
        "drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))",
        "drop-shadow(0 0 0 transparent)"
      ],
      transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" }
    }
  },
  liquid: {
    hidden: { opacity: 0, borderRadius: "50%" },
    visible: { 
      opacity: 1,
      borderRadius: ["50%", "20%", "40%", "10%"],
      transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
    }
  },
  morphing: {
    hidden: { opacity: 0, borderRadius: "0%" },
    visible: { 
      opacity: 1,
      borderRadius: ["0%", "25%", "50%", "25%", "0%"],
      scale: [1, 1.1, 0.9, 1.05, 1],
      transition: { duration: 3, repeat: Infinity }
    }
  },
  spiral: {
    hidden: { opacity: 0, rotate: -360, scale: 0 },
    visible: { 
      opacity: 1, 
      rotate: 0, 
      scale: 1,
      transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },
  wave: {
    hidden: { opacity: 0, y: 0 },
    visible: { 
      opacity: 1,
      y: [0, -10, 0, -5, 0],
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  },
  typewriter: {
    hidden: { width: 0, opacity: 0 },
    visible: { 
      width: "auto", 
      opacity: 1,
      transition: { 
        width: { duration: 1, ease: "linear" },
        opacity: { duration: 0.1 }
      }
    }
  },
  magnetic: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  parallax: {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },
  custom: {
    hidden: {},
    visible: {}
  }
};

/**
 * Hover animations
 */
const hoverVariants = {
  scale: { scale: 1.05 },
  lift: { y: -8, scale: 1.02 },
  tilt: { rotateX: 5, rotateY: 5 },
  glow: { 
    boxShadow: "0 0 25px rgba(255, 255, 255, 0.5)",
    scale: 1.02
  },
  float: { y: -10 },
  rotate: { rotate: 5 },
  bounce: { 
    y: -5,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  }
};

/**
 * Tap animations
 */
const tapVariants = {
  scale: { scale: 0.95 },
  push: { scale: 0.98, y: 2 },
  bounce: { scale: 1.1 },
  ripple: { scale: 1.1, opacity: 0.8 }
};

/**
 * Enhanced MotionDiv Component
 */
export const MotionDiv = forwardRef<HTMLDivElement, MotionDivProps>(({
  children,
  preset = 'fadeIn',
  trigger = 'viewport',
  duration = 0.6,
  delay = 0,
  ease = "easeOut",
  repeat = 0,
  repeatType = 'loop',
  scale,
  rotate,
  x,
  y,
  opacity,
  stagger,
  viewport = { once: true, amount: 0.2 },
  hover = false,
  tap = false,
  whileInView,
  exit,
  layoutId,
  dragEnabled = false,
  magnetic = false,
  parallax = false,
  parallaxSpeed = 0.5,
  glowColor,
  customVariants,
  onAnimationStart,
  onAnimationComplete,
  className,
  as: Component = 'div',
  ...props
}, ref) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const isInView = useInView(elementRef, viewport);
  
  // Scroll reveal hook for additional scroll-based animations
  const scrollReveal = useScrollReveal({
    threshold: viewport.amount || 0.2,
    triggerOnce: viewport.once,
  });

  // Use custom variants or preset variants
  const variants = customVariants || animationVariants[preset] || animationVariants.fadeIn;

  // Custom animation overrides
  const customAnimation = {
    ...(scale !== undefined && { scale }),
    ...(rotate !== undefined && { rotate }),
    ...(x !== undefined && { x }),
    ...(y !== undefined && { y }),
    ...(opacity !== undefined && { opacity }),
  };

  // Apply custom properties to variants
  if (Object.keys(customAnimation).length > 0) {
    variants.visible = {
      ...variants.visible,
      ...customAnimation,
      transition: {
        ...variants.visible.transition,
        duration,
        delay,
        ease,
        repeat,
        repeatType,
      }
    };
  }

  // Stagger configuration
  const staggerConfig = stagger?.enabled ? {
    staggerChildren: stagger.delay || 0.1,
    delayChildren: delay,
    staggerDirection: stagger.direction === 'reverse' ? -1 : 1,
  } : {};

  // Animation trigger logic
  useEffect(() => {
    if (trigger === 'immediate') {
      controls.start('visible');
    } else if (trigger === 'viewport' && isInView) {
      controls.start('visible');
    } else if (trigger === 'delay') {
      setTimeout(() => controls.start('visible'), delay * 1000);
    } else if (trigger === 'scroll' && scrollReveal.isVisible) {
      controls.start('visible');
    }
  }, [controls, trigger, isInView, scrollReveal.isVisible, delay]);

  // Magnetic effect
  useEffect(() => {
    if (!magnetic || !elementRef.current) return;

    const element = elementRef.current;
    let animationFrame: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * 0.1;
      const deltaY = (e.clientY - centerY) * 0.1;
      
      animationFrame = requestAnimationFrame(() => {
        element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });
    };

    const handleMouseLeave = () => {
      animationFrame = requestAnimationFrame(() => {
        element.style.transform = 'translate(0px, 0px)';
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [magnetic]);

  // Motion component props
  const motionProps = {
    ref: elementRef,
    variants,
    initial: trigger === 'immediate' ? 'visible' : 'hidden',
    animate: trigger === 'immediate' || trigger === 'delay' ? controls : undefined,
    whileInView: trigger === 'viewport' ? (whileInView || 'visible') : undefined,
    exit,
    viewport: trigger === 'viewport' ? viewport : undefined,
    transition: {
      duration,
      delay: trigger !== 'delay' ? delay : 0,
      ease,
      repeat,
      repeatType,
      ...staggerConfig,
    },
    layoutId,
    drag: dragEnabled,
    dragConstraints: dragEnabled ? { left: 0, right: 0, top: 0, bottom: 0 } : undefined,
    whileHover: hover ? hoverVariants.scale : undefined,
    whileTap: tap ? tapVariants.scale : undefined,
    onAnimationStart,
    onAnimationComplete,
    style: {
      ...(glowColor && {
        filter: `drop-shadow(0 0 10px ${glowColor})`,
      }),
    },
  };

  return (
    <motion.div
      className={cn(
        // Base classes
        'motion-div',
        
        // Conditional classes
        hover && 'cursor-pointer',
        magnetic && 'magnetic-element',
        parallax && 'parallax-element',
        
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
});

MotionDiv.displayName = 'MotionDiv';

/**
 * Preset motion components for common use cases
 */

/**
 * Fade in motion div
 */
export const FadeInDiv = forwardRef<HTMLDivElement, Omit<MotionDivProps, 'preset'>>(
  (props, ref) => <MotionDiv ref={ref} preset="fadeIn" {...props} />
);

FadeInDiv.displayName = 'FadeInDiv';

/**
 * Slide up motion div
 */
export const SlideUpDiv = forwardRef<HTMLDivElement, Omit<MotionDivProps, 'preset'>>(
  (props, ref) => <MotionDiv ref={ref} preset="slideUp" {...props} />
);

SlideUpDiv.displayName = 'SlideUpDiv';

/**
 * Scale in motion div
 */
export const ScaleInDiv = forwardRef<HTMLDivElement, Omit<MotionDivProps, 'preset'>>(
  (props, ref) => <MotionDiv ref={ref} preset="scaleIn" {...props} />
);

ScaleInDiv.displayName = 'ScaleInDiv';

/**
 * Bounce motion div
 */
export const BounceDiv = forwardRef<HTMLDivElement, Omit<MotionDivProps, 'preset'>>(
  (props, ref) => <MotionDiv ref={ref} preset="bounce" {...props} />
);

BounceDiv.displayName = 'BounceDiv';

/**
 * Floating motion div
 */
export const FloatingDiv = forwardRef<HTMLDivElement, Omit<MotionDivProps, 'preset'>>(
  (props, ref) => <MotionDiv ref={ref} preset="float" hover magnetic {...props} />
);

FloatingDiv.displayName = 'FloatingDiv';

/**
 * Interactive motion div with all effects
 */
export const InteractiveDiv = forwardRef<HTMLDivElement, Omit<MotionDivProps, 'preset'>>(
  (props, ref) => (
    <MotionDiv 
      ref={ref} 
      preset="scaleIn" 
      hover 
      tap 
      magnetic 
      glowColor="rgba(255,255,255,0.3)"
      {...props} 
    />
  )
);

InteractiveDiv.displayName = 'InteractiveDiv';

/**
 * Staggered children container
 */
export const StaggerContainer = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, stagger = { enabled: true, delay: 0.1 }, ...props }, ref) => (
    <MotionDiv 
      ref={ref} 
      stagger={stagger}
      preset="fadeIn"
      {...props}
    >
      {children}
    </MotionDiv>
  )
);

StaggerContainer.displayName = 'StaggerContainer';

/**
 * Parallax motion div
 */
export const ParallaxDiv = forwardRef<HTMLDivElement, Omit<MotionDivProps, 'preset'>>(
  ({ parallaxSpeed = 0.5, ...props }, ref) => (
    <MotionDiv 
      ref={ref} 
      preset="parallax" 
      parallax 
      parallaxSpeed={parallaxSpeed}
      {...props} 
    />
  )
);

ParallaxDiv.displayName = 'ParallaxDiv';