import { themeScope } from './theme-provider.styles';
import type { ThemeProviderProps } from './theme-provider.types';

/** A CSS scope, not React context. Supports RSC, nested themes, and CSS-only system mode. */
export function ThemeProvider({
  theme,
  colorScheme = 'system',
  className,
  style,
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <div
      {...props}
      className={[themeScope, className].filter(Boolean).join(' ')}
      data-md3-theme=""
      data-color-scheme={colorScheme}
      style={theme ? { ...theme.cssVariables, ...style } : style}
    >
      {children}
    </div>
  );
}
