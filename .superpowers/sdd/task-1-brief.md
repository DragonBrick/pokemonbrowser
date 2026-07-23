### Task 1: Tab Button + Collection Tab HTML Structure

**Files:**
- Modify: `index.html` (tab button + collection section markup)

**Interfaces:**
- Consumes: existing Alpine.js template pattern
- Produces: `x-show="activeTab === 'collection'"` section with placeholder, tab button

- [ ] **Step 1: Add collection tab button**

Edit `index.html` to insert the collection tab button between Games and Types (after line 22):

```html
<button :class="{ active: activeTab === 'collection' }" @click="switchTab('collection')" @dblclick="closeDetail()">Collection</button>
```

- [ ] **Step 2: Add collection tab section**

Insert after the Type Calculator section (after the current `x-show="activeTab === 'types'"` closing div), before the Alpine closing div. The full collection tab markup:

```html
<div x-show="activeTab === 'collection'">
  <div class="home-section home-info tab-info">
    <div class="home-info-header">
      <h2 class="home-heading" style="font-size:0.9rem;">How to Use</h2>
      <button class="btn-text" @click="showHowToUse = !showHowToUse" x-text="showHowToUse ? 'Hide' : 'Show'" style="font-size:0.8rem;"></button>
    </div>
    <div x-show="showHowToUse">
      <div class="info-grid">
        <div class="info-card"><div class="info-icon">C</div><div class="info-body"><div class="info-title">Collection</div><div class="info-desc">Search for Pokémon TCG cards and build your personal collection with PSA grading and estimated values.</div></div></div>
      </div>
    </div>
  </div>

  <!-- WiFi notice -->
  <div class="coll-wifi-note">
    <span class="coll-wifi-icon">&#9888;</span>
    <span>This tab requires an internet connection to search cards and fetch prices. Your collection works offline.</span>
  </div>

  <!-- Search + Controls bar -->
  <div class="coll-controls">
    <div class="coll-search-row">
      <div class="autocomplete-wrapper coll-search-wrap">
        <input type="text" class="search-input" placeholder="Search Pokémon TCG cards..." x-model="collectionSearchInput"
               @input="collectionSearchCards()">
      </div>
      <select class="coll-sort" x-model="collectionSort" @change="collectionRecompute()">
        <option value="date">Date Added</option>
        <option value="name">Name</option>
        <option value="set">Set</option>
        <option value="grade">Grade</option>
        <option value="value">Value</option>
      </select>
    </div>

    <!-- Stats bar -->
    <div class="coll-stats" x-show="collection.length">
      <span x-text="collection.length + ' card' + (collection.length !== 1 ? 's' : '')"></span>
      <span class="coll-stats-sep">·</span>
      <span x-text="collectionGradedCount() + ' graded'"></span>
      <span class="coll-stats-sep">·</span>
      <span>Value: <strong x-text="collectionTotalValue()"></strong></span>
    </div>
  </div>

  <!-- API Search Results -->
  <div class="coll-api-results" x-show="collectionSearchInput && collectionSearchInput.trim().length >= 2 && collectionResults.length">
    <div class="coll-results-grid">
      <template x-for="card in collectionResults" :key="card.id">
        <div class="coll-result-card" @click="collectionOpenAdd(card)">
          <img :src="card.images.small" :alt="card.name" class="coll-result-img" loading="lazy">
          <div class="coll-result-info">
            <span class="coll-result-name" x-text="card.name"></span>
            <span class="coll-result-set" x-text="card.set.name + ' #' + card.number"></span>
          </div>
          <button class="coll-add-btn" @click.stop="collectionOpenAdd(card)">+</button>
        </div>
      </template>
    </div>
  </div>
  <div class="coll-no-results" x-show="collectionSearchInput && collectionSearchInput.trim().length >= 2 && collectionApiLoading && collectionResults.length === 0">
    Searching...
  </div>
  <div class="coll-no-results" x-show="collectionSearchInput && collectionSearchInput.trim().length >= 2 && !collectionApiLoading && collectionResults.length === 0 && collectionSearchError === null">
    No cards found.
  </div>
  <div class="coll-no-results" x-show="collectionSearchError" x-text="'Error: ' + collectionSearchError"></div>

  <!-- Collection Grid -->
  <div class="coll-grid" x-show="collectionFiltered().length">
      <template x-for="entry in collectionFiltered()" :key="entry.id + '-' + entry.variant">
      <div class="coll-card" @click="collectionOpenEdit(entry)">
        <img :src="entry.image" :alt="entry.name" class="coll-card-img" loading="lazy">
        <div class="coll-card-body">
          <div class="coll-card-name" x-text="entry.name"></div>
          <div class="coll-card-set" x-text="entry.setName + ' #' + entry.number"></div>
          <div class="coll-card-badges">
            <span class="coll-badge-variant" x-text="entry.variantLabel"></span>
            <span class="coll-badge-grade" :class="'coll-grade-' + (entry.grade ? 'graded' : 'raw')" x-text="entry.grade ? 'PSA ' + entry.grade : 'Raw'"></span>
            <span class="coll-badge-qty" x-show="entry.quantity > 1" x-text="'×' + entry.quantity"></span>
          </div>
          <div class="coll-card-price" x-text="collectionFormatPrice(entry)"></div>
        </div>
      </div>
    </template>
  </div>
  <div class="coll-empty" x-show="!collectionFiltered().length">
    <p x-show="!collection.length">Your collection is empty. Search for cards above to start building!</p>
    <p x-show="collection.length && !collectionFiltered().length">No cards match your filter.</p>
  </div>

  <!-- Add/Edit Modal -->
  <div class="coll-modal-overlay" x-show="collectionModalOpen" @click.self="collectionModalOpen = false">
    <div class="coll-modal">
      <div class="coll-modal-header">
        <h3 x-text="collectionModalMode === 'add' ? 'Add Card' : 'Edit Card'"></h3>
        <button class="coll-modal-close" @click="collectionModalOpen = false">&times;</button>
      </div>
      <div class="coll-modal-body" x-show="collectionModalCard">
        <div class="coll-modal-layout">
          <div class="coll-modal-image">
            <img :src="collectionModalCard.images ? collectionModalCard.images.large : collectionModalCard.image" alt="" class="coll-modal-img">
          </div>
          <div class="coll-modal-details">
            <div class="coll-modal-name" x-text="collectionModalCard.name"></div>
            <div class="coll-modal-set" x-text="(collectionModalCard.set ? collectionModalCard.set.name : collectionModalCard.setName) + ' #' + (collectionModalCard.number)"></div>

            <div class="coll-modal-field">
              <label class="coll-modal-label">Variant</label>
              <select class="coll-modal-select" x-model="collectionModalVariant">
                <option value="">Select variant...</option>
                <template x-for="v in collectionModalVariants" :key="v.key">
                  <option :value="v.key" x-text="v.label"></option>
                </template>
              </select>
            </div>

            <div class="coll-modal-field">
              <label class="coll-modal-label">Grade</label>
              <select class="coll-modal-select" x-model="collectionModalGrade">
                <option :value="null">Ungraded (Raw)</option>
                <template x-for="g in 10" :key="g">
                  <option :value="g" x-text="'PSA ' + g"></option>
                </template>
              </select>
            </div>

            <div class="coll-modal-field">
              <label class="coll-modal-label">Quantity</label>
              <input type="number" class="coll-modal-input" x-model="collectionModalQuantity" min="1" max="999">
            </div>

            <div class="coll-modal-price" x-show="collectionModalVariantPrice !== null">
              <div class="coll-modal-price-row">
                <span>Market price:</span>
                <span x-text="'$' + collectionModalVariantPrice.toFixed(2)"></span>
              </div>
              <div class="coll-modal-price-row" x-show="collectionModalGrade">
                <span>PSA <span x-text="collectionModalGrade"></span> value:</span>
                <span x-text="'$' + collectionModalGradedPrice().toFixed(2)"></span>
              </div>
            </div>
            <div class="coll-modal-no-price" x-show="collectionModalVariantPrice === null">
              No market price available for this variant.
            </div>

            <div class="coll-modal-actions">
              <button class="btn btn-tb" @click="collectionModalConfirm()" x-text="collectionModalMode === 'add' ? 'Add to Collection' : 'Save Changes'"></button>
              <button class="btn btn-tb-cancel" @click="collectionModalOpen = false">Cancel</button>
              <button class="btn btn-remove" x-show="collectionModalMode === 'edit'" @click="collectionModalDelete()">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete confirmation -->
  <div class="coll-modal-overlay" x-show="collectionDeleteConfirm" @click.self="collectionDeleteConfirm = false">
    <div class="coll-modal coll-modal-sm">
      <div class="coll-modal-header">
        <h3>Delete Card</h3>
      </div>
      <div class="coll-modal-body">
        <p>Are you sure you want to remove this card from your collection?</p>
        <div class="coll-modal-actions" style="margin-top:16px;">
          <button class="btn btn-remove" @click="collectionModalDeleteConfirm()">Delete</button>
          <button class="btn btn-tb-cancel" @click="collectionDeleteConfirm = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Verify the HTML**

Open `index.html` in a browser. The "Collection" tab button should appear in the nav. Clicking it shows the empty collection state with the How to Use section and WiFi notice.
