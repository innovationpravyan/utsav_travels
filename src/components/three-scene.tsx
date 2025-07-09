'use client';

import { useRef, useEffect, useState, ReactNode, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useSafeWindow } from './three-utils';

interface ThreeSceneProps {
    children?: ReactNode;
    className?: string;
    enableControls?: boolean;
    enableStats?: boolean;
    antialias?: boolean;
    alpha?: boolean;
    powerPreference?: 'default' | 'high-performance' | 'low-power';
    onSceneReady?: (scene: any, camera: any, renderer: any) => void;
    animationCallback?: (delta: number, elapsedTime: number) => void;
}

export function ThreeScene({
                               children,
                               className,
                               enableControls = false,
                               enableStats = false,
                               antialias = false, // Disabled by default for performance
                               alpha = true,
                               powerPreference = 'high-performance',
                               onSceneReady,
                               animationCallback
                           }: ThreeSceneProps) {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<any>(null);
    const rendererRef = useRef<any>(null);
    const cameraRef = useRef<any>(null);
    const animationIdRef = useRef<number | null>(null);
    const clockRef = useRef<any>(null);
    const windowObj = useSafeWindow();

    const [isReady, setIsReady] = useState(false);
    const [threeLoaded, setThreeLoaded] = useState(false);

    // Optimized resize handler with debounce
    const handleResize = useCallback(() => {
        if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;

        const newWidth = mountRef.current.clientWidth;
        const newHeight = mountRef.current.clientHeight;

        cameraRef.current.aspect = newWidth / newHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(newWidth, newHeight);
    }, []);

    useEffect(() => {
        if (!mountRef.current || !windowObj) return;

        const mount = mountRef.current;
        let cleanup: (() => void) | undefined;

        const initThree = async () => {
            try {
                // Dynamic import for better performance
                const THREE = await import('three');
                setThreeLoaded(true);

                const width = mount.clientWidth;
                const height = mount.clientHeight;

                // Scene setup
                const scene = new THREE.Scene();

                // Camera setup
                const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
                camera.position.z = 5;

                // Optimized renderer setup
                const renderer = new THREE.WebGLRenderer({
                    antialias: antialias && windowObj.devicePixelRatio < 2,
                    alpha,
                    powerPreference,
                    stencil: false,
                    depth: true,
                    logarithmicDepthBuffer: false // Disable for better performance
                });

                renderer.setSize(width, height);
                renderer.setPixelRatio(Math.min(windowObj.devicePixelRatio, 2));
                renderer.outputColorSpace = THREE.SRGBColorSpace;

                // Performance optimizations
                renderer.shadowMap.enabled = false;
                renderer.info.autoReset = false; // Manual reset for performance monitoring

                mount.appendChild(renderer.domElement);

                // Initialize clock
                const clock = new THREE.Clock();

                // Store refs
                sceneRef.current = scene;
                rendererRef.current = renderer;
                cameraRef.current = camera;
                clockRef.current = clock;

                // Debounced resize listener
                let resizeTimeout: NodeJS.Timeout;
                const debouncedResize = () => {
                    clearTimeout(resizeTimeout);
                    resizeTimeout = setTimeout(handleResize, 100);
                };

                windowObj.addEventListener('resize', debouncedResize);

                // Optimized animation loop
                const animate = () => {
                    if (!renderer || !scene || !camera || !clock) return;

                    const delta = clock.getDelta();
                    const elapsedTime = clock.getElapsedTime();

                    // Custom animation callback
                    if (animationCallback) {
                        animationCallback(delta, elapsedTime);
                    }

                    // Render
                    renderer.render(scene, camera);

                    // Reset info for next frame
                    renderer.info.reset();

                    animationIdRef.current = requestAnimationFrame(animate);
                };

                // Initialize
                setIsReady(true);
                if (onSceneReady) {
                    onSceneReady(scene, camera, renderer);
                }

                animate();

                // Cleanup function
                cleanup = () => {
                    windowObj.removeEventListener('resize', debouncedResize);

                    if (animationIdRef.current) {
                        cancelAnimationFrame(animationIdRef.current);
                    }

                    if (mount && renderer.domElement) {
                        mount.removeChild(renderer.domElement);
                    }

                    // Dispose Three.js resources
                    scene.traverse((object: any) => {
                        if (object.isMesh) {
                            if (object.geometry) object.geometry.dispose();
                            if (object.material) {
                                if (Array.isArray(object.material)) {
                                    object.material.forEach((material: any) => material.dispose());
                                } else {
                                    object.material.dispose();
                                }
                            }
                        }
                    });

                    renderer.dispose();
                    clearTimeout(resizeTimeout);
                };

            } catch (error) {
                console.warn('Three.js failed to initialize:', error);
                setIsReady(false);
            }
        };

        initThree();

        return cleanup;
    }, [windowObj, antialias, alpha, powerPreference, onSceneReady, animationCallback, handleResize]);

    // Return early if no window object
    if (!windowObj) {
        return (
            <div className={cn('w-full h-full flex items-center justify-center', className)}>
                <div className="text-white/50">Loading 3D scene...</div>
            </div>
        );
    }

    return (
        <div
            ref={mountRef}
            className={cn('w-full h-full relative', className)}
        >
            {!threeLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="text-white/70 text-sm">Loading Three.js...</div>
                </div>
            )}

            {isReady && children && (
                <div className="absolute inset-0 pointer-events-none z-10">
                    {children}
                </div>
            )}

            {enableStats && isReady && (
                <div className="absolute top-4 left-4 bg-black/80 text-white text-xs p-2 rounded z-20">
                    <div>FPS: {Math.round(1 / (clockRef.current?.getDelta() || 0.016))}</div>
                </div>
            )}
        </div>
    );
}

// Hook for accessing Three.js context safely
export function useThreeScene() {
    const sceneRef = useRef<any>(null);
    const cameraRef = useRef<any>(null);
    const rendererRef = useRef<any>(null);

    return {
        scene: sceneRef.current,
        camera: cameraRef.current,
        renderer: rendererRef.current
    };
}

// Optimized Three.js loader component
export function ThreeLoader({ onLoad }: { onLoad?: (THREE: any) => void }) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadThree = async () => {
            try {
                const THREE = await import('three');
                onLoad?.(THREE);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to load Three.js');
                setIsLoading(false);
            }
        };

        loadThree();
    }, [onLoad]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="text-white/70">Loading 3D engine...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="text-red-400">{error}</div>
            </div>
        );
    }

    return null;
}