function getDefaultVarietyName(species) {
  const varieties = species && species.varieties ? species.varieties : [];
  const def = varieties.find(function (variety) {
    return variety.is_default;
  });
  return def && def.pokemon ? def.pokemon.name : null;
}

function fetchEvoSpecies(evoStart) {
  const evoList = [];
  (function chain(current) {
    evoList.push(current.species.name);
    if (current.evolves_to) current.evolves_to.forEach(chain);
  })(evoStart);
  return evoList;
}
