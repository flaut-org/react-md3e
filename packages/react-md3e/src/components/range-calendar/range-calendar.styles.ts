import { css } from '@linaria/core';
import type { StyleObject } from '../../styles/style-object.types';

const rootStyles = {
  'display': 'flex',
  'flexWrap': 'wrap',
  'alignItems': 'flex-start',
  'inlineSize': 'fit-content',
  'maxInlineSize': '100%',
  '& > [data-md3-calendar]': { flexShrink: 0 },
  "&:not([data-calendars='1']) > [data-md3-calendar] [data-calendar-header]": {
    gridTemplateColumns: '48px minmax(0, 1fr) 48px',
    paddingInlineStart: 0,
  },
  "&:not([data-calendars='1']) > [data-md3-calendar] [data-calendar-heading]": {
    gridColumn: 2,
    textAlign: 'center',
  },
  "&:not([data-calendars='1']) > [data-md3-calendar] [data-calendar-previous-button]": { gridColumn: 1 },
  '& > [data-md3-calendar]:not(:first-child) [data-calendar-previous-button]': { visibility: 'hidden' },
  '& > [data-md3-calendar]:not(:last-child) [data-calendar-next-button]': { visibility: 'hidden' },
  '&[data-dragging="true"]': { userSelect: 'none', cursor: 'grabbing' },
} satisfies StyleObject;

export const rangeCalendarRoot = css`
  ${rootStyles}
`;
