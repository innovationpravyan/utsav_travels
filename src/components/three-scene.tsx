'use client';

import { useEffect, useState, memo } from 'react';
import { cn } from '@/lib/utils';

// Types for Three.js objects (avoiding direct imports for SSR safety)
interface ThreeObjects {
    scene: any;
    camera: any;
    renderer: any;
    controls?: any;
    stats?: any;
}
interface ThreePerformanceMetrics {
    fps: number;
    memory: number;
    drawCalls: number;
    triangles: number;
}

// Performance monitoring component
const PerformanceMonitor = memo(({
                                     objects,
                                     show
                                 }: {
    objects: ThreeObjects | null;
    show: boolean;
}) => {
    const [metrics, setMetrics] = useState<ThreePerformanceMetrics>({
        fps: 60,
        memory: 0,
        drawCalls: 0,
        triangles: 0
    });

    useEffect(() => {
        if (!show || !objects?.renderer) return;

        let frameCount = 0;
        let lastTime = performance.now();
        let animationId: number;

        const updateMetrics = () => {
            frameCount++;
            const now = performance.now();

            if (now - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (now - lastTime));
                const info = objects.renderer.info;

                const memory = (performance as any).memory
                    ? Math.round((performance as any).memory.usedJSHeapSize / 1048576)
                    : 0;

                setMetrics({
                    fps: Math.max(1, Math.min(60, fps)),
                    memory,
                    drawCalls: info.render.calls || 0,
                    triangles: info.render.triangles || 0
                });

                frameCount = 0;
                lastTime = now;

                // Reset info for next measurement
                if (info.reset) info.reset();
            }

            animationId = requestAnimationFrame(updateMetrics);
        };

        animationId = requestAnimationFrame(updateMetrics);

        return () => {
            if (animationId) cancelAnimationFrame(animationId);
        };
    }, [show, objects]);

    if (!show) return null;

    return (
        <div className="absolute top-4 left-4 bg-black/80 text-white text-xs p-3 rounded-lg z-20 font-mono">
            <div className="space-y-1">
                <div>FPS: <span className={cn(
                    "font-bold",
                    metrics.fps > 50 ? "text-green-400" :
                        metrics.fps > 30 ? "text-yellow-400" : "text-red-400"
                )}>{metrics.fps}</span></div>
                <div>Memory: <span className="text-blue-400">{metrics.memory}MB</span></div>
                <div>Calls: <span className="text-purple-400">{metrics.drawCalls}</span></div>
                <div>Triangles: <span className="text-orange-400">{metrics.triangles.toLocaleString()}</span></div>
            </div>
        </div>
    );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';
