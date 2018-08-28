
class EventHandler {
  constructor(canvas) {
    this.initEventListener(canvas);
  }

  onmousemove(pos) {
    // console.log(pos);
  }

  onclick(pos) {
    // console.log(pos);
  }
  onmousedown() {
    // console.log('mouse down')
  }
  onmouseup() {
    // console.log('mouse up')
  }

  initEventListener(canvas) {
    canvas.onclick = (e) => {
      if (this.onclick) {
        this.onclick(getMousePosition(e));
      }
    }
    canvas.onmousemove = (e) => {
      if (this.onmousemove) {
        this.onmousemove(getMousePosition(e));
      }
    }
    canvas.onmousedown = () => {
      if (this.onmousedown) {
        this.onmousedown();
      }
    };
    canvas.onmouseup = () => {
      if (this.onmouseup) {
        this.onmouseup();
      }
    };
    function getMousePosition(e){
      const cwidth = canvas.clientWidth;
      const cheight = canvas.clientHeight;
      const wrate = canvas.width / cwidth;
      const hrate = canvas.height / cheight;
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
  }
  
}

module.exports = {
  EventHandler
}



