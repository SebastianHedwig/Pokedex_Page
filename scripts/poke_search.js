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
  "stein":"rock",
  "geist":"ghost",
  "unlicht":"dark",
  "drache":"dragon",
  "stahl":"steel",
  "fee":"fairy"
};

const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "grass",
  "electric",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dark",
  "dragon",
  "steel",
  "fairy"
];

function initSearch() {
  const form = getEl("pokesearch_box");
  const input = getEl("pokesearch_input");
  if (!form || !input) return;
  form.onsubmit = onSearchSubmit;
  input.oninput = onSearchInput;
}

function onSearchSubmit(event) {
  event.preventDefault();
  const query = getQuery();
  if (query.length < SEARCH_MIN_LENGTH) return;
  runApiSearch(query);
}

function onSearchInput(event) {
  const query = event.target.value.trim().toLowerCase();
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => performLocalSearch(query), 200);
}

function getQuery() {
  return getEl("pokesearch_input").value.trim().toLowerCase();
}

function performLocalSearch(query) {
  if (query.length < SEARCH_MIN_LENGTH)
    return renderCards(pokeCache);
  renderCards(filterPokemonLocal(query));
}

function filterPokemonLocal(query) {
  return pokeCache.filter(pokemon =>
    pokemon.name?.toLowerCase().includes(query) ||
    String(pokemon.id) === query ||
    pokemon.types?.some(typeInfo => typeInfo.type?.name?.includes(query))
  );
}

async function runApiSearch(query) {
  showCardsSpinner();
  const byName = await findNameMatches(query);
  const typeKey = resolveType(query);
  const byType = typeKey ? await getTypePokemon(typeKey) : [];
  const merged = removeDuplicates([...byType, ...byName]);
  const data = await fetchPokemonList(merged);
  mergeIntoCache(data);
  await sleep(500); 
  renderCards(data); 
}

function showCardsSpinner() {
  const img = "./assets/img/pokeball_512_spinner_flaticon.png";
  getEl("pokemon_cards_container").innerHTML = /*html*/ `
  <img class="overlay_spinner" src="${img}" alt="Lade Pokeball">`;
}

async function findNameMatches(query) {
  const index = await getAllPokemonIndex();
  return index.filter(name => name.includes(query));
}

async function getAllPokemonIndex() {
  if (allPokeIndex) return allPokeIndex;
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20000&offset=0");
  const DataList = await response.json();
  allPokeIndex = DataList.results.map(pokemon => pokemon.name);
  return allPokeIndex;
}

function normalizeModifiedVowels(text) {
  return text
    .replaceAll("ä","ae")
    .replaceAll("ö","oe")
    .replaceAll("ü","ue")
    .replaceAll("ß","ss");
}

function resolveType(query) {
  const normalizedQuery = normalizeModifiedVowels(query);

  const direct = TYPE_MAP[query] || TYPE_MAP[normalizedQuery];
  if (direct) return direct;

  const germanMatch = Object.keys(TYPE_MAP).find(function (key) {
    const normalizedKey = normalizeModifiedVowels(key);
    return key.indexOf(query) === 0 || normalizedKey.indexOf(normalizedQuery) === 0});
  if (germanMatch) return TYPE_MAP[germanMatch];

  const englishMatch = POKEMON_TYPES.find(function (type) {
    return type.indexOf(query) === 0});
  return englishMatch || null;
}

async function getTypePokemon(typeKey) {
  const response = await fetch(`https://pokeapi.co/api/v2/type/${typeKey}`);
  const dataList = await response.json();
  return dataList.pokemon.map(e => e.pokemon.name);
}

async function fetchPokemonList(names) {
  const tasks = names.map(name => fetchPokemonData(name));
  return Promise.all(tasks);
}

function removeDuplicates(arr) {
  return [...new Set(arr)];
}
