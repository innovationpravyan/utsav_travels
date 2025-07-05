'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

export default function Globe() {
  return (
    <Canvas className="h-full w-full">
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="hsl(var(--primary))" wireframe />
      </mesh>
      <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} enablePan={false} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
    </Canvas>
  );
}
