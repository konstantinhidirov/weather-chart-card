import test from 'node:test';
import assert from 'node:assert/strict';
import {precipitationIndicator, precipitationValue, indicatorTooltip} from '../src/precipitation.mjs';
import {badgeGeometry, temperatureBadges} from '../src/temperature-badges.mjs';

test('wet conditions remain visible without an amount, including snow and hail', () => {
  for (const condition of ['rainy', 'pouring', 'snowy', 'snowy-rainy', 'lightning-rainy', 'hail']) {
    assert.equal(precipitationIndicator({condition}), 1);
    assert.equal(precipitationIndicator({condition, precipitation: 0.001}), 1);
  }
});

test('positive amounts also indicate precipitation; dry and missing data stay distinct', () => {
  assert.equal(precipitationIndicator({condition: 'cloudy', precipitation: 0.01}), 1);
  assert.equal(precipitationIndicator({condition: 'sunny'}), 0);
  assert.equal(precipitationIndicator({precipitation: 0}), 0);
  assert.equal(precipitationIndicator({}), null);
  assert.equal(precipitationIndicator({condition: 'unavailable', precipitation: NaN}), null);
});

test('normal amount and probability modes retain the original service values', () => {
  const forecast = Object.freeze({condition: 'rainy', precipitation: 0.01, precipitation_probability: 35});
  assert.equal(precipitationValue(forecast, {precipitation_type: 'rainfall'}), 0.01);
  assert.equal(precipitationValue(forecast, {precipitation_type: 'probability'}), 35);
  assert.equal(precipitationValue(forecast, {precipitation_type: 'probability', precipitation_indicator: true}), 1);
  assert.equal(forecast.precipitation, 0.01);
});

test('indicator tooltip never turns the synthetic bar height into millimeters', () => {
  assert.equal(indicatorTooltip({condition: 'rainy'}, 'Осадки', 'Дождь', 'мм'), 'Осадки: Дождь');
  assert.equal(indicatorTooltip({precipitation: 0.01}, 'Осадки', 'Дождь', 'мм'), 'Осадки: Дождь / 0.01 мм');
});

test('badge text is centered using visible ink bounds, including negative temperatures', () => {
  for (const [left, right, ascent, descent] of [[0, 35, 20, 0], [1, 49, 20, 3]]) {
    const box = badgeGeometry({width: 50, actualBoundingBoxLeft: left, actualBoundingBoxRight: right,
      actualBoundingBoxAscent: ascent, actualBoundingBoxDescent: descent}, 26);
    assert.equal((box.textX - left + box.textX + right) / 2, 0);
    assert.equal((box.textY - ascent + box.textY + descent) / 2, 0);
    assert.equal((box.width - left - right) / 2, 5);
    assert.equal((box.height - ascent - descent) / 2, 5);
  }
});

test('badge renderer skips missing and hidden points and restores canvas state', () => {
  const drawn = [];
  const fills = [];
  const strokes = [];
  const ctx = {save() {}, restore() {drawn.push('restore');}, beginPath() {}, roundRect(...args) {drawn.push(args);},
    fill() {fills.push(this.fillStyle);}, stroke() {strokes.push([this.strokeStyle, this.lineWidth]);},
    fillText(text) {drawn.push(text);}, measureText() {return {width: 40, actualBoundingBoxAscent: 20, actualBoundingBoxDescent: 0};}};
  const chart = {ctx, data: {datasets: [{data: [9, null, -12], borderColor: 'orange'}, {data: [1]}]},
    isDatasetVisible: index => index === 0, getDatasetMeta: () => ({data: [{x: 30, y: 40}, {x: 90, y: 40}, {x: 150, y: 40}]})};
  temperatureBadges.afterDatasetsDraw(chart, {}, {enabled: true, fontSize: 26, fontFamily: 'Manrope', fontWeight: 700, backgroundColor: '#553300', textColor: '#fff'});
  assert.deepEqual(drawn.filter(value => typeof value === 'string'), ['9°', '-12°', 'restore']);
  assert.equal(drawn[0][4], 4);
  assert.equal(ctx.fillStyle, '#fff');
  assert.deepEqual(fills, ['#553300', '#553300']);
  assert.deepEqual(strokes, [['orange', 1.5], ['orange', 1.5]]);
  assert.equal(chart.data.datasets[0].borderColor, 'orange');
  assert.equal(ctx.font, '700 26px Manrope');
});
