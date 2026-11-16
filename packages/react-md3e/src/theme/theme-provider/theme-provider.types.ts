import type { ComponentPropsWithRef } from 'react';
import type { ColorSchemePreference, Theme } from '../theme.types';

export interface ThemeProviderProps extends ComponentPropsWithRef<'div'> {
  readonly theme?: Theme;
  readonly colorScheme?: ColorSchemePreference;
}
