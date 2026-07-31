document.addEventListener('alpine:init', () => {
  Alpine.data('pokemonBrowser', () => ({
    pokemon: [],
    chips: [],
    search: '',
    sortKey: 'id',
    sortDir: 'asc',
    filteredPokemon: [],
    showAddMenu: false,
    colWidths: (() => { try { return JSON.parse(localStorage.getItem('pokemonColWidths') || '{}'); } catch(e) { return {}; } })(),
    allTypes: ['normal','fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'],
    typeChart: [
      /*             nor fire wat ele gra ice fig poi gro fly psy bug roc gho dra dar ste fai */
      /* nor */ [1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, .5, 0,  1,  1, .5, 1],
      /* fir */ [1, .5, .5, 1,  2, 2,  1,  1,  1,  1,  1,  2, .5, 1, .5, 1,  2,  1],
      /* wat */ [1, 2, .5, 1, .5, 1,  1,  1,  2,  1,  1,  1,  2,  1, .5, 1,  1,  1],
      /* ele */ [1, 1,  2, .5, .5, 1,  1,  1, 0,  2,  1,  1,  1,  1, .5, 1,  1,  1],
      /* gra */ [1, .5, 2,  1, .5, 1,  1, .5, 2, .5, 1, .5, 2,  1, .5, 1, .5, 1],
      /* ice */ [1, .5, .5, 1,  2, .5, 1,  1,  2,  2,  1,  1,  1,  1,  2,  1, .5, 1],
      /* fig */ [2, 1,  1,  1,  1,  2,  1, .5, 1, .5, .5, .5, 2, 0,  1,  2,  2, .5],
      /* poi */ [1, 1,  1,  1,  2, 1,  1, .5, .5, 1,  1,  1, .5, .5, 1,  1, 0,  2],
      /* gro */ [1, 2,  1,  2, .5, 1,  1,  2,  1, 0,  1, .5, 2,  1,  1,  1,  2,  1],
      /* fly */ [1, 1,  1, .5, 2,  1,  2,  1,  1,  1,  1,  2, .5, 1,  1,  1, .5, 1],
      /* psy */ [1, 1,  1,  1,  1,  1,  2,  2,  1,  1, .5, 1,  1,  1,  1, 0, .5, 1],
      /* bug */ [1, .5, 1,  1,  2, 1, .5, .5, 1, .5, 2,  1,  1, .5, 1,  2, .5, .5],
      /* roc */ [1, 2,  1,  1,  1,  2, .5, 1, .5, 2,  1,  2,  1,  1,  1,  1, .5, 1],
      /* gho */ [0, 1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  1,  1,  2,  1, .5, 1,  1],
      /* dra */ [1, 1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  1, .5, 0],
      /* dar */ [1, 1,  1,  1,  1,  1, .5, 1,  1,  1,  2,  1,  1,  2,  1, .5, .5, .5],
      /* ste */ [1, .5, .5, .5, 1,  2,  1,  1,  1,  1,  1,  1,  2,  1,  1,  1, .5, 2],
      /* fai */ [1, .5, 1,  1,  1,  1,  2, .5, 1,  1,  1,  1,  1,  1,  2,  2, .5, 1],
    ],
    tcMoveType: null,
    tcType1: null,
    tcType2: null,
    showHowToUseModal: false,
    howToUseModalSection: null,
    activeTab: 'home',
    srActive: false,
    srStart: null,
    srTarget: null,
    srClicks: 0,
    srStartTime: null,
    srComplete: false,
    srTimer: null,
    srElapsed: 0,
    srCountdown: null,
    srCountdownTimer: null,
    srForfeitMsg: '',
    srStartTypes: ['pokemon'],
    srTargetTypes: ['move', 'ability'],
    showHowToUse: true,
    srCustomStart: null,
    srCustomTarget: null,
    srStartSearch: '',
    srStartResults: [],
    srTargetSearch: '',
    srTargetResults: [],
    srHistory: [],
    srHudExpanded: false,
    moves: [],
    moveChips: [],
    moveSearch: '',
    moveSortKey: 'learners',
    moveSortDir: 'desc',
    filteredMoves: [],
    moveShowAddMenu: false,
    recentlyViewed: [],
    abilities: [],
    abilityChips: [],
    abilitySearch: '',
    abilitySortKey: 'pokemon',
    abilitySortDir: 'desc',
    filteredAbilities: [],
    abilityShowAddMenu: false,
    showDetailView: null,
    detailItem: null,
    evolutionData: {},
    factsData: {},
    detailMoveSearch: '',
    detailPokemonSearch: '',
    detailAbilitySearch: '',

    // === Team Builder State ===
    team: Array(6).fill(null).map(() => ({
      pokemon: null,
      ability: '',
      item: '',
      nature: 'Hardy',
      teraType: 'Normal',
      level: 100,
      evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
      moves: ['', '', '', '']
    })),
    selectedSlot: 0,
    teamSearch: '',
    teamSearchResults: [],
    teamShowPokemonSearch: false,
    savedTeams: [],
    activeTeamIndex: 0,
    editingTeamNameIndex: null,
    showImportTextarea: false,
    importText: '',
    importWarning: null,
    itemShowDropdown: false,
    itemFiltered: [],
    natures: ['Hardy','Lonely','Brave','Adamant','Naughty','Bold','Docile','Relaxed','Impish','Lax','Timid','Hasty','Serious','Jolly','Naive','Modest','Mild','Quiet','Bashful','Rash','Calm','Gentle','Sassy','Careful','Quirky'],
    natureEffects: {Hardy:['–','–'],Lonely:['Atk','Def'],Brave:['Atk','Spe'],Adamant:['Atk','SpA'],Naughty:['Atk','SpD'],Bold:['Def','Atk'],Docile:['–','–'],Relaxed:['Def','Spe'],Impish:['Def','SpA'],Lax:['Def','SpD'],Timid:['Spe','Atk'],Hasty:['Spe','Def'],Serious:['–','–'],Jolly:['Spe','SpA'],Naive:['Spe','SpD'],Modest:['SpA','Atk'],Mild:['SpA','Def'],Quiet:['SpA','Spe'],Bashful:['–','–'],Rash:['SpA','SpD'],Calm:['SpD','Atk'],Gentle:['SpD','Def'],Sassy:['SpD','Spe'],Careful:['SpD','SpA'],Quirky:['–','–']},
    allItems: ['Absolite','Absorb Bulb','Adrenaline Orb','Aggronite','Air Balloon','Alakazite','Altarianite','Ampharosite','Amulet Coin','Assault Vest','Audinite','Banettite','Beedrillite','Berry Juice','Big Root','Binding Band','Black Belt','Black Glasses','Black Sludge','Blastoisinite','Blazikenite','Blunder Policy','Booster Energy','Bright Powder','Cameruptite','Cell Battery','Charcoal','Charizardite X','Charizardite Y','Choice Band','Choice Scarf','Choice Specs','Clear Amulet','Covert Cloak','Damp Rock','Destiny Knot','Diancite','Eject Button','Eject Pack','Electric Seed','Everstone','Eviolite','Expert Belt','Flame Orb','Float Stone','Focus Band','Focus Sash','Galladite','Ganlon Berry','Garchompite','Gardevoirite','Gengarite','Glalitite','Grassy Seed','Grip Claw','Gyaradosite','Hard Stone','Heat Rock','Heavy-Duty Boots','Heracronite','Houndoominite','Icy Rock','Iron Ball','Kangaskhanite','Kings Rock','Lagging Tail','Latiasite','Latiosite','Leppa Berry','Liechi Berry','Life Orb','Light Clay','Loaded Dice','Lopunnite','Lucarionite','Luck Incense','Lucky Egg','Lum Berry','Luminous Moss','Magnet','Manectite','Mawilite','Medichamite','Mental Herb','Metagrossite','Metal Coat','Metronome','Mewtwonite X','Mewtwonite Y','Miracle Seed','Mirror Herb','Misty Seed','Muscle Band','Mystic Water','Never-Melt Ice','Oran Berry','Petaya Berry','Pidgeotite','Pinsirite','Poison Barb','Power Herb','Psychic Seed','Punching Glove','Quick Claw','Razor Claw','Razor Fang','Red Card','Rocky Helmet','Room Service','Sablenite','Safety Goggles','Salac Berry','Salamencite','Sceptilite','Scizorite','Scope Lens','Sharp Beak','Sharpedonite','Shed Shell','Silk Scarf','Silver Powder','Sitrus Berry','Slowbronite','Smoke Ball','Smooth Rock','Snowball','Soft Sand','Spell Tag','Starf Berry','Steelixite','Sticky Barb','Swampertite','Terrain Extender','Throat Spray','Toxic Orb','Twisted Spoon','Tyranitarite','Utility Umbrella','Venusaurite','White Herb','Wide Lens','Wise Glasses','Zoom Lens'],

    // === Wallpaper State ===
    wpPokemon: null,
    wpSearch: '',
    wpFiltered: [],
    wpShowDropdown: false,
    wpDataUrl: null,
    wpGenerating: false,

    // === Collection State ===
    collection: [],
    collectionViewMode: 'collection',
    collectionRandomCards: [],
    collectionRandomLoading: false,
    collectionMainSort: 'price',
    collectionPokemonFiltered: [],
    collectionShowPokemonDropdown: false,
    collectionCardCache: (() => { try { return JSON.parse(localStorage.getItem('pokemonCardCache') || '{}'); } catch(e) { return {}; } })(),
    collectionSearchInput: '',
    collectionSort: 'date',
    collectionResults: [],
    collectionResultsSort: 'name',
    collectionApiLoading: false,
    collectionSearchError: null,
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

    // === Games State ===
    gmGame: 'whosthat',
    gmMode: 'daily',
    gmPokemon: null,
    gmGuesses: [],
    gmAttempts: 0,
    gmRevealed: false,
    gmMessage: '',
    gmMaxGuesses: 8,
    gmDailyDate: '',
    gmWtpSearch: '',
    gmWtpFiltered: [],
    gmPokedleSearch: '',
    gmPokedleFiltered: [],
    gmScore: 0,

    gmSubTab: 'games',

    checklistGens: [
      { title: 'Generation I', games: [['Red', 'Blue'], ['Yellow', null]] },
      { title: 'Generation II', games: [['Gold', 'Silver'], ['Crystal', null]] },
      { title: 'Generation III', games: [['Ruby', 'Sapphire'], ['Emerald', null], ['FireRed', 'LeafGreen']] },
      { title: 'Generation IV', games: [['Diamond', 'Pearl'], ['Platinum', null], ['HeartGold', 'SoulSilver']] },
      { title: 'Generation V', games: [['Black', 'White'], ['Black 2', 'White 2']] },
      { title: 'Generation VI', games: [['X', 'Y'], ['Omega Ruby', 'Alpha Sapphire']] },
      { title: 'Generation VII', games: [['Sun', 'Moon'], ['Ultra Sun', 'Ultra Moon'], ["Let's Go Pikachu", "Let's Go Eevee"]] },
      { title: 'Generation VIII', games: [['Sword', 'Shield'], ['Brilliant Diamond', 'Shining Pearl'], ['Legends: Arceus', null]] },
      { title: 'Generation IX', games: [['Scarlet', 'Violet'], ['Legends: Z-A', null]] },
    ],

    checklistState: (() => {
      const names = [
        'Red', 'Blue', 'Yellow',
        'Gold', 'Silver', 'Crystal',
        'Ruby', 'Sapphire', 'Emerald', 'FireRed', 'LeafGreen',
        'Diamond', 'Pearl', 'Platinum', 'HeartGold', 'SoulSilver',
        'Black', 'White', 'Black 2', 'White 2',
        'X', 'Y', 'Omega Ruby', 'Alpha Sapphire',
        'Sun', 'Moon', 'Ultra Sun', 'Ultra Moon', "Let's Go Pikachu", "Let's Go Eevee",
        'Sword', 'Shield', 'Brilliant Diamond', 'Shining Pearl', 'Legends: Arceus',
        'Scarlet', 'Violet', 'Legends: Z-A',
      ];
      const state = {};
      names.forEach(n => {
        try { state[n] = localStorage.getItem('pokemon_' + n) === 'true'; } catch (e) { state[n] = false; }
      });
      return state;
    })(),

    toolSubTab: 'types',

    // === Items State ===
    items: [],
    itemSearch: '',
    itemChips: [],
    itemSortKey: 'name',
    itemSortDir: 'asc',
    filteredItems: [],
    itemShowAddMenu: false,
    itemCategories: ['Battle', 'Berry', 'Choice', 'Evolution', 'Mega Stone', 'Misc', 'Type Boost'],
    itemDetailSearch: '',

    moveColumns: [
      { key: 'name', label: 'Move', sortable: true },
      { key: 'type', label: 'Type', sortable: true },
      { key: 'power', label: 'Power', sortable: true },
      { key: 'accuracy', label: 'Acc', sortable: true },
      { key: 'pp', label: 'PP', sortable: true },
      { key: 'priority', label: 'Priority', sortable: true },
      { key: 'damage_class', label: 'Category', sortable: false },
      { key: 'description', label: 'Description', sortable: false },
      { key: 'learners', label: 'Learners', sortable: true },
      { key: 'gen', label: 'Gen', sortable: true },
    ],

    columns: [
      { key: 'id', label: '#', sortable: true },
      { key: 'sprite', label: '', sortable: false },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'types', label: 'Types', sortable: false },
      { key: 'hp', label: 'HP', sortable: true },
      { key: 'attack', label: 'Attack', sortable: true },
      { key: 'defense', label: 'Defense', sortable: true },
      { key: 'special-attack', label: 'Sp.Atk', sortable: true },
      { key: 'special-defense', label: 'Sp.Def', sortable: true },
      { key: 'speed', label: 'Speed', sortable: true },
      { key: 'total', label: 'Total', sortable: true },
      { key: 'generation', label: 'Gen', sortable: true },
      { key: 'moves', label: 'Moves', sortable: true },
    ],

    abilityColumns: [
      { key: 'name', label: 'Ability', sortable: true },
      { key: 'description', label: 'Description', sortable: false },
      { key: 'pokemon', label: '# Pokémon', sortable: true },
      { key: 'generation', label: 'Gen', sortable: true },
    ],

    async init() {
      if (window.__POKEMON_DATA__) {
        this.pokemon = window.__POKEMON_DATA__;
        this.recompute();
      } else {
        const cached = localStorage.getItem('pokemonData');
        if (cached) {
          try {
            this.pokemon = JSON.parse(cached);
            this.recompute();
          } catch (e) {
            localStorage.removeItem('pokemonData');
          }
        }
      }
      if (this.pokemon.length === 0) {
        try {
          const resp = await fetch('pokemon-data.json');
          if (!resp.ok) throw new Error('not found');
          const data = await resp.json();
          this.pokemon = data;
          this.recompute();
        } catch (e) {
          console.warn('No pokemon data found.');
        }
      }
      this.computeMoves();
      if (window.__ABILITIES_DATA__) {
        this.abilities = window.__ABILITIES_DATA__;
        this.abilityRecompute();
      }
      if (window.__EVOLUTION_DATA__) {
        this.evolutionData = window.__EVOLUTION_DATA__;
      }
      if (window.__FACTS_DATA__) {
        this.factsData = window.__FACTS_DATA__;
      }
      if (window.__ITEMS_DATA__) {
        this.items = window.__ITEMS_DATA__;
        this.itemRecompute();
      }
      this.collectionLoad();
      try {
        const saved = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        this.recentlyViewed = saved;
      } catch (e) {}
      try {
        const saved = JSON.parse(localStorage.getItem('srHistory') || '[]');
        this.srHistory = saved;
      } catch (e) {}
      try {
        const saved = JSON.parse(localStorage.getItem('savedTeams') || '[]');
        if (Array.isArray(saved) && saved.length > 0 && saved[0].slots) {
          this.savedTeams = saved;
        } else {
          this.initDefaultTeams();
        }
      } catch (e) {
        this.initDefaultTeams();
      }
      this.team = this.savedTeams[0].slots;
      setInterval(() => this.persistSavedTeams(), 3000);
    },

    initDefaultTeams() {
      const slotTemplate = () => ({
        pokemon: null, ability: '', item: '', nature: 'Hardy',
        teraType: 'Normal', level: 100,
        evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
        moves: ['', '', '', '']
      });
      this.savedTeams = Array.from({ length: 10 }, (_, i) => ({
        name: `Team ${i + 1}`,
        slots: Array(6).fill(null).map(() => slotTemplate())
      }));
    },

    recompute() {
      let result = [...this.pokemon];

      if (this.search) {
        const q = this.search.toLowerCase();
        result = result.filter((p) => p.name.includes(q));
      }
      const groups = {};
      for (const chip of this.chips) {
        if (!groups[chip.type]) groups[chip.type] = [];
        groups[chip.type].push(chip);
      }

      for (const [type, chips] of Object.entries(groups)) {
        if (type === 'generation') {
          result = result.filter((p) => chips.some((c) => p.generation === parseInt(c.value)));
        } else if (type === 'stat') {
          result = result.filter((p) => chips.some((c) => {
            const val = parseInt(c.value) || 0;
            const key = c.stat;
            return c.operator === '>' ? p.stats[key] > val : p.stats[key] < val;
          }));
        } else if (type === 'move') {
          result = result.filter((p) => chips.some((c) => {
            const moveName = (c.value || '').toLowerCase().trim();
            return moveName && p.moves.some((m) => m.replace(/-/g, ' ').toLowerCase().startsWith(moveName));
          }));
        } else if (type === 'type') {
          result = result.filter((p) => chips.some((c) => {
            const t1 = (c.value || '').toLowerCase().trim();
            const t2 = (c.value2 || '').toLowerCase().trim();
            if (!t1) return false;
            if (!t2) return p.types.includes(t1);
            return p.types.includes(t1) && p.types.includes(t2);
          }));
        } else if (type === 'total') {
          result = result.filter((p) => chips.some((c) => {
            const val = parseInt(c.value) || 0;
            return c.operator === '>' ? this.statTotal(p) > val : this.statTotal(p) < val;
          }));
        } else if (type === 'stage') {
          result = result.filter((p) => chips.some((c) => this.getEvolutionStage(p.id) === parseInt(c.value)));
        } else if (type === 'evolved') {
          result = result.filter((p) => chips.some((c) => c.value === 'true' ? this.isFullyEvolved(p.id) : !this.isFullyEvolved(p.id)));
        } else if (type === 'starter') {
          result = result.filter((p) => chips.some((c) => c.value === 'true' ? this.isStarter(p.id) : !this.isStarter(p.id)));
        }
      }

      const key = this.sortKey;
      const dir = this.sortDir === 'asc' ? 1 : -1;
      result.sort((a, b) => {
        let va, vb;
        if (key === 'total') {
          va = this.statTotal(a);
          vb = this.statTotal(b);
        } else if (key === 'moves') {
          va = a.moves.length;
          vb = b.moves.length;
        } else if (['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'].includes(key)) {
          va = a.stats[key];
          vb = b.stats[key];
        } else if (key === 'name') {
          va = a.name;
          vb = b.name;
        } else {
          va = a[key];
          vb = b[key];
        }
        if (typeof va === 'string') return va.localeCompare(vb) * dir;
        return (va - vb) * dir;
      });

      this.filteredPokemon = result;
    },

    toggleSort(key) {
      if (this.sortKey === key) {
        if (this.sortDir === 'asc') {
          this.sortDir = 'desc';
        } else {
          this.sortKey = 'id';
          this.sortDir = 'asc';
        }
      } else {
        this.sortKey = key;
        this.sortDir = 'asc';
      }
      this.recompute();
    },

    addChip(type) {
      const chip = { type, editing: true };
      if (type === 'generation') {
        chip.value = '1';
      } else if (type === 'stat') {
        chip.stat = 'speed';
        chip.operator = '>';
        chip.value = '';
      } else if (type === 'move') {
        chip.value = '';
        chip.suggestions = [];
        chip.showDropdown = false;
      } else if (type === 'type') {
        chip.value = '';
        chip.value2 = '';
        chip.suggestions = [];
        chip.showDropdown = false;
      } else if (type === 'total') {
        chip.operator = '>';
        chip.value = '';
      } else if (type === 'stage') {
        chip.value = '1';
      } else if (type === 'evolved' || type === 'starter') {
        chip.value = 'true';
      }
      this.chips.push(chip);
      if (!chip.editing) this.recompute();
    },

    commitChip(chip) {
      chip.editing = false;
      this.recompute();
    },

    removeChip(index) {
      this.chips.splice(index, 1);
      this.recompute();
    },

    chipLabel(chip) {
      if (chip.type === 'generation') return `Gen ${chip.value}`;
      if (chip.type === 'stat') return `${this.statLabel(chip.stat)} ${chip.operator} ${chip.value || '?'}`;
      if (chip.type === 'move') return `Can learn ${chip.value || '...'}`;
      if (chip.type === 'type') {
        let label = `Type: ${this.capitalize(chip.value) || '...'}`;
        if (chip.value2) label += ` + ${this.capitalize(chip.value2)}`;
        return label;
      }
      if (chip.type === 'total') return `Total ${chip.operator} ${chip.value || '?'}`;
      if (chip.type === 'stage') return `Stage ${chip.value}`;
      if (chip.type === 'evolved') return 'Fully Evolved';
      if (chip.type === 'starter') return 'Starter';
      return '';
    },

    statLabel(key) {
      const map = {
        hp: 'HP', attack: 'Attack', defense: 'Defense',
        'special-attack': 'Sp.Atk', 'special-defense': 'Sp.Def', speed: 'Speed',
      };
      return map[key] || key;
    },

    natureLabel(n) {
      const e = this.natureEffects[n];
      if (!e || e[0] === '–') return n;
      return n + '  (+' + e[0] + ' \u2212' + e[1] + ')';
    },

    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    statBarWidth(stat) {
      return Math.round((stat / 255) * 100);
    },

    formatHeight(dm) {
      if (dm == null) return '\u2014';
      return (dm / 10).toFixed(1) + ' m';
    },

    formatWeight(hg) {
      if (hg == null) return '\u2014';
      return (hg / 10).toFixed(1) + ' kg';
    },

    filterSuggestions(chip) {
      const q = (chip.value || '').toLowerCase().trim();
      let source = [];
      if (chip.type === 'move') {
        source = this.moves.map(m => m.name).filter(n => n.replace(/-/g, ' ').toLowerCase().startsWith(q)).slice(0, 20);
      } else if (chip.type === 'type') {
        source = this.allTypes.filter(t => t.includes(q));
      } else if (chip.type === 'category') {
        source = ['physical', 'special', 'status'].filter(c => c.includes(q));
      }
      chip.suggestions = source;
      chip.showDropdown = source.length > 0;
    },

    selectSuggestion(chip, value) {
      chip.value = value;
      chip.showDropdown = false;
      chip.editing = false;
      if (chip.type === 'category') {
        this.moveRecompute();
      } else {
        this.recompute();
      }
    },

    spriteUrl(id) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    },

    onSpriteError(e, id) {
      if (e.target.src.includes('official-artwork')) return;
      e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    },

    statTotal(p) {
      return Object.values(p.stats).reduce((sum, v) => sum + v, 0);
    },

    signed(n) {
      return n > 0 ? '+' + n : String(n);
    },

    computeMoves() {
      const dataMap = {};
      if (window.__MOVES_DATA__) {
        for (const m of window.__MOVES_DATA__) dataMap[m.name] = m;
      }
      const map = {};
      for (const p of this.pokemon) {
        for (const m of p.moves) {
          if (!map[m]) {
            const entry = dataMap[m] || {};
            map[m] = {
              name: m, learners: 0, gen: 99, pokemon: [],
              type: entry.type || null,
              power: entry.power ?? null,
              accuracy: entry.accuracy ?? null,
              pp: entry.pp ?? null,
              damage_class: entry.damage_class || null,
              description: entry.description || null,
              priority: (window.__MOVES_PRIORITY__ || {})[m] ?? 0,
            };
          }
          map[m].learners++;
          map[m].pokemon.push(p.name);
          map[m].gen = Math.min(map[m].gen, p.generation);
        }
      }
      this.moves = Object.values(map).map((m) => ({ ...m, gen: m.gen === 99 ? 9 : m.gen }));
      this.moveRecompute();
    },

    moveRecompute() {
      let result = [...this.moves];
      if (this.moveSearch) {
        const q = this.moveSearch.toLowerCase();
        result = result.filter((m) => m.name.replace(/-/g, ' ').toLowerCase().startsWith(q));
      }
      const groups = {};
      for (const chip of this.moveChips) {
        if (!groups[chip.type]) groups[chip.type] = [];
        groups[chip.type].push(chip);
      }
      for (const [type, chips] of Object.entries(groups)) {
        if (type === 'type') {
          result = result.filter((m) => chips.some((c) => m.type === c.value));
        } else if (type === 'learners') {
          const val = parseInt(chips[0].value) || 0;
          result = result.filter((m) => m.learners >= val);
        } else if (type === 'pokemon') {
          const q = (chips[0].value || '').toLowerCase().trim();
          result = result.filter((m) => q && m.pokemon.some((p) => p.includes(q)));
        } else if (type === 'category') {
          result = result.filter((m) => m.damage_class === chips[0].value);
        } else if (type === 'power') {
          const val = parseInt(chips[0].value);
          if (!isNaN(val)) {
            result = result.filter((m) => m.power != null && (chips[0].operator === '>' ? m.power >= val : m.power <= val));
          }
        } else if (type === 'pp') {
          const val = parseInt(chips[0].value);
          if (!isNaN(val)) {
            result = result.filter((m) => m.pp != null && (chips[0].operator === '>' ? m.pp >= val : m.pp <= val));
          }
        } else if (type === 'accuracy') {
          const val = parseInt(chips[0].value);
          if (!isNaN(val)) {
            result = result.filter((m) => m.accuracy != null && (chips[0].operator === '>' ? m.accuracy >= val : m.accuracy <= val));
          }
        } else if (type === 'priority') {
          const val = parseInt(chips[0].value);
          if (!isNaN(val)) {
            result = result.filter((m) => m.priority != null && (chips[0].operator === '>' ? m.priority >= val : m.priority <= val));
          }
        }
      }
      const key = this.moveSortKey;
      const dir = this.moveSortDir === 'asc' ? 1 : -1;
      result.sort((a, b) => {
        let va = a[key], vb = b[key];
        if (key === 'name' || key === 'type') {
          va = va || '';
          vb = vb || '';
          return va.localeCompare(vb) * dir;
        }
        if (va == null) va = -Infinity;
        if (vb == null) vb = -Infinity;
        return (va - vb) * dir;
      });
      this.filteredMoves = result;
    },

    toggleMoveSort(key) {
      if (this.moveSortKey === key) {
        this.moveSortDir = this.moveSortDir === 'asc' ? 'desc' : 'asc';
      } else {
        this.moveSortKey = key;
        this.moveSortDir = 'asc';
      }
      this.moveRecompute();
    },

    addMoveChip(type) {
      const chip = { type, editing: true };
      if (type === 'type') {
        chip.value = 'fire';
      } else if (type === 'learners') {
        chip.value = '10';
      } else if (type === 'pokemon') {
        chip.value = '';
      } else if (type === 'category') {
        chip.value = '';
        chip.suggestions = [];
        chip.showDropdown = false;
      } else if (type === 'power' || type === 'pp' || type === 'accuracy' || type === 'priority') {
        chip.operator = '>';
        chip.value = '';
      }
      this.moveChips.push(chip);
      if (!chip.editing) this.moveRecompute();
    },

    commitMoveChip(chip) {
      chip.editing = false;
      this.moveRecompute();
    },

    removeMoveChip(index) {
      this.moveChips.splice(index, 1);
      this.moveRecompute();
    },

    moveChipLabel(chip) {
      if (chip.type === 'type') return `Type: ${this.capitalize(chip.value)}`;
      if (chip.type === 'learners') return `≥ ${chip.value} learners`;
      if (chip.type === 'pokemon') return `Learned by ${this.capitalize(chip.value) || '...'}`;
      if (chip.type === 'category') return `Category: ${this.capitalize(chip.value)}`;
      if (chip.type === 'power') return `Power ${chip.operator === '>' ? '≥' : '≤'} ${chip.value || '?'}`;
      if (chip.type === 'pp') return `PP ${chip.operator === '>' ? '≥' : '≤'} ${chip.value || '?'}`;
      if (chip.type === 'accuracy') return `Accuracy ${chip.operator === '>' ? '≥' : '≤'} ${chip.value || '?'}`;
      if (chip.type === 'priority') return `Priority ${chip.operator === '>' ? '≥' : '≤'} ${chip.value || '?'}`;
      return '';
    },

    abilityRecompute() {
      let result = [...this.abilities];
      if (this.abilitySearch) {
        const q = this.abilitySearch.toLowerCase();
        result = result.filter((a) => a.name.includes(q));
      }
      const groups = {};
      for (const chip of this.abilityChips) {
        if (!groups[chip.type]) groups[chip.type] = [];
        groups[chip.type].push(chip);
      }
      for (const [type, chips] of Object.entries(groups)) {
        if (type === 'generation') {
          result = result.filter((a) => chips.some((c) => a.generation === parseInt(c.value)));
        } else if (type === 'pokemon') {
          const q = (chips[0].value || '').toLowerCase().trim();
          result = result.filter((a) => q && a.pokemon.some((p) => p.includes(q)));
        }
      }
      const key = this.abilitySortKey;
      const dir = this.abilitySortDir === 'asc' ? 1 : -1;
      result.sort((a, b) => {
        if (key === 'name') return a.name.localeCompare(b.name) * dir;
        if (key === 'pokemon') return (a.pokemon.length - b.pokemon.length) * dir;
        if (key === 'generation') return ((a.generation || 99) - (b.generation || 99)) * dir;
        return ((a[key] || '') < (b[key] || '') ? -1 : 1) * dir;
      });
      this.filteredAbilities = result;
    },

    toggleAbilitySort(key) {
      if (this.abilitySortKey === key) {
        this.abilitySortDir = this.abilitySortDir === 'asc' ? 'desc' : 'asc';
      } else {
        this.abilitySortKey = key;
        this.abilitySortDir = 'asc';
      }
      this.abilityRecompute();
    },

    addAbilityChip(type) {
      const chip = { type, editing: true };
      if (type === 'generation') {
        chip.value = '1';
      } else if (type === 'pokemon') {
        chip.value = '';
      }
      this.abilityChips.push(chip);
      if (!chip.editing) this.abilityRecompute();
    },

    commitAbilityChip(chip) {
      chip.editing = false;
      this.abilityRecompute();
    },

    removeAbilityChip(index) {
      this.abilityChips.splice(index, 1);
      this.abilityRecompute();
    },

    abilityChipLabel(chip) {
      if (chip.type === 'generation') return `Gen ${chip.value}`;
      if (chip.type === 'pokemon') return `Pokémon: ${this.capitalize(chip.value) || '...'}`;
      return '';
    },

    dailyIndex(arr) {
      if (!arr || !arr.length) return 0;
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const dayOfYear = Math.floor((now - start) / 86400000);
      return dayOfYear % arr.length;
    },

    addToRecentlyViewed(type, name) {
      this.recentlyViewed = this.recentlyViewed.filter(r => !(r.type === type && r.name === name));
      this.recentlyViewed.unshift({ type, name });
      if (this.recentlyViewed.length > 10) this.recentlyViewed = this.recentlyViewed.slice(0, 10);
      try { localStorage.setItem('recentlyViewed', JSON.stringify(this.recentlyViewed)); } catch (e) {}
    },

    openFromRecentlyViewed(item) {
      if (item.type === 'pokemon') {
        const p = this.pokemon.find(pok => pok.name === item.name);
        if (p) { this.activeTab = 'pokemon'; this.openPokemonDetail(p); }
      } else if (item.type === 'move') {
        const m = this.moves.find(mov => mov.name === item.name);
        if (m) { this.activeTab = 'moves'; this.openMoveDetail(m); }
      } else if (item.type === 'ability') {
        const a = this.abilities.find(ab => ab.name === item.name);
        if (a) { this.activeTab = 'abilities'; this.openAbilityDetail(a); }
      }
    },

    openAbilityDetail(a) {
      this.showDetailView = 'ability';
      this.detailItem = a;
      this.detailAbilitySearch = '';
      this.addToRecentlyViewed('ability', a.name);
      this.srCheck({ type: 'ability', id: a.id, name: a.name });
    },

    openAbilityFromDetail(abilityName) {
      const ability = this.abilities.find(a => a.name === abilityName);
      if (ability) {
        this.activeTab = 'abilities';
        this.openAbilityDetail(ability);
      }
    },

    startResize(e, key) {
      const th = e.target.parentElement;
      const startX = e.clientX;
      const startWidth = th.offsetWidth;

      document.documentElement.style.cursor = 'col-resize';
      document.documentElement.style.userSelect = 'none';

      const onMove = (e) => {
        const w = Math.max(30, startWidth + (e.clientX - startX));
        th.style.width = `${Math.round(w)}px`;
      };

      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.documentElement.style.cursor = '';
        document.documentElement.style.userSelect = '';
        this.colWidths[key] = th.offsetWidth;
        this.saveColWidths();
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },

    saveColWidths() {
      try {
        localStorage.setItem('pokemonColWidths', JSON.stringify(this.colWidths));
      } catch (e) {}
    },

    openPokemonDetail(p) {
      this.showDetailView = 'pokemon';
      this.detailItem = p;
      this.detailPokemonSearch = '';
      this.addToRecentlyViewed('pokemon', p.name);
      this.srCheck({ type: 'pokemon', id: p.id, name: p.name });
    },

    srFormat(ms) {
      const s = Math.floor(ms / 1000);
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return m + ':' + (sec < 10 ? '0' : '') + sec;
    },

    srLabel(entity) {
      if (!entity) return '';
      const name = entity.name.replace(/-/g, ' ');
      return '#' + entity.id + ' ' + name.charAt(0).toUpperCase() + name.slice(1);
    },

    srPick(types) {
      const pool = [];
      if (types.includes('pokemon')) { for (const p of this.pokemon) pool.push({ type: 'pokemon', id: p.id, name: p.name }); }
      if (types.includes('move')) { for (const m of this.moves) pool.push({ type: 'move', id: m.id || m.name, name: m.name }); }
      if (types.includes('ability')) { for (const a of this.abilities) pool.push({ type: 'ability', id: a.id || a.name, name: a.name }); }
      return pool;
    },

    srNew() {
      if (this.srTimer) clearInterval(this.srTimer);
      if (this.srCountdownTimer) clearInterval(this.srCountdownTimer);
      let start, target;
      if (this.srCustomStart && this.srCustomTarget) {
        start = this.srCustomStart;
        target = this.srCustomTarget;
      } else {
        const startPool = this.srPick(this.srStartTypes);
        if (!startPool.length) return;
        start = startPool[Math.floor(Math.random() * startPool.length)];
        const candidates = [];
        if (start.type === 'pokemon') {
          const p = this.pokemon.find(x => x.id === start.id);
          if (p) {
            for (const mName of p.moves) {
              const m = this.moves.find(x => x.name === mName);
              if (m) candidates.push({ type: 'move', id: m.name, name: m.name });
            }
            for (const aName of p.abilities) {
              const a = this.abilities.find(x => x.name === aName);
              if (a) candidates.push({ type: 'ability', id: a.name, name: a.name });
            }
          }
        }
        if (candidates.length) {
          target = candidates[Math.floor(Math.random() * candidates.length)];
        } else {
          const targetPool = this.srPick(this.srTargetTypes);
          if (!targetPool.length) return;
          do {
            target = targetPool[Math.floor(Math.random() * targetPool.length)];
          } while (start.type === target.type && start.name === target.name);
        }
      }
      this.srStart = start;
      this.srTarget = target;
      this.srClicks = 0;
      this.srComplete = false;
      this.srElapsed = 0;
      this.srActive = false;
      this.srForfeitMsg = '';
      this.srCountdown = 10;
      this.srNavigate(start);
      this.srCountdownTimer = setInterval(() => {
        this.srCountdown--;
        if (this.srCountdown <= 0) {
          clearInterval(this.srCountdownTimer);
          this.srCountdownTimer = null;
          this.srCountdown = null;
          this.srBegin();
        }
      }, 1000);
    },

    srBegin() {
      this.srActive = true;
      this.srStartTime = Date.now();
      this.srTimer = setInterval(() => { this.srElapsed = Date.now() - this.srStartTime; }, 100);
    },

    srSkipCountdown() {
      if (!this.srCountdown) return;
      if (this.srCountdownTimer) clearInterval(this.srCountdownTimer);
      this.srCountdownTimer = null;
      this.srCountdown = null;
      this.srBegin();
    },

    srNavigate(entity) {
      if (entity.type === 'pokemon') {
        const p = this.pokemon.find(x => x.id === entity.id);
        if (p) this.openPokemonFromDetail(p.name);
      } else if (entity.type === 'move') {
        const m = this.moves.find(x => x.name === entity.name);
        if (m) this.openMoveFromDetail(m.name);
      } else if (entity.type === 'ability') {
        const a = this.abilities.find(x => x.name === entity.name);
        if (a) this.openAbilityFromDetail(a.name);
      }
    },

    srFilter(q, types) {
      if (!q) return [];
      const lower = q.toLowerCase();
      const pool = this.srPick(types);
      return pool.filter(e => e.name.includes(lower)).slice(0, 20);
    },

    srPickCustom(target) {
      if (target === 'start') {
        this.srStartResults = this.srFilter(this.srStartSearch, this.srStartTypes);
      } else {
        this.srTargetResults = this.srFilter(this.srTargetSearch, this.srTargetTypes);
      }
    },

    srSelectCustom(target, entity) {
      if (target === 'start') {
        this.srCustomStart = entity;
        this.srStartSearch = entity.name;
        this.srStartResults = [];
      } else {
        this.srCustomTarget = entity;
        this.srTargetSearch = entity.name;
        this.srTargetResults = [];
      }
    },

    srClearCustom(target) {
      if (target === 'start') {
        this.srCustomStart = null;
        this.srStartSearch = '';
        this.srStartResults = [];
      } else {
        this.srCustomTarget = null;
        this.srTargetSearch = '';
        this.srTargetResults = [];
      }
    },

    srHasCustom() {
      return this.srCustomStart && this.srCustomTarget &&
        this.srCustomStart.type === this.srCustomTarget.type &&
        this.srCustomStart.name === this.srCustomTarget.name;
    },

    srForfeit() {
      if (this.srTimer) clearInterval(this.srTimer);
      if (this.srCountdownTimer) clearInterval(this.srCountdownTimer);
      this.srTimer = null;
      this.srCountdownTimer = null;
      this.srActive = false;
      this.srCountdown = null;
      this.srStart = null;
      this.srTarget = null;
      this.srClicks = 0;
      this.srElapsed = 0;
      this.srComplete = false;
      this.srForfeitMsg = 'Forfeited! Click Start Run to try again.';
      setTimeout(() => { this.srForfeitMsg = ''; }, 3000);
    },

    switchTab(tab) {
      if (this.srActive) {
        this.srForfeit();
      }
      this.activeTab = tab;
    },

    srCheck(entity) {
      try {
        if (!this.srActive || this.srComplete) return;
        this.srClicks++;
        if (entity.type === this.srTarget.type && entity.name === this.srTarget.name) {
          this.srComplete = true;
          this.srElapsed = Date.now() - this.srStartTime;
          this.srHistory.unshift({
            start: { type: this.srStart.type, id: this.srStart.id, name: this.srStart.name },
            target: { type: this.srTarget.type, id: this.srTarget.id, name: this.srTarget.name },
            clicks: this.srClicks,
            elapsed: this.srElapsed,
            mode: this.srCustomStart && this.srCustomTarget ? 'custom' : 'random',
          });
          if (this.srHistory.length > 50) this.srHistory.length = 50;
          try { localStorage.setItem('srHistory', JSON.stringify(this.srHistory)); } catch (e) {}
          if (this.srTimer) clearInterval(this.srTimer);
          this.srTimer = null;
          this.activeTab = 'speedrun';
          setTimeout(() => {
            this.srStart = null;
            this.srTarget = null;
            this.srClicks = 0;
            this.srElapsed = 0;
            this.srComplete = false;
          }, 3000);
        }
      } catch (e) {}
    },

    srLabelType(type) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    },

    openMoveDetail(m) {
      this.showDetailView = 'move';
      this.detailItem = m;
      this.detailMoveSearch = '';
      this.addToRecentlyViewed('move', m.name);
      this.srCheck({ type: 'move', id: m.id, name: m.name });
    },

    closeDetail() {
      this.showDetailView = null;
      this.detailItem = null;
    },

    openMoveFromDetail(moveName) {
      const move = this.moves.find(m => m.name === moveName);
      if (move) {
        this.activeTab = 'moves';
        this.openMoveDetail(move);
      }
    },

    openPokemonFromDetail(pokemonName) {
      const pokemon = this.pokemon.find(p => p.name === pokemonName);
      if (pokemon) {
        this.activeTab = 'pokemon';
        this.openPokemonDetail(pokemon);
      }
    },

    getEvolutionChain(id) {
      const entry = this.evolutionData[id];
      return entry ? entry.chain : null;
    },

    getEvolutionStage(id) {
      const chain = this.getEvolutionChain(id);
      if (!chain) return 1;
      for (let i = 0; i < chain.length; i++) {
        if (chain[i].some(e => e.id === id)) return i + 1;
      }
      return 1;
    },

    isFullyEvolved(id) {
      const chain = this.getEvolutionChain(id);
      if (!chain || !chain.length) return true;
      return chain[chain.length - 1].some(e => e.id === id);
    },

    isStarter(id) {
      return [1,4,7,152,155,158,252,255,258,387,390,393,495,498,501,650,653,656,722,725,728,810,813,816,906,909,912].includes(id);
    },

    // === Team Builder Methods ===

    selectSlot(index) {
      this.selectedSlot = index;
    },

    openTeamPokemonSearch() {
      this.teamShowPokemonSearch = true;
      this.teamSearch = '';
      this.teamSearchResults = [];
    },

    closeTeamPokemonSearch() {
      this.teamShowPokemonSearch = false;
      this.teamSearch = '';
      this.teamSearchResults = [];
    },

    teamRecompute() {
      if (!this.teamSearch) {
        this.teamSearchResults = [];
        return;
      }
      const q = this.teamSearch.toLowerCase().trim();
      this.teamSearchResults = this.pokemon.filter(p => p.name.includes(q) && !p.name.includes('-mega')).slice(0, 30);
    },

    selectTeamPokemon(pokemon) {
      const slot = this.team[this.selectedSlot];
      slot.pokemon = pokemon;
      slot.ability = pokemon.abilities && pokemon.abilities.length ? pokemon.abilities[0] : '';
      slot.moves = ['', '', '', ''];
      slot.evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
      slot.ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
      this.closeTeamPokemonSearch();
      this.persistSavedTeams();
    },

    getTeamMoveOptions(slot) {
      const moves = slot.pokemon ? [...slot.pokemon.moves] : [];
      for (const m of slot.moves) {
        if (m && !moves.includes(m)) moves.push(m);
      }
      return moves;
    },

    removeTeamPokemon(index) {
      this.team[index] = {
        pokemon: null, ability: '', item: '', nature: 'Hardy',
        teraType: 'Normal', level: 100,
        evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
        moves: ['', '', '', '']
      };
      this.selectedSlot = index;
      this.persistSavedTeams();
    },

    evTotal(slot) {
      const e = slot.evs || {};
      return (e.hp || 0) + (e.atk || 0) + (e.def || 0) + (e.spa || 0) + (e.spd || 0) + (e.spe || 0);
    },

    maxEvForStat(slot, stat) {
      const current = this.evTotal(slot);
      const oldVal = slot.evs[stat] || 0;
      const remaining = 510 - current + oldVal;
      return Math.min(252, Math.max(0, remaining));
    },

    updateEv(slot, stat, value) {
      const num = Math.min(252, Math.max(0, parseInt(value) || 0));
      const maxAllowed = this.maxEvForStat(slot, stat);
      slot.evs[stat] = Math.max(0, Math.min(num, maxAllowed));
    },

    teamDefenseAnalysis() {
      const chart = {};
      for (const t of this.allTypes) {
        chart[t] = { weak: 0, resist: 0, immune: 0 };
      }
      for (const slot of this.team) {
        if (!slot.pokemon) continue;
        const types = slot.pokemon.types || [];
        for (const t of this.allTypes) {
          const mult = this.typeEffectiveness(t, types);
          if (mult === 0) chart[t].immune++;
          else if (mult > 1) chart[t].weak++;
          else if (mult < 1) chart[t].resist++;
        }
      }
      return chart;
    },

    teamOffensiveCoverage() {
      const se = new Set();
      for (const slot of this.team) {
        if (!slot.pokemon) continue;
        for (const moveName of slot.moves) {
          if (!moveName) continue;
          const move = this.moves.find(m => m.name === moveName);
          if (!move || !move.type) continue;
          for (const t of this.allTypes) {
            const mult = this.typeEffectiveness(move.type, [t]);
            if (mult > 1) se.add(t);
          }
        }
      }
      return [...se].sort();
    },

    typeEffectiveness(moveType, defenderTypes) {
      const chart = {
        normal: { rock: 0.5, ghost: 0, steel: 0.5 },
        fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
        water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
        electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
        grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
        ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
        fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
        poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
        ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
        flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
        psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
        bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
        rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
        ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
        dragon: { fire: 0.5, water: 0.5, electric: 0.5, grass: 0.5, dragon: 2, steel: 0.5, fairy: 0 },
        dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
        steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
        fairy: { fire: 0.5, poison: 0.5, fighting: 2, dragon: 2, dark: 2, steel: 0.5 }
      };
      let mult = 1;
      for (const dt of defenderTypes) {
        if (chart[moveType] && chart[moveType][dt] !== undefined) {
          mult *= chart[moveType][dt];
        }
      }
      return mult;
    },

    teamHasMember() {
      return this.team.some(s => s.pokemon !== null);
    },

    teamAvgBst() {
      const members = this.team.filter(s => s.pokemon);
      if (!members.length) return 0;
      const total = members.reduce((sum, s) => {
        return sum + Object.values(s.pokemon.stats).reduce((a, b) => a + b, 0);
      }, 0);
      return Math.round(total / members.length);
    },

    exportShowdown() {
      const lines = [];
      for (const slot of this.team) {
        if (!slot.pokemon) continue;
        const poke = slot.pokemon;
        const name = poke.name.charAt(0).toUpperCase() + poke.name.slice(1);
        const item = slot.item || '';
        const ability = slot.ability ? slot.ability.charAt(0).toUpperCase() + slot.ability.slice(1) : '';
        const evStr = 'EVs: ' + Object.entries(slot.evs).filter(([_,v]) => v > 0).map(([k,v]) => {
          const labels = { hp: 'HP', atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe' };
          return v + ' ' + (labels[k] || k);
        }).join(' / ');
        const ivStr = 'IVs: ' + Object.entries(slot.ivs).filter(([_,v]) => v < 31).map(([k,v]) => {
          const labels = { hp: 'HP', atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe' };
          return v + ' ' + (labels[k] || k);
        }).join(' / ');
        const nature = slot.nature;
        const moves = slot.moves.filter(Boolean).map(m => {
          const parts = m.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
          return '- ' + parts;
        });
        lines.push(name + (item ? ' @ ' + item : ''));
        if (ability) lines.push('Ability: ' + ability);
        if (slot.level !== 100) lines.push('Level: ' + slot.level);
        if (slot.evs && Object.values(slot.evs).some(v => v > 0)) lines.push(evStr);
        if (slot.ivs && Object.values(slot.ivs).some(v => v < 31)) lines.push(ivStr);
        if (nature && nature !== 'Hardy') lines.push(nature + ' Nature');
        lines.push('Tera Type: ' + (slot.teraType ? slot.teraType.charAt(0).toUpperCase() + slot.teraType.slice(1) : 'Normal'));
        lines.push(...moves);
        lines.push('');
      }
      const text = lines.join('\n');
      navigator.clipboard.writeText(text).catch(() => {});
      return text;
    },

    importShowdown(text) {
      this.importWarning = null;
      this.team = Array(6).fill(null).map(() => ({
        pokemon: null, ability: '', item: '', nature: 'Hardy', teraType: 'Normal', level: 100,
        evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
        moves: ['', '', '', '']
      }));
      text = text.replace(/ {2,}/g, '\n');
      const rawLines = text.split('\n');
      let currentSlot = -1;
      const warnings = [];
      for (let li = 0; li < rawLines.length; li++) {
        const trimmed = rawLines[li].trim();
        if (!trimmed) continue;
        if (trimmed.startsWith('---')) continue;

        const fieldCheck = (fn) => {
          if (currentSlot < 0 || currentSlot >= 6) return false;
          const slot = this.team[currentSlot];
          if (!slot) return false;
          return fn(slot, trimmed);
        };

        let handled = false;

        if (!handled) { const m = trimmed.match(/^Ability:\s*(.+)/i); if (m) { handled = fieldCheck((slot, v) => { slot.ability = m[1].trim().toLowerCase(); return true; }); } }
        if (!handled) { const m = trimmed.match(/^Level:\s*(\d+)/i); if (m) { handled = fieldCheck((slot, v) => { slot.level = parseInt(m[1]); return true; }); } }
        if (!handled) { const m = trimmed.match(/^EVs:\s*(.+)/i); if (m) { handled = fieldCheck((slot, v) => {
          const labs = { HP: 'hp', Atk: 'atk', Def: 'def', SpA: 'spa', SpD: 'spd', Spe: 'spe' };
          slot.evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
          m[1].split('/').forEach(p => {
            const pm = p.trim().match(/(\d+)\s+(HP|Atk|Def|SpA|SpD|Spe)/i);
            if (pm) slot.evs[labs[pm[2]] || 'hp'] = parseInt(pm[1]);
          });
          return true;
        }); } }
        if (!handled) { const m = trimmed.match(/^IVs:\s*(.+)/i); if (m) { handled = fieldCheck((slot, v) => {
          const labs = { HP: 'hp', atk: 'atk', def: 'def', SpA: 'spa', SpD: 'spd', Spe: 'spe' };
          slot.ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
          m[1].split('/').forEach(p => {
            const pm = p.trim().match(/(\d+)\s+(HP|Atk|Def|SpA|SpD|Spe)/i);
            if (pm) slot.ivs[labs[pm[2]] || 'hp'] = parseInt(pm[1]);
          });
          return true;
        }); } }
        if (!handled) { const m = trimmed.match(/^Tera\s+Type:\s*(.+)/i); if (m) { handled = fieldCheck((slot, v) => {
          const t = m[1].trim().toLowerCase();
          slot.teraType = this.allTypes.find(tp => tp === t) || 'Normal';
          return true;
        }); } }
        if (!handled) { const m = trimmed.match(/^Shiny:\s*(.+)/i); if (m) { handled = true; } }
        if (!handled) { const m = trimmed.match(/^([A-Z][a-z]+)\s+Nature$/i); if (m) { handled = fieldCheck((slot, v) => { slot.nature = m[1]; return true; }); } }
        if (!handled) { const m = trimmed.match(/^-\s*(.+)/); if (m) { handled = fieldCheck((slot, v) => {
          const moveName = m[1].trim().toLowerCase().replace(/\s+/g, '-');
          const firstEmpty = slot.moves.indexOf('');
          if (firstEmpty !== -1) slot.moves[firstEmpty] = moveName;
          return true;
        }); } }

        if (handled) continue;

        const atIdx = trimmed.indexOf(' @ ');
        const namePart = atIdx !== -1 ? trimmed.slice(0, atIdx).trimEnd() : trimmed;
        const itemPart = atIdx !== -1 ? trimmed.slice(atIdx + 3).trim() : '';
        const pokeMatch = namePart.match(/^([A-Za-z\u00E0-\u00FC'.\s-]+?)(?:\s+\([MF]\))?\s*$/i);
        if (pokeMatch) {
          currentSlot++;
          if (currentSlot >= 6) break;
          let name = pokeMatch[1].toLowerCase().replace(/\s+/g, '-');
          let pokemon = this.pokemon.find(p => p.name === name);
          if (!pokemon && name.endsWith('-mega')) {
            const base = name.replace(/-mega-\w+$/, '').replace(/-mega$/, '');
            pokemon = this.pokemon.find(p => p.name === base);
          }
          if (!pokemon) warnings.push('Line ' + (li + 1) + ': Unknown Pokémon "' + pokeMatch[1].trim() + '"');
          this.team[currentSlot] = {
            pokemon: pokemon || null,
            ability: '',
            item: itemPart,
            nature: 'Hardy',
            teraType: 'Normal',
            level: 100,
            evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
            ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
            moves: ['', '', '', '']
          };
          if (pokemon && pokemon.abilities && pokemon.abilities.length) {
            this.team[currentSlot].ability = pokemon.abilities[0];
          }
          continue;
        }

        if (currentSlot >= 0 && currentSlot < 6) {
          warnings.push('Line ' + (li + 1) + ': Unrecognized "' + trimmed + '"');
        }
      }
      if (warnings.length) this.importWarning = warnings.join('\n');
      this.selectedSlot = 0;
    },

    selectTeam(index) {
      this.savedTeams[this.activeTeamIndex].slots = this.team;
      this.activeTeamIndex = index;
      this.team = this.savedTeams[index].slots;
      this.selectedSlot = 0;
      this.persistSavedTeams();
    },

    startEditTeamName() {
      this.editingTeamNameIndex = this.activeTeamIndex;
    },

    renameTeam(index, newName) {
      if (newName && newName.trim()) {
        this.savedTeams[index].name = newName.trim();
        this.persistSavedTeams();
      }
      this.editingTeamNameIndex = null;
    },

    persistSavedTeams() {
      this.savedTeams[this.activeTeamIndex].slots = this.team;
      try { localStorage.setItem('savedTeams', JSON.stringify(this.savedTeams)); } catch (e) {}
    },

    // === Games Methods ===

    gmDailySeed() {
      const d = new Date();
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    },

    gmPickPokemon(mode) {
      const pool = this.pokemon.filter(p => !p.name.includes('-mega') && !p.name.includes('-gmax') && !p.name.includes('-totem'));
      if (mode === 'daily') {
        const seed = this.gmDailySeed();
        let hash = 0;
        for (let i = 0; i < seed.length; i++) { hash = ((hash << 5) - hash) + seed.charCodeAt(i); hash |= 0; }
        return pool[Math.abs(hash) % pool.length];
      } else {
        return pool[Math.floor(Math.random() * pool.length)];
      }
    },

    gmReset() {
      this.gmGuesses = [];
      this.gmAttempts = 0;
      this.gmRevealed = false;
      this.gmMessage = '';
      this.gmWtpSearch = '';
      this.gmWtpFiltered = [];
      this.gmPokedleSearch = '';
      this.gmPokedleFiltered = [];
    },

    gmStartGame(game, mode) {
      this.gmGame = game;
      this.gmMode = mode;
      this.gmReset();
      this.gmPokemon = this.gmPickPokemon(mode);
      this.gmDailyDate = this.gmDailySeed();
    },

    gmWtpSearchInput() {
      const q = this.gmWtpSearch.toLowerCase().trim();
      if (!q) { this.gmWtpFiltered = []; return; }
      this.gmWtpFiltered = this.pokemon
        .filter(p => !p.name.includes('-mega') && !p.name.includes('-gmax') && !p.name.includes('-totem'))
        .filter(p => p.name.replace(/-/g, ' ').toLowerCase().startsWith(q))
        .slice(0, 8);
    },

    gmWtpGuess(name) {
      if (this.gmRevealed) return;
      const guess = name.toLowerCase().trim().replace(/\s+/g, '-');
      if (guess === this.gmPokemon.name) {
        this.gmRevealed = true;
        this.gmAttempts++;
        const pts = this.gmAttempts <= 1 ? 3 : this.gmAttempts <= 2 ? 2 : 1;
        this.gmScore += pts;
        this.gmMessage = "Correct! It's " + this.capitalize(this.gmPokemon.name.replace(/-/g, ' ')) + '! +' + pts + ' pts';
        return;
      }
      this.gmAttempts++;
      if (this.gmAttempts >= 6) {
        this.gmRevealed = true;
        this.gmMessage = 'Out of attempts! It was ' + this.capitalize(this.gmPokemon.name.replace(/-/g, ' ')) + '.';
        return;
      }
      this.gmMessage = 'Wrong! Try again.';
    },

    gmPokedleSearchInput() {
      const q = this.gmPokedleSearch.toLowerCase().trim();
      if (!q) { this.gmPokedleFiltered = []; return; }
      this.gmPokedleFiltered = this.pokemon
        .filter(p => !p.name.includes('-mega') && !p.name.includes('-gmax') && !p.name.includes('-totem'))
        .filter(p => p.name.replace(/-/g, ' ').toLowerCase().startsWith(q))
        .slice(0, 10);
    },

    gmPokedleGuess(name) {
      if (this.gmRevealed) return;
      const guessName = name.toLowerCase().trim().replace(/\s+/g, '-');
      if (this.gmGuesses.some(g => g.name === guessName)) {
        this.gmMessage = 'You already guessed that!';
        return;
      }
      const guessPkm = this.pokemon.find(p => p.name === guessName);
      if (!guessPkm) {
        this.gmMessage = 'Not a valid Pokémon!';
        return;
      }
      const target = this.gmPokemon;
      const result = {
        name: guessName,
        id: guessPkm.id,
        type1: guessPkm.types[0],
        type2: guessPkm.types[1] || null,
        gen: guessPkm.generation,
        height: guessPkm.height,
        weight: guessPkm.weight,
        matchType1: guessPkm.types[0] === target.types[0] || guessPkm.types[0] === (target.types[1] || ''),
        matchType2: !!(guessPkm.types[1] && (guessPkm.types[1] === target.types[0] || guessPkm.types[1] === target.types[1])),
        matchGen: guessPkm.generation === target.generation,
        genDir: guessPkm.generation > target.generation ? 'down' : guessPkm.generation < target.generation ? 'up' : 'same',
        matchHeight: guessPkm.height === target.height,
        heightDir: guessPkm.height > target.height ? 'down' : guessPkm.height < target.height ? 'up' : 'same',
        heightDiff: Math.abs(guessPkm.height - target.height) * 10,
        matchWeight: guessPkm.weight === target.weight,
        weightDir: guessPkm.weight > target.weight ? 'down' : guessPkm.weight < target.weight ? 'up' : 'same',
        weightDiff: Math.abs(guessPkm.weight - target.weight) / 10,
        correct: guessName === target.name,
      };
      this.gmGuesses.unshift(result);
      if (result.correct) {
        this.gmRevealed = true;
        this.gmMessage = "Correct! It's " + this.capitalize(target.name.replace(/-/g, ' ')) + '!';
        return;
      }
      if (this.gmGuesses.length >= this.gmMaxGuesses) {
        this.gmRevealed = true;
        this.gmMessage = 'Out of guesses! It was ' + this.capitalize(target.name.replace(/-/g, ' ')) + '.';
      }
    },

    checklistDone(name) {
      return !!this.checklistState[name];
    },

    checklistToggle(name, checked) {
      this.checklistState[name] = checked;
      try { localStorage.setItem('pokemon_' + name, checked); } catch (e) {}
    },

    checklistProgress() {
      let completed = 0;
      let total = 0;
      this.checklistGens.forEach(g => {
        g.games.forEach(game => {
          total++;
          if (this.checklistDone(game[0])) completed++;
        });
      });
      return completed + ' / ' + total + ' Games Completed';
    },

    checklistReset() {
      if (!confirm('Reset all progress?')) return;
      this.checklistState = {};
      this.checklistGens.forEach(g => {
        g.games.forEach(game => {
          try { localStorage.removeItem('pokemon_' + game[0]); } catch (e) {}
        });
      });
    },

    // === Items Methods ===

    itemRecompute() {
      let result = [...this.items];
      if (this.itemSearch) {
        const q = this.itemSearch.toLowerCase();
        result = result.filter(i => i.name.toLowerCase().includes(q));
      }
      const groups = {};
      for (const chip of this.itemChips) {
        if (!groups[chip.type]) groups[chip.type] = [];
        groups[chip.type].push(chip);
      }
      for (const [type, chips] of Object.entries(groups)) {
        if (type === 'category') {
          result = result.filter(i => chips.some(c => i.category === c.value));
        }
      }
      const key = this.itemSortKey;
      const dir = this.itemSortDir === 'asc' ? 1 : -1;
      result.sort((a, b) => {
        const va = a[key] || '', vb = b[key] || '';
        return va.localeCompare(vb) * dir;
      });
      this.filteredItems = result;
    },

    toggleItemSort(key) {
      if (this.itemSortKey === key) {
        if (this.itemSortDir === 'asc') {
          this.itemSortDir = 'desc';
        } else {
          this.itemSortKey = 'name';
          this.itemSortDir = 'asc';
        }
      } else {
        this.itemSortKey = key;
        this.itemSortDir = 'asc';
      }
      this.itemRecompute();
    },

    addItemChip(type) {
      const chip = { type, editing: true };
      if (type === 'category') {
        chip.value = 'Battle';
      }
      this.itemChips.push(chip);
      if (!chip.editing) this.itemRecompute();
    },

    commitItemChip(chip) {
      chip.editing = false;
      this.itemRecompute();
    },

    removeItemChip(index) {
      this.itemChips.splice(index, 1);
      this.itemRecompute();
    },

    itemChipLabel(chip) {
      if (chip.type === 'category') return `Category: ${chip.value}`;
      return '';
    },

    openItemDetail(item) {
      this.showDetailView = 'item';
      this.detailItem = item;
      this.itemDetailSearch = '';
    },

    // === Wallpaper Methods ===

    wpFilterSuggestions() {
      const q = this.wpSearch.toLowerCase().trim();
      if (!q) { this.wpFiltered = []; return; }
      this.wpFiltered = this.pokemon
        .filter(p => p.name.includes(q))
        .slice(0, 15);
    },

    wpSelectFirst() {
      if (this.wpFiltered.length) this.wpSelectPokemon(this.wpFiltered[0]);
    },

    wpSelectPokemon(p) {
      this.wpPokemon = p;
      this.wpSearch = '#' + p.id + ' ' + this.capitalize(p.name);
      this.wpShowDropdown = false;
      this.wpFiltered = [];
      this.wpDataUrl = null;
    },

    async wpGenerate() {
      if (!this.wpPokemon || this.wpGenerating) return;
      this.wpGenerating = true;

      const W = 1920, H = 1080;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      const p = this.wpPokemon;
      const tc = this.typeColor(p.types[0] || 'normal');

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#08081a');
      bg.addColorStop(0.5, '#0f0f2a');
      bg.addColorStop(1, '#16163a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Large type-colored aura behind the center
      const aura = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, 700);
      aura.addColorStop(0, tc + '18');
      aura.addColorStop(0.5, tc + '08');
      aura.addColorStop(1, 'transparent');
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, W, H);

      // Subtle grid
      ctx.strokeStyle = 'rgba(255,255,255,0.025)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Gradient accent bar at top
      const bar = ctx.createLinearGradient(0, 0, W, 0);
      bar.addColorStop(0, tc);
      bar.addColorStop(0.5, this.typeColor(p.types[1] || p.types[0]) || tc);
      bar.addColorStop(1, tc);
      ctx.fillStyle = bar;
      ctx.fillRect(0, 0, W, 5);

      // Header: #ID Name centered
      const cx = W / 2;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 42px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textBaseline = 'top';
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 20;
      ctx.fillText('#' + p.id + '  ' + this.capitalize(p.name), cx, 34);
      ctx.shadowBlur = 0;
      ctx.textAlign = 'left';

      // Type badges centered
      const badgeGap = 10;
      let totalW = 0;
      const badgeTexts = p.types.map(t => this.capitalize(t));
      ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      for (const t of badgeTexts) totalW += ctx.measureText(t).width + 24 + badgeGap;
      totalW -= badgeGap;
      let bx = cx - totalW / 2;
      for (const t of p.types) {
        const c = this.typeColor(t);
        const tw = ctx.measureText(this.capitalize(t)).width + 24;
        ctx.save();
        ctx.shadowColor = c + '60';
        ctx.shadowBlur = 12;
        ctx.fillStyle = c;
        this.roundRect(ctx, bx, 86, tw, 28, 14);
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.textBaseline = 'top';
        ctx.fillText(this.capitalize(t), bx + 12, 91);
        bx += tw + badgeGap;
      }

      // Load artwork
      const img = await this.loadImage(
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`
      );

      // Three-column layout
      const statsX = 60, statsW = 390, statsY = 150, pH = 830;
      const artMW = 940, artMH = 830;
      const artX = statsX + statsW + 40;
      const artY = 150;
      const infoX = artX + artMW + 40;
      const infoW = W - infoX - 60;

      // Type-themed background pattern in side panels only
      this.drawTypeBg(ctx, p.types, statsX, statsY, statsW, infoX, statsY, infoW, pH);

      // === Stats panel ===
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      this.roundRect(ctx, statsX, statsY, statsW, pH, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      this.roundRect(ctx, statsX, statsY, statsW, pH, 16);
      ctx.stroke();

      // Accent bar inside panel
      ctx.fillStyle = tc;
      this.roundRect(ctx, statsX + 20, statsY + 16, 40, 4, 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 19px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText('Base Stats', statsX + 68, statsY + 12);

      const sList = ['hp','attack','defense','special-defense','special-attack','speed'];
      const sLabels = { hp: 'HP', attack: 'ATK', defense: 'DEF', 'special-defense': 'SPD', 'special-attack': 'SPA', speed: 'SPE' };
      const sColors = { hp: '#22c55e', attack: '#ef4444', defense: '#f59e0b', 'special-attack': '#3b82f6', 'special-defense': '#8b5cf6', speed: '#ec4899' };
      const total = this.statTotal(p);

      // Hexagon stat chart
      const fx = statsX + statsW / 2;
      const fy = statsY + 60 + (pH - 80) / 2;
      const maxR = Math.min(statsW, pH - 80) * 0.37;
      const angles = sList.map((_, i) => -Math.PI / 2 + i * Math.PI / 3);

      // Grid tiers
      for (let t = 1; t <= 5; t++) {
        const r = maxR * t / 5;
        ctx.strokeStyle = 'rgba(255,255,255,0.34)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const x = fx + Math.cos(angles[i]) * r;
          const y = fy + Math.sin(angles[i]) * r;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Axis lines
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(fx + Math.cos(angles[i]) * maxR, fy + Math.sin(angles[i]) * maxR);
        ctx.stroke();
      }

      // Stat polygon
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const v = p.stats[sList[i]] / 255;
        const r = maxR * Math.max(v, 0.01);
        const x = fx + Math.cos(angles[i]) * r;
        const y = fy + Math.sin(angles[i]) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = tc + '40';
      ctx.fill();
      ctx.strokeStyle = tc + '99';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Vertex dots
      for (let i = 0; i < 6; i++) {
        const v = p.stats[sList[i]] / 255;
        const r = maxR * Math.max(v, 0.01);
        const x = fx + Math.cos(angles[i]) * r;
        const y = fy + Math.sin(angles[i]) * r;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = sColors[sList[i]];
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Labels and values
      for (let i = 0; i < 6; i++) {
        const ld = maxR + 22;
        const lx = fx + Math.cos(angles[i]) * ld;
        const ly = fy + Math.sin(angles[i]) * ld;
        ctx.fillStyle = sColors[sList[i]];
        ctx.font = '700 12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sLabels[sList[i]], lx, ly - 7);
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText(p.stats[sList[i]].toString(), lx, ly + 11);
      }
      ctx.textAlign = 'left';

      // Total in center
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.font = '500 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('TOTAL', fx, fy - 14);
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 19px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText(total.toString(), fx, fy + 10);
      ctx.textAlign = 'left';

      // === Artwork (middle) ===
      let aw = img.width, ah = img.height;
      const sc = Math.min(artMW / aw, artMH / ah);
      aw *= sc; ah *= sc;
      const ax = artX + (artMW - aw) / 2;
      const ay = artY + (artMH - ah) / 2;

      // Strong type-colored glow
      ctx.save();
      const glow = ctx.createRadialGradient(artX + artMW / 2, artY + artMH / 2, 20, artX + artMW / 2, artY + artMH / 2, 500);
      glow.addColorStop(0, tc + '35');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(artX, artY, artMW, artMH);
      ctx.restore();

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 70;
      ctx.shadowOffsetY = 20;
      ctx.drawImage(img, ax, ay, aw, ah);
      ctx.restore();

      // === Info panel (right) ===
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      this.roundRect(ctx, infoX, statsY, infoW, pH, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      this.roundRect(ctx, infoX, statsY, infoW, pH, 16);
      ctx.stroke();

      // Accent bar
      ctx.fillStyle = tc;
      this.roundRect(ctx, infoX + 20, statsY + 16, 40, 4, 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 19px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText('Pokédex Entry', infoX + 68, statsY + 12);

      const iItems = [
        { label: 'Species', value: this.capitalize(p.name) },
        { label: 'Height', value: this.formatHeight(p.height) },
        { label: 'Weight', value: this.formatWeight(p.weight) },
        { label: 'Generation', value: p.generation.toString() },
        { label: 'Base XP', value: p.base_experience != null ? p.base_experience.toString() : '—' },
      ];

      let iy = statsY + 56;
      for (const item of iItems) {
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.font = '400 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.textBaseline = 'top';
        ctx.fillText(item.label, infoX + 24, iy);
        ctx.fillStyle = '#ffffff';
        ctx.font = '500 19px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText(item.value, infoX + infoW - 24 - ctx.measureText(item.value).width, iy);
        iy += 38;
      }

      // Divider
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(infoX + 24, iy); ctx.lineTo(infoX + infoW - 24, iy); ctx.stroke();
      iy += 16;

      // Abilities
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.font = '400 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('Abilities', infoX + 24, iy);
      ctx.fillStyle = '#ffffff';
      ctx.font = '500 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      let aY = iy;
      for (const a of (p.abilities || [])) {
        ctx.fillText('• ' + this.capitalize(a), infoX + infoW - 24 - ctx.measureText('• ' + this.capitalize(a)).width, aY);
        aY += 28;
      }
      if (!(p.abilities || []).length) {
        ctx.fillText('—', infoX + infoW - 24 - ctx.measureText('—').width, aY);
        aY += 28;
      }
      iy = aY + 12;

      // Divider
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(infoX + 24, iy); ctx.lineTo(infoX + infoW - 24, iy); ctx.stroke();
      iy += 16;

      // Fun fact
      const fact = this.factsData[p.id];
      if (fact) {
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.font = '500 20px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText('Pokédex Fact', infoX + 24, iy);
        iy += 30;

        // Colored quote bar
        ctx.fillStyle = tc + '40';
        this.roundRect(ctx, infoX + 24, iy, 4, 100, 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = '400 19px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

        const mw = infoW - 56;
        const words = fact.split(' ');
        let line = '', ly = iy;
        for (const word of words) {
          const test = line + word + ' ';
          if (ctx.measureText(test).width > mw && line) {
            ctx.fillText(line.trim(), infoX + 36, ly);
            line = word + ' ';
            ly += 26;
          } else {
            line = test;
          }
        }
        if (line) ctx.fillText(line.trim(), infoX + 36, ly);
      }

      // Footer
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.font = '400 12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textBaseline = 'bottom';
      ctx.textAlign = 'right';
      ctx.fillText('Pokémon Browser', W - 30, H - 14);
      ctx.textAlign = 'left';

      this.wpDataUrl = canvas.toDataURL('image/png');
      this.wpGenerating = false;
    },

    wpDownload() {
      if (!this.wpDataUrl) return;
      const a = document.createElement('a');
      a.href = this.wpDataUrl;
      a.download = (this.wpPokemon ? this.wpPokemon.name : 'pokemon') + '-wallpaper.png';
      a.click();
    },

    // === Collection Methods ===

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
      if (price === 0) return '\u2014';
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

    collectionRecompute() {
      this.collection = [...this.collection];
    },

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

    collectionSearchCards() {
      const q = (this.collectionSearchInput || '').trim();
      if (q.length < 2) {
        this.collectionResults = [];
        this.collectionSearchError = null;
        return;
      }
      this.collectionApiLoading = true;
      this.collectionSearchError = null;
      const cacheKey = q.toLowerCase();
      if (this.collectionCardCache[cacheKey]) {
        this.collectionResults = this.collectionCardCache[cacheKey];
        this.collectionApiLoading = false;
        return;
      }
      this._collectionFetch(cacheKey, 0);
    },

    _collectionFetch(q, attempt) {
      fetch(`https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(q)}*&pageSize=250`)
        .then(resp => { if (!resp.ok) throw new Error('Could not load cards. Try a more specific name.'); return resp.json(); })
        .then(data => {
          const cards = data.data || [];
          this.collectionCardCache[q] = cards;
          this._saveCardCache();
          this.collectionResults = cards;
          this.collectionApiLoading = false;
        })
        .catch(e => {
          if (attempt < 1) {
            setTimeout(() => this._collectionFetch(q, attempt + 1), 1500);
          } else {
            this.collectionSearchError = e.message;
            this.collectionResults = [];
            this.collectionApiLoading = false;
          }
        });
    },

    _saveCardCache() {
      try { localStorage.setItem('pokemonCardCache', JSON.stringify(this.collectionCardCache)); } catch(e) {}
    },

    collectionFilterPokemonSuggestions() {
      const q = this.collectionSearchInput.toLowerCase().trim();
      if (!q) { this.collectionPokemonFiltered = []; return; }
      this.collectionPokemonFiltered = (window.__POKEMON_DATA__ || [])
        .filter(p => p.name.includes(q))
        .slice(0, 15);
    },

    collectionSelectPokemon(p) {
      this.collectionSearchInput = this.capitalize(p.name);
      this.collectionShowPokemonDropdown = false;
      this.collectionPokemonFiltered = [];
      this.collectionSearchCards();
    },

    collectionSwitchView(mode) {
      this.collectionViewMode = mode;
      if (mode === 'main' && this.collectionRandomCards.length === 0) {
        this.collectionFetchRandom();
      }
    },

    _cardMaxPrice(card) {
      const prices = card.tcgplayer && card.tcgplayer.prices;
      if (!prices) return null;
      let max = 0;
      for (const key of Object.keys(prices)) {
        const m = prices[key].market;
        if (m != null && m > max) max = m;
      }
      return max > 0 ? max : null;
    },

    collectionFetchRandom() {
      this.collectionRandomLoading = true;
      fetch('https://api.pokemontcg.io/v2/cards?q=supertype:pokemon&pageSize=250')
        .then(resp => { if (!resp.ok) throw new Error(); return resp.json(); })
        .then(data => {
          const cards = data.data || [];
          for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
          }
          this.collectionRandomCards = cards.slice(0, 20);
          this.collectionRandomLoading = false;
        })
        .catch(() => {
          this.collectionRandomCards = [];
          this.collectionRandomLoading = false;
        });
    },

    collectionMainFiltered() {
      let result = [...this.collectionRandomCards];
      if (this.collectionSearchInput && this.collectionSearchInput.trim()) {
        const q = this.collectionSearchInput.toLowerCase().trim();
        result = result.filter(c =>
          c.name.toLowerCase().includes(q) ||
          c.set.name.toLowerCase().includes(q)
        );
      }
      const sort = this.collectionMainSort;
      result.sort((a, b) => {
        if (sort === 'name') return a.name.localeCompare(b.name);
        if (sort === 'set') return a.set.name.localeCompare(b.set.name) || a.number.localeCompare(b.number);
        const pa = this._cardMaxPrice(a) || 0;
        const pb = this._cardMaxPrice(b) || 0;
        return pb - pa;
      });
      return result;
    },

    collectionSortedResults() {
      const arr = [...this.collectionResults];
      const sort = this.collectionResultsSort;
      arr.sort((a, b) => {
        if (sort === 'name') return a.name.localeCompare(b.name);
        if (sort === 'set') return a.set.name.localeCompare(b.set.name) || a.number.localeCompare(b.number);
        const pa = this._cardMaxPrice(a) || 0;
        const pb = this._cardMaxPrice(b) || 0;
        return sort === 'price-asc' ? pa - pb : pb - pa;
      });
      return arr;
    },

    collectionOpenAdd(card) {
      this.collectionModalMode = 'add';
      this.collectionModalCard = card;
      this.collectionModalEntryIndex = null;

      const prices = card.tcgplayer && card.tcgplayer.prices ? card.tcgplayer.prices : {};
      const variants = Object.keys(prices).map(key => ({
        key,
        label: this.variantLabel(key),
        price: prices[key].market || prices[key].mid || 0
      }));
      this.collectionModalVariants = variants;
      this.collectionModalVariant = variants.length > 0 ? variants[0].key : '';
      this.collectionModalGrade = null;
      this.collectionModalQuantity = 1;
      this.collectionModalOpen = true;
    },

    collectionOpenEdit(entry) {
      this.collectionModalMode = 'edit';
      this.collectionModalCard = entry;
      this.collectionModalEntryIndex = this.collection.indexOf(entry);

      const prices = {};
      if (entry.priceUngraded != null) {
        prices[entry.variant] = { market: entry.priceUngraded };
      }
      const variants = Object.keys(prices).length > 0
        ? Object.keys(prices).map(key => ({ key, label: this.variantLabel(key), price: prices[key].market || 0 }))
        : [{ key: entry.variant, label: entry.variantLabel, price: entry.priceUngraded || 0 }];

      this.collectionModalVariants = variants;
      this.collectionModalVariant = entry.variant;
      this.collectionModalGrade = entry.grade;
      this.collectionModalQuantity = entry.quantity;
      this.collectionModalOpen = true;
    },

    collectionModalDelete() {
      this.collectionModalOpen = false;
      this.collectionDeleteConfirm = true;
    },

    collectionModalDeleteConfirm() {
      if (this.collectionModalEntryIndex != null) {
        this.collection.splice(this.collectionModalEntryIndex, 1);
        this.collectionSave();
      }
      this.collectionDeleteConfirm = false;
      this.collectionModalEntryIndex = null;
      this.collectionModalCard = null;
    },

    get collectionModalVariantPrice() {
      if (!this.collectionModalVariant || !this.collectionModalVariants.length) return null;
      const v = this.collectionModalVariants.find(v => v.key === this.collectionModalVariant);
      return v ? v.price : null;
    },

    collectionModalGradedPrice() {
      const price = this.collectionModalVariantPrice;
      if (price === null || price === 0) return 0;
      if (this.collectionModalGrade && this.collectionPsaMultipliers[this.collectionModalGrade]) {
        return price * this.collectionPsaMultipliers[this.collectionModalGrade];
      }
      return price;
    },

    collectionModalConfirm() {
      if (!this.collectionModalVariant) return;
      const card = this.collectionModalCard;
      const variant = this.collectionModalVariants.find(v => v.key === this.collectionModalVariant);
      const priceUngraded = variant ? variant.price : 0;

      if (this.collectionModalMode === 'add') {
        const entry = {
          id: card.id,
          name: card.name,
          setName: card.set ? card.set.name : '',
          setSeries: card.set ? card.set.series : '',
          image: card.images ? card.images.small : '',
          number: card.number || '',
          variant: this.collectionModalVariant,
          variantLabel: this.variantLabel(this.collectionModalVariant),
          grade: this.collectionModalGrade,
          quantity: this.collectionModalQuantity || 1,
          priceUngraded: priceUngraded,
          priceGraded: this.collectionModalGrade && this.collectionPsaMultipliers[this.collectionModalGrade]
            ? priceUngraded * this.collectionPsaMultipliers[this.collectionModalGrade]
            : null,
          updatedAt: Date.now()
        };
        this.collection.unshift(entry);
      } else {
        const idx = this.collectionModalEntryIndex;
        if (idx != null && this.collection[idx]) {
          this.collection[idx].variant = this.collectionModalVariant;
          this.collection[idx].variantLabel = this.variantLabel(this.collectionModalVariant);
          this.collection[idx].grade = this.collectionModalGrade;
          this.collection[idx].quantity = this.collectionModalQuantity || 1;
          this.collection[idx].priceUngraded = priceUngraded;
          this.collection[idx].priceGraded = this.collectionModalGrade && this.collectionPsaMultipliers[this.collectionModalGrade]
            ? priceUngraded * this.collectionPsaMultipliers[this.collectionModalGrade]
            : null;
          this.collection[idx].updatedAt = Date.now();
        }
      }

      this.collectionSave();
      this.collectionModalOpen = false;
      this.collectionSearchInput = '';
      this.collectionResults = [];
    },

    typeColor(type) {
      const colors = {
        normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
        grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
        ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
        rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
        steel: '#B8B8D0', fairy: '#EE99AC',
      };
      return colors[type] || '#A8A878';
    },

    drawTypeBg(ctx, types, lx, ly, lw, rx, ry, rw, rh) {
      const type = types[0];
      const c = this.typeColor(type);
      const alpha = '22';

      const drawIn = (fn) => {
        fn(lx, ly, lw, rh);
        fn(rx, ry, rw, rh);
      };

      switch (type) {
        case 'water':
          drawIn((ox, oy, w, h) => {
            ctx.strokeStyle = c + alpha;
            ctx.lineWidth = 1.5;
            for (let i = 0; i < 30; i++) {
              const x = ox + (i * 37 + 13) % w;
              const y = oy + (i * 53 + 7) % h;
              const len = 12 + (i % 12);
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x - 5, y + len);
              ctx.stroke();
            }
          });
          break;
        case 'fire':
          drawIn((ox, oy, w, h) => {
            ctx.fillStyle = c + alpha;
            for (let i = 0; i < 20; i++) {
              const x = ox + (i * 73 + 17) % w;
              const y = oy + (i * 47 + 11) % h;
              const r = 2 + (i % 3);
              ctx.beginPath();
              ctx.arc(x, y, r, 0, Math.PI * 2);
              ctx.fill();
            }
          });
          break;
        case 'electric':
          drawIn((ox, oy, w, h) => {
            ctx.strokeStyle = c + alpha;
            ctx.lineWidth = 1;
            for (let i = 0; i < 15; i++) {
              const x = ox + (i * 43 + 7) % w;
              const y = oy + (i * 59 + 3) % h;
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x + 5, y - 7);
              ctx.lineTo(x + 10, y - 1);
              ctx.lineTo(x + 15, y - 8);
              ctx.stroke();
            }
          });
          break;
        case 'grass':
          drawIn((ox, oy, w, h) => {
            ctx.fillStyle = c + alpha;
            for (let i = 0; i < 15; i++) {
              const cx = ox + (i * 61 + 23) % w;
              const cy = oy + (i * 41 + 5) % h;
              for (let j = 0; j < 3; j++) {
                const ox2 = ((j * 13 + i * 7) % 24) - 12;
                const oy2 = ((j * 17 + i * 11) % 24) - 12;
                ctx.beginPath();
                ctx.arc(cx + ox2, cy + oy2, 1.5 + (j % 2), 0, Math.PI * 2);
                ctx.fill();
              }
            }
          });
          break;
        case 'ice':
          drawIn((ox, oy, w, h) => {
            ctx.strokeStyle = c + alpha;
            ctx.lineWidth = 1;
            for (let i = 0; i < 12; i++) {
              const x = ox + (i * 51 + 11) % w;
              const y = oy + (i * 67 + 19) % h;
              const s = 5 + (i % 4);
              for (let a = 0; a < 6; a++) {
                const angle = a * Math.PI / 3;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + Math.cos(angle) * s, y + Math.sin(angle) * s);
                ctx.stroke();
              }
            }
          });
          break;
        case 'fighting':
          drawIn((ox, oy, w, h) => {
            ctx.strokeStyle = c + alpha;
            ctx.lineWidth = 2;
            for (let i = 0; i < 18; i++) {
              const x = ox + (i * 41 + 9) % w;
              const y = oy + (i * 37 + 13) % h;
              const angle = (i * 97) % 360 * Math.PI / 180;
              const len = 4 + (i % 5);
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
              ctx.stroke();
            }
          });
          break;
        case 'poison':
          drawIn((ox, oy, w, h) => {
            ctx.strokeStyle = c + alpha;
            ctx.lineWidth = 1;
            for (let i = 0; i < 12; i++) {
              const x = ox + (i * 53 + 7) % w;
              const y = oy + (i * 41 + 3) % h;
              const r = 4 + (i % 5);
              ctx.beginPath();
              ctx.arc(x, y, r, 0, Math.PI * 2);
              ctx.stroke();
            }
          });
          break;
        case 'ground':
          drawIn((ox, oy, w, h) => {
            ctx.fillStyle = c + alpha;
            for (let i = 0; i < 40; i++) {
              const x = ox + (i * 37 + 11) % w;
              const y = oy + (i * 53 + 17) % h;
              ctx.beginPath();
              ctx.arc(x, y, 1.2, 0, Math.PI * 2);
              ctx.fill();
            }
          });
          break;
        case 'flying':
          drawIn((ox, oy, w, h) => {
            ctx.strokeStyle = c + alpha;
            ctx.lineWidth = 1;
            for (let i = 0; i < 15; i++) {
              const y = oy + (i * 47 + 13) % h;
              const x = ox + (i * 29) % w;
              const len = 30 + (i % 15);
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.quadraticCurveTo(x + len / 2, y - 3 + (i % 3), x + len, y + (i % 4) - 1);
              ctx.stroke();
            }
          });
          break;
        case 'psychic':
          drawIn((ox, oy, w, h) => {
            ctx.strokeStyle = c + alpha;
            ctx.lineWidth = 1;
            for (let i = 0; i < 10; i++) {
              const x = ox + (i * 59 + 7) % w;
              const y = oy + (i * 43 + 23) % h;
              for (let r = 4; r < 16; r += 5) {
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 1.5);
                ctx.stroke();
              }
            }
          });
          break;
        case 'bug':
          drawIn((ox, oy, w, h) => {
            ctx.strokeStyle = c + alpha;
            ctx.lineWidth = 0.5;
            for (let i = 0; i < 20; i++) {
              const x = ox + (i * 31 + 5) % w;
              const y = oy + (i * 29 + 11) % h;
              ctx.beginPath();
              ctx.moveTo(x - 3, y - 3);
              ctx.lineTo(x + 3, y + 3);
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(x + 3, y - 3);
              ctx.lineTo(x - 3, y + 3);
              ctx.stroke();
            }
          });
          break;
        case 'rock':
          drawIn((ox, oy, w, h) => {
            ctx.fillStyle = c + alpha;
            for (let i = 0; i < 12; i++) {
              const x = ox + (i * 47 + 3) % w;
              const y = oy + (i * 53 + 17) % h;
              const s = 3 + (i % 3);
              ctx.beginPath();
              ctx.moveTo(x, y - s);
              ctx.lineTo(x + s, y + s * 0.6);
              ctx.lineTo(x - s, y + s * 0.6);
              ctx.closePath();
              ctx.fill();
            }
          });
          break;
        case 'ghost':
          drawIn((ox, oy, w, h) => {
            ctx.strokeStyle = c + alpha;
            ctx.lineWidth = 1.5;
            for (let i = 0; i < 10; i++) {
              const x = ox + (i * 41 + 7) % w;
              const y = oy + (i * 37 + 13) % h;
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.quadraticCurveTo(x + 8, y - 8, x + 16, y);
              ctx.quadraticCurveTo(x + 24, y + 8, x + 32, y);
              ctx.stroke();
            }
          });
          break;
        case 'dragon':
          drawIn((ox, oy, w, h) => {
            ctx.strokeStyle = c + alpha;
            ctx.lineWidth = 1.5;
            for (let i = 0; i < 12; i++) {
              const x = ox + (i * 53 + 11) % w;
              const y = oy + (i * 41 + 7) % h;
              ctx.beginPath();
              ctx.arc(x, y, 7, 0.2, Math.PI - 0.2);
              ctx.stroke();
            }
          });
          break;
        case 'dark':
          drawIn((ox, oy, w, h) => {
            ctx.strokeStyle = c + alpha;
            ctx.lineWidth = 2;
            for (let i = 0; i < 12; i++) {
              const x = ox + (i * 43 + 3) % w;
              const y = oy + (i * 59 + 7) % h;
              const len = 12 + (i % 8);
              const dx = (i % 5) - 2;
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x + dx * 2, y + len);
              ctx.stroke();
            }
          });
          break;
        case 'steel':
          drawIn((ox, oy, w, h) => {
            ctx.strokeStyle = c + alpha;
            ctx.lineWidth = 1;
            for (let i = 0; i < 10; i++) {
              const x = ox + (i * 47 + 13) % w;
              const y = oy + (i * 53 + 7) % h;
              const s2 = 5;
              ctx.beginPath();
              for (let j = 0; j < 6; j++) {
                const a2 = j * Math.PI / 3 - Math.PI / 6;
                const px = x + Math.cos(a2) * s2;
                const py = y + Math.sin(a2) * s2;
                j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
              }
              ctx.closePath();
              ctx.stroke();
            }
          });
          break;
        case 'fairy':
          drawIn((ox, oy, w, h) => {
            ctx.fillStyle = c + alpha;
            for (let i = 0; i < 18; i++) {
              const x = ox + (i * 43 + 7) % w;
              const y = oy + (i * 37 + 19) % h;
              const s = 2 + (i % 2);
              ctx.beginPath();
              for (let j = 0; j < 4; j++) {
                const a2 = j * Math.PI / 2;
                const px = x + Math.cos(a2) * s;
                const py = y + Math.sin(a2) * s;
                j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
              }
              ctx.closePath();
              ctx.fill();
            }
          });
          break;
        default:
          drawIn((ox, oy, w, h) => {
            ctx.fillStyle = c + alpha;
            for (let i = 0; i < 20; i++) {
              const x = ox + (i * 37 + 11) % w;
              const y = oy + (i * 53 + 7) % h;
              ctx.beginPath();
              ctx.arc(x, y, 1.5, 0, Math.PI * 2);
              ctx.fill();
            }
          });
      }
    },

    roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    },

    loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => {
          // Fallback to sprite
          const fallback = new Image();
          fallback.crossOrigin = 'anonymous';
          fallback.onload = () => resolve(fallback);
          fallback.onerror = reject;
          fallback.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${src.split('/').pop()}`;
        };
        img.src = src;
      });
    },
  }));
});
