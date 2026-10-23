Rounded, filled temperature badges now use black text and center the visible glyphs vertically and horizontally. Increase `forecast.labels_font_size` to suit the viewing distance; 26 works well for a compact wall-panel chart.

Enable `forecast.precipitation_indicator: true` for full-height precipitation bands. Rain, snow, sleet, hail, and positive precipitation amounts remain visible even when the amount is missing or tiny. Tooltips retain the weather condition and actual service amount; band height is never presented as millimeters. The option is available on the visual editor's Forecast page and defaults to false, preserving the original amount/probability modes. Style2 retains its unboxed temperature labels.

The card type and resource filename remain `custom:weather-chart-card` and `weather-chart-card.js` for existing dashboard compatibility.
