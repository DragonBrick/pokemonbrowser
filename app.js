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
    activeTab: 'pokemon',
    moves: [],
    moveChips: [],
    moveSearch: '',
    moveSortKey: 'learners',
    moveSortDir: 'desc',
    filteredMoves: [],
    moveShowAddMenu: false,
    showDetailView: null,
    detailItem: null,
    detailMoveSearch: '',
    detailPokemonSearch: '',

    moveColumns: [
      { key: 'name', label: 'Move', sortable: true },
      { key: 'type', label: 'Type', sortable: true },
      { key: 'power', label: 'Power', sortable: true },
      { key: 'accuracy', label: 'Acc', sortable: true },
      { key: 'pp', label: 'PP', sortable: true },
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
    },

    recompute() {
      let result = [...this.pokemon];

      if (this.search) {
        const q = this.search.toLowerCase();
        result = result.filter((p) => p.name.includes(q));
      }
      result = result.filter((p) => !p.name.includes('-mega') && !p.name.includes('-gmax'));

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
            return moveName && p.moves.some((m) => m.includes(moveName));
          }));
        } else if (type === 'type') {
          result = result.filter((p) => chips.some((c) => {
            const t = (c.value || '').toLowerCase().trim();
            return t && p.types.includes(t);
          }));
        } else if (type === 'total') {
          result = result.filter((p) => chips.some((c) => {
            const val = parseInt(c.value) || 0;
            return c.operator === '>' ? this.statTotal(p) > val : this.statTotal(p) < val;
          }));
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
        chip.suggestions = [];
        chip.showDropdown = false;
      } else if (type === 'total') {
        chip.operator = '>';
        chip.value = '';
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
      if (chip.type === 'type') return `Type: ${this.capitalize(chip.value) || '...'}`;
      if (chip.type === 'total') return `Total ${chip.operator} ${chip.value || '?'}`;
      return '';
    },

    statLabel(key) {
      const map = {
        hp: 'HP', attack: 'Attack', defense: 'Defense',
        'special-attack': 'Sp.Atk', 'special-defense': 'Sp.Def', speed: 'Speed',
      };
      return map[key] || key;
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
        source = this.moves.map(m => m.name).filter(n => n.includes(q)).slice(0, 20);
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
      if (id > 1025) {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
      }
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    },

    onSpriteError(e, id) {
      if (!e.target.src.includes('official-artwork')) {
        e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
      } else {
        e.target.style.display = 'none';
      }
    },

    statTotal(p) {
      return Object.values(p.stats).reduce((sum, v) => sum + v, 0);
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
        result = result.filter((m) => m.name.includes(q));
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
      return '';
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
    },

    openMoveDetail(m) {
      this.showDetailView = 'move';
      this.detailItem = m;
      this.detailMoveSearch = '';
    },

    closeDetail() {
      this.showDetailView = null;
      this.detailItem = null;
    },
  }));
});
