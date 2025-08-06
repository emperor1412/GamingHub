import React, { useEffect, useRef, useState, Suspense, Component } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls, Environment } from '@react-three/drei';
import './FlipCoin.css';

// Error Boundary for React Three Fiber
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in React Three Fiber:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong with the 3D renderer.</div>;
    }

    return this.props.children;
  }
}

// GLTF Model Component
const GLTFModel = ({ isFlipping, onFlipComplete, onError }) => {
  const [gltf, setGltf] = useState(null);
  const [error, setError] = useState(false);
  const meshRef = useRef();
  const [rotationSpeed, setRotationSpeed] = useState(0.01);

    useEffect(() => {
    const loadModel = async () => {
      try {
        const loader = new GLTFLoader();
        const loadedGltf = await new Promise((resolve, reject) => {
          loader.load('/model/diamond_texture_logo_spin_animation.gltf', resolve, undefined, reject);
        });
        setGltf(loadedGltf);
      } catch (err) {
        console.error('Error loading GLTF model:', err);
        setError(true);
        if (onError) onError();
      }
    };
    
    loadModel();
  }, [onError]);

  useEffect(() => {
    if (isFlipping) {
      setRotationSpeed(0.2); // Tăng tốc độ quay khi flipping
      // Simulate flip result after animation
      setTimeout(() => {
        const result = Math.random() > 0.5 ? 'heads' : 'tails';
        onFlipComplete(result);
      }, 3000);
    } else {
      setRotationSpeed(0.01); // Tốc độ quay bình thường
    }
  }, [isFlipping, onFlipComplete]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
      if (isFlipping) {
        meshRef.current.rotation.x += 0.1; // Thêm flip animation
      }
    }
  });

  if (error || !gltf) {
    return null;
  }

  return (
    <primitive 
      object={gltf.scene} 
      ref={meshRef}
      scale={[2, 2, 2]}
      position={[0, 0, 0]}
    />
  );
};

// Fallback Coin Component
const FallbackCoin = ({ isFlipping, onFlipComplete }) => {
  const meshRef = useRef();
  const [rotationSpeed, setRotationSpeed] = useState(0.01);

  useEffect(() => {
    if (isFlipping) {
      setRotationSpeed(0.2);
      setTimeout(() => {
        const result = Math.random() > 0.5 ? 'heads' : 'tails';
        onFlipComplete(result);
      }, 3000);
    } else {
      setRotationSpeed(0.01);
    }
  }, [isFlipping, onFlipComplete]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
      if (isFlipping) {
        meshRef.current.rotation.x += 0.1;
      }
    }
  });

  return (
    <mesh ref={meshRef} scale={[2, 2, 2]} position={[0, 0, 0]}>
      <cylinderGeometry args={[1, 1, 0.1, 32]} />
      <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
    </mesh>
  );
};

const FlipCoin = ({ onFlipComplete, isFlipping = false, onClose }) => {
  const [gltfError, setGltfError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const handleFallbackFlip = () => {
    const result = Math.random() > 0.5 ? 'heads' : 'tails';
    console.log('Fallback flip result:', result);
    onFlipComplete(result);
  };

  return (
    <div className="flip-coin-overlay">
      <div className="flip-coin-container">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        <div className="flip-coin-wrapper">
          {!gltfError ? (
            <ErrorBoundary 
              fallback={
                <div className="fallback-animation">
                  <div className="fallback-coin">🪙</div>
                  <button 
                    className="fallback-flip-button"
                    onClick={handleFallbackFlip}
                    disabled={isFlipping}
                  >
                    {isFlipping ? 'Flipping...' : 'Flip Coin'}
                  </button>
                </div>
              }
            >
              <Canvas 
                camera={{ position: [0, 0, 5], fov: 50 }}
                onError={() => {
                  setGltfError(true);
                  setUseFallback(true);
                }}
              >
                <Suspense fallback={null}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <spotLight position={[0, 10, 0]} intensity={0.8} />
                  
                  {useFallback ? (
                    <FallbackCoin 
                      isFlipping={isFlipping}
                      onFlipComplete={onFlipComplete}
                    />
                  ) : (
                    <GLTFModel 
                      isFlipping={isFlipping}
                      onFlipComplete={onFlipComplete}
                      onError={() => setUseFallback(true)}
                    />
                  )}
                  
                  <OrbitControls 
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={!isFlipping}
                    autoRotateSpeed={0.5}
                  />
                  
                  <Environment preset="city" />
                </Suspense>
              </Canvas>
            </ErrorBoundary>
          ) : (
            <div className="fallback-animation">
              <div className="fallback-coin">🪙</div>
              <button 
                className="fallback-flip-button"
                onClick={handleFallbackFlip}
                disabled={isFlipping}
              >
                {isFlipping ? 'Flipping...' : 'Flip Coin'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlipCoin;