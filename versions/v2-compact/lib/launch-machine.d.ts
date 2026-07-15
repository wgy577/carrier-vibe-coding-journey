export type LaunchState = "loading" | "ready" | "preparing" | "launching" | "climbing" | "finished";
export const DURATIONS: Readonly<{ preparing: number; launching: number; climbing: number }>;
export function clamp01(value: number): number;
export function smoothstep(value: number): number;
export function easeInCubic(value: number): number;
export function nextLaunchFrame(state: LaunchState, elapsed: number, delta: number): { state: LaunchState; elapsed: number };
export function launchPose(state: LaunchState, elapsed: number): { x: number; y: number; z: number; pitch: number; glow: number };
