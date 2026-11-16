import { createRef } from 'react';
import { TextField } from '@flaut-org/react-md3e/text-field';
import type { TextFieldControl } from '@flaut-org/react-md3e/text-field';

export const field = (
  <TextField
    ref={createRef<HTMLDivElement>()}
    inputRef={createRef<TextFieldControl>()}
    label="Name"
    variant="filled"
    onChange={(event) => event.target.value}
  />
);
export const multiline = <TextField label="Notes" multiline rows={3} />;
// @ts-expect-error standard is a legacy variant outside MD3.
export const invalidVariant = <TextField label="Name" variant="standard" />;
// @ts-expect-error MD2 size aliases are not supported.
export const invalidSize = <TextField label="Name" size="small" />;
