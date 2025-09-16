import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Line, Sphere } from '@react-three/drei';

interface MobiusStripProps {
  autoRotate?: boolean;
  showParticle?: boolean;
}

export function MobiusStrip({ autoRotate = true, showParticle = true }: MobiusStripProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particleRef = useRef<THREE.Mesh>(null);
  const [particleT, setParticleT] = useState(0);

  useFrame((_state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.3;
    }
    
    if (particleRef.current && showParticle) {
      const t = (particleT + delta * 0.5) % (Math.PI * 2);
      setParticleT(t);
      
      // Position particle on Möbius strip
      const u = t;
      const v = 0; // Keep on center line
      const pos = mobiusFunction(u, v);
      particleRef.current.position.copy(pos);
    }
  });

  // Möbius strip parametric function
  function mobiusFunction(u: number, v: number): THREE.Vector3 {
    const R = 2; // Major radius
    const x = (R + v * Math.cos(u / 2)) * Math.cos(u);
    const y = (R + v * Math.cos(u / 2)) * Math.sin(u);
    const z = v * Math.sin(u / 2);
    return new THREE.Vector3(x, z, y);
  }

  // Generate Möbius strip geometry
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const uSegments = 100;
    const vSegments = 20;
    const maxV = 0.5;

    // Generate vertices
    for (let i = 0; i <= uSegments; i++) {
      const u = (i / uSegments) * Math.PI * 2;
      for (let j = 0; j <= vSegments; j++) {
        const v = ((j / vSegments) - 0.5) * 2 * maxV;
        const vertex = mobiusFunction(u, v);
        vertices.push(vertex.x, vertex.y, vertex.z);
        
        // Calculate normal
        const delta = 0.01;
        const vertexU = mobiusFunction(u + delta, v);
        const vertexV = mobiusFunction(u, v + delta);
        const tangentU = vertexU.sub(vertex.clone());
        const tangentV = vertexV.sub(vertex.clone());
        const normal = tangentU.cross(tangentV).normalize();
        normals.push(normal.x, normal.y, normal.z);
        
        uvs.push(u / (Math.PI * 2), (v + maxV) / (2 * maxV));
      }
    }

    // Generate indices
    for (let i = 0; i < uSegments; i++) {
      for (let j = 0; j < vSegments; j++) {
        const a = i * (vSegments + 1) + j;
        const b = a + vSegments + 1;
        const c = a + 1;
        const d = b + 1;

        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);

    return geom;
  }, []);

  // Generate center line path for visualization
  const centerLinePath = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 200; i++) {
      const u = (i / 200) * Math.PI * 2;
      const point = mobiusFunction(u, 0);
      points.push(point);
    }
    return points;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Main Möbius strip */}
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#00cc88"
          metalness={0.1}
          roughness={0.3}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Center line visualization */}
      <Line
        points={centerLinePath}
        color="#ffffff"
        lineWidth={3}
        transparent
        opacity={0.6}
      />

      {/* Traveling particle */}
      {showParticle && (
        <Sphere ref={particleRef} args={[0.1]} castShadow>
          <meshStandardMaterial
            color="#ff4444"
            emissive="#ff2222"
            emissiveIntensity={0.3}
          />
        </Sphere>
      )}

      {/* Edge highlighting */}
      <Line
        points={centerLinePath.map(p => p.clone().multiplyScalar(1.02))}
        color="#ffffff"
        lineWidth={2}
        transparent
        opacity={0.4}
      />
    </group>
  );
}