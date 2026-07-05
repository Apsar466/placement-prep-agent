import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Torus } from './TorusMesh'; // Extracted mesh logic for clean architecture

const PlacementReadinessRing = ({ score = 0 }) => {
  return (
    <div className="w-full h-[300px] relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Torus progress={score / 100} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
      </Canvas>
      {/* DOM Overlay for Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-6xl font-mono font-bold text-white">{score}%</span>
        <span className="text-white/50 text-sm mt-2">READINESS INDEX</span>
      </div>
    </div>
  );
};

// Simple Mesh Component (In same file or separate if complex)
const Torus = ({ progress }) => {
  // Phase 2 will implement the custom GLSL shader for the glowing sweep effect
  return (
    <mesh>
      <torusGeometry args={[2, 0.1, 16, 100]} />
      <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.5} />
    </mesh>
  );
};

export default PlacementReadinessRing;