async function fetchPokemonData(pokeNameOrId) {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokeNameOrId}`;
  const pokeList = await fetch(url);
  return pokeList.json();
}

async function loadPokemonBatch(offset = 0, size = 28) {
  const ids = Array.from({length: size}, (_, i) => offset + i + 1);
  return Promise.all(ids.map(fetchPokemonData));
}

function cachePokemon(list) {
  const ids = new Set(pokeCache.map(pokemon => pokemon.id));
  list.forEach(pokemon => { if (!ids.has(pokemon.id)) pokeCache.push(pokemon);ids.add(pokemon.id);});
  pokeCache.sort((a, b) => a.id - b.id);
  return pokeCache.length;
}

function mergeIntoCache(list) {
  const ids = new Set(pokeCache.map(pokemon => pokemon.id));
  list.forEach(pokemon => { if (!ids.has(pokemon.id)) pokeCache.push(pokemon);ids.add(pokemon.id);});
  pokeCache.sort((a, b) => a.id - b.id);
  return pokeCache.length;
}

function formatName(name) {
  if (!name) return "Unknown";
  return name[0].toUpperCase() + name.slice(1);
}

function getPokemonImage(poke) {
  const url = poke.sprites?.other?.["official-artwork"]?.front_default;
  if (!url) return "";

  const mainType = poke.types?.[0]?.type?.name || "Unknown";
  return /*html*/ `
    <img class="poke_img ${mainType}" src="${url}" alt="Picture of ${poke.name}">`;
}

function getTypeIcons(poke) {
  const types = poke.types;
  if (!types.length) return "Unknown";

  return types.map(t => getTypeIconTemplate(t.type.name)).join(" ");
}