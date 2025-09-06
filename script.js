function init(){
    renderHeaderTemplate();
    renderPageCOntentSkeletonTemplate();
    renderFooterTemplate();
}

function renderHeaderTemplate() {
    const pageHeadRef = document.getElementById('page_head');
    pageHeadRef.innerHTML = getHeaderTemplate();
}

function renderFooterTemplate() {
    const pageFooterRef = document.getElementById('page_footer');
    pageFooterRef.innerHTML = getFooterTemplate();
}

function renderPageCOntentSkeletonTemplate() {
    const pageContentRef = document.getElementById('page_content');
    pageContentRef.innerHTML = getPageContentSkeletonTemplate();
}