import { PenroseTriangle } from '../geometries/PenroseTriangle';
import { motion } from 'framer-motion-3d';

interface SceneProps {
  selectedObject: string;
}

export function Scene({ selectedObject }: SceneProps) {
  return (
    <>
      {selectedObject === 'penrose-triangle' && (
        <motion.group
          initial={{ scale: 0, rotateY: 0 }}
          animate={{ scale: 1, rotateY: Math.PI * 2 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <PenroseTriangle autoRotate={true} />
        </motion.group>
      )}
      
      {/* Placeholder for future objects */}
      {selectedObject === 'klein-bottle' && (
        <mesh>
          <torusKnotGeometry args={[1, 0.3, 100, 16]} />
          <meshStandardMaterial color="#0066ff" wireframe />
        </mesh>
      )}
      
      {selectedObject === 'mobius-strip' && (
        <mesh>
          <torusGeometry args={[2, 0.5, 8, 32]} />
          <meshStandardMaterial color="#00cc88" />
        </mesh>
      )}
    </>
  );
}