// Main-Templates:
function getStartOverlay() {
  return /*html*/ `
    <div class="overlay_panel overlay_panel_left"></div>
    <div class="overlay_panel overlay_panel_right"></div>
    <img class="overlay_spinner" src="./assets/img/pokeball_512_spinner_flaticon.png" alt="Lade Pokeball">`;
}

function getHeaderTemplate() {
  return /*html*/ `
    <div id="header_content" class="content_wrapper p-lr-1r">
        <img class="header_logo" src="./assets/img/Pokedex_Logo_textstudio.png" alt="Pokedex Logo">
    </div>`;
}

function getPageContentSkeletonTemplate() {
  return /*html*/ `
    <div id="main_content_container" class="content_wrapper p-lr-1r">
      <div id="pokesearch_container">
        <img id="pokesearch_title_img" src="./assets/img/Pokesearch_Logo_textstudio.png" alt="Pokesearch Schriftzug">
        <form id="pokesearch_box" onsubmit="onSearchSubmit(event)">
          <label class="visually_hidden" for="pokesearch_input">Pokémon-Suche</label>
          <input id="pokesearch_input" type="search" placeholder="search your Pokemon(s)" oninput="onSearchInput(event)">
          <button class="search_btn" type="submit" aria-label="Pokémon suchen">Search API</button>
        </form>
      </div>
      <div id="pokemon_cards_container"></div>
      ${getLoadPokeBtnTemplate()}
    </div>`;
}

function getPokemonCardTemplate(pokemon) {
  const id = pokemon.id;
  const name = formatName(pokemon.name);
  const img = getPokemonImage(pokemon);
  const types = getTypeIcons(pokemon);

  return buildPokemonCardTemplate(id, name, img, types);
}

function buildPokemonCardTemplate(id, name, img, types) {
  return /*html*/ `
    <article class="poke_card" onclick="openPokeDialog(${id})">
      <div class="card_title_box" id="pokeCard_title_${id}">#${id} - ${name}</div>
      <div class="card_img_box" id="pokeCard_img_${id}">${img}</div>
      <div class="card_type_box" id="pokeCard_type_${id}">${types}</div>
    </article>`;
}

function getPokemonCardsContainerTemplate() {
  return /*html*/ `
    <div id="pokemon_cards_container"></div>`;
}

function getTypeIconTemplate(typeName) {
  return /*html*/ `
    <img class="type_icon" src="./assets/icons/poke_types/${typeName}.png" alt="Pokemon type icon for ${typeName}."
         title="${typeName[0].toUpperCase() + typeName.slice(1)}">`;
}

function getLoadPokeBtnTemplate() {
  return /*html*/ `
    <button id="load_btn" onclick="loadPokemon()">Load Further</button>`;
}

function getFooterTemplate() {
  return /*html*/ `
    <div id="footer_content" class="content_wrapper p-lr-1r">
        <span>© 2025 Sebastian Hedwig</span>
    </div>`;
}
