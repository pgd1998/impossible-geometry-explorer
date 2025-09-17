import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UIProps {
  selectedObject: string;
  onSelectObject: (object: string) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
}

const objects = [
  { 
    id: 'klein-bottle', 
    name: 'K',
    fullName: 'Klein Bottle',
    description: 'A closed surface with no distinct inside or outside. In 4D space, it exists without self-intersection, but in 3D it must pass through itself.'
  },
  { 
    id: 'mobius-strip', 
    name: 'M',
    fullName: 'Möbius Strip',
    description: 'A surface with only one side and one boundary. Follow the red particle as it travels the impossible path, always staying on the same side.'
  },
  { 
    id: 'boys-surface', 
    name: 'B',
    fullName: 'Boy\'s Surface',
    description: 'A mathematical surface that is a real projective plane with self-intersections. This non-orientable surface has fascinating topological properties.'
  },
  { 
    id: 'escher-cube', 
    name: 'E',
    fullName: 'Impossible Cube',
    description: 'A wireframe cube where each face exists in a different perspective, creating an impossible 3D structure.'
  },
];

export function UI({ selectedObject, onSelectObject, showGrid, onToggleGrid }: UIProps) {
  const [showInfo, setShowInfo] = useState(false);
  const currentObject = objects.find(obj => obj.id === selectedObject);

  useEffect(() => {
    setShowInfo(true);
    const timer = setTimeout(() => setShowInfo(false), 3000);
    return () => clearTimeout(timer);
  }, [selectedObject]);

  return (
    <div className="ui-overlay">
      {/* Title */}
      <motion.h1 
        className="title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Impossible Geometry
      </motion.h1>

      {/* Object Selector */}
      <motion.div 
        className="object-selector"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {objects.map((obj) => (
          <button
            key={obj.id}
            className={`object-button ${selectedObject === obj.id ? 'active' : ''}`}
            onClick={() => onSelectObject(obj.id)}
            title={obj.fullName}
          >
            {obj.name}
          </button>
        ))}
      </motion.div>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && currentObject && (
          <motion.div
            className="info-panel visible"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <h3>{currentObject.fullName}</h3>
            <p>{currentObject.description}</p>
            <button
              onClick={() => setShowInfo(false)}
              style={{
                background: 'none',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                fontSize: '0.75rem',
                color: '#6c757d',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Hint */}
      <motion.div 
        className="controls-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div>Drag to rotate • Scroll to zoom • Shift+drag to pan</div>
        <div style={{ marginTop: '0.5rem' }}>
          <button
            onClick={onToggleGrid}
            style={{
              background: 'none',
              border: 'none',
              color: '#6c757d',
              cursor: 'pointer',
              fontSize: '0.75rem',
              textDecoration: 'underline'
            }}
          >
            {showGrid ? 'Hide' : 'Show'} Grid
          </button>
          {' • '}
          <button
            onClick={() => setShowInfo(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#6c757d',
              cursor: 'pointer',
              fontSize: '0.75rem',
              textDecoration: 'underline'
            }}
          >
            Show Info
          </button>
        </div>
      </motion.div>
    </div>
  );
}