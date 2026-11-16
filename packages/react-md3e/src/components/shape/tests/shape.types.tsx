import { createRef } from 'react';
import { Shape, shapeVariants } from '@flaut-org/react-md3e/shape';
import type { ShapeVariant } from '@flaut-org/react-md3e';

export const shape = (
  <Shape
    variant="flower"
    color="secondaryContainer"
    aria-label="Flower illustration"
    ref={createRef<HTMLDivElement>()}
  />
);
export const names: readonly ShapeVariant[] = shapeVariants;
// @ts-expect-error only the official catalog names exist.
export const badShape = <Shape variant="cookie" />;
// @ts-expect-error this shape uses the official 9-sided name.
export const badCookie = <Shape variant="cookie9" />;
// @ts-expect-error custom dimensions use CSS, not an arbitrary size enum.
export const badSize = <Shape size="huge" />;
// @ts-expect-error Shape owns decorative/illustration semantics.
export const interactiveShape = <Shape role="button" />;

export const staticShape = <Shape morph={false} variant="pixelCircle" />;
// @ts-expect-error morph is an explicit boolean opt-out, not a runtime animation configuration.
export const invalidMorph = <Shape morph="spring" />;
