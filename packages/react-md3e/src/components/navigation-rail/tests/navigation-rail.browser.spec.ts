import { expect, test } from '@playwright/test';
import reference from './navigation-motion.reference.json' with { type: 'json' };

test('rail arrows and Home/End move focus without selecting, skip disabled items and preserve Tab stops', async ({
  page,
}) => {
  await page.goto('/navigation');

  const root = page.getByTestId('expandable-rail');
  const home = root.getByRole('button', { name: 'Home', exact: true });
  const saved = root.getByRole('button', { name: 'Saved', exact: true });
  const account = root.getByRole('button', { name: 'Account', exact: true });

  await home.focus();
  await home.press('ArrowDown');
  await expect(saved).toBeFocused();
  await expect(home).toHaveAttribute('aria-current', 'page');
  await saved.press('End');
  await expect(account).toBeFocused();
  await account.press('ArrowDown');
  await expect(home).toBeFocused();
  await home.press('ArrowUp');
  await expect(account).toBeFocused();
  await account.press('Space');
  await expect(account).toHaveAttribute('aria-current', 'page');
  await account.press('Home');
  await expect(home).toBeFocused();
  await home.press('Tab');
  await expect(saved).toBeFocused();
});

test('collapsed/expanded rail geometry preserves selection, pill-sized expanded targets and unscaled icons', async ({
  page,
}) => {
  await page.goto('/navigation');

  const root = page.getByTestId('expandable-rail');
  const home = root.getByRole('button', { name: 'Home', exact: true });
  const toggle = page.getByRole('button', { name: 'Toggle rail', exact: true });

  await expect(root).toHaveCSS('width', '96px');
  await expect(home).toHaveCSS('width', '96px');
  await expect(home).toHaveCSS('height', '64px');
  await expect(home.locator('[data-md3-navigation-surface]')).toHaveCSS('width', '56px');
  await expect(root).toHaveCSS('padding-top', '44px');
  await expect(root.locator('[data-md3-fab-button]')).toHaveCSS('box-shadow', 'none');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect
    .poll(() =>
      root.evaluate((node) => node.getAnimations().filter((animation) => animation.playState === 'running').length),
    )
    .toBe(0);

  const expandedWidth = (await root.boundingBox())!.width;

  expect(expandedWidth).toBeGreaterThan(220);
  expect(expandedWidth).toBeLessThanOrEqual(360);

  const targetWidth = (await home.boundingBox())!.width;
  const indicatorWidth = (await home.locator('[data-md3-navigation-surface]').boundingBox())!.width;

  expect(targetWidth).toBeCloseTo(indicatorWidth, 1);
  expect(targetWidth).toBeLessThan(expandedWidth);
  await expect(home).toHaveCSS('height', '56px');
  await expect(home.locator('[data-md3-navigation-surface]')).toHaveCSS('height', '56px');
  await expect(home.locator('[data-md3-navigation-inline-label]')).toHaveCSS('font-size', '14px');
  await expect(home.locator('[data-md3-navigation-icon]')).toHaveCSS('width', '24px');
  await expect(home).toHaveAttribute('aria-current', 'page');
  await toggle.click();
  await expect(root).toHaveCSS('width', '96px');
  await expect(home).toHaveAttribute('aria-current', 'page');
});

for (const colorScheme of ['light', 'dark']) {
  test(`collapsed labels stay centered after navigating between Storybook families in ${colorScheme}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 1280, height: 1200 });
    await page.goto(
      `http://127.0.0.1:6106/?path=/story/components-navigationrail--collapsed&globals=colorScheme:${colorScheme}`,
    );

    const previewFrame = page.frameLocator('#storybook-preview-iframe');
    // Docs renders additional copies of each component while the selected story is loading.
    const preview = previewFrame.locator('#storybook-root');

    await expect(preview.locator('[data-md3-navigation="rail"]')).toBeVisible();

    const visits = [
      { family: 'NavigationRail', story: 'collapsed' },
      { family: 'NavigationDrawer', story: 'standard' },
      { family: 'NavigationRail', story: 'collapsed' },
      { family: 'NavigationBar', story: 'horizontal' },
      { family: 'NavigationRail', story: 'collapsed' },
      { family: 'NavigationRail', story: 'baseline' },
      { family: 'NavigationRail', story: 'right-to-left' },
    ];

    for (const [index, { family, story }] of visits.entries()) {
      const id = `components-${family.toLowerCase()}--${story}`;
      const link = page.locator(`a[href*="/story/${id}"]`);
      const familyButton = page.getByRole('button', { name: family, exact: true });

      if (!(await link.isVisible())) {
        await familyButton.click();
      }

      if (family !== 'NavigationRail') {
        await page.locator(`a[href*="/docs/components-${family.toLowerCase()}--docs"]`).click();
        await expect(previewFrame.locator('#storybook-docs')).toBeVisible();
      }

      await link.click();
      await expect(page).toHaveURL(new RegExp(`/story/${id}`));
      await expect(preview).toBeVisible();

      if (family === 'NavigationRail') {
        const rail = preview.locator('[data-md3-navigation="rail"]');

        await expect(rail).toBeVisible();
        await expect(rail).toHaveAttribute('data-expanded', 'false');
        await expect(rail).toHaveAttribute('data-appearance', story === 'baseline' ? 'baseline' : 'expressive');
        await expect(rail).toHaveCSS('width', story === 'baseline' ? '80px' : '96px');

        if (story === 'right-to-left') {
          await expect(rail).toHaveCSS('direction', 'rtl');
        }

        const centers = await rail.locator('[data-md3-navigation-item]').evaluateAll((items) =>
          items.map((item) => {
            const icon = item.querySelector('[data-md3-navigation-icon]')!.getBoundingClientRect();
            const label = item.querySelector('[data-md3-navigation-bottom-label]')!;
            const range = document.createRange();

            range.selectNodeContents(label.firstElementChild!);

            const text = range.getBoundingClientRect();

            return { icon: icon.x + icon.width / 2, label: text.x + text.width / 2, gap: text.y - icon.bottom };
          }),
        );

        for (const center of centers) {
          expect(Math.abs(center.icon - center.label)).toBeLessThan(0.5);
          expect(center.gap).toBeGreaterThan(0);
        }

        const screenshotPath = testInfo.outputPath(`${colorScheme}-${index}-${story}.png`);

        await rail.screenshot({ path: screenshotPath });
        await testInfo.attach(`${colorScheme}-${index}-${story}.png`, {
          path: screenshotPath,
          contentType: 'image/png',
        });

        await rail.evaluate((node) => node.setAttribute('hidden', ''));
        await expect(rail).toBeHidden();
        await rail.evaluate((node) => node.removeAttribute('hidden'));
      } else {
        await expect(
          preview.locator(`[data-md3-navigation="${family === 'NavigationBar' ? 'bar' : 'drawer'}"]`),
        ).toBeVisible();
      }
    }
  });
}

for (const story of ['expanded', 'modal', 'right-to-left']) {
  test(`${story} content-sized targets ignore the unused row space`, async ({ page }) => {
    await page.goto(`http://127.0.0.1:6106/iframe.html?id=components-navigationrail--${story}&viewMode=story`);

    if (story === 'modal') {
      await page.getByRole('button', { name: 'Open navigation rail', exact: true }).click();
    } else if (story === 'right-to-left') {
      await page.getByRole('button', { name: 'Toggle navigation', exact: true }).click();
    }

    const rail = page.getByRole('navigation');
    const home = rail.getByRole('button', { name: 'Home', exact: true });
    const explore = rail.getByRole('button', { name: 'Explore', exact: true });
    const surface = explore.locator('[data-md3-navigation-surface]');

    await expect(rail).toHaveCSS('width', '220px');

    const target = (await explore.boundingBox())!;
    const pill = (await surface.boundingBox())!;
    const bounds = (await rail.boundingBox())!;

    expect(target.x).toBeCloseTo(pill.x, 1);
    expect(target.width).toBeCloseTo(pill.width, 1);
    expect(target.width).toBeLessThan(bounds.width - 40);
    await explore.hover();
    await expect.poll(() => surface.evaluate((node) => getComputedStyle(node, '::before').opacity)).toBe('0.08');

    const x = story === 'right-to-left' ? bounds.x + 8 : bounds.x + bounds.width - 8;
    const y = target.y + target.height / 2;

    await page.mouse.move(x, y);
    await expect.poll(() => surface.evaluate((node) => getComputedStyle(node, '::before').opacity)).toBe('0');
    await page.mouse.click(x, y);
    await expect(home).toHaveAttribute('aria-current', 'page');
    await expect(explore).not.toHaveAttribute('aria-current');

    if (story === 'modal') {
      await expect(page.getByRole('dialog')).toBeVisible();
    }

    await explore.click();
    await expect(explore).toHaveAttribute('aria-current', 'page');
  });
}

test('full-width targets include the unused row space inside the indicator', async ({ page }) => {
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-navigationrail--full-width-indicator&viewMode=story',
  );

  const rail = page.getByRole('navigation');
  const explore = rail.getByRole('button', { name: 'Explore', exact: true });
  const surface = explore.locator('[data-md3-navigation-surface]');
  const bounds = (await explore.boundingBox())!;
  const pill = (await surface.boundingBox())!;

  expect(bounds.width).toBeCloseTo(180, 1);
  expect(bounds.x).toBeCloseTo(pill.x, 1);
  expect(bounds.width).toBeCloseTo(pill.width, 1);
  await expect(explore).toHaveCSS('width', '180px');
  await expect(surface).toHaveCSS('width', '180px');

  await page.mouse.move(bounds.x + bounds.width - 8, bounds.y + bounds.height / 2);
  await expect.poll(() => surface.evaluate((node) => getComputedStyle(node, '::before').opacity)).toBe('0.08');
  await page.mouse.click(bounds.x + bounds.width - 8, bounds.y + bounds.height / 2);
  await expect(explore).toHaveAttribute('aria-current', 'page');
});

test('Storybook rail captures synchronized expansion frames for both motion schemes', async ({ page }, testInfo) => {
  for (const scheme of ['expressive', 'standard']) {
    await page.goto(
      `http://127.0.0.1:6106/iframe.html?id=components-navigationrail--expandable&viewMode=story&globals=motionScheme:${scheme}`,
    );

    const root = page.getByRole('navigation', { name: 'Expandable destinations', exact: true });

    await expect(root).toHaveCSS('width', '96px');
    await page.getByRole('button', { name: 'Toggle navigation', exact: true }).click();
    await root.evaluate((node) => {
      for (const animation of node.getAnimations({ subtree: true })) {
        animation.pause();
        animation.currentTime = 0;
      }
    });

    const frames = [];

    for (const { elapsedMs: time } of reference.samples) {
      const frame = await root.evaluate((node, currentTime) => {
        for (const animation of node.getAnimations({ subtree: true })) {
          animation.currentTime = currentTime;
        }

        const icon = node.querySelector('[data-md3-navigation-icon]')!.getBoundingClientRect();
        const bottomLabel = node.querySelector('[data-md3-navigation-bottom-label]')!;
        const inlineLabel = node.querySelector('[data-md3-navigation-inline-label]')!;

        return {
          time: currentTime,
          width: node.getBoundingClientRect().width,
          iconWidth: icon.width,
          iconX: icon.x,
          menuIconX: node.querySelector('[data-md3-icon-button] svg')!.getBoundingClientRect().x,
          bottomOpacity: Number(getComputedStyle(bottomLabel).opacity),
          bottomLabelX: bottomLabel.getBoundingClientRect().x,
          inlineOpacity: Number(getComputedStyle(inlineLabel).opacity),
          maxLabelHeight: Math.max(
            ...[...node.querySelectorAll('[data-md3-navigation-inline-label] > span')].map(
              (label) => label.getBoundingClientRect().height,
            ),
          ),
        };
      }, time);

      frames.push(frame);

      if (scheme === 'expressive') {
        const source = reference.samples.find((sample) => sample.elapsedMs === time)!;
        const expected =
          (source.boundaryPx - reference.initialBoundaryPx) /
          (reference.settledBoundaryPx - reference.initialBoundaryPx);
        const actual = (frame.width - 96) / (220 - 96);

        expect(Math.abs(actual - expected)).toBeLessThanOrEqual(reference.normalizedTolerance);
      }

      const screenshotPath = testInfo.outputPath(`${scheme}-rail-${time}ms.png`);

      await root.screenshot({ path: screenshotPath, animations: 'allow' });
      await testInfo.attach(`${scheme}-rail-${time}ms.png`, {
        path: screenshotPath,
        contentType: 'image/png',
      });
    }

    await testInfo.attach(`${scheme}-rail-frames.json`, {
      body: JSON.stringify(frames, null, 2),
      contentType: 'application/json',
    });

    const finalIconX = frames.at(-1)!.iconX;
    const finalBottomLabelX = frames.at(-1)!.bottomLabelX;

    expect(frames[0]!.width).toBeCloseTo(96, 0);
    expect(frames.at(-1)!.width).toBeCloseTo(220, 0);
    expect(frames[2]!.width).toBeGreaterThan(frames[1]!.width);
    expect(frames[2]!.width).toBeLessThan(220);
    expect(frames.every((frame) => frame.iconWidth === 24)).toBe(true);
    expect(frames.every((frame) => Math.abs(frame.iconX - finalIconX) < 0.5)).toBe(true);
    expect(frames.every((frame) => Math.abs(frame.bottomLabelX - finalBottomLabelX) < 0.5)).toBe(true);
    expect(frames.every((frame) => Math.abs(frame.iconX - frame.menuIconX) < 0.5)).toBe(true);
    expect(frames.every((frame) => frame.maxLabelHeight <= 20.1)).toBe(true);
    expect(frames[0]!.bottomOpacity).toBe(1);
    expect(frames.at(-1)!.bottomOpacity).toBe(0);
    expect(frames.at(-1)!.inlineOpacity).toBe(1);
  }
});

test('hidden modal rail reveals its width while icons stay anchored', async ({ page }, testInfo) => {
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-navigationrail--modal&viewMode=story');
  await page.getByRole('button', { name: 'Open navigation rail', exact: true }).click();

  const dialog = page.getByRole('dialog');

  await expect(dialog).toBeAttached();
  await expect(dialog).not.toHaveAttribute('data-starting-style');
  await dialog.evaluate((node) => {
    for (const animation of node.getAnimations()) {
      animation.pause();
      animation.currentTime = 0;
    }
  });

  const samples: { width: number; iconX: number }[] = [];

  for (const time of [0, 50, 100, 200, 500]) {
    samples.push(
      await dialog.evaluate((node, currentTime) => {
        for (const animation of node.getAnimations()) {
          animation.currentTime = currentTime;
        }

        return {
          width: node.getBoundingClientRect().width,
          iconX: node.querySelector('[data-md3-navigation-icon]')!.getBoundingClientRect().x,
        };
      }, time),
    );

    const screenshotPath = testInfo.outputPath(`modal-rail-${time}ms.png`);

    await page.screenshot({ path: screenshotPath, animations: 'allow' });
    await testInfo.attach(`modal-rail-${time}ms.png`, { path: screenshotPath, contentType: 'image/png' });
  }

  expect(samples[0]!.width).toBeLessThan(1);
  expect(samples[2]!.width).toBeGreaterThan(samples[1]!.width);
  expect(samples.at(-1)!.width).toBeCloseTo(220, 0);
  expect(samples.every((sample) => Math.abs(sample.iconX - samples.at(-1)!.iconX) < 0.5)).toBe(true);
});

test('RTL, full-width indicators and reduced motion are exposed through actual Storybook compositions', async ({
  page,
}) => {
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-navigationrail--right-to-left&viewMode=story');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Toggle navigation', exact: true }).click();

  const root = page.getByRole('navigation');

  await expect(root).toHaveCSS('width', '220px');
  await expect(root).toHaveCSS('direction', 'rtl');
  await expect(root).toHaveCSS('transition-duration', '0s');

  const icon = await root.locator('[data-md3-navigation-icon]').first().boundingBox();
  const label = await root.locator('[data-md3-navigation-inline-label]').first().boundingBox();

  expect(icon!.x).toBeGreaterThan(label!.x);
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-navigationrail--full-width-indicator&viewMode=story',
  );
  await expect(page.getByRole('navigation').locator('[data-md3-navigation-surface]').first()).toHaveCSS(
    'width',
    '180px',
  );
});

test('modal expanded rail has a scrim, named dialog and focus restoration', async ({ page }) => {
  await page.goto('/navigation');

  const trigger = page.getByRole('button', { name: 'Open modal rail', exact: true });

  await trigger.click();

  const dialog = page.getByRole('dialog', { name: 'Modal rail destinations', exact: true });

  await expect(dialog).toHaveCSS('width', '220px');
  await expect(dialog.getByRole('navigation')).toHaveAttribute('data-expanded', 'true');
  await expect(dialog.getByRole('button', { name: 'Home', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
