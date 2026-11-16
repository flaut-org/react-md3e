# Source imports and ESM output

Owned JS/TS source imports and re-exports omit file extensions, including type-only imports:

```ts
import { useRipple } from '../../internal/hooks/use-ripple.hook';
import type { ButtonProps } from './button.types';
export { Button } from './components/button';
```

CSS and JSON assets keep their extensions. Package imports such as `react`,
`@base-ui/react/button`, and `@flaut-org/react-md3e/theme` keep their public entry names.
ESLint's `import-x/extensions` enforces the convention, including type imports.

## Build and consumers

TypeScript uses `moduleResolution: Bundler` for source checking. Vite resolves extensionless
files and directory indexes, extracts CSS, and writes real `.js` module paths to the distributed
JavaScript while preserving client directives.

Raw `tsc` declaration emit retains source module specifiers. After that step,
`scripts/finalize-declarations.mjs` parses each `.d.ts` with the installed TypeScript compiler API
and resolves relative code imports against the emitted declaration tree. It writes explicit ESM
paths, including `/index.js` for directory imports. The pass handles imports, exports, import types,
module references, and augmentations; package names and CSS/JSON assets are left as authored.
Unresolved relative code imports fail the build.

Thus source code uses `./button.types`, while a declaration can use `./button.types.js` and
TypeScript resolves it to `button.types.d.ts`. Consumers receive ready JS, CSS, and declarations;
they do not need a compiler plugin or a custom runtime resolver.

Directly executed Node scripts use `node:` built-ins and public package imports. The source
extensionless convention does not enable extension searching in native Node ESM.

## Verification

`npm run typecheck` includes public package consumer checks in `packages/react-md3e/tests/types-consumer`:

- NodeNext module resolution with `skipLibCheck: false`.
- Bundler module resolution with the same strict declaration checks.
- An expected type error verifies that invalid MD2 button variants are rejected.

`npm run check:package` imports distributed JavaScript in Node and inspects the actual UI module
graph. Production Next/Turbopack and Storybook builds validate RSC/client boundaries and CSS
consumption. Build before standalone lint/type checks; `npm run check` orders these steps.

References:
[TypeScript library bundling considerations](https://www.typescriptlang.org/docs/handbook/modules/guides/choosing-compiler-options.html#considerations-for-bundling-libraries)
and [compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API).
