import { css } from '@linaria/core';
import type { StyleObject } from '../../styles/style-object.types';

import defaultTheme from '../default-theme.generated.json';

// Linaria evaluates this object at build time; only the class name remains in UI JS.
const themeScopeStyles = {
  ...defaultTheme.cssVariables,
  'colorScheme': 'light dark',
  'color': 'var(--md-sys-color-on-surface)',
  'backgroundColor': 'var(--md-sys-color-surface)',
  'fontFamily': 'var(--md-sys-typescale-body-large-font)',
  "&[data-color-scheme='light']": { colorScheme: 'light' },
  "&[data-color-scheme='dark']": { colorScheme: 'dark' },
} satisfies StyleObject;

export const themeScope = css`
  ${themeScopeStyles}
`;
