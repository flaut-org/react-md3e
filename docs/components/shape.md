# Shape

Shape renders the 35 decorative MD3 Expressive silhouettes, including cookies, flowers, clovers,
hearts and pixel shapes. It is separate from [Surface](surface.md), which owns ordinary surfaces and
rounded corners, and [Card](card.md), which builds content containers on Surface.

All contours come from Google's AndroidX MaterialShapes definitions and are exported offline using
the official graphics-shapes library. During the normal Node build, Linaria prepares compatible
polygons for CSS morphing and exact SVG masks for static rendering. The component selects a
precompiled data state; no geometry library, path construction, CSS insertion, DOM measurement,
animation effect or client directive runs in Shape.

```tsx
import { Shape } from '@flaut-travel/react-md3e/shape';

export function Decorations() {
  return (
    <>
      <Shape variant="cookie9Sided" color="tertiaryContainer" />
      <Shape variant="flower" size="large" aria-label="Mountain lake illustration">
        <img src="/lake.jpg" alt="" />
      </Shape>
    </>
  );
}
```

Import `/styles.css` once at the application root. Shape, shapeVariants and their types are exported
from the root and `/shape`. The example works in RSC, server HTML without JS and streamed content.

## API and catalog

| Prop                                             | Behavior                                                                                                   |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `variant`                                        | One of the 35 official silhouettes; default cookie9Sided                                                   |
| `morph`                                          | Animate variant changes on the same mounted element; default true. False selects the exact static SVG mask |
| `size`                                           | small 40px, medium 80px or large 120px; default medium                                                     |
| `color`                                          | Same named container/content pairs as Surface; default primaryContainer/onPrimaryContainer                 |
| `aria-label` / `aria-labelledby`                 | Names a meaningful illustration and gives the wrapper role img                                             |
| `children`                                       | Optional noninteractive image, decorative SVG or visual content, clipped by the silhouette                 |
| `className`, `style`, native div props and `ref` | Apply to the wrapper; role is owned by Shape                                                               |

The public shapeVariants readonly catalog uses camelCase versions of the official names:

- circle, square, slanted, arch, fan, arrow, semiCircle, oval, pill
- triangle, diamond, clamShell, pentagon, gem, sunny, verySunny
- cookie4Sided, cookie6Sided, cookie7Sided, cookie9Sided, cookie12Sided
- ghostish, clover4Leaf, clover8Leaf, burst, softBurst, boom, softBoom
- flower, puffy, puffyDiamond, pixelCircle, pixelTriangle, bun, heart

Each original contour is normalized into a square while preserving its proportions. The square is
the catalog's rounded square, not Surface's none corner. The silhouettes do not change when the
theme's corner radii change. Static masks preserve the original cubic contours; the morphing path
uses a dense polygon approximation of those same contours, with sharp-corner samples retained.

Sizes are library conveniences rather than MD3 component measurements. Use a compiled class or
native style for custom dimensions. The default aspect ratio is 1:1. SVG masking scales with the
box; use equal dimensions to preserve the standard silhouette. Direct img children fill the box
with object-fit cover. Direct SVG children occupy 40% of the box and inherit the paired foreground.
Theme color-scheme and container/onContainer roles inherit through ordinary CSS.

## Semantics and limits

Shapes are decorative and aria-hidden by default. Supply a concise aria-label or aria-labelledby
for meaningful imagery; the whole wrapper becomes one image for assistive technology. Use empty alt
on a masked child image when the wrapper provides its accessible name. The illustration's label
should convey its meaning, not just repeat the silhouette's name.

Shape is for decorative UI, image crops and illustrations. Keep essential text outside a shape that
could crop it. Use Surface or Card for interactive content: masks can clip focus indicators and touch
targets, and an image/decorative wrapper is not an interactive grouping. No button/link role is
exposed. Shape has no direction-specific icon meaning; RTL does not automatically mirror its geometry.

Forced colors keeps the silhouette visible with CanvasText/Canvas instead of losing its fill.

## Morphing

Changing variant on the same mounted Shape smoothly interpolates its clipping contour. It also
clips image/SVG children throughout the transition. State and events live in the consumer; Shape
itself stays server-compatible:

```tsx
'use client';

import { useState } from 'react';
import { Button, Shape } from '@flaut-travel/react-md3e';

export function FavoriteIllustration() {
  const [favorite, setFavorite] = useState(false);

  return (
    <>
      <Shape variant={favorite ? 'heart' : 'circle'} aria-label="Favorite illustration" />
      <Button onClick={() => setFavorite((selected) => !selected)}>Change shape</Button>
    </>
  );
}
```

Every morph contour has 256 points with a consistent winding direction and a shared right-facing
start. The build samples the existing cubic paths by perimeter and snaps nearby samples to sharp
corners. CSS can therefore interpolate every catalog pair without generating geometry in the
browser. Endpoint polygons approximate the original curves; browser tests compare all 35 endpoints
with their original SVG masks at 120px. Use morph=false when exact static cubic rendering is wanted.

The default transition follows the theme's precompiled default-spatial spring curve and duration. Native
CSS transitions retarget from the current visible contour when variant changes again. This provides
position continuity; it does not claim AndroidX Morph feature matching or velocity-preserving
spring retargeting. Replacing/remounting the element starts at its new shape rather than morphing.

Public CSS properties customize motion through an ordinary compiled class or enclosing scope:

```css
.slow-illustration {
  --md3e-shape-morph-duration: 700ms;
  --md3e-shape-morph-easing: ease-in-out;
}
```

morph=false switches directly using the exact SVG mask. prefers-reduced-motion disables the
transition while retaining the polygon silhouette; browsers without clip-path polygon support fall
back to the SVG mask. Responsive percentage coordinates scale with the box without a resize observer.
There is no requestAnimationFrame loop, animation dependency, runtime CSS factory or client theme
provider in Shape. The compatible polygons are an intentional addition to the compiled CSS asset.

The Next `/surfaces` route and Storybook Components/Shape/Morphing demonstrate target selection,
interrupting a transition, masked imagery, size changes and the static opt-out.

## Provenance and regeneration

Source: [AndroidX MaterialShapes.kt at revision 89d9aa6a5b9fc6e4847002be42f3c6891b091c9e](https://github.com/androidx/androidx/blob/89d9aa6a5b9fc6e4847002be42f3c6891b091c9e/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/MaterialShapes.kt),
Copyright 2024 The Android Open Source Project, Apache-2.0. The exporter uses unmodified
androidx.graphics:graphics-shapes-desktop:1.0.1 and collection-jvm:1.5.0, preserving the upstream
shape coordinates, corner rounding, mirroring/repetition and rotations. It serializes normalized
cubic SVG paths to six decimal places. The original copyright, bundled license and package
THIRD_PARTY_NOTICES.md identify this derived geometry.

See [offline export instructions](../../scripts/shapes/README.md). A temporary Java/Kotlin toolchain
is needed only for maintainers regenerating the checked-in paths. Package builds and CI continue to
use the existing Node/asdf toolchain; consumers install no geometry dependency. No third-party UI
library supplies the shapes.

Read on 2026-11-15:

- [Official shape overview/principles](https://m3.material.io/styles/shape/overview-principles),
  rendered in a browser: 35 shapes, restrained decorative use and distinction from corner radii.
- [Google's MaterialShapes reference](https://developer.android.com/reference/kotlin/androidx/compose/material3/MaterialShapes)
  and the pinned source above: catalog and geometry.
- [Official shape morph guidance](https://m3.material.io/styles/shape/shape-morph): motion context.
- [M3E Shape / Morphing example](https://matraic.github.io/m3e/#/components/shape.html) and
  [its source at 1d0ae199beaf491c60f949c7584e3531444a897b](https://github.com/matraic/m3e/blob/1d0ae199beaf491c60f949c7584e3531444a897b/packages/web/src/shape/ShapeNameStyle.ts):
  reference behavior using compatible polygon contours and CSS transitions. No M3E source or
  dependency is included; our sampling/alignment implementation is independent.
- [CSS shape interpolation](https://drafts.csswg.org/css-shapes-1/#interpolation-of-basic-shapes):
  polygon interpolation requires compatible point counts and fill rules.

Browser tests decode and rasterize every compiled SVG mask, verify distinct visible contours,
accessible names, decorative/image behavior, theme colors, responsive bounds, Storybook, server
rendering and streaming. Morph tests sample actual intermediate/final contours, rapid retargeting,
all 35 endpoint silhouettes, resizing, opt-out and reduced motion. Artifact checks exclude path/style
generators from the UI import graph.
AndroidX geometry provenance is verified; visual conformance to Figma and testing outside Chromium
are not claimed.
