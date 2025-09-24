function renderLocationItems(locations) {
  return (locations ?? []).filter(Boolean).map(tplListItem).join("");
}
