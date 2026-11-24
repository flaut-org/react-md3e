import type { NavigationProps } from '../navigation/navigation.types';

export type NavigationBarProps = NavigationProps & {
  readonly variant?: 'flexible' | 'baseline';
  /** Auto changes to inline items at the compiled sm breakpoint (600px by default). */
  readonly iconPosition?: 'top' | 'start' | 'auto';
  readonly position?: 'static' | 'fixed' | 'sticky';
};
