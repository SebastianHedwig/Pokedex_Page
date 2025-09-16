// ========== Fetch + Format Helper ==========
async function fetchSpeciesByUrl(url) {
  const response = await fetch(url);
  return response.json();
}

async function fetchSpeciesByName(name) {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon-species/" + name + "/");
  return response.ok ? response.json() : null;
}

function getDefaultVarietyName(species) {
  const varieties = species && species.varieties ? species.varieties : [];
  const def = varieties.find(function (variety) { return variety.is_default; });
  return def && def.pokemon ? def.pokemon.name : null;
}

async function fetchEvolutionChain(url) {
  const response = await fetch(url);
  return response.json();
}

async function fetchLocationsTop5ByName(name) {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + name + "/encounters");
  const data = await response.json();
  return data.map(function (location) {
    return location.location_area.name.replace(/-/g, " ");
  }).slice(0, 5);
}

async function fetchAbility(url) {
  const response = await fetch(url);
  return response.json();
}

function fetchEvoSpecies(evoStart) {
  const evoList = [];
  (function chain(current) {
    evoList.push(current.species.name);
    if (current.evolves_to) current.evolves_to.forEach(chain);
  })(evoStart);
  return evoList;
}

async function fetchJsonOrNull(url) {
  const response = await fetch(url);
  if (!response.ok) return null;
  return response.json();
}

async function ensurePokemonInCacheByName(name) {
  let pokemon = pokeCache.find(function (e) { return e.name === name; });
  if (!pokemon) {
    pokemon = await fetchPokemonData(name);
    cachePokemon([pokemon]);
  }
  return pokemon;
}

async function ensurePokemonBySpeciesName(speciesName) {
  const species = await fetchSpeciesByName(speciesName);
  const defaultName = getDefaultVarietyName(species) || speciesName;
  let pokemon = pokeCache.find(function (e) { return e.name === defaultName; });
  if (!pokemon) {
    pokemon = await fetchPokemonData(defaultName);
    cachePokemon([pokemon]);
  }
  return pokemon;
}

function mapAbilityCard(abilityInfo, data) {
  const en = data.effect_entries.find(function (e) { return e.language.name === "en"; });
  const title = abilityInfo.ability.name + (abilityInfo.is_hidden ? " (Hidden)" : "");
  return { title: title, effect: (en && en.effect) ? en.effect : "" };
}

function delay(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

function updateActiveTab(tab) {
  const btns = document.querySelectorAll(".dexdlg__nav .tab");
  btns.forEach(function (btn) {
    btn.classList.remove("is-active");
    btn.setAttribute("aria-selected", "false");
  });
  const btnActive = Array.from(btns).find(function (btn) { return btn.dataset.tab === tab; });
  if (!btnActive) return;
  btnActive.classList.add("is-active");
  btnActive.setAttribute("aria-selected", "true");
  btnActive.focus();
}
