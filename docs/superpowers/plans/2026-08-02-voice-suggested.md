# Voice Suggested Section — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a voice-controlled "Suggested" section to the home page with a mic toggle in the header and continuous speech recognition that fuzzy-matches spoken names against Pokémon, moves, abilities, and items.

**Architecture:** New Alpine.js state (`voiceListening`, `voiceSupported`, `voiceRecognition`, `voiceSuggested`, `voiceNameIndex`) powers a Web Speech API listener that runs on all tabs. A mic toggle in the header starts/stops recognition. Fuzzy matching finds the single best match across all four datasets. A suggested card renders only on the home tab, between "Today's Features" and "How to Use".

**Tech Stack:** Alpine.js, Web Speech API (`webkitSpeechRecognition`), vanilla JS

## Global Constraints

- Only modify `app.js`, `index.html`, `styles.css`
- Follow existing Alpine.js patterns (no new frameworks)
- Use `var(--surface2)`, `var(--accent)` etc. for colors to match existing theme
- All names lowercase for matching; display with existing `capitalize()` helper

---

### Task 1: Add voice state and methods to app.js

**Files:**
- Modify: `app.js` — add state properties (after existing state block), add methods

**Interfaces:**
- Produces: `voiceListening` (boolean), `voiceSupported` (boolean), `voiceRecognition` (instance|null), `voiceSuggested` ({type,item,name}|null), `voiceNameIndex` (object)
- Produces methods: `voiceSimilarity(a,b) → number`, `buildVoiceNameIndex()`, `toggleVoice()`, `processVoiceResult(transcript)`, `initVoice()`

- [ ] **Step 1: Add voice state properties to Alpine data**

After line ~295 (the `collectionLoad()` call in `init()`), add these new state properties. The state block at the top of `pokemonBrowser` already has many properties — add the voice ones at the end of the state block (before methods, after existing state). Locate the state around line 30 and add after existing properties:

Find a good insertion point in the state declarations (around line 30, before `init()`). Add:

```javascript
    voiceListening: false,
    voiceSupported: false,
    voiceRecognition: null,
    voiceSuggested: null,
    voiceNameIndex: {},
```

- [ ] **Step 2: Add `voiceSimilarity()` helper method**

Add this method to the `pokemonBrowser` object methods section (anywhere in the method definitions):

```javascript
    voiceSimilarity(a, b) {
      a = a.toLowerCase().replace(/[^a-z0-9]/g, '');
      b = b.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!a || !b) return 0;
      if (a.includes(b) || b.includes(a)) return 1;
      let matches = 0;
      let bi = 0;
      for (let ai = 0; ai < a.length && bi < b.length; ai++) {
        if (a[ai] === b[bi]) { matches++; bi++; }
      }
      return matches / Math.max(a.length, b.length);
    },
```

- [ ] **Step 3: Add `buildVoiceNameIndex()` method**

```javascript
    buildVoiceNameIndex() {
      const idx = {};
      for (const p of this.pokemon) idx[p.name] = { type: 'pokemon', item: p };
      for (const m of this.moves) {
        if (!idx[m.name]) idx[m.name] = { type: 'move', item: m };
      }
      for (const a of this.abilities) {
        if (!idx[a.name]) idx[a.name] = { type: 'ability', item: a };
      }
      for (const it of this.items) {
        if (!idx[it.name]) idx[it.name] = { type: 'item', item: it };
      }
      this.voiceNameIndex = idx;
    },
```

- [ ] **Step 4: Add `processVoiceResult()` method**

```javascript
    processVoiceResult(transcript) {
      if (!transcript) return;
      const words = transcript.toLowerCase().trim().split(/\s+/);
      const joined = words.join('');
      let bestScore = 0;
      let bestMatch = null;
      for (const name in this.voiceNameIndex) {
        const score = this.voiceSimilarity(joined, name);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = this.voiceNameIndex[name];
        }
      }
      if (bestScore > 0.7 && bestMatch) {
        this.voiceSuggested = {
          type: bestMatch.type,
          item: bestMatch.item,
          name: bestMatch.item.name
        };
      }
    },
```

- [ ] **Step 5: Add `toggleVoice()` method**

```javascript
    toggleVoice() {
      if (!this.voiceSupported) return;
      if (this.voiceListening) {
        this.voiceListening = false;
        if (this.voiceRecognition) this.voiceRecognition.stop();
        return;
      }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'en-US';
      const self = this;
      rec.onresult = (e) => {
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) {
            self.processVoiceResult(e.results[i][0].transcript);
          }
        }
      };
      rec.onerror = (e) => {
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          self.voiceListening = false;
          self.voiceRecognition = null;
        }
      };
      rec.onend = () => {
        if (self.voiceListening) {
          try { rec.start(); } catch (e) { /* ignore */ }
        }
      };
      this.voiceRecognition = rec;
      try {
        rec.start();
        this.voiceListening = true;
      } catch (e) {
        this.voiceSupported = false;
      }
    },
```

- [ ] **Step 6: Add `initVoice()` and call it from `init()`**

At the end of `init()` (before the closing of the function), add:

```javascript
      this.initVoice();
```

Add the `initVoice()` method:

```javascript
    initVoice() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.voiceSupported = !!SpeechRecognition;
      this.buildVoiceNameIndex();
    },
```

- [ ] **Step 7: Commit**

```bash
git add app.js
git commit -m "feat: add voice suggestion state, methods, and SpeechRecognition support"
```

---

### Task 2: Add mic toggle button to index.html header

**Files:**
- Modify: `index.html` — add button inside `.header-actions` div

**Interfaces:**
- Consumes: `voiceSupported`, `voiceListening` (from app.js state)

- [ ] **Step 1: Add mic button to header**

In `index.html`, inside the `<div class="header-actions">` block, before the result-count spans, add:

```html
          <button class="voice-mic"
                  :class="{ 'voice-listening': voiceListening }"
                  x-show="voiceSupported"
                  @click="toggleVoice()"
                  :title="voiceListening ? 'Stop listening' : 'Voice Suggestions'">
                  <span x-text="voiceListening ? '🎤' : '🎤'"></span>
          </button>
```

The insertion point is line 28, right after `<div class="header-actions">` and before the `<span class="result-count">` elements.

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add voice mic toggle button to header"
```

---

### Task 3: Add suggested card to home page in index.html

**Files:**
- Modify: `index.html` — add section between "Today's Features" and "How to Use" blocks

**Interfaces:**
- Consumes: `voiceSuggested.{type,item,name}`, `activeTab` from app.js
- Consumes: `spriteUrl()`, `capitalize()`, `openPokemonDetail()`, `openMoveDetail()`, `openAbilityDetail()`, `openItemDetail()`

- [ ] **Step 1: Add suggested section to home page**

In `index.html`, between the closing `</div>` of the "Today's Features" section (line 128) and the "How to Use" section (line 130), insert:

```html
      <div class="home-section voice-suggested-section" x-show="voiceSuggested !== null">
        <h2 class="home-heading">Suggested</h2>
        <div class="voice-suggested-card"
             @click="voiceSuggested.type === 'pokemon' ? openPokemonDetail(voiceSuggested.item) :
                     voiceSuggested.type === 'move' ? openMoveDetail(voiceSuggested.item) :
                     voiceSuggested.type === 'ability' ? openAbilityDetail(voiceSuggested.item) :
                     openItemDetail(voiceSuggested.item)">
          <template x-if="voiceSuggested.type === 'pokemon'">
            <div class="voice-suggested-body">
              <img :src="spriteUrl(voiceSuggested.item.id)" :alt="voiceSuggested.name" width="64" height="64"
                   @error="onSpriteError($event, voiceSuggested.item.id)">
              <div class="voice-suggested-info">
                <div class="voice-suggested-name" x-text="capitalize(voiceSuggested.name)"></div>
                <div class="detail-types">
                  <template x-for="t in voiceSuggested.item.types" :key="t">
                    <span class="type-badge" :class="'type-' + t" x-text="capitalize(t)"></span>
                  </template>
                </div>
              </div>
            </div>
          </template>
          <template x-if="voiceSuggested.type === 'move'">
            <div class="voice-suggested-body">
              <span class="voice-suggested-kind">Move</span>
              <div class="voice-suggested-info">
                <div class="voice-suggested-name" x-text="capitalize(voiceSuggested.name)"></div>
                <span class="type-badge" :class="'type-' + voiceSuggested.item.type" x-show="voiceSuggested.item.type" x-text="capitalize(voiceSuggested.item.type)"></span>
              </div>
            </div>
          </template>
          <template x-if="voiceSuggested.type === 'ability'">
            <div class="voice-suggested-body">
              <span class="voice-suggested-kind">Ability</span>
              <div class="voice-suggested-info">
                <div class="voice-suggested-name" x-text="capitalize(voiceSuggested.name)"></div>
                <div class="voice-suggested-desc" x-text="(voiceSuggested.item.description || '').slice(0, 100) + ((voiceSuggested.item.description || '').length > 100 ? '\u2026' : '')"></div>
              </div>
            </div>
          </template>
          <template x-if="voiceSuggested.type === 'item'">
            <div class="voice-suggested-body">
              <span class="voice-suggested-kind">Item</span>
              <div class="voice-suggested-info">
                <div class="voice-suggested-name" x-text="capitalize(voiceSuggested.name)"></div>
                <span class="voice-suggested-cat" x-text="voiceSuggested.item.category"></span>
              </div>
            </div>
          </template>
        </div>
      </div>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add voice-suggested card to home page"
```

---

### Task 4: Add styles for mic button and suggested card

**Files:**
- Modify: `styles.css` — add new `.voice-*` selectors

**Interfaces:**
- Consumes: `voiceListening` (class), `voiceSuggested` (section visibility)

- [ ] **Step 1: Add CSS styles**

Add the following CSS block at the end of `styles.css`:

```css
.voice-mic {
  background: none;
  border: 1px solid var(--border);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-dim);
  transition: color 0.15s, border-color 0.15s;
}
.voice-mic:hover {
  color: var(--text);
  border-color: var(--text-dim);
}
.voice-mic.voice-listening {
  color: #22c55e;
  border-color: #22c55e;
  animation: voice-pulse 1.5s ease-in-out infinite;
}
@keyframes voice-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  50% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
}

.voice-suggested-section {
  padding: 12px 0;
}
.voice-suggested-card {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px 20px;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  max-width: 400px;
}
.voice-suggested-card:hover {
  background: var(--surface3);
  transform: translateY(-2px);
}
.voice-suggested-body {
  display: flex;
  align-items: center;
  gap: 14px;
}
.voice-suggested-body img {
  flex-shrink: 0;
}
.voice-suggested-kind {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--accent);
  font-weight: 600;
  flex-shrink: 0;
  min-width: 50px;
}
.voice-suggested-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.voice-suggested-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
}
.voice-suggested-desc {
  font-size: 0.78rem;
  color: var(--text-dim);
  line-height: 1.3;
}
.voice-suggested-cat {
  font-size: 0.75rem;
  color: var(--text-dim);
}
```

- [ ] **Step 2: Commit**

```bash
git add styles.css
git commit -m "feat: add voice mic and suggested card styles"
```

---

### Task 5: Final verification

**Files:**
- No changes — verification only

- [ ] **Step 1: Verify the app loads without errors**

Open `index.html` in a browser and check the console for errors.

- [ ] **Step 2: Test mic toggle**

Click the mic button in the header. It should turn green and start pulsing. The browser should show a microphone permission prompt. After granting, speak a Pokémon name (e.g., "Pikachu").

- [ ] **Step 3: Test suggested card**

On the home tab, after speaking a recognized name, the suggested card should appear between "Today's Features" and "How to Use". Click it — it should open the detail view.

- [ ] **Step 4: Test tab behavior**

Switch to another tab while mic is on. Speak another name. Switch back to home — the suggested card should show the latest match.

- [ ] **Step 5: Test unsupported browser fallback**

If testing in a browser without `webkitSpeechRecognition` (Firefox), the mic button should not appear at all.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: finalize voice-suggested feature"
```
