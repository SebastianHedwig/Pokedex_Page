const pokeCache = [];

let currentOffset = 0;
const pageSize = 28;

function init() {
  renderStartOverlay();
  startOverlay();
  renderHeader();
  renderContentSkeleton();
  initSearch();
  renderFooter();
  startInitialLoad();
}

function getEl(id) {
  return document.getElementById(id);
}

function renderStartOverlay() {
  getEl("cover_overlay").innerHTML = getStartOverlay();
}

function renderHeader() {
  getEl("page_head").innerHTML = getHeaderTemplate();
}

function renderFooter() {
  getEl("page_footer").innerHTML = getFooterTemplate();
}

function renderContentSkeleton() {
  getEl("page_content").innerHTML = getPageContentSkeletonTemplate();
}

function startInitialLoad() {
  renderCacheBevorLoad(currentOffset, pageSize);
}

async function renderCacheBevorLoad(offset, size) {
  renderCards(pokeCache);
  const batch = await loadPokemonBatch(offset, size);
  cachePokemon(batch);
  renderCards(pokeCache);
}

function renderCards(list) {
  const query = getEl("pokesearch_input")?.value.trim().toLowerCase() || "";
  getEl("pokemon_cards_container").innerHTML = list.map(getPokemonCardTemplate).join("");

  const btn = getEl("load_btn");
  if (btn) btn.style.display = query.length >= SEARCH_MIN_LENGTH ? "none" : "flex";
}

function loadPokemon() {
  currentOffset += pageSize;
  renderCacheBevorLoad(currentOffset, pageSize);
}
