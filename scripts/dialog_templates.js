// ========== Templates ==========
function tplDialog(pokemon) {
  return /*html*/ `
    <div class="dexdlg" role="document" aria-labelledby="dlg_pokemon_name">
      ${tplLeft(pokemon)}
      ${tplRight("main")}
    </div>`;
}

function tplLeft(pokemon) {
  return /*html*/ `
    <div class="dexdlg_left">
      ${tplScreen(getPrimaryType(pokemon), getPokemonImage(pokemon))}
      ${tplControls()}
      ${tplMeta(formatName(pokemon.name), getPrimaryType(pokemon))}
    </div>`;
}

function tplScreen(type, imgHtml) {
  return /*html*/ `<div class="dexdlg_screen ${type}" id="dlg_screen">${imgHtml}</div>`;
}

function tplControls() {
  return /*html*/ `
    <div class="dexdlg_controls">
      <button class="btn btn_primary" type="button" onclick="closePokeDialog()" aria-label="Close Pokemon details">Close</button>
      <button id="btn_prev" class="btn" type="button" onclick="dialogPrev()" aria-label="Show previous Pokemon">Previous</button>
      <button id="btn_next" class="btn" type="button" onclick="dialogNext()" aria-label="Show next Pokemon">Next</button>
    </div>`;
}

function tplMeta(name, type) {
  return /*html*/ `
    <div class="dexdlg_meta">
      <div id="dlg_pokemon_name"><strong>Name:</strong> ${name}</div>
      <div><strong>Class:</strong> ${formatTypeLabel(type)}</div>
    </div>`;
}

function tplRight(active) {
  return /*html*/ `
    <div class="dexdlg_right">
      ${tplNav(active)}
      <div id="dlg_tabcontent" class="dexdlg_content" role="tabpanel" tabindex="0" aria-labelledby="dlg_tab_${active}"></div>
    </div>`;
}

function navButtonsHTML(active) {
  return NAV_TABS.map(tab => /*html*/ `
    <button type="button"
            class="tab
            ${active === tab.id ? "is_active" : ""}"
            id="dlg_tab_${tab.id}"
            data-tab="${tab.id}"
            role="tab"
            aria-selected="${active === tab.id}"
            aria-controls="dlg_tabcontent"
            onclick="setDialogTab('${tab.id}')">
        ${tab.label}
    </button>`
  ).join("");
}

function tplNav(active) {
  return /*html*/ `
    <nav class="dexdlg_nav" role="tablist" aria-label="Pokemon detail sections">${navButtonsHTML(active)}</nav>`;
}

// ========== Tab-Content ==========
function tplMainStatic(pokemon, species, locations) {
  return /*html*/ `
    <div class="kv"><span>ID</span><span>#${pokemon?.id ?? ""}</span></div>
    <div class="kv"><span>Type(s)</span><span>${getTypesLabel(pokemon)}</span></div>
    <div class="kv"><span>Height</span><span>${formatHeightLabel(pokemon)}</span></div>
    <div class="kv"><span>Weight</span><span>${formatWeightLabel(pokemon)}</span></div>
    <div class="kv"><span>Base Experience</span><span>${getBaseExperience(pokemon)}</span></div>
    <div class="kv"><span>Capture Rate</span><span>${formatCaptureRate(species)}</span></div>
    <div class="kv"><span>Base Happiness</span><span>${getBaseHappiness(species)}</span></div>
    <div class="kv"><span>Locations</span>${tplLocationList(renderLocationItems(locations))}</div>`;
}

function tplListItem(text) {
  return /*html*/ `
    <li>${text}</li>`;
}

function tplLocationList(items) {
  return /*html*/ `
    <ul class="location_list">${items}</ul>`;
}

function showTabLoading(container) {
  container.innerHTML = /*html*/ `
    <div class="tab_loading" role="status" aria-live="polite" aria-label="Loading">
      <div class="spinner" aria-hidden="true"></div>
    </div>`;
}

function tplStatItem(label, value, widthStyle) {
  return /*html*/ `
    <div class="bar">
      <span class="bar_label">${label}</span>
      <div class="bar_track"><i style="${widthStyle}">${value}</i></div>
    </div>`;
}

function tplStats(pokemon) {
  return /*html*/ `
  ${renderStatItems(pokemon)}`;
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

function tplEvoSeparator() {
  return /*html*/ `
    <div class="evo_arrow" aria-hidden="true">↓</div>`;
}

function tplEvoChain(pokeList) {
  return /*html*/ `
    <div class="evo_chain">${renderEvoItemsWithSeparator(pokeList)}</div>`;
}

function tplEvoItem(pokemon) {
  return /*html*/ `
    <button class="evo_card" type="button" onclick="openPokeDialog(${pokemon.id})" aria-label="Open details for ${formatName(pokemon.name)}">
      <div class="evo_img">${getPokemonImage(pokemon)}</div>
      <div class="evo_label">#${pokemon.id} ${formatName(pokemon.name)}</div>
    </button>`;
}
