const { BasePlayer } = require('./index');

const { nightVisionFilter, drawPlayButton } = require('../utils');

class Line {
  constructor(lineProps) {
    this.path = [];
    this.lineProps = lineProps || { strokeStyle: 'red', lineWidth: 10};
  };
  draw(ctx) {
    ctx.save();
    const line = this.path;
    Object.assign(ctx, this.lineProps)
    if (line.length < 4) return;
    for (let i = 2; i < line.length; i+=2) {
      const x = line[i];
      const y = line[i + 1];
      const oldx = line[i - 2];
      const oldy = line[i - 1];
      ctx.beginPath();
      ctx.moveTo(oldx, oldy)
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    ctx.restore()
  }
}

class Box {
  constructor(props = {}) {
    const { point=[0,0], width=0, height=0, rectProps={} } = props;
    this.point = point;
    this.width = width;
    this.height = height || width;
    this.rectProps = rectProps;
  }
  rect(ctx) {
    if (ctx) {
      this.ctx = ctx;
    }
    const [x, y] = this.point;
    this.ctx.beginPath();
    this.ctx.rect(x,y,this.width,this.height);
  }
  draw(ctx) {
    this.ctx = ctx;
    ctx.save();
    Object.assign(ctx, this.rectProps);
    this.rect();
    ctx.fill();
    ctx.closePath()
    ctx.restore();
  }

  isPointInPath(point, c) {
    this.ctx.save();
    this.rect(c);
    const result = this.ctx.isPointInPath(...point);
    this.ctx.restore();
    return result;
  }
}

class UiPlayer extends BasePlayer {

  constructor(canvas) {
    super(canvas);
    this.initLineListener();
    this.initRects();
  }
  drawOthers(ctx, canvas) {
    // this.drawLine(ctx);
    this.drawRects(ctx);
    // nightVisionFilter(ctx);
  }

  initRects() {
    const points = [
      [10,10],
      [200,200],
      [10,200],
      [200,10]
    ]
    this.rects = points.map(p => {
      return new Box({
        point: p,
        width: 100,
        rectProps: {
          // lineWidth: 2,
          fillStyle: getRandomColor(),
        }
      });
    });
  }
  drawRects(ctx) {
    this.rects.forEach(rect => {
      rect.draw(ctx);
    });
  }

  drawLine(ctx) {
    this.lines.forEach(line => line.draw(ctx))
  }

  initLineListener() {
    this.lines = [];
    const lines = this.lines;
    const player = this;
    player.onclick = (pos) => {
      this.rects.forEach((r,i) => {
        const inRect = r.isPointInPath([pos.x, pos.y]);
        if (inRect) {
          r.rectProps.fillStyle = getRandomColor();
        }
      })
    }
    player.onmousedown = function() {
      const linePath = new Line();
      lines.push(linePath);
      player.onmousemove = function(pos) {
        const { x, y } = pos;
        linePath.path.push(x, y)
      }
      player.onmouseup = function() {
        player.onmousemove = null;
        if (!linePath.path.length) {
          lines.pop();
        }
      }
    }
  }
}

function getRandomColor(params) {
  return `rgba(${getRandomNum(255)},${getRandomNum(255)},${getRandomNum(255)},100)`
}
function getRandomNum(max) {
  return Math.floor(Math.random() * max)
}
module.exports = {
  UiPlayer
}
