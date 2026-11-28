import type { Page } from '@playwright/test';

/** Test-only fault injection. Never edits built assets, component source or baseline files. */
export async function injectKnownDefect(page: Page, id: string) {
  if (id === 'DP-001') {
    await page.evaluate(() => {
      for (const type of ['keydown', 'beforeinput', 'input']) {
        document.addEventListener(
          type,
          (event) => {
            if (event.target instanceof HTMLInputElement) {
              event.stopImmediatePropagation();
            }
          },
          true,
        );
      }
    });
  } else if (id === 'DP-002') {
    await page.evaluate(() => {
      document.querySelector('[data-md3-date-entry] button')!.addEventListener(
        'pointerdown',
        () => {
          const input = document.querySelector('input')!;

          input.focus();
          requestAnimationFrame(() => input.blur());
        },
        { capture: true },
      );
    });
  } else if (id === 'DP-003') {
    await page.addStyleTag({
      content: '[data-calendar-previous] { position: relative !important; grid-area: auto !important; }',
    });
  } else if (id === 'DP-004') {
    await page.addStyleTag({
      content: '[data-picker-content] { max-height: 160px !important; overflow: auto !important; }',
    });
  } else if (id === 'DP-005') {
    await page.addStyleTag({
      content: `
      tr[data-preview-first]::after { display: none !important; }
      td:has(button[data-preview='true'])::after {
        content: ''; position: absolute; inset: 4px 0; height: 40px;
        border-block: 1px dashed var(--md-sys-color-outline); pointer-events: none;
      }
    `,
    });
  } else {
    throw new Error(`Unknown isolated UI mutation: ${id}`);
  }
}
