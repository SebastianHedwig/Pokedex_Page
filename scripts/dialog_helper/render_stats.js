function renderStatItem(stat, maxUi = DEFAULT_MAX_UI) {
  const label = getStatLabel(stat);
  const value = getStatValue(stat);
  const pct = valueToPercent(value, maxUi);
  const widthStyle = toWidthStyle(pct);
  return tplStatItem(label, value, widthStyle);
}

function renderStatItems(pokemon, maxUi = DEFAULT_MAX_UI) {
  return getStatsArray(pokemon).map(s => renderStatItem(s, maxUi)).join("");
}
