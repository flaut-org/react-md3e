import { Tooltip } from '@flaut-travel/react-md3e/tooltip';

export const hint = (
  <Tooltip title="Help" placement="bottom-start" onOpenChange={(_open, event) => event.preventDefault()}>
    <button type="button">Action</button>
  </Tooltip>
);
// @ts-expect-error A renderable element is needed for trigger composition.
export const invalid = <Tooltip title="Help">text</Tooltip>;

export const rich = (
  <Tooltip
    variant="rich"
    headline={<strong>Details</strong>}
    title={<>Allowance: {0} kg</>}
    actions={<button type="button">Review</button>}
  >
    <button type="button">Details</button>
  </Tooltip>
);
export const namedRich = (
  <Tooltip variant="rich" aria-label="Details" title={<div>Details</div>} persistent>
    <button type="button">Open</button>
  </Tooltip>
);
export const formattedPlain = (
  <Tooltip title={[<strong key="one">Formatted</strong>, 0]} disableInteractive arrow>
    <button type="button">Action</button>
  </Tooltip>
);
export const unnamedRich = (
  // @ts-expect-error Rich tooltips need an explicit accessible name or headline.
  <Tooltip variant="rich" title="Details">
    <button type="button">Open</button>
  </Tooltip>
);
export const plainActions = (
  // @ts-expect-error Plain tooltips cannot contain an actions slot.
  <Tooltip title="Help" actions={<button type="button">Action</button>}>
    <button type="button">Open</button>
  </Tooltip>
);
export const inaccessibleRich = (
  // @ts-expect-error Rich actions must remain interactive and reachable.
  <Tooltip variant="rich" headline="Details" title="Help" disableInteractive>
    <button type="button">Open</button>
  </Tooltip>
);
