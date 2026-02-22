"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, MeshDistortMaterial } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

interface FoodModel3DProps {
  itemId: string;
  itemName: string;
}

function FoodShape({ itemId }: { itemId: string }) {
  const geometry = itemId.includes("burger") || itemId.includes("steak")
    ? new THREE.BoxGeometry(2, 1.5, 2)
    : itemId.includes("pasta") || itemId.includes("sushi")
    ? new THREE.CylinderGeometry(1, 1.2, 1.5, 32)
    : new THREE.SphereGeometry(1.2, 32, 32);

  const color = getColorForItem(itemId);

  return (
    <mesh geometry={geometry} rotation={[0.5, 0.5, 0]}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.15}
        speed={1.2}
        roughness={0.35}
        metalness={0.08}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

function getColorForItem(itemId: string): string {
  if (itemId.includes("steak") || itemId.includes("wagyu")) return "#8B4513";
  if (itemId.includes("salad") || itemId.includes("arugula")) return "#90EE90";
  if (itemId.includes("pasta")) return "#FFD700";
  if (itemId.includes("sushi")) return "#FF6347";
  if (itemId.includes("lobster")) return "#FF4500";
  if (itemId.includes("wine") || itemId.includes("champagne")) return "#8B0000";
  if (itemId.includes("cocktail")) return "#FF69B4";
  if (itemId.includes("chocolate") || itemId.includes("souffle")) return "#654321";
  return "#FFA500";
}

export default function FoodModel3D({ itemId, itemName }: FoodModel3DProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full relative"
    >
      <Canvas
        camera={{
          position: [0, 0, 5.2],
          fov: 42,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#050505"]} />
        <Suspense fallback={null}>
          {/* Cinematic three-point lighting */}
          <ambientLight intensity={0.25} />
          <directionalLight
            position={[4, 6, 5]}
            intensity={1.4}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0001}
          />
          <directionalLight position={[-3, 2, 3]} intensity={0.35} />
          <pointLight position={[0, -2, 2]} intensity={0.4} color="#fff5e6" />
          <pointLight position={[-2, 4, -2]} intensity={0.2} color="#d4af37" />
          <spotLight
            position={[0, 8, 2]}
            angle={0.4}
            penumbra={0.6}
            intensity={0.5}
            color="#ffffff"
          />

          <FoodShape itemId={itemId} />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.6}
            minPolarAngle={Math.PI / 3.2}
            maxPolarAngle={Math.PI / 1.6}
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.4}
          />

          <Environment preset="studio" />
        </Suspense>
      </Canvas>
      {/* Subtle gradient overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0 gradient-veil-hero opacity-75"
        aria-hidden
      />
    </motion.div>
  );
}
