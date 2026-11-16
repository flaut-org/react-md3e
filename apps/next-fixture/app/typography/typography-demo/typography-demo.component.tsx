'use client';

import { useRef, useState } from 'react';
import { Button, Typography } from '@flaut-org/react-md3e';

export function TypographyDemo() {
  const [emphasized, setEmphasized] = useState(false);
  const [followed, setFollowed] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  return (
    <section>
      <Typography component="h2" variant="titleLarge">
        Client composition
      </Typography>
      <Typography ref={textRef} variant="labelLarge" emphasized={emphasized} data-testid="toggled-type">
        Updated through attributes
      </Typography>
      <Typography
        component="a"
        href="#typography-target"
        ref={linkRef}
        color="primary"
        data-testid="typed-link"
        onClick={(event) => {
          event.preventDefault();
          setFollowed(true);
        }}
      >
        Native link action
      </Typography>
      <Button
        onClick={() => {
          setEmphasized((value) => !value);
          textRef.current?.setAttribute('data-ref-checked', 'true');
          linkRef.current?.setAttribute('data-ref-checked', 'true');
        }}
      >
        Toggle emphasis
      </Button>
      <p data-testid="typography-followed">{String(followed)}</p>
    </section>
  );
}
