'use client';

import { useEffect, useRef } from 'react';

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Simple animated particles only
    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      
      // Clear canvas (transparent background)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw animated particles with multiple spinning animations
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      for (let i = 0; i < 50; i++) {
        // Animation 1: Main circular motion
        const x1 = Math.sin(time + i * 0.1) * canvas.width / 6;
        const y1 = Math.cos(time + i * 0.15) * canvas.height / 6;
        
        // Animation 2: Secondary rotation
        const x2 = Math.sin(time * 0.5 + i * 0.2) * canvas.width / 8;
        const y2 = Math.cos(time * 0.5 + i * 0.25) * canvas.height / 8;
        
        // Animation 3: Tertiary spiral
        const x3 = Math.sin(time * 1.5 + i * 0.3) * canvas.width / 10;
        const y3 = Math.cos(time * 1.5 + i * 0.35) * canvas.height / 10;
        
        // Animation 4: Fast inner rotation
        const x4 = Math.sin(time * 2 + i * 0.4) * canvas.width / 12;
        const y4 = Math.cos(time * 2 + i * 0.45) * canvas.height / 12;
        
        // Animation 5: Slow outer orbit
        const x5 = Math.sin(time * 0.3 + i * 0.5) * canvas.width / 5;
        const y5 = Math.cos(time * 0.3 + i * 0.55) * canvas.height / 5;
        
        // Animation 6: Figure-8 pattern
        const x6 = Math.sin(time * 0.8 + i * 0.6) * Math.cos(time * 0.4 + i * 0.1) * canvas.width / 15;
        const y6 = Math.cos(time * 0.8 + i * 0.65) * Math.sin(time * 0.4 + i * 0.1) * canvas.height / 15;
        
        // Animation 7: Counter-clockwise rotation
        const x7 = Math.sin(-(time * 0.7) + i * 0.7) * canvas.width / 14;
        const y7 = Math.cos(-(time * 0.7) + i * 0.75) * canvas.height / 14;
        
        // Animation 8: Elliptical orbit
        const x8 = Math.sin(time * 1.2 + i * 0.8) * canvas.width / 9;
        const y8 = Math.cos(time * 1.2 + i * 0.85) * canvas.height / 7;
        
        // Animation 9: Pulsing circular motion
        const pulseScale = Math.sin(time * 3 + i * 0.9) * 0.5 + 1;
        const x9 = Math.sin(time * 0.9 + i * 0.9) * canvas.width / 13 * pulseScale;
        const y9 = Math.cos(time * 0.9 + i * 0.95) * canvas.height / 13 * pulseScale;
        
        // Animation 10: Chaotic motion
        const x10 = Math.sin(time * 1.8 + i * 1.0) * Math.cos(time * 0.6 + i * 0.2) * canvas.width / 11;
        const y10 = Math.cos(time * 1.8 + i * 1.05) * Math.sin(time * 0.6 + i * 0.2) * canvas.height / 11;
        
        // Combine all animations
        const x = canvas.width / 2 + x1 + x2 + x3 + x4 + x5 + x6 + x7 + x8 + x9 + x10;
        const y = canvas.height / 2 + y1 + y2 + y3 + y4 + y5 + y6 + y7 + y8 + y9 + y10;
        
        const radius = Math.sin(time + i * 0.2) * 2 + 2;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}