function nightVisionFilter(ctx) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,255,0,10)';
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillRect(0,0,1000000,1000000)
  ctx.restore();
  drawPlayButton(ctx)
}
function drawPlayButton(ctx) {
  const scale = 8;
  const offset = [0, 0]
  const shapePoints = [[0, 0], [0, 10], [9, 5]];
  const points = shapePoints.map(p => {
    const [x, y] = p
    return [offset[0] + x * scale, offset[1] + y * scale];
  })
  const length = 10;
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = 'rgba(255,255,255,200)'
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  ctx.lineTo(...points[1]);
  ctx.lineTo(...points[2]);
  ctx.closePath();
  // ctx.stroke();
  ctx.fill()
  ctx.restore();
}
function formatSeconds(_num, hasHour = false) {
  const num = Math.floor(_num);
  const second = num % 60;
  const min = Math.floor(num / 60);
  if (hasHour) {
    return `${min / 60}:${padding(min % 60)}:${padding(second)}`;
  }
  return `${padding(min)}:${padding(second)}`;
}
function padding(num) {
  if (num < 10) {
    return `0${num}`
  }
  return num;
}
module.exports = {
  nightVisionFilter,
  drawPlayButton,
  formatSeconds
}