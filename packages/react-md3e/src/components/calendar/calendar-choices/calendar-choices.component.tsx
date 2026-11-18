'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { useEffect, useRef, useState } from 'react';
import { calendarChoices } from '../calendar.styles';

interface CalendarChoice {
  readonly date: Temporal.PlainDate;
  readonly label: string;
  readonly selected: boolean;
  readonly disabled: boolean;
}

interface CalendarChoicesProps {
  readonly items: readonly CalendarChoice[];
  readonly columns: number;
  readonly label: string;
  readonly active: number;
  readonly readOnly: boolean;
  readonly onSelect: (date: Temporal.PlainDate) => void;
}

export function CalendarChoices({ items, columns, label, active, readOnly, onSelect }: CalendarChoicesProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const preferred = focused ?? active;
  const focusIndex =
    items[preferred] && !items[preferred].disabled ? preferred : items.findIndex((item) => !item.disabled);

  useEffect(() => {
    const group = groupRef.current;
    const button = group?.querySelector<HTMLElement>('[tabindex="0"]');

    if (group && button) {
      group.scrollTop = button.offsetTop - group.clientHeight / 2 + button.clientHeight / 2;
    }
  }, []);

  return (
    <div
      ref={groupRef}
      className={calendarChoices}
      role="radiogroup"
      aria-label={label}
      aria-readonly={readOnly || undefined}
      data-columns={columns}
    >
      {items.map((item, index) => (
        <BaseButton
          key={item.date.toString()}
          type="button"
          role="radio"
          aria-checked={item.selected}
          disabled={item.disabled}
          tabIndex={index === focusIndex ? 0 : -1}
          data-calendar-choice={index}
          onFocus={() => setFocused(index)}
          onClick={() => onSelect(item.date)}
          onKeyDown={(event) => {
            const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
            let step = 0;
            let target = index;

            switch (event.key) {
              case 'ArrowLeft':
                step = rtl ? 1 : -1;
                break;
              case 'ArrowRight':
                step = rtl ? -1 : 1;
                break;
              case 'ArrowUp':
                step = -columns;
                break;
              case 'ArrowDown':
                step = columns;
                break;
              case 'Home':
                target = 0;
                step = 1;
                break;
              case 'End':
                target = items.length - 1;
                step = -1;
                break;
              default:
                return;
            }

            event.preventDefault();

            if (event.key !== 'Home' && event.key !== 'End') {
              target += step;
            }

            while (target >= 0 && target < items.length && items[target]?.disabled) {
              target += step;
            }

            groupRef.current?.querySelector<HTMLElement>(`[data-calendar-choice="${target}"]`)?.focus();
          }}
        >
          {item.label}
        </BaseButton>
      ))}
    </div>
  );
}
