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

// Placeholder 3D model component - using a geometric shape with distortion
function FoodShape({ itemId }: { itemId: string }) {
  const geometry = itemId.includes("burger") || itemId.includes("steak")
    ? new THREE.BoxGeometry(2, 1.5, 2)
    : itemId.includes("pasta") || itemId.includes("sushi")
    ? new THREE.CylinderGeometry(1, 1.2, 1.5, 32)
    : new THREE.SphereGeometry(1.2, 32, 32);

  return (
    <mesh geometry={geometry} rotation={[0.5, 0.5, 0]}>
      <MeshDistortMaterial
        color={getColorForItem(itemId)}
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0.5}
        metalness={0.3}
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />
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
      className="w-full h-full"
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          <FoodShape itemId={itemId} />
          <OrbitControls
            enableZoom={false}
            autoRotate
            autoRotateSpeed={1}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
