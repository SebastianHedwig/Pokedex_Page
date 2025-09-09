async function fetchPokemonData(pokemonNameOrId) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`;
    const pokeList = await fetch(url);
    return pokeList.json();
}