import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const searchName = 'Search destinations';

test('focus opens a named modal, traps focus, closes on Escape and restores the persistent bar', async ({ page }) => {
  await page.goto('/search');

  const bar = page.getByTestId('controlled-search').locator('[data-md3-search-input]');

  await bar.focus();

  const view = page.getByRole('dialog', { name: searchName, exact: true });

  await expect(view).toBeVisible();
  await expect(view).toHaveAttribute('aria-modal', 'true');
  await expect(view.getByRole('searchbox')).toBeFocused();
  await expect(bar).toHaveAttribute('aria-controls', 'destination-search-view');
  await expect(bar).not.toHaveAttribute('aria-expanded');
  await page.keyboard.press('Shift+Tab');
  await expect(view.getByRole('button', { name: 'Back', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(view.getByRole('button', { name: 'Check search refs' })).toBeFocused();
  expect(await page.evaluate(() => getComputedStyle(document.body).overflowY)).toBe('hidden');
  await page.keyboard.press('Escape');
  await expect(view).toHaveCount(0);
  await expect(bar).toBeFocused();
  await expect(page.getByTestId('search-close-reason')).toHaveText('escapeKeyDown');
  await page.getByTestId('controlled-search').locator('[data-md3-search-leading] > svg').click();
  await view.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(view).toHaveCount(0);
  await expect(page.getByTestId('search-close-reason')).toHaveText('backButtonClick');
});

test('freeform query, clear, controlled updates and result selection preserve one persistent value', async ({
  page,
}) => {
  await page.goto('/search');

  const bar = page.getByTestId('controlled-search').locator('[data-md3-search-input]');

  await bar.click();

  const view = page.getByRole('dialog', { name: searchName, exact: true });

  await view.getByRole('searchbox').fill('po');
  await expect(page.getByTestId('search-query')).toHaveText('po');
  await expect(view.getByRole('button', { name: 'Porto', exact: true })).toBeVisible();
  await expect(view.getByRole('button', { name: 'Paris', exact: true })).toHaveCount(0);
  await view.getByRole('button', { name: 'Clear search' }).click();
  await expect(view.getByRole('searchbox')).toHaveValue('');
  await expect(page.getByTestId('search-change-reason')).toHaveText('clear');
  await expect(view.getByRole('searchbox')).toBeFocused();
  await view.getByRole('button', { name: 'Porto', exact: true }).click();
  await expect(view).toHaveCount(0);
  await expect(bar).toHaveValue('Porto');
  await expect(bar).not.toBeFocused();
  await page.getByRole('button', { name: 'Set query from code' }).click();
  await expect(bar).toHaveValue('Rome');
  await page.getByRole('button', { name: 'Open search from code' }).click();
  await expect(view.getByRole('searchbox')).toHaveValue('Rome');
  await view.getByRole('button', { name: 'Check search refs' }).click();
  await expect(view).toHaveAttribute('data-ref-checked', 'true');
  await expect(view.getByRole('searchbox')).toHaveAttribute('data-ref-checked', 'true');
  await expect(bar).toHaveAttribute('data-ref-checked', 'true');
  await expect(page.locator('[data-md3-search]').first()).toHaveAttribute('data-ref-checked', 'true');
});

test('typing, paste and keyboard activation reopen restored search without dropping input or submitting', async ({
  page,
}) => {
  await page.goto('/search');

  const bar = page.getByTestId('controlled-search').getByRole('searchbox');
  const view = page.getByRole('dialog', { name: searchName, exact: true });

  await bar.click();
  await view.getByRole('searchbox').fill('Rome');
  await page.keyboard.press('Escape');
  await expect(view).toHaveCount(0);
  await expect(bar).toBeFocused();
  await bar.press('End');
  await page.keyboard.type('!');
  await expect(view.getByRole('searchbox')).toHaveValue('Rome!');
  await expect(view.getByRole('searchbox')).toBeFocused();
  await expect(page.getByTestId('search-query')).toHaveText('Rome!');
  await page.keyboard.press('Escape');
  await expect(view).toHaveCount(0);
  await bar.press('Enter');
  await expect(view.getByRole('searchbox')).toBeFocused();
  await expect(page.getByTestId('search-submitted')).toHaveText('');
  await page.keyboard.press('Escape');
  await expect(view).toHaveCount(0);
  await bar.evaluate((input) => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'Pasted query');
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertFromPaste', data: 'Pasted query' }));
  });
  await expect(view.getByRole('searchbox')).toHaveValue('Pasted query');
  await page.keyboard.press('Escape');
  await expect(view).toHaveCount(0);
  await bar.press('End');
  await page.keyboard.type(' ');
  await expect(view.getByRole('searchbox')).toHaveValue('Pasted query ');
});

test('IME composition in a restored field commits before focus moves to the expanded input', async ({ page }) => {
  await page.goto('/search');

  const bar = page.getByTestId('controlled-search').getByRole('searchbox');
  const view = page.getByRole('dialog', { name: searchName, exact: true });

  await bar.click();
  await page.keyboard.press('Escape');
  await expect(view).toHaveCount(0);
  await bar.dispatchEvent('compositionstart', { data: '' });
  await bar.evaluate((input) => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, '東京');
    input.dispatchEvent(
      new InputEvent('input', { bubbles: true, inputType: 'insertCompositionText', data: '東京', isComposing: true }),
    );
  });
  await expect(view).toHaveCount(0);
  await expect(bar).toBeFocused();
  await bar.dispatchEvent('compositionend', { data: '東京' });
  await expect(view.getByRole('searchbox')).toHaveValue('東京');
  await expect(view.getByRole('searchbox')).toBeFocused();
});

test('pointer Back and click-away end editing; keyboard dismissal restores an actionable search field', async ({
  page,
}) => {
  await page.goto('/components');

  const bar = page.getByTestId('bar-search').getByRole('searchbox');
  const view = page.getByRole('dialog', { name: 'Search collection', exact: true });

  await bar.click();
  await view.getByRole('searchbox').fill('Draft');
  await view.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(view).toHaveCount(0);
  await expect(bar).not.toBeFocused();
  await page.keyboard.type('ignored');
  await expect(bar).toHaveValue('Draft');
  await expect(view).toHaveCount(0);
  await bar.click();
  await expect(view.getByRole('searchbox')).toHaveValue('Draft');
  await page.mouse.click(1, 1);
  await expect(view).toHaveCount(0);
  await expect(bar).not.toBeFocused();
  await bar.click();
  await page.keyboard.press('Escape');
  await expect(view).toHaveCount(0);
  await expect(bar).toBeFocused();
  await bar.press('ArrowDown');
  await expect(view.getByRole('searchbox')).toBeFocused();
});

test('Enter submits through the form once and moves focus to results; composing Enter stays in input', async ({
  page,
}) => {
  await page.goto('/search');
  await page.getByRole('searchbox', { name: searchName, exact: true }).click();

  const view = page.getByRole('dialog', { name: searchName, exact: true });
  const field = view.getByRole('searchbox');

  await field.fill('Rome');
  await field.dispatchEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true });
  await expect(page.getByTestId('search-submitted')).toHaveText('');
  await expect(field).toBeFocused();
  await page.locator('#destination-search-form').evaluate((form) => {
    form.setAttribute('data-submit-count', '0');
    form.addEventListener('submit', () =>
      form.setAttribute('data-submit-count', String(Number(form.getAttribute('data-submit-count')) + 1)),
    );
  });
  await field.press('Enter');
  await expect(page.getByTestId('search-submitted')).toHaveText('Rome');
  await expect(page.getByTestId('search-form-value')).toHaveText('Rome');
  await expect(page.locator('#destination-search-form')).toHaveAttribute('data-submit-count', '1');
  await expect(view.getByRole('region', { name: 'Search results' })).toBeFocused();
});

test('arrow keys enter result actions, skip disabled controls, and return to the query', async ({ page }) => {
  await page.goto('/search');
  await page.getByRole('searchbox', { name: searchName, exact: true }).click();

  const view = page.getByRole('dialog', { name: searchName, exact: true });

  await view.getByRole('searchbox').press('ArrowDown');
  await expect(view.getByRole('button', { name: 'Paris', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(view.getByRole('searchbox')).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(view.getByRole('button', { name: 'Check search refs' })).toBeFocused();
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowDown');
  await expect(view.getByRole('button', { name: 'Porto', exact: true })).toBeFocused();
  await page.keyboard.press('End');
  await expect(view.getByRole('button', { name: 'Check search refs' })).toBeFocused();
});

test('loading, result announcements, empty results, retained state and native form reset work', async ({ page }) => {
  await page.goto('/search');
  await page.getByRole('searchbox', { name: searchName, exact: true }).click();

  const view = page.getByRole('dialog', { name: searchName, exact: true });

  await expect(view.getByRole('status')).toHaveText('5 destinations');
  await view.getByRole('button', { name: 'Toggle loading' }).click();
  await expect(view.getByRole('progressbar')).toHaveAccessibleName('Searching…');
  await expect(view.locator('[data-md3-search-results]')).toHaveAttribute('aria-busy', 'true');
  await expect(view.getByRole('status')).toHaveText('Searching…');
  expect(await view.getByRole('status').evaluate((node) => node.closest('[aria-busy="true"]') !== null)).toBe(false);
  await view.getByRole('button', { name: 'Toggle loading' }).click();
  await view.getByRole('searchbox').fill('unknown city');
  await expect(view.getByText('No destinations found')).toBeVisible();
  await expect(view.getByRole('status')).toHaveText('0 destinations');
  await page.keyboard.press('Escape');

  const retained = page.getByRole('dialog', { name: 'Retained search', exact: true });

  await page.getByRole('searchbox', { name: 'Retained search', exact: true }).click();
  await retained.getByRole('searchbox').fill('Changed query');
  await retained.getByRole('textbox', { name: 'Retained note' }).fill('Changed note');
  await retained.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(retained).toHaveCount(0);
  await page.getByRole('searchbox', { name: 'Retained search', exact: true }).click();
  await expect(retained.getByRole('textbox', { name: 'Retained note' })).toHaveValue('Changed note');
  await expect(retained.getByRole('searchbox')).toHaveValue('Changed query');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Reset retained' }).click();
  await expect(page.getByRole('searchbox', { name: 'Retained search', exact: true })).toHaveValue('Initial');
});

test('scrim dismissal is cancellable and nested combobox handles its own Escape', async ({ page }) => {
  await page.goto('/search');
  await page.getByRole('searchbox', { name: 'Protected search', exact: true }).click();

  const view = page.getByRole('dialog', { name: 'Protected search', exact: true });

  await page.keyboard.press('Escape');
  await expect(view).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(view).toBeVisible();
  await view.getByRole('button', { name: 'Allow outside close' }).click();
  await page.mouse.click(5, 5);
  await expect(view).toHaveCount(0);
  await page.getByRole('searchbox', { name: 'Nested controls search', exact: true }).click();

  const parent = page.getByRole('dialog', { name: 'Nested controls search', exact: true });

  await parent.getByRole('combobox', { name: 'Result filter' }).fill('Pa');
  await expect(page.getByRole('listbox')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await expect(parent).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(parent).toHaveCount(0);
});

test('auto layout changes from docked to fullscreen without replacing focused query', async ({ page }) => {
  await page.goto('/search');
  await page.getByRole('searchbox', { name: searchName, exact: true }).click();

  const view = page.getByRole('dialog', { name: searchName, exact: true });

  await view.getByRole('searchbox').fill('P');
  await expect.poll(async () => (await view.boundingBox())?.width).toBeLessThan(721);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(async () => (await view.boundingBox())?.width).toBe(390);
  await expect.poll(async () => (await view.boundingBox())?.height).toBe(844);
  await expect(view.getByRole('searchbox')).toBeFocused();
  await expect(view.getByRole('searchbox')).toHaveValue('P');
  await page.setViewportSize({ width: 1280, height: 720 });
  await expect.poll(async () => (await view.boundingBox())?.width).toBeLessThan(721);
  await expect
    .poll(async () => {
      const box = (await view.boundingBox())!;

      return box.x >= 12 && box.x + box.width <= 1268 && box.y + box.height <= 709;
    })
    .toBe(true);

  const bounds = (await view.boundingBox())!;

  expect(bounds.x).toBeGreaterThanOrEqual(12);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(1268);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(709);
});

test('fullscreen motion interpolates native CSS geometry; reduced motion disables it', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/search');

  await expect(page.getByTestId('controlled-search').locator('[data-md3-search]')).toHaveAttribute(
    'data-hydrated',
    'true',
  );

  const closedBar = page.getByRole('searchbox', { name: searchName, exact: true });
  const origin = (await closedBar.locator('..').boundingBox())!;

  await closedBar.click();

  const view = page.getByRole('dialog', { name: searchName, exact: true });

  await expect(view).not.toHaveAttribute('data-starting-style', '');

  const frames = await view.evaluate(async (node) => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });

    const animations = node.getAnimations();

    for (const animation of animations) {
      animation.pause();
      animation.currentTime = 50;
    }

    const middle = node.getBoundingClientRect().height;

    animations.forEach((animation) => animation.finish());

    const topAnimation = animations.find(
      (animation) => animation instanceof CSSTransition && animation.transitionProperty === 'top',
    );

    return {
      count: animations.length,
      middle,
      end: node.getBoundingClientRect().height,
      startTop: topAnimation?.effect instanceof KeyframeEffect ? topAnimation.effect.getKeyframes()[0]?.top : undefined,
    };
  });

  expect(frames.count).toBeGreaterThan(0);
  expect(parseFloat(String(frames.startTop))).toBeCloseTo(origin.y, 1);
  expect(frames.middle).toBeGreaterThan(56);
  expect(frames.middle).toBeLessThan(frames.end);
  await page.keyboard.press('Escape');
  await expect(view).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('searchbox', { name: searchName, exact: true }).click();
  expect(await view.evaluate((node) => getComputedStyle(node).transitionDuration)).toBe('0s');
  expect(
    await view.locator('[data-md3-search-results]').evaluate((node) => getComputedStyle(node).transitionDuration),
  ).toBe('0s');
  await page.keyboard.press('Escape');
  await expect(view).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await closedBar.click();
  expect(
    await view.locator('[data-md3-search-results]').evaluate((node) => getComputedStyle(node).borderTopStyle),
  ).toBe('solid');
});

test('portal inherits nested theme, supports explicit containers and mirrors RTL back action', async ({ page }) => {
  await page.goto('/search');
  await page.getByRole('searchbox', { name: 'Dark search', exact: true }).click();

  const dark = page.getByRole('dialog', { name: 'Dark search', exact: true });

  expect(await dark.evaluate((node) => Boolean(node.closest('[data-testid="search-dark-theme"]')))).toBe(true);
  expect(
    await dark.locator('[data-md3-search-results]').evaluate((node) => getComputedStyle(node).backgroundColor),
  ).not.toBe('rgba(0, 0, 0, 0)');
  await page.keyboard.press('Escape');
  await page.getByRole('searchbox', { name: 'Custom container search', exact: true }).click();
  await expect(page.getByTestId('search-custom-container').getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('searchbox', { name: 'RTL search', exact: true }).click();

  const rtl = page.getByRole('dialog', { name: 'RTL search', exact: true });

  expect(await rtl.evaluate((node) => getComputedStyle(node).direction)).toBe('rtl');
  expect(
    await rtl
      .getByRole('button', { name: 'Back', exact: true })
      .locator('svg')
      .evaluate((node) => getComputedStyle(node).transform),
  ).toBe('matrix(-1, 0, 0, -1, 0, 0)');
});

test('Search is accessible in Next and Storybook, streams, and inserts no style elements', async ({ page }) => {
  const errors: string[] = [];

  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/search');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

  const before = await page.locator('style').count();

  await page.getByRole('searchbox', { name: searchName, exact: true }).click();
  await expect(page.getByRole('dialog', { name: searchName, exact: true })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCSS('opacity', '1');
  await expect(page.getByRole('dialog').locator('[data-md3-search-results]')).toHaveCSS('opacity', '1');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await page.locator('style').count()).toBe(before);
  await page.goto('/streaming');
  await expect(page.getByRole('searchbox', { name: 'Streamed search bar', exact: true })).toHaveValue('Streamed query');
  await page.getByRole('searchbox', { name: 'Streamed search', exact: true }).click();
  await expect(page.getByRole('dialog').getByText('Streamed search results')).toBeVisible();
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-search--destinations&viewMode=story&globals=a11y.manual:!true',
  );
  await page.getByRole('searchbox', { name: searchName, exact: true }).click();
  await page.getByRole('dialog').getByRole('searchbox').fill('Porto');
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Porto', exact: true })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCSS('opacity', '1');
  await expect(page.getByRole('dialog').locator('[data-md3-search-results]')).toHaveCSS('opacity', '1');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
});

test('defaultOpen and cancellation preserve modal focus without executing a query', async ({ page }) => {
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-search--initially-open&viewMode=story');
  await expect(page.getByRole('dialog', { name: 'Search', exact: true })).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('searchbox')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-search--submission-cancelled&viewMode=story');
  await page.getByRole('searchbox').click();

  const field = page.getByRole('dialog').getByRole('searchbox');

  await field.fill('Paris');
  await field.press('Enter');
  await expect(field).toBeFocused();
  await expect(field).toHaveValue('Paris');
});
