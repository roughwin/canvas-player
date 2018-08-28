const BTN_STATE = {
  PLAY: 1,
  PAUSE: 2,
}

const BTN_SHAPE_PATH = {
  [BTN_STATE.PAUSE]: "M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z",
  [BTN_STATE.PLAY]: "M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z",
   
}

function changeButtonShape(btn, shape) {
  btn.setAttribute('d', BTN_SHAPE_PATH[shape]);
}

// function initCtrlBar(ele) {
//   console.log(ele);
//   ele.onmousemove = (e) => {
//     const pos = (e.offsetX / ele.clientWidth) * 100;
//     console.log(pos);
//   }
//   return ele;
// }

function updateCtrlBar(p, info = {}) {
  const totalLength = p.clientWidth;
  const { duration = 0, buffered = [], currentTime = 0 } = info;
  const total = genLine(0, 100, totalLength);
  const cached = buffered.map(a => genLine(a[0]/duration, a[1]/duration, totalLength)).join(' ');
  const played = genLine(0, currentTime/duration + 0.01, totalLength);
  p.querySelector('.total').setAttribute('d', total);
  p.querySelector('.cached').setAttribute('d', cached);
  p.querySelector('.played').setAttribute('d', played);
  
}

function genLine(start, end, totalLength, height = '5') {
  const scale = totalLength;
  const l = end - start;
  return `M ${start * scale} ${height} h ${l * scale}`
}

module.exports = {
  BTN_STATE,
  changeButtonShape,
  // initCtrlBar,
  updateCtrlBar,
}