"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function wingGeometry() {
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    3,0,0,  -3,0,7,  -5,0,6,
    3,0,0,  -5,0,6,  -2,0,1.2,
    3,0,0,  -2,0,-1.2, -5,0,-6,
    3,0,0,  -5,0,-6, -3,0,-7,
  ]);
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function Wheel({ position, rotation=[0,0,0] }:{ position:[number,number,number]; rotation?:[number,number,number] }) {
  return <group position={position}>
    <mesh rotation={rotation} castShadow><cylinderGeometry args={[.22,.22,.16,10]}/><meshStandardMaterial color="#151b1f" roughness={.9}/></mesh>
    <mesh position={[0,.32,0]}><cylinderGeometry args={[.035,.035,.55,6]}/><meshStandardMaterial color="#77828a" metalness={.65}/></mesh>
  </group>;
}

export function Aircraft({ muted=false, engine="off" }:{ muted?:boolean; engine?:"off"|"warm"|"full" }) {
  const wings = useMemo(wingGeometry, []);
  const exhaust = useRef<THREE.Mesh>(null);
  const body = muted ? "#aab5bc" : "#d4dde2";
  useFrame(({clock}) => {
    if (!exhaust.current) return;
    const active=engine!=="off"; exhaust.current.visible=active;
    const pulse=engine==="warm" ? .72+Math.sin(clock.elapsedTime*13)*.12 : 1;
    exhaust.current.scale.set(1,1,pulse);
    const material=exhaust.current.material as THREE.MeshBasicMaterial;
    material.opacity=(engine==="warm"?.17:.3)*pulse;
  });
  return <group>
    <mesh geometry={wings} position={[-.3,1.18,0]} castShadow receiveShadow><meshStandardMaterial color={body} roughness={.58} metalness={.22} side={THREE.DoubleSide}/></mesh>
    <mesh position={[-.4,1.38,0]} rotation-z={-Math.PI/2} castShadow><cylinderGeometry args={[.72,.95,10.5,9]}/><meshStandardMaterial color={body} roughness={.5} metalness={.28} flatShading/></mesh>
    <mesh position={[5.35,1.38,0]} rotation-z={-Math.PI/2} castShadow><coneGeometry args={[.72,2.15,9]}/><meshStandardMaterial color="#dce4e8" roughness={.5} metalness={.25} flatShading/></mesh>
    <mesh position={[1.65,1.95,0]} scale={[1.9,.58,.72]} castShadow><sphereGeometry args={[1,12,7]}/><meshStandardMaterial color="#294452" roughness={.16} metalness={.62} flatShading/></mesh>
    <mesh position={[-4.65,1.34,0]} rotation-z={Math.PI/2}><cylinderGeometry args={[.58,.68,.5,10]}/><meshStandardMaterial color="#242c31" metalness={.72} roughness={.35}/></mesh>
    <mesh position={[-4.94,1.34,0]} rotation-y={Math.PI/2}><torusGeometry args={[.46,.09,6,12]}/><meshStandardMaterial color="#11171b" metalness={.7}/></mesh>
    <mesh ref={exhaust} position={[-5.65,1.34,0]} rotation-z={Math.PI/2} visible={false}>
      <coneGeometry args={[.5,2.5,12,1,true]}/><meshBasicMaterial color="#73cfe7" transparent opacity={.2} side={THREE.DoubleSide} depthWrite={false}/>
    </mesh>
    <mesh position={[-3.85,2.15,.78]} rotation-z={-.13} castShadow><boxGeometry args={[2.5,.12,1.05]}/><meshStandardMaterial color="#929ea5"/></mesh>
    <mesh position={[-3.85,2.15,-.78]} rotation-z={-.13} castShadow><boxGeometry args={[2.5,.12,1.05]}/><meshStandardMaterial color="#929ea5"/></mesh>
    <mesh position={[-4.15,2.22,0]} rotation-z={-.18} castShadow><boxGeometry args={[2.2,1.5,.12]}/><meshStandardMaterial color="#89969d"/></mesh>
    <Wheel position={[2.65,.22,0]} rotation={[Math.PI/2,0,0]}/>
    <Wheel position={[-2.35,.22,2.25]} rotation={[Math.PI/2,0,0]}/>
    <Wheel position={[-2.35,.22,-2.25]} rotation={[Math.PI/2,0,0]}/>
  </group>;
}
