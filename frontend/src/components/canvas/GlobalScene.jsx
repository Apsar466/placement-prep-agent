import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

// Animated Gradient Blob Component
const GradientBlob = ({ position, color, speed = 1.5, distort = 0.4 }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.05 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1 * speed;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={2.5}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={speed}
          roughness={0.2}
          transparent
          opacity={0.15}
        />
      </mesh>
    </Float>
  );
};

const GlobalScene = () => {
  return (
    // Fixed canvas behind all DOM elements. pointer-events-none allows clicking through to UI
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        {/* Ambient Light for blobs */}
        <ambientLight intensity={0.5} />
        
        {/* Subtle Star Field */}
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

        {/* Floating Gradient Blobs for depth */}
        <GradientBlob position={[-4, 2, -5]} color="#059669" speed={1.2} />
        <GradientBlob position={[4, -2, -3]} color="#10B981" speed={1.8} distort={0.3} />
        <GradientBlob position={[0, 0, -8]} color="#34D399" speed={1} distort={0.6} scale={4} />

        {/* Subtle Ground Grid (Simulated with a simple plane) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.02} wireframe />
        </mesh>
      </Canvas>
    </div>
  );
};

export default GlobalScene;