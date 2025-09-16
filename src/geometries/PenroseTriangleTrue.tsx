import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function PenroseTriangleTrue({ autoRotate = true }: { autoRotate?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const beamThickness = 0.4;
  const beamLength = 3.0;
  const beamWidth = 0.8;

  return (
    <group ref={groupRef}>
      {/* The Penrose triangle consists of three L-shaped beams */}
      {/* Each beam appears to go over one and under another */}
      
      {/* Beam 1: Bottom-left L-shape (horizontal + vertical up-left) */}
      <group position={[0, 0, 0]}>
        {/* Horizontal part of L */}
        <mesh position={[0, -1.5, 1]} castShadow receiveShadow>
          <boxGeometry args={[beamLength, beamThickness, beamWidth]} />
          <meshStandardMaterial 
            color="#e74c3c" 
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
        {/* Vertical part of L */}
        <mesh position={[-1.5, 0, 1]} castShadow receiveShadow>
          <boxGeometry args={[beamThickness, beamLength, beamWidth]} />
          <meshStandardMaterial 
            color="#e74c3c"
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Beam 2: Top L-shape (horizontal across top + vertical down-right) */}
      <group position={[0, 0, 0]}>
        {/* Horizontal part of L */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[beamLength, beamThickness, beamWidth]} />
          <meshStandardMaterial 
            color="#3498db"
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
        {/* Vertical part of L */}
        <mesh position={[1.5, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[beamThickness, beamLength, beamWidth]} />
          <meshStandardMaterial 
            color="#3498db"
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Beam 3: Right L-shape (vertical down + horizontal left) - positioned in back */}
      <group position={[0, 0, 0]}>
        {/* Vertical part of L */}
        <mesh position={[1.5, 0, -1]} castShadow receiveShadow>
          <boxGeometry args={[beamThickness, beamLength, beamWidth]} />
          <meshStandardMaterial 
            color="#2ecc71"
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
        {/* Horizontal part of L */}
        <mesh position={[0, -1.5, -1]} castShadow receiveShadow>
          <boxGeometry args={[beamLength, beamThickness, beamWidth]} />
          <meshStandardMaterial 
            color="#2ecc71"
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Corner junction pieces that create the impossible overlaps */}
      {/* These small cubes bridge the "impossible" connections */}
      
      {/* Junction 1: Bottom-left corner where red beam meets green beam */}
      <mesh position={[-1.5, -1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[beamThickness, beamThickness, beamWidth * 1.2]} />
        <meshStandardMaterial 
          color="#f39c12"
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      {/* Junction 2: Top-left corner where red beam meets blue beam */}
      <mesh position={[-1.5, 1.5, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[beamThickness, beamThickness, beamWidth * 1.2]} />
        <meshStandardMaterial 
          color="#9b59b6"
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      {/* Junction 3: Right corner where blue beam meets green beam */}
      <mesh position={[1.5, 1.5, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[beamThickness, beamThickness, beamWidth * 1.2]} />
        <meshStandardMaterial 
          color="#e67e22"
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      {/* Additional transition pieces for smoother visual flow */}
      <mesh position={[1.5, -1.5, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[beamThickness, beamThickness, beamWidth * 1.2]} />
        <meshStandardMaterial 
          color="#1abc9c"
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}