function getPrimaryType(pokemon, fallback = "unknown") {
  return pokemon?.types?.[0]?.type?.name || fallback;
}

function getTypesLabel(pokemon) {
  return (pokemon?.types ?? []).map(t => t?.type?.name).filter(Boolean).join(", ");
}

function formatTypeLabel(type) {
  const t = type?.trim();
  return t ? t[0].toUpperCase() + t.slice(1).toLowerCase() : "";
}
