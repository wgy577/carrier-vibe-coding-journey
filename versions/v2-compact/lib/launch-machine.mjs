export const DURATIONS = Object.freeze({ preparing: 1, launching: 1.8, climbing: 4 });

export function clamp01(value) { return Math.max(0, Math.min(1, value)); }
export function smoothstep(value) { const t = clamp01(value); return t * t * (3 - 2 * t); }
export function easeInCubic(value) { const t = clamp01(value); return t * t * t; }

export function nextLaunchFrame(state, elapsed, delta) {
  if (!(state in DURATIONS)) return { state, elapsed: 0 };
  const nextElapsed = elapsed + Math.max(0, delta);
  const duration = DURATIONS[state];
  if (nextElapsed < duration) return { state, elapsed: nextElapsed };
  if (state === "preparing") return { state: "launching", elapsed: 0 };
  if (state === "launching") return { state: "climbing", elapsed: 0 };
  return { state: "finished", elapsed: 0 };
}

export function launchPose(state, elapsed) {
  const start = { x: -27, y: 0, z: 0, pitch: 0, glow: 0 };
  if (state === "preparing") {
    const p = clamp01(elapsed / DURATIONS.preparing);
    return { ...start, x: start.x + Math.sin(elapsed * 42) * 0.025, z: Math.sin(elapsed * 31) * 0.018, glow: smoothstep(p) };
  }
  if (state === "launching") {
    const p = clamp01(elapsed / DURATIONS.launching);
    return { x: start.x + 61 * easeInCubic(p), y: 0, z: 0, pitch: 0, glow: 1 };
  }
  if (state === "climbing" || state === "finished") {
    const p = state === "finished" ? 1 : clamp01(elapsed / DURATIONS.climbing);
    const e = smoothstep(p);
    return { x: 34 + 78 * e, y: 24 * e, z: 0, pitch: -Math.PI / 12 * e, glow: 1 - p * .55 };
  }
  return start;
}
