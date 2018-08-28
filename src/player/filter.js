const {BasePlayer} = require('./index')

class FilterPlayer extends BasePlayer {
  constructor(canvas) {
    super(canvas);
    this.backCanvas = document.createElement('canvas');
    this.backCtx = this.backCanvas.getContext('2d');
  }

  drawVideo(ctx) {
    const v = this.playing;
    this.backCanvas.height = v.videoHeight;
    this.backCanvas.width = v.videoWidth;
    this.backCtx.drawImage(v, 0, 0, v.videoWidth, v.videoHeight);
    const imageData = this.backCtx.getImageData(0,0,v.videoWidth, v.videoWidth);

    ctx.putImageData(dealImageData(imageData), 0,0);
  }

}
const sss = 100;
function dealImageData(imageData) {
  const {data} = imageData;
  const length = data.length;
  for (let i =0; i < length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    const dr = r - 66, dg = g - 255, db = b - 7;
    if (dr < sss && dg < sss && db < sss && dr > -sss && dg > -sss && db > -sss) {
      data[i + 3] = 0
    }
  }
  return imageData;
}

module.exports = {FilterPlayer};
