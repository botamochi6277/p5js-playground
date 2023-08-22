import p5 from "p5";
import { showPixels } from "./led_strip";
import { remap, trianglePulse, quadPulse } from "./signal";
const sketch = (p5: p5) => {


  const weightText = (weight: number[], y: number = 200, pitch: number = 40) => {
    for (let index = 0; index < weight.length; index++) {
      const x = index * pitch + pitch;
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.fill("#2b2b2b");
      p5.textSize(pitch * 0.25);
      p5.text(`${weight[index].toFixed(2)}`, x, y)
    }
  }

  type RadioButton = p5.Element & {
    option: (name: string) => null,
    selected: (name: string) => null
  }

  let progress_slider: p5.Element;
  let scale_slider: p5.Element;
  let width_slider: p5.Element;
  let window_width: number = window.innerWidth;
  let direction_radio: RadioButton;
  let transition_radio: RadioButton;


  const aspect_ratio = 0.25;
  const num_pixels = 18;

  const onWindowResized = () => {
    window_width = window.innerWidth;
    const canvas_height = window_width * aspect_ratio;
    p5.resizeCanvas(window_width, canvas_height);
    progress_slider.position(0.025 * window_width, 0.8 * canvas_height);
    progress_slider.style('width', `${0.95 * window_width}px`);
  }

  window.addEventListener("resize", onWindowResized);

  p5.setup = () => {
    const canvas = p5.createCanvas(window_width, window_width);
    canvas.parent('canvas-led-strip');
    p5.colorMode(p5.HSB, 100, 100, 100);
    progress_slider = p5.createSlider(0, 1.0, 0.5, 1 / (num_pixels + 1));
    scale_slider = p5.createSlider(0, 1.0, 0.5, 0.05);
    width_slider = p5.createSlider(0, 1.0, 0.5, 0.05);
    // setup transition radio button
    transition_radio = p5.createRadio("transition_radio") as RadioButton;
    transition_radio.option("triangle");
    transition_radio.option("quad");
    transition_radio.selected("triangle");

    onWindowResized();// init sizing
  };

  p5.draw = () => {
    p5.background("#f7f7f7");

    const color_idx = Array.from({ length: num_pixels }, (_, idx) => idx);
    const hue1 = color_idx.map(idx => 10 * idx / num_pixels + 0);
    const hue2 = color_idx.map(idx => 10 * idx / num_pixels + 60);

    const colors_start: number[][] = hue1.map(h => [h, 60, 100]);
    const colors_goal: number[][] = hue2.map(h => [h, 60, 100]);;
    let colors: number[][] = colors_start.concat();
    const progress_ratio = Number(progress_slider.value());
    const blur_width = Number(width_slider.value());
    let weight: number[] = Array(num_pixels).fill(0.0);

    // compute weights
    if (transition_radio.value() === "triangle") {
      weight = color_idx.map(i => trianglePulse(i / num_pixels - (1.0 + blur_width) * progress_ratio + blur_width, blur_width, Number(scale_slider.value())));
    } else {
      weight = color_idx.map(i => quadPulse(i / num_pixels - progress_ratio, blur_width, Number(scale_slider.value())));
    }

    for (let index = 0; index < colors.length; index++) {
      colors[index] = colorEasing(colors_start[index], colors_goal[index], weight[index]);
    }

    const height = window_width * aspect_ratio;
    const pitch = window_width / (num_pixels + 1);
    const y = height * 0.5;
    showPixels(p5, colors, y, pitch, 0.8 * pitch);
    weightText(weight, y - 0.75 * pitch, pitch);

  };

  const colorEasing = (from: number[], to: number[], progress: number) => {
    return [
      remap(progress, 0.0, 1.0, from[0], to[0]),
      remap(progress, 0.0, 1.0, from[1], to[1]),
      remap(progress, 0.0, 1.0, from[2], to[2])];
  }


};

new p5(sketch);