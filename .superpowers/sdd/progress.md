# SDD Progress — Comparer Hexagon + Links feature (2026-07-31)

BASE: db209a4 (HEAD before Task 1)

Task 1: done (bf1964c)
Task 2: done (5a83976)
Task 3: done (2116bd0)
Task 4: done (59c214f)
Task 5: done (e6ff4b1 + d9d2aae)
Task 6: done (8169948)
Task 7: done (3991819)
Task 8: done (verification + review fixes cce639d)
Bug fix (comparer name column empty/stale): root-caused + fixed in index.html (name span x-show+x-text -> template x-if including slot.entity). Fix verified for Moves/Items/Pokemon + multi-slot + hexagon toggle.

Level simulator + evolution levels feature (2026-08-01):
- pokemon-data.js regenerated with level_moves (name + min learn level per pokemon); generate-data.js updated with concurrency + level_moves capture
- evolution-data.js regenerated with evo trigger details (level/method/item/happiness/beauty/time/location/known_move/known_move_type/trade_species); generate-evolutions.js updated with concurrency
- app.js: detailLevel state, statsAtLevel(), detailLearnableMoves(), evolutionMethodLabel()
- index.html: Stats at Level section (level input), Moves at Level section (level-filtered + Lv. badges + search), evo-method labels on evo nodes
- styles.css: .evo-method, .level-input, .level-sim-controls, .level-sim-note, .move-level-badge, .detail-no-moves
- Verified headless Chrome: bulbasaur (Lv.16/32 evo, stats+16 moves at Lv100), eevee (stones/friendship/location/fairy), machoke (Lv.28 + Trade), gmax no-moves fallback, comparer + detail still working
