import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import { Scene } from './components/Scene';
import { UI } from './components/UI';

export default function App() {
  const [selectedObject, setSelectedObject] = useState('klein-bottle');
  const [showGrid, setShowGrid] = useState(false);
  
  const { background } = useControls('Scene', {
    background: '#f8f9fa'
  });

  return (
    <>
      <div className="canvas-container">
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ 
            antialias: true,
            alpha: true 
          }}
        >
          <color attach="background" args={[background]} />
          
          <PerspectiveCamera 
            makeDefault 
            position={[5, 5, 5]} 
            fov={50}
          />
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            zoomSpeed={0.5}
            rotateSpeed={0.5}
            minDistance={3}
            maxDistance={20}
            target={[0, 0, 0]}
          />

          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <directionalLight
            position={[-10, -10, -5]}
            intensity={0.3}
          />

          {/* Environment for reflections */}
          <Environment preset="studio" />

          {/* Grid */}
          {showGrid && (
            <Grid
              args={[20, 20]}
              cellSize={1}
              cellThickness={0.5}
              cellColor="#6c757d"
              sectionSize={5}
              sectionThickness={1}
              sectionColor="#495057"
              fadeDistance={30}
              fadeStrength={1}
              followCamera={false}
              infiniteGrid={true}
              position={[0, -2, 0]}
              renderOrder={-1}
            />
          )}

          {/* Scene content */}
          <Suspense fallback={null}>
            <Scene selectedObject={selectedObject} />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <UI 
        selectedObject={selectedObject}
        onSelectObject={setSelectedObject}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
      />

      {/* Leva controls (hidden by default) */}
      <Leva hidden />
    </>
  );
}