

export const remap = (x: number, in_min: number, in_max: number, out_min: number, out_max: number, chip: boolean = false) => {
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


export const hardSigmoid = (x: number, duration: number = 1.0, scale: number = 1.0) => {
  if (x < 0.0) {
    return 0.0;
  } else if (0.0 <= x && x < duration) {
    return (scale / (duration + 1e-9)) * x;
  } else {
    return 1.0;
  }
}

export const trianglePulse = (x: number, duration: number = 1.0, scale: number = 1.0) => {
  return hardSigmoid(x, duration / 2, scale) - hardSigmoid(x - duration / 2, duration / 2, scale)
}

export const quadInOut = (x: number, duration: number = 1.0, scale: number = 1.0) => {
  const xx = x / (duration + 1e-9);
  if (x < 0.0) {
    return 0;
  } else if (xx < 0.5) {
    return scale * 2.0 * xx * xx;
  } else if (xx < 1.0) {
    return scale * (1.0 - Math.pow(-2 * xx + 2, 2) / 2);
  } else {
    return scale;
  }
}

export const quadPulse = (x: number, duration: number = 1.0, scale: number = 1.0) => {
  return quadInOut(x, duration / 2, scale) - quadInOut(x - duration / 2, duration / 2, scale)
}