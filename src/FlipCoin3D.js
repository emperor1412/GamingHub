import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { useAnimations, Environment, Center } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

function Coin({ scale = 1, onFinished, loop = true }) {
  const group = useRef();
  // Use relative path for better compatibility
  const gltf = useLoader(GLTFLoader, './video_game_coin/scene.gltf');
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
    if (loop) {
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.clampWhenFinished = false;
    } else {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
    }

    const done = () => onFinished && onFinished();
    if (!loop) {
      mixer.addEventListener('finished', done);
    }
    action.play();

    return () => {
      if (!loop) mixer.removeEventListener('finished', done);
    };
  }, [actions, names, mixer, onFinished]);

  return (
    <Center>
      <group ref={group} scale={scale}>
        <primitive object={gltf.scene} />
      </group>
    </Center>
  );
}

export default function FlipCoin3D({ onFinished, scale = 2, loop = true }) {
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
        <Coin onFinished={onFinished} scale={scale} loop={loop} />
        <Environment preset="sunset" background={false} />
      </Suspense>
    </Canvas>
  );
}


