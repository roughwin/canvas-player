const canvas = document.getElementById('canvas')
const { BasePlayer } = require('./player');
const { UiPlayer } = require('./player/addon');
const { FilterPlayer } = require('./player/filter');

const ctx = canvas.getContext('2d');
const { BTN_STATE, changeButtonShape, initCtrlBar, updateCtrlBar } = require('./controler');
const { formatSeconds } = require('./utils');
window.ctx = ctx;

window.drawcount = 0;

const miniCanvas = document.getElementById('mini');

let player = new BasePlayer(canvas);
player = new FilterPlayer(canvas);
// player = new UiPlayer(canvas);
window.player = player
const btn = document.getElementById('play-btn-container');
const btnPath = btn.querySelector('path');
const timer = document.getElementById('time');
const ctrlBar = document.querySelector('#ctrl-bar');



const urls = [
  '/ko2.mp4',
  '/x.mp4'
]
const otherUrls = [
  '/test.mp4',
  '/x.mp4'
]
!(async function () {
  await player.loadVideos(...urls);
  const v = player.gotoVideo(0, true);
  await v.play();
  changeButtonShape(btnPath, 2);
  player.loadVideos(...otherUrls);
})()

ctrlBar.onclick = (e) => {
  const pos = (e.offsetX / ctrlBar.clientWidth);
  player.gotoTime(player.totalDuration * pos)
}



btn.onclick = () => {
  if (player.paused) {
    player.play();
    changeButtonShape(btnPath, 2);
  } else {
    player.pause();
    changeButtonShape(btnPath, 1);
  }
}

player.ontimeupdate = updateStatus;
player.onprogress = updateStatus;
function updateStatus() {
  const info = {
    buffered: player.buffered,
    duration: player.totalDuration,
    currentTime: player.currentTime,
  }
  updateCtrlBar(ctrlBar, info);
  time.innerHTML = `${formatSeconds(info.currentTime)}/${formatSeconds(info.duration)}`
}

