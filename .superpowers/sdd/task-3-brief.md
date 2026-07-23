### Task 3: Collection State + Init + localStorage

**Files:**
- Modify: `app.js` (add state properties and init/load/save logic)

**Interfaces:**
- Consumes: existing `init()` pattern
- Produces: `collection`, `collectionSearchInput`, `collectionSort`, `collectionResults`, `collectionModal*`, `collectionApiLoading`, `collectionSearchError`, `collectionDeleteConfirm` state, plus `collectionGradedCount()`, `collectionTotalValue()`, `collectionFormatPrice()`, `collectionRecompute()`, `variantLabel()`, `collectionLoad()`, `collectionSave()`, `collectionFiltered()` methods

- [ ] **Step 1: Add state properties**

In `app.js`, add to the data object (around the wp/wallpaper state area, e.g. after line 118, after the `wpGenerating: false` line):

```js
// === Collection State ===
collection: [],
collectionSearchInput: '',
collectionSort: 'date',
collectionResults: [],
collectionApiLoading: false,
collectionSearchError: null,
collectionApiDebounce: null,
collectionModalOpen: false,
collectionModalMode: 'add',
collectionModalCard: null,
collectionModalVariants: [],
collectionModalVariant: '',
collectionModalGrade: null,
collectionModalQuantity: 1,
collectionModalEntryIndex: null,
collectionDeleteConfirm: false,
collectionPsaMultipliers: { 1: 0.08, 2: 0.12, 3: 0.18, 4: 0.28, 5: 0.40, 6: 0.55, 7: 0.70, 8: 0.90, 9: 1.35, 10: 2.80 },
```

- [ ] **Step 2: Add computed methods**

Add after the state properties (in the methods section of the returned object, e.g. after the `wpDownload` method or in a logical spot):

```js
collectionGradedCount() {
  return this.collection.filter(e => e.grade != null).length;
},

collectionTotalValue() {
  const total = this.collection.reduce((sum, e) => {
    const price = e.grade != null && e.priceGraded != null ? e.priceGraded : (e.priceUngraded || 0);
    return sum + price * e.quantity;
  }, 0);
  return '$' + total.toFixed(2);
},

collectionFormatPrice(entry) {
  const price = entry.grade != null && entry.priceGraded != null
    ? entry.priceGraded
    : (entry.priceUngraded || 0);
  if (price === 0) return '—';
  return '$' + price.toFixed(2);
},

variantLabel(key) {
  const map = {
    holofoil: 'Holofoil',
    reverseHolofoil: 'Reverse Holo',
    normal: 'Normal',
    '1stEditionHolofoil': '1st Edition Holo',
    '1stEditionNormal': '1st Edition',
    unlimitedHolofoil: 'Unlimited Holo',
  };
  return map[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim();
},
```

- [ ] **Step 3: Add collectionRecompute()**

```js
collectionRecompute() {
  // sorted + filtered view is computed reactively via Alpine
  // This triggers reactivity on sort/filter changes
  this.collection = [...this.collection];
},
```

- [ ] **Step 4: Add load/save helpers**

```js
collectionLoad() {
  try {
    const saved = JSON.parse(localStorage.getItem('pokemonCollection') || '[]');
    this.collection = saved;
  } catch (e) {
    this.collection = [];
  }
  try {
    const mult = JSON.parse(localStorage.getItem('pokemonCollectionMultipliers') || 'null');
    if (mult) this.collectionPsaMultipliers = mult;
  } catch (e) {}
},

collectionSave() {
  try {
    localStorage.setItem('pokemonCollection', JSON.stringify(this.collection));
  } catch (e) {}
},
```

Then add `this.collectionLoad();` in the `async init()` block (after the factsData loading, before savedTeams loading). Look for a line like `if (window.__FACTS_DATA__) { this.factsData = window.__FACTS_DATA__; }` and add it after that block.

- [ ] **Step 5: Add collectionFiltered() method**

```js
collectionFiltered() {
  let result = [...this.collection];
  if (this.collectionSearchInput && this.collectionSearchInput.trim()) {
    const q = this.collectionSearchInput.toLowerCase().trim();
    result = result.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.setName.toLowerCase().includes(q)
    );
  }
  const sort = this.collectionSort;
  result.sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name);
    if (sort === 'set') return a.setName.localeCompare(b.setName) || a.number.localeCompare(b.number);
    if (sort === 'grade') {
      const ga = a.grade || 0, gb = b.grade || 0;
      return gb - ga;
    }
    if (sort === 'value') {
      const va = (a.grade != null && a.priceGraded != null ? a.priceGraded : (a.priceUngraded || 0));
      const vb = (b.grade != null && b.priceGraded != null ? b.priceGraded : (b.priceUngraded || 0));
      return vb - va;
    }
    return b.updatedAt - a.updatedAt;
  });
  return result;
},
```

- [ ] **Step 6: Verify in browser**

Open browser console and run:
```js
document.querySelector('[x-data]').__x.$data.collectionLoad();
document.querySelector('[x-data]').__x.$data.collection = [{ id: 'test-1', name: 'Test Card', setName: 'Test', number: '1', image: '', variant: 'holofoil', variantLabel: 'Holofoil', grade: 9, quantity: 1, priceUngraded: 100, updatedAt: Date.now() }];
```

The grid should show a test card entry.
