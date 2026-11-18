import type { StyleObject } from '../style-object.types';

export const validStyles = {
  'display': 'flex',
  'padding': 12,
  '--accent': 'blue',
  '&:hover': { color: 'var(--accent)' },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  '@property --example-progress': { syntax: '"<percentage>"', inherits: 'true', initialValue: '0%' },
  '@keyframes fade': { from: { opacity: 0 }, to: { opacity: 1 } },
} satisfies StyleObject;

export const invalidProperty = {
  // @ts-expect-error Unknown properties must not be hidden by a catch-all string index.
  paddding: 12,
} satisfies StyleObject;
export const invalidValue = {
  // @ts-expect-error The position property has a constrained set of values.
  position: 'somewhere',
} satisfies StyleObject;
export const invalidNestedProperty = {
  '&:hover': {
    // @ts-expect-error Nested selectors use the same property validation.
    backgrounColor: 'red',
  },
} satisfies StyleObject;

export const invalidRegistration = {
  '@property --example-invalid': {
    syntax: '"<percentage>"',
    // @ts-expect-error Registration descriptors keep their own constrained types.
    inherits: 'sometimes',
    initialValue: '0%',
  },
} satisfies StyleObject;
