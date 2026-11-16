import { createRef } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { Typography } from '@flaut-travel/react-md3e/typography';
import type { TypographyProps } from '@flaut-travel/react-md3e/typography';
import { createTheme } from '@flaut-travel/react-md3e/theme';

function CustomLink({ to, children, ...props }: Omit<ComponentPropsWithRef<'a'>, 'href'> & { to: string }) {
  return (
    <a {...props} href={to}>
      {children}
    </a>
  );
}

export const text = (
  <Typography variant="bodyLarge" ref={createRef<HTMLSpanElement>()}>
    Text
  </Typography>
);
export const heading = (
  <Typography component="h1" variant="displaySmall" emphasized>
    Text
  </Typography>
);
export const anchor = (
  <Typography component="a" href="/" ref={createRef<HTMLAnchorElement>()} onClick={(event) => event.currentTarget.href}>
    Link
  </Typography>
);
export const custom = (
  <Typography component={CustomLink} to="/" ref={createRef<HTMLAnchorElement>()}>
    Link
  </Typography>
);
export const label = (
  <Typography component="label" htmlFor="email">
    Email
  </Typography>
);
export const themed = createTheme({
  typography: { bodyLarge: { fontSize: 18 }, bodyLargeEmphasized: { fontWeight: 600 } },
});
// @ts-expect-error native MD3 role names replace old h1/body1 variants.
export const oldVariant = <Typography variant="h1">Text</Typography>;
// @ts-expect-error emphasis selects the paired style, rather than doubling the variant catalog.
export const invalidVariant = <Typography variant="bodyLargeEmphasized">Text</Typography>;
// @ts-expect-error native span does not accept href.
export const defaultHref = <Typography href="/">Text</Typography>;

const buttonRef = createRef<HTMLButtonElement>();

// @ts-expect-error a button does not accept href.
export const buttonHref: TypographyProps<'button'> = { href: '/' };
// @ts-expect-error anchor refs must be anchor elements.
export const invalidRef: TypographyProps<'a'> = { ref: buttonRef };
// @ts-expect-error required custom-component props must be preserved.
export const missingCustomProp = <Typography component={CustomLink}>Text</Typography>;
// @ts-expect-error native theme roles, rather than arbitrary color strings.
export const invalidColor = <Typography color="red">Text</Typography>;
// @ts-expect-error no runtime styling layer.
export const runtimeStyles = <Typography sx={{ fontSize: 20 }}>Text</Typography>;
// @ts-expect-error TypeStyle fields stay typed through the theme entry.
export const invalidMetrics = createTheme({ typography: { bodyLarge: { fontSize: '18px' } } });
