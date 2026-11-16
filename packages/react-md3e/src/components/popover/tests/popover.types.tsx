import { createRef } from 'react';
import { Popover, PopoverClose } from '@flaut-org/react-md3e/popover';
import { Button } from '@flaut-org/react-md3e/button';

export const popover = (
  <Popover
    trigger={<Button>Open</Button>}
    aria-label="Options"
    placement="bottom-start"
    ref={createRef<HTMLDivElement>()}
    initialFocus={createRef<HTMLInputElement>()}
    onOpenChange={(open, event) => {
      event.preventDefault();

      return open;
    }}
  >
    <PopoverClose variant="filled">Done</PopoverClose>
  </Popover>
);
// @ts-expect-error a popup needs an accessible name.
export const unnamed = <Popover trigger={<Button>Open</Button>} />;
// @ts-expect-error the trigger is required for accessible interaction.
export const missingTrigger = <Popover aria-label="Options" />;
// @ts-expect-error placement is a finite side/alignment union.
export const invalidPlacement = <Popover trigger={<Button>Open</Button>} aria-label="Options" placement="diagonal" />;
