const WET_CONDITIONS = new Set([
  'rainy', 'pouring', 'snowy', 'snowy-rainy', 'lightning-rainy', 'hail',
]);

export function precipitationIndicator(forecast) {
  if (WET_CONDITIONS.has(forecast.condition) ||
      (Number.isFinite(forecast.precipitation) && forecast.precipitation > 0)) {
    return 1;
  }
  if ((forecast.condition && !['unknown', 'unavailable'].includes(forecast.condition)) ||
      Number.isFinite(forecast.precipitation)) {
    return 0;
  }
  return null;
}

export function precipitationValue(forecast, options) {
  if (options.precipitation_indicator === true) return precipitationIndicator(forecast);
  return options.precipitation_type === 'probability'
    ? forecast.precipitation_probability : forecast.precipitation;
}

export function indicatorTooltip(forecast, label, condition, unit) {
  const amount = Number.isFinite(forecast.precipitation)
    ? `${forecast.precipitation} ${unit}` : null;
  return `${label}: ${[condition, amount].filter(Boolean).join(' / ')}`;
}
