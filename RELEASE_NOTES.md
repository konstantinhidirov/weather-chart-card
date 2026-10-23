Temperature badges now support the card's CSS font family, explicit font selection and font weight. `forecast.labels_font_family` defaults to `inherit` and reads the rendered `ha-card` font; `forecast.labels_font_weight` defaults to 700. Web fonts trigger another draw after loading so the visible glyphs stay centered. The font must already be loaded by the dashboard.

Style1 badges have equal 5px padding around the visible text and a 1.5px outline matching the temperature line. `forecast.labels_background_color` controls their fill independently of the line and outline. `forecast.chart_text_color` controls text color. Font family, weight and badge fill are available in the visual editor. Style2 keeps its unboxed labels.

Example wall-panel settings:

```yaml
forecast:
  labels_font_size: 26
  labels_font_family: Manrope
  labels_font_weight: 700
  labels_background_color: '#402600'
  chart_text_color: '#ffffff'
  precipitation_indicator: true
```

The full-height precipitation indicator from v2.5.0 remains available. The card type and resource filename stay `custom:weather-chart-card` and `weather-chart-card.js`; existing dashboard options are preserved. Reload the browser after updating the resource.
