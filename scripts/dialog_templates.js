// ========== Templates ==========
function tplDialog(pokemon) {
  return /*html*/ `
    <div class="dexdlg">
      ${tplLeft(pokemon)}
      ${tplRight("main")}
    </div>`;
}

function tplLeft(pokemon) {
  const type = (pokemon.types && pokemon.types[0] && pokemon.types[0].type && pokemon.types[0].type.name) || "unknown";
  return /*html*/ `
    <div class="dexdlg_left">
      ${tplScreen(type, getPokemonImage(pokemon))}
      ${tplControls()}
      ${tplMeta(formatName(pokemon.name), type)}
    </div>`;
}

function tplScreen(type, imgHtml) {
  return /*html*/ `<div class="dexdlg_screen ${type}" id="dlg_screen">${imgHtml}</div>`;
}

function tplControls() {
  return /*html*/ `
    <div class="dexdlg_controls">
      <button class="btn btn_primary" onclick="closePokeDialog()">Close</button>
      <button class="btn" onclick="dialogPrev()">Previous</button>
      <button class="btn" onclick="dialogNext()">Next</button>
    </div>`;
}

function tplMeta(name, type) {
  const cls = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  return /*html*/ `
    <div class="dexdlg_meta">
      <div><strong>Name:</strong> ${name}</div>
      <div><strong>Class:</strong> ${cls}</div>
    </div>`;
}

function tplRight(active) {
  return /*html*/ `
    <div class="dexdlg_right">
      ${tplNav(active)}
      <div id="dlg_tabcontent" class="dexdlg_content"></div>
    </div>`;
}

function tplNav(active) {
  const items = ["main", "stats", "abilities", "evo"];
  const labels = { main: "Main", stats: "Stats", abilities: "Abilities", evo: "Evo-Chain" };
  const buttons = items.map(function (t) {
    return /*html*/ `
      <button class="tab ${active === t ? "is_active" : ""}"
              data-tab="${t}" role="tab" aria-selected="${active === t}"
              onclick="setDialogTab('${t}')">${labels[t]}</button>`;
  }).join("");
  return /*html*/ `<nav class="dexdlg_nav" role="tablist">${buttons}</nav>`;
}

// ========== Tab-Content ==========
function tplMainStatic(pokemon, species, locations) {
  const types = (pokemon.types || []).map(function (x) { return x.type.name; }).join(", ");
  const list = locations.map(function (location) { return /*html*/ `<li>${location}</li>`; }).join("");
  return /*html*/ `
    <div class="kv"><span>ID</span><span>#${pokemon.id}</span></div>
    <div class="kv"><span>Type(s)</span><span>${types}</span></div>
    <div class="kv"><span>Height</span><span>${(pokemon.height / 10).toFixed(1)} m</span></div>
    <div class="kv"><span>Weight</span><span>${(pokemon.weight / 10).toFixed(1)} kg</span></div>
    <div class="kv"><span>Base Experience</span><span>${pokemon.base_experience}</span></div>
    <div class="kv"><span>Capture Rate</span><span>${species.capture_rate} %</span></div>
    <div class="kv"><span>Base Happiness</span><span>${species.base_happiness}</span></div>
    <div class="kv"><span>Locations</span><ul class="location_list">${list}</ul></div>`;
}

function showTabLoading(container) {
  container.innerHTML = /*html*/ `
    <div class="tab_loading">
      <div class="spinner"></div>
    </div>`;
}

function tplStats(pokemon) {
  return (pokemon.stats || []).map(function (s) {
    const value = s.base_stat;
    const barWidthUI = Math.min(value, 150) / 1.5;
    return /*html*/ `
      <div class="bar">
        <span class="bar_label">${s.stat.name}</span>
        <div class="bar_track"><i style="width:${barWidthUI}%">${value}</i></div>
      </div>`;
  }).join("");
}

function tplAbilitiesCards(cards) {
  return cards.map(function (card) {
    return /*html*/ `
      <div class="ability_card">
        <h4>${card.title}</h4>
        <p>${card.effect}</p>
      </div>`;
  }).join("");
}

function tplEvoChain(pokeList) {
  const separator = /*html*/ `<div class="evo_arrow">↓</div>`;
  return /*html*/ `<div class="evo_chain">${pokeList.map(tplEvoItem).join(separator)}</div>`;
}

function tplEvoItem(pokemon) {
  return /*html*/ `
    <button class="evo_card" onclick="openPokeDialog(${pokemon.id})" title="go to">
      <div class="evo_img">${getPokemonImage(pokemon)}</div>
      <div class="evo_label">#${pokemon.id} ${formatName(pokemon.name)}</div>
    </button>`;
}
