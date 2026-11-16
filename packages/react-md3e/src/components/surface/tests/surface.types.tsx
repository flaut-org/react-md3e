import { createRef } from 'react';
import { Surface } from '@flaut-org/react-md3e/surface';

export const surface = (
  <Surface
    component="article"
    ref={createRef<HTMLElement>()}
    shape="largeIncreased"
    color="primaryContainer"
    elevation={2}
  >
    Content
  </Surface>
);
export const defaultSurface = <Surface ref={createRef<HTMLDivElement>()} />;
// @ts-expect-error corners are MD3 scale roles.
export const badCorner = <Surface shape="rounded" />;
// @ts-expect-error arbitrary colors use consumer CSS, not the token API.
export const badColor = <Surface color="#ffffff" />;
// @ts-expect-error only the six MD3 elevation levels exist.
export const badElevation = <Surface elevation={8} />;
// @ts-expect-error structural container tags do not expose link semantics.
export const badElement = <Surface component="a" href="/trip" />;
// @ts-expect-error the native ref must match the default div.
export const badRef = <Surface ref={createRef<SVGSVGElement>()} />;
