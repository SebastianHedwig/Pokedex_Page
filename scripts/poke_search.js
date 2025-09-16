const SEARCH_MIN_LENGTH = 3;
const API_MAX_RESULTS = 50;
let searchDebounceTimer = null;
let allPokeIndex = null;

const TYPE_MAP = {
  "normal":"normal",
  "feuer":"fire",
  "wasser":"water",
  "pflanze":"grass",
  "elektro":"electric",
  "eis":"ice",
  "kampf":"fighting",
  "gift":"poison",
  "boden":"ground",
  "flug":"flying",
  "psycho":"psychic",
  "käfer":"bug",
  "kaefer":"bug",
  "gestein":"rock",
  "geist":"ghost",
  "unlicht":"dark",
  "drache":"dragon",
  "stahl":"steel",
  "fee":"fairy"
};

function initSearch() {
  const form = getEl("pokesearch_box");
  const input = getEl("pokesearch_input");
  if (!form || !input) return;
  form.onsubmit = onSearchSubmit;
  input.oninput = onSearchInput;
}

function onSearchSubmit(e) {
  e.preventDefault();
  const q = getQuery();
  if (q.length < SEARCH_MIN_LENGTH) return;
  runApiSearch(q);
}

function onSearchInput(e) {
  const q = e.target.value.trim().toLowerCase();
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => performLocalSearch(q), 200);
}

function getQuery() {
  return getEl("pokesearch_input").value.trim().toLowerCase();
}

function performLocalSearch(q) {
  if (q.length < SEARCH_MIN_LENGTH) return renderCards(pokeCache);
  renderCards(filterPokemonLocal(q));
}

function filterPokemonLocal(q) {
  return pokeCache.filter(p =>
    p.name?.toLowerCase().includes(q) ||
    String(p.id) === q ||
    p.types?.some(t => t.type?.name?.includes(q))
  );
}

async function runApiSearch(q) {
  showCardsSpinner();
  try {
    const byName = await findNameMatches(q);
    const typeKey = resolveType(q);
    const byType = typeKey ? await getTypePokemon(typeKey) : [];
    const merged = unique([...byType, ...byName]);
    const data = await fetchPokemonList(merged);
    mergeIntoCache(data);
    await sleep(500); 
    renderCards(data); 
  } catch {renderCards([])}
}


function showCardsSpinner() {
  const img = "./assets/img/pokeball_512_spinner_flaticon.png";
  getEl("pokemon_cards_container").innerHTML = /*html*/ `
  <img class="overlay_spinner" src="${img}" alt="Lade Pokeball">`;
}

async function findNameMatches(q) {
  const index = await getAllPokemonIndex();
  return index.filter(n => n.includes(q));
}

async function getAllPokemonIndex() {
  if (allPokeIndex) return allPokeIndex;
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20000&offset=0");
  const json = await res.json();
  allPokeIndex = json.results.map(it => it.name);
  return allPokeIndex;
}

function normalizeUmlauts(s) {
  return s.replaceAll("ä","ae").replaceAll("ö","oe").replaceAll("ü","ue").replaceAll("ß","ss");
}

function resolveType(q) {
  const en = ["normal","fire","water","grass","electric","ice","fighting","poison",
    "ground","flying","psychic","bug","rock","ghost","dark","dragon","steel","fairy"];
  const normQ = normalizeUmlauts(q);
  if (TYPE_MAP[q]) return TYPE_MAP[q];
  if (TYPE_MAP[normQ]) return TYPE_MAP[normQ];
  const hitDe = Object.keys(TYPE_MAP).filter(k => {
    const nk = normalizeUmlauts(k);
    return k.startsWith(q) || nk.startsWith(normQ);
  });
  if (hitDe.length === 1) return TYPE_MAP[hitDe[0]];
  const hitEn = en.filter(t => t.startsWith(q));
  return hitEn.length === 1 ? hitEn[0] : null;
}

async function getTypePokemon(typeKey) {
  const res = await fetch(`https://pokeapi.co/api/v2/type/${typeKey}`);
  const json = await res.json();
  return json.pokemon.map(p => p.pokemon.name);
}

async function fetchPokemonList(names) {
  const tasks = names.map(n => fetchPokemonData(n));
  return Promise.all(tasks);
}

function unique(arr) {
  return [...new Set(arr)];
}
