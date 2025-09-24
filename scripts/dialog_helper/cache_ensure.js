async function ensurePokemonInCacheByName(name) {
  let pokemon = pokeCache.find(function (e) {
    return e.name === name;
  });
  if (!pokemon) {
    pokemon = await fetchPokemonData(name);
    cachePokemon([pokemon]);
  }
  return pokemon;
}

async function ensurePokemonBySpeciesName(speciesName) {
  const species = await fetchSpeciesByName(speciesName);
  const defaultName = getDefaultVarietyName(species) || speciesName;
  let pokemon = pokeCache.find(function (e) {
    return e.name === defaultName;
  });
  if (!pokemon) {
    pokemon = await fetchPokemonData(defaultName);
    cachePokemon([pokemon]);
  }
  return pokemon;
}
