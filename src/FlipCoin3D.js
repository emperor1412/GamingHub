import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { useAnimations, Environment } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

function Coin({ scale = 1, onFinished }) {
  const group = useRef();
  // Use absolute path because gltf is in public/
  const gltf = useLoader(GLTFLoader, '/video_game_coin/scene.gltf');
  // Ensure materials use correct color space
  useEffect(() => {
    if (!gltf || !gltf.scene) return;
    gltf.scene.traverse((obj) => {
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
  }, [gltf]);
  const { actions, names, mixer } = useAnimations(gltf.animations, group);

  useEffect(() => {
    if (!actions || !names || names.length === 0) return;
    const clipName = actions['Action'] ? 'Action' : names[0];
    const action = actions[clipName];
    if (!action) return;

    action.reset();
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;

    const done = () => onFinished && onFinished();
    mixer.addEventListener('finished', done);
    action.play();

    return () => {
      mixer.removeEventListener('finished', done);
    };
  }, [actions, names, mixer, onFinished]);

  return <primitive ref={group} object={gltf.scene} scale={scale} />;
}

export default function FlipCoin3D({ onFinished }) {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl, scene }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        scene.background = null;
      }}
      style={{ background: 'transparent' }}
      camera={{ position: [0, 0, 3], fov: 50 }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <Suspense fallback={null}>
        <Coin onFinished={onFinished} />
        <Environment preset="sunset" background={false} />
      </Suspense>
    </Canvas>
  );
}


