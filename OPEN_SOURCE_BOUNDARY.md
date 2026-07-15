# Open-source boundary

This repository intentionally separates a public learning record from a
private research implementation.

## Included

- Untouched v1 source snapshot from private Sites commit `bb0ce0d`.
- Untouched v2 source snapshot from private Sites commit `967375b`.
- Early GIF/MP4 experiments and one final screenshot.
- Prompt history, architectural commentary, checks, and documentation.

## Excluded

- Final carrier 3D Demo source code.
- Exact production deck export and its Python generator.
- MATLAB scheduling/trajectory files and converted path data.
- Aircraft, tractor, cloud GLBs and sky EXR.
- Environment secrets, API keys, private repository URLs, and credentials.

The historical Sites metadata committed inside v1/v2 is preserved because the
purpose of these directories is to show the prompt-only outputs exactly as they
were produced. It contains no repository write credential or API key.

The private final result is represented only by its public runtime interface:

- Demo: <https://wgy-carrier-operations-demo.wgy577-sortie.workers.dev/>
- API: <https://wgy-carrier-operations-demo.wgy577-sortie.workers.dev/api/demo>
