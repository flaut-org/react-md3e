import { shapePaths } from '../../tokens/shape-paths.generated';
import { createShapePolygon } from '../../styles/shape-morph';

type Point = readonly [number, number];

/** Build-time normalization preserves each silhouette's bounding box as it rotates. */
function normalize(path: string): Point[] {
  const coordinates = createShapePolygon(path)
    .match(/[\d.]+/g)!
    .map(Number);
  const points = Array.from(
    { length: coordinates.length / 2 },
    (_, index) => [coordinates[index * 2]!, coordinates[index * 2 + 1]!] as const,
  );
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const size = Math.max(maxX - minX, maxY - minY);

  return points.map(([x, y]) => [
    ((x - (minX + maxX) / 2) / size + 0.5) * 100,
    ((y - (minY + maxY) / 2) / size + 0.5) * 100,
  ]);
}

/** Match vertex phases without rotating the silhouette or solving geometry in the browser. */
function align(points: readonly Point[], reference: readonly Point[]): readonly Point[] {
  let bestOffset = 0;
  let bestDistance = Infinity;

  for (let offset = 0; offset < points.length; offset += 1) {
    let distance = 0;

    for (let index = 0; index < points.length; index += 1) {
      const point = points[(index + offset) % points.length]!;
      const target = reference[index]!;

      distance += (point[0] - target[0]) ** 2 + (point[1] - target[1]) ** 2;
    }

    if (distance < bestDistance) {
      bestDistance = distance;
      bestOffset = offset;
    }
  }

  return points.map((_, index) => points[(index + bestOffset) % points.length]!);
}

export function createLoadingPolygons<Name extends keyof typeof shapePaths>(names: readonly Name[], reference: Name) {
  const anchor = normalize(shapePaths[reference]);

  return Object.fromEntries(
    names.map((name) => {
      const points = align(normalize(shapePaths[name]), anchor);
      const polygon = points.map(([x, y]) => `${Number(x.toFixed(4))}% ${Number(y.toFixed(4))}%`);

      return [name, `polygon(${polygon.join(', ')})`];
    }),
  ) as Readonly<Record<Name, string>>;
}
