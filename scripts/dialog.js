// dialog.js — Clean Code, Templates ausgelagert

(() => {
  let dlgPoke = null;

  // Public API
  window.openPokeDialog = openPokeDialog;
  window.closePokeDialog = closePokeDialog;
  window.dialogPrev = dialogPrev;
  window.dialogNext = dialogNext;
  window.setDialogTab = setDialogTab;

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
        <button class="btn" onclick="dialogPrev()">previous</button>
        <button class="btn" onclick="dialogNext()">next</button>
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
    const labels = {
      main: "Main",
      stats: "Stats",
      abilities: "Abilities",
      evo: "Evo-Chain",
    };
    return /*html*/ `
      <nav class="dexdlg__nav" role="tablist">
        ${items
          .map(
            (t) => /*html*/ `
          <button class="tab ${active === t ? "is-active" : ""}"
                  data-tab="${t}" role="tab" aria-selected="${active === t}"
                  onclick="setDialogTab('${t}')">${labels[t]}</button>`
          )
          .join("")}
      </nav>`;
  }

  // ========== Tab-Inhalte (HTML) ==========
  function tplMainStatic(p, sp, locs) {
    const types = p.types.map((x) => x.type.name).join(", ");
    const list = locs.map((l) => `<li>${l}</li>`).join("");
    return /*html*/ `
      <div class="kv"><span>ID</span><span>#${p.id}</span></div>
      <div class="kv"><span>Type(s)</span><span>${types}</span></div>
      <div class="kv"><span>Height</span><span>${(p.height / 10).toFixed(
        1
      )} m</span></div>
      <div class="kv"><span>Weight</span><span>${(p.weight / 10).toFixed(
        1
      )} kg</span></div>
      <div class="kv"><span>Base Experience</span><span>${
        p.base_experience
      }</span></div>
      <div class="kv"><span>Capture Rate</span><span>${
        sp.capture_rate
      } %</span></div>
      <div class="kv"><span>Base Happiness</span><span>${
        sp.base_happiness
      }</span></div>
      <div class="kv"><span>Fundorte</span><ul class="location-list">${list}</ul></div>`;
  }

  function tplStats(p) {
    return (p.stats || [])
      .map((s) => {
        const v = s.base_stat;
        const w = Math.min(v, 150) / 1.5;
        return /*html*/ `
        <div class="bar">
          <span class="bar__label">${s.stat.name}</span>
          <div class="bar__track"><i style="width:${w}%">${v}</i></div>
        </div>`;
      })
      .join("");
  }

  function tplAbilitiesCards(cards) {
    return cards
      .map(
        (c) => /*html*/ `
      <div class="ability-card">
        <h4>${c.title}</h4>
        <p>${c.effect}</p>
      </div>`
      )
      .join("");
  }

  function tplEvoChain(pokes) {
    const sep = /*html*/ `<div class="evo_arrow">↓</div>`;
    return /*html*/ `<div class="evo_chain">${pokes
      .map(tplEvoItem)
      .join(sep)}</div>`;
  }

  function tplEvoItem(p) {
    return /*html*/ `
      <button class="evo_card" onclick="openPokeDialog(${p.id})" title="go to">
        <div class="evo_img">${getPokemonImage(p)}</div>
        <div class="evo_label">#${p.id} ${formatName(p.name)}</div>
      </button>`;
  }

  // ========== Fetch + Format Helpers ==========
  async function fetchSpeciesById(id) {
    const r = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
    return r.json();
  }

  async function fetchEvolutionChain(url) {
    const r = await fetch(url);
    return r.json();
  }

  async function fetchLocationsTop5(id) {
    const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`);
    const data = await r.json();
    return data.map((l) => l.location_area.name.replace(/-/g, " ")).slice(0, 5);
  }

  async function fetchAbility(url) {
    const r = await fetch(url);
    return r.json();
  }

  function extractEvoSpecies(node) {
    const out = [];
    (function walk(n) {
      out.push(n.species.name);
      n.evolves_to?.forEach(walk);
    })(node);
    return out;
  }

  async function ensurePokemonInCacheByName(name) {
    let p = pokeCache.find((x) => x.name === name);
    if (!p) {
      p = await fetchPokemonData(name);
      cachePokemon([p]);
    }
    return p;
  }

  function mapAbilityCard(a, data) {
    const en = data.effect_entries.find((e) => e.language.name === "en");
    const title = `${a.ability.name}${a.is_hidden ? " (Hidden)" : ""}`;
    return { title, effect: en?.effect || "" };
  }

  // ========== Dialog-Logik ==========
  function openPokeDialog(id) {
    const p = pokeCache.find((x) => x.id === id);
    if (!p) return;
    renderPokeDialog(p);
  }

  function renderPokeDialog(p) {
    dlgPoke = p;
    const dlg = getEl("dialog");
    dlg.innerHTML = tplDialog(p);
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

  // ========== Tabs-Logik ==========
  async function setDialogTab(tab) {
    if (!dlgPoke) return;
    updateActiveTab(tab);
    const c = getEl("dlg_tabcontent");
    if (!c) return;

    if (tab === "main") return (c.innerHTML = await renderMainAsync(dlgPoke));
    if (tab === "stats") return (c.innerHTML = tplStats(dlgPoke));
    if (tab === "abilities")
      return (c.innerHTML = await renderAbilitiesAsync(dlgPoke));
    if (tab === "evo") return renderDlgEvoAsync(dlgPoke, c);
  }

  function updateActiveTab(tab) {
    const btns = document.querySelectorAll(".dexdlg__nav .tab");
    btns.forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-selected", "false");
    });
    const a = Array.from(btns).find((b) => b.dataset.tab === tab);
    if (!a) return;
    a.classList.add("is-active");
    a.setAttribute("aria-selected", "true");
    a.focus();
  }

  // ========== Async Render (Main / Abilities / Evo) ==========
  async function renderMainAsync(p) {
    const [sp, locs] = await Promise.all([
      fetchSpeciesById(p.id),
      fetchLocationsTop5(p.id),
    ]);
    const locations = locs.length > 0 ? locs : ["Unknown"];
    return tplMainStatic(p, sp, locations);
  }

  async function renderAbilitiesAsync(p) {
    const arr = await Promise.all(
      p.abilities.map(async (a) => {
        const data = await fetchAbility(a.ability.url);
        return mapAbilityCard(a, data);
      })
    );
    return tplAbilitiesCards(arr);
  }

  async function renderDlgEvoAsync(p, container) {
    container.innerHTML = /*html*/ `<div class="placeholder">Loading evolution…</div>`;
    const sp = await fetchSpeciesById(p.id);
    const chain = await fetchEvolutionChain(sp.evolution_chain.url);
    const names = extractEvoSpecies(chain.chain);
    const pokes = await Promise.all(names.map(ensurePokemonInCacheByName));
    container.innerHTML = tplEvoChain(pokes);
  }

  // ========== Dialog-Overlay Handling ==========
  function enableOverlayClose() {
    const dlg = getEl("dialog");
    dlg.onclick = onOverlayClick;
  }

  function disableOverlayClose() {
    const dlg = getEl("dialog");
    dlg.onclick = null;
  }

  function onOverlayClick(e) {
    if (e.target === e.currentTarget) closePokeDialog();
  }
})();
