# Autocomplete Filters & Mega/Gmax Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove mega/gmax entries, upgrade move/type filters to autocomplete, add category filter to moves tab, fix move descriptions.

**Architecture:** All changes are in the browser-side Alpine.js app (app.js, index.html, styles.css) plus the data generation pipeline (generate-data.js, moves-data.js). The autocomplete pattern is implemented via Alpine template conditionals and a shared `filterSuggestions` method.

**Tech Stack:** Alpine.js 3, vanilla JS, CSS, Node.js (data generation)

## Global Constraints

- No external JS dependencies — autocomplete uses Alpine.js directives only
- All chip state lives on the chip object (suggestions[], showDropdown)
- Descriptions sourced from PokeAPI `effect_entries[].effect` field
- Pokémon with `id >= 10000` excluded from display and data generation

---

### Task 1: Update generate-data.js

**Files:**
- Modify: `generate-data.js`

- [ ] **Step 1: Skip mega/gmax Pokémon**

Add a filter after fetching Pokémon list to skip entries with `id >= 10000`.

- [ ] **Step 2: Switch description to effect_entries**

Replace `flavor_text_entries` lookup with `effect_entries` lookup and clean double spaces.

Update lines 85 and 93:

```js
// Before (line 85):
const flavor = (detail.flavor_text_entries || []).find((f) => f.language.name === 'en');
// After:
const effect = (detail.effect_entries || []).find((f) => f.language.name === 'en');
```

```js
// Before (line 93):
description: flavor ? flavor.flavor_text.replace(/[\n\f]/g, ' ') : null,
// After:
description: effect ? effect.effect.replace(/\s{2,}/g, ' ').trim() : null,
```

- [ ] **Step 3: Commit**

```bash
git add generate-data.js
git commit -m "feat: skip mega/gmax pokemon, use effect_entries for move descriptions"
```

---

### Task 2: Patch move descriptions in moves-data.js

**Files:**
- Create (then delete): `patch-descriptions.js`
- Modify: `moves-data.js`

This one-off script reads `moves-data.js`, fetches each move's `effect_entries[].effect` from PokeAPI, and updates the description field.

- [ ] **Step 1: Write the patch script**

Create `patch-descriptions.js`:

```js
const fs = require('fs');
const content = fs.readFileSync('moves-data.js', 'utf8');
const moves = eval(content.replace('window.__MOVES_DATA__ =', '').replace(/;$/, ''));

async function patch() {
  for (let i = 0; i < moves.length; i++) {
    const m = moves[i];
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/move/${m.name}`);
      if (!res.ok) throw new Error(res.status);
      const detail = await res.json();
      const effect = (detail.effect_entries || []).find((e) => e.language.name === 'en');
      if (effect) {
        m.description = effect.effect.replace(/\s{2,}/g, ' ').trim();
      }
    } catch (e) {
      console.error(`  Failed ${m.name}: ${e.message}`);
    }
    if ((i + 1) % 100 === 0) console.log(`  ${i + 1}/${moves.length}`);
  }
  fs.writeFileSync('moves-data.js', 'window.__MOVES_DATA__ = ' + JSON.stringify(moves) + ';');
  console.log(`Done. Patched ${moves.length} moves.`);
}
patch().catch(console.error);
```

- [ ] **Step 2: Run the patch script**

```bash
node patch-descriptions.js
```

Expected: Outputs progress every 100 moves, then "Done. Patched 833 moves."

- [ ] **Step 3: Verify a few descriptions**

```bash
node -e "const d = eval(require('fs').readFileSync('moves-data.js','utf8').replace('window.__MOVES_DATA__ =','').replace(/;$/,'')); 'flamethrower,swords-dance,agility,tackle,growl'.split(',').forEach(m => { const x = d.find(o => o.name === m); console.log(m + ':', x.description) })"
```

Expected output like:
```
flamethrower: Inflicts regular damage. Has a chance to burn the target.
swords-dance: Raises the user's Attack by two stages.
agility: Raises the user's Speed by two stages.
tackle: Inflicts regular damage.
growl: Lowers the target's Attack by one stage.
```

- [ ] **Step 4: Delete the patch script and commit**

```bash
Remove-Item patch-descriptions.js
git add moves-data.js
git commit -m "feat: patch move descriptions to use effect_entries (stages language)"
```

---

### Task 3: Remove mega/gmax from runtime + UI

**Files:**
- Modify: `app.js`
- Modify: `index.html`
- Modify: `styles.css`

- [ ] **Step 1: Add runtime mega/gmax filter in app.js recompute()**

After line 83 (`result = result.filter((p) => p.name.includes(q));`), add:

```js
result = result.filter((p) => p.id < 10000);
```

- [ ] **Step 2: Remove mega chip from recompute()**

Delete the entire `type === 'mega'` block (lines 106-108):

```js
// Delete this block:
} else if (type === 'mega') {
  result = result.filter((p) => chips[0].value === 'true' ? p.moves.some((m) => m.includes('mega-')) : !p.moves.some((m) => m.includes('mega-')));
```

- [ ] **Step 3: Remove mega chip from addChip()**

Delete lines 173-174:

```js
// Delete:
} else if (type === 'mega') {
  chip.value = 'true';
```

- [ ] **Step 4: Remove mega chip from chipLabel()**

Delete line 199:

```js
// Delete:
if (chip.type === 'mega') return `Mega: ${chip.value === 'true' ? 'Yes' : 'No'}`;
```

- [ ] **Step 5: Remove mega button from index.html chip menu**

Delete line 38:

```html
<button @click="addChip('mega'); showAddMenu = false">Mega</button>
```

- [ ] **Step 6: Remove mega edit template from index.html**

Delete lines 107-112:

```html
<template x-if="chip.type === 'mega'">
  <select x-model="chip.value" @change="commitChip(chip)">
    <option value="true">Yes</option>
    <option value="false">No</option>
  </select>
</template>
```

- [ ] **Step 7: Remove .chip-mega from styles.css**

Delete the `.chip-mega` line.

- [ ] **Step 8: Commit**

```bash
git add app.js index.html styles.css
git commit -m "feat: remove mega/gmax pokemon from display and UI"
```

---

### Task 4: Add autocomplete for move, type, and category filters

**Files:**
- Modify: `app.js`
- Modify: `index.html`
- Modify: `styles.css`

- [ ] **Step 1: Add autocomplete methods to app.js**

Add these methods after the existing chip methods (before `capitalize`):

```js
filterSuggestions(chip) {
  const q = (chip.value || '').toLowerCase().trim();
  let source = [];
  if (chip.type === 'move') {
    source = this.moves.map(m => m.name).filter(n => n.includes(q)).slice(0, 20);
  } else if (chip.type === 'type') {
    source = this.allTypes.filter(t => t.includes(q));
  } else if (chip.type === 'category') {
    source = ['physical', 'special', 'status'].filter(c => c.includes(q));
  }
  chip.suggestions = source;
  chip.showDropdown = source.length > 0;
},

selectSuggestion(chip, value) {
  chip.value = value;
  chip.showDropdown = false;
  chip.editing = false;
  if (chip.type === 'category') {
    this.moveRecompute();
  } else {
    this.recompute();
  }
},
```

- [ ] **Step 2: Update addChip('move') to init autocomplete props**

In `addChip()`, after `chip.value = '';` for the `'move'` case, add:

```js
chip.suggestions = [];
chip.showDropdown = false;
```

- [ ] **Step 3: Update addChip('type') to use chip.value instead of chip.types**

Replace:

```js
} else if (type === 'type') {
  chip.types = ['fire', ''];
}
```

with:

```js
} else if (type === 'type') {
  chip.value = '';
  chip.suggestions = [];
  chip.showDropdown = false;
}
```

- [ ] **Step 4: Update chipLabel('type') to use chip.value**

Replace:

```js
if (chip.type === 'type') return `Type: ${chip.types.filter(Boolean).map((t) => this.capitalize(t)).join('/')}`;
```

with:

```js
if (chip.type === 'type') return `Type: ${this.capitalize(chip.value) || '...'}`;
```

- [ ] **Step 5: Update chipLabel('move') label**

Replace:

```js
if (chip.type === 'move') return `Knows ${chip.value || '...'}`;
```

with:

```js
if (chip.type === 'move') return `Can learn ${chip.value || '...'}`;
```

- [ ] **Step 6: Update recompute() type filter to use chip.value**

Replace:

```js
} else if (type === 'type') {
  result = result.filter((p) => chips.some((c) => {
    const selected = c.types.filter(Boolean);
    return selected.length === 0 || selected.every((t) => p.types.includes(t));
  }));
}
```

with:

```js
} else if (type === 'type') {
  result = result.filter((p) => chips.some((c) => {
    const t = (c.value || '').toLowerCase().trim();
    return t && p.types.includes(t);
  }));
}
```

- [ ] **Step 7: Add category chip support in moves tab**

In `addMoveChip()`, add after the `'pokemon'` case:

```js
} else if (type === 'category') {
  chip.value = '';
  chip.suggestions = [];
  chip.showDropdown = false;
}
```

In the move chip label function (`moveChipLabel`), add:

```js
if (chip.type === 'category') return `Category: ${this.capitalize(chip.value)}`;
```

In `moveRecompute()`, add after the `'pokemon'` filter block:

```js
} else if (type === 'category') {
  result = result.filter((m) => m.damage_class === chips[0].value);
}
```

- [ ] **Step 8: Update addMoveMenu in index.html**

Add a category button after the existing move filter buttons (after `Learned By`):

```html
<button @click="addMoveChip('category'); moveShowAddMenu = false">Category</button>
```

- [ ] **Step 9: Update move chip edit templates in index.html**

Replace the existing move chip edit template:

```html
<template x-if="chip.type === 'move'">
  <input type="text" x-model="chip.value" placeholder="Move name..." @keyup.enter="commitChip(chip)">
</template>
<template x-if="chip.type === 'type'">
  <span class="chip-edit-row">
    <select x-model="chip.types[0]" @change="commitChip(chip)">
      <template x-for="t in allTypes" :key="t">
        <option :value="t" x-text="capitalize(t)"></option>
      </template>
    </select>
    <span class="chip-edit-sep">+</span>
    <select x-model="chip.types[1]" @change="commitChip(chip)">
      <option value="">--</option>
      <template x-for="t in allTypes" :key="t">
        <option :value="t" x-text="capitalize(t)"></option>
      </template>
    </select>
  </span>
</template>
```

with the autocomplete version:

```html
<template x-if="chip.type === 'move' || chip.type === 'type' || chip.type === 'category'">
  <span class="autocomplete-wrapper">
    <input type="text" x-model="chip.value"
           placeholder="Type to search..."
           @input="filterSuggestions(chip)"
           @focus="chip.showDropdown = chip.suggestions.length > 0"
           @keyup.enter="selectSuggestion(chip, chip.value)">
    <div class="autocomplete-dropdown" x-show="chip.showDropdown && chip.suggestions.length"
         @click.outside="chip.showDropdown = false">
      <template x-for="s in chip.suggestions" :key="s">
        <div class="autocomplete-item" @click="selectSuggestion(chip, s)"
             x-text="capitalize(s)"></div>
      </template>
    </div>
  </span>
</template>
```

- [ ] **Step 10: Add autocomplete CSS to styles.css**

Add after the `.category-badge` block:

```css
/* Autocomplete */
.autocomplete-wrapper {
  position: relative; display: inline-block;
}
.autocomplete-wrapper input {
  background: var(--surface2); border: 1px solid var(--border);
  color: var(--text); padding: 3px 6px; border-radius: 4px;
  font-size: 0.75rem; outline: none; width: 130px;
}
.autocomplete-dropdown {
  position: absolute; top: 100%; left: 0; right: 0; z-index: 20;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 6px; max-height: 160px; overflow-y: auto; margin-top: 2px;
}
.autocomplete-item {
  padding: 4px 8px; cursor: pointer; font-size: 0.75rem;
  text-transform: capitalize; transition: background 0.1s;
}
.autocomplete-item:hover { background: var(--accent); color: #fff; }
```

- [ ] **Step 11: Add .chip-category CSS**

Add after the `.chip-pokemon` rule:

```css
.chip-category { border-color: #f97316; }
```

- [ ] **Step 12: Commit**

```bash
git add app.js index.html styles.css
git commit -m "feat: add autocomplete for move/type/category filters, add category filter to moves tab"
```

---

### Task 5: Verify everything works

- [ ] **Step 1: Open index.html in a browser**

Open the file and verify:

1. Pokémon tab shows only entries with `id < 10000` (no mega/gmax)
2. "Mega" filter is gone from the + Add Filter menu
3. Type filter is now an autocomplete input with dropdown suggestions
4. Move filter ("Can learn") has autocomplete with move name suggestions
5. Moves tab has a "Category" filter in the add menu
6. Move descriptions show professional text (e.g., "Raises the user's Attack by two stages.")
