// Measure the visible glyphs: a CSS line box is not the visual text center.
export function badgeGeometry(metrics, fontSize, padding = 5) {
  const ascent = metrics.actualBoundingBoxAscent ?? fontSize * 0.75;
  const descent = metrics.actualBoundingBoxDescent ?? fontSize * 0.2;
  const left = metrics.actualBoundingBoxLeft ?? 0;
  const right = metrics.actualBoundingBoxRight ?? metrics.width;
  return {
    width: left + right + padding * 2,
    height: ascent + descent + padding * 2,
    textX: (left - right) / 2,
    textY: (ascent - descent) / 2,
  };
}

export const temperatureBadges = {
  id: 'temperatureBadges',
  afterDatasetsDraw(chart, args, options) {
    if (!options.enabled) return;
    const {ctx} = chart;
    const fontSize = Number(options.fontSize);
    ctx.save();
    ctx.font = `${options.fontWeight || 700} ${fontSize}px ${options.fontFamily}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    [0, 1].forEach(index => {
      if (!chart.isDatasetVisible(index)) return;
      const dataset = chart.data.datasets[index];
      const meta = chart.getDatasetMeta(index);
      meta.data.forEach((point, itemIndex) => {
        const value = dataset.data[itemIndex];
        if (!Number.isFinite(value) || point.skip) return;
        const text = `${value}°`;
        const box = badgeGeometry(ctx.measureText(text), fontSize);
        const x = point.x - box.width / 2;
        const y = point.y - box.height / 2;
        const radius = Math.min(4, box.height / 2);
        ctx.beginPath();
        ctx.roundRect(x, y, box.width, box.height, radius);
        ctx.fillStyle = options.backgroundColor || dataset.borderColor;
        ctx.fill();
        ctx.strokeStyle = dataset.borderColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = options.textColor;
        ctx.fillText(text, point.x + box.textX, point.y + box.textY);
      });
    });
    ctx.restore();
  },
};
