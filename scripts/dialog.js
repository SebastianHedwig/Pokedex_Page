// Templates
function getPokeDialogTemplate(p) {
  const id = p.id;
  const name = formatName(p.name);
  const type = p.types?.[0]?.type?.name || "unknown";
  const img = getPokemonImage(p);
  return /*html*/ `
    <div class="dexdlg">
      <div class="dexdlg__left">
        <div class="dexdlg__screen ${type}" id="dlg_screen">${img}</div>
        <div class="dexdlg__controls">
          <button class="btn btn--primary" onclick="closePokeDialog()">Close</button>
          <button class="btn" onclick="dialogPrev()">previous</button>
          <button class="btn" onclick="dialogNext()">next</button>
        </div>
        <div class="dexdlg__meta">
          <div><strong>Name:</strong> ${name}</div>
          <div><strong>Class:</strong> ${type}</div>
        </div>
      </div>
      <div class="dexdlg__right">
        ${getDialogNavTemplate("main")}
        <div id="dlg_tabcontent" class="dexdlg__content"></div>
      </div>
    </div>
  `;
}

function getDialogNavTemplate(active) {
  const items = ["main", "stats", "abilities", "evo"];
  const labels = { main:"Main", stats:"Stats", abilities:"Abilities", evo:"Evo-Chain" };
  return /*html*/ `
    <nav class="dexdlg__nav">
      ${items.map(t => `
        <button class="tab ${active===t ? "is-active" : ""}" data-tab="${t}" onclick="setDialogTab('${t}')">
          ${labels[t]}
        </button>`).join("")}
    </nav>`;
}

// Rendering: Tabs
function renderDlgMain(p) {
  const t = (p.types || []).map((x) => x.type.name).join(", ");
  return /*html*/ `
    <div class="kv"><span>ID</span><span>#${p.id}</span></div>
    <div class="kv"><span>Types</span><span>${t}</span></div>
    <div class="kv"><span>Height</span><span>${(p.height / 10).toFixed(
      1
    )} m</span></div>
    <div class="kv"><span>Weight</span><span>${(p.weight / 10).toFixed(
      1
    )} kg</span></div>`;
}

function renderDlgStats(p) {
  return (p.stats || []).map(s => {
    const value = s.base_stat;
    const width = Math.min(value, 150) / 1.5; // 100% = 150 Punkte
    return `
      <div class="bar">
        <span class="bar__label">${s.stat.name}</span>
        <div class="bar__track">
          <i style="width:${width}%">${value}</i>
        </div>
      </div>`;
  }).join("");
}


function renderDlgAbilities(p) {
  return (p.abilities || [])
    .map(
      (a) => `
    <div class="pill">${a.ability.name}${a.is_hidden ? " (hidden)" : ""}</div>`
    )
    .join("");
}

// Evolution-Chain
async function renderDlgEvoAsync(p, container) {
  container.innerHTML = `<div class="placeholder">Loading evolution…</div>`;
  const species = await fetchSpeciesById(p.id);
  const chain = await fetchEvolutionChain(species.evolution_chain.url);
  const speciesList = extractEvoSpecies(chain.chain);
  const pokes = await Promise.all(speciesList.map(ensurePokemonInCacheByName));
  container.innerHTML = getEvoChainTemplate(pokes);
}

async function fetchSpeciesById(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
  return res.json();
}

async function fetchEvolutionChain(url) {
  const res = await fetch(url);
  return res.json();
}

function extractEvoSpecies(chainNode) {
  const list = [];
  (function walk(n) {
    list.push(n.species.name);
    n.evolves_to?.forEach(walk);
  })(chainNode);
  return list;
}

async function ensurePokemonInCacheByName(name) {
  let p = pokeCache.find((x) => x.name === name);
  if (!p) {
    p = await fetchPokemonData(name);
    cachePokemon([p]);
  }
  return p;
}

function getEvoChainTemplate(pokes) {
  const parts = pokes.map(getEvoItemTemplate);
  return `<div class="evo_chain">${parts.join(
    `<div class="evo_arrow">→</div>`
  )}</div>`;
}

function getEvoItemTemplate(p) {
  const img = getPokemonImage(p);
  const label = `#${p.id} ${formatName(p.name)}`;
  return `<button class="evo_card" onclick="openPokeDialog(${p.id})">
            <div class="evo_img">${img}</div>
            <div class="evo_label">${label}</div>
          </button>`;
}

// Logic
let dlgPoke = null;

function openPokeDialog(id) {
  const p = pokeCache.find((x) => x.id === id);
  if (!p) return;
  renderPokeDialog(p);
}

function renderPokeDialog(p) {
  dlgPoke = p;
  const dlg = getEl("dialog");
  dlg.innerHTML = getPokeDialogTemplate(p);
  dlg.classList.remove("d_none");
  setDialogTab("main");
}

function closePokeDialog() {
  const dlg = getEl("dialog");
  dlg.classList.add("d_none");
  dlg.innerHTML = "";
}

function setDialogTab(tab) {
  if (!dlgPoke) return;
  updateActiveTab(tab);

  const content = getEl("dlg_tabcontent");
  if (!content) return;

  if (tab === "main") return (content.innerHTML = renderDlgMain(dlgPoke));
  if (tab === "stats") return (content.innerHTML = renderDlgStats(dlgPoke));
  if (tab === "abilities")
    return (content.innerHTML = renderDlgAbilities(dlgPoke));
  if (tab === "evo") return renderDlgEvoAsync(dlgPoke, content);
}

function dialogPrev() {
  if (!dlgPoke) return;
  const i = pokeCache.findIndex((x) => x.id === dlgPoke.id);
  const p = pokeCache[i > 0 ? i - 1 : 0];
  if (p) renderPokeDialog(p);
}

function dialogNext() {
  if (!dlgPoke) return;
  const i = pokeCache.findIndex((x) => x.id === dlgPoke.id);
  const p = pokeCache[i < pokeCache.length - 1 ? i + 1 : i];
  if (p) renderPokeDialog(p);
}

function updateActiveTab(tab) {
  const buttons = document.querySelectorAll(".dexdlg__nav .tab");
  buttons.forEach(btn => btn.classList.remove("is-active"));

  const active = Array.from(buttons).find(
    btn => btn.dataset.tab === tab
  );
  if (active) active.classList.add("is-active");
}

