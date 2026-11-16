import { Collapsible } from '@flaut-travel/react-md3e/collapsible';

export const disclosure = (
  <Collapsible
    trigger={<button type="button">More</button>}
    keepMounted
    onOpenChange={() => false}
    panelProps={{ 'aria-label': 'Details' }}
  >
    Details
  </Collapsible>
);
// @ts-expect-error Trigger must support element composition.
export const invalid = <Collapsible trigger="More" />;
