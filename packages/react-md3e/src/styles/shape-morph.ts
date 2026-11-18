/** Build-time only. Turn normalized cubic contours into compatible CSS polygons. */
type Point = readonly [number, number];
interface Contour {
  readonly points: readonly Point[];
  readonly distances: readonly number[];
  readonly perimeter: number;
}

const pointCount = 256;
const curveSteps = 24;

function cubicPoint(start: Point, first: Point, second: Point, end: Point, t: number): Point {
  const u = 1 - t;

  return [
    u ** 3 * start[0] + 3 * u ** 2 * t * first[0] + 3 * u * t ** 2 * second[0] + t ** 3 * end[0],
    u ** 3 * start[1] + 3 * u ** 2 * t * first[1] + 3 * u * t ** 2 * second[1] + t ** 3 * end[1],
  ];
}

function samplePath(path: string): Point[] {
  const values = path.match(/-?[0-9]+(?:\.[0-9]+)?/g)?.map(Number) ?? [];

  if (!/^M[0-9.,C-]+Z$/.test(path) || values.length < 8 || (values.length - 2) % 6 !== 0) {
    throw new TypeError('Shape morphing expects a closed, normalized cubic SVG contour.');
  }

  let start: Point = [values[0]!, values[1]!];
  const points: Point[] = [start];

  for (let index = 2; index < values.length; index += 6) {
    const first: Point = [values[index]!, values[index + 1]!];
    const second: Point = [values[index + 2]!, values[index + 3]!];
    const end: Point = [values[index + 4]!, values[index + 5]!];

    for (let step = 1; step <= curveSteps; step += 1) {
      const point = cubicPoint(start, first, second, end, step / curveSteps);
      const previous = points.at(-1)!;

      if (Math.hypot(point[0] - previous[0], point[1] - previous[1]) > 1e-9) {
        points.push(point);
      }
    }

    start = end;
  }

  const area = points.reduce((sum, point, index) => {
    const next = points[(index + 1) % points.length]!;

    return sum + point[0] * next[1] - next[0] * point[1];
  }, 0);

  if (area < 0) {
    points.reverse();
  }

  return points;
}

function measureContour(points: Point[]): Contour {
  const first = points[0]!;
  const last = points.at(-1)!;
  const closed = Math.hypot(first[0] - last[0], first[1] - last[1]) < 1e-9 ? points : [...points, first];
  const distances = [0];

  for (let index = 1; index < closed.length; index += 1) {
    const previous = closed[index - 1]!;
    const point = closed[index]!;

    distances.push(distances.at(-1)! + Math.hypot(point[0] - previous[0], point[1] - previous[1]));
  }

  return { points: closed, distances, perimeter: distances.at(-1)! };
}

/** A shared right-facing ray fixes phase, preventing arbitrary rotation between silhouettes. */
function findStart(contour: Contour): number {
  let rightmost = -Infinity;
  let start = 0;

  for (let index = 1; index < contour.points.length; index += 1) {
    const previous = contour.points[index - 1]!;
    const point = contour.points[index]!;
    const crossesCenter = (previous[1] <= 0.5 && point[1] > 0.5) || (point[1] <= 0.5 && previous[1] > 0.5);

    if (crossesCenter) {
      const fraction = (0.5 - previous[1]) / (point[1] - previous[1]);
      const x = previous[0] + fraction * (point[0] - previous[0]);

      if (x > rightmost) {
        rightmost = x;
        start = contour.distances[index - 1]! + fraction * (contour.distances[index]! - contour.distances[index - 1]!);
      }
    }
  }

  return start;
}

function pointAt(contour: Contour, distance: number): Point {
  const target = ((distance % contour.perimeter) + contour.perimeter) % contour.perimeter;
  let low = 1;
  let high = contour.distances.length - 1;

  while (low < high) {
    const middle = Math.floor((low + high) / 2);

    if (contour.distances[middle]! < target) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }

  const before = contour.distances[low - 1]!;
  const fraction = (target - before) / (contour.distances[low]! - before);
  const start = contour.points[low - 1]!;
  const end = contour.points[low]!;

  return [start[0] + fraction * (end[0] - start[0]), start[1] + fraction * (end[1] - start[1])];
}

/** Snap nearby samples to sharp corners, preserving the catalog's pixel steps and cusps. */
function sampleDistances(contour: Contour, start: number): number[] {
  const step = contour.perimeter / pointCount;
  const distances = Array.from({ length: pointCount }, (_value, index) => start + index * step);
  const snaps = new Map<number, number>();
  const count = contour.points.length - 1;

  for (let index = 0; index < count; index += 1) {
    const previous = contour.points[(index + count - 1) % count]!;
    const point = contour.points[index]!;
    const next = contour.points[(index + 1) % count]!;
    const incoming = [point[0] - previous[0], point[1] - previous[1]] as const;
    const outgoing = [next[0] - point[0], next[1] - point[1]] as const;
    const cosine =
      (incoming[0] * outgoing[0] + incoming[1] * outgoing[1]) / (Math.hypot(...incoming) * Math.hypot(...outgoing));

    if (cosine < Math.cos(Math.PI / 6)) {
      const distance = (contour.distances[index]! - start + contour.perimeter) % contour.perimeter;
      const nearest = Math.round(distance / step);
      const slot = nearest % pointCount;
      const delta = Math.abs(distance - nearest * step);

      if (delta < (snaps.get(slot) ?? Infinity)) {
        distances[slot] = start + distance;
        snaps.set(slot, delta);
      }
    }
  }

  return distances;
}

export function createShapePolygon(path: string, fitCircle = false): string {
  const contour = measureContour(samplePath(path));
  const distances = sampleDistances(contour, findStart(contour));
  const samples = distances.map((distance) => pointAt(contour, distance));
  const scale = fitCircle ? 0.5 / Math.max(...samples.map(([x, y]) => Math.hypot(x - 0.5, y - 0.5))) : 1;
  const points = samples.map(
    ([x, y]) =>
      `${Number(((0.5 + (x - 0.5) * scale) * 100).toFixed(4))}% ${Number(((0.5 + (y - 0.5) * scale) * 100).toFixed(4))}%`,
  );

  return `polygon(${points.join(', ')})`;
}
