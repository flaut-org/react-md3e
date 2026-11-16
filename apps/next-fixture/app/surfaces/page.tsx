import {
  Surface,
  Shape,
  shapeVariants,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  ThemeProvider,
} from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import { ShapeMorphDemo } from './shape-morph-demo/shape-morph-demo.component';
import { SurfaceDemo } from './surface-demo/surface-demo.component';

const forest = createTheme({
  sourceColor: '#386a20',
  shape: { medium: 18, largeIncreased: 24 },
  typography: { plainFontFamily: 'Arial, sans-serif' },
});
const corners = [
  'none',
  'extraSmall',
  'small',
  'medium',
  'large',
  'largeIncreased',
  'extraLarge',
  'extraLargeIncreased',
  'extraExtraLarge',
  'full',
] as const;

export default function SurfacesPage() {
  return (
    <ThemeProvider theme={forest} colorScheme="light">
      <main>
        <h1>Surface, Shape and Card</h1>
        <section>
          <h2>Server-rendered card variants</h2>
          <div className="surface-example-grid surface-card-grid" data-testid="card-variants">
            {(['filled', 'elevated', 'outlined'] as const).map((variant) => (
              <Card component="article" key={variant} variant={variant} data-testid={`server-card-${variant}`}>
                <CardMedia src="/card-landscape.svg" alt="Mountain lake" />
                <CardContent>
                  <h3 className="surface-example-title">{variant} card</h3>
                  <p className="surface-example-description">A server-created surface.</p>
                </CardContent>
                <CardActions>
                  <Button variant="text">Explore {variant}</Button>
                </CardActions>
              </Card>
            ))}
          </div>
        </section>
        <SurfaceDemo />
        <section>
          <h2>Shape morphing</h2>
          <ShapeMorphDemo />
        </section>
        <section>
          <h2>Surface corners and elevations</h2>
          <div className="surface-example-grid" data-testid="surface-corners">
            {corners.map((shape) => (
              <Surface
                key={shape}
                shape={shape}
                color="secondaryContainer"
                data-testid={`surface-${shape}`}
                className="surface-example-pad"
              >
                {shape}
              </Surface>
            ))}
          </div>
          <div className="surface-example-grid" data-testid="surface-elevations">
            {([0, 1, 2, 3, 4, 5] as const).map((elevation) => (
              <Surface
                key={elevation}
                elevation={elevation}
                data-testid={`elevation-${elevation}`}
                className="surface-example-pad"
              >
                Level {elevation}
              </Surface>
            ))}
          </div>
          <Surface variant="outlined" data-testid="outlined-surface" className="surface-example-pad">
            Outlined surface
          </Surface>
          <Surface color="primary" data-testid="accent-surface" className="surface-example-pad">
            Primary surface and paired content
          </Surface>
          <Surface clip data-testid="clipped-surface" className="surface-example-pad">
            Explicitly clipped content
          </Surface>
        </section>
        <section>
          <h2>35 Expressive shapes</h2>
          <div className="shape-example-gallery" data-testid="shape-gallery">
            {shapeVariants.map((variant) => (
              <figure key={variant}>
                <Shape variant={variant} size="large" morph={false} />
                <figcaption>{variant}</figcaption>
              </figure>
            ))}
          </div>
          <Shape variant="flower" aria-label="Favorite illustration" data-testid="named-shape">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="m12 2 3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z" />
            </svg>
          </Shape>
          <Shape variant="clover4Leaf" size="large" aria-label="Scenic illustration" data-testid="image-shape">
            <img src="/card-landscape.svg" alt="" />
          </Shape>
        </section>
        <ThemeProvider theme={forest} colorScheme="dark" data-testid="surfaces-dark">
          <section className="surface-example-pad">
            <h2>Nested dark theme</h2>
            <Surface color="tertiaryContainer" className="surface-example-pad">
              Dark surface
            </Surface>
            <Shape variant="heart" aria-label="Dark heart" />
            <Card variant="elevated">
              <CardContent>Dark card</CardContent>
            </Card>
          </section>
        </ThemeProvider>
        <section dir="rtl" data-testid="rtl-card">
          <h2>RTL actions</h2>
          <Card variant="outlined">
            <CardContent>رحلة إلى الجبال</CardContent>
            <CardActions>
              <Button variant="text">إلغاء</Button>
              <Button>حجز</Button>
            </CardActions>
          </Card>
        </section>
      </main>
    </ThemeProvider>
  );
}
