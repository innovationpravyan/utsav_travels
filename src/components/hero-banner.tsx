"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RunningText } from "./running-text";

export function HeroBanner() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    const clock = new THREE.Clock();

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 2.0;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // 3D Globe
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 1.0 },
            colorA: { value: new THREE.Color(0xff851b) },
            colorB: { value: new THREE.Color(0x008080) },
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 colorA;
            uniform vec3 colorB;
            varying vec2 vUv;

            void main() {
                vec2 rotatedUv = vec2(vUv.x + time * 0.05, vUv.y);
                float noise = (sin(rotatedUv.x * 10.0) + cos(rotatedUv.y * 10.0)) * 0.5 + 0.5;
                vec3 color = mix(colorA, colorB, noise);
                gl_FragColor = vec4(color, 1.0);
            }
        `,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    window.addEventListener('mousemove', onMouseMove);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.y += 0.001;

      // Parallax effect
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      material.uniforms.time.value = clock.getElapsedTime();
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
      window.removeEventListener("mousemove", onMouseMove);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div className="relative h-[70vh] md:h-screen w-full overflow-hidden bg-background">
      <div
        ref={mountRef}
        className="absolute inset-0 z-0"
      />
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/20 backdrop-blur-sm">
        <div className="text-center container px-4">
          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-4">
            <RunningText text="Explore the World" />
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-8 drop-shadow-md text-foreground/80">
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
