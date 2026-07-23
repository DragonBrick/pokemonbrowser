### Task 2: Collection CSS Styles

**Files:**
- Modify: `styles.css` (append collection styles at end, before last line)

**Interfaces:**
- Consumes: existing CSS variable system
- Produces: styles for all `.coll-*` selectors used in the HTML

- [ ] **Step 1: Add all collection styles**

Append to `styles.css` before the closing (before the last blank line):

```css
/* Collection Tab */
.coll-wifi-note {
  display: flex; align-items: center; gap: 8px;
  background: rgba(234,179,8,0.1); border: 1px solid rgba(234,179,8,0.3);
  border-radius: 8px; padding: 8px 14px; font-size: 0.82rem;
  color: var(--text-dim); margin-bottom: 16px;
}
.coll-wifi-icon { font-size: 1rem; flex-shrink: 0; }

.coll-controls {
  display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;
}
.coll-search-row {
  display: flex; align-items: center; gap: 8px;
}
.coll-search-wrap { flex: 1; }
.coll-search-wrap .search-input { width: 100%; max-width: none; }
.coll-sort {
  padding: 8px 12px; background: var(--surface); border: 1px solid var(--border);
  border-radius: 8px; color: var(--text); font-size: 0.85rem; outline: none;
  cursor: pointer; min-width: 130px;
}
.coll-sort:focus { border-color: var(--accent); }
.coll-sort option { background: var(--surface); }

.coll-stats {
  display: flex; align-items: center; gap: 8px;
  font-size: 0.85rem; color: var(--text-dim);
}
.coll-stats strong { color: var(--text); }
.coll-stats-sep { color: var(--border); }

/* API Search Results */
.coll-api-results {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 10px; padding: 12px; margin-bottom: 16px;
  max-height: 360px; overflow-y: auto;
}
.coll-results-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
}
.coll-result-card {
  display: flex; align-items: center; gap: 8px;
  padding: 8px; border-radius: 8px;
  cursor: pointer; transition: background 0.15s;
  position: relative;
}
.coll-result-card:hover { background: var(--surface2); }
.coll-result-img {
  width: 60px; height: auto; border-radius: 4px; flex-shrink: 0;
}
.coll-result-info {
  flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px;
}
.coll-result-name {
  font-size: 0.82rem; font-weight: 600; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
}
.coll-result-set {
  font-size: 0.72rem; color: var(--text-dim); white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
}
.coll-add-btn {
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--accent); color: #fff; border: none;
  font-size: 1.1rem; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: background 0.15s;
}
.coll-add-btn:hover { background: var(--accent-hover); }
.coll-no-results {
  text-align: center; padding: 20px; color: var(--text-dim); font-size: 0.9rem;
}

/* Collection Grid */
.coll-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
}
.coll-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 10px; overflow: hidden; cursor: pointer;
  transition: border-color 0.15s, transform 0.1s;
}
.coll-card:hover {
  border-color: var(--accent); transform: translateY(-2px);
}
.coll-card-img {
  width: 100%; height: auto; display: block;
  border-bottom: 1px solid var(--border);
}
.coll-card-body {
  padding: 10px; display: flex; flex-direction: column; gap: 4px;
}
.coll-card-name {
  font-size: 0.82rem; font-weight: 600; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
}
.coll-card-set {
  font-size: 0.72rem; color: var(--text-dim); white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
}
.coll-card-badges {
  display: flex; flex-wrap: wrap; gap: 4px; align-items: center; margin-top: 4px;
}
.coll-badge-variant, .coll-badge-grade, .coll-badge-qty {
  display: inline-block; padding: 2px 8px; border-radius: 10px;
  font-size: 0.65rem; font-weight: 600;
}
.coll-badge-variant { background: var(--surface3); color: var(--text-dim); }
.coll-badge-grade { 
  background: rgba(124,58,237,0.15); color: var(--accent);
}
.coll-grade-raw { 
  background: var(--surface2); color: var(--text-dim);
}
.coll-badge-qty {
  background: rgba(34,197,94,0.15); color: #22c55e;
}
.coll-card-price {
  font-size: 0.9rem; font-weight: 700; color: var(--text);
  margin-top: 4px;
}

.coll-empty {
  text-align: center; padding: 80px 20px; color: var(--text-dim); font-size: 1rem;
}

/* Collection Modal */
.coll-modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
}
.coll-modal {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 14px; width: 600px; max-width: 90vw;
  max-height: 85vh; display: flex; flex-direction: column;
}
.coll-modal-sm { width: 400px; }
.coll-modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 20px; border-bottom: 1px solid var(--border);
}
.coll-modal-header h3 { font-size: 1rem; font-weight: 700; }
.coll-modal-close {
  background: none; border: none; color: var(--text-dim);
  font-size: 1.4rem; cursor: pointer; padding: 0 4px;
  transition: color 0.15s;
}
.coll-modal-close:hover { color: var(--text); }
.coll-modal-body {
  padding: 20px; overflow-y: auto; flex: 1;
}
.coll-modal-layout {
  display: flex; gap: 20px;
}
.coll-modal-image {
  width: 200px; flex-shrink: 0;
}
.coll-modal-img {
  width: 100%; height: auto; border-radius: 8px;
}
.coll-modal-details {
  flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 12px;
}
.coll-modal-name {
  font-size: 1.1rem; font-weight: 700;
}
.coll-modal-set {
  font-size: 0.85rem; color: var(--text-dim);
}
.coll-modal-field {
  display: flex; flex-direction: column; gap: 4px;
}
.coll-modal-label {
  font-size: 0.75rem; font-weight: 600; color: var(--text-dim);
  text-transform: uppercase; letter-spacing: 0.5px;
}
.coll-modal-select, .coll-modal-input {
  background: var(--surface2); border: 1px solid var(--border);
  color: var(--text); padding: 8px 12px; border-radius: 6px;
  font-size: 0.85rem; outline: none; transition: border-color 0.15s;
}
.coll-modal-select:focus, .coll-modal-input:focus { border-color: var(--accent); }
.coll-modal-input { width: 80px; }
.coll-modal-select option { background: var(--surface); }
.coll-modal-price {
  background: var(--surface2); border-radius: 8px;
  padding: 10px 14px; display: flex; flex-direction: column; gap: 6px;
}
.coll-modal-price-row {
  display: flex; justify-content: space-between; font-size: 0.85rem;
}
.coll-modal-price-row span:last-child { font-weight: 700; }
.coll-modal-no-price {
  font-size: 0.82rem; color: var(--text-dim);
}
.coll-modal-actions {
  display: flex; gap: 8px; margin-top: 8px;
}
```

- [ ] **Step 2: Verify CSS**

Open `index.html` in browser, switch to Collection tab. The layout should render with correct spacing, colors, and grid.
