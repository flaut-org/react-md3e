# Dialog

A controlled MD3 modal built on Base UI Dialog. Compose the familiar DialogTitle, DialogContent,
DialogContentText, and DialogActions parts. The modal owns focus and dismissal behavior; its CSS is
compiled at build time and inherits ThemeProvider tokens without client theme context.

```tsx
'use client';

import { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@flaut-travel/react-md3e';
import '@flaut-travel/react-md3e/styles.css';

export function SaveCollection() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Save collection</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Save this collection?</DialogTitle>
        <DialogContent>
          <DialogContentText>Keep your favorite journeys together.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="text" onClick={() => setOpen(false)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
```

All five components and their types are also available from `@flaut-travel/react-md3e/dialog`. Import
the stylesheet once at the application root. Dialog uses consumer-provided action buttons rather
than adding English text or an implicit close control.

## API

| Dialog prop                                        | Contract                                                                                                        |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `open`                                             | Required controlled boolean                                                                                     |
| `onClose(event, reason)`                           | Request to close, with native Event and backdropClick / escapeKeyDown                                           |
| `fullScreen`                                       | Full viewport layout; default false; use for compact-screen tasks                                               |
| `fullWidth`                                        | Fill the available width up to the MD3 maximum; default false                                                   |
| `scroll`                                           | paper (default): content scrolls, title/actions remain pinned; body: portal viewport scrolls                    |
| `keepMounted`                                      | Retain hidden DOM and form state after closing; default false                                                   |
| `disableEscapeKeyDown`                             | Suppress Escape close requests; default false                                                                   |
| `initialFocus`, `finalFocus`                       | Boolean or React ref to an HTMLElement; default Base UI focus behavior                                          |
| `container`                                        | Portal host HTMLElement or callback returning one; null selects the default scope                               |
| `role`                                             | alertdialog by default for basic prompts, dialog for full-screen tasks; explicitly choose dialog for rich forms |
| `ref`, `className`, `style`, native div/ARIA props | Apply to the popup surface                                                                                      |

`onClose` never changes `open` for the consumer. Ignore a request to veto it, or update application
state to close. Explicit Cancel, Save, or close-icon actions update state themselves, as in MUI;
they do not synthesize a backdrop or Escape reason. The modal always has `aria-modal="true"`.

| Part              | Behavior                                                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| DialogTitle       | Native h2 registered with Base UI to name the modal; optional decorative icon above the headline                 |
| DialogContent     | Scrollable body; dividers adds optional boundaries                                                               |
| DialogContentText | Native p registered as the accessible description                                                                |
| DialogActions     | Trailing actions, 8px gap; wrapped/stacked layouts place the confirming action visually above dismissive actions |

Parts accept native DOM props, className/style, and React 19 refs. Render one DialogTitle and one
short DialogContentText description per modal, or supply explicit aria-label / aria-labelledby /
aria-describedby on Dialog. Use ordinary paragraphs and sections for additional or complex content
so it is not announced as one long description. DialogTitle's icon is decorative, 24px, and uses
secondary; with an icon the basic headline is centered.

Place dismissive actions before confirming actions in DOM order. Actions wrap onto reversed rows
when space is insufficient; stacked forces that vertical layout for longer labels. There are no MUI maxWidth breakpoint aliases, slots/slotProps, transition components, runtime
sx, non-modal mode, or gesture handling in this implementation.

## Theme, portal, and server boundary

The default portal host is the nearest DOM ThemeProvider scope or containing Base UI portal. Without
either it uses document.body. A hidden anchor resolves that host after hydration, once all DOM refs have attached; CSS variables,
color-scheme, custom fonts, and live theme changes inherit through the DOM. No styles are read or
copied and no style rules are generated. Explicit dir wins over an inherited dir attribute.

A custom container controls the DOM theme and stacking scope. If it is outside the original theme,
place it inside the intended ThemeProvider or give it a static theme CSS class. A scope that creates
a clipping/transform/containment boundary can constrain its portal; choose an unconstrained themed
host in that case. The portal establishes z-index 1300, above the default AppBar layer.

Dialog, DialogTitle, and DialogContentText are client components for Base UI context, IDs, and
interaction. DialogContent and DialogActions remain server-compatible presentation components.
Server pages can compose all parts and pass server-rendered content through the Dialog boundary,
including from Suspense. Portal contents mount in the browser after hydration, even when open is
initially true; a modal is not visible server HTML. keepMounted retains browser DOM after closing
and does not make a portal render on the server. Styling never introduces the client boundary.

## Focus, dismissal, scrolling, and motion

Base UI traps focus, makes background content unavailable, locks page scrolling, and restores focus
to the opener when closed. The first interactive element receives initial focus; Base UI focuses
the popup for touch activation where appropriate. initialFocus/finalFocus can target specific refs.
For lengthy outside-scrolling content, explicitly focus a title with tabIndex={-1} or the popup ref
to keep its beginning visible. Always provide a labeled dismissive action or close icon.

Escape requests closure unless disabled. Outside presses request closure; a pointer drag beginning
inside the popup does not count as a backdrop click. The caller can veto either request. Nested
confirmation dialogs work through Base UI; MD3 recommends them above full-screen task dialogs.
Closing the child restores focus to its opener while the parent remains modal.

Basic layout has 280–560px width bounds, clamped to the available viewport, 28px themed extraLarge
corners, surfaceContainerHigh, headlineSmall/onSurface, bodyMedium/onSurfaceVariant, and level-3
shadow. The scrim uses the scrim role at 32%. Inner insets are 24px, headline/body and icon/headline
gaps are 16px. Compact viewport margins are 24px; at 600px and above the outer margins are 56px.

Full-screen layout has no corners or shadow, occupies the viewport, and uses a 56px title row and
bottom action row. Supply a leading close IconButton in DialogTitle, as shown in Storybook. The
consumer selects the variant at its breakpoint; no JavaScript media observer is installed.
Full-screen layout always scrolls its body internally and keeps title/actions available.

Opacity and a small scale/translation transition are compiled CSS: 200ms entry transform, 150ms
opacity/exit. These are web adaptations of the documented enter/exit pattern, not container-transform
or velocity-preserving spring implementations. Reduced motion disables transitions. Forced colors
keep a visible surface boundary. No animation loop or styling runtime is included.

## Sources and verification

Read on 2026-11-15:

- [Official Dialog specifications](https://m3.material.io/components/dialogs/specs),
  [guidelines](https://m3.material.io/components/dialogs/guidelines), and
  [accessibility](https://m3.material.io/components/dialogs/accessibility), rendered in a browser:
  basic/full-screen appearance, measurements, focus, roles, action order, and scroll behavior.
- [AndroidX DialogTokens.kt at revision 89d9aa6a5b9fc6e4847002be42f3c6891b091c9e](https://github.com/androidx/androidx/blob/89d9aa6a5b9fc6e4847002be42f3c6891b091c9e/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/DialogTokens.kt),
  token version v0_210; ScrimTokens.kt v0_117 and AlertDialog.kt at the same revision. The current
  dialog token family retains its basic MD3 appearance; no new Expressive-only variant is invented.
- [Base UI Dialog](https://base-ui.com/react/components/dialog) and installed version 1.9.0 source:
  modal behavior, focus, portals, transition lifecycle, and nested dialog handling.

Measurements and web motion are independently adapted. No MUI or AndroidX implementation source was
copied. Figma parity and testing outside Chromium are not claimed. Automated checks cover keyboard,
theme inheritance, native form submission, nested focus, dismissal veto, keepMounted, scrolling,
streamed server composition, Storybook, and accessibility.
