'use client';

import React, {forwardRef, ReactNode, useEffect, useRef, useState} from 'react';
import {cn} from '@/lib/utils';
import {useThreeInView} from '@/lib/three-utils';

export type OptimizedAnimationPreset =
    | 'fadeIn'
    | 'slideUp'
    | 'slideLeft'
    | 'slideRight'
    | 'scaleIn'
    | 'none';

export interface OptimizedMotionProps {
    children: ReactNode;
    preset?: OptimizedAnimationPreset;
    delay?: number;
    duration?: number;
    className?: string;
    hover?: boolean;
    stagger?: { delay: number; index?: number };
    onInView?: () => void;
    triggerOnce?: boolean;
    threshold?: number;
    as?: keyof JSX.IntrinsicElements;
    style?: React.CSSProperties;
}

export const OptimizedMotionDiv = forwardRef<HTMLElement, OptimizedMotionProps>(({
                                                                                     children,
                                                                                     preset = 'fadeIn',
                                                                                     delay = 0,
                                                                                     duration = 0.3, // Faster duration
                                                                                     className,
                                                                                     hover = false,
                                                                                     stagger,
                                                                                     onInView,
                                                                                     triggerOnce = true,
                                                                                     threshold = 0.05, // Lower threshold for instant loading
                                                                                     as: Component = 'div',
                                                                                     style,
                                                                                     ...props
                                                                                 }, ref) => {
    const [isTriggered, setIsTriggered] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);
    const {ref: inViewRef, isInView} = useThreeInView(threshold);

    // Remove stagger delay for instant loading
    const totalDelay = 0; // Always 0 for instant loading

    useEffect(() => {
        if (isInView && (!triggerOnce || !hasTriggered)) {
            // Instant trigger - no setTimeout
            setIsTriggered(true);
            setHasTriggered(true);
            onInView?.();
        } else if (!isInView && !triggerOnce) {
            setIsTriggered(false);
        }
    }, [isInView, triggerOnce, hasTriggered, onInView]);

    const getAnimationClasses = () => {
        const baseClasses = [
            'transition-all',
            'ease-out',
            'duration-300' // Fast transition
        ];

        if (hover) {
            baseClasses.push('hover:scale-105', 'cursor-pointer');
        }

        // Instant animation - no initial hidden state
        if (!isTriggered && preset !== 'none') {
            switch (preset) {
                case 'fadeIn':
                    baseClasses.push('opacity-50'); // Subtle instead of hidden
                    break;
                case 'slideUp':
                    baseClasses.push('opacity-80', 'translate-y-2'); // Minimal transform
                    break;
                case 'slideLeft':
                    baseClasses.push('opacity-80', 'translate-x-2');
                    break;
                case 'slideRight':
                    baseClasses.push('opacity-80', '-translate-x-2');
                    break;
                case 'scaleIn':
                    baseClasses.push('opacity-80', 'scale-98'); // Minimal scale
                    break;
            }
        } else {
            baseClasses.push('opacity-100', 'translate-x-0', 'translate-y-0', 'scale-100');
        }

        return baseClasses;
    };

    return (
        <Component
            ref={(node: HTMLElement) => {
                if (typeof ref === 'function') {
                    ref(node);
                } else if (ref) {
                    (ref as any).current = node;
                }
                if (node && inViewRef) {
                    inViewRef.current = node;
                }
            }}
            className={cn(getAnimationClasses(), className)}
            style={{
                transitionDelay: `${totalDelay}s`,
                ...style
            }}
            {...props}
        >
            {children}
        </Component>
    );
});

OptimizedMotionDiv.displayName = 'OptimizedMotionDiv';

// Instant stagger container
export const StaggerContainer = forwardRef<HTMLDivElement, {
    children: ReactNode;
    staggerDelay?: number;
    className?: string;
    as?: keyof JSX.IntrinsicElements;
}>(({children, staggerDelay = 0, className, as: Component = 'div'}, ref) => {
    return (
        <Component ref={ref} className={className}>
            {children}
        </Component>
    );
});

StaggerContainer.displayName = 'StaggerContainer';

// Three.js integration wrapper
export const ThreeMotionDiv = forwardRef<HTMLDivElement, {
    children: ReactNode;
    threeAnimation?: 'particles' | 'float' | 'rotate' | 'pulse';
    className?: string;
    particleCount?: number;
    animationSpeed?: number;
}>(({
        children,
        threeAnimation,
        className,
        particleCount = 20,
        animationSpeed = 1
    }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!threeAnimation || !containerRef.current || !isClient) return;

        let animationId: number;
        let cleanup: (() => void) | undefined;

        const initThree = async () => {
            try {
                const THREE = await import('three');
                if (!containerRef.current) return;

                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
                const renderer = new THREE.WebGLRenderer({
                    alpha: true,
                    antialias: false,
                    powerPreference: 'high-performance'
                });

                const container = containerRef.current;
                const rect = container.getBoundingClientRect();

                renderer.setSize(rect.width, rect.height);
                renderer.domElement.style.position = 'absolute';
                renderer.domElement.style.top = '0';
                renderer.domElement.style.left = '0';
                renderer.domElement.style.pointerEvents = 'none';
                renderer.domElement.style.zIndex = '1';

                container.style.position = 'relative';
                container.appendChild(renderer.domElement);

                if (threeAnimation === 'particles') {
                    const geometry = new THREE.BufferGeometry();
                    const positions = new Float32Array(particleCount * 3);

                    for (let i = 0; i < particleCount * 3; i++) {
                        positions[i] = (Math.random() - 0.5) * 10;
                    }

                    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

                    const material = new THREE.PointsMaterial({
                        color: 0xffffff,
                        size: 0.1,
                        transparent: true,
                        opacity: 0.6
                    });

                    const particles = new THREE.Points(geometry, material);
                    scene.add(particles);
                    camera.position.z = 5;

                    const animate = () => {
                        particles.rotation.y += 0.01 * animationSpeed;
                        renderer.render(scene, camera);
                        animationId = requestAnimationFrame(animate);
                    };
                    animate();

                    cleanup = () => {
                        if (animationId) cancelAnimationFrame(animationId);
                        geometry.dispose();
                        material.dispose();
                        renderer.dispose();
                        if (container.contains(renderer.domElement)) {
                            container.removeChild(renderer.domElement);
                        }
                    };
                }
            } catch (error) {
                console.warn('Three.js animation failed:', error);
            }
        };

        initThree();

        return cleanup;
    }, [threeAnimation, particleCount, animationSpeed, isClient]);

    return (
        <div
            ref={(node) => {
                containerRef.current = node;
                if (typeof ref === 'function') {
                    ref(node);
                } else if (ref) {
                    (ref as any).current = node;
                }
            }}
            className={cn('relative', className)}
        >
            <div style={{position: 'relative', zIndex: 2}}>
                {children}
            </div>
        </div>
    );
});

ThreeMotionDiv.displayName = 'ThreeMotionDiv';

// Backward compatibility exports
export const FadeInDiv = forwardRef<HTMLDivElement, Omit<OptimizedMotionProps, 'preset'>>((props, ref) =>
    <OptimizedMotionDiv ref={ref} preset="fadeIn" {...props} />
);
export const SlideUpDiv = forwardRef<HTMLDivElement, Omit<OptimizedMotionProps, 'preset'>>((props, ref) =>
    <OptimizedMotionDiv ref={ref} preset="slideUp" {...props} />
);
export const ScaleInDiv = forwardRef<HTMLDivElement, Omit<OptimizedMotionProps, 'preset'>>((props, ref) =>
    <OptimizedMotionDiv ref={ref} preset="scaleIn" {...props} />
);

FadeInDiv.displayName = 'FadeInDiv';
SlideUpDiv.displayName = 'SlideUpDiv';
ScaleInDiv.displayName = 'ScaleInDiv';