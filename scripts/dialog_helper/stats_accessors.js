function getStatsArray(pokemon) {
  return pokemon?.stats ?? [];
}

function getStatLabel(stat) {
  return stat?.stat?.name ?? "unknown";
}

function getStatValue(stat) {
  return Number(stat?.base_stat ?? 0);
}
