import { css } from '@linaria/core';
import { typeScale, colorRoles } from '../../tokens/material-tokens';
import { color, typography } from '../../styles/theme-tokens';
import type { TypeScaleRole } from '../../theme/theme.types';
import type { StyleObject } from '../../styles/style-object.types';

const variants = Object.fromEntries(
  Object.keys(typeScale).flatMap((name) => {
    const role = name as TypeScaleRole;

    return [
      [`&[data-variant='${role}']`, typography(role)],
      [`&[data-variant='${role}'][data-emphasized='true']`, typography(role, true)],
    ];
  }),
) as Record<`&${string}`, StyleObject>;
const colors = Object.fromEntries(
  colorRoles.map((role) => [`&[data-color='${role}']`, { color: color(role) } satisfies StyleObject]),
) as Record<`&${string}`, StyleObject>;
const alignments = Object.fromEntries(
  (['left', 'center', 'right', 'justify', 'start', 'end'] as const).map((align) => [
    `&[data-align='${align}']`,
    { textAlign: align } satisfies StyleObject,
  ]),
) as Record<`&${string}`, StyleObject>;
const rootStyles = {
  'margin': 0,
  'color': 'inherit',
  'textAlign': 'inherit',
  ...variants,
  ...colors,
  ...alignments,
  "&[data-variant='inherit']": {
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    fontWeight: 'inherit',
    letterSpacing: 'inherit',
  },
  "&[data-no-wrap='true']": { minInlineSize: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
} satisfies StyleObject;

export const typographyRoot = css`
  ${rootStyles}
`;
