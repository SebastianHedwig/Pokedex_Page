async function fetchSpeciesByUrl(url) {
  const response = await fetch(url);
  return response.json();
}

async function fetchSpeciesByName(name) {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon-species/" + name + "/"
  );
  return response.ok ? response.json() : null;
}

async function fetchEvolutionChain(url) {
  const response = await fetch(url);
  return response.json();
}

async function fetchLocationsTop5ByName(name) {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon/" + name + "/encounters"
  );
  const data = await response.json();
  return data
    .map(function (location) {
      return location.location_area.name.replace(/-/g, " ");
    })
    .slice(0, 5);
}

async function fetchAbility(url) {
  const response = await fetch(url);
  return response.json();
}

async function fetchJsonOrNull(url) {
  const response = await fetch(url);
  if (!response.ok) return null;
  return response.json();
}
