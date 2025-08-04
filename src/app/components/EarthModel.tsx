"use client";

import { useGLTF } from "@react-three/drei";
import { JSX, Suspense } from "react";
function EarthGLTF(props: JSX.IntrinsicElements["group"]) {
  const { scene } = useGLTF("/earth.glb");
  return <primitive object={scene} {...props} />;
}

export function EarthModel(props: JSX.IntrinsicElements["group"]) {
  return (
    <Suspense
      fallback={
        <mesh>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      }
    >
      <EarthGLTF {...props} />
    </Suspense>
  );
}

useGLTF.preload("/earth.glb");
