import React, { Suspense, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useAnimations, Environment, Center, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Preload the model for better performance
useGLTF.preload('/video_game_coin/scene.gltf');

// Global model cache to prevent reloading
let cachedModel = null;
let cachedAnimations = null;
let isLoading = false;
let loadPromise = null;
let referenceCount = 0;

// Function to cleanup cached models
export const cleanupCachedModels = () => {
  if (cachedModel) {
    cachedModel.traverse((obj) => {
      if (obj.isMesh) {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(mat => {
              if (mat.map) mat.map.dispose();
              if (mat.emissiveMap) mat.emissiveMap.dispose();
              mat.dispose();
            });
          } else {
            if (obj.material.map) obj.material.map.dispose();
            if (obj.material.emissiveMap) obj.material.emissiveMap.dispose();
            obj.material.dispose();
          }
        }
      }
    });
    cachedModel = null;
    cachedAnimations = null;
    referenceCount = 0;
  }
};

// Preloader component to ensure model is loaded early
function ModelPreloader() {
  const { scene, animations } = useGLTF('/video_game_coin/scene.gltf');
  
  useEffect(() => {
    if (scene && animations && !cachedModel) {
      cachedModel = scene;
      cachedAnimations = animations;
      isLoading = false;
      referenceCount = 1;
    } else if (cachedModel) {
      referenceCount++;
    }
    
    return () => {
      referenceCount--;
      if (referenceCount <= 0) {
        cleanupCachedModels();
      }
    };
  }, [scene, animations]);
  
  return null; // This component doesn't render anything
}

// Standalone preloader component that can be used in the main app
export function CoinModelPreloader() {
  return (
    <div style={{ display: 'none' }}>
      <Canvas>
        <Suspense fallback={null}>
          <ModelPreloader />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Function to ensure model is loaded
const ensureModelLoaded = () => {
  if (cachedModel && cachedAnimations) {
    return Promise.resolve({ scene: cachedModel, animations: cachedAnimations });
  }
  
  if (loadPromise) {
    return loadPromise;
  }
  
  if (isLoading) {
    return new Promise((resolve, reject) => {
      const checkLoaded = () => {
        if (cachedModel && cachedAnimations) {
          isLoading = false;
          resolve({ scene: cachedModel, animations: cachedAnimations });
        } else if (isLoading) {
          setTimeout(checkLoaded, 50);
        } else {
          reject(new Error('Failed to load model'));
        }
      };
      checkLoaded();
    });
  }
  
  isLoading = true;
  loadPromise = new Promise((resolve, reject) => {
    // This will be resolved when ModelPreloader loads the model
    const checkLoaded = () => {
      if (cachedModel && cachedAnimations) {
        isLoading = false;
        resolve({ scene: cachedModel, animations: cachedAnimations });
      } else if (isLoading) {
        setTimeout(checkLoaded, 50);
      } else {
        reject(new Error('Failed to load model'));
      }
    };
    checkLoaded();
    
    // Timeout after 10 seconds
    setTimeout(() => {
      if (isLoading) {
        isLoading = false;
        reject(new Error('Model loading timeout'));
      }
    }, 10000);
  });
  
  return loadPromise;
};

function Coin({ scale = 1, onFinished, loop = true, visible = true }) {
  const group = useRef();
  const [modelData, setModelData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const currentActionRef = useRef(null);
  const animationStartedRef = useRef(false);
  const sceneRef = useRef(null); // Store the cloned scene
  
  // Load model data
  useEffect(() => {
    ensureModelLoaded()
      .then(setModelData)
      .catch(err => {
        console.error('Failed to load 3D model:', err);
        setError(err);
      });
  }, []);
  
  // Ensure materials use correct color space and clone scene once
  useEffect(() => {
    if (!modelData?.scene) return;
    
    // Only clone once and store reference
    if (!sceneRef.current) {
      sceneRef.current = modelData.scene.clone();
      console.log('Scene cloned and stored');
    }
    
    sceneRef.current.traverse((obj) => {
      if (obj.isMesh && obj.material) {
        const mat = obj.material;
        if (Array.isArray(mat)) {
          mat.forEach((m) => {
            if (m.map) m.map.colorSpace = THREE.SRGBColorSpace;
            if (m.emissiveMap) m.emissiveMap.colorSpace = THREE.SRGBColorSpace;
            m.needsUpdate = true;
          });
        } else {
          if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
          if (mat.emissiveMap) mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;
          mat.needsUpdate = true;
        }
      }
    });
  }, [modelData]);
  
  const { actions, names, mixer } = useAnimations(modelData?.animations || [], group);

  // Debug animation names
  useEffect(() => {
    if (names && names.length > 0) {
      console.log('Available animation names:', names);
      console.log('Available actions:', Object.keys(actions));
    }
  }, [names, actions]);

  // Update animation mixer every frame - CRITICAL for animations to work
  useFrame((state, delta) => {
    if (mixer) {
      mixer.update(delta);
      
      // Debug: log animation state occasionally
      if (Math.random() < 0.01) { // Log ~1% of frames
        if (currentActionRef.current) {
          console.log('Animation state:', {
            isRunning: currentActionRef.current.isRunning(),
            paused: currentActionRef.current.paused,
            time: currentActionRef.current.time,
            loop: currentActionRef.current.loop
          });
        }
      }
    }
  });

  // Function to restart animation
  const restartAnimation = useCallback(() => {
    if (!actions || !names || names.length === 0) {
      console.log('No actions or names available for animation');
      return;
    }
    
    // Use the first available animation
    const actionName = names[0];
    const action = actions[actionName];
    
    if (!action) {
      console.warn('No animation action found. Available:', Object.keys(actions));
      return;
    }

    console.log('Starting animation:', actionName, 'Loop:', loop, 'Visible:', visible);

    // Stop current action if running
    if (currentActionRef.current && currentActionRef.current.isRunning()) {
      currentActionRef.current.stop();
    }

    // Reset and configure new action
    action.reset();
    if (loop) {
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.clampWhenFinished = false;
    } else {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
    }

    // Store reference to current action
    currentActionRef.current = action;

    // Play the action
    action.play();
    animationStartedRef.current = true;
    
    console.log('Animation started successfully');
  }, [actions, names, loop, visible]);

  // Simple animation control based on visibility
  useEffect(() => {
    if (visible && actions && names && names.length > 0) {
      // Only start if animation hasn't started or was stopped
      if (!animationStartedRef.current || !currentActionRef.current?.isRunning()) {
        const timer = setTimeout(() => {
          restartAnimation();
        }, 100);
        
        return () => clearTimeout(timer);
      }
    } else if (!visible) {
      // Don't stop animation when becoming invisible, just pause it
      if (currentActionRef.current && currentActionRef.current.isRunning()) {
        currentActionRef.current.paused = true;
        console.log('Animation paused due to visibility change');
      }
    }
  }, [visible, actions, names, restartAnimation]);

  // Resume animation when becoming visible again
  useEffect(() => {
    if (visible && currentActionRef.current && animationStartedRef.current) {
      if (currentActionRef.current.paused) {
        currentActionRef.current.paused = false;
        console.log('Animation resumed');
      }
    }
  }, [visible]);

  // Ensure animation keeps running
  useEffect(() => {
    if (visible && actions && names && names.length > 0 && currentActionRef.current) {
      // If animation is not running and not paused, restart it
      if (!currentActionRef.current.isRunning() && !currentActionRef.current.paused) {
        console.log('Animation stopped unexpectedly, restarting...');
        const timer = setTimeout(() => {
          restartAnimation();
        }, 100);
        
        return () => clearTimeout(timer);
      }
    }
  }, [visible, actions, names, restartAnimation]);

  // Debug animation state changes
  useEffect(() => {
    if (currentActionRef.current) {
      console.log('Animation state changed:', {
        isRunning: currentActionRef.current.isRunning(),
        paused: currentActionRef.current.paused,
        time: currentActionRef.current.time,
        visible: visible
      });
    }
  }, [visible]);

  // Handle onFinished callback for non-looping animations
  useEffect(() => {
    if (!mixer || loop) return;
    
    const done = () => onFinished && onFinished();
    mixer.addEventListener('finished', done);
    
    return () => {
      mixer.removeEventListener('finished', done);
    };
  }, [mixer, loop, onFinished]);

  // Don't render if not visible, model not loaded, or error occurred
  if (!visible || !modelData || error || !sceneRef.current) return null;

  return (
    <Center>
      <group ref={group} scale={scale}>
        <primitive object={sceneRef.current} />
      </group>
    </Center>
  );
}

export default function FlipCoin3D({ onFinished, scale = 2, loop = true, visible = true }) {
  // Memoize the Canvas to prevent unnecessary re-renders
  const canvasProps = useMemo(() => ({
    gl: { alpha: true, antialias: true },
    onCreated: ({ gl, scene }) => {
      gl.outputColorSpace = THREE.SRGBColorSpace;
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      scene.background = null;
    },
    style: { background: 'transparent' },
    camera: { position: [0, 0, 3], fov: 50 }
  }), []);

  return (
    <Canvas {...canvasProps}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <Suspense fallback={null}>
        <ModelPreloader />
        <Coin onFinished={onFinished} scale={scale} loop={loop} visible={visible} />
        <Environment preset="sunset" background={false} />
      </Suspense>
    </Canvas>
  );
}


