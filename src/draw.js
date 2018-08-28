const v = document.getElementById('video')
const canvas = document.getElementById('canvas')
const shadowCanvas = document.createElement('canvas')
const sCtx = shadowCanvas.getContext('2d');
const ctx = canvas.getContext('2d');
window.ctx = ctx;
window.v = v;

window.drawcount = 0;
function draw() {
  if (v.paused || v.ended) return;
  drawOnce();
  // ctx.stroke();
  drawcount++
  requestAnimationFrame(draw)
}

function drawOnce() {
  if (!loaded) return;
  sCtx.drawImage(v, 0, 0, v.videoWidth, v.videoHeight)
  const imgData = sCtx.getImageData(0,0,v.videoWidth,v.videoHeight)
  ctx.putImageData(dealwithImageData(imgData), 0, 0);
  otherdeals(ctx)
}
// let arr;
function coverImage(length) {
  const arr = new Uint8ClampedArray(length)
  for (let i = 0; i < length; i += 4) {
    arr.set([0,100,0,50], i)
  }
  return arr;
}
function dealwithImageData(imgData) {
  window.imgData = imgData
  const len = imgData.data.length;
  return imgData;
  for(let i = 0; i < len; i += 4) {
    // const [r, g, b, a] = imgData.data.slice(i, i + 4);
    const r = imgData.data[i];
    const g = imgData.data[i + 1];
    const b = imgData.data[i + 2];
    const a = imgData.data[i + 3];
    // if (g < 100 && r < 100 && b < 43) {
      imgData.data[i] = 255 - r;
      imgData.data[i + 1] = 255 - g;
      imgData.data[i + 2] = 255 - b;
      // imgData.data[i + 3] = 255;
    // }
  }
  return imgData;
}
let loaded = false;
v.onloadedmetadata = function() {
  shadowCanvas.width = v.videoWidth;
  shadowCanvas.height = v.videoHeight;
  canvas.width = v.videoWidth;
  canvas.height = v.videoHeight;
  loaded = true;
}
v.onplay = function () {
  if (v.paused || v.ended) {
    console.log('end');
    return;
  }
  requestAnimationFrame(draw)
  console.log('start draw')
}

v.addEventListener('timeupdate', () => {
  if (v.paused) {
    drawOnce()
  }
})
function play() {
  if (!loaded) {
    return setTimeout(play, 200);
  }
  v.play()
}

play()


function getMousePosition(e){
  const wrate = canvas.width / 500;
  const hrate = canvas.height / 300;
  var x, y
  if (e.layerX || e.layerX == 0) {
      x = e.layerX
      y = e.layerY
  } else if (e.offsetX || e.offsetX == 0) {
      x = e.offsetX
      y = e.offsetY
  }
  return {x: x * wrate, y: y * hrate}
}
canvas.addEventListener('click', (e) => {
  // console.log(e, getMousePosition(e))
})

function otherdeals(ctx) {
  // drawControls(ctx)
  // drawLines(ctx);
}

// start hand draw
canvas.onmousedown = function() {
  const linePath = [];
  lines.push(linePath);
  canvas.onmousemove = function(e) {
    const {x, y} = getMousePosition(e);
    linePath.push(x, y);
  }
  canvas.onmouseup = function() {
    canvas.onmousemove = null;
  }
}
