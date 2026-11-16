import type { ComponentPropsWithRef } from 'react';

/** Image-only media in this release. Alt is explicit, including empty alt for decorative images. */
export type CardMediaProps = Omit<ComponentPropsWithRef<'img'>, 'alt' | 'children'> & { readonly alt: string };
