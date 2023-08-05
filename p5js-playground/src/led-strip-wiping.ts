import p5 from "p5";



const sketch = (p5: p5) => {

  const led_strip = (colors: any[], y: number = 200, pitch: number = 40, diameter: number = 36) => {
    for (var i = 0; i < colors.length; i++) {
      const x = i * pitch + pitch;
      p5.fill(colors[i]);
      p5.circle(x, y, diameter);
      p5.textAlign(p5.CENTER, p5.CENTER);

      p5.fill("#2b2b2b");
      p5.textSize(diameter * 0.5);
      p5.text(`${i}`, x, y)
    }
  };

  const remap = (x: number, in_min: number, in_max: number, out_min: number, out_max: number, chip: boolean = false) => {
    if (chip) {
      if (x < in_min) {
        return out_min;
      }
      if (in_max < x) {
        return out_max;
      }
    }

    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  };


  const hardSigmoid = (x: number, tilt: number = 1.0, scale: number = 1.0) => {
    if (x < 0.0) {
      return 0.0;
    } else if (0.0 <= x && x < tilt) {
      return (scale / tilt) * x;
    } else {
      return 1.0;
    }
  }
  const weightText = (weight: number[], y: number = 200, pitch: number = 40) => {
    for (let index = 0; index < weight.length; index++) {
      const x = index * pitch + pitch;
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.fill("#2b2b2b");
      p5.textSize(pitch * 0.25);
      p5.text(`${weight[index].toFixed(2)}`, x, y)
    }
  }

  let progress_slider: p5.Element;
  let window_width: number = window.innerWidth;


  const aspect_ratio = 0.25;
  window.addEventListener("resize", () => {
    window_width = window.innerWidth;
    p5.resizeCanvas(window_width, window_width * aspect_ratio);
    progress_slider.style('width', `${window_width}px`);
  })

  p5.setup = () => {
    const canvas = p5.createCanvas(window_width, window_width * aspect_ratio);
    canvas.parent('canvas-led-strip');
    p5.colorMode(p5.HSB, 100, 100, 100);
    progress_slider = p5.createSlider(0, 1.0, 0.5, 1 / 19);
    progress_slider.style('width', `${window_width}px`);
    progress_slider.parent('progress-slider');
  };

  p5.draw = () => {
    p5.background("#f7f7f7");
    const num_pixels = 18;
    const colors_start = Array(num_pixels).fill([30, 100, 100]);
    const colors_goal = Array(num_pixels).fill([60, 100, 100]);
    let colors = Array(num_pixels).fill([30, 100, 100]);
    const progress_ratio = Number(progress_slider.value());
    const weight = Array(num_pixels).fill(0.0);

    const backward = false;
    const blur_width = 4 / num_pixels;
    for (let index = 0; index < num_pixels; index++) {
      const r = index / num_pixels;
      if (!backward) {
        weight[index] = hardSigmoid((1.0 - r) + (1.0 + blur_width) * progress_ratio - 1.0, blur_width);
      } else {
        weight[index] = hardSigmoid(r + (1.0 + blur_width) * progress_ratio - 1.0, blur_width);
      }
    }

    for (let index = 0; index < colors.length; index++) {
      colors[index] = [
        remap(weight[index], 0.0, 1.0, colors_start[index][0], colors_goal[index][0]),
        remap(weight[index], 0.0, 1.0, colors_start[index][1], colors_goal[index][1]),
        remap(weight[index], 0.0, 1.0, colors_start[index][2], colors_goal[index][2])];
    }
    const height = window_width * aspect_ratio;
    const pitch = window_width / (num_pixels + 1);
    const y = height * 0.5;
    led_strip(colors, y, pitch, 0.8 * pitch);
    weightText(weight, y - pitch, pitch);

  };
};

new p5(sketch);