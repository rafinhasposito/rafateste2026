import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll, Environment, Float, Sphere, Torus, Stars } from '@react-three/drei';
import * as THREE from 'three';

// ----------------------------------------------------
// THE ASTROLABE PARTS (EXPLODABLE)
// ----------------------------------------------------

function CoreSun() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} position={[0, 0, 0]}>
      <meshStandardMaterial 
        color="#F2F8FB" 
        emissive="#3046B5" 
        emissiveIntensity={4} 
        toneMapped={false} 
      />
    </Sphere>
  );
}

function InnerRing() {
  const meshRef = useRef<THREE.Mesh>(null);
  const scroll = useScroll();

  useFrame(() => {
    if (!meshRef.current) return;
    // Explode outward on Z and Y axis based on scroll
    const zOffset = scroll.offset * 8; // Move towards camera
    const yOffset = scroll.offset * 2; // Move up slightly
    
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, zOffset, 0.1);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, yOffset, 0.1);
    
    meshRef.current.rotation.x = scroll.offset * Math.PI;
    meshRef.current.rotation.y += 0.005;
  });

  return (
    <Torus ref={meshRef} args={[1.5, 0.01, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
      <Sphere args={[0.05, 16, 16]} position={[1.5, 0, 0]}>
        <meshStandardMaterial color="#3046B5" emissive="#3046B5" emissiveIntensity={2} />
      </Sphere>
    </Torus>
  );
}

function MiddleRing() {
  const meshRef = useRef<THREE.Mesh>(null);
  const scroll = useScroll();

  useFrame(() => {
    if (!meshRef.current) return;
    const zOffset = scroll.offset * -6; // Move away from camera
    const xOffset = scroll.offset * -3; 
    
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, zOffset, 0.1);
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, xOffset, 0.1);
    
    meshRef.current.rotation.z -= 0.003;
    meshRef.current.rotation.y = scroll.offset * Math.PI;
  });

  return (
    <Torus ref={meshRef} args={[2.2, 0.005, 16, 100]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
      <meshStandardMaterial color="#ffffff" transparent opacity={0.4} />
      <Sphere args={[0.08, 16, 16]} position={[-2.2, 0, 0]}>
        <meshStandardMaterial color="#F2F8FB" emissive="#F2F8FB" emissiveIntensity={1.5} />
      </Sphere>
    </Torus>
  );
}

function OuterRing() {
  const meshRef = useRef<THREE.Mesh>(null);
  const scroll = useScroll();

  useFrame(() => {
    if (!meshRef.current) return;
    const zOffset = scroll.offset * 12; // Explodes far into the camera
    const yOffset = scroll.offset * -5; // Drops down
    
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, zOffset, 0.1);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, yOffset, 0.1);
    
    meshRef.current.rotation.x += 0.002;
    meshRef.current.rotation.z = scroll.offset * (Math.PI * 2);
  });

  return (
    <Torus ref={meshRef} args={[3, 0.02, 16, 100]} rotation={[0, Math.PI / 6, 0]}>
      <meshStandardMaterial color="#4D5565" transparent opacity={0.5} />
    </Torus>
  );
}

// ----------------------------------------------------
// SCENE COMPOSITION
// ----------------------------------------------------

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3046B5" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <group>
          <CoreSun />
          <InnerRing />
          <MiddleRing />
          <OuterRing />
        </group>
      </Float>

      <Environment preset="city" />
    </>
  );
}

// ----------------------------------------------------
// HTML OVERLAYS (Tied to Scroll)
// ----------------------------------------------------
function HtmlOverlays() {
  const scroll = useScroll();
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    if (titleRef.current) {
      // Fade out title as you scroll down
      const opacity = 1 - scroll.offset * 2;
      titleRef.current.style.opacity = Math.max(0, opacity).toString();
      titleRef.current.style.transform = `translateY(${scroll.offset * -100}px)`;
    }
    
    if (contentRef.current) {
      // Fade in bottom content when scrolled down
      const opacity = (scroll.offset - 0.5) * 2;
      contentRef.current.style.opacity = Math.max(0, Math.min(1, opacity)).toString();
      contentRef.current.style.transform = `translateY(${(1 - Math.max(0, opacity)) * 50}px)`;
      // Disable pointer events when invisible
      contentRef.current.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
    }
  });

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col font-ps-ui">
      {/* Scroll Page 1: Top Hero */}
      <div className="h-[100vh] w-full flex flex-col items-center justify-start pt-24 px-6 z-10" ref={titleRef}>
        <div className="w-8 h-8 mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white opacity-80">
             <path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10Z" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] text-center">
          Protocolo
          <br/>
          Solar
        </h1>
        <p className="mt-8 text-white/50 text-xs tracking-[0.3em] uppercase animate-pulse">
           Scroll para Desconstruir
        </p>
      </div>

      {/* Scroll Page 2: The Core Analysis */}
      <div className="h-[100vh] w-full flex flex-col justify-end pb-32 px-6 z-10" ref={contentRef}>
         <div className="max-w-md mx-auto w-full flex flex-col items-center">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md mb-6">
               <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#FFF] animate-pulse" />
               <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/80">Núcleo Desbloqueado</span>
            </div>

            <h2 className="text-3xl font-light text-white mb-4 text-center">
              Análise do seu <br/><span className="font-semibold text-glow-white">Próximo Ciclo</span>
            </h2>

            <button className="group relative w-full overflow-hidden rounded-full border border-white/30 bg-white/5 backdrop-blur-xl px-8 py-4 font-light text-xs uppercase tracking-[0.3em] text-white hover:bg-white/10 active:scale-[0.98] transition-all flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] pointer-events-auto">
              <span className="relative z-10 flex items-center gap-3">
                Iniciar Diagnóstico Real
                <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

         </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// MAIN EXPORT
// ----------------------------------------------------
export function Astrolabe3D() {
  return (
    <div className="w-full h-[100dvh] bg-[#000000]">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* ScrollControls determines how many "pages" of scroll there are */}
        <ScrollControls pages={2} damping={0.2}>
          <Scene />
          
          {/* Scroll.html allows tracking DOM elements alongside the 3D scroll */}
          <HtmlOverlays />
        </ScrollControls>
      </Canvas>
    </div>
  );
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
