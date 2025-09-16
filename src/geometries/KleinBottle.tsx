import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function KleinBottle({ autoRotate = true }: { autoRotate?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.x += delta * 0.1;
    }
  });

  // Generate Klein Bottle geometry using correct parametric equations
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const uSegments = 64;
    const vSegments = 32;

    // Correct Klein Bottle parametric equations
    function kleinBottle(u: number, v: number): THREE.Vector3 {
      u = u * 2 * Math.PI; // u parameter from 0 to 2π
      v = v * 2 * Math.PI; // v parameter from 0 to 2π

      let x, y, z;

      // The Klein bottle has different equations for different regions
      if (u < Math.PI) {
        // First half: the bottle part
        x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
        z = -8 * Math.sin(u) - (2 * (1 - Math.cos(u) / 2)) * Math.sin(u) * Math.cos(v);
      } else {
        // Second half: the self-intersecting tube part
        x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
        z = -8 * Math.sin(u);
      }
      
      y = (2 * (1 - Math.cos(u) / 2)) * Math.sin(v);

      // Scale the bottle appropriately
      return new THREE.Vector3(x * 0.3, y * 0.3, z * 0.3);
    }

    // Generate vertices
    for (let i = 0; i <= uSegments; i++) {
      const u = i / uSegments;
      for (let j = 0; j <= vSegments; j++) {
        const v = j / vSegments;
        const vertex = kleinBottle(u, v);
        vertices.push(vertex.x, vertex.y, vertex.z);
        
        // Calculate normal using finite differences
        const delta = 0.01;
        const vertex1 = kleinBottle(u + delta, v);
        const vertex2 = kleinBottle(u, v + delta);
        
        const tangentU = new THREE.Vector3().subVectors(vertex1, vertex);
        const tangentV = new THREE.Vector3().subVectors(vertex2, vertex);
        const normal = new THREE.Vector3().crossVectors(tangentU, tangentV).normalize();
        
        normals.push(normal.x, normal.y, normal.z);
        uvs.push(u, v);
      }
    }

    // Generate indices for triangular faces
    for (let i = 0; i < uSegments; i++) {
      for (let j = 0; j < vSegments; j++) {
        const a = i * (vSegments + 1) + j;
        const b = a + vSegments + 1;
        const c = a + 1;
        const d = b + 1;

        // Two triangles per quad
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

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial
        color="#4a90e2"
        metalness={0.1}
        roughness={0.05}
        clearcoat={1}
        clearcoatRoughness={0.05}
        transmission={0.7}
        thickness={0.3}
        envMapIntensity={1.5}
        side={THREE.DoubleSide}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}