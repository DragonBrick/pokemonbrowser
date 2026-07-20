# Task 3 Report: Detail View Templates

**Commit:** `1d8a5b2c312328c4b9e00f76027c25cf0ff116dc`

## Changes Made

1. **Pokémon table rows** — Added `@dblclick="openPokemonDetail(p)"` to `<tr>` in the Pokémon table.
2. **Moves table rows** — Added `@dblclick="openMoveDetail(m)"` to `<tr>` in the Moves table.
3. **Pokémon detail template** — Inserted `<template x-if="showDetailView === 'pokemon'">` block after the Pokémon tab content, containing sprite, info, base stats (with stat bars), and move list.
4. **Move detail template** — Inserted `<template x-if="showDetailView === 'move'">` block after the Moves tab content, containing type/category badges, power/accuracy/PP/gen stats, description, and learned-by list.

## Summary

- `index.html` — 107 insertions, 2 deletions
- All templates reference Alpine.js component state (`showDetailView`, `detailItem`, `detailPokemonSearch`, `detailMoveSearch`) and methods (`openPokemonDetail`, `openMoveDetail`, `closeDetail`, `spriteUrl`, `onSpriteError`, `capitalize`, `formatHeight`, `formatWeight`, `statLabel`, `statBarWidth`, `statTotal`) expected in the existing `pokemonBrowser` component.
