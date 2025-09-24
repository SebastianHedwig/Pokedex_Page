function delay(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

function updateActiveTab(tab) {
  const btns = document.querySelectorAll(".dexdlg_nav .tab");
  btns.forEach(function (btn) {
    btn.classList.remove("is_active");
    btn.setAttribute("aria-selected", "false");
  });
  const btnActive = Array.from(btns).find(function (btn) {
    return btn.dataset.tab === tab;
  });
  if (!btnActive) return;
  btnActive.classList.add("is_active");
  btnActive.setAttribute("aria-selected", "true");
  btnActive.focus();
}
