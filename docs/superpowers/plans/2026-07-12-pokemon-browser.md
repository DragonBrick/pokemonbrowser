# Pokémon Browser Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Pokémon browser — a single-page app with filterable, sortable table of all Pokémon, openable by double-clicking index.html.

**Architecture:** Static files (HTML + CSS + JS + JSON). Alpine.js for reactive UI. Filter chips (generation/stat/move) AND-ed together. Sortable table columns. PokeAPI refresh button.

**Tech Stack:** HTML5, CSS3 (dark theme, custom properties), Alpine.js 3.x (CDN), vanilla JS, Node.js (for initial data generation only).

## Global Constraints

- All files in a single directory; open by double-clicking `index.html`
- No build step, no server required for runtime
- Dark theme: background `#0f0f1a`, surface `#1a1a2e`
- Type badge colors match Pokémon type colors
- Filter chips bordered by type: green=generation, blue=stat, purple=move
- No persistence (filters reset on reload)
- Responsive: horizontal scroll on table for narrow screens

---

### Task 1: Generate pokemon-data.json

**Files:**
- Create: `generate-data.js`
- Create: `pokemon-data.json` (output)

**Interfaces:**
- Produces: `pokemon-data.json` — array of objects with shape:
  ```ts
  { id: number, name: string, types: string[], stats: { hp: number, attack: number, defense: number, "special-attack": number, "special-defense": number, speed: number }, generation: number, moves: string[] }
  ```

- [ ] **Step 1: Write generate-data.js**

```js
const https = require('https');
const fs = require('fs');

const STAT_NAMES = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'PokemonBrowser/1.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) resolve(JSON.parse(data));
        else reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      });
    }).on('error', reject);
  });
}

function generationForId(id) {
  if (id <= 151) return 1;
  if (id <= 251) return 2;
  if (id <= 386) return 3;
  if (id <= 493) return 4;
  if (id <= 649) return 5;
  if (id <= 721) return 6;
  if (id <= 809) return 7;
  if (id <= 905) return 8;
  return 9;
}

async function main() {
  console.log('Fetching Pokémon list...');
  const listRes = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000');
  const total = listRes.results.length;
  console.log(`Found ${total} Pokémon`);

  const pokemon = [];
  for (let i = 0; i < total; i++) {
    const entry = listRes.results[i];
    const id = i + 1;
    try {
      console.log(`  [${id}/${total}] ${entry.name}...`);
      const detail = await fetch(entry.url);
      const types = detail.types.map((t) => t.type.name);
      const stats = {};
      STAT_NAMES.forEach((name) => {
        const s = detail.stats.find((st) => st.stat.name === name);
        stats[name] = s ? s.base_stat : 0;
      });
      const moves = detail.moves.map((m) => m.move.name);
      pokemon.push({
        id,
        name: entry.name,
        types,
        stats,
        generation: generationForId(id),
        moves,
      });
    } catch (e) {
      console.error(`  Failed for ${entry.name}: ${e.message}`);
    }
  }

  fs.writeFileSync('pokemon-data.json', JSON.stringify(pokemon, null, 2));
  console.log(`\nDone! Saved ${pokemon.length} Pokémon to pokemon-data.json`);
}

main().catch(console.error);
```

- [ ] **Step 2: Run the script to generate data**

```powershell
node generate-data.js
```

Expected: Downloads all Pokémon from PokeAPI (takes several minutes). Creates `pokemon-data.json` with 1000+ entries.

- [ ] **Step 3: Verify output**

```powershell
node -e "const d = require('./pokemon-data.json'); console.log(`Entries: ${d.length}, First: ${d[0].name}, Last: ${d[d.length-1].name}`)"
```

Expected: `Entries: 1000+, First: bulbasaur, Last: <latest pokemon>`

---

### Task 2: Create index.html shell + styles.css

**Files:**
- Create: `index.html`
- Create: `styles.css`

**Interfaces:**
- Consumes: `pokemon-data.json` (from Task 1)
- Produces: Page structure with Alpine.js CDN, dark-themed layout, table headers, search bar, chip bar placeholder

- [ ] **Step 1: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pokémon Browser</title>
  <link rel="stylesheet" href="styles.css">
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.9/dist/cdn.min.js"></script>
  <script defer src="app.js"></script>
</head>
<body>
  <div x-data="pokemonBrowser" class="app">
    <header class="header">
      <h1 class="title">Pokémon Browser</h1>
      <div class="header-actions">
        <span class="result-count" x-text="`${pokemon.length} Pokémon loaded`"></span>
        <button class="btn btn-refresh" @click="refreshFromApi" :disabled="loading" x-text="loading ? progress : '↻ Refresh from PokeAPI'"></button>
      </div>
    </header>

    <div class="controls">
      <input type="text" class="search-input" placeholder="Search by name..." x-model="search" @input="recompute()">

      <div class="chip-bar">
        <div class="add-chip-wrapper">
          <button class="chip chip-add" @click="showAddMenu = !showAddMenu">+ Add Filter</button>
          <div class="add-chip-menu" x-show="showAddMenu" @click.outside="showAddMenu = false">
            <button @click="addChip('generation'); showAddMenu = false">Generation</button>
            <button @click="addChip('stat'); showAddMenu = false">Stat</button>
            <button @click="addChip('move'); showAddMenu = false">Move</button>
          </div>
        </div>

        <template x-for="(chip, i) in chips" :key="i">
          <div class="chip" :class="'chip-' + chip.type" @click.stop>
            <template x-if="!chip.editing">
              <span class="chip-text" @click="chip.editing = true" x-text="chipLabel(chip)"></span>
            </template>
            <template x-if="chip.editing">
              <div class="chip-edit">
                <template x-if="chip.type === 'generation'">
                  <select x-model="chip.value" @change="commitChip(chip)">
                    <option value="1">Gen 1</option>
                    <option value="2">Gen 2</option>
                    <option value="3">Gen 3</option>
                    <option value="4">Gen 4</option>
                    <option value="5">Gen 5</option>
                    <option value="6">Gen 6</option>
                    <option value="7">Gen 7</option>
                    <option value="8">Gen 8</option>
                    <option value="9">Gen 9</option>
                  </select>
                </template>
                <template x-if="chip.type === 'stat'">
                  <span class="chip-edit-row">
                    <select x-model="chip.stat">
                      <option value="hp">HP</option>
                      <option value="attack">Attack</option>
                      <option value="defense">Defense</option>
                      <option value="special-attack">Sp.Atk</option>
                      <option value="special-defense">Sp.Def</option>
                      <option value="speed">Speed</option>
                    </select>
                    <select x-model="chip.operator">
                      <option value=">">&gt;</option>
                      <option value="<">&lt;</option>
                    </select>
                    <input type="number" x-model="chip.value" placeholder="0" min="0" max="255" @keyup.enter="commitChip(chip)">
                  </span>
                </template>
                <template x-if="chip.type === 'move'">
                  <input type="text" x-model="chip.value" placeholder="Move name..." @keyup.enter="commitChip(chip)">
                </template>
                <button class="chip-commit" @click="commitChip(chip)">✓</button>
              </div>
            </template>
            <button class="chip-remove" @click="removeChip(i)">&times;</button>
          </div>
        </template>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="poke-table">
        <thead>
          <tr>
            <template x-for="col in columns" :key="col.key">
              <th :class="{ sortable: col.sortable, sorted: sortKey === col.key }" @click="col.sortable && toggleSort(col.key)">
                <span x-text="col.label"></span>
                <span class="sort-arrow" x-show="sortKey === col.key" x-text="sortDir === 'asc' ? '▲' : '▼'"></span>
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <template x-for="p in filteredPokemon" :key="p.id">
            <tr>
              <td x-text="p.id" class="col-id"></td>
              <td class="col-sprite"><img :src="spriteUrl(p.id)" :alt="p.name" loading="lazy" width="40" height="40"></td>
              <td class="col-name" x-text="capitalize(p.name)"></td>
              <td class="col-types">
                <span x-for="t in p.types" :key="t" class="type-badge" :class="'type-' + t" x-text="capitalize(t)"></span>
              </td>
              <td class="col-stat" x-text="p.stats.hp"></td>
              <td class="col-stat" x-text="p.stats.attack"></td>
              <td class="col-stat" x-text="p.stats.defense"></td>
              <td class="col-stat" x-text="p.stats['special-attack']"></td>
              <td class="col-stat" x-text="p.stats['special-defense']"></td>
              <td class="col-stat" x-text="p.stats.speed"></td>
              <td class="col-stat col-total" x-text="statTotal(p)"></td>
              <td class="col-gen" x-text="p.generation"></td>
              <td class="col-moves" x-text="p.moves.length"></td>
            </tr>
          </template>
        </tbody>
      </table>
      <div class="no-results" x-show="filteredPokemon.length === 0 && pokemon.length > 0">
        No Pokémon match your filters.
      </div>
    </div>

    <footer class="footer">
      Showing <strong x-text="filteredPokemon.length"></strong> of <strong x-text="pokemon.length"></strong> Pokémon
    </footer>
  </div>
</body>
</html>
```

- [ ] **Step 2: Create styles.css**

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0f0f1a;
  --surface: #1a1a2e;
  --surface2: #16213e;
  --text: #e0e0e0;
  --text-dim: #888;
  --border: #2a2a4a;
  --accent: #7c3aed;
  --accent-hover: #6d28d9;
  --chip-gen: #22c55e;
  --chip-stat: #3b82f6;
  --chip-move: #a855f7;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

.app { max-width: 1400px; margin: 0 auto; padding: 20px; }

/* Header */
.header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 16px; flex-wrap: wrap; gap: 12px;
}
.title { font-size: 1.6rem; font-weight: 700; }
.header-actions { display: flex; align-items: center; gap: 12px; }
.result-count { font-size: 0.85rem; color: var(--text-dim); }

.btn {
  padding: 8px 16px; border: none; border-radius: 6px;
  cursor: pointer; font-size: 0.85rem; font-weight: 600;
  transition: background 0.15s;
}
.btn-refresh {
  background: var(--accent); color: #fff;
}
.btn-refresh:hover { background: var(--accent-hover); }
.btn-refresh:disabled { opacity: 0.6; cursor: not-allowed; }

/* Controls */
.controls {
  display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;
}

.search-input {
  width: 100%; max-width: 400px; padding: 8px 14px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 8px; color: var(--text); font-size: 0.9rem;
  outline: none; transition: border-color 0.15s;
}
.search-input:focus { border-color: var(--accent); }
.search-input::placeholder { color: var(--text-dim); }

/* Chip Bar */
.chip-bar {
  display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
}

.add-chip-wrapper { position: relative; }
.add-chip-menu {
  position: absolute; top: 100%; left: 0; margin-top: 4px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 8px; padding: 4px; z-index: 10; min-width: 140px;
}
.add-chip-menu button {
  display: block; width: 100%; padding: 8px 12px;
  background: none; border: none; color: var(--text);
  text-align: left; cursor: pointer; font-size: 0.85rem; border-radius: 4px;
}
.add-chip-menu button:hover { background: var(--surface2); }

.chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 10px; border-radius: 20px;
  background: var(--surface); border: 2px solid var(--border);
  font-size: 0.8rem; cursor: pointer; transition: border-color 0.15s;
}
.chip-add { border-style: dashed; color: var(--text-dim); }
.chip-add:hover { border-color: var(--accent); color: var(--text); }
.chip-gen { border-color: var(--chip-gen); }
.chip-stat { border-color: var(--chip-stat); }
.chip-move { border-color: var(--chip-move); }
.chip-text { cursor: pointer; }
.chip-remove {
  background: none; border: none; color: var(--text-dim);
  cursor: pointer; font-size: 1rem; line-height: 1; padding: 0 2px;
  transition: color 0.15s;
}
.chip-remove:hover { color: #ef4444; }

.chip-edit {
  display: flex; align-items: center; gap: 4px; flex-wrap: wrap;
}
.chip-edit select, .chip-edit input {
  background: var(--surface2); border: 1px solid var(--border);
  color: var(--text); padding: 3px 6px; border-radius: 4px;
  font-size: 0.75rem; outline: none;
}
.chip-edit input[type="number"] { width: 60px; }
.chip-edit input[type="text"] { width: 110px; }
.chip-edit select { max-width: 90px; }
.chip-edit-row { display: flex; gap: 4px; align-items: center; }
.chip-commit {
  background: var(--accent); color: #fff; border: none;
  padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 0.75rem;
}

/* Table */
.table-wrapper { overflow-x: auto; border-radius: 10px; border: 1px solid var(--border); }

.poke-table {
  width: 100%; border-collapse: collapse; font-size: 0.85rem;
}
.poke-table thead {
  background: var(--surface); position: sticky; top: 0; z-index: 2;
}
.poke-table th {
  padding: 10px 8px; text-align: left; font-weight: 600;
  color: var(--text-dim); white-space: nowrap; user-select: none;
  border-bottom: 2px solid var(--border);
}
.poke-table th.sortable { cursor: pointer; transition: color 0.15s; }
.poke-table th.sortable:hover { color: var(--text); }
.poke-table th.sorted { color: var(--accent); }
.sort-arrow { font-size: 0.65rem; margin-left: 2px; }

.poke-table td {
  padding: 8px; border-bottom: 1px solid var(--border); white-space: nowrap;
}
.poke-table tbody tr { transition: background 0.1s; }
.poke-table tbody tr:nth-child(even) { background: rgba(255,255,255,0.02); }
.poke-table tbody tr:hover { background: rgba(124,58,237,0.08); }

.col-id { color: var(--text-dim); font-size: 0.8rem; width: 40px; }
.col-sprite { width: 48px; text-align: center; }
.col-sprite img { display: block; image-rendering: pixelated; }
.col-name { font-weight: 600; text-transform: capitalize; }
.col-stat { text-align: right; width: 60px; font-variant-numeric: tabular-nums; }
.col-total { font-weight: 700; }
.col-gen { text-align: center; width: 50px; }
.col-moves { text-align: right; color: var(--text-dim); width: 50px; }
.col-types { display: flex; gap: 4px; }

.type-badge {
  display: inline-block; padding: 2px 10px; border-radius: 12px;
  font-size: 0.75rem; font-weight: 600; text-transform: capitalize;
  color: #fff;
}
.type-normal { background: #9fa19f; }
.type-fire { background: #e25822; }
.type-water { background: #5599ca; }
.type-electric { background: #f2c94c; color: #000; }
.type-grass { background: #5f9f3c; }
.type-ice { background: #87ceeb; color: #000; }
.type-fighting { background: #c02d28; }
.type-poison { background: #9b4dca; }
.type-ground { background: #d9b75c; }
.type-flying { background: #a4b0e7; color: #000; }
.type-psychic { background: #f95587; }
.type-bug { background: #9bb13b; }
.type-rock { background: #b09f5b; }
.type-ghost { background: #6f5395; }
.type-dragon { background: #536fce; }
.type-dark { background: #5a5660; }
.type-steel { background: #8b8ea4; }
.type-fairy { background: #f0a3c4; color: #000; }

/* No results */
.no-results {
  text-align: center; padding: 60px 20px; color: var(--text-dim); font-size: 1.1rem;
}

/* Footer */
.footer {
  text-align: center; padding: 16px 0; color: var(--text-dim); font-size: 0.85rem;
}
.footer strong { color: var(--text); }
```

- [ ] **Step 3: Verify**

Open `index.html` in a browser. You should see the dark-themed shell with header, search bar, "+ Add Filter" button, empty table with headers, and footer showing "0 of 0 Pokémon". Console may show a 404 for `pokemon-data.json` — that's expected until Task 3.

---

### Task 3: Create app.js — data loading + table + filters + sort + refresh

**Files:**
- Create: `app.js`

**Interfaces:**
- Consumes: `pokemon-data.json` (from Task 1), Alpine.js CDN loaded in `index.html`
- Produces: `pokemonBrowser` Alpine.data() component with all functionality

- [ ] **Step 1: Write app.js**

```js
document.addEventListener('alpine:init', () => {
  Alpine.data('pokemonBrowser', () => ({
    pokemon: [],
    chips: [],
    search: '',
    sortKey: 'id',
    sortDir: 'asc',
    filteredPokemon: [],
    loading: false,
    progress: '',
    showAddMenu: false,

    columns: [
      { key: 'id', label: '#', sortable: true },
      { key: 'sprite', label: '', sortable: false },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'types', label: 'Types', sortable: false },
      { key: 'hp', label: 'HP', sortable: true },
      { key: 'attack', label: 'Attack', sortable: true },
      { key: 'defense', label: 'Defense', sortable: true },
      { key: 'special-attack', label: 'Sp.Atk', sortable: true },
      { key: 'special-defense', label: 'Sp.Def', sortable: true },
      { key: 'speed', label: 'Speed', sortable: true },
      { key: 'total', label: 'Total', sortable: true },
      { key: 'generation', label: 'Gen', sortable: true },
      { key: 'moves', label: 'Moves', sortable: true },
    ],

    async init() {
      const cached = localStorage.getItem('pokemonData');
      if (cached) {
        this.pokemon = JSON.parse(cached);
        this.recompute();
      }
      try {
        const resp = await fetch('pokemon-data.json');
        if (!resp.ok) throw new Error('not found');
        const data = await resp.json();
        this.pokemon = data;
        localStorage.setItem('pokemonData', JSON.stringify(data));
        this.recompute();
      } catch (e) {
        if (this.pokemon.length === 0) {
          console.warn('No pokemon-data.json found and no cached data. Click Refresh to fetch from PokeAPI.');
        }
      }
    },

    recompute() {
      let result = [...this.pokemon];

      if (this.search) {
        const q = this.search.toLowerCase();
        result = result.filter((p) => p.name.includes(q));
      }

      for (const chip of this.chips) {
        if (chip.type === 'generation') {
          result = result.filter((p) => p.generation === parseInt(chip.value));
        } else if (chip.type === 'stat') {
          const statKey = chip.stat;
          const val = parseInt(chip.value) || 0;
          if (chip.operator === '>') {
            result = result.filter((p) => p.stats[statKey] > val);
          } else {
            result = result.filter((p) => p.stats[statKey] < val);
          }
        } else if (chip.type === 'move') {
          const moveName = (chip.value || '').toLowerCase().trim();
          if (moveName) {
            result = result.filter((p) => p.moves.some((m) => m.includes(moveName)));
          }
        }
      }

      const key = this.sortKey;
      const dir = this.sortDir === 'asc' ? 1 : -1;
      result.sort((a, b) => {
        let va, vb;
        if (key === 'total') {
          va = Object.values(a.stats).reduce((s, v) => s + v, 0);
          vb = Object.values(b.stats).reduce((s, v) => s + v, 0);
        } else if (key === 'moves') {
          va = a.moves.length;
          vb = b.moves.length;
        } else if (['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'].includes(key)) {
          va = a.stats[key];
          vb = b.stats[key];
        } else if (key === 'name') {
          va = a.name;
          vb = b.name;
        } else {
          va = a[key];
          vb = b[key];
        }
        if (typeof va === 'string') return va.localeCompare(vb) * dir;
        return (va - vb) * dir;
      });

      this.filteredPokemon = result;
    },

    toggleSort(key) {
      if (this.sortKey === key) {
        if (this.sortDir === 'asc') {
          this.sortDir = 'desc';
        } else {
          this.sortKey = 'id';
          this.sortDir = 'asc';
        }
      } else {
        this.sortKey = key;
        this.sortDir = 'asc';
      }
      this.recompute();
    },

    addChip(type) {
      const chip = { type, editing: true };
      if (type === 'generation') {
        chip.value = '1';
      } else if (type === 'stat') {
        chip.stat = 'speed';
        chip.operator = '>';
        chip.value = '';
      } else if (type === 'move') {
        chip.value = '';
      }
      this.chips.push(chip);
    },

    commitChip(chip) {
      chip.editing = false;
      this.recompute();
    },

    removeChip(index) {
      this.chips.splice(index, 1);
      this.recompute();
    },

    chipLabel(chip) {
      if (chip.type === 'generation') return `Gen ${chip.value}`;
      if (chip.type === 'stat') return `${this.statLabel(chip.stat)} ${chip.operator} ${chip.value || '?'}`;
      if (chip.type === 'move') return `Knows ${chip.value || '...'}`;
      return '';
    },

    statLabel(key) {
      const map = {
        hp: 'HP', attack: 'Attack', defense: 'Defense',
        'special-attack': 'Sp.Atk', 'special-defense': 'Sp.Def', speed: 'Speed',
      };
      return map[key] || key;
    },

    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    spriteUrl(id) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    },

    statTotal(p) {
      return Object.values(p.stats).reduce((sum, v) => sum + v, 0);
    },

    async refreshFromApi() {
      this.loading = true;
      this.progress = 'Fetching Pokémon list...';
      try {
        const listResp = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000');
        const listData = await listResp.json();
        const total = listData.results.length;
        const results = [];

        for (let i = 0; i < total; i++) {
          const entry = listData.results[i];
          const id = i + 1;
          this.progress = `Fetching ${id}/${total}...`;
          try {
            const detailResp = await fetch(entry.url);
            const d = await detailResp.json();
            const types = d.types.map((t) => t.type.name);
            const stats = {};
            ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'].forEach((name) => {
              const s = d.stats.find((st) => st.stat.name === name);
              stats[name] = s ? s.base_stat : 0;
            });
            const moves = d.moves.map((m) => m.move.name);
            const gen = id <= 151 ? 1 : id <= 251 ? 2 : id <= 386 ? 3 : id <= 493 ? 4 :
                        id <= 649 ? 5 : id <= 721 ? 6 : id <= 809 ? 7 : id <= 905 ? 8 : 9;
            results.push({ id, name: entry.name, types, stats, generation: gen, moves });
          } catch (e) {
            console.warn(`Failed ${entry.name}:`, e);
          }
        }

        this.pokemon = results;
        localStorage.setItem('pokemonData', JSON.stringify(results));
        this.recompute();

        const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pokemon-data.json';
        a.click();
        URL.revokeObjectURL(url);
      } catch (e) {
        alert('Failed to fetch from PokeAPI: ' + e.message);
      }
      this.loading = false;
      this.progress = '';
    },
  }));
});
```

- [ ] **Step 2: Test basic flow**

Open `index.html` in a browser.
- Verify the table loads with Pokémon data from `pokemon-data.json`.
- Verify the "+ Add Filter" button shows a dropdown.
- Add a "Generation" filter for Gen 1 — verify only Gen 1 Pokémon appear.
- Add a "Stat" filter for Speed > 100 — verify further filtering.
- Add a "Move" filter for "thunderbolt" — verify.
- Click column headers to sort.
- Type in the search bar to filter by name.
- Verify the count footer updates correctly.

- [ ] **Step 3: Test refresh**

Click "Refresh from PokeAPI".
- Verify progress text shows during fetch.
- Verify data updates in-memory.
- Verify a JSON file download is triggered.

---

### Task 4: Final verification

- [ ] **Step 1: Open the page and smoke test all features**

Open `index.html` in a browser.
- [ ] Table loads with full Pokémon data
- [ ] Search filters by name (case-insensitive)
- [ ] Generation chips: add Gen 1 + Gen 2 chips together, verify union behavior
- [ ] Stat chips: Speed > 100 then add Attack < 50, verify AND behavior
- [ ] Move chips: "flamethrower", "surf", "earthquake" — verify partial match (substring)
- [ ] Edit chips by clicking them — verify inline editing works
- [ ] Remove chips — verify table updates
- [ ] Sort columns: click once asc, twice desc, third reset to ID
- [ ] Refresh button fetches from PokeAPI and offers download
- [ ] Dark theme looks correct, type badges have correct colors
- [ ] Responsive: narrow window, table scrolls horizontally
