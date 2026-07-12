### Task 3 Report: Create app.js

**Status:** DONE

**Files changed:**
- Created: `app.js` (218 lines)

**What was implemented:**
- `Alpine.data('pokemonBrowser', ...)` component registered on `alpine:init`
- `init()` — loads from localStorage cache, then fetches `pokemon-data.json`, stores cache
- `recompute()` — filter-search-sort pipeline: name search, generation/stat/move chips, multi-key sorting with asc/desc
- `toggleSort(key)` — three-state cycle: asc → desc → reset to id/asc
- `addChip(type)`, `commitChip(chip)`, `removeChip(index)`, `chipLabel(chip)` — filter chip management
- `spriteUrl(id)`, `capitalize(str)`, `statTotal(p)`, `statLabel(key)` — display helpers
- `refreshFromApi()` — fetches all Pokémon from PokeAPI with progress display, triggers JSON download
- 13 column definitions for the data table

**Verification done:**
- Confirmed file content matches the task brief code exactly (218 lines)
- Passed `node -c app.js` syntax check (no errors)
- Confirmed `index.html` line 9 references `app.js` via `<script defer src="app.js">`

**Issues:** None
