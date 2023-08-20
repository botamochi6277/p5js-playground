import p5 from "p5";
import { remap, hardSigmoid } from "./signal";
const sketch = (p5: p5) => {


  const plotLine = (
    x: number[], y: number[],
    diameter: number) => {
    const y_min = Math.min(...y);
    const y_max = Math.max(...y);

    for (let index = 0; index < x.length; index++) {
      const xx = remap(x[index], x[0], x[x.length - 1], 0, window.innerWidth);
      const yy = remap(y[index], y_min, y_max,
        aspect_ratio * window.innerWidth * 0.9,
        aspect_ratio * window.innerWidth * 0.1);
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
    p5.draw();
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
    p5.background("#2b2b2b");
    const idx = Array.from({ length: 100 }, (_, k) => k);
    const x = idx.map(i => remap(i, 0, idx.length - 1, -1, 2));
    const y = x.map(xx => hardSigmoid(xx));
    plotLine(x, y, 10);
  }
}


new p5(sketch);