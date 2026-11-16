'use client';

import { useRef, useState } from 'react';
import { IconButton } from '@flaut-travel/react-md3e';

const icon = (
  <svg viewBox="0 0 24 24" focusable="false">
    <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
  </svg>
);

export function IconButtonDemo() {
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState(false);
  const [submissions, setSubmissions] = useState(0);
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <section>
      <h2>Icon button interaction</h2>
      <div className="fixture-row">
        <IconButton aria-label="Count icon clicks" ref={ref} onClick={() => setCount(count + 1)}>
          {icon}
        </IconButton>
        <IconButton aria-label="Disabled icon action" disabled onClick={() => setCount(count + 1)}>
          {icon}
        </IconButton>
        <IconButton
          aria-label="Toggle favorite"
          variant="tonal"
          selected={selected}
          onClick={() => setSelected(!selected)}
        >
          {icon}
        </IconButton>
        <IconButton aria-label="Focus first icon" variant="standard" onClick={() => ref.current?.focus()}>
          {icon}
        </IconButton>
        <IconButton aria-label="Without icon ripple" disableRipple>
          {icon}
        </IconButton>
      </div>
      <p>
        Clicks: <span data-testid="icon-click-count">{count}</span>
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmissions(submissions + 1);
        }}
      >
        <IconButton aria-label="Normal icon button">{icon}</IconButton>
        <IconButton aria-label="Submit icon form" type="submit">
          {icon}
        </IconButton>
      </form>
      <p>
        Submissions: <span data-testid="icon-submission-count">{submissions}</span>
      </p>
    </section>
  );
}
