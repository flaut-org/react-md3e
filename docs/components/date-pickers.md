# Date pickers and date entry

DatePicker and DateRangePicker combine the existing Calendar/RangeCalendar, TextField, Popover,
Dialog, Typography, Divider, Button and IconButton. DateField and DateRangeField provide the same
entry and validation behavior independently. All four are client components with server-rendered
fields; their overlay content mounts after hydration. ThemeProvider stays server-compatible.

```tsx
import { DateField, DatePicker, DateRangePicker } from '@flaut-travel/react-md3e';

<DatePicker label="Departure date" defaultValue="2026-11-26" />;
<DatePicker variant="modal" defaultMode="input" label="Date" />;
<DatePicker variant="docked" slotProps={{ textField: { variant: 'filled' } }} />;
<DateRangePicker label="Travel dates" fieldType="multi-input" name="trip" />;
<DateField label="Birthday" format="yyyy-MM-dd" />;
```

Each component also has its own subpath: `/date-field`, `/date-range-field`, `/date-picker`,
`/date-range-picker`. CSS loads automatically. The matching `/styles.css` subpaths are compatibility
entries. DateField's CSS does not load Calendar, Dialog, Popover or the other picker components.

## Dates, formats and localization

The [Calendar Temporal contract](calendar.md#values-and-time-zones) is unchanged: inputs are ISO strings
or supported Temporal objects, callbacks return Temporal.PlainDate, and `valueFormat="iso"` returns
ISO strings. A single empty value is null; an empty range is `[null, null]`. Native Date and adapter
objects are rejected. No Date bridge, Date.parse, UTC midnight conversion, polyfill or date-library
dependency is introduced. Native Temporal, Temporal-aware Intl and TypeScript 6 are required.

Locale defaults to en-US. Intl supplies Gregorian date order, separators and localized digits;
`format` can specify numeric `yyyy`, `MM`, `dd`, exactly once each, with punctuation separators.
`YYYY` and `DD` are accepted spellings for migration. Named months, two-digit years, time sections
and arbitrary date-library format languages are unsupported. Focusing an empty field shows a mask
such as `mm/dd/yyyy` and selects its first section. Digits replace that section and advance to the
next when complete; separators are inserted automatically. A single unambiguous month/day digit
also advances, so typing `3` yields `03/dd/yyyy`. Section order and separators follow locale/format,
including year-first formats. Single-input ranges advance through both endpoints.

Eight uninterrupted digits also work on numeric mobile keyboards. Paste accepts formatted dates,
uninterrupted digits, and replacement digits for a selected section. Backspace/Delete clears the
selected section; selecting all and deleting clears the date. Empty masks disappear on blur;
incomplete/invalid sections remain editable and never roll over to another date. Single-input ranges
use `date – date`; spaced hyphens and em dashes also separate endpoints. Multi-input fields use
separate native textboxes with the same mask.

English and Ukrainian UI/error strings are included. Other locales get localized date formatting
with English controls; override `localeText` to translate picker labels/actions, start/end labels,
Calendar navigation, and `error(code, expectedFormat)`. `weekStartsOn` uses ISO weekday 1–7 and otherwise
comes from Intl.Locale. `dir="rtl"` or an inherited direction controls the popup and calendar arrows.

Keep dates as PlainDate for date-only business data. Instants/offset timestamps require an explicit
IANA `timezone`; ZonedDateTime converts only when requested. `today` is captured at mount. Supply
`today` and `referenceDate` as application-created ISO strings across RSC or when server/client clocks
can differ. Formatting and arithmetic are independent of DST and the host time zone.

## Public API

| Props                                                    | Contract                                                                                            |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| value, defaultValue, valueFormat                         | Controlled/uncontrolled dates; same inputs and callback representation as Calendar                  |
| onChange(value, context)                                 | Reports field or calendar drafts, clearing and cancellation restoration                             |
| onAccept(value, context)                                 | Pickers only; reports final valid acceptance                                                        |
| onError(error, value)                                    | Reports validation-code changes, including recovery to null                                         |
| context                                                  | validationError, source (`field`, `calendar`, `clear`, `cancel`, `accept`), optional selectionState |
| variant                                                  | Pickers: responsive (default), docked, modal; standalone fields use filled/outlined                 |
| open, defaultOpen, onOpen, onClose                       | Controlled/uncontrolled picker visibility; onClose receives a reason                                |
| closeOnSelect                                            | Defaults to true for docked, false for modal; false shows Cancel/OK in docked panels                |
| defaultMode                                              | calendar (default) or input; modal header switches modes                                            |
| fullScreen                                               | Overrides automatic modal full-screen layout; calendar fit still controls mode                      |
| label, required, disabled, readOnly, autoFocus           | TextField conventions; readOnly permits calendar navigation                                         |
| error, helperText, placeholder, inputRef, ref            | TextField presentation/native input ref; ref targets the field wrapper                              |
| slotProps.textField                                      | Picker TextField appearance, adornments and native attributes, including filled/outlined            |
| format, locale, localeText, timezone, today              | Entry/localization/date interpretation described above                                              |
| minDate, maxDate                                         | Inclusive; Calendar defaults of 1900-01-01 and 2099-12-31                                           |
| disablePast, disableFuture                               | Compared with the captured or supplied today                                                        |
| shouldDisableDate, shouldDisableMonth, shouldDisableYear | Shared synchronous validation; coarse predicates receive first-of-month/year                        |
| clearable                                                | Shows a localized clear action; required empty values cannot be accepted                            |
| name, form                                               | Native form association; values submit as ISO strings                                               |
| container                                                | Existing themed Dialog/Popover portal container contract                                            |
| reduceAnimations                                         | Calendar and mode-entry opt-out; reduced-motion preferences also apply                              |

DatePicker forwards Calendar's `views`, `view`, `openTo`, `onViewChange`, `onMonthChange`,
`onYearChange`, `monthsPerRow`, `yearsPerRow`, `yearsOrder`, day `slots`/`slotProps.day`, week
configuration, outside days, today highlighting and loading presentation. The Calendar day slot
still must forward button refs, events, ARIA and tabIndex. Field slots do not replace the grid.

DateRangePicker and DateRangeField take two nullable endpoints. `fieldType` is single-input by default
or multi-input. `startLabel`/`endLabel` override localized field labels. RangeCalendar's `rangePosition`,
`defaultRangePosition`, `onRangePositionChange`, day slots, loading, week props,
`disableAutoMonthSwitching` and `disableDragEditing` are available on DateRangePicker. `calendars` selects
1–3 docked panels; range modals use three vertically stacked months with previous/next windows.
`shouldDisableDate(day, position)` validates endpoints independently. Equal endpoints are valid;
disabled interior days do not invalidate a range. Partial or reversed manual ranges remain visible
with an error until corrected. Calendar selection of an end before the start begins a new partial
range, following RangeCalendar's established behavior.

## Drafts, confirmation and forms

Open pickers keep a saved opening value, a current draft, and the field's raw text/parser state
separately. `onChange` publishes draft changes; `onAccept` publishes final confirmation. Only valid,
complete values can be accepted. Cancel, Escape and outside dismissal restore the saved value;
when a controlled parent has echoed a draft, cancellation emits `onChange(saved, { source: 'cancel',
validationError: ... })` so the parent restores it too. Cancellation never calls onAccept. Direct
controlled prop updates do not synthesize open/close callbacks. An external value change that is
not an echo of onChange resets the session's draft and saved baseline.

```tsx
'use client';
import { useState } from 'react';
import { DatePicker } from '@flaut-travel/react-md3e';

export function Departure() {
  const [date, setDate] = useState<string | null>(null);

  return (
    <DatePicker
      label="Departure"
      value={date}
      valueFormat="iso"
      onChange={setDate}
      onAccept={(accepted) => console.log('Confirmed', accepted)}
      variant="modal"
    />
  );
}
```

Calendar/month/year changes do not erase partial field text on every render. Choosing a date resets
the raw entry to that valid date. Switching modal modes preserves the current valid draft and retains
incomplete text in the hidden, inert input panel. The grid retains the last parsable draft while
text is incomplete/invalid; acceptance stays disabled until the input is corrected or a day is chosen. Hidden inputs are excluded from keyboard navigation.

Visible fields use localized text; hidden controls supply ISO form values. Single values use `name`;
ranges use `name.start` and `name.end`, independently overridable by `startName`/`endName`. Standalone
fields submit their current canonical value. Pickers submit their saved value while editing an
uncontrolled overlay; on acceptance it updates. A controlled parent's echoed value is authoritative
for form serialization. Native custom validity blocks invalid, incomplete or required empty entry.
Uncontrolled fields/pickers restore defaultValue on native form reset; controlled values stay owned
by the caller. No synthetic change/accept callback is fired by reset.

## Presentation and accessibility

Responsive selection uses pointer/hover capability and available viewport size, never User-Agent.
Docked behavior needs a fine hover-capable pointer, at least the default sm breakpoint (600px)
and 480px height; other environments use modal. SSR uses a stable modal snapshot, then subscribes
to matchMedia after hydration. The width condition uses the shared default breakpoint
scale; runtime theme CSS overrides do not rewrite behavioral media conditions. Explicit variant
overrides the pointer-based choice. A docked panel additionally needs room for every requested
360px-wide month and the full 416px calendar height, actions when present, and viewport gutters.
If that space is unavailable, even an explicit docked variant falls back to a modal.

A range modal fills a compact viewport. A short viewport uses a full-screen modal; if even that
cannot fit a full calendar plus its header/actions, the picker uses input mode and disables the
calendar switch until space returns. `fullScreen` can override the automatic modal layout, but a
constrained non-full-screen modal still uses input mode when its calendar cannot fit. These fit
checks use the standard component dimensions and matchMedia, without measuring or scaling days.

Popover owns positioning, viewport collision, scrolling updates, focus return and dismissal.
Docked pickers use its shift strategy: the full panel moves within the viewport and can overlap
its anchor when neither side has enough room. The single-month grid never becomes a scroll area
or shrinks to the space between the field and a screen edge, including inside Dialog.
Dialog owns modal focus containment, background inertness, scroll locking and dynamic viewport layout.
Both use their existing themed portal hierarchy, including nested dialogs. No second positioning
engine or calendar focus trap exists. The picker role is dialog rather than an alert. Alt+ArrowDown
on the field opens it; its icon uses native Enter/Space activation. Focusing the icon does not focus
the input or float an empty field's label. Calendar retains roving day focus,
arrows, Home/End, PageUp/Down, Shift+PageUp/Down, Enter/Space and polite month announcements. Mode
switching moves focus to the active input/grid. Native textbox selection, deletion, paste and
replacement work; left/right arrows select adjacent numeric sections and up/down adjust a valid
section without changing other sections: February 29 with a non-leap year remains invalid until
corrected. This remains a native textbox, rather than MUI's multi-spinbutton section DOM.

Modal ranges have a task header, selected endpoints, a scrollable vertical three-month window,
previous/next-window controls, input-mode switch and persistent Cancel/OK actions. Scrolling belongs
to this month list, while each individual month grid retains its full layout. Navigation can
cross years; keyboard navigation shares RangeCalendar's coordinated focus. This bounded web layout
does not implement Android's unbounded lazy month list or touch-fling physics. Screen-keyboard
behavior relies on Dialog's dynamic viewport support; real mobile keyboard testing is not claimed.

The container references surfaceContainerHigh, onSurface, extraLarge corners, Dialog level-3 or
Popover elevation and their spring enter/exit motion. Calendar owns existing 48px targets, 40px day
circles, primary endpoints, secondaryContainer range bands, today/disabled/hover/focus/pressed states
and the requested page-slide choreography. Header/entry/action insets are 24/24/12px; header minimum
height is 120px. New scoped overrides are `--md-date-picker-container-color`,
`--md-date-picker-container-shape`, `--md-date-picker-container-width`,
`--md-date-picker-header-height`, `--md-date-picker-headline-color`. Typography, buttons, fields,
theme color/contrast and reduced/forced-color modes reuse existing system tokens. No runtime styles
or mandatory theme/localization provider are introduced.

## MUI X migration and limits

Replace the import, remove adapter/LocalizationProvider wiring, and convert adapter values to ISO or
Temporal.PlainDate. `onChange={setValue}` remains valid. Use `onAccept` for persistence, and account for
the explicit cancel restoration event. Picker `variant` selects presentation; field appearance moves
to `slotProps.textField.variant`. Use DateRangeField's fieldType instead of separate SingleInput and
MultiInput components. These features have no commercial tier or MUI runtime dependency.

This is an intentionally bounded API. It has no adapter format language, sx, MUI theme overrides,
field section DOM/selectedSections API, arbitrary toolbar/action-bar/desktop-paper slots, shortcuts,
alternate calendar systems, time selection or Android lazy-list gestures. onClose receives a reason,
not a MUI event. Invalid typed dates report null plus a validation code, since Temporal cannot
represent an Invalid Date. Calendar's existing callback signature stays unchanged.

## References and evidence

Reviewed 2026-11-26:

- Google [overview](https://m3.material.io/components/date-pickers/overview),
  [guidelines](https://m3.material.io/components/date-pickers/guidelines),
  [specs](https://m3.material.io/components/date-pickers/specs) and
  [accessibility](https://m3.material.io/components/date-pickers/accessibility) require JavaScript in
  the text browser. Their content was not treated as inspected measurements.
- Readable [official Compose guidance](https://developer.android.com/develop/ui/compose/components/datepickers)
  and [Material Components Android DatePicker documentation](https://github.com/material-components/material-components-android/blob/master/docs/components/DatePicker.md):
  docked, modal/input/range anatomy, draft confirmation and input toggle.
- [AndroidX DatePickerModalTokens v0_210](https://android.googlesource.com/platform/frameworks/support/%2B/562af10d597c12bedfed92fa489ccaea56309999/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/DatePickerModalTokens.kt)
  and the [previous Calendar sources](calendar.md#sources-and-verification): numeric measurements and
  semantic role references. The web index exposed token excerpts; the full pinned file was not
  retrievable during this change. No Android or MUI implementation source was copied.
- MUI X v9.18 documentation: [DatePicker](https://mui.com/x/react-date-pickers/date-picker/),
  [DateRangePicker](https://mui.com/x/react-date-pickers/date-range-picker/),
  [DateField](https://mui.com/x/react-date-pickers/date-field/),
  [range fields](https://mui.com/x/react-date-pickers/date-range-field/),
  [Calendar](https://mui.com/x/react-date-pickers/date-calendar/),
  [validation](https://mui.com/x/react-date-pickers/validation/),
  [lifecycle](https://mui.com/x/react-date-pickers/lifecycle/),
  [picker API](https://mui.com/x/api/date-pickers/date-picker/) and
  [range API](https://mui.com/x/api/date-pickers/date-range-picker/): API/behavior references only.
- WAI-ARIA [datepicker dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
  and [grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/): grid/focus/keyboard semantics.

Follow-up behavior reviewed 2026-11-27: the supplied m3e field screenshot and both screen recordings,
MUI's [field editing documentation](https://mui.com/x/react-date-pickers/fields/), and
[Base UI Popover](https://base-ui.com/react/components/popover) with installed 1.9.0 positioning
types/source. The native-textbox section mask and the full-panel shift/modal fallback are independent
web adaptations. No upstream mask or positioning implementation was copied.

Colocated tests and `/date-pickers` cover entry, validation, controlled/uncontrolled selection,
confirmation/cancellation, form values/reset, viewport behavior, nested overlays, focus, SSR,
streaming, light/dark, localization and accessibility. Storybook has separate groups for all four
components and keeps standalone Calendar/RangeCalendar examples. Screenshot artifacts check local
layout only. Figma access/parity, other browser engines, physical touch keyboards and exhaustive
assistive-technology combinations remain unverified.
