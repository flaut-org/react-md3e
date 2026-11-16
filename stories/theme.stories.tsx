import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Theme } from '@flaut-travel/react-md3e';
import { Button, ThemeProvider } from '@flaut-travel/react-md3e';
import themes from './themes.generated.json';

const meta = {
  title: 'Foundations/Theme',
  parameters: {
    docs: {
      description: {
        component:
          'createTheme follows Material Theme Builder: source color, HCT tonal palettes, semantic light/dark roles, key-color overrides, harmonized custom colors, and MD3 typography. These examples are generated at build time; color utilities are absent from the preview UI bundle. ThemeProvider is a CSS scope with no React context.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BrandsAndSchemes: Story = {
  render: () => (
    <div className="story-grid">
      {Object.entries(themes).map(([name, theme]) => (
        <div key={name} className="story-row">
          {(['light', 'dark'] as const).map((mode) => (
            <ThemeProvider key={mode} theme={theme as Theme} colorScheme={mode} className="theme-card">
              <h2>
                {name} / {mode}
              </h2>
              <p>One theme, two generated color schemes.</p>
              <div className="theme-swatches" aria-label="Theme color roles">
                {['primary', 'secondary', 'tertiary'].map((role) => (
                  <span
                    key={role}
                    className="theme-swatch"
                    title={role}
                    style={{ backgroundColor: `var(--md-sys-color-${role})` }}
                  />
                ))}
              </div>
              <div className="story-row">
                <Button>Continue</Button>
                <Button variant="tonal">Learn more</Button>
                <Button variant="outlined">Later</Button>
              </div>
            </ThemeProvider>
          ))}
        </div>
      ))}
    </div>
  ),
};
