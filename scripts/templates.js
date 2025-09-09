// Main-Templates:
function getHeaderTemplate() {
    return /*html*/ `
        <div id="header_content" class="content_wrapper p-lr-2r">
            <img class="header_logo" src="./assets/img/Pokedex_Logo_textstudio.png" alt="Pokedex Logo">
        </div>
    `;
}

function getPageContentSkeletonTemplate() {
    return /*html*/ `
        <div id="main_content_container" class="content_wrapper p-lr-2r">
            <div id="pokesearch_container">
                <img id="pokesearch_title_img" src="./assets/img/Pokesearch_Logo_textstudio.png" alt="Pokesearch Schriftzug">
                <form id="pokesearch_box">
                    <input type="search">
                    <button type="submit">Suchen</button>
                </form>

            </div>
            <div id="pokemon_card_box"></div>
        </div>
    `;
}


function getFooterTemplate() {
    return /*html*/ `
        <div id="footer_content" class="content_wrapper p-lr-2r">
            <span>© 2025 Sebastian Hedwig</span>
        </div>         
    `;
}