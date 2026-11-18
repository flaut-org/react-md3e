/** Build-time geometry only. Compatible cubic commands allow CSS to interpolate wave phases. */
function number(value: number): string {
  return String(Number(value.toFixed(4)));
}

export function linearWaveMask(thickness: number, wavelength: number): string {
  const center = (thickness + 6) / 2;
  const frequency = (Math.PI * 2) / wavelength;
  const step = wavelength / 4;
  let path = `M0,${center}`;

  for (let index = 0; index < 4; index += 1) {
    const x = index * step;
    const next = x + step;
    const y = center + 3 * Math.sin(x * frequency);
    const nextY = center + 3 * Math.sin(next * frequency);
    const slope = 3 * frequency * Math.cos(x * frequency);
    const nextSlope = 3 * frequency * Math.cos(next * frequency);

    path += `C${number(x + step / 3)},${number(y + (slope * step) / 3)},${number(next - step / 3)},${number(nextY - (nextSlope * step) / 3)},${number(next)},${number(nextY)}`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${wavelength}" height="${thickness + 6}" viewBox="0 0 ${wavelength} ${thickness + 6}"><path d="${path}" fill="none" stroke="black" stroke-width="${thickness}" stroke-linecap="round"/></svg>`;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function circularWave(thickness: number, phase: number): string {
  const radius = 20.4 - (thickness - 4) / 2;
  const count = 32;
  const step = (Math.PI * 2) / count;
  const point = (angle: number) => {
    const r = radius + 1.6 * Math.sin(8 * angle + phase);
    const derivative = 12.8 * Math.cos(8 * angle + phase);

    return {
      x: 24 + r * Math.sin(angle),
      y: 24 - r * Math.cos(angle),
      dx: derivative * Math.sin(angle) + r * Math.cos(angle),
      dy: -derivative * Math.cos(angle) + r * Math.sin(angle),
    };
  };
  const first = point(0);
  let path = `M${number(first.x)},${number(first.y)}`;

  for (let index = 0; index < count; index += 1) {
    const a = point(index * step);
    const b = point((index + 1) * step);

    path += `C${number(a.x + (a.dx * step) / 3)},${number(a.y + (a.dy * step) / 3)},${number(b.x - (b.dx * step) / 3)},${number(b.y - (b.dy * step) / 3)},${number(b.x)},${number(b.y)}`;
  }

  return `${path}Z`;
}

export function waveFrames(path: (phase: number) => string) {
  return Object.fromEntries(
    Array.from({ length: 9 }, (_, index) => [`${index * 12.5}%`, { d: `path("${path((index * Math.PI) / 4)}")` }]),
  ) as Record<`${number}%`, { d: string }>;
}

export type WaveStyles = Record<`&${string}`, { d: string; animation: string }>;
