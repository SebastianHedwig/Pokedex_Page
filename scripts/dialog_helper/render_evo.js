function renderEvoItemsWithSeparator(pokeList) {
  const sep = tplEvoSeparator();
  return (pokeList ?? []).map(tplEvoItem).join(sep);
}
