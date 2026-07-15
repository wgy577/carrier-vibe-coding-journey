"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, OrbitControls, Sky, Sparkles } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const DECK: [number, number][] = [
  [0,52.88],[0,43.34],[3.354,20.44],[4.529,13.76],[16.27,13.76],[16.27,0],
  [237.18,0],[251.27,23.71],[332.12,28.62],[332.8,29.16],[332.8,52.33],
  [251.94,56.96],[215.54,78.5],[189.54,78.5],[164.05,71],[98.96,71],
  [89.23,76.59],[65.41,76.595],[58.87,75.09],[22.14,75.09],[22.14,56.01]
];

const PLANE: [number, number][] = [
  [7.4,0],[4.5,.8],[2.5,1.3],[0,1.4],[-1.5,4.8],[-3.5,4.8],[-4,2],
  [-6,2.5],[-7.5,2],[-7,1],[-8,0],[-7,-1],[-7.5,-2],[-6,-2.5],[-4,-2],
  [-3.5,-4.8],[-1.5,-4.8],[0,-1.4],[2.5,-1.3],[4.5,-.8]
];

type ViewName = "overview" | "catapult" | "bow";

function shapeFrom(points: [number, number][]) {
  const s = new THREE.Shape();
  points.forEach(([x,y], i) => i ? s.lineTo(x,y) : s.moveTo(x,y));
  s.closePath();
  return s;
}

function Ocean({ active }: { active: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.PlaneGeometry(1000, 620, 90, 55), []);
  useFrame(({ clock }) => {
    if (!active || !ref.current) return;
    const p = ref.current.geometry.attributes.position;
    const t = clock.elapsedTime;
    for (let i=0; i<p.count; i++) {
      const x=p.getX(i), y=p.getY(i);
      p.setZ(i, Math.sin(x*.035+t*1.1)*.7 + Math.cos(y*.055-t*.8)*.45);
    }
    p.needsUpdate=true;
    ref.current.geometry.computeVertexNormals();
  });
  return <mesh ref={ref} geometry={geo} rotation-x={-Math.PI/2} position={[165,-8,38]} receiveShadow>
    <meshPhysicalMaterial color="#0d5f89" roughness={.36} metalness={.08} transparent opacity={.94} clearcoat={.75}/>
  </mesh>;
}

function Aircraft({ position=[0,0,0], rotationY=0, scale=1, active=false, launchKey=0 }:{position?:[number,number,number],rotationY?:number,scale?:number,active?:boolean,launchKey?:number}) {
  const group=useRef<THREE.Group>(null);
  const progress=useRef(0);
  const trail=useRef<THREE.Mesh>(null);
  const geometry=useMemo(()=>new THREE.ExtrudeGeometry(shapeFrom(PLANE),{depth:.42,bevelEnabled:true,bevelSize:.14,bevelThickness:.12,bevelSegments:2}),[]);
  useEffect(()=>{progress.current=0;},[launchKey]);
  useFrame((_,delta)=>{
    if(!active||!group.current)return;
    progress.current=Math.min(6.2,progress.current+delta);
    const t=progress.current/6.2;
    let x=92,z=63,y=1.15,pitch=0;
    if(t<.18){const q=t/.18;x+=Math.sin(q*65)*.18;}
    else if(t<.72){const q=(t-.18)/.54;const a=q*q*xFactor(q);x=92+205*a;z=63+7*a;}
    else {const q=(t-.72)/.28;const e=q*q*(3-2*q);x=297+96*e;z=70+10*e;y=1.15+34*e;pitch=-.28*e;}
    group.current.position.set(x,y,z);group.current.rotation.set(0,-.04,pitch);
    if(trail.current){trail.current.visible=t>.24&&t<.91;trail.current.scale.x=.8+Math.max(0,(t-.25))*10;}
  });
  return <group ref={group} position={position} rotation-y={rotationY} scale={scale}>
    <mesh geometry={geometry} rotation-x={-Math.PI/2} castShadow receiveShadow>
      <meshStandardMaterial color={active?"#e9eef2":"#cbd4da"} metalness={.38} roughness={.43}/>
    </mesh>
    <mesh position={[2.5,.72,0]} scale={[2.2,.55,.62]} castShadow><sphereGeometry args={[1,18,10]}/><meshStandardMaterial color="#17384b" metalness={.65} roughness={.18}/></mesh>
    <mesh position={[-5.4,.95,1.35]} rotation-z={-.12}><boxGeometry args={[2.6,.18,1.1]}/><meshStandardMaterial color="#8f9aa3"/></mesh>
    <mesh position={[-5.4,.95,-1.35]} rotation-z={-.12}><boxGeometry args={[2.6,.18,1.1]}/><meshStandardMaterial color="#8f9aa3"/></mesh>
    {active&&<mesh ref={trail} position={[-13,.25,0]} rotation-z={-Math.PI/2}>
      <coneGeometry args={[1.5,14,20,1,true]}/><meshBasicMaterial color="#7edcff" transparent opacity={.16} side={THREE.DoubleSide}/>
    </mesh>}
  </group>;
}

function xFactor(q:number){return .58+.42*q;}

function Catapult({start,z,length}:{start:number,z:number,length:number}){
  return <group position-y={.55}>
    <mesh position={[start+length/2,0,z]}><boxGeometry args={[length,.18,.72]}/><meshStandardMaterial color="#75a6c6" metalness={.72} roughness={.25}/></mesh>
    <mesh position={[start+1,.35,z]}><boxGeometry args={[2.8,.7,2.1]}/><meshStandardMaterial color="#e1ae43" metalness={.45}/></mesh>
  </group>;
}

function Carrier() {
  const deckGeo=useMemo(()=>new THREE.ExtrudeGeometry(shapeFrom(DECK.map(([x,z])=>[x,-z])),{depth:2.2,bevelEnabled:true,bevelSize:.6,bevelThickness:.6,bevelSegments:2}),[]);
  return <group>
    <mesh position={[165,-2.8,38]} castShadow><boxGeometry args={[300,8,63]}/><meshStandardMaterial color="#26333b" metalness={.52} roughness={.55}/></mesh>
    <mesh geometry={deckGeo} rotation-x={-Math.PI/2} position-y={-1.8} castShadow receiveShadow><meshStandardMaterial color="#3e454b" metalness={.22} roughness={.78}/></mesh>
    {[63,52,42].map((z,i)=><Catapult key={z} start={[92,119,207][i]} z={z} length={[120,118,115][i]}/>) }
    <Line points={[[16,1.05,40],[324,1.05,40]]} color="#d9e0e3" lineWidth={1.15}/>
    <Line points={[[16,1.06,44],[324,1.06,44]]} color="#aeb9c1" lineWidth={.7} dashed dashSize={4} gapSize={3}/>
    <group position={[73,1,7]}>
      <mesh position={[0,5,0]} castShadow><boxGeometry args={[22,10,12]}/><meshStandardMaterial color="#9aa5ac" metalness={.3}/></mesh>
      <mesh position={[1,12,0]} castShadow><boxGeometry args={[15,4,9]}/><meshStandardMaterial color="#87949c"/></mesh>
      <mesh position={[1,21,0]}><cylinderGeometry args={[.8,1,15,12]}/><meshStandardMaterial color="#77848b"/></mesh>
      {[14,18,22].map(y=><mesh key={y} position={[1,y,0]}><boxGeometry args={[19,.35,.35]}/><meshStandardMaterial color="#b5c0c5"/></mesh>)}
    </group>
    <Aircraft position={[52,1.1,69]} rotationY={-Math.PI/2} scale={.8}/>
    <Aircraft position={[39,1.1,69]} rotationY={-Math.PI/2} scale={.8}/>
    <Aircraft position={[157,1.1,39]} rotationY={.22} scale={.8}/>
    <Aircraft position={[178,1.1,40]} rotationY={.22} scale={.8}/>
  </group>;
}

const cameraMap:Record<ViewName,{pos:[number,number,number],target:[number,number,number]}>= {
  overview:{pos:[238,205,228],target:[160,0,38]},
  catapult:{pos:[55,33,112],target:[165,4,62]},
  bow:{pos:[350,64,122],target:[285,5,52]},
};

function CameraRig({view,autoRotate}:{view:ViewName,autoRotate:boolean}){
  const {camera}=useThree(); const controls=useRef<OrbitControlsImpl>(null); const goal=useRef(view);
  useEffect(()=>{goal.current=view;},[view]);
  useFrame(()=>{const c=cameraMap[goal.current];camera.position.lerp(new THREE.Vector3(...c.pos),.055);controls.current?.target.lerp(new THREE.Vector3(...c.target),.055);controls.current?.update();});
  return <OrbitControls ref={controls} makeDefault enableDamping dampingFactor={.08} minDistance={45} maxDistance={520} maxPolarAngle={Math.PI*.49} autoRotate={autoRotate} autoRotateSpeed={.55}/>;
}

function Scene({view,autoRotate,waves,trajectory,launchKey}:{view:ViewName,autoRotate:boolean,waves:boolean,trajectory:boolean,launchKey:number}){
  return <>
    <color attach="background" args={["#a9d8ec"]}/><fog attach="fog" args={["#b8dceb",310,760]}/>
    <Sky distance={900} sunPosition={[-140,80,-220]} turbidity={3} rayleigh={1.1}/>
    <ambientLight intensity={1.3}/><directionalLight position={[-120,180,-80]} intensity={2.4} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-260} shadow-camera-right={260} shadow-camera-top={180} shadow-camera-bottom={-180}/>
    <Ocean active={waves}/><Carrier/><Aircraft active launchKey={launchKey}/>
    {trajectory&&(
      <Line points={[[92,2,63],[297,2,70],[345,18,76],[393,36,80]]} color="#53d9ff" lineWidth={2} dashed dashSize={3} gapSize={2}/>
    )}
    <Sparkles count={40} scale={[560,22,280]} position={[165,2,38]} size={1.4} speed={.18} color="#dff7ff" opacity={.28}/>
    <CameraRig view={view} autoRotate={autoRotate}/>
  </>;
}

export default function Home(){
  const [view,setView]=useState<ViewName>("overview"); const [autoRotate,setAutoRotate]=useState(false);
  const [waves,setWaves]=useState(true); const [trajectory,setTrajectory]=useState(true); const [launchKey,setLaunchKey]=useState(1);
  return <main>
    <header><div className="brand"><span className="mark">S</span><div><strong>SORTIE LAB</strong><small>Carrier Deck Digital Twin</small></div></div><div className="status"><i/> SIMULATION READY</div></header>
    <section className="stage">
      <Canvas shadows camera={{position:cameraMap.overview.pos,fov:42,near:.1,far:1400}} dpr={[1,1.7]}><Suspense fallback={null}><Scene view={view} autoRotate={autoRotate} waves={waves} trajectory={trajectory} launchKey={launchKey}/></Suspense></Canvas>
      <div className="hero"><p>INTERACTIVE 3D DEMO</p><h1>舰载机弹射<br/><span>三维演示平台</span></h1><div className="hint"><b>拖动</b> 旋转视角　 <b>滚轮</b> 缩放　 <b>右键</b> 平移</div></div>
      <div className="view-tabs"><button className={view==="overview"?"active":""} onClick={()=>setView("overview")}>01　全舰视角</button><button className={view==="catapult"?"active":""} onClick={()=>setView("catapult")}>02　弹射位</button><button className={view==="bow"?"active":""} onClick={()=>setView("bow")}>03　舰艏视角</button></div>
      <aside><span className="eyebrow">SCENE CONTROL</span><h2>场景控制</h2><Control label="自动环绕" value={autoRotate} set={setAutoRotate}/><Control label="动态海面" value={waves} set={setWaves}/><Control label="显示轨迹" value={trajectory} set={setTrajectory}/><button className="launch" onClick={()=>setLaunchKey(k=>k+1)}><span>▶</span> 重播弹射动画</button><div className="legend"><div><i className="blue"/>弹射轨道</div><div><i className="cyan"/>起飞轨迹</div><div><i className="white"/>执行飞机</div></div></aside>
      <div className="metrics"><div><small>CATAPULT</small><strong>C-01</strong></div><div><small>STATUS</small><strong className="green">ACTIVE</strong></div><div><small>RUNWAY</small><strong>120 m</strong></div><div><small>MODEL</small><strong>FJSP-DECK</strong></div></div>
    </section>
  </main>
}

function Control({label,value,set}:{label:string,value:boolean,set:(v:boolean)=>void}){return <button className="control" onClick={()=>set(!value)}><span>{label}</span><i className={value?"on":""}><b/></i></button>}
