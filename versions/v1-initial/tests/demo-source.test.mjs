import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

test("v1 keeps the original interactive scene controls", () => {
  assert.match(page, /全舰视角/);
  assert.match(page, /自动环绕/);
  assert.match(page, /动态海面/);
  assert.match(page, /重播弹射动画/);
});

test("v1 contains one active launch aircraft and a bounded orbit camera", () => {
  assert.match(page, /<Aircraft active launchKey=\{launchKey\}/);
  assert.match(page, /minDistance=\{45\}/);
  assert.match(page, /maxDistance=\{520\}/);
});
