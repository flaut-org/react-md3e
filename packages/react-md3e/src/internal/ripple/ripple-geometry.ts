export interface RipplePoint {
  x: number;
  y: number;
}

export interface RippleGeometry {
  size: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  scale: number;
}

/** Measure in layout pixels and normalize pointer coordinates for scaled/zoomed surfaces. */
export function measureRipple(surface: HTMLElement, point?: RipplePoint): RippleGeometry | undefined {
  const bounds = surface.getBoundingClientRect();
  const width = surface.clientWidth;
  const height = surface.clientHeight;
  let geometry: RippleGeometry | undefined;

  if (bounds.width && bounds.height && width && height) {
    const size = Math.max(1, Math.floor(Math.max(width, height) * 0.2));
    const originX = point ? Math.max(0, Math.min(width, ((point.x - bounds.left) * width) / bounds.width)) : width / 2;
    const originY = point
      ? Math.max(0, Math.min(height, ((point.y - bounds.top) * height) / bounds.height))
      : height / 2;

    geometry = {
      size,
      startX: originX - size / 2,
      startY: originY - size / 2,
      endX: (width - size) / 2,
      endY: (height - size) / 2,
      scale: (Math.hypot(width, height) + 10) / size,
    };
  }

  return geometry;
}
