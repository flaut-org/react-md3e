# Calendar and RangeCalendar

Inline Material calendars with native Temporal date arithmetic, Intl localization and extracted CSS.
They render directly in the page, without fields, dialogs, popovers, confirmation actions or an
adapter/provider. Both are client components for selection, keyboard focus and navigation, with
server-rendered HTML. ThemeProvider remains server-compatible.

```tsx
import { Calendar, RangeCalendar } from '@flaut-travel/react-md3e';
import '@flaut-travel/react-md3e/calendar/styles.css';
import '@flaut-travel/react-md3e/range-calendar/styles.css';

<Calendar defaultValue="2026-11-18" locale="uk-UA" />;
<RangeCalendar defaultValue={['2026-11-18', '2026-12-04']} calendars={2} />;
```

The range stylesheet includes Calendar and its IconButton/ripple dependencies. Importing only that
stylesheet is sufficient when using both. Theme CSS is still a separate application-level import.
Exports are available from the root, `/calendar` and `/range-calendar`; `/calendar` also exports
CalendarDay for day-slot composition. No MUI implementation or date-library runtime is included.

## Values and time zones

Inputs accept ISO strings, Temporal.PlainDate, PlainDateTime, ZonedDateTime and Instant. Date-only
inputs use the Gregorian/ISO calendar; other Temporal calendar annotations are converted to the
equivalent ISO date. Native Date, numeric timestamps and arbitrary date-like objects are rejected.
Invalid ISO dates throw rather than rolling into another month.

Callbacks return Temporal.PlainDate by default. Set `valueFormat="iso"` to receive ISO date strings:

```tsx
'use client';

import { useState } from 'react';
import { Calendar, RangeCalendar } from '@flaut-travel/react-md3e';
import type { RangeCalendarValue } from '@flaut-travel/react-md3e';

export function Dates() {
  const [date, setDate] = useState<string | null>(null);
  const [range, setRange] = useState<RangeCalendarValue<'iso'>>([null, null]);

  return (
    <>
      <Calendar value={date} valueFormat="iso" onChange={setDate} />
      <RangeCalendar value={range} valueFormat="iso" onChange={setRange} />
    </>
  );
}
```

Every callback date is normalized to a date, even when its input contains a time. A PlainDate or
PlainDateTime keeps its date regardless of `timezone`. A ZonedDateTime keeps its own date by default;
an explicit IANA `timezone` converts it first. Instant and offset/Z ISO timestamp strings require an
explicit timezone because their calendar date is otherwise ambiguous. For example,
`value="2024-03-01T01:30Z" timezone="America/Los_Angeles"` selects February 29. `UTC` is supported;
MUI's adapter-specific `default`/`system` aliases are not interpreted.

Date arithmetic and Intl.DateTimeFormat operate directly on PlainDate, with no Date bridge, UTC
conversion or default formatting timezone. The default `today` is the system's current local date,
captured at mount; an explicit timezone is used for this clock lookup when supplied. Provide `today`
and `referenceDate` as ISO strings from the application when server/client clocks or local dates may
differ. For RSC boundaries, pass ISO strings: Temporal instances are not React-serializable props.
Calendar's empty controlled value is `null`; RangeCalendar's is `[null, null]`.

Native Temporal, Temporal-aware Intl.DateTimeFormat and Intl.Locale.getWeekInfo are required.
The pinned Node 26 runtime and tested Chromium support them. Applications targeting older runtimes
must install a compatible global Temporal/Intl polyfill before rendering; imports never patch globals
or bundle a polyfill. Published types preserve the TypeScript `esnext.temporal` lib reference and are
verified with TypeScript 6 under NodeNext and Bundler resolution.

## Calendar API

The selection/validation names follow MUI DateCalendar where they fit this library:

| Props                                 | Contract/default                                                                           |
| ------------------------------------- | ------------------------------------------------------------------------------------------ |
| value, defaultValue, onChange         | Controlled/uncontrolled date; `onChange(value, selectionState, selectedView)`              |
| valueFormat                           | temporal (default) or iso; affects callback representation                                 |
| views, view, openTo, onViewChange     | day/month/year views; defaults to `['year', 'day']` and day                                |
| onYearChange, onMonthChange           | Normalized PlainDate; month changes report its first day                                   |
| minDate, maxDate                      | Inclusive bounds, default 1900-01-01 through 2099-12-31                                    |
| disablePast, disableFuture            | Limit selection relative to today                                                          |
| shouldDisableDate/Month/Year          | Synchronous PlainDate predicates; month/year receive their first day                       |
| readOnly, disabled                    | readOnly permits navigation and focus; disabled prevents interaction                       |
| autoFocus                             | Focus the current view's active enabled date on mount                                      |
| onFocusedViewChange                   | `(view, hasFocus)` when focus enters/leaves the calendar                                   |
| locale                                | Intl locale; deterministic en-US default                                                   |
| localeText                            | Override previousMonth, nextMonth, calendarLabel, loading, weekNumber and switchView(view) |
| weekStartsOn                          | ISO weekday 1–7; defaults to Intl.Locale's first day                                       |
| dayOfWeekFormatter                    | `(PlainDate) => string`; Intl narrow weekday by default                                    |
| showDaysOutsideCurrentMonth           | false; display adjacent dates in complete weeks when true                                  |
| fixedWeekNumber                       | Minimum row count 1–6; always retain every day in the month                                |
| displayWeekNumber                     | Show ISO week numbers, based on the Thursday in each row                                   |
| disableHighlightToday                 | Remove the visual today outline; aria-current remains accurate                             |
| loading, renderLoading                | Replace the view with a status region; preserve the navigation header                      |
| reduceAnimations                      | Disable month/view transitions; CSS reduced-motion preferences always take priority        |
| monthsPerRow, yearsPerRow, yearsOrder | 3/4 columns, default 3; ascending/descending years                                         |
| currentMonth                          | Optional controlled displayed month for application composition                            |
| focusedDate, onFocusedDateChange      | Optional controlled grid focus for coordinated calendars                                   |
| slots.day, slotProps.day              | Replace/decorate a day; static props or function of CalendarDayState                       |
| classes                               | root, header, viewTransitionContainer and day class names                                  |

The root div forwards its ref, native attributes, style and className. `aria-label` names the calendar
group; the grid is named by its live month heading. `aria-multiselectable`, when supplied, belongs to
the grid. Buttons have localized full-date names, and weekday headers expose their full names.
Use `dir="rtl"` or an inherited RTL direction for layout and keyboard mirroring.

Selecting a year/month retains the selected day where possible (February 29 becomes February 28
in a common year), finds a valid date within that choice, emits `partial`, and advances to the next
enabled finer view. The final configured view emits `finish`. Navigating or focusing a day never
changes the value. Disabled-day predicates may be called repeatedly for rendering and focus searches;
keep them inexpensive and use month/year predicates for coarse restrictions.

Day slots receive CalendarDayProps, including the normalized day, selection/today/outside/disabled
state and range/preview state where applicable. Forward the supplied ref, events, tabIndex and ARIA
attributes to the actual button, usually by composing CalendarDay. `slotProps.day` handlers run before
built-in handlers and can veto them with preventDefault. Slot props cannot enable a date disabled by
validation. Put date availability in shouldDisableDate so keyboard searches can skip it as well.

## RangeCalendar API

RangeCalendar renders Calendar instances and supplies their shared controlled display, focus,
selection and day-slot decoration. It does not maintain a second calendar grid implementation.
It shares Calendar's date bounds, localization, loading, motion and day customization props.

| Props                                                      | Contract/default                                                                       |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| value, defaultValue, onChange                              | Two nullable endpoints; `onChange(range, selectionState, 'day')`                       |
| calendars                                                  | 1, 2 (default), or 3 panels; wrap to the available width                               |
| currentMonthCalendarPosition                               | 1 (default), 2 or 3; must fit the panel count                                          |
| rangePosition, defaultRangePosition, onRangePositionChange | Controlled/uncontrolled start/end editing; start default                               |
| availableRangePositions                                    | Editable endpoints; `['start', 'end']` by default                                      |
| shouldDisableDate                                          | `(day, 'start'                                                                         | 'end') => boolean` |
| disableAutoMonthSwitching                                  | false; choosing a start can reveal an existing offscreen end                           |
| disableDragEditing                                         | false; mouse/pen dragging edits existing endpoints; touch uses day taps                |
| referenceDate                                              | A date or pair of reference dates; the first non-null reference anchors an empty range |
| currentMonth                                               | Optional controlled anchor month, positioned by currentMonthCalendarPosition           |
| view, views, openTo                                        | day only                                                                               |

Choosing a start advances to end with `partial`. A valid end completes the range with `finish` and
returns editing to start. An end before the start begins a new partial range, with that date as its
start. Equal endpoints are a valid one-day range. Choosing a start after an existing end clears the
end. A single available endpoint finishes that edit immediately. Reversed externally supplied ranges
are rejected. shouldDisableDate validates selectable endpoints; disabled interior days do not split
or invalidate an otherwise valid range, matching MUI's endpoint-validation convention.

The interior uses secondaryContainer/onSecondaryContainer and endpoints use primary/onPrimary.
Hover previews use a dashed outline. Dragging commits on pointerup and cancels on pointercancel;
dragging across the other endpoint follows the same ordered-range rules as a click. Range edits and
previews respect readOnly/disabled. Multi-panel calendars hide duplicate outside days and expose one
roving day tab stop across the group. Arrow keys move between already-visible panels before shifting
the displayed window. Header navigation leaves a day available for subsequent keyboard entry.

This is a deliberately bounded MUI-style API. It does not include sx, MUI theme overrides/classes,
adapter/LocalizationProvider APIs, arbitrary header/navigation/year/month slots, focusedView control,
pickers or text fields. Callback values are normalized dates, rather than adapter-specific objects.

## Material appearance, motion and accessibility

Calendar has a 360px layout with 12px horizontal padding and no background, elevation or rounded
container. RangeCalendar is likewise transparent. Applications choose their own enclosing Surface,
Card, plain page background or custom styles. The explicit WithSurface Storybook examples demonstrate
that composition; the default examples have no wrapper surface. The controls use 56px navigation,
48px day targets, 40px circular dates, bodyLarge labels, primary selected dates and
a 1px primary today outline. Month/year choices use 72×36px visual capsules inside at least 48px
targets. The day view reserves six weeks of space so month transitions do not resize the surface;
fixedWeekNumber controls the actual rendered rows. It omits the modal-only title, headline, elevation and action areas.
Range bands are 40px high and join through each week; month columns are a web adaptation of the
native range calendar's layout. Month selection is an additional MUI-style web view.

Single-calendar headings align at the inline start; both navigation buttons align at the inline end.
In multi-panel ranges, each heading is centered above its own grid. Only the first panel exposes the
previous button at its outer edge, and only the last exposes the next button at its outer edge.
A one-panel range uses the ordinary single-calendar header.

Month changes follow the supplied MUI recording and m3e's full-width page-slide choreography.
The outgoing and incoming date grids stay opaque and adjacent, moving by 100% of one calendar's
viewport. Weekday headings and navigation remain stationary. Timing matches MUI's 375ms complex
duration with cubic-bezier(0.35, 0.8, 0.4, 1), rather than a short fade or an overshooting spring.
This explicitly requested paging behavior is an exception to the generic theme spring mapping.
Override `--md-calendar-slide-duration` and `--md-calendar-slide-easing` together for custom timing.
CSS logical positioning preserves inherited RTL even when consumer tooling lowers direction selectors
to language selectors. No animation engine or rule generation runs in the browser.
One outgoing frame is inert, aria-hidden and removed after the slide; rapid navigation replaces it. The incoming
frame alone accepts focus and interaction. Reduced motion and reduceAnimations hide the outgoing
frame and remove transitions. Hover/press state layers use compiled CSS. Interrupted motion does
not preserve physical velocity, consistent with the existing motion contract.

The calendar grid follows APG navigation: arrows move days/weeks (horizontal direction mirrors in
RTL), Home/End move to the locale week's boundaries, PageUp/Down move months, Shift+PageUp/Down move
years, and Enter/Space select. Disabled dates are skipped. Month/year choices have radio semantics
and arrow/Home/End navigation. Focus is visible in ordinary and forced-color modes; there is no
focus trap. Forced colors retain distinct endpoint selection, range bands, preview boundaries and
today/focus outlines.

## Sources and verification

Read on 2026-11-18:

- User-supplied `Screen Recording 2026-11-18 at 21.11.40.mov`, inspected through extracted video frames:
  opaque neighboring month grids slide horizontally while navigation and weekday headings stay fixed.
- [MUI PickersSlideTransition](https://github.com/mui/mui-x/blob/7b70c2f4579d26d171441d54a09b22872eedfda1/packages/x-date-pickers/src/DateCalendar/PickersSlideTransition.tsx):
  100% entry/exit, no opacity transition, and cubic-bezier(0.35, 0.8, 0.4, 1).
- [MUI DayCalendar](https://github.com/mui/mui-x/blob/da5b9d3c4f8100047f3117d2d859de4813359ad6/packages/x-date-pickers/src/DateCalendar/DayCalendar.tsx)
  keeps weekday headings outside the slide; [MUI createTransitions](https://github.com/mui/material-ui/blob/422ac96720b78e518581095b6806d958003fdb3f/packages/mui-material/src/styles/createTransitions.js)
  defines the complex duration as 375ms.
- [m3e CalendarElement](https://github.com/matraic/m3e/blob/cc92803fec273d686f041a0e406a8017fb4a6f39/packages/web/src/calendar/CalendarElement.ts)
  and [live calendar](https://matraic.github.io/m3e/#/components/calendar.html): adjacent full-width
  views using logical -100% / 0 / 100% positions and monotonic timing. These are choreography and
  numerical references; no upstream implementation code was copied or bundled.

- [Google date picker overview](https://m3.material.io/components/date-pickers/overview),
  [specifications](https://m3.material.io/components/date-pickers/specs) and
  [official Android date picker guidance](https://developer.android.com/develop/ui/compose/components/datepickers).
  Material's website requires JavaScript; the readable Android guidance and pinned tokens provide
  the implementation references for the embedded calendar anatomy.
- [AndroidX DatePickerModalTokens.kt](https://github.com/androidx/androidx/blob/009564af4f3f92df06e213711cb5327ceabc4e47/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/DatePickerModalTokens.kt),
  token version v0_210, and [DatePicker.kt](https://github.com/androidx/androidx/blob/009564af4f3f92df06e213711cb5327ceabc4e47/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/DatePicker.kt)
  at the same revision. Numerical dimensions/color/typography roles only; no AndroidX implementation
  code was copied. Expressive motion uses the already-pinned sources in [motion.md](../motion.md).
- [Google Material 3 Figma kit](https://www.figma.com/community/file/1035203688168086460/material-3-design-kit):
  direct access was denied by robots.txt. No Figma-node inspection or pixel-perfect parity is claimed.
- MUI [DateCalendar](https://mui.com/x/react-date-pickers/date-calendar/),
  [API](https://mui.com/x/api/date-pickers/date-calendar/),
  [DateRangeCalendar](https://mui.com/x/react-date-pickers/date-range-calendar/) and
  [API](https://mui.com/x/api/date-pickers/date-range-calendar/): API/behavior reference only; no
  MUI X source, including its commercial range implementation, was copied.
- [Temporal PlainDate](https://tc39.es/proposal-temporal/docs/plaindate.html) and
  [APG calendar grid keyboard guidance](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/).
  Only the grid navigation applies; these components do not implement a modal dialog.
- Installed Base UI 1.9.0 Button and the library's IconButton provide applicable button semantics.
  Base UI has no public date-calendar primitive in this version, so date arithmetic, grid semantics
  and roving date focus belong to Calendar.

`/calendars`, `/streaming` and the Components/Calendar and Components/RangeCalendar Storybook entries
exercise the built public package and granular CSS. Colocated unit/type/browser checks cover date
validation, leap/DST/zone boundaries, ISO and Temporal values, locale weeks, selection, keyboard
focus, range composition/dragging, motion, reduced motion, forced colors, server HTML, refs and
accessibility. Package validation checks the CSS dependency closure and preserved client boundaries.
Browser verification is Chromium; other engines and assistive-technology combinations remain unverified.
