function mapAbilityCard(abilityInfo, data) {
const en = data?.effect_entries?.find(entry => entry?.language?.name === "en");
const title = abilityInfo.ability.name + (abilityInfo.is_hidden ? " (Hidden)" : "");
return { title, effect: en?.effect ?? "" };
}
