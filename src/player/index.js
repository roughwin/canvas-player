const { EventHandler } = require('./event');

class BasePlayer extends EventHandler {
  constructor(canvas) {
    super(canvas);
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.videos = [];
    this.playingIndex = -1;
  }

  async loadVideos(...urls) {
    for (const url of urls) {
      try {
        const v = await genVideo(url, document);
        v.offset = this.totalDuration;
        this.videos.push(v);
      } catch (e) {
        throw e;
      }
    }
    return this.videos;
  }

  get totalDuration() {
    function sumDuration(sum, v) {
      return sum + v.duration;
    }
    return this.videos.reduce(sumDuration, 0);
  }

  get buffered() {
    let buffered = [];
    for (const v of this.videos) {
      buffered = buffered.concat(getVideoBuffer(v, v.offset));
    }
    return buffered;
  }

  get currentTime() {
    return this.playing.currentTime + this.playing.offset;
  }

  pause() {
    this.playing.pause();
  }

  async play() {
    await this.playing.play();
  }

  get paused() {
    return this.playing.paused;
  }

  gotoTime(time) {
    const { videos } = this;
    const {index, offset} = getVideoTime(time);
    const nv = this.gotoVideo(index, !this.playing.paused);
    nv.currentTime = offset;
    this.ontimeupdate(nv.offset + offset);
    function getVideoTime(t) {
      let cur = 0;
      let i = 0;
      for (const v of videos) {
        cur += v.duration;
        if (t < cur) {
          return {index: i, offset: t - v.offset};
        }
        i++;
      }
    }
  }

  nextVideo(startPlay) {
    return this.gotoVideo(this.playingIndex + 1, startPlay)
  }

  gotoVideo(index = 0, startPlay = false) {
    if (this.playing) {
      this.rmPlaying(this.playing);
    }
    if (!this.videos.length || index >= this.videos.length) return false;
    this.playing = this.videos[index];
    this.regVideo(this.playing);
    this.playingIndex = index;
    if (startPlay) {
      this.playing.play();
    }
    return this.playing;
  }

  rmPlaying(v) {
    v.pause();
    v.onplay = null;
    v.ontimeupdate = null;
  }

  regVideo(v) {
    this.canvas.width = v.videoWidth;
    this.canvas.height = v.videoHeight;
    v.onplay = () => {
      if (v.paused || v.ended) {
        console.log('end');
        return;
      }
      requestAnimationFrame(this.draw.bind(this));
    }
    v.onprogress = e => {
      this.onprogress(this.buffered);
    }
    v.ontimeupdate = (e) => {
      if (v.paused) {
        this.drawOnce();
      }
      this.ontimeupdate(v.currentTime + v.offset);
    }
    v.loadstart = this.onloadstart;
    v.oncanplay = this.oncanplay;
    v.onended = () => {
      this.nextVideo(true);
    }
  }

  ontimeupdate(t) {
  }
  onprogress(buf) {
  }

  draw() {
    const v = this.playing;
    // if (v.paused || v.ended) return;
    const currentTime = window.performance.now();
    const delta = currentTime - (this.lastDrawTime || 0);
    if (delta > 15) {
      this.lastDrawTime = currentTime;
      this.drawOnce();
    }
    requestAnimationFrame(this.draw.bind(this));
  }

  drawOnce() {
    if (typeof this.drawVideo === 'function') {
      this.drawVideo(this.ctx);
    }
    if (typeof this.drawOthers === 'function') {
      this.drawOthers(this.ctx, this.canvas);
    }
  }
  drawVideo(ctx) {
    const v = this.playing;
    ctx.drawImage(v, 0, 0, v.videoWidth, v.videoHeight);
  }
  drawOthers(ctx, canvas) {
    // nightVisionFilter(ctx);
  }
}

function getVideoBuffer(v, offset = 0) {
  const buf = v.buffered;
  const result = [];
  const len = buf.length;
  for (let i = 0; i < len; i++) {
    const start = buf.start(i);
    const end = buf.end(i);
    result.push([start + offset, end + offset]);
  }
  return result;
}

function genVideo(url, d, timeout=30000) {
  return new Promise(function (resolve, reject) {
    const v = d.createElement('video');
    v.muted = true;
    v.onloadedmetadata = function() {
      resolve(v);
    }
    v.src = url;
    setTimeout(() => {
      if (v.readyState < 1) {
        reject(new Error('video init failed.'));
      }
    }, timeout);
  });
}

module.exports = {genVideo, BasePlayer}