import '@flaut-travel/react-md3e/slider/styles.css';

import { Slider, ThemeProvider } from '@flaut-travel/react-md3e';
import { SliderDemo } from './slider-demo/slider-demo.component';
import styles from './sliders.module.css';

export default function SlidersPage() {
  return (
    <ThemeProvider colorScheme="light">
      <main>
        <h1>Sliders</h1>
        <section className={styles.stack} aria-label="Server composition">
          <Slider label="Server brightness" defaultValue={25} data-testid="server-slider" />
          <Slider
            label="Server balance"
            variant="centered"
            min={-100}
            max={100}
            defaultValue={-40}
            data-testid="server-centered"
          />
          {(['extraSmall', 'small', 'medium', 'large', 'extraLarge'] as const).map((size) => (
            <Slider key={size} label={`${size} size`} size={size} defaultValue={50} data-testid={`size-${size}`} />
          ))}
        </section>
        <SliderDemo />
      </main>
    </ThemeProvider>
  );
}
