import type { Preview } from '@storybook/react-vite';
import { ThemeProvider } from '@flaut-travel/react-md3e';
import type { ColorSchemePreference, Theme } from '@flaut-travel/react-md3e';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/600.css';
import '@fontsource/roboto/700.css';

import themes from '../stories/themes.generated.json';
import motionSchemes from '../stories/motion-schemes.generated.json';
import './preview.css';

const preview: Preview = {
  globalTypes: {
    colorScheme: {
      description: 'CSS color scheme',
      toolbar: { icon: 'circlehollow', items: ['light', 'dark', 'system'], dynamicTitle: true },
    },
    motionScheme: {
      description: 'MD3 spring motion scheme, independent of the color palette',
      toolbar: { icon: 'play', items: ['expressive', 'standard'], dynamicTitle: true },
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
  initialGlobals: { colorScheme: 'light', brand: 'material', motionScheme: 'expressive' },
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    a11y: { test: 'error' },
  },
  decorators: [
    (Story, context) => {
      const brand = context.globals.brand as keyof typeof themes;
      const selectedMotion = context.globals.motionScheme as keyof typeof motionSchemes;
      const brandTheme = themes[brand] ?? themes.material;
      const motion = motionSchemes[selectedMotion] ?? motionSchemes.expressive;
      const theme = {
        ...brandTheme,
        ...motion,
        cssVariables: { ...brandTheme.cssVariables, ...motion.cssVariables },
      } as Theme;

      return (
        <ThemeProvider
          theme={theme}
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
