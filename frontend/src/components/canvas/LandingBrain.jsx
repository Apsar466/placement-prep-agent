import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';

const BrainMesh = () => {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      {/* Outer Wireframe Sphere */}
      <mesh scale={2.2}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#10B981" wireframe transparent opacity={0.3} />
      </mesh>
      
      {/* Inner Distorted Energy Core */}
      <mesh scale={1.5}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#059669"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          transparent
          opacity={0.8}
          emissive="#059669"
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
};

const LandingBrain = () => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <BrainMesh />
      </Canvas>
    </div>
  );
};

export default LandingBrain;