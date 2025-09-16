import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function ProperPenroseTriangle({ autoRotate = false }: { autoRotate?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  // Beam dimensions - smaller and more proportional
  const beamWidth = 0.5;
  const beamHeight = 0.5;
  const beamLength = 2.5;

  return (
    <group ref={groupRef}>
      {/* Bottom beam (horizontal) - Red */}
      <mesh position={[0, -1.25, 1]} castShadow receiveShadow>
        <boxGeometry args={[beamLength, beamHeight, beamWidth]} />
        <meshStandardMaterial 
          color="#e74c3c"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Left beam (diagonal up-right) - rotated 60° */}
      <mesh 
        position={[-1.08, 0.625, 0]} 
        rotation={[0, 0, Math.PI / 3]}
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[beamLength, beamHeight, beamWidth]} />
        <meshStandardMaterial 
          color="#3498db"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Right beam (diagonal up-left) - rotated -60° */}
      <mesh 
        position={[1.08, 0.625, -1]} 
        rotation={[0, 0, -Math.PI / 3]}
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[beamLength, beamHeight, beamWidth]} />
        <meshStandardMaterial 
          color="#2ecc71"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Corner connectors to create the impossible joints */}
      
      {/* Bottom-left corner */}
      <mesh position={[-1.25, -1.25, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[beamWidth, beamHeight, beamWidth]} />
        <meshStandardMaterial 
          color="#f39c12"
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Bottom-right corner */}
      <mesh position={[1.25, -1.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[beamWidth, beamHeight, beamWidth]} />
        <meshStandardMaterial 
          color="#9b59b6"
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Top corner */}
      <mesh position={[0, 1.25, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[beamWidth, beamHeight, beamWidth]} />
        <meshStandardMaterial 
          color="#e67e22"
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Additional small connector pieces to enhance the illusion */}
      <mesh position={[-0.6, -0.3, 0.75]} rotation={[0, 0, Math.PI / 6]} castShadow receiveShadow>
        <boxGeometry args={[0.3, beamHeight, beamWidth]} />
        <meshStandardMaterial 
          color="#e74c3c"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      <mesh position={[0.6, -0.3, 0.25]} rotation={[0, 0, -Math.PI / 6]} castShadow receiveShadow>
        <boxGeometry args={[0.3, beamHeight, beamWidth]} />
        <meshStandardMaterial 
          color="#2ecc71"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      <mesh position={[0, 0.8, -0.25]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <boxGeometry args={[0.3, beamHeight, beamWidth]} />
        <meshStandardMaterial 
          color="#3498db"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  const [autoRotate, setAutoRotate] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 8]);

  return (
    <div style={{ width: '100%', height: '100vh', background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={cameraPosition} fov={60} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          target={[0, 0, 0]}
        />
        
        {/* Improved lighting for better illusion */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-5, -5, 2]} intensity={0.3} color="#ffffff" />

        <ProperPenroseTriangle autoRotate={autoRotate} />

        {/* Ground plane */}
        <mesh receiveShadow position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[15, 15]} />
          <meshStandardMaterial color="#2c3e50" opacity={0.9} transparent />
        </mesh>
      </Canvas>

      {/* Controls */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(0,0,0,0.8)',
        padding: '15px',
        borderRadius: '10px',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Penrose Triangle</h3>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autoRotate}
              onChange={(e) => setAutoRotate(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Auto Rotate
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <button
            onClick={() => setCameraPosition([0, 0, 8])}
            style={{
              background: '#3498db',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '8px',
              fontSize: '12px'
            }}
          >
            Front View
          </button>
          <button
            onClick={() => setCameraPosition([6, 3, 6])}
            style={{
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '8px',
              fontSize: '12px'
            }}
          >
            Angle View
          </button>
          <button
            onClick={() => setCameraPosition([0, 8, 0])}
            style={{
              background: '#2ecc71',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Top View
          </button>
        </div>

        <div style={{ fontSize: '12px', opacity: '0.9', lineHeight: '1.3' }}>
          <p style={{ margin: '3px 0' }}>• Best illusion from front view</p>
          <p style={{ margin: '3px 0' }}>• Drag to orbit around</p>
          <p style={{ margin: '3px 0' }}>• Scroll to zoom</p>
        </div>
      </div>

      {/* Instruction panel */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.8)',
        padding: '15px',
        borderRadius: '10px',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '280px'
      }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>The Impossible Triangle</h4>
        <p style={{ margin: '0', fontSize: '12px', lineHeight: '1.4' }}>
          Each beam appears to pass over one and under another, creating an impossible loop. 
          The illusion works by using different depths that aren't obvious from the front view.
        </p>
      </div>
    </div>
  );
}

export default Scene;