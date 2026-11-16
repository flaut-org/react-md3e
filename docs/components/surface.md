# Surface

Surface is the library's surface primitive: a structural HTML element with themed corners, matched
container/content colors and MD3 elevation. Card composes it. Surface has no hooks, context, portal,
interaction state or client directive. Its styles are typed objects extracted to CSS at build time.

Surface is our web adaptation of MD3 surface foundations. Google's Material 3 Compose library also
calls its base container Surface; this React API uses our own theme token contracts. Use [Shape](shape.md) for the 35
abstract Expressive silhouettes, and [Card](card.md) for content about one subject.

```tsx
import { Surface } from '@flaut-travel/react-md3e/surface';

export function TripSummary() {
  return (
    <Surface component="section" shape="largeIncreased" color="secondaryContainer" elevation={1}>
      <h2>Trip summary</h2>
      <p>Application-owned content.</p>
    </Surface>
  );
}
```

Import `/styles.css` once at the application root. The root and `/surface` entry export Surface and its
own types. The example is usable from RSC and streamed content. Supply layout/padding through a
compiled className; Surface does not prescribe padding or a content hierarchy.

## API

| Prop                                                     | Behavior                                                                                                                         |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `component`                                              | Structural native tag; default div. Also span, article, section, aside, figure, header, footer or main                           |
| `shape`                                                  | none, extraSmall, small, medium, large, largeIncreased, extraLarge, extraLargeIncreased, extraExtraLarge or full; default medium |
| `color`                                                  | A named MD3 container role with its paired content color; default surface                                                        |
| `elevation`                                              | MD3 level 0–5; default 0                                                                                                         |
| `variant`                                                | filled or outlined; default filled. Outlined adds a 1px outlineVariant border                                                    |
| `clip`                                                   | Clip descendants to the corner shape; false by default                                                                           |
| `children`, `className`, `style`, native props and `ref` | Forwarded to the chosen native element; the ref type follows component                                                           |

Supported color roles are surface, surfaceDim, surfaceBright, surfaceContainerLowest,
surfaceContainerLow, surfaceContainer, surfaceContainerHigh, surfaceContainerHighest, inverseSurface,
primary, primaryContainer, secondary, secondaryContainer, tertiary, tertiaryContainer, error and
errorContainer. Surface roles pair with onSurface; accents pair with their corresponding onColor;
inverseSurface pairs with inverseOnSurface. No colors are calculated during rendering.

Resting corner defaults are 0, 4, 8, 12, 16, 20, 28, 32 and 48px, with full using the theme's pill
radius. createTheme shape overrides affect the matching corners via CSS variables. none is fixed
at zero; full remains the existing pill token. Expressive's largeIncreased, extraLargeIncreased and
extraExtraLarge are configurable theme roles as well.

Elevation levels use precompiled CSS shadows based on the theme shadow role. They do not apply
an old MD2 surface-tint overlay or silently change the requested background. Choose the appropriate
container role separately. These shadows are a web adaptation of MD3 levels, not Android shadow
rasterization. Outlined and elevation can be combined deliberately.

Surface has no role or tab stop of its own. Choose section/article and a heading when content requires
those semantics. Native event handlers belong in consumer client components; they do not turn the
style module or an RSC use of Surface into a client component. A clickable card uses CardActionArea
rather than giving a div keyboard behavior. clip=false preserves outside focus rings, shadows and
positioned content; Card explicitly clips its own media. Forced colors provides a Canvas surface,
CanvasText content/boundary and removes shadows.

## Verification and references

Colocated tests check all corner roles, custom theme overrides, paired light/dark colors, outline,
clipping, six distinct shadows, DOM refs and structural semantics, SSR without JS, streaming,
Storybook and forced colors. Package validation imports Surface under react-server conditions and
rejects style/color-generation helpers in the UI graph.

Read on 2026-11-15:

- [Google Material 3 Surface API](https://developer.android.com/reference/kotlin/androidx/compose/material3/Surface.composable):
  terminology and foundation responsibilities.
- [MD3 corner radius scale](https://m3.material.io/styles/shape/corner-radius-scale) and
  [shape principles](https://m3.material.io/styles/shape/overview-principles).
- [MD3 elevation](https://m3.material.io/styles/elevation/overview) and the existing
  [theme contract](../theming.md).
- [AndroidX ShapeTokens.kt, revision 89d9aa6a5b9fc6e4847002be42f3c6891b091c9e](https://github.com/androidx/androidx/blob/89d9aa6a5b9fc6e4847002be42f3c6891b091c9e/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ShapeTokens.kt),
  token version 14_1_0: corner scale, including the three Expressive additions.

No upstream surface implementation code is copied. Browser checks cover Chromium; Figma parity
and other engines are not claimed.

The component and public entry were renamed from Paper to Surface, following MD3 terminology.
Update imports to Surface and `/surface`, public Surface* type names and the Components/Surface
Storybook group. No Paper compatibility alias is retained. Dialog's unrelated scroll="paper" value
continues to describe its existing scrolling mode.
