import { Autocomplete } from '@flaut-travel/react-md3e/autocomplete';
import { TextField } from '@flaut-travel/react-md3e/text-field';

const options = [{ code: 'PAR', name: 'Paris' }];

export const single = (
  <Autocomplete
    options={options}
    label="City"
    getOptionLabel={(option) => option.name}
    onChange={(_event, option) => option?.code}
    renderInput={(params) => <TextField {...params} />}
  />
);
export const multiple = (
  <Autocomplete
    multiple
    options={options}
    label="Cities"
    getOptionLabel={(option) => option.name}
    onChange={(_event, values) => values.map((option) => option.code)}
  />
);
// @ts-expect-error multiple value must be an array.
export const invalidMultiple = <Autocomplete multiple options={['Paris']} value="Paris" />;
// @ts-expect-error single value must be an option or null.
export const invalidSingle = <Autocomplete options={['Paris']} value={['Paris']} />;
// @ts-expect-error value cannot widen the inferred option type.
export const wrongOption = <Autocomplete options={options} value="Paris" />;
// @ts-expect-error arbitrary text creation is a separate future adapter.
export const freeSolo = <Autocomplete options={['Paris']} freeSolo />;
