import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function PenroseTriangle({ autoRotate = true }: { autoRotate?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  // Create the three beams of the Penrose triangle
  const beamWidth = 0.8;
  const beamLength = 4;
  const beamThickness = 0.8;

  return (
    <group ref={groupRef}>
      {/* Beam 1 - Bottom horizontal */}
      <mesh position={[0, -1.5, 1.5]} castShadow receiveShadow>
        <boxGeometry args={[beamLength, beamThickness, beamThickness]} />
        <meshStandardMaterial 
          color="#2c3e50"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Beam 2 - Left diagonal */}
      <group rotation={[0, 0, Math.PI / 3]} position={[-1.7, 0, 1.5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[beamLength, beamThickness, beamThickness]} />
          <meshStandardMaterial 
            color="#34495e"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* Beam 3 - Right diagonal */}
      <group rotation={[0, 0, -Math.PI / 3]} position={[1.7, 0, 1.5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[beamLength, beamThickness, beamThickness]} />
          <meshStandardMaterial 
            color="#455a74"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* Corner connectors to create the illusion */}
      {/* Bottom left corner */}
      <mesh position={[-2, -1.5, 1.5]} castShadow receiveShadow>
        <boxGeometry args={[beamThickness, beamThickness, beamThickness]} />
        <meshStandardMaterial 
          color="#2c3e50"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Bottom right corner */}
      <mesh position={[2, -1.5, 1.5]} castShadow receiveShadow>
        <boxGeometry args={[beamThickness, beamThickness, beamThickness]} />
        <meshStandardMaterial 
          color="#2c3e50"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Top corner - positioned to create the impossible connection */}
      <mesh position={[0, 1.7, -1.5]} castShadow receiveShadow>
        <boxGeometry args={[beamThickness, beamThickness, beamThickness]} />
        <meshStandardMaterial 
          color="#455a74"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Additional beams to complete the illusion */}
      {/* Vertical connector left */}
      <mesh position={[-2, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[beamThickness, 3, beamThickness]} />
        <meshStandardMaterial 
          color="#34495e"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Vertical connector right */}
      <mesh position={[2, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[beamThickness, 3, beamThickness]} />
        <meshStandardMaterial 
          color="#455a74"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Top horizontal connector */}
      <mesh position={[0, 1.7, -1.5]} castShadow receiveShadow>
        <boxGeometry args={[beamLength * 0.7, beamThickness, beamThickness]} />
        <meshStandardMaterial 
          color="#455a74"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}