"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Aircraft } from "./models/Aircraft";
import { Deck } from "./models/Deck";
import { launchPose, nextLaunchFrame, type LaunchState } from "../lib/launch-machine.mjs";

type Props = { status: LaunchState; onStatusChange: (state: LaunchState) => void; onLoaded: () => void; resetToken: number };

function Ocean() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({clock}) => { if (ref.current) ref.current.position.y = -1.85 + Math.sin(clock.elapsedTime * .55) * .05; });
  return <mesh ref={ref} rotation-x={-Math.PI/2} position={[12,-1.85,0]} receiveShadow>
    <planeGeometry args={[230,150,24,16]}/><meshStandardMaterial color="#294a5c" roughness={.72} metalness={.15}/>
  </mesh>;
}

function LaunchRig({ status, onStatusChange, resetToken }:{ status:LaunchState; onStatusChange:(state:LaunchState)=>void; resetToken:number }) {
  const plane = useRef<THREE.Group>(null); const controls = useRef<OrbitControlsImpl>(null);
  const elapsed = useRef(0); const statusRef = useRef(status); const {camera} = useThree();
  const initialCamera = useRef(new THREE.Vector3(38,31,43)); const initialTarget = useRef(new THREE.Vector3(-3,1,0));
  useEffect(() => { statusRef.current=status; elapsed.current=0; }, [status]);
  useEffect(() => {
    elapsed.current=0; statusRef.current="ready";
    if(plane.current){plane.current.position.set(-27,.35,0);plane.current.rotation.set(0,0,0);}
    camera.position.copy(initialCamera.current); if(controls.current){controls.current.target.copy(initialTarget.current);controls.current.update();}
  }, [resetToken,camera]);
  useFrame((_,delta) => {
    const current=statusRef.current;
    if(current === "preparing" || current === "launching" || current === "climbing") {
      const frame=nextLaunchFrame(current,elapsed.current,Math.min(delta,.05)); elapsed.current=frame.elapsed;
      if(frame.state!==current){statusRef.current=frame.state;onStatusChange(frame.state);return;}
    }
    const pose=launchPose(statusRef.current,elapsed.current);
    if(plane.current){plane.current.position.set(pose.x,.35+pose.y,pose.z);plane.current.rotation.set(0,0,pose.pitch);}
    const active=statusRef.current==="preparing"||statusRef.current==="launching"||statusRef.current==="climbing";
    if(controls.current) controls.current.enabled=!active;
    if(active){
      const climb=statusRef.current==="climbing"; const desiredTarget=new THREE.Vector3(pose.x+(climb?10:6),pose.y+(climb?5:1),0);
      const desiredCamera=new THREE.Vector3(pose.x-(climb?22:27),pose.y+(climb?14:18),31);
      camera.position.lerp(desiredCamera,.035); controls.current?.target.lerp(desiredTarget,.05); controls.current?.update();
    }
  });
  const engine=status==="preparing"?"warm":status==="launching"||status==="climbing"?"full":"off";
  return <>
    <group ref={plane} position={[-27,.35,0]}><Aircraft engine={engine}/></group>
    <OrbitControls ref={controls} makeDefault target={[-3,1,0]} enableDamping dampingFactor={.08} minDistance={25} maxDistance={78} minPolarAngle={.35} maxPolarAngle={Math.PI/2-.08} minAzimuthAngle={-1.25} maxAzimuthAngle={1.25} screenSpacePanning={false}/>
  </>;
}

function Scene(props: Omit<Props,"onLoaded">) {
  return <>
    <color attach="background" args={["#8197a3"]}/><fog attach="fog" args={["#8297a1",65,155]}/>
    <Sky distance={300} sunPosition={[-80,25,-70]} turbidity={8} rayleigh={1.8} mieCoefficient={.025} mieDirectionalG={.6}/>
    <hemisphereLight args={["#aebfc8","#263743",1.55]}/><directionalLight position={[-25,42,30]} intensity={1.7} castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-55} shadow-camera-right={55} shadow-camera-top={45} shadow-camera-bottom={-45}/>
    <Ocean/><Deck/><LaunchRig {...props}/>
  </>;
}

export function CarrierDemo({onLoaded,...props}:Props) {
  return <div className="canvas-wrap"><Canvas shadows dpr={[1,1.55]} camera={{position:[38,31,43],fov:42,near:.1,far:350}} onCreated={onLoaded} gl={{antialias:true,powerPreference:"high-performance"}}>
    <Suspense fallback={null}><Scene {...props}/></Suspense>
  </Canvas></div>;
}
