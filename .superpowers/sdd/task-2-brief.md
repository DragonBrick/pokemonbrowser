# Task 2 Brief — Add hexagon state and methods to app.js

Modify ONLY `app.js`. No other files.

## Rules
- Do NOT add code comments unless requested.
- Locate anchors by EXACT string match (not line numbers).
- Do NOT commit — the orchestrator commits after review.

## Changes

### 1. Add `cmpHexView` state
After this exact line (app.js:197):
```js
    cmpSlots: [{ search: '', results: [], entity: null }],
```
Add:
```js
    cmpHexView: false,
```

### 2. Add hexagon methods
Insert after the `cmpResetSlots()` method — after this exact block (app.js:1668-1670):
```js
    cmpResetSlots() {
      this.cmpSlots = this.cmpSlots.map(() => ({ search: '', results: [], entity: null }));
    },
```
Add this exact code (before the `// === Items Methods ===` line):
```js
    _hexPointsFrom(vals, radius, cx, cy) {
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 180) * (-90 + i * 60);
        const f = Math.min(Math.max(vals[i] || 0, 0.02), 1);
        pts.push((cx + radius * f * Math.cos(angle)).toFixed(1) + ',' + (cy + radius * f * Math.sin(angle)).toFixed(1));
      }
      return pts.join(' ');
    },

    cmpHexGrid() {
      return [1, 0.8, 0.6, 0.4, 0.2].map((f) => this._hexPointsFrom([f, f, f, f, f, f], 70, 100, 90));
    },

    cmpHexAxes() {
      const labels = [
        { key: 'hp', label: 'HP' },
        { key: 'attack', label: 'Atk' },
        { key: 'defense', label: 'Def' },
        { key: 'special-attack', label: 'SpA' },
        { key: 'special-defense', label: 'SpD' },
        { key: 'speed', label: 'Spe' },
      ];
      return labels.map((a, i) => {
        const angle = (Math.PI / 180) * (-90 + i * 60);
        return {
          key: a.key,
          label: a.label,
          x: (100 + 70 * Math.cos(angle)).toFixed(1),
          y: (90 + 70 * Math.sin(angle)).toFixed(1),
          tx: (100 + 70 * 1.22 * Math.cos(angle)).toFixed(1),
          ty: (90 + 70 * 1.22 * Math.sin(angle)).toFixed(1),
        };
      });
    },

    cmpHexStats(p) {
      const s = p.stats || {};
      return [
        { key: 'hp', label: 'HP', value: s.hp },
        { key: 'attack', label: 'Atk', value: s.attack },
        { key: 'defense', label: 'Def', value: s.defense },
        { key: 'special-attack', label: 'SpA', value: s['special-attack'] },
        { key: 'special-defense', label: 'SpD', value: s['special-defense'] },
        { key: 'speed', label: 'Spe', value: s.speed },
      ];
    },

    cmpHexPoints(entity) {
      const vals = this.cmpHexStats(entity).map((s) => (s.value || 0) / 255);
      return this._hexPointsFrom(vals, 70, 100, 90);
    },

    cmpBestStat(key) {
      let best = -Infinity;
      this.cmpSlots.forEach((s) => {
        if (!s.entity) return;
        const v = s.entity.stats && s.entity.stats[key];
        if (typeof v === 'number' && v > best) best = v;
      });
      return best === -Infinity ? null : best;
    },

    cmpOpenDetail(slot) {
      if (!slot.entity) return;
      if (this.cmpKind === 'pokemon') {
        this.activeTab = 'pokemon';
        this.openPokemonDetail(slot.entity);
      } else if (this.cmpKind === 'moves') {
        this.activeTab = 'moves';
        this.openMoveDetail(slot.entity);
      } else {
        this.activeTab = 'items';
        this.openItemDetail(slot.entity);
      }
    },
```

## Verification
Run: `node --check app.js` — must exit 0 with no output.

## Return
Report: the exact anchor string you matched, confirmation of where methods were inserted, and the `node --check` result. Do not modify anything else.
