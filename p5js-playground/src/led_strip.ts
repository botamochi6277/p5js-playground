import p5 from "p5";


export const showPixels = (p5: p5, colors: any[], y: number = 200, pitch: number = 40, diameter: number = 36) => {
  for (let i = 0; i < colors.length; i++) {
    const x = i * pitch + pitch;
    p5.fill(colors[i]);
    p5.circle(x, y, diameter);
    p5.textAlign(p5.CENTER, p5.CENTER);

    p5.fill("#2b2b2b");
    p5.textSize(diameter * 0.5);
    p5.text(`${i}`, x, y)
  }
};
