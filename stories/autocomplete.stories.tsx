import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import { Autocomplete, TextField } from '@flaut-travel/react-md3e';
import type { AutocompleteProps } from '@flaut-travel/react-md3e';

const cities = ['Paris', 'Rome', 'Kyiv', 'São Paulo', 'Helsinki'];
const meta = {
  title: 'Components/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  args: { label: 'Destination', options: cities },
  parameters: {
    docs: {
      description: {
        component:
          'Selection autocomplete built from TextField and Base UI Combobox, sharing Expressive Menu surfaces, options and unfolding motion. Supports independent selected/input values, object equality, single/multiple selection, scoped portals, filtering, loading and empty states. renderInput must preserve TextField slot props, refs, input ID and adornments.',
      },
    },
  },
} satisfies Meta<AutocompleteProps<string>>;

export default meta;
type Story = StoryObj<AutocompleteProps<string>>;
export const Playground: Story = {};
export const Filled: Story = { args: { variant: 'filled' } };
export const WithValue: Story = { args: { defaultValue: 'Paris' } };
export const LongOptions: Story = {
  args: { fullWidth: true, options: Array.from({ length: 40 }, (_value, index) => `Destination ${index + 1}`) },
};
export const AutoHighlight: Story = { args: { autoHighlight: true, openOnFocus: true } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Paris' } };
export const ReadOnly: Story = { args: { readOnly: true, defaultValue: 'Paris' } };
export const Error: Story = { args: { error: true, helperText: 'Choose a destination' } };
export const RightToLeft: Story = { args: { dir: 'rtl', label: 'الوجهة', options: ['القاهرة', 'عمان'] } };
export const Multiple: Story = {
  render: () => (
    <Autocomplete
      multiple
      label="Visited cities"
      options={cities}
      defaultValue={['Paris', 'Rome']}
      filterSelectedOptions
    />
  ),
};
export const ObjectOptions: Story = {
  render: () => (
    <Autocomplete
      label="Destination"
      options={[
        { code: 'PAR', name: 'Paris' },
        { code: 'ROM', name: 'Rome' },
      ]}
      getOptionLabel={(option) => option.name}
      getOptionKey={(option) => option.code}
      getOptionValue={(option) => option.code}
      renderInput={(params) => <TextField {...params} InputProps={{ ...params.InputProps, startAdornment: '✈' }} />}
    />
  ),
};

function ControlledExample() {
  const [value, setValue] = useState<string | null>('Paris');
  const [query, setQuery] = useState('Paris');

  return (
    <>
      <Autocomplete
        label="Destination"
        options={cities}
        value={value}
        onChange={(_event, next) => setValue(next)}
        inputValue={query}
        onInputChange={(_event, next) => setQuery(next)}
      />
      <p>Selected: {value ?? 'none'}</p>
      <p>Query: {query}</p>
    </>
  );
}

export const Controlled: Story = { render: () => <ControlledExample /> };

function AsyncExample() {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <Autocomplete
      label="Search destinations"
      options={options}
      loading={loading}
      filterOptions={(entries) => entries}
      onInputChange={(_event, query, reason) => {
        if (reason === 'input') {
          clearTimeout(timer.current);
          setLoading(true);
          timer.current = setTimeout(() => {
            setOptions(cities.filter((city) => city.toLowerCase().includes(query.toLowerCase())));
            setLoading(false);
          }, 250);
        }
      }}
    />
  );
}

export const AsyncSearch: Story = { render: () => <AsyncExample /> };

export const SelectOnFocus: Story = { args: { defaultValue: 'Paris', selectOnFocus: true } };
export const ClearOnEscape: Story = { args: { defaultValue: 'Paris', clearOnEscape: true } };
