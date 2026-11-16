import type { Preview } from '@storybook/react-vite';
import { ThemeProvider } from '@flaut-travel/react-md3e';
import type { ColorSchemePreference, Theme } from '@flaut-travel/react-md3e';
import '@flaut-travel/react-md3e/styles.css';

import themes from '../stories/themes.generated.json';
import './preview.css';

const preview: Preview = {
  globalTypes: {
    colorScheme: {
      description: 'CSS color scheme',
      toolbar: { icon: 'circlehollow', items: ['light', 'dark', 'system'], dynamicTitle: true },
    },
    brand: {
      description: 'Precompiled createTheme configuration',
      toolbar: {
        icon: 'paintbrush',
        items: ['material', 'forest', 'expressive'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { colorScheme: 'light', brand: 'material' },
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    a11y: { test: 'error' },
  },
  decorators: [
    (Story, context) => {
      const brand = context.globals.brand as keyof typeof themes;

      return (
        <ThemeProvider
          theme={(themes[brand] ?? themes.material) as Theme}
          colorScheme={context.globals.colorScheme as ColorSchemePreference}
          className="story-surface"
        >
          <Story />
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
