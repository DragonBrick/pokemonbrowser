# Task 1 Report: Add height, weight, abilities, base_experience

## Commits
- `261bf75` — feat: add height, weight, abilities, base_experience to pokemon data

## Verification
- `node patch-pokemon.js` completed successfully — 1351 Pokémon patched, 0 failures
- Bulbasaur (id=1) data:
  ```json
  {"height":7,"weight":69,"abilities":["overgrow","chlorophyll"],"base_experience":64}
  ```
  (Plan expected single ability `["overgrow"]`, but API returns both — data is correct)

## Issues
- None. All fetches succeeded on first pass.
