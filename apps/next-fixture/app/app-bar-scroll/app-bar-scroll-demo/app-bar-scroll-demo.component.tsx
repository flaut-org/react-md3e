'use client';

import { useRef, useState } from 'react';
import { AppBar, Button } from '@flaut-travel/react-md3e';
import styles from '../app-bar-scroll.module.css';

export function AppBarScrollDemo() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [enabled, setEnabled] = useState(true);
  const [count, setCount] = useState(0);
  const [scrolled, setScrolled] = useState<boolean>();

  return (
    <section>
      <h2>Explicit scroll target and runtime changes</h2>
      <Button onClick={() => setEnabled((value) => !value)}>Toggle scroll behavior</Button>
      <Button onClick={() => setScrolled((value) => (value === undefined ? false : undefined))}>
        Toggle surface override
      </Button>
      <Button onClick={() => headerRef.current?.setAttribute('data-ref-checked', 'true')}>Check header ref</Button>
      <AppBar
        title="External scrolling"
        variant="mediumFlexible"
        position="static"
        ref={headerRef}
        scrollBehavior={enabled ? 'exitUntilCollapsed' : 'none'}
        scrollTarget={() => scrollRef.current}
        scrolled={scrolled}
        data-testid="external-scroll-bar"
        actions={<Button onClick={() => setCount((value) => value + 1)}>Count {count}</Button>}
      />
      <div className={styles.panel} data-testid="external-scroll-target" ref={scrollRef}>
        <div className={styles.content}>A different element owns this scroll position.</div>
      </div>
    </section>
  );
}
