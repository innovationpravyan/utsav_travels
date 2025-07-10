'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParallax } from '@/hooks/use-parallax';
import { cn } from '@/utils/utils';

/**
 * Floating element types
 */
type ElementType = 'circle' | 'square' | 'triangle' | 'hexagon' | 'star' | 'wave' | 'blob' | 'custom';

/**
 * Animation types for floating elements
 */
type AnimationType = 'float' | 'rotate' | 'pulse' | 'drift' | 'orbital' | 'wave' | 'spiral' | 'random';

/**
 * Single floating element configuration
 */
export interface FloatingElement {
  id: string;
  type: ElementType;
  size: number; // Size in pixels
  x: number; // X position (0-100%)
  y: number; // Y position (0-100%)
  color?: string;
  opacity?: number;
  speed?: number; // Animation speed multiplier
  animation?: AnimationType;
  delay?: number; // Animation delay in seconds
  customPath?: string; // Custom SVG path for custom type
  parallaxSpeed?: number; // Parallax movement speed
  blur?: number; // Blur amount
  glow?: boolean; // Glow effect
}

/**
 * Floating elements container props
 */
export interface FloatingElementsProps {
  elements?: FloatingElement[];
  count?: number; // Auto-generate count if elements not provided
  density?: 'low' | 'medium' | 'high'; // Auto-generation density
  theme?: 'light' | 'dark' | 'colorful'; // Color theme for auto-generation
  interactive?: boolean; // Mouse interaction
  parallax?: boolean; // Parallax scrolling
  className?: string;
  children?: React.ReactNode;
}

/**
 * Predefined element configurations
 */
const presetElements: Record<string, Partial<FloatingElement>[]> = {
  minimal: [
    { type: 'circle', size: 20, color: 'rgba(255,255,255,0.1)', animation: 'float' },
    { type: 'circle', size: 15, color: 'rgba(255,255,255,0.05)', animation: 'drift' },
    { type: 'circle', size: 30, color: 'rgba(255,255,255,0.08)', animation: 'pulse' },
  ],
  colorful: [
    { type: 'circle', size: 25, color: 'rgba(255,107,107,0.3)', animation: 'float' },
    { type: 'hexagon', size: 35, color: 'rgba(78,205,196,0.25)', animation: 'rotate' },
    { type: 'triangle', size: 20, color: 'rgba(255,195,113,0.3)', animation: 'drift' },
    { type: 'star', size: 30, color: 'rgba(199,125,255,0.25)', animation: 'pulse' },
  ],
  geometric: [
    { type: 'square', size: 20, color: 'rgba(255,255,255,0.1)', animation: 'rotate' },
    { type: 'triangle', size: 25, color: 'rgba(255,255,255,0.08)', animation: 'drift' },
    { type: 'hexagon', size: 30, color: 'rgba(255,255,255,0.06)', animation: 'float' },
  ],
};

/**
 * Generate random floating elements
 */
function generateRandomElements(
  count: number, 
  theme: 'light' | 'dark' | 'colorful',
  density: 'low' | 'medium' | 'high'
): FloatingElement[] {
  const elements: FloatingElement[] = [];
  const colors = {
    light: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.08)'],
    dark: ['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.08)'],
    colorful: [
      'rgba(255,107,107,0.3)', 'rgba(78,205,196,0.25)', 'rgba(255,195,113,0.3)',
      'rgba(199,125,255,0.25)', 'rgba(255,159,243,0.3)', 'rgba(132,204,22,0.25)'
    ],
  };

  const types: ElementType[] = ['circle', 'square', 'triangle', 'hexagon', 'star'];
  const animations: AnimationType[] = ['float', 'rotate', 'pulse', 'drift', 'orbital'];
  
  const sizeRange = {
    low: [15, 35],
    medium: [20, 50],
    high: [25, 60],
  };

  for (let i = 0; i < count; i++) {
    const [minSize, maxSize] = sizeRange[density];
    elements.push({
      id: `auto-${i}`,
      type: types[Math.floor(Math.random() * types.length)],
      size: Math.random() * (maxSize - minSize) + minSize,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[theme][Math.floor(Math.random() * colors[theme].length)],
      opacity: Math.random() * 0.5 + 0.3,
      speed: Math.random() * 2 + 0.5,
      animation: animations[Math.floor(Math.random() * animations.length)],
      delay: Math.random() * 5,
      parallaxSpeed: (Math.random() - 0.5) * 0.5,
      blur: Math.random() > 0.7 ? Math.random() * 5 + 2 : 0,
      glow: Math.random() > 0.8,
    });
  }

  return elements;
}

/**
 * Individual floating element component
 */
const FloatingElement: React.FC<{ element: FloatingElement; interactive: boolean }> = ({ 
  element, 
  interactive 
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const parallax = useParallax({ 
    speed: element.parallaxSpeed || 0,
    enabled: element.parallaxSpeed !== 0,
  });

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  // Calculate mouse interaction offset
  const mouseOffset = useMemo(() => {
    if (!interactive) return { x: 0, y: 0 };
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const deltaX = (mousePos.x - centerX) * 0.02;
    const deltaY = (mousePos.y - centerY) * 0.02;
    
    return { x: deltaX, y: deltaY };
  }, [mousePos, interactive]);

  // SVG shapes
  const renderShape = () => {
    const { type, size, customPath } = element;
    const halfSize = size / 2;

    switch (type) {
      case 'circle':
        return <circle cx={halfSize} cy={halfSize} r={halfSize} fill="currentColor" />;
      
      case 'square':
        return <rect width={size} height={size} fill="currentColor" />;
      
      case 'triangle':
        return (
          <polygon 
            points={`${halfSize},0 ${size},${size} 0,${size}`} 
            fill="currentColor" 
          />
        );
      
      case 'hexagon':
        const points = Array.from({ length: 6 }, (_, i) => {
          const angle = (i * Math.PI) / 3;
          const x = halfSize + (halfSize * 0.8) * Math.cos(angle);
          const y = halfSize + (halfSize * 0.8) * Math.sin(angle);
          return `${x},${y}`;
        }).join(' ');
        return <polygon points={points} fill="currentColor" />;
      
      case 'star':
        const starPoints = Array.from({ length: 10 }, (_, i) => {
          const angle = (i * Math.PI) / 5;
          const radius = i % 2 === 0 ? halfSize * 0.8 : halfSize * 0.4;
          const x = halfSize + radius * Math.cos(angle - Math.PI / 2);
          const y = halfSize + radius * Math.sin(angle - Math.PI / 2);
          return `${x},${y}`;
        }).join(' ');
        return <polygon points={starPoints} fill="currentColor" />;
      
      case 'wave':
        const wavePath = `M0,${halfSize} Q${halfSize/2},0 ${halfSize},${halfSize} T${size},${halfSize}`;
        return <path d={wavePath} stroke="currentColor" strokeWidth="2" fill="none" />;
      
      case 'blob':
        const blobPath = `M${halfSize*0.8},${halfSize*0.3} Q${halfSize*1.3},${halfSize*0.1} ${halfSize*1.2},${halfSize*0.7} Q${halfSize*1.1},${halfSize*1.3} ${halfSize*0.6},${halfSize*1.1} Q${halfSize*0.2},${halfSize*0.9} ${halfSize*0.8},${halfSize*0.3}`;
        return <path d={blobPath} fill="currentColor" />;
      
      case 'custom':
        return customPath ? <path d={customPath} fill="currentColor" /> : null;
      
      default:
        return <circle cx={halfSize} cy={halfSize} r={halfSize} fill="currentColor" />;
    }
  };

  const animationClasses = {
    float: 'animate-bounce',
    rotate: 'animate-spin',
    pulse: 'animate-pulse',
    drift: 'float',
    orbital: 'float-3d',
    wave: 'float-delay-1',
    spiral: 'float-delay-2',
    random: 'float-delay-3',
  };

  return (
    <div
      ref={parallax.ref}
      className={cn(
        'absolute pointer-events-none',
        animationClasses[element.animation || 'float'],
        element.glow && 'drop-shadow-glow'
      )}
      style={{
        left: `${element.x}%`,
        top: `${element.y}%`,
        transform: `translate(-50%, -50%) translate(${mouseOffset.x}px, ${mouseOffset.y}px)`,
        animationDelay: `${element.delay || 0}s`,
        animationDuration: `${(element.speed || 1) * 3}s`,
        filter: element.blur ? `blur(${element.blur}px)` : undefined,
        ...parallax.style,
      }}
    >
      <svg
        width={element.size}
        height={element.size}
        style={{
          color: element.color || 'rgba(255,255,255,0.1)',
          opacity: element.opacity || 0.5,
        }}
        className="drop-shadow-sm"
      >
        {renderShape()}
      </svg>
    </div>
  );
};

/**
 * Main floating elements container component
 */
export const FloatingElements: React.FC<FloatingElementsProps> = ({
  elements,
  count = 20,
  density = 'medium',
  theme = 'light',
  interactive = false,
  parallax = true,
  className,
  children,
}) => {
  const [generatedElements, setGeneratedElements] = useState<FloatingElement[]>([]);

  // Generate elements if not provided
  useEffect(() => {
    if (!elements) {
      const newElements = generateRandomElements(count, theme, density);
      setGeneratedElements(newElements);
    }
  }, [elements, count, theme, density]);

  const activeElements = elements || generatedElements;

  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      {/* Floating elements layer */}
      <div className="absolute inset-0 pointer-events-none">
        {activeElements.map((element) => (
          <FloatingElement
            key={element.id}
            element={element}
            interactive={interactive}
          />
        ))}
      </div>
      
      {/* Content layer */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Preset floating elements configurations
 */
export const MinimalFloatingElements: React.FC<Omit<FloatingElementsProps, 'elements'>> = (props) => (
  <FloatingElements elements={presetElements.minimal.map((el, i) => ({ 
    id: `minimal-${i}`, 
    x: Math.random() * 100, 
    y: Math.random() * 100, 
    ...el 
  } as FloatingElement))} {...props} />
);

export const ColorfulFloatingElements: React.FC<Omit<FloatingElementsProps, 'elements'>> = (props) => (
  <FloatingElements elements={presetElements.colorful.map((el, i) => ({ 
    id: `colorful-${i}`, 
    x: Math.random() * 100, 
    y: Math.random() * 100, 
    ...el 
  } as FloatingElement))} {...props} />
);

export const GeometricFloatingElements: React.FC<Omit<FloatingElementsProps, 'elements'>> = (props) => (
  <FloatingElements elements={presetElements.geometric.map((el, i) => ({ 
    id: `geometric-${i}`, 
    x: Math.random() * 100, 
    y: Math.random() * 100, 
    ...el 
  } as FloatingElement))} {...props} />
);

/**
 * Particles system for more dynamic effects
 */
export interface ParticleSystemProps {
  count?: number;
  color?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  interactive?: boolean;
  className?: string;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  count = 50,
  color = 'rgba(255,255,255,0.1)',
  minSize = 2,
  maxSize = 6,
  speed = 1,
  interactive = false,
  className,
}) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: `particle-${i}`,
      type: 'circle' as ElementType,
      size: Math.random() * (maxSize - minSize) + minSize,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color,
      opacity: Math.random() * 0.5 + 0.2,
      speed: Math.random() * speed + 0.5,
      animation: 'drift' as AnimationType,
      delay: Math.random() * 10,
      parallaxSpeed: (Math.random() - 0.5) * 0.3,
    }));
  }, [count, color, minSize, maxSize, speed]);

  return (
    <FloatingElements
      elements={particles}
      interactive={interactive}
      className={className}
    />
  );
};