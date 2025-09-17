import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function BoysSurface({ autoRotate = true }: { autoRotate?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.x += delta * 0.1;
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  // Generate Boy's Surface using custom geometry
  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    const segments = 40;
    
    // Generate vertices using parametric equations for Boy's Surface
    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const u = (i / segments) * Math.PI;
        const v = (j / segments) * Math.PI;

        // Simplified Boy's surface parametric equations
        const cosu = Math.cos(u);
        const sinu = Math.sin(u);
        const cosv = Math.cos(v);
        const sinv = Math.sin(v);
        
        const sin2u = Math.sin(2 * u);
        const cos2v = Math.cos(2 * v);
        const sin2v = Math.sin(2 * v);

        // Boy's surface coordinates (approximation for visual effect)
        const scale = 1.5;
        const denom = Math.sqrt(2) - sin2u * sin2v + 0.1; // Add small value to avoid division by zero
        
        const x = scale * (2/3) * (cosu * cos2v + Math.sqrt(2) * sinu * cosv) * cosu / denom;
        const y = scale * (2/3) * (cosu * sin2v - Math.sqrt(2) * sinu * sinv) * cosu / denom;
        const z = scale * Math.sqrt(2) * cosu * cosu / denom;

        vertices.push(x, y, z);
        uvs.push(i / segments, j / segments);
      }
    }

    // Generate indices for triangles
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * (segments + 1) + j;
        const b = i * (segments + 1) + j + 1;
        const c = (i + 1) * (segments + 1) + j;
        const d = (i + 1) * (segments + 1) + j + 1;

        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();
    
    return geometry;
  }, []);

  // Create a custom material with varying colors based on position
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        uniform float time;
        
        void main() {
          vPosition = position;
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        uniform float time;
        
        void main() {
          vec3 color1 = vec3(0.8, 0.2, 0.9); // Purple
          vec3 color2 = vec3(0.2, 0.8, 0.9); // Cyan
          vec3 color3 = vec3(0.9, 0.8, 0.2); // Yellow
          
          float factor1 = sin(vPosition.x * 2.0 + time) * 0.5 + 0.5;
          float factor2 = sin(vPosition.y * 2.0 + time * 1.5) * 0.5 + 0.5;
          float factor3 = sin(vPosition.z * 2.0 + time * 0.8) * 0.5 + 0.5;
          
          vec3 finalColor = mix(mix(color1, color2, factor1), color3, factor2 * factor3);
          
          // Add some lighting based on normal
          float lighting = dot(normalize(vNormal), normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;
          finalColor *= lighting;
          
          gl_FragColor = vec4(finalColor, 0.8);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
  }, []);

  useFrame((state) => {
    if (material.uniforms) {
      material.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Boy's Surface */}
      <mesh geometry={geometry} material={material} castShadow receiveShadow />
      
      {/* Wireframe version for educational purposes - now properly synchronized */}
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshBasicMaterial 
          color="#ffffff" 
          wireframe 
          opacity={0.15} 
          transparent 
        />
      </mesh>

      {/* Center reference point to show the surface center */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial 
          color="#ff4757"
          metalness={0.8}
          roughness={0.2}
          emissive="#ff4757"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}