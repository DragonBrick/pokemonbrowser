# Task 1: Apply the 5 comparer minor review fixes

**Files:**
- Modify: `index.html` — remove-button visibility (line 1487), autocomplete close (line 1476), priority chip `min` (line 609)
- Modify: `app.js` — items search normalization (`cmpFilterInput`, lines 1646-1650)
- Modify: `moves-priority.js` — trailing newline

**Interfaces:**
- Consumes: existing `cmpSlots`, `slot.results`, `moveChips`/`addMoveChip`.
- Produces: no new interfaces.

Do NOT add code comments (strict project rule). Locate anchors by exact string match, not line numbers (files shift). Read the relevant sections before editing.

- [ ] **Step 1: Fix the dead remove button**

Modify `index.html` — find the `<button class="cmp-slot-remove" x-show="slot.entity" @click="cmpRemove(i)">&times;</button>` line and change it to require more than one slot:

```html
              <button class="cmp-slot-remove" x-show="slot.entity && cmpSlots.length > 1" @click="cmpRemove(i)">&times;</button>
```

- [ ] **Step 2: Auto-close the comparer autocomplete**

Modify `index.html` — find `<div class="cmp-slot-search">` (the comparer slot search wrapper, which contains the autocomplete dropdown) and add `@click.outside`:

```html
              <div class="cmp-slot-search" @click.outside="slot.results = []">
```

- [ ] **Step 3: Allow negative priority values**

Modify `index.html` — find the priority/power/pp/accuracy chip edit input `<input type="number" x-model="chip.value" placeholder="0" min="0" @keyup.enter="commitMoveChip(chip)">` and change `min="0"` to `min="-7"`:

```html
                        <input type="number" x-model="chip.value" placeholder="0" min="-7" @keyup.enter="commitMoveChip(chip)">
```

- [ ] **Step 4: Normalize items search**

Modify `app.js` `cmpFilterInput` — find the `else` branch that searches `this.items` and normalize dashes like the pokemon/moves branches do:

```js
      } else {
        slot.results = this.items
          .filter((i) => i.name.replace(/-/g, ' ').toLowerCase().startsWith(q))
          .slice(0, 8);
      }
```

- [ ] **Step 5: Add trailing newline to moves-priority.js**

Modify `moves-priority.js` — append a newline to the end of the file. Verify the last line is a non-empty content line (i.e. the file ends with a newline after the `;`).

- [ ] **Step 6: Verify**

Run: `node --check app.js` — no output, exit 0.

Also run a quick items-search normalization check via Node (parse `app.js`, extract `cmpFilterInput` behavior conceptually, or just confirm via grep that the `replace(/-/g, ' ')` appears in the items branch):

- [ ] **Step 7: Commit**

```bash
git add index.html app.js moves-priority.js
git commit -m "fix: apply comparer minor review fixes"
```
