'use client';

import { useRef, useState } from 'react';
import { Badge, Button, IconButton } from '@flaut-travel/react-md3e';

export function BadgeDemo() {
  const [count, setCount] = useState(5);
  const [invisible, setInvisible] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const [refs, setRefs] = useState('Unchecked');

  return (
    <section>
      <h2>Controlled count and visibility</h2>
      <div className="fixture-row">
        <IconButton
          variant="standard"
          aria-label={`Inbox, ${count > 999 ? '999+' : count} unread messages`}
          aria-describedby={count > 999 ? 'changing-badge-count' : undefined}
          onClick={() => setCount(0)}
        >
          <Badge
            badgeContent={count}
            invisible={invisible}
            ref={rootRef}
            slotProps={{ badge: { ref: indicatorRef, title: 'Unread messages' } }}
            data-testid="changing-badge"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M3 4h18v16H3zm2 3v2l7 4 7-4V7l-7 4z" />
            </svg>
          </Badge>
        </IconButton>
        <span id="changing-badge-count" hidden>
          {count} unread messages in total
        </span>
        <Button onClick={() => setCount((value) => value + 1000)}>Add messages</Button>
        <Button onClick={() => setCount(0)}>Clear messages</Button>
        <Button onClick={() => setInvisible((value) => !value)}>Toggle badge</Button>
        <Button
          onClick={() => {
            setRefs(rootRef.current?.contains(indicatorRef.current) ? 'Refs connected' : 'Missing refs');
          }}
        >
          Check refs
        </Button>
        <output data-testid="badge-refs">{refs}</output>
      </div>
    </section>
  );
}
