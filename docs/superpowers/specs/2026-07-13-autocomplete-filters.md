# Autocomplete Filters & Mega/Gmax Removal

## Objective

1. Remove mega and gmax Pokemon entries from the dataset
2. Replace the plain-text "Move" filter in the Pokémon tab with an autocomplete dropdown
3. Replace the dual-`<select>` "Type" filter with a single autocomplete dropdown
4. Add a "Category" (damage_class) autocomplete filter in the Moves tab

## Changes

### 1. Remove Mega & G-Max

- **Runtime filter**: In `app.js` `recompute()`, skip entries where `p.id >= 10000` as a permanent built-in filter (not a user chip).
- **Remove Mega chip**: Delete `addChip('mega')`, the `'mega'` case in `chipLabel()`, the `type === 'mega'` branch in `recompute()`, the "Mega" button from the add-chip-menu, and the mega chip-edit template in `index.html`.
- **CSS**: Remove `.chip-mega` from `styles.css`.
- **Generator**: In `generate-data.js`, filter out any Pokémon with `id >= 10000` so future regenerations exclude them.

### 2. Autocomplete Input Pattern (shared)

Both the "Can learn" move filter and the Type filter use the same Alpine pattern inside a chip's edit mode:

- An `<input type="text">` bound to `chip.value` with `@input` that calls `filterSuggestions(chip)`.
- A `.autocomplete-dropdown` `<div>` positioned below the input, shown when `chip.showDropdown && chip.suggestions.length > 0`.
- Each suggestion is a clickable item; clicking it sets `chip.value` to the suggestion text and calls `commitChip(chip)`.
- `@click.outside` on the dropdown wrapper hides it.
- The dropdown source data:
  - **Move**: `this.moves` array (already computed), filtered by lowercase `includes(chip.value)`, capped at 20 results.
  - **Type**: `this.allTypes` array, filtered similarly.
  - **Category**: For the Moves tab category filter, the same pattern but source `['physical', 'special', 'status']`.

### 3. "Can learn ___" Filter (Pokémon tab)

- Keep the existing `type === 'move'` chip but upgrade its edit UI to use the autocomplete pattern.
- On suggestion click, the chip commits immediately. The ✓ button stays for when the user types a custom partial value manually.
- The chip label changes from `Knows {name}` to `Can learn {name}`.
- The filter logic stays as partial match (`p.moves.some(m => m.includes(chip.value))`) so both exact (dropdown click) and partial (manual + ✓) work.

### 4. Type Filter (Pokémon tab)

- Replace the two `<select>` elements with a single autocomplete input.
- `chip.types` array is replaced with a single `chip.value` string.
- The filter logic changes from:
  ```js
  const selected = c.types.filter(Boolean);
  selected.every((t) => p.types.includes(t));
  ```
  to:
  ```js
  p.types.includes(c.value)
  ```
- Single type per chip; multiple chips = OR across types.

### 5. Category Filter (Moves tab)

- New chip type `category` in the Moves tab.
- Add to `addMoveChip()`, the move chip label function, and the moves tab add-chip-menu.
- Edit UI: autocomplete with source `['physical', 'special', 'status']`.
- Filter logic: `m.damage_class === chip.value`.
- CSS for `.chip-category` — re-use `.chip-move` color or add a new one.

### 6. Fix Move Descriptions

- Switch from `flavor_text_entries[].flavor_text` to `effect_entries[].effect` in PokeAPI move data.
- The `effect` field uses professional language like "Raises the user's Attack by two stages." instead of old game text like "A dance that increases ATTACK."
- Clean up double spaces with `replace(/\s{2,}/g, ' ')`.
- Update `generate-data.js` for future runs, then run a one-time patch to update all existing descriptions in `moves-data.js`.

### 7. Files Modified

| File | Changes |
|------|---------|
| `app.js` | Remove mega filter, add autocomplete functions, update chip labels, add category chip support |
| `index.html` | Remove mega chip, add autocomplete dropdown templates, add category chip to moves tab |
| `styles.css` | Remove `.chip-mega`, add `.autocomplete-dropdown` styles, add `.chip-category` |
| `generate-data.js` | Skip Pokémon with `id >= 10000`, switch description to `effect_entries[].effect` |
| `moves-data.js` | Patch all move descriptions via PokeAPI `effect_entries` |
