# Pokémon Browser — Design Spec

## Overview

A self-contained Pokémon browser app: filter, sort, and browse all Pokémon in a table. Built as a few static files (HTML + JS + CSS + JSON), openable by double-clicking `index.html`.

## Architecture

### File Structure

```
pokemon-browser/
├── index.html          ← Entry point (double-click to open)
├── app.js              ← Alpine.js application logic
├── pokemon-data.json   ← Bundled Pokémon dataset
└── styles.css          ← All styling, dark theme
```

### Tech Stack

- **Alpine.js** (CDN) — reactive state management, declarative DOM
- **Vanilla JS** — PokeAPI fetching, data processing
- **Plain CSS** — dark-themed styling, no framework

### Data Flow

1. `index.html` loads `pokemon-data.json` via `fetch()` on init
2. Raw dataset stored in Alpine state: `pokemon[]`
3. Derived `filtered[]` getter applies all active chips AND-ed together + text search
4. Table renders `filtered[]` sorted by `sortKey`/`sortDir`
5. Any state change triggers reactive re-render

### Alpine State Shape

```js
{
  pokemon: [],           // raw full dataset
  chips: [],             // active filter chips (array)
  search: "",            // text search string
  sortKey: "id",         // current sort column
  sortDir: "asc",        // "asc" | "desc"
  loading: false,        // PokeAPI fetch in progress
  progress: "",          // fetch progress message
  
  get filtered() {       // computed: apply chips AND-ed + search + sort
    // ...
  }
}
```

## Filter Chip System

Each chip is an object with a `type` field and type-specific fields:

| Type | Fields | Display |
|------|--------|---------|
| `generation` | `value: 1-9` | "Gen 2" |
| `stat` | `stat: string`, `operator: ">" / "<"`, `value: number` | "Speed > 100" |
| `move` | `value: string` | "Knows Thunderbolt" |

### Chip Behaviors

- **Add:** A "+ Add Filter" dropdown lets the user pick chip type. A new chip spawns in editing mode.
- **Edit:** Click any chip to expand it inline with type-appropriate inputs (stat dropdown, operator toggle, number/move name input). Click away or press Enter to commit.
- **Remove:** Each chip has an × button.
- **Logic:** All chips are AND-ed. A Pokémon must pass every active chip to appear in results.
- **Multiple same-type chips:** Fully supported (e.g., two "generation" chips for Gen 1 + Gen 2).

## Table

### Columns

| Column | Sortable | Notes |
|--------|----------|-------|
| # | Yes | National dex number |
| Sprite | No | Small sprite from PokeAPI CDN |
| Name | Yes | Default sort |
| Types | No | Colored type badges |
| HP | Yes | |
| Attack | Yes | |
| Defense | Yes | |
| Sp. Atk | Yes | |
| Sp. Def | Yes | |
| Speed | Yes | |
| Total | Yes | Sum of all base stats |
| Generation | Yes | Roman numeral or number |
| Moves | No | Count of learnable moves |

### Sorting

- Click header: sort ascending → descending → remove (back to dex #)
- Arrow indicator shows current sort column/direction (▲/▼)
- Default: sorted by national dex # ascending

### Text Search

- Search bar above table filters by Pokémon name (case-insensitive, substring match)
- Combined with chip filters via AND

## Refresh from PokeAPI

- "Refresh" button in the top bar
- Shows progress ("Fetching Gen 3/9...")
- Fetches all Pokémon species + movepools from PokeAPI
- On completion: saves data in-memory and triggers a JSON file download (browsers can't write to disk directly — user saves the downloaded file over `pokemon-data.json`)

## Layout

```
┌──────────────────────────────────────────────────┐
│  Pokémon Browser                    [Refresh] 🔄  │
│  [🔍 Search by name...]                           │
│  [+ Add Filter ▼]  [Gen 2 ×] [Speed > 100 ×]     │
├──────────────────────────────────────────────────┤
│  # │ Sprite │ Name ▲ │ Types │ HP │ Atk │ ...    │
│  1 │  🟢    │ Bulba  │ Grass │ 45 │  49 │ ...    │
│  2 │  🟢    │ Ivy    │ Grass │ 60 │  62 │ ...    │
│  ...                                              │
│            Showing 151 of 1025 Pokémon            │
└──────────────────────────────────────────────────┘
```

## Styling

- Dark theme background (#1a1a2e or similar)
- Table rows with alternating subtle background
- Type badges: colored by type (e.g., Fire=red, Water=blue, Grass=green)
- Filter chips: colored borders by type (green=generation, blue=stat, purple=move)
- Chip editing: subtle popover/tooltip style inline expansion
- Responsive: horizontal scroll on table for narrow screens

## Non-Goals

- No persistence (filters reset on reload)
- No team builder, no battle simulator
- No animations beyond basic CSS transitions
- No server/backend — purely static files
