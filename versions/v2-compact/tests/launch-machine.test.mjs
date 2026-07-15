import test from "node:test";
import assert from "node:assert/strict";
import { DURATIONS, launchPose, nextLaunchFrame } from "../lib/launch-machine.mjs";

test("launch state sequence is deterministic", () => {
  assert.equal(nextLaunchFrame("ready",0,1).state,"ready");
  assert.equal(nextLaunchFrame("preparing",0,DURATIONS.preparing).state,"launching");
  assert.equal(nextLaunchFrame("launching",0,DURATIONS.launching).state,"climbing");
  assert.equal(nextLaunchFrame("climbing",0,DURATIONS.climbing).state,"finished");
});

test("aircraft accelerates on the rail without lateral drift", () => {
  const a=launchPose("launching",.2), b=launchPose("launching",1.2);
  assert.ok(b.x>a.x); assert.equal(a.z,0); assert.equal(b.z,0); assert.equal(a.pitch,0);
});

test("climb ends at a 15 degree pitch and positive altitude", () => {
  const end=launchPose("finished",0);
  assert.ok(end.y>20); assert.ok(Math.abs(end.pitch + Math.PI/12)<1e-9);
});

test("ready pose is a clean reset", () => {
  assert.deepEqual(launchPose("ready",99),{x:-27,y:0,z:0,pitch:0,glow:0});
});
