import { KleinBottle } from '../geometries/KleinBottle';
import { MobiusStrip } from '../geometries/MobiusStrip';
import { BoysSurface } from '../geometries/BoysSurface';
import { animated, useSpring } from '@react-spring/three';

interface SceneProps {
  selectedObject: string;
}

export function Scene({ selectedObject }: SceneProps) {
  const springProps = useSpring({
    from: { scale: 0, rotationY: 0 },
    to: { scale: 1, rotationY: Math.PI * 0.5 },
    config: { duration: 800 }
  });

  return (
    <>
      {selectedObject === 'klein-bottle' && (
        <animated.group scale={springProps.scale} rotation-y={springProps.rotationY}>
          <KleinBottle autoRotate={true} />
        </animated.group>
      )}
      
      {selectedObject === 'mobius-strip' && (
        <animated.group scale={springProps.scale} rotation-y={springProps.rotationY}>
          <MobiusStrip autoRotate={true} showParticle={true} />
        </animated.group>
      )}

      {selectedObject === 'boys-surface' && (
        <animated.group scale={springProps.scale} rotation-y={springProps.rotationY}>
          <BoysSurface autoRotate={true} />
        </animated.group>
      )}

      {selectedObject === 'escher-cube' && (
        <animated.group scale={springProps.scale} rotation-y={springProps.rotationY}>
          <mesh>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#666" wireframe />
          </mesh>
        </animated.group>
      )}
    </>
  );
}