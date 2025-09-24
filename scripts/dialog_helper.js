// ========== Helper Constants ==========
const DEFAULT_MAX_UI = 150;

const NAV_TABS = [
  { id: "main", label: "Main" },
  { id: "stats", label: "Stats" },
  { id: "abilities", label: "Abilities" },
  { id: "evo", label: "Evo-Chain" },
];

// ========== Type & Label Helpers ==========
function getPrimaryType(pokemon, fallback = "unknown") {
  return pokemon?.types?.[0]?.type?.name || fallback;
}

function getTypesLabel(pokemon) {
  return (pokemon?.types ?? [])
    .map(t => t?.type?.name).filter(Boolean).join(", ");
}

function formatTypeLabel(type) {
  const t = type?.trim();
  return t ? t[0].toUpperCase() + t.slice(1).toLowerCase() : "";
}

// ========== Main-Tab Helpers ==========
function formatHeightLabel(pokemon) {
  const height = Number(pokemon?.height);
  return Number.isFinite(height) ? `${(height / 10).toFixed(1)} m` : "";
}

function formatWeightLabel(pokemon) {
  const weight = Number(pokemon?.weight);
  return Number.isFinite(weight) ? `${(weight / 10).toFixed(1)} kg` : "";
}

function getBaseExperience(pokemon) {
  return pokemon?.base_experience ?? "";
}

function formatCaptureRate(species) {
  const capture = species?.capture_rate;
  return capture == null ? "" : `${capture} %`;
}

function getBaseHappiness(species) {
  return species?.base_happiness ?? "";
}

function renderLocationItems(locations) {
  return (locations ?? []).filter(Boolean).map(tplListItem).join("");
}

// ========== Stats-Tab Helpers (Basis -> Nutzung) ==========
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function valueToPercent(value, maxUi = DEFAULT_MAX_UI) {
  const clamped = clamp(value, 0, maxUi);
  return (clamped / maxUi) * 100;
}

function toWidthStyle(percent) {
  return `width:${percent}%`;
}

function getStatLabel(stat) {
  return stat?.stat?.name ?? "unknown";
}

function getStatValue(stat) {
  return Number(stat?.base_stat ?? 0);
}

function getStatsArray(pokemon) {
  return pokemon?.stats ?? [];
}

function renderStatItem(stat, maxUi = DEFAULT_MAX_UI) {
  const label = getStatLabel(stat);
  const value = getStatValue(stat);
  const pct = valueToPercent(value, maxUi);
  const widthStyle = toWidthStyle(pct);
  return tplStatItem(label, value, widthStyle);
}

function renderStatItems(pokemon, maxUi = DEFAULT_MAX_UI) {
  return getStatsArray(pokemon).map(s => renderStatItem(s, maxUi)).join("");
}

// ========== Evo-Tab Helpers ==========
function renderEvoItemsWithSeparator(pokeList) {
  const sep = tplEvoSeparator();
  return (pokeList ?? []).map(tplEvoItem).join(sep);
}

function fetchEvoSpecies(evoStart) {
  const evoList = [];
  (function chain(current) {
    evoList.push(current.species.name);
    if (current.evolves_to) current.evolves_to.forEach(chain);
  })(evoStart);
  return evoList;
}

// ========== Fetch Helpers ==========
async function fetchJsonOrNull(url) {
  const response = await fetch(url);
  if (!response.ok) return null;
  return response.json();
}

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

async function fetchAbility(url) {
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

// ========== Mapping/Transform Helpers ==========
function getDefaultVarietyName(species) {
  const varieties = species && species.varieties ? species.varieties : [];
  const def = varieties.find(function (variety) {
    return variety.is_default;
  });
  return def && def.pokemon ? def.pokemon.name : null;
}

function mapAbilityCard(abilityInfo, data) {
  const en = data.effect_entries.find(function (e) {
    return e.language.name === "en";
  });
  const title =
    abilityInfo.ability.name + (abilityInfo.is_hidden ? " (Hidden)" : "");
  return { title: title, effect: en && en.effect ? en.effect : "" };
}

// ========== Cache/Ensure Helpers ==========
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

// ========== UI Helper ==========
function updateActiveTab(tab) {
  const btns = document.querySelectorAll(".dexdlg_nav .tab");
  btns.forEach(function (btn) {
    btn.classList.remove("is_active");
    btn.setAttribute("aria-selected", "false");
  });
  const btnActive = Array.from(btns).find(function (btn) {
    return btn.dataset.tab === tab;
  });
  if (!btnActive) return;
  btnActive.classList.add("is_active");
  btnActive.setAttribute("aria-selected", "true");
  btnActive.focus();
}

function delay(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}
