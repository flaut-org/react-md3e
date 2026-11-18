export type IndicatorColor = 'primary' | 'secondary' | 'tertiary' | 'inherit';

/** Every non-decorative progressbar needs an application-provided accessible name. */
export type IndicatorLabel =
  | { readonly 'aria-label': string; readonly 'aria-labelledby'?: string }
  | { readonly 'aria-labelledby': string; readonly 'aria-label'?: string }
  | { readonly 'aria-hidden': true; readonly 'aria-label'?: string; readonly 'aria-labelledby'?: string };
