# Task 3 Brief — Hexagon markup, Table/Hexagon toggle, fix blank move-name column, dblclick nav

Modify ONLY `index.html`. No other files.

## Rules
- Do NOT add code comments.
- Locate anchors by EXACT string match (not line numbers — files shift).
- Do NOT commit.

## Changes (all within the comparer section, inside `<div class="cmp-page" x-show="toolSubTab === 'comparer'">`)

### 1. Add the view toggle
Insert AFTER the `.cmp-kinds` closing `</div>` and BEFORE `<div class="cmp-slots">`:
```html
        <div class="cmp-toggle" x-show="cmpKind === 'pokemon'">
          <button class="cmp-kind-btn" :class="{ active: !cmpHexView }" @click="cmpHexView = false">Table</button>
          <button class="cmp-kind-btn" :class="{ active: cmpHexView }" @click="cmpHexView = true">Hexagon</button>
        </div>
```

### 2. Gate the table view
Change the table wrapper's x-show so it hides when hexagon view is active for Pokémon:
```html
        <div class="table-wrapper" x-show="cmpSlots.some(s => s.entity) && !(cmpKind === 'pokemon' && cmpHexView)">
```
(Find the current line that starts with `<div class="table-wrapper" x-show="cmpSlots.some` and replace it.)

### 3. Add the hexagon view
Insert AFTER the table-wrapper closing `</div>` (the `</div>` right after `</table>`) and BEFORE the `</div>` that closes `cmp-page`:
```html
        <div class="cmp-hex-row" x-show="cmpKind === 'pokemon' && cmpHexView">
          <template x-for="(slot, i) in cmpSlots" :key="'hex' + i">
            <div class="cmp-hex-card" :class="{ 'cmp-hex-empty': !slot.entity }" @dblclick="cmpOpenDetail(slot)">
              <template x-if="!slot.entity">
                <div class="cmp-hex-placeholder">Empty slot</div>
              </template>
              <template x-if="slot.entity">
                <div>
                  <div class="cmp-hex-head">
                    <img :src="spriteUrl(slot.entity.id)" class="cmp-hex-sprite" width="56" height="56">
                    <span class="cmp-hex-name" x-text="cmpLabel('pokemon', slot.entity)"></span>
                  </div>
                  <svg viewBox="0 0 200 190" width="200" height="190" role="img">
                    <template x-for="(g, gi) in cmpHexGrid()" :key="'g' + gi">
                      <polygon :points="g" fill="none" stroke="var(--border)" stroke-width="1" />
                    </template>
                    <template x-for="a in cmpHexAxes()" :key="'ax' + a.key">
                      <line :x1="100" :y1="90" :x2="a.x" :y2="a.y" stroke="var(--border)" stroke-width="1" />
                    </template>
                    <polygon :points="cmpHexPoints(slot.entity)" :fill="typeColor(slot.entity.types[0])" fill-opacity="0.35" :stroke="typeColor(slot.entity.types[0])" stroke-width="2" stroke-linejoin="round" />
                    <template x-for="a in cmpHexAxes()" :key="'lb' + a.key">
                      <text :x="a.tx" :y="a.ty" text-anchor="middle" class="cmp-hex-axis">
                        <tspan x="a.tx" dy="0" :class="{ 'cmp-best': slot.entity.stats[a.key] === cmpBestStat(a.key) }" x-text="a.label"></tspan>
                        <tspan x="a.tx" dy="10" :class="{ 'cmp-best': slot.entity.stats[a.key] === cmpBestStat(a.key) }" x-text="slot.entity.stats[a.key]"></tspan>
                      </text>
                    </template>
                  </svg>
                  <div class="cmp-hex-types">
                    <template x-for="t in slot.entity.types" :key="t">
                      <span class="type-badge" :class="'type-' + t" x-text="capitalize(t)"></span>
                    </template>
                  </div>
                  <div class="cmp-hex-abilities">
                    <template x-for="ab in slot.entity.abilities" :key="ab">
                      <span class="cmp-hex-ability" x-text="capitalize(ab.replace(/-/g, ' '))"></span>
                    </template>
                  </div>
                  <div class="cmp-hex-total">Total <strong x-text="statTotal(slot.entity)"></strong></div>
                </div>
              </template>
            </div>
          </template>
        </div>
```

### 4. Fix the blank move-name column
In the table body, REMOVE this nested block entirely (the `<td>`'s name cell):
```html
                      <template x-if="f.key === 'name'">
                        <span x-text="cmpLabel(cmpKind, slot.entity)"></span>
                      </template>
```
And INSERT at the top of the same `<td>` (before the `<template x-if="f.key === 'sprite'">` block) an x-show-based span:
```html
                        <span x-show="f.key === 'name'" x-text="cmpLabel(cmpKind, slot.entity)"></span>
```
The `<td>` currently looks like:
```html
                    <td>
                      <template x-if="f.key === 'sprite'">
                        <img :src="spriteUrl(slot.entity.id)" class="cmp-sprite" width="48" height="48">
                      </template>
                      <template x-if="f.key === 'name'">
                        <span x-text="cmpLabel(cmpKind, slot.entity)"></span>
                      </template>
```
It must become:
```html
                    <td>
                      <span x-show="f.key === 'name'" x-text="cmpLabel(cmpKind, slot.entity)"></span>
                      <template x-if="f.key === 'sprite'">
                        <img :src="spriteUrl(slot.entity.id)" class="cmp-sprite" width="48" height="48">
                      </template>
```
All other template blocks (types/type/damage_class/category/desc/numeric) stay as-is.

### 5. Add double-click on table rows
Change the table row opening tag from:
```html
                <tr x-show="slot.entity">
```
to:
```html
                <tr x-show="slot.entity" @dblclick="cmpOpenDetail(slot)">
```
(There may be more than one `<tr x-show="slot.entity">` — the one to change is inside the comparer table `<tbody>`, i.e. the one on the line before `<template x-for="f in cmpFields(cmpKind)"`.)

## Verification
- `node --check index.html` is not applicable (HTML). Instead re-read the section after editing to confirm structure: toggle before `.cmp-slots`, table-wrapper x-show updated, hexagon row between table-wrapper close and cmp-page close, name span present in td, `@dblclick` on the comparer row.
- Confirm `@click.outside="slot.results = []"` and the remove button `x-show="slot.entity && cmpSlots.length > 1"` are still intact (Task 1 additions).

## Return
Report: exact anchors matched, what was inserted/removed for each of the 5 changes, and confirmation that existing Task 1 attributes were preserved.
