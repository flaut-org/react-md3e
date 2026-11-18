'use client';

import { useState } from 'react';
import { Button, LoadingIndicator, ProgressIndicator } from '@flaut-travel/react-md3e';

export function IndicatorDemo() {
  const [value, setValue] = useState(40);
  const [indeterminate, setIndeterminate] = useState(false);
  const progress = indeterminate ? null : value;

  return (
    <section>
      <h2>Controlled operation</h2>
      <label htmlFor="operation-progress">Operation progress</label>
      <input
        id="operation-progress"
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
      />
      <label>
        <input type="checkbox" checked={indeterminate} onChange={(event) => setIndeterminate(event.target.checked)} />
        Unknown duration
      </label>
      <div className="fixture-row">
        <LoadingIndicator
          variant="contained"
          value={progress}
          aria-label="Controlled loading"
          data-testid="controlled-loading"
        />
        <ProgressIndicator
          type="circular"
          appearance="wavy"
          value={progress}
          aria-label="Controlled circular progress"
          data-testid="controlled-circular"
        />
        <Button onClick={() => setValue(100)}>Complete operation</Button>
      </div>
      <ProgressIndicator
        appearance="wavy"
        value={progress}
        aria-label="Controlled linear progress"
        data-testid="controlled-linear"
      />
      <Button loading loadingIndicator={<LoadingIndicator size={20} color="inherit" aria-hidden />}>
        Custom loading button
      </Button>
    </section>
  );
}
