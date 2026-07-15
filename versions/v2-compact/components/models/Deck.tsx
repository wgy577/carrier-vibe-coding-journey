"use client";

import { ContactShadows, Line } from "@react-three/drei";
import { Aircraft } from "./Aircraft";

function Tractor({ position, rotation=0 }:{ position:[number,number,number]; rotation?:number }) {
  return <group position={position} rotation-y={rotation}>
    <mesh position={[0,.56,0]} castShadow><boxGeometry args={[3,1,1.7]}/><meshStandardMaterial color="#d5a92c" roughness={.62}/></mesh>
    <mesh position={[1.25,1.1,0]} castShadow><boxGeometry args={[.8,.7,1.45]}/><meshStandardMaterial color="#e0bd48"/></mesh>
    {[-1,1].flatMap(x=>[-.78,.78].map(z=><mesh key={`${x}-${z}`} position={[x,.2,z]} rotation-x={Math.PI/2} castShadow><cylinderGeometry args={[.28,.28,.3,10]}/><meshStandardMaterial color="#1b2023"/></mesh>))}
  </group>;
}

function Equipment({ position }:{ position:[number,number,number] }) {
  return <group position={position}>
    <mesh position={[0,.7,0]} castShadow><boxGeometry args={[1.5,1.4,1.2]}/><meshStandardMaterial color="#65727a" roughness={.8}/></mesh>
    <mesh position={[0,1.55,0]}><cylinderGeometry args={[.08,.08,.6,6]}/><meshStandardMaterial color="#98a4aa"/></mesh>
    <mesh position={[0,1.95,0]}><sphereGeometry args={[.14,8,6]}/><meshStandardMaterial color="#e8bc54" emissive="#d38d24" emissiveIntensity={.35}/></mesh>
  </group>;
}

export function Deck() {
  return <group>
    <mesh position={[-3,-1.1,0]} receiveShadow castShadow><boxGeometry args={[82,2.7,34]}/><meshStandardMaterial color="#3b454d" roughness={.83} metalness={.12}/></mesh>
    <mesh position={[38,-.75,0]} rotation-y={Math.PI/4} receiveShadow><boxGeometry args={[12,2,24]}/><meshStandardMaterial color="#3b454d" roughness={.83}/></mesh>
    <mesh position={[-1,.31,0]} receiveShadow><boxGeometry args={[68,.08,.62]}/><meshStandardMaterial color="#91adbd" metalness={.7} roughness={.25}/></mesh>
    <mesh position={[-27,.5,0]} castShadow><boxGeometry args={[2.2,.35,1.6]}/><meshStandardMaterial color="#d3a93b" metalness={.3}/></mesh>
    <Line points={[[-38,.38,-3],[35,.38,-3]]} color="#dbe2e5" lineWidth={1.4}/>
    <Line points={[[-38,.38,3],[35,.38,3]]} color="#dbe2e5" lineWidth={1.4}/>
    <Line points={[[-28,.39,0],[35,.39,0]]} color="#7db6cf" lineWidth={1.1}/>
    <Line points={[[8,.4,-16],[8,.4,16]]} color="#d6bd57" lineWidth={1}/>
    <mesh position={[-9,.39,-10]}><boxGeometry args={[17,.04,.25]}/><meshBasicMaterial color="#aab6bc"/></mesh>
    <mesh position={[-9,.39,-15]}><boxGeometry args={[17,.04,.25]}/><meshBasicMaterial color="#aab6bc"/></mesh>
    <group position={[-16,.34,-10]} rotation-y={-.22} scale={.72}><Aircraft muted/></group>
    <group position={[-2,.34,-12]} rotation-y={-.15} scale={.72}><Aircraft muted/></group>
    <group position={[15,.34,-11]} rotation-y={.12} scale={.72}><Aircraft muted/></group>
    <group position={[-28,.34,10]} rotation-y={.12} scale={.74}><Aircraft muted/></group>
    <Tractor position={[-8,.35,10]} rotation={-.12}/><Tractor position={[6,.35,12]} rotation={.15}/>
    <Equipment position={[15,.35,11]}/><Equipment position={[19,.35,12.5]}/><Equipment position={[-35,.35,-4]}/>
    <mesh position={[26,.7,-13]} castShadow><boxGeometry args={[6,.7,3]}/><meshStandardMaterial color="#57636a"/></mesh>
    <ContactShadows position={[0,.36,0]} scale={85} opacity={.45} blur={1.8} far={10}/>
  </group>;
}
