"use client";

import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

interface EarthModelProps {
  [key: string]: any;
}

export function EarthModel(props: EarthModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/earth.glb");

  return (
    <group ref={group} {...props}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/earth.glb");
