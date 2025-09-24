function mapAbilityCard(abilityInfo, data) {
  const en = data.effect_entries.find(function (e) {
    return e.language.name === "en";
  });
  const title =
    abilityInfo.ability.name + (abilityInfo.is_hidden ? " (Hidden)" : "");
  return { title: title, effect: en && en.effect ? en.effect : "" };
}
