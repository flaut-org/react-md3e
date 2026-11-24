// Geometry adapted from matraic/m3e RippleElement.ts; MIT, see licenses/m3e.txt.
export interface RipplePoint {
  x: number;
  y: number;
}

export interface RippleGeometry {
  size: number;
  startX: number;
  startY: number;
}

/** Measure in layout pixels and normalize pointer coordinates for scaled/zoomed surfaces. */
export function measureRipple(surface: HTMLElement, point?: RipplePoint): RippleGeometry | undefined {
  const bounds = surface.getBoundingClientRect();
  const width = surface.clientWidth;
  const height = surface.clientHeight;
  let geometry: RippleGeometry | undefined;

  if (bounds.width && bounds.height && width && height) {
    const originX = point ? Math.max(0, Math.min(width, ((point.x - bounds.left) * width) / bounds.width)) : width / 2;
    const originY = point
      ? Math.max(0, Math.min(height, ((point.y - bounds.top) * height) / bounds.height))
      : height / 2;

    // m3e uses the distance to the farthest corner as the initial disk radius.
    const radius = Math.hypot(Math.max(originX, width - originX), Math.max(originY, height - originY));
    const size = radius * 2;

    geometry = {
      size,
      startX: originX - size / 2,
      startY: originY - size / 2,
    };
  }

  return geometry;
}
