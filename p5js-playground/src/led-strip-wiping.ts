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

  type RadioButton = p5.Element & {
    option: (name: string) => null,
    selected: (name: string) => null
  }

  let progress_slider: p5.Element;
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


    // setup direction radio button
    direction_radio = p5.createRadio("direction radio") as RadioButton;
    direction_radio.option("forward");
    direction_radio.option("backward");
    direction_radio.selected("forward");

    // setup transition radio button
    transition_radio = p5.createRadio("transition_radio") as RadioButton;
    transition_radio.option("wipe");
    transition_radio.option("dissolve");
    transition_radio.option("slide");
    transition_radio.selected("wipe");

    onWindowResized();// init sizing
  };

  p5.draw = () => {
    p5.background("#f7f7f7");

    const colors_start = Array(num_pixels).fill([30, 100, 100]);
    const colors_goal = Array(num_pixels).fill([60, 100, 100]);
    let colors: number[][] = Array(num_pixels).fill([30, 100, 100]);
    const progress_ratio = Number(progress_slider.value());
    const is_backward = direction_radio.value() === "backward";
    const blur_width = 4 / num_pixels;

    // compute weights
    const weight = wipe_weight(progress_ratio, blur_width, is_backward);

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
    weightText(weight, y - 0.75 * pitch, pitch);

  };


  const wipe_weight = (progress_ratio: number, blur_width: number, is_backward: boolean) => {
    const weight: number[] = Array(num_pixels).fill(0.0);
    for (let index = 0; index < num_pixels; index++) {
      const r = index / num_pixels;
      if (!is_backward) {
        weight[index] = hardSigmoid((1.0 - r) + (1.0 + blur_width) * progress_ratio - 1.0, blur_width);
      } else {
        weight[index] = hardSigmoid(r + (1.0 + blur_width) * progress_ratio - 1.0, blur_width);
      }
    }
    return weight;
  };
};

new p5(sketch);