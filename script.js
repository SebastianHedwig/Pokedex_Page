function init() {
  renderHeader();
  renderContentSkeleton();
  renderFooter();
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
