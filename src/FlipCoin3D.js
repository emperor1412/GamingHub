import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { useAnimations } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

function Coin({ scale = 1, onFinished }) {
  const group = useRef();
  // Use absolute path because gltf is in public/
  const gltf = useLoader(GLTFLoader, '/video_game_coin/scene.gltf');
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
    <Canvas gl={{ alpha: true }} style={{ background: 'transparent' }} camera={{ position: [0, 0, 3], fov: 50 }}>
      <ambientLight intensity={0.8} />
      <Suspense fallback={null}>
        <Coin onFinished={onFinished} />
      </Suspense>
    </Canvas>
  );
}


