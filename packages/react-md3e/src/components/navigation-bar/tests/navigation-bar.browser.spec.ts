import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('server navigation and streamed destinations have styles and current-page semantics before hydration', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  try {
    await page.goto('/navigation');

    const root = page.getByTestId('server-navigation');

    await expect(root).toHaveCSS('height', '64px');
    await expect(root.getByRole('button', { name: 'Home', exact: true })).toHaveAttribute('aria-current', 'page');
    await expect(page.getByTestId('streamed-navigation-item')).toHaveCount(1);
    await expect(page.getByTestId('baseline-bar')).toHaveCSS('height', '80px');
    await expect(page.getByTestId('server-rail')).toHaveCSS('width', '96px');
    await expect(page.getByTestId('baseline-rail')).toHaveCSS('width', '80px');
    await expect(page.getByTestId('server-drawer')).toHaveCSS('width', '360px');
    await expect(root.locator('[data-md3-navigation-indicator]').first()).toHaveCSS('width', '56px');
    await expect(page.getByTestId('baseline-bar').locator('[data-md3-navigation-indicator]').first()).toHaveCSS(
      'width',
      '64px',
    );
  } finally {
    await context.close();
  }
});

test('a streamed destination joins selection and arrives after the initial navigation shell', async ({ page }) => {
  await page.goto('/navigation');

  const streamed = page.getByTestId('streamed-navigation-item');

  await expect(streamed).toBeVisible();
  await streamed.click();
  await expect(streamed).toHaveAttribute('aria-current', 'page');
  await expect(
    page.getByTestId('server-navigation').getByRole('button', { name: 'Home', exact: true }),
  ).not.toHaveAttribute('aria-current');

  const evidence = await page.evaluate(async () => {
    const response = await fetch('/navigation');
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let markup = '';
    let shellBeforeDestination = false;
    let done = false;

    while (!done) {
      const chunk = await reader.read();

      done = chunk.done;
      markup += decoder.decode(chunk.value, { stream: !done });

      if (markup.includes('Loading destination') && !markup.includes('data-testid="streamed-navigation-item"')) {
        shellBeforeDestination = true;
      }
    }

    return { shellBeforeDestination, destination: markup.includes('data-testid="streamed-navigation-item"') };
  });

  expect(evidence).toEqual({ shellBeforeDestination: true, destination: true });
});

test('navigation uses independent Tab stops and native button activation without tab or toggle roles', async ({
  page,
}) => {
  await page.goto('/navigation');

  const root = page.getByTestId('controlled-navigation');
  const first = root.getByRole('button', { name: 'One', exact: true });
  const second = root.getByRole('button', { name: 'Two', exact: true });
  const third = root.getByRole('button', { name: 'Three', exact: true });

  await first.focus();
  await first.press('Tab');
  await expect(second).toBeFocused();
  await second.press('Space');
  await expect(page.getByTestId('navigation-value')).toHaveText('two');
  await expect(second).toHaveAttribute('aria-current', 'page');
  await second.press('Tab');
  await expect(third).toBeFocused();
  await third.press('Enter');
  await third.press('Enter');
  await expect(page.getByTestId('navigation-value')).toHaveText('three');
  await expect(page.getByTestId('navigation-changes')).toHaveText('2');
  await expect(root.locator('[role="tab"], [aria-pressed], [aria-selected]')).toHaveCount(0);
});

test('controlled changes and prevented handlers cancel selection; external values survive filtering', async ({
  page,
}) => {
  await page.goto('/navigation');

  const root = page.getByTestId('controlled-navigation');

  await page.getByLabel('Cancel navigation changes', { exact: true }).check();
  await root.getByRole('button', { name: 'Two', exact: true }).click();
  await expect(page.getByTestId('navigation-value')).toHaveText('one');
  await page.getByLabel('Cancel navigation changes', { exact: true }).uncheck();
  await page.getByLabel('Prevent item click', { exact: true }).check();
  await root.getByRole('button', { name: 'Two', exact: true }).click();
  await expect(page.getByTestId('navigation-changes')).toHaveText('0');
  await page.getByRole('button', { name: 'Select two externally', exact: true }).click();
  await expect(root.getByRole('button', { name: 'Two', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('button', { name: 'Filter second destination', exact: true }).click();
  await expect(root.locator('[aria-current="page"]')).toHaveCount(0);
  await expect(page.getByTestId('navigation-value')).toHaveText('two');
  await page.getByRole('button', { name: 'Filter second destination', exact: true }).click();
  await expect(root.getByRole('button', { name: 'Two', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('button', { name: 'Clear navigation', exact: true }).click();
  await expect(root.locator('[aria-current="page"]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Check navigation refs', exact: true }).click();
  await expect(page.getByTestId('navigation-refs')).toHaveText('true');
});

test('links retain href, router components and modified-click behavior while disabled links cannot navigate', async ({
  page,
}) => {
  await page.goto('/navigation');

  const root = page.getByTestId('link-navigation');
  const first = root.getByRole('link', { name: 'First link', exact: true });
  const second = root.getByRole('link', { name: 'Second link', exact: true });

  await second.click();
  await expect(page).toHaveURL(/#second$/);
  await expect(second).toHaveAttribute('aria-current', 'page');
  await first.focus();
  await first.press('Enter');
  await expect(page).toHaveURL(/#first$/);
  await expect(first).toHaveAttribute('aria-current', 'page');

  await second.click({ modifiers: ['ControlOrMeta'] });
  await expect(first).toHaveAttribute('aria-current', 'page');

  const popupPromise = page.waitForEvent('popup');

  await root.getByRole('link', { name: 'New tab', exact: true }).click();

  const popup = await popupPromise;

  await popup.close();
  await expect(first).toHaveAttribute('aria-current', 'page');
  await root.getByRole('link', { name: 'Router link', exact: true }).click();
  await expect(page).toHaveURL(/#router$/);
  await expect(root.getByRole('link', { name: 'Router link', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(root.getByRole('link', { name: 'Disabled link', exact: true })).not.toHaveAttribute('href');
  await expect(root.getByRole('link', { name: 'Disabled link', exact: true })).toHaveAttribute('aria-disabled', 'true');
  await expect(root.getByRole('link', { name: 'Disabled link', exact: true })).toHaveAttribute('tabindex', '-1');
});

test('flexible bar switches item layout at sm and supports RTL without a client style observer', async ({ page }) => {
  await page.setViewportSize({ width: 500, height: 800 });
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-navigationbar--responsive&viewMode=story');

  const root = page.getByRole('navigation');
  const surface = root.locator('[data-md3-navigation-surface]').first();

  await expect(root).toHaveCSS('height', '64px');
  await expect(surface).toHaveCSS('height', '32px');
  await page.setViewportSize({ width: 800, height: 800 });
  await expect(surface).toHaveCSS('height', '40px');
  await expect(root.locator('[data-md3-navigation-bottom-label]').first()).toHaveCSS('opacity', '0');
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-navigationbar--right-to-left&viewMode=story');
  await expect(root).toHaveCSS('direction', 'rtl');

  const icon = await root.locator('[data-md3-navigation-icon]').first().boundingBox();
  const label = await root.locator('[data-md3-navigation-inline-label]').first().boundingBox();

  expect(icon!.x).toBeGreaterThan(label!.x);
});

test('selection animates its surface without scaling glyphs or inserting rules; reduced motion and forced colors work', async ({
  page,
}) => {
  await page.goto('/navigation');

  const root = page.getByTestId('controlled-navigation');
  const second = root.getByRole('button', { name: 'Two', exact: true });
  const styleCount = await page.locator('style').count();

  await second.focus();
  await expect(second.locator('[data-md3-navigation-focus-ring]')).toBeVisible();
  await second.press('Enter');

  const frames = await second.evaluate((node) => {
    const indicator = node.querySelector<HTMLElement>('[data-md3-navigation-indicator]')!;
    const transitions = indicator.getAnimations();

    transitions.forEach((animation) => animation.pause());

    const samples = [0, 50, 100, 200, 400].map((time) => {
      for (const animation of transitions) {
        animation.currentTime = time;
      }

      return {
        scale: new DOMMatrixReadOnly(getComputedStyle(indicator).transform).a,
        icon: node.querySelector('[data-md3-navigation-icon]')!.getBoundingClientRect().width,
      };
    });

    transitions.forEach((animation) => animation.finish());

    return samples;
  });

  expect(frames[0]!.scale).toBeLessThan(0.05);
  expect(frames[2]!.scale).toBeGreaterThan(0.5);
  expect(Math.max(...frames.map((frame) => frame.scale))).toBeGreaterThan(1);
  expect(frames.every((frame) => frame.icon === 24)).toBe(true);
  expect(await page.locator('style').count()).toBe(styleCount);
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await expect(second.locator('[data-md3-navigation-indicator]')).toHaveCSS('transition-duration', '0s');
  await expect(second.locator('[data-md3-navigation-icon]')).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(second.locator('[data-md3-navigation-focus-ring]')).toHaveCSS('border-top-width', '3px');
  await expect(root.getByRole('button', { name: 'Unavailable', exact: true })).toHaveCSS('color', 'rgb(96, 0, 0)');
});

test('navigation page has accessible landmarks, destinations and controls', async ({ page }) => {
  await page.goto('/navigation');

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
