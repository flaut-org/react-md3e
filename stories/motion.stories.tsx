import '@flaut-travel/react-md3e/button/styles.css';
import '@flaut-travel/react-md3e/icon-button/styles.css';
import '@flaut-travel/react-md3e/shape/styles.css';
import '@flaut-travel/react-md3e/collapsible/styles.css';
import '@flaut-travel/react-md3e/dialog/styles.css';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { MotionScheme, Theme } from '@flaut-travel/react-md3e';
import { useState } from 'react';
import { Button, Shape, ThemeProvider } from '@flaut-travel/react-md3e';
import themes from './themes.generated.json';
import motionSchemes from './motion-schemes.generated.json';

function exampleTheme(scheme: MotionScheme): Theme {
  const motion = motionSchemes[scheme];

  return {
    ...themes.material,
    ...motion,
    cssVariables: { ...themes.material.cssVariables, ...motion.cssVariables },
  } as Theme;
}

const examples = { standard: exampleTheme('standard'), expressive: exampleTheme('expressive') };
const meta = {
  title: 'Foundations/Motion',
  parameters: {
    docs: {
      description: {
        component:
          'Official MD3 standard and expressive spring parameters, converted to build-time CSS linear() curves. Spatial motion can overshoot; effects remain monotonic. No browser spring solver or animation runtime.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Schemes: Story = {
  render: function Render() {
    const [scheme, setScheme] = useState<MotionScheme>('expressive');
    const [selected, setSelected] = useState(false);

    return (
      <div className="story-grid">
        <label htmlFor="story-motion-scheme">Motion scheme</label>
        <select
          id="story-motion-scheme"
          value={scheme}
          onChange={(event) => setScheme(event.target.value as MotionScheme)}
        >
          <option value="expressive">Expressive</option>
          <option value="standard">Standard</option>
        </select>
        <ThemeProvider theme={examples[scheme]} data-testid="motion-scope" className="theme-card">
          <div className="story-row">
            <Button selected={selected} onClick={() => setSelected(!selected)}>
              Animate motion
            </Button>
            <Shape variant={selected ? 'sunny' : 'circle'} />
          </div>
        </ThemeProvider>
      </div>
    );
  },
};
