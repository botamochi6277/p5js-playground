import p5 from "p5";
import { remap, hardSigmoid, trianglePulse, quadInOut, quadPulse } from "./signal";
const sketch = (p5: p5) => {


  const plotLine = (
    x: number[], y: number[],
    diameter: number) => {
    const y_min = Math.min(...y);
    const y_max = Math.max(...y);

    for (let index = 0; index < x.length; index++) {
      const xx = remap(x[index], x[0], x[x.length - 1], 0, p5.width);
      const yy = remap(y[index], y_min, y_max,
        p5.height * 0.9,
        p5.height * 0.1);
      p5.circle(xx, yy, diameter);

    }
  }

  let canvas: p5.Renderer;
  let window_width: number = window.innerWidth;
  const aspect_ratio = 9 / 16;
  const onWindowResized = () => {
    window_width = window.innerWidth;
    const canvas_height = window_width * aspect_ratio;
    p5.resizeCanvas(window_width, canvas_height);
    p5.redraw();
  }

  window.addEventListener("resize", onWindowResized);

  p5.setup = () => {
    canvas = p5.createCanvas(window_width, window_width);
    canvas.parent('my_canvas');
    p5.colorMode(p5.HSB, 100, 100, 100);
    onWindowResized();// init sizing
    p5.noLoop();
  };

  p5.draw = () => {
    const search_params = new URLSearchParams(window.location.search);

    p5.background("#2b2b2b");
    const idx = Array.from({ length: 100 }, (_, k) => k);
    const x = idx.map(i => remap(i, 0, idx.length - 1, -1, 2));
    let y = x.concat();
    switch (search_params.get("signal")) {
      case "hard-sigmoid":
        y = x.map(xx => hardSigmoid(xx));
        plotLine(x, y, 10);
        break;
      case "triangle-pulse":
        y = x.map(xx => trianglePulse(xx));
        plotLine(x, y, 10);
        break;
      case "quad-inout":
        y = x.map(xx => quadInOut(xx));
        plotLine(x, y, 10);
        break;
      case "quad-pulse":
        y = x.map(xx => quadPulse(xx));
        plotLine(x, y, 10);
        break;
      default:
        p5.circle(p5.width / 2, p5.height / 2, 100);
        break;
    }
  }
}


new p5(sketch);