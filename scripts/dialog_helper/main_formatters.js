function formatHeightLabel(pokemon) {
  const height = Number(pokemon?.height);
  return Number.isFinite(height) ? `${(height / 10).toFixed(1)} m` : "";
}

function formatWeightLabel(pokemon) {
  const weight = Number(pokemon?.weight);
  return Number.isFinite(weight) ? `${(weight / 10).toFixed(1)} kg` : "";
}

function getBaseExperience(pokemon) {
  return pokemon?.base_experience ?? "";
}

function formatCaptureRate(species) {
  const capture = species?.capture_rate;
  return capture == null ? "" : `${capture} %`;
}

function getBaseHappiness(species) {
  return species?.base_happiness ?? "";
}
