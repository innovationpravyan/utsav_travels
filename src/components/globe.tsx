'use client';
import { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

const GlobeMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [colorMap, normalMap, specularMap] = useLoader(THREE.TextureLoader, [
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthmap1k.jpg',
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earth_normal_map_1k.jpg',
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthspec1k.jpg',
  ]);

  useFrame(({ clock }) => {
    meshRef.current.rotation.y = clock.getElapsedTime() / 6;
  });

  return (
    <mesh ref={meshRef} scale={2.5}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhongMaterial
        map={colorMap}
        normalMap={normalMap}
        specularMap={specularMap}
        shininess={100}
      />
    </mesh>
  );
};

export const Globe = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[2, 2, 2]} intensity={1.5} />
      <Stars radius={300} depth={50} count={20000} factor={7} saturation={0} fade />
      <GlobeMesh />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
};
