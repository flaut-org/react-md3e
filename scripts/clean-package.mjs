import { rm } from 'node:fs/promises';

// Resolve from this script rather than the shell's working directory.
await rm(new URL('../packages/react-md3e/dist/', import.meta.url), {
  recursive: true,
  force: true,
});
