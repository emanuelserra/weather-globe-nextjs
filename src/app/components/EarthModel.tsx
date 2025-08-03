import { useGLTF } from "@react-three/drei";
import { JSX, useRef } from "react";
import * as THREE from "three";

export function EarthModel(props: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/earth.glb");

  return (
    <group ref={group} {...props}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/earth.glb");
