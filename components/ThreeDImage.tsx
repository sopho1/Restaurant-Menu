"use client";

import { useRef, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { Image as DreiImage, Preload } from "@react-three/drei";
import * as THREE from "three";

function InteractiveImage({ src }: { src: string }) {
    const imageRef = useRef<any>(null);
    const { viewport } = useThree();

    useFrame((state) => {
        if (imageRef.current) {
            // Smooth tilt effect
            const tiltX = (state.pointer.x * Math.PI) / 10;
            const tiltY = -(state.pointer.y * Math.PI) / 10;

            imageRef.current.rotation.y = THREE.MathUtils.lerp(
                imageRef.current.rotation.y,
                tiltX,
                0.05
            );
            imageRef.current.rotation.x = THREE.MathUtils.lerp(
                imageRef.current.rotation.x,
                tiltY,
                0.05
            );

            // Parallax move
            imageRef.current.position.x = THREE.MathUtils.lerp(
                imageRef.current.position.x,
                state.pointer.x * 0.3,
                0.05
            );
            imageRef.current.position.y = THREE.MathUtils.lerp(
                imageRef.current.position.y,
                state.pointer.y * 0.3,
                0.05
            );
        }
    });

    return (
        <DreiImage
            ref={imageRef}
            url={src}
            transparent
            position={[0, 0, 0]}
            scale={[viewport.width * 1.3, viewport.height * 1.3]}
            // @ts-expect-error - 'cover' is valid for @react-three/drei Image but missing in types
            cover
        />
    );
}

export default function ThreeDImage({ src, alt }: { src: string; alt: string }) {
    return (
        <div className="w-full h-full relative overflow-hidden bg-black/60 group cursor-crosshair">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                dpr={[1, 2]}
            >
                <ambientLight intensity={1} />
                <Suspense fallback={null}>
                    <InteractiveImage src={src} />
                    <Preload all />
                </Suspense>
            </Canvas>
            {/* Gradient Overlay for premium feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/30 pointer-events-none transition-opacity duration-700 ease-in-out group-hover:opacity-70" />
        </div>
    );
}
