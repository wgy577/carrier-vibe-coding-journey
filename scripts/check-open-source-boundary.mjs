import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import process from "node:process";

const root = new URL("../", import.meta.url);
const forbiddenExtensions = new Set([".mat", ".glb", ".gltf", ".exr", ".hdr"]);
const ignoredDirectories = new Set([".git", "node_modules", "dist", ".next", ".vinext", ".wrangler"]);
const forbiddenNames = new Set(["hosting.json", ".env"]);
const allowedHistoricalMetadata = new Set([
  "versions/v1-initial/.openai/hosting.json",
  "versions/v2-compact/.openai/hosting.json",
]);
const forbiddenText = [
  "/Users/guangyuwu/",
  "git.chatgpt-team.site",
  "initialtraject/M7J5.mat",
  "systemtraject/J4M5.mat",
];

const failures = [];

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await visit(path);
      continue;
    }

    const display = relative(root.pathname, path);
    if (forbiddenExtensions.has(extname(entry.name).toLowerCase())) {
      failures.push(`${display}: forbidden binary/data extension`);
      continue;
    }
    if ((forbiddenNames.has(entry.name) || entry.name.startsWith(".env.")) && !allowedHistoricalMetadata.has(display)) {
      failures.push(`${display}: forbidden private configuration`);
      continue;
    }

    if (display === "scripts/check-open-source-boundary.mjs") continue;
    if ([".gif", ".mp4", ".png", ".jpg", ".jpeg", ".webp"].includes(extname(entry.name).toLowerCase())) continue;
    const text = await readFile(path, "utf8");
    for (const marker of forbiddenText) {
      if (text.includes(marker)) failures.push(`${display}: contains private marker ${marker}`);
    }
  }
}

await visit(root.pathname);

if (failures.length) {
  console.error("Open-source boundary check failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log("Open-source boundary check passed.");
