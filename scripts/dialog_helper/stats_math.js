function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function valueToPercent(value, maxUi = DEFAULT_MAX_UI) {
  const clamped = clamp(value, 0, maxUi);
  return (clamped / maxUi) * 100;
}

function toWidthStyle(percent) {
  return `width:${percent}%`;
}
