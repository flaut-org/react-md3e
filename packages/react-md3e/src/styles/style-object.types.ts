import type { Properties } from 'csstype';

type Variables = Readonly<Record<`--${string}`, string | number>>;
type NestedSelector = `&${string}` | `@media ${string}` | `@supports ${string}` | `@container ${string}`;
type Keyframes = Readonly<Partial<Record<'from' | 'to' | `${number}%`, Properties<string | number> & Variables>>>;

/** Build-time authoring only: known CSS properties, variables, nesting, and keyframes. */
export type StyleObject = Properties<string | number> &
  Variables & {
    readonly [selector in NestedSelector]?: StyleObject;
  } & { readonly [animation in `@keyframes ${string}`]?: Keyframes };
