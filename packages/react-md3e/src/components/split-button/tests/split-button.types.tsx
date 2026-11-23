import { SplitButton } from '@flaut-travel/react-md3e';
import { SplitButton as StandaloneSplitButton } from '@flaut-travel/react-md3e/split-button';
import { MenuItem } from '@flaut-travel/react-md3e/menu';

const menu = <MenuItem>Save a copy</MenuItem>;
const props = { menu, menuButtonLabel: 'More options', children: 'Save' };
const buttonRef = (element: HTMLButtonElement | null) => element?.focus();
const invalidMenu = { trigger: <button type="button">Other</button> };

export const valid = (
  <SplitButton
    menu={menu}
    menuButtonLabel="More save options"
    variant="tonal"
    size="extraLarge"
    onClick={(event) => event.currentTarget.checkValidity()}
    ref={(element: HTMLDivElement | null) => element?.focus()}
    buttonProps={{ type: 'submit', name: 'intent', value: 'save', ref: (element) => element?.focus() }}
    menuButtonProps={{ ref: (element) => element?.focus(), onClick: (event) => event.preventDefault() }}
    menuProps={{ layout: 'grouped', variant: 'vibrant', placement: 'top-end', ref: (element) => element?.focus() }}
    onOpenChange={(_open, event) => event.preventDefault()}
  >
    Save
  </SplitButton>
);
export const standalone = (
  <StandaloneSplitButton menu={menu} menuButtonLabel="More save options">
    Save
  </StandaloneSplitButton>
);
// @ts-expect-error SplitButton needs an accessible menu-button name.
export const missingName = <SplitButton menu={menu}>Save</SplitButton>;
// @ts-expect-error Related menu content is required.
export const missingMenu = <SplitButton menuButtonLabel="More options">Save</SplitButton>;
// @ts-expect-error Split buttons require visible containers.
export const textVariant = <SplitButton {...props} variant="text" />;
// @ts-expect-error MD2 names are not aliases for filled.
export const obsoleteVariant = <SplitButton {...props} variant="contained" />;
// @ts-expect-error The trailing button is a menu trigger, not a toggle selection.
export const selected = <SplitButton {...props} selected />;
// @ts-expect-error Menu trigger semantics cannot be replaced through menuProps.
export const alternateTrigger = <SplitButton {...props} menuProps={invalidMenu} />;
// @ts-expect-error The group ref is not a native button ref.
export const wrongRef = <SplitButton {...props} ref={buttonRef} />;
