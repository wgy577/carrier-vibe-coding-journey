# Repository guidance

This repository is a public Vibe Coding case study, not the private research
implementation.

## Public boundary

- Only the historical v1 and v2 source snapshots may be committed.
- `versions/v1-initial` must remain byte-for-byte equivalent to private Sites
  commit `bb0ce0d` (tree `130439ed91050cca8cb40f04242a45cea5531376`).
- `versions/v2-compact` must remain byte-for-byte equivalent to private Sites
  commit `967375b` (tree `3a71853b5482739c58c40949c134cf63626fc426`).
- Never add the final 3D Demo source, real deck export, MATLAB trajectories,
  GLB/EXR runtime assets, API keys, `.env` files, or private repository URLs.
- The two historical `.openai/hosting.json` files are part of the untouched
  snapshots. They contain project metadata, not source credentials.
- The final Demo may appear only as a screenshot, public URL, and metadata API.
- Run `node scripts/check-open-source-boundary.mjs` before every commit.

## Verification

- v1: `cd versions/v1-initial && npm ci && npm run build`
- v2: `cd versions/v2-compact && npm ci && npm test`
- Documentation links and media paths must remain relative where possible.

## Documentation

- Preserve the original private Sites commit hashes as provenance.
- Distinguish observed project history from recommended Harness practices.
- Do not claim that an exploratory or retrospective check happened earlier
  than it actually did.
