import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls, Float, Text, Line } from '@react-three/drei';
import * as THREE from 'three';

interface ProviderNode {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
  status: 'healthy' | 'degraded' | 'down';
  requests: number;
}

const providers: ProviderNode[] = [
  { id: 'openai', name: 'OpenAI', position: [0, 2, 0], color: '#10b981', status: 'healthy', requests: 32400 },
  { id: 'anthropic', name: 'Anthropic', position: [3, 0, 1], color: '#8b5cf6', status: 'healthy', requests: 18500 },
  { id: 'groq', name: 'Groq', position: [-3, 0, 1], color: '#06b6d4', status: 'healthy', requests: 24100 },
  { id: 'together', name: 'Together', position: [0, -2, 2], color: '#f59e0b', status: 'degraded', requests: 15200 },
  { id: 'local', name: 'Local', position: [0, 0, -2], color: '#6b7280', status: 'healthy', requests: 8900 },
];

function ProviderSphere({ provider, index }: { provider: ProviderNode; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.position.y = provider.position[1] + Math.sin(state.clock.elapsedTime + index) * 0.1;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  const size = Math.sqrt(provider.requests / 10000) * 0.3 + 0.3;

  return (
    <group position={provider.position}>
      {/* Glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 1.5, 32, 32]} />
        <meshBasicMaterial color={provider.color} transparent opacity={0.1} />
      </mesh>

      {/* Main sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={provider.color}
          emissive={provider.color}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, size + 0.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {provider.name}
      </Text>

      {/* Status indicator */}
      <mesh position={[size * 0.7, size * 0.7, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial
          color={provider.status === 'healthy' ? '#10b981' : provider.status === 'degraded' ? '#f59e0b' : '#ef4444'}
        />
      </mesh>
    </group>
  );
}

function ConnectionLine({ from, to, color }: { from: [number, number, number]; to: [number, number, number]; color: string }) {
  const points = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...from),
      new THREE.Vector3((from[0] + to[0]) / 2, (from[1] + to[1]) / 2 + 1, (from[2] + to[2]) / 2),
      new THREE.Vector3(...to)
    );
    return curve.getPoints(50);
  }, [from, to]);

  return <Line points={points} color={color} lineWidth={1} transparent opacity={0.3} />;
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#8b5cf6" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export default function ProviderNetwork3D() {
  return (
    <div className="w-full h-[500px] bg-gradient-to-br from-[#0a0b0f] to-[#12141c] rounded-2xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />

        {/* Provider nodes */}
        {providers.map((provider, i) => (
          <ProviderSphere key={provider.id} provider={provider} index={i} />
        ))}

        {/* Connections */}
        {providers.map((from, i) =>
          providers.slice(i + 1).map((to) => (
            <ConnectionLine
              key={`${from.id}-${to.id}`}
              from={from.position}
              to={to.position}
              color="#8b5cf6"
            />
          ))
        )}

        {/* Particle field */}
        <ParticleField />

        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}
