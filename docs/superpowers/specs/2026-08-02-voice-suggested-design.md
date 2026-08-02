# Voice Suggested Section — Design Spec

**Date:** 2026-08-02  
**Status:** Draft

## Overview

Add a voice-controlled "Suggested" section to the home page. A mic toggle in the header starts continuous speech recognition. When a Pokémon, move, ability, or item name is spoken, it fuzzy-matches against all four datasets and displays the best match as a single suggested card on the home page. Clicking the card opens that entity's detail view.

## Motivation

Give users a hands-free way to jump to any entity by speaking its name, visible as a suggestion card on the home tab.

## Architecture

### New state properties (Alpine.js)

| Property | Type | Default | Description |
|---|---|---|---|
| `voiceListening` | `boolean` | `false` | Whether the mic is active |
| `voiceSupported` | `boolean` | `true` (recomputed on init) | Browser supports Web Speech API |
| `voiceRecognition` | `object` or `null` | `null` | The `SpeechRecognition` instance |
| `voiceSuggested` | `object` or `null` | `null` | The matched suggestion: `{type, item, name}` |
| `voiceNameIndex` | `object` | `{}` | Map of normalized name → `{type, item}` computed once on init |

### Components

1. **Mic toggle button** — In `header-actions` div (right side of header). Red when off, green pulsing when listening. Tooltip "Voice Suggestions". Only rendered if `voiceSupported`.

2. **Speech recognition** — `webkitSpeechRecognition` with `continuous:true`, `interimResults:false`. On `result` event, calls `processVoiceResult(transcript)`. On `end` event, restarts if `voiceListening` is still true (handles Chrome's auto-stop). On `error`, sets `voiceListening = false` for `not-allowed` / `service-not-allowed`; ignores transient `no-speech`.

3. **Fuzzy matching** — `processVoiceResult(transcript)` splits transcript into words, joins them, removes spaces/hyphens, lowercase. Iterates `voiceNameIndex` computing character-overlap ratio. If best ratio > 0.7, sets `voiceSuggested`. Otherwise clears `voiceSuggested`.

4. **Suggested card** — In the home tab (`x-show="activeTab === 'home'"`), between "Today's Features" and "How to Use". Shows entity sprite/type-badge, name, and an entity-kind label. Rendered only when `voiceSuggested !== null`. Clicking calls `openPokemonDetail`, `openMoveDetail`, `openAbilityDetail`, or `openItemDetail` depending on type.

### Behavior

- **Listening always active** — Speech recognition runs on every tab when mic is on (only the card is hidden on non-home tabs).
- **Single suggestion** — Only the latest/best match is shown; previous suggestion is replaced.
- **Stop/start** — Toggle button starts/stops recognition. If speech stops (Chrome timeout), auto-restarts while `voiceListening` is true.

### Edge cases

- **Browser unsupported** — `webkitSpeechRecognition` not found → `voiceSupported = false`, hide mic button entirely.
- **Permission denied** — `not-allowed` error → set `voiceListening = false`, show small red indicator.
- **No match** — Transcript doesn't exceed 0.7 threshold → `voiceSuggested` remains as whatever it was (could be `null` or previous match).
- **Ambiguous match** — Two entities have same normalized name (e.g., a move and pokemon share a name) → Pokémon wins, then moves, then abilities, then items.

### Files modified

- **app.js** — New state properties, `initVoice()`, `toggleVoice()`, `processVoiceResult()`, `buildVoiceNameIndex()`, fuzzy match helpers
- **index.html** — Mic button in header, suggested card in home tab
- **styles.css** — `.voice-mic`, `.voice-listening`, `.voice-suggested`, `.voice-suggested-*` styles
