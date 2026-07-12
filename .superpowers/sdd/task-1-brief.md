### Task 1: Generate pokemon-data.json

**Files:**
- Create: `generate-data.js`
- Create: `pokemon-data.json` (output)

**Interfaces:**
- Produces: `pokemon-data.json` — array of objects with shape:
  ```ts
  { id: number, name: string, types: string[], stats: { hp: number, attack: number, defense: number, "special-attack": number, "special-defense": number, speed: number }, generation: number, moves: string[] }
  ```

- [ ] **Step 1: Write generate-data.js**

```js
const https = require('https');
const fs = require('fs');

const STAT_NAMES = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'PokemonBrowser/1.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) resolve(JSON.parse(data));
        else reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      });
    }).on('error', reject);
  });
}

function generationForId(id) {
  if (id <= 151) return 1;
  if (id <= 251) return 2;
  if (id <= 386) return 3;
  if (id <= 493) return 4;
  if (id <= 649) return 5;
  if (id <= 721) return 6;
  if (id <= 809) return 7;
  if (id <= 905) return 8;
  return 9;
}

async function main() {
  console.log('Fetching Pokémon list...');
  const listRes = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000');
  const total = listRes.results.length;
  console.log(`Found ${total} Pokémon`);

  const pokemon = [];
  for (let i = 0; i < total; i++) {
    const entry = listRes.results[i];
    const id = i + 1;
    try {
      console.log(`  [${id}/${total}] ${entry.name}...`);
      const detail = await fetch(entry.url);
      const types = detail.types.map((t) => t.type.name);
      const stats = {};
      STAT_NAMES.forEach((name) => {
        const s = detail.stats.find((st) => st.stat.name === name);
        stats[name] = s ? s.base_stat : 0;
      });
      const moves = detail.moves.map((m) => m.move.name);
      pokemon.push({
        id,
        name: entry.name,
        types,
        stats,
        generation: generationForId(id),
        moves,
      });
    } catch (e) {
      console.error(`  Failed for ${entry.name}: ${e.message}`);
    }
  }

  fs.writeFileSync('pokemon-data.json', JSON.stringify(pokemon, null, 2));
  console.log(`\nDone! Saved ${pokemon.length} Pokémon to pokemon-data.json`);
}

main().catch(console.error);
```

- [ ] **Step 2: Run the script to generate data**

```powershell
node generate-data.js
```

Expected: Downloads all Pokémon from PokeAPI (takes several minutes). Creates `pokemon-data.json` with 1000+ entries.

- [ ] **Step 3: Verify output**

```powershell
node -e "const d = require('./pokemon-data.json'); console.log(`Entries: ${d.length}, First: ${d[0].name}, Last: ${d[d.length-1].name}`)"
```

Expected: `Entries: 1000+, First: bulbasaur, Last: <latest pokemon>`
