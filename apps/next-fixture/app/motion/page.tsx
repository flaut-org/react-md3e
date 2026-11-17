import '@flaut-travel/react-md3e/button/styles.css';
import '@flaut-travel/react-md3e/icon-button/styles.css';
import '@flaut-travel/react-md3e/shape/styles.css';
import '@flaut-travel/react-md3e/collapsible/styles.css';
import '@flaut-travel/react-md3e/dialog/styles.css';
import './standard.generated.css';

import Link from 'next/link';
import { Button, ThemeProvider } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import { MotionDemo } from './motion-demo/motion-demo.component';

const themes = {
  expressive: createTheme({ sourceColor: '#9a91e0', motionScheme: 'expressive' }),
  standard: createTheme({ sourceColor: '#9a91e0', motionScheme: 'standard' }),
};

export default function MotionPage() {
  return (
    <main>
      <h1>MD3 motion schemes</h1>
      <ThemeProvider className="standard-motion-static" data-testid="static-standard-motion">
        <Button data-testid="static-motion-button">Build-time standard motion</Button>
      </ThemeProvider>
      <MotionDemo themes={themes} />
      <Link href="/">Back to components</Link>
    </main>
  );
}
