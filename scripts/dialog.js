
let currentDialogPokemon = null;

// ========== Templates (nur HTML) ==========
function tplDialog(p) {
  return /*html*/ `
    <div class="dexdlg">
      ${tplLeft(p)}
      ${tplRight("main")}
    </div>`;
}

function tplLeft(p) {
  const type = p.types?.[0]?.type?.name || "unknown";
  return /*html*/ `
    <div class="dexdlg__left">
      ${tplScreen(type, getPokemonImage(p))}
      ${tplControls()}
      ${tplMeta(formatName(p.name), type)}
    </div>`;
}

function tplScreen(type, imgHtml) {
  return /*html*/ `<div class="dexdlg__screen ${type}" id="dlg_screen">${imgHtml}</div>`;
}

function tplControls() {
  return /*html*/ `
    <div class="dexdlg__controls">
      <button class="btn btn--primary" onclick="closePokeDialog()">Close</button>
      <button class="btn" onclick="dialogPrev()">Previous</button>
      <button class="btn" onclick="dialogNext()">Next</button>
    </div>`;
}

function tplMeta(name, type) {
  const cls = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  return /*html*/ `
    <div class="dexdlg__meta">
      <div><strong>Name:</strong> ${name}</div>
      <div><strong>Class:</strong> ${cls}</div>
    </div>`;
}

function tplRight(active) {
  return /*html*/ `
    <div class="dexdlg__right">
      ${tplNav(active)}
      <div id="dlg_tabcontent" class="dexdlg__content"></div>
    </div>`;
}

function tplNav(active) {
  const items = ["main", "stats", "abilities", "evo"];
  const labels = {main: "Main", stats: "Stats", abilities: "Abilities",evo: "Evo-Chain",};
  return /*html*/ `
    <nav class="dexdlg__nav" role="tablist">
      ${items.map((t) => /*html*/ `
        <button class="tab ${active === t ? "is-active" : ""}"
                data-tab="${t}" role="tab" aria-selected="${active === t}"
                onclick="setDialogTab('${t}')">${labels[t]}</button>`)
        .join("")}
    </nav>`;
}

// ========== Tab-Inhalte (HTML) ==========
function tplMainStatic(p, sp, locs) {
  const types = p.types.map((x) => x.type.name).join(", ");
  const list = locs.map((l) => /*html*/ `<li>${l}</li>`).join("");
  return /*html*/ `
    <div class="kv"><span>ID</span><span>#${p.id}</span></div>
    <div class="kv"><span>Type(s)</span><span>${types}</span></div>
    <div class="kv"><span>Height</span><span>${(p.height / 10).toFixed(1)} m</span></div>
    <div class="kv"><span>Weight</span><span>${(p.weight / 10).toFixed(1)} kg</span></div>
    <div class="kv"><span>Base Experience</span><span>${p.base_experience}</span></div>
    <div class="kv"><span>Capture Rate</span><span>${sp.capture_rate} %</span></div>
    <div class="kv"><span>Base Happiness</span><span>${sp.base_happiness}</span></div>
    <div class="kv"><span>Locations</span><ul class="location-list">${list}</ul></div>`;
}

function showTabLoading(container) {
  container.innerHTML = /*html*/ `
  <div class="tab-loading">
    <div class="spinner"></div>
  </div>`;
}

function tplStats(p) {
  return (p.stats || []).map((s) => {
    const v = s.base_stat;
    const w = Math.min(v, 150) / 1.5;
    return /*html*/ `
      <div class="bar">
        <span class="bar__label">${s.stat.name}</span>
        <div class="bar__track"><i style="width:${w}%">${v}</i></div>
      </div>`})
    .join("");
}

function tplAbilitiesCards(cards) {
  return cards.map((c) => /*html*/ `
    <div class="ability-card">
      <h4>${c.title}</h4>
      <p>${c.effect}</p>
    </div>`)
    .join("");
}

function tplEvoChain(pokes) {
  const sep = /*html*/ `<div class="evo_arrow">↓</div>`;
  return /*html*/ `
    <div class="evo_chain">${pokes.map(tplEvoItem).join(sep)}</div>`;
}

function tplEvoItem(p) {
  return /*html*/ `
    <button class="evo_card" onclick="openPokeDialog(${p.id})" title="go to">
      <div class="evo_img">${getPokemonImage(p)}</div>
      <div class="evo_label">#${p.id} ${formatName(p.name)}</div>
    </button>`;
}

// ========== Fetch + Format Helpers ==========
async function fetchSpeciesByUrl(url) {
  const r = await fetch(url);
  return r.json();
}

function getDefaultVarietyName(species) {
  const def = species.varieties?.find(v => v.is_default);
  return def?.pokemon?.name || species.name;
}

async function fetchEvolutionChain(url) {
  const r = await fetch(url);
  return r.json();
}

async function fetchLocationsTop5ByName(name) {
  const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/encounters`);
  const data = await r.json();
  return data.map(l => l.location_area.name.replace(/-/g, " ")).slice(0, 5);
}

async function fetchAbility(url) {
  const r = await fetch(url);
  return r.json();
}

function fetchEvoSpecies(evoStart) {
  const evoList = [];
  (function chain(current) {evoList.push(current.species.name);
    current.evolves_to?.forEach(chain)})(evoStart);
  return evoList;
}

async function ensurePokemonInCacheByName(name) {
  let pokemon = pokeCache.find((x) => x.name === name);
  if (!pokemon) {
    pokemon = await fetchPokemonData(name);
    cachePokemon([pokemon]);
  }
  return pokemon;
}

function mapAbilityCard(abilityInfo, data) {
  const en = data.effect_entries.find((e) => e.language.name === "en");
  const title = `${abilityInfo.ability.name}${abilityInfo.is_hidden ? " (Hidden)" : ""}`;
  return { title, effect: en?.effect || "" };
}

// ========== Dialog-Logik ==========
function openPokeDialog(id) {
  const pokemon = pokeCache.find((e) => e.id === id);
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
}

function closePokeDialog() {
  const dlg = getEl("dialog");
  dlg.classList.add("d_none");
  dlg.innerHTML = "";
  disableOverlayClose();
}

function dialogPrev() {
  if (!currentDialogPokemon) return;
  const i = pokeCache.findIndex((e) => e.id === currentDialogPokemon.id);
  const pokemon = pokeCache[i > 0 ? i - 1 : 0];
  if (pokemon) renderPokeDialog(pokemon);
}

function dialogNext() {
  if (!currentDialogPokemon) return;
  const i = pokeCache.findIndex((e) => e.id === currentDialogPokemon.id);
  const pokemon = pokeCache[i < pokeCache.length - 1 ? i + 1 : i];
  if (pokemon) renderPokeDialog(pokemon);
}

// ========== Tabs-Logik ==========
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


function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function updateActiveTab(tab) {
  const btns = document.querySelectorAll(".dexdlg__nav .tab");
  btns.forEach((btn) => {
    btn.classList.remove("is-active");
    btn.setAttribute("aria-selected", "false");
  });
  const btnActive = Array.from(btns).find((btn) => btn.dataset.tab === tab);
  if (!btnActive) return;
  btnActive.classList.add("is-active");
  btnActive.setAttribute("aria-selected", "true");
  btnActive.focus();
}

// ========== Async Render (Main / Abilities / Evo) ==========
async function renderMainAsync(pokemon) {
const speciesData = await fetchSpeciesByUrl(pokemon.species.url);
const defName = getDefaultVarietyName(speciesData);
const locs = await fetchLocationsTop5ByName(defName);
const locations = locs.length ? locs : ["Unknown"];
return tplMainStatic(pokemon, speciesData, locations);
}

async function renderAbilitiesAsync(pokemon) {
  const abilities = await Promise.all(
    pokemon.abilities.map(async (abilityInfo) => {
      const data = await fetchAbility(abilityInfo.ability.url);
      return mapAbilityCard(abilityInfo, data);
    })
  );
  return tplAbilitiesCards(abilities);
}

async function renderDlgEvoAsync(pokemon) {
const species = await fetchSpeciesByUrl(pokemon.species.url);
const chain = await fetchEvolutionChain(species.evolution_chain.url);
const names = fetchEvoSpecies(chain.chain);
const pokes = await Promise.all(names.map(ensurePokemonInCacheByName));
return tplEvoChain(pokes);
}


// ========== Dialog-Overlay Handling ==========
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
