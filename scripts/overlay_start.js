function startOverlay() {
  const overlay = getEl("cover_overlay");
  if (!overlay) return;
  setTimeout(openCurtain, 1800);
}

function openCurtain() {
  const overlaySidePanels = getEl("cover_overlay");
  if (!overlaySidePanels) return;
  overlaySidePanels.classList.add("overlay--curtain-open");

  const transitionMs = 1200;
  setTimeout(removeOverlay, transitionMs + 100);
}

function removeOverlay() {
  const overlay = getEl("cover_overlay");
  if (overlay) overlay.remove();
}
