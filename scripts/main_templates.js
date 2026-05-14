function getStartOverlay() {
  return /*html*/ `
    <div class="overlay_panel overlay_panel_left"></div>
    <div class="overlay_panel overlay_panel_right"></div>
    <img class="overlay_spinner" src="./assets/img/pokeball_512_spinner_flaticon.png" alt="Lade Pokeball">`;
}

function getHeaderTemplate(showBackLink = false) {
  return /*html*/ `
    <div id="header_content" class="content_wrapper p-lr-1r">
      <a href="./index.html" aria-label="Go to homepage">
        <img class="header_logo" src="./assets/img/Pokedex_Logo_textstudio.png" alt="Pokedex Logo">
      </a>
      ${showBackLink ? getHeaderBackLinkTemplate() : ""}
    </div>`;
}

function getHeaderBackLinkTemplate() {
  return /*html*/ `
    <a class="header_back_link" href="./index.html" aria-label="Back to homepage">
      <span class="back_arrow" aria-hidden="true">←</span>
      <span>Back</span>
    </a>`;
}

function getPageContentSkeletonTemplate() {
  return /*html*/ `
    <div id="main_content_container" class="content_wrapper p-lr-1r">
      <div id="pokesearch_container">
        <img id="pokesearch_title_img" src="./assets/img/Pokesearch_Logo_textstudio.png" alt="Pokesearch">
        <form id="pokesearch_box" role="search" onsubmit="onSearchSubmit(event)">
          <label class="visually_hidden" for="pokesearch_input">Pokemon search</label>
          <input id="pokesearch_input" type="search" placeholder="search your Pokemon(s)" oninput="onSearchInput(event)">
          <button class="search_btn" type="submit" aria-label="Search Pokemon">Search API</button>
        </form>
      </div>
      <div id="pokemon_cards_container" aria-live="polite"></div>
      ${getLoadPokeBtnTemplate()}
    </div>`;
}

function getImpressumTemplate() {
  return /*html*/ `
    <section class="legal_content content_wrapper p-lr-1r">
      <h1>Legal Notice</h1>
      <p>Information pursuant to Section 5 DDG</p>

      <p>Sebastian Hedwig<br>
      Moselstra&szlig;e 3<br>
      65439 Fl&ouml;rsheim am Main</p>

      <h2>Contact</h2>
      <p>Phone: 0151 23537848<br>
      Email: sebastian.hedwig@web.de</p>

      <h2>Notice</h2>
      <p>This website is a private learning and portfolio project.<br>
      It is not affiliated with Nintendo, Game Freak, Creatures Inc. or The Pokémon Company.</p>

      <h2>Image and Icon Sources</h2>
      <p>Icons and images are provided by <a href="https://www.flaticon.com" target="_blank" rel="noopener noreferrer nofollow">flaticon.com</a>, <a href="https://www.freepik.com" target="_blank" rel="noopener noreferrer nofollow">freepik.com</a> and by data from the <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer nofollow">PokéAPI</a>.</p>
    </section>`;
}

function getPrivacyTemplate() {
  return /*html*/ `
    <section class="privacy_content content_wrapper p-lr-1r">
      <h1>Privacy Policy</h1>
      <h2 id="m4158">Preamble</h2>
      <p>With this privacy policy, we would like to inform you which types of your personal data (hereinafter also referred to as "data") we process, for what purposes and to what extent, in connection with providing our application.</p>
      <p>The terms used are not gender-specific.</p>

      <p>Last updated: May 14, 2026</p>
      <h2>Table of Contents</h2>
      <ul class="index">
        <li><a class="index-link" href="#m4158">Preamble</a></li>
        <li><a class="index-link" href="#m3">Controller</a></li>
        <li><a class="index-link" href="#mOverview">Overview of Processing Activities</a></li>
        <li><a class="index-link" href="#m2427">Applicable Legal Bases</a></li>
        <li><a class="index-link" href="#m27">Security Measures</a></li>
        <li><a class="index-link" href="#m15">Changes and Updates</a></li>
        <li><a class="index-link" href="#m42">Definitions</a></li>
      </ul>

      <h2 id="m3">Controller</h2>
      <p>Sebastian Hedwig<br>Moselstraße 3<br>65439 Flörsheim am Main</p>
      <p>Email address: <a href="mailto:sebastian.hedwig@web.de">sebastian.hedwig@web.de</a></p>

      <h2 id="mOverview">Overview of Processing Activities</h2>
      <p>The following overview summarizes the types of data processed, the purposes of processing and the categories of data subjects.</p>

      <h2 id="m2427">Applicable Legal Bases</h2>
      <p><strong>Applicable legal bases under the GDPR: </strong>Below you will find an overview of the legal bases of the GDPR on which we process personal data. Please note that, in addition to the GDPR, national data protection regulations in your or our country of residence or registered office may apply. If more specific legal bases apply in individual cases, we will inform you of this in this privacy policy.</p>
      <p><strong>National data protection regulations in Germany: </strong>In addition to the GDPR, national data protection regulations apply in Germany. This includes, in particular, the Federal Data Protection Act (Bundesdatenschutzgesetz - BDSG). The BDSG contains special provisions on the right of access, the right to deletion, the right to object, the processing of special categories of personal data, processing for other purposes, transfers and automated individual decision-making, including profiling. Data protection laws of individual German federal states may also apply.</p>

      <h2 id="m27">Security Measures</h2>
      <p>In accordance with legal requirements, and taking into account the state of the art, implementation costs, the nature, scope, circumstances and purposes of processing as well as the different likelihoods and severity of risks to the rights and freedoms of natural persons, we take appropriate technical and organizational measures to ensure a level of security appropriate to the risk.</p>
      <p>These measures include, in particular, safeguarding the confidentiality, integrity and availability of data by controlling physical and electronic access to the data, as well as access, input, disclosure, availability and separation of the data. We have also established procedures that ensure the exercise of data subject rights, the deletion of data and responses to threats to the data. Furthermore, we take the protection of personal data into account already during the development or selection of hardware, software and processes, in accordance with the principles of data protection by design and by default.</p>
      <p>Securing online connections through TLS/SSL encryption technology (HTTPS): To protect user data transmitted through our online services from unauthorized access, we use TLS/SSL encryption technology. Secure Sockets Layer (SSL) and Transport Layer Security (TLS) are core technologies for secure data transmission on the internet. These technologies encrypt information transmitted between the website or app and the user's browser (or between two servers), thereby protecting data from unauthorized access. TLS, as the further developed and more secure version of SSL, helps ensure that data transmissions meet high security standards. When a website is secured by an SSL/TLS certificate, this is indicated by HTTPS in the URL. This serves as an indication to users that their data is transmitted securely and in encrypted form.</p>

      <h2 id="m15">Changes and Updates</h2>
      <p>We ask you to regularly review the content of this privacy policy. We update the privacy policy whenever changes to the data processing activities we carry out make this necessary. We will inform you if the changes require an action on your part (for example consent) or any other individual notification.</p>
      <p>If we provide addresses and contact information of companies and organizations in this privacy policy, please note that such information may change over time and should be checked before contacting them.</p>

      <h2 id="m42">Definitions</h2>
      <p>This section provides an overview of the terms used in this privacy policy. Where terms are legally defined, their statutory definitions apply. The following explanations primarily serve to make the text easier to understand.</p>
      <ul class="glossary">
        <li><strong>Personal data:</strong> "Personal data" means any information relating to an identified or identifiable natural person (hereinafter "data subject"). A natural person is considered identifiable if they can be identified directly or indirectly, in particular by reference to an identifier such as a name, an identification number, location data, an online identifier (for example a cookie) or one or more factors specific to the physical, physiological, genetic, mental, economic, cultural or social identity of that person.</li>
        <li><strong>Controller:</strong> "Controller" means the natural or legal person, public authority, agency or other body which alone or jointly with others determines the purposes and means of processing personal data.</li>
        <li><strong>Processing:</strong> "Processing" means any operation or set of operations performed on personal data, whether or not by automated means. The term is broad and includes practically any handling of data, such as collection, analysis, storage, transmission or deletion.</li>
      </ul>
      <p class="seal"><a href="https://datenschutz-generator.de/" title="Legal text by Dr. Schwenke - click for further information." target="_blank" rel="noopener noreferrer nofollow">Created with the free Datenschutz-Generator.de by Dr. Thomas Schwenke</a></p>
    </section>`;
}

function buildPokemonCardTemplate(id, name, img, types) {
  return /*html*/ `
    <article class="poke_card"
             role="button"
             tabindex="0"
             aria-label="Open details for ${name}"
             onclick="openPokeDialog(${id})"
             onkeydown="onPokemonCardKeydown(event, ${id})">
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
    <img class="type_icon"
         src="./assets/icons/poke_types/${typeName}.png"
         alt="Pokemon type icon for ${typeName}."
         title="${typeName[0].toUpperCase() + typeName.slice(1)}">`;
}

function getLoadPokeBtnTemplate() {
  return /*html*/ `
    <button id="load_btn" onclick="loadPokemon()">Load Further</button>`;
}

function getFooterTemplate() {
  return /*html*/ `
    <div id="footer_content" class="content_wrapper p-lr-1r">
        <nav class="footer_links" aria-label="Legal links">
          <a href="./index.html?page=privacy" onclick="showPrivacyPage(event)">Privacy Policy</a>
          <span aria-hidden="true">|</span>
          <a href="./index.html?page=impressum" onclick="showImpressumPage(event)">Imprint</a>
        </nav>
        <span>© 2025 Sebastian Hedwig</span>
    </div>`;
}
