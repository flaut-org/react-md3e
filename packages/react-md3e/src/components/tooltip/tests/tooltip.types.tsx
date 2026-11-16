import { Tooltip } from '@flaut-travel/react-md3e/tooltip';

export const hint = (
  <Tooltip title="Help" placement="bottom-start" onOpenChange={(_open, event) => event.preventDefault()}>
    <button type="button">Action</button>
  </Tooltip>
);
// @ts-expect-error A renderable element is needed for trigger composition.
export const invalid = <Tooltip title="Help">text</Tooltip>;
