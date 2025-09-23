
let currentDialogPokemon = null;

// ========== Open/Close ==========
function openPokeDialog(id) {
  const pokemon = pokeCache.find(function (e) { return e.id === id; });
  if (!pokemon) return;
  renderPokeDialog(pokemon);
}

function renderPokeDialog(pokemon) {
  currentDialogPokemon = pokemon;
  const dlg = getEl("dialog");
  dlg.innerHTML = tplDialog(pokemon);
  dlg.classList.remove("d_none");
  setDialogTab("main");
  enableOverlayClose();
  syncDialogNavButtons();
}

function closePokeDialog() {
  const dlg = getEl("dialog");
  dlg.classList.add("d_none");
  dlg.innerHTML = "";
  disableOverlayClose();
}

// ========== Prev / Next ==========
function dialogPrev() {
  if (!currentDialogPokemon) return;
  const index = pokeCache.findIndex(function (e) { return e.id === currentDialogPokemon.id; });
  if (index <= 0) return;
  renderPokeDialog(pokeCache[index - 1]);
  syncDialogNavButtons();
}

function dialogNext() {
  if (!currentDialogPokemon) return;
  const index = pokeCache.findIndex(function (e) { return e.id === currentDialogPokemon.id; });
  if (index >= pokeCache.length - 1) return;
  renderPokeDialog(pokeCache[index + 1]);
  syncDialogNavButtons();
}

function syncDialogNavButtons() {
  const prevBtn = document.getElementById("btn_prev");
  const nextBtn = document.getElementById("btn_next");
  if (!currentDialogPokemon || !prevBtn || !nextBtn) return;

  const index = pokeCache.findIndex(function (e) { return e.id === currentDialogPokemon.id; });
  prevBtn.disabled = index <= 0;
  nextBtn.disabled = index >= (pokeCache.length - 1);
}

// ========== Tabs-Steuerung ==========
async function setDialogTab(tab) {
  if (!currentDialogPokemon) return;
  updateActiveTab(tab);

  const tabContent = getEl("dlg_tabcontent");
  if (!tabContent) return;

  showTabLoading(tabContent);
  const wait = delay(500);

  if (tab === "main") return renderMainTab(tabContent, wait);
  if (tab === "stats") return renderStatsTab(tabContent, wait);
  if (tab === "abilities") return renderAbilitiesTab(tabContent, wait);
  if (tab === "evo") return renderEvoTab(tabContent, wait);
}

async function renderMainTab(container, wait) {
  const html = await renderMainAsync(currentDialogPokemon);
  await wait;
  container.innerHTML = html;
}

async function renderStatsTab(container, wait) {
  await wait;
  container.innerHTML = tplStats(currentDialogPokemon);
}

async function renderAbilitiesTab(container, wait) {
  const html = await renderAbilitiesAsync(currentDialogPokemon);
  await wait;
  container.innerHTML = html;
}

async function renderEvoTab(container, wait) {
  const html = await renderDlgEvoAsync(currentDialogPokemon);
  await wait;
  container.innerHTML = html;
}

// ========== Overlay Handling ==========
function enableOverlayClose() {
  const dlg = getEl("dialog");
  dlg.onclick = clickToClose;
}

function disableOverlayClose() {
  const dlg = getEl("dialog");
  dlg.onclick = null;
}

function clickToClose(event) {
  if (event.target === event.currentTarget) closePokeDialog();
}

// ========== Async Renderer ==========
async function renderMainAsync(pokemon) {
  const speciesData = await fetchSpeciesByUrl(pokemon.species.url);
  const defaultName = getDefaultVarietyName(speciesData);
  const locs = await fetchLocationsTop5ByName(defaultName);
  const locations = (locs && locs.length) ? locs : ["Unknown"];
  return tplMainStatic(pokemon, speciesData, locations);
}

async function renderAbilitiesAsync(pokemon) {
  const promises = (pokemon.abilities || []).map(function (abilityInfo) {
    return fetchAbility(abilityInfo.ability.url).then(function (data) {
      return mapAbilityCard(abilityInfo, data);
    });
  });
  const abilities = await Promise.all(promises);
  return tplAbilitiesCards(abilities);
}

async function renderDlgEvoAsync(pokemon) {
    const speciesData = await fetchJsonOrNull(pokemon.species.url);
    const chainData = await fetchJsonOrNull(speciesData.evolution_chain.url);

    const speciesNames = fetchEvoSpecies(chainData.chain);
    const evoList = await Promise.all(speciesNames.map(ensurePokemonBySpeciesName));

    return tplEvoChain(evoList);
}
