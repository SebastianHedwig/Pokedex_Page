async function fetchPokemonData(pokeNameOrId) {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokeNameOrId}`;
  const pokeList = await fetch(url);
  return pokeList.json();
}

async function loadPokemonBatch(offset = 0, size = 20) {
  const ids = Array.from({length: size}, (_, i) => offset + i + 1);
  return Promise.all(ids.map(fetchPokemonData));
}

function cachePokemon(pokeList) {
  for (const poke of pokeList) pokeCache.push(poke);
  return pokeCache.length;
}

function formatName(name) {
  if (!name) return "Unbekannt";
  return name[0].toUpperCase() + name.slice(1);
}

function getPokemonImage(poke) {
  const url = poke.sprites?.other?.["official-artwork"]?.front_default;
  return url ? /*html*/ `<img class="poke_img" src="${url}" alt="${poke.name}">` : "";
}

function getTypeIcons(poke) {
  const types = poke.types;
  if (!types.length) return "Unbekannt";

  return types
    .map(t => getTypeIconTemplate(t.type.name))
    .join(" ");
}