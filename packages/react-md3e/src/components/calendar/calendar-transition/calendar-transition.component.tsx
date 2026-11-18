'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { calendarTransition } from '../calendar.styles';

interface CalendarTransitionProps {
  readonly transitionKey: string;
  readonly order: number;
  readonly reduceAnimations: boolean;
  readonly className?: string | undefined;
  readonly children: ReactNode;
}

/** Keep opaque adjacent month frames; CSS slides the full viewport without a fade. */
export function CalendarTransition({
  transitionKey,
  order,
  reduceAnimations,
  className,
  children,
}: CalendarTransitionProps) {
  const [frame, setFrame] = useState({
    key: transitionKey,
    order,
    children,
    previous: null as ReactNode,
    active: false,
    direction: 'forward',
  });

  if (frame.key !== transitionKey || frame.children !== children) {
    const changed = frame.key !== transitionKey;
    const direction = order < frame.order ? 'backward' : 'forward';

    setFrame({
      key: transitionKey,
      order,
      children,
      previous: changed ? frame.children : frame.previous,
      active: changed || frame.active,
      direction: changed ? direction : frame.direction,
    });
  }

  return (
    <div
      className={[calendarTransition, className].filter(Boolean).join(' ')}
      data-direction={frame.direction}
      data-reduce={reduceAnimations}
      data-active={frame.active}
      data-md3-calendar-transition=""
      role="presentation"
    >
      {frame.previous && (
        <div key={`previous-${frame.key}`} data-calendar-previous="" inert aria-hidden="true">
          {frame.previous}
        </div>
      )}
      <div
        key={transitionKey}
        data-calendar-current=""
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget && event.animationName.startsWith('md3-calendar-enter')) {
            setFrame((current) => ({ ...current, previous: null, active: false }));
          }
        }}
      >
        {children}
      </div>
    </div>
  );
}
