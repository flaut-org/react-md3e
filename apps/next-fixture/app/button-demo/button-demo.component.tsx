'use client';

import { useState } from 'react';
import { Button, ThemeProvider } from '@flaut-org/react-md3e';

export function ButtonDemo() {
  const [selected, setSelected] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [submissions, setSubmissions] = useState(0);
  const [dark, setDark] = useState(false);

  return (
    <ThemeProvider colorScheme={dark ? 'dark' : 'light'} data-testid="interactive-theme" className="fixture-card">
      <h2>Base UI interaction and MD3 ripple</h2>
      <div className="fixture-row">
        <Button
          onClick={() => setClicks(clicks + 1)}
          startIcon={
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
            </svg>
          }
          endIcon={
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="m12 4-1.4 1.4 5.6 5.6H4v2h12.2l-5.6 5.6L12 20l8-8z" />
            </svg>
          }
        >
          Count clicks
        </Button>
        <Button disableRipple>No ripple</Button>
        <Button disabled onClick={() => setClicks(clicks + 1)}>
          Disabled action
        </Button>
        <Button variant="tonal" selected={selected} onClick={() => setSelected(!selected)}>
          Favorite
        </Button>
        <Button variant="outlined" onClick={() => setDark(!dark)}>
          Change color scheme
        </Button>
      </div>
      <output data-testid="click-count">{clicks}</output>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmissions(submissions + 1);
        }}
      >
        <div className="fixture-row">
          <Button>Normal button</Button>
          <Button type="submit">Submit form</Button>
        </div>
        <output data-testid="submission-count">{submissions}</output>
      </form>
    </ThemeProvider>
  );
}
