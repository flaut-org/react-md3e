'use client';

import { useState } from 'react';
import { Button, IconButton, Popover, PopoverClose, Radio, RadioGroup } from '@flaut-org/react-md3e';

export function PassengerPickerDemo() {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabin, setCabin] = useState('Economy');
  const rows = [
    { label: 'Adults', description: 'Older than 12 years', count: adults, minimum: 1, setCount: setAdults },
    { label: 'Children', description: 'From 2 to 12 years', count: children, minimum: 0, setCount: setChildren },
    { label: 'Infants', description: 'Younger than 2 years', count: infants, minimum: 0, setCount: setInfants },
  ];

  return (
    <>
      <Popover
        aria-label="Passengers and cabin"
        trigger={
          <Button variant="tonal">
            Passengers: {adults + children + infants} · {cabin}
          </Button>
        }
        style={{ inlineSize: 360 }}
      >
        <div className="passenger-picker-content">
          <h2>Passengers</h2>
          {rows.map((row) => (
            <div className="passenger-picker-row" key={row.label}>
              <div>
                <strong>{row.label}</strong>
                <p>{row.description}</p>
              </div>
              <div className="passenger-picker-counter">
                <IconButton
                  variant="outlined"
                  aria-label={`Decrease ${row.label.toLowerCase()}`}
                  disabled={row.count === row.minimum}
                  onClick={() => row.setCount(row.count - 1)}
                >
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M5 11h14v2H5z" />
                  </svg>
                </IconButton>
                <output aria-label={`${row.label} count`} aria-live="polite">
                  {row.count}
                </output>
                <IconButton
                  variant="outlined"
                  aria-label={`Increase ${row.label.toLowerCase()}`}
                  disabled={row.count === 9}
                  onClick={() => row.setCount(row.count + 1)}
                >
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M11 5h2v14h-2zM5 11h14v2H5z" />
                  </svg>
                </IconButton>
              </div>
            </div>
          ))}
          <hr />
          <RadioGroup aria-label="Cabin" value={cabin} onChange={(_event, next) => setCabin(next)}>
            {['Economy', 'Premium economy', 'Business', 'First class'].map((option) => (
              <label key={option} className="passenger-picker-cabin">
                <Radio value={option} />
                {option}
              </label>
            ))}
          </RadioGroup>
          <div className="passenger-picker-actions">
            <PopoverClose variant="text">Done</PopoverClose>
          </div>
        </div>
      </Popover>
      <p data-testid="passenger-selection">
        {adults + children + infants} / {cabin}
      </p>
    </>
  );
}
