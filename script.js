const pokeCache = [];

let currentOffset = 0;
const pageSize = 28;

function init() {
  if (isLegalPage()) {
    hideStartOverlay();
    renderHeader(true);
    renderLegalPage();
    renderFooter();
    return;
  }

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

function hideStartOverlay() {
  const overlay = getEl("cover_overlay");
  if (overlay) overlay.classList.add("d_none");
}

function renderHeader(showBackLink = false) {
  getEl("page_head").innerHTML = getHeaderTemplate(showBackLink);
}

function renderFooter() {
  getEl("page_footer").innerHTML = getFooterTemplate();
}

function renderContentSkeleton() {
  const pageContent = getEl("page_content");
  pageContent.classList.remove("legal_page_content");
  pageContent.innerHTML = getPageContentSkeletonTemplate();
}

function renderLegalPage() {
  if (getCurrentPage() === "impressum") {
    renderImpressum();
  }

  if (getCurrentPage() === "privacy") {
    renderPrivacy();
  }
}

function renderImpressum() {
  const pageContent = getEl("page_content");
  pageContent.classList.add("legal_page_content");
  pageContent.innerHTML = getImpressumTemplate();
}

function renderPrivacy() {
  const pageContent = getEl("page_content");
  pageContent.classList.add("legal_page_content");
  pageContent.innerHTML = getPrivacyTemplate();
}

function showPrivacyPage(event) {
  if (event) event.preventDefault();

  hideStartOverlay();
  renderHeader(true);
  renderPrivacy();
  history.pushState(null, "", "./index.html?page=privacy");
}

function showImpressumPage(event) {
  if (event) event.preventDefault();

  hideStartOverlay();
  renderHeader(true);
  renderImpressum();
  history.pushState(null, "", "./index.html?page=impressum");
}

function isLegalPage() {
  return ["impressum", "privacy"].includes(getCurrentPage());
}

function getCurrentPage() {
  return new URLSearchParams(window.location.search).get("page");
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
  const cardsContainer = getEl("pokemon_cards_container");
  if (!cardsContainer) return;

  const query = getEl("pokesearch_input")?.value.trim().toLowerCase() || "";
  cardsContainer.innerHTML = list.map(getPokemonCardTemplate).join("");

  const btn = getEl("load_btn");
  if (btn) btn.style.display = query.length >= SEARCH_MIN_LENGTH ? "none" : "flex";
}

function onPokemonCardKeydown(event, id) {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  openPokeDialog(id);
}

async function loadPokemon() {
  const loadBtn = document.getElementById("load_btn");
  loadBtn.classList.add("d_none");
  showCardsSpinner();
  currentOffset += pageSize;

  let data = null;
  await loadPokemonBatch(currentOffset, pageSize)
    .then(function (d) {data = d}, function () {data = []});

  if (data && data.length) {cachePokemon(data)}
  await sleep(500);
  renderCards(pokeCache);
  loadBtn.classList.remove("d_none");
}

function sleep(ms) {
  return new Promise(function (resolve) {setTimeout(resolve, ms)});
}
