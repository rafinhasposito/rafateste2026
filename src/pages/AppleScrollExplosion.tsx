import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useScroll, motion } from 'framer-motion';
import { Environment, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';

// An "Exploded View" astrolabe / planetary system using raw R3F and standard useScroll
const ExplodingAstrolabe = ({ scrollProgress }: { scrollProgress: any }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const midRingRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const particle1Ref = useRef<THREE.Mesh>(null);
  const particle2Ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    // Read the current scroll progress (0 to 1)
    const p = scrollProgress.get();
    
    // Core
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + p * 0.5);
    }
    
    // Inner Ring
    if (innerRingRef.current) {
      innerRingRef.current.position.z = p * 5;
      innerRingRef.current.rotation.x = p * (Math.PI / 2);
    }
    
    // Middle Ring
    if (midRingRef.current) {
      midRingRef.current.position.y = p * -3;
      midRingRef.current.position.z = p * 8;
      midRingRef.current.rotation.y = p * Math.PI;
    }
    
    // Outer Ring
    if (outerRingRef.current) {
      outerRingRef.current.position.y = p * 4;
      outerRingRef.current.position.z = p * 12;
      outerRingRef.current.rotation.z = p * (Math.PI * 2);
    }

    // Particles
    if (particle1Ref.current) {
      particle1Ref.current.position.x = 1.5 + p * 3.5;
      particle1Ref.current.position.y = 1.5 + p * 3.5;
      particle1Ref.current.position.z = p * 15;
    }

    if (particle2Ref.current) {
      particle2Ref.current.position.x = -2 - p * 4;
      particle2Ref.current.position.y = -1 - p * 2;
      particle2Ref.current.position.z = p * 10;
    }
  });

  return (
    <group>
      {/* Central Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          color="#ffdd00" 
          emissive="#ff8800" 
          emissiveIntensity={2}
          wireframe={true}
        />
      </mesh>

      {/* Inner Ring */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[2, 0.05, 16, 100]} />
        <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.2} />
      </mesh>
      
      {/* Middle Ring */}
      <mesh ref={midRingRef}>
        <torusGeometry args={[3, 0.02, 16, 100]} />
        <meshStandardMaterial color="#3046b5" metalness={0.8} roughness={0.1} emissive="#3046b5" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Outer Ring */}
      <mesh ref={outerRingRef} rotation-x={Math.PI / 4}>
        <torusGeometry args={[4.5, 0.08, 16, 100]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.3} />
      </mesh>
      
      {/* Floating Particles */}
      <mesh ref={particle1Ref}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
      </mesh>
      
      <mesh ref={particle2Ref}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#888888" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
};

export default function AppleScrollExplosion() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="relative w-full bg-[#000000] text-white selection:bg-white/30" style={{ height: '400vh' }}>
      
      {/* Fixed Canvas container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* UI Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center pointer-events-none">
          <motion.div 
            initial={{ opacity: 1 }}
            whileInView={{ opacity: 0 }}
            viewport={{ once: false, amount: 0.1, margin: "0px 0px -50% 0px" }}
            className="mt-32 text-center"
          >
            <h1 className="text-4xl font-light tracking-[0.4em] uppercase mb-4 text-white">O Astrolábio</h1>
            <p className="text-white/50 tracking-widest text-xs uppercase font-medium animate-pulse">Role para desconstruir</p>
          </motion.div>
          
          <div className="absolute bottom-32 text-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.8 }}
              className="max-w-md mx-auto"
            >
              <h2 className="text-2xl font-light tracking-[0.2em] mb-4 text-[#3046b5]">Engenharia de Precisão</h2>
              <p className="text-white/60 font-light text-sm leading-relaxed">
                Cada anel e planeta matematicamente alinhado com o seu destino. A perfeição que você exigiu, renderizada a 60 frames por segundo em tempo real.
              </p>
            </motion.div>
          </div>
        </div>

        {/* 3D Scene */}
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
          <directionalLight position={[-10, -10, -10]} intensity={1} color="#3046b5" />
          
          <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
          
          <Environment preset="night" />
          
          <ExplodingAstrolabe scrollProgress={scrollYProgress} />
        </Canvas>
      </div>
    </div>
  );
}
