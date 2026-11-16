import { Divider } from '@flaut-travel/react-md3e/divider';

export const vertical = <Divider orientation="vertical" flexItem decorative />;
// @ts-expect-error MD3 divider variants are explicit.
export const invalid = <Divider variant="dashed" />;
