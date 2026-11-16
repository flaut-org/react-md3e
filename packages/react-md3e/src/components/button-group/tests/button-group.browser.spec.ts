import { expect, test } from '@playwright/test';

test('connected ButtonGroup selects once per pointer/keyboard activation and prevents an empty selection', async ({
  page,
}) => {
  await page.goto('/essentials');

  const group = page.getByRole('group', { name: 'Appearance', exact: true });
  const light = group.getByRole('button', { name: 'Light', exact: true });
  const dark = group.getByRole('button', { name: 'Dark', exact: true });

  await expect(light).toHaveAttribute('aria-pressed', 'true');
  await dark.click();
  await expect(page.getByTestId('selected-theme')).toHaveText('dark');
  await dark.press('Space');
  await expect(dark).toHaveAttribute('aria-pressed', 'true');
  await dark.press('ArrowLeft');
  await expect(light).toBeFocused();
  await light.press('Enter');
  await expect(page.getByTestId('selected-theme')).toHaveText('light');
  await expect(group.getByRole('button', { name: 'System', exact: true })).toBeDisabled();
  await expect(light).toHaveCSS('border-top-right-radius', '9999px');
  await expect(dark).toHaveCSS('border-top-right-radius', '8px');
});

test('standard multi-select group toggles independently and none mode delegates one ordinary action', async ({
  page,
}) => {
  await page.goto('/essentials');

  const group = page.getByRole('group', { name: 'Filters', exact: true });
  const direct = group.getByRole('button', { name: 'Direct', exact: true });

  await direct.press('Space');
  await expect(page.getByTestId('selected-filters')).toHaveText('direct');
  await group.getByRole('button', { name: 'Baggage', exact: true }).press('Enter');
  await expect(page.getByTestId('selected-filters')).toHaveText('direct,baggage');
  await direct.click();
  await expect(page.getByTestId('selected-filters')).toHaveText('baggage');
  await page.getByRole('button', { name: 'Grouped action', exact: true }).press('Space');
  await expect(page.getByTestId('essentials-clicks')).toHaveText('1');
  await expect(page.getByRole('button', { name: 'Disabled option', exact: true })).toBeDisabled();
  await expect(group).toHaveCSS('gap', '12px');
});

test('ButtonGroup roving focus follows RTL and reduced motion removes shape transitions', async ({ page }) => {
  await page.goto('/essentials');

  const group = page.getByRole('group', { name: 'RTL appearance', exact: true });
  const first = group.getByRole('button', { name: 'One', exact: true });
  const second = group.getByRole('button', { name: 'Two', exact: true });

  await first.focus();
  await first.press('ArrowLeft');
  await expect(second).toBeFocused();
  await second.press('Space');
  await expect(second).toHaveAttribute('aria-pressed', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(second).toHaveCSS('transition-duration', '0s');
});

test('empty selection, change vetoes and inherited RTL preserve the group contract', async ({ page }) => {
  await page.goto('/essentials');

  const optional = page.getByRole('group', { name: 'Optional choice', exact: true });

  await optional.getByRole('button', { name: 'Optional one', exact: true }).click();
  await expect(optional.getByRole('button', { pressed: true })).toHaveCount(0);

  const locked = page.getByRole('group', { name: 'Locked choice', exact: true });

  await locked.getByRole('button', { name: 'Locked two', exact: true }).click();
  await expect(locked.getByRole('button', { name: 'Locked one', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(locked.getByRole('button', { name: 'Locked two', exact: true })).toHaveAttribute(
    'aria-pressed',
    'false',
  );

  const inherited = page.getByRole('group', { name: 'Inherited RTL choice', exact: true });

  await inherited.getByRole('button', { name: 'Inherited one', exact: true }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(inherited.getByRole('button', { name: 'Inherited two', exact: true })).toBeFocused();
});

test('standard ButtonGroup grows the pressed button and shrinks its neighbor with CSS', async ({ page }) => {
  await page.goto('/essentials');

  const group = page.getByRole('group', { name: 'Filters', exact: true });
  const direct = group.getByRole('button', { name: 'Direct', exact: true });
  const before = (await direct.boundingBox())!.width;

  await direct.hover();
  await page.mouse.down();

  try {
    await expect.poll(() => direct.evaluate((node) => node.getBoundingClientRect().width)).toBeGreaterThan(before + 2);
  } finally {
    await page.mouse.up();
  }
});
