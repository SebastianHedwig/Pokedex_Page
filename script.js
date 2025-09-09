const pokeCache = [];

let currentOffset = 0;
const pageSize = 20;

function init() {
  renderHeader();
  renderContentSkeleton();
  renderFooter();
  startInitialLoad();
}

function getEl(id) {
  return document.getElementById(id);
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
  getEl("pokemon_cards_container").innerHTML = list.map(getPokemonCardTemplate).join("");
}

function loadPokemon() {
  currentOffset += pageSize;
  renderCacheBevorLoad(currentOffset, pageSize);
}