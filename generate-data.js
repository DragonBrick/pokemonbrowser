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
    const id = parseInt(entry.url.split('/').filter(Boolean).pop());
    if (entry.name.includes('-mega') || entry.name.includes('-gmax')) continue;
    try {
      console.log(`  [${i + 1}/${total}] ${entry.name}...`);
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
  fs.writeFileSync('pokemon-data.js', 'window.__POKEMON_DATA__ = ' + JSON.stringify(pokemon) + ';');
  console.log(`\nSaved ${pokemon.length} Pokémon`);

  console.log('Fetching move details...');
  const moveSet = new Set();
  for (const p of pokemon) {
    for (const m of p.moves) moveSet.add(m);
  }
  const moveListRes = await fetch('https://pokeapi.co/api/v2/move?limit=1000');
  const moveUrlMap = {};
  for (const entry of moveListRes.results) {
    if (moveSet.has(entry.name)) moveUrlMap[entry.name] = entry.url;
  }
  const entries = Object.entries(moveUrlMap);
  const movesData = [];
  for (let i = 0; i < entries.length; i += 10) {
    const batch = entries.slice(i, i + 10);
    await Promise.all(batch.map(async ([name, url]) => {
      try {
        const detail = await fetch(url);
        const effect = (detail.effect_entries || []).find((e) => e.language.name === 'en');
        movesData.push({
          name,
          type: detail.type.name,
          power: detail.power,
          accuracy: detail.accuracy,
          pp: detail.pp,
          damage_class: detail.damage_class ? detail.damage_class.name : null,
          description: effect ? effect.effect.replace(/[\n\f]/g, ' ').replace(/\s{2,}/g, ' ').trim() : null,
        });
      } catch (e) {
        console.error(`  Failed ${name}: ${e.message}`);
      }
    }));
    if ((i + 10) % 200 === 0 || i + 10 >= entries.length) {
      console.log(`  ${Math.min(i + 10, entries.length)}/${entries.length}`);
    }
  }
  fs.writeFileSync('moves-data.js', 'window.__MOVES_DATA__ = ' + JSON.stringify(movesData) + ';');
  console.log(`Saved ${movesData.length} moves to moves-data.js`);
}

main().catch(console.error);
