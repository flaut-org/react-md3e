import '@flaut-travel/react-md3e/switch/styles.css';
import '@flaut-travel/react-md3e/button/styles.css';

import Link from 'next/link';
import { Switch, ThemeProvider } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import { SwitchDemo } from './switch-demo/switch-demo.component';
import styles from './switches.module.css';

const standard = createTheme({ sourceColor: '#386a20', motionScheme: 'standard' });
const check = (
  <svg viewBox="0 0 24 24" focusable="false">
    <path d="m9 16-4-4-1.4 1.4L9 18.8 21.4 6.4 20 5z" />
  </svg>
);
const close = (
  <svg viewBox="0 0 24 24" focusable="false">
    <path d="m6 5 6 6 6-6 1 1-6 6 6 6-1 1-6-6-6 6-1-1 6-6-6-6z" />
  </svg>
);

export default function SwitchesPage() {
  return (
    <ThemeProvider colorScheme="light" data-testid="switch-theme">
      <main>
        <h1>Material Switch</h1>
        <section>
          <h2>Server-rendered settings</h2>
          <div className="fixture-row">
            <label className={styles.setting}>
              <Switch aria-label="Server notifications" data-testid="server-switch" /> Server notifications
            </label>
            <label className={styles.setting}>
              <Switch aria-label="Server enabled" defaultChecked data-testid="server-checked-switch" /> Server enabled
            </label>
            <label className={styles.setting}>
              <Switch aria-label="Selected icon" checkedIcon={check} /> Selected icon
            </label>
            <label className={styles.setting}>
              <Switch aria-label="Both icons" icon={close} checkedIcon={check} data-testid="icon-switch" /> Both icons
            </label>
          </div>
        </section>
        <SwitchDemo />
        <ThemeProvider
          theme={standard}
          colorScheme="dark"
          dir="rtl"
          className="fixture-card"
          data-testid="rtl-switch-theme"
        >
          <h2>RTL, dark colors and standard motion</h2>
          <div className="fixture-row">
            <label className={styles.setting}>
              <Switch aria-label="RTL notifications" data-testid="rtl-switch" /> RTL notifications
            </label>
            <label className={styles.setting}>
              <Switch aria-label="RTL enabled" defaultChecked checkedIcon={check} /> RTL enabled
            </label>
          </div>
        </ThemeProvider>
        <Link href="/">Back to components</Link>
      </main>
    </ThemeProvider>
  );
}
