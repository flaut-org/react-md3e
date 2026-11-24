import { NavigationRail, NavigationItem } from '@flaut-travel/react-md3e/navigation-rail';

export const standardRailType = (
  <NavigationRail aria-label="Primary" expanded indicator="fullWidth" header="Header">
    <NavigationItem value="home">Home</NavigationItem>
  </NavigationRail>
);
export const modalRailType = (
  <NavigationRail
    variant="modal"
    aria-label="Primary"
    defaultOpen
    keepMounted
    onClose={(_event, reason) => reason !== 'swipe'}
  />
);
// @ts-expect-error Modal rails use open/defaultOpen; their content is always expanded.
export const invalidModalExpansion = <NavigationRail variant="modal" aria-label="Primary" expanded />;
// @ts-expect-error A baseline rail has no modal configuration.
export const invalidBaselineModal = <NavigationRail variant="modal" aria-label="Primary" appearance="baseline" />;
