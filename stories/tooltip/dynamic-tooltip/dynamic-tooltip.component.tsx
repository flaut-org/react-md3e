import { useState } from 'react';
import { Button, Tooltip } from '@flaut-travel/react-md3e';

export function DynamicTooltip() {
  const [count, setCount] = useState(0);

  return (
    <Tooltip
      variant="rich"
      headline="Live allowance"
      title={<span>Additional baggage: {count} kg</span>}
      actions={
        <Button variant="text" onClick={() => setCount((value) => value + 1)}>
          Add a kilogram
        </Button>
      }
    >
      <Button>Hover or focus for current allowance</Button>
    </Tooltip>
  );
}
