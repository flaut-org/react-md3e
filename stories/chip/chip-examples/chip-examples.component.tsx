import { useState } from 'react';
import { Chip, ChipSet } from '@flaut-travel/react-md3e';

export function InputChips() {
  const [recipients, setRecipients] = useState(['Alex Morgan', 'Sam Rivera', 'Robin Chen']);

  return (
    <ChipSet aria-label="Email recipients">
      {recipients.map((label) => (
        <Chip
          kind="input"
          key={label}
          label={label}
          avatar={label.slice(0, 1)}
          onDelete={() => setRecipients((values) => values.filter((value) => value !== label))}
        />
      ))}
    </ChipSet>
  );
}

export function ExclusiveFilters() {
  const [selected, setSelected] = useState<string | null>('Any stops');

  return (
    <ChipSet aria-label="Number of stops">
      {['Any stops', 'Nonstop', 'One stop'].map((label) => (
        <Chip
          kind="filter"
          key={label}
          label={label}
          selected={selected === label}
          onSelectedChange={(_event, next) => setSelected(next ? label : null)}
          shape="expressive"
        />
      ))}
    </ChipSet>
  );
}
