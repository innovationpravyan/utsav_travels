"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroBanner() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 2.5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // 3D Object
    const geometry = new THREE.IcosahedronGeometry(1, 4);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff851b,
      wireframe: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x008080, 5, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xff851b, 5, 100);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.x += 0.001;
      sphere.rotation.y += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div className="relative h-[70vh] md:h-screen w-full overflow-hidden">
      <div
        ref={mountRef}
        className="absolute inset-0 z-0"
      />
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/20">
        <div className="text-center text-foreground container px-4">
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-black mb-4 drop-shadow-lg">
            Explore the World
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-8 drop-shadow-md">
            Your next adventure is just a click away. Discover curated travel experiences that you'll never forget.
          </p>
          <Button asChild size="lg" className="text-lg py-7 px-10">
            <Link href="/packages">
              Start Your Journey <ArrowRight className="ml-2"/>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
