import { Canvas, useLoader } from "@react-three/fiber";
import { Environment, OrbitControls, useAnimations } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense, useEffect, useRef } from "react";
import './FlipCoin.css';


const Model = ({ scale = 0.4 }) => {
  const group = useRef();
  const gltf = useLoader(GLTFLoader, "./video_game_coin/scene.gltf");
  const { actions, names } = useAnimations(gltf.animations, group);

  useEffect(() => {
    if (!actions || !names || names.length === 0) return;
    const action = actions['Action'] || actions[names[0]];
    action?.reset().play();
  }, [actions, names]);

  return (
    <>
      <primitive ref={group} object={gltf.scene} scale={scale} />
    </>
  );
};

const FlipCoin = ({ onFlipComplete, isFlipping = false, onClose }) => {
  return (
    <div className="App" style={{ width: '100%', height: '100%' }}>
      <Canvas
        gl={{ alpha: true }}
        style={{ background: 'transparent' }} // Nền trong suốt
        camera={{ position: [0, 0, 3], fov: 50 }}
      >
        {/* Xóa hoặc set transparent background color */}
        {/* <color attach="background" args={['transparent']} /> */}

        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />

        <Suspense fallback={null}>
          <Model scale={1} />
          <OrbitControls />
          <Environment preset="sunset" /> {/* Không dùng prop background */}
        </Suspense>
      </Canvas>
    </div>
  )
}


export default FlipCoin;