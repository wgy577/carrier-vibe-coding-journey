# Repository guidance

This repository is a public Vibe Coding case study, not the private research
implementation.

## Public boundary

- Only the historical v1 and v2 source snapshots may be committed.
- Never add the final 3D Demo source, real deck export, MATLAB trajectories,
  GLB/EXR runtime assets, API keys, `.env` files, or Sites hosting metadata.
- The final Demo may appear only as a screenshot, public URL, and metadata API.
- Run `node scripts/check-open-source-boundary.mjs` before every commit.

## Verification

- v1: `cd versions/v1-initial && npm ci && npm test`
- v2: `cd versions/v2-compact && npm ci && npm test`
- Documentation links and media paths must remain relative where possible.

## Documentation

- Preserve the original private Sites commit hashes as provenance.
- Distinguish observed project history from recommended Harness practices.
- Do not claim that an exploratory or retrospective check happened earlier
  than it actually did.
