import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createTheme, themeToCss } from '@flaut-org/react-md3e/theme';

function luminance(hex) {
  const channels = hex
    .slice(1)
    .match(/../g)
    .map((value) => parseInt(value, 16) / 255)
    .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

test('themes are immutable, serializable, deterministic, and provide complete light/dark roles', () => {
  const theme = createTheme({ sourceColor: '#6750A4' });

  assert.deepEqual(theme, createTheme({ sourceColor: '#6750a4' }));
  assert.deepEqual(JSON.parse(JSON.stringify(theme)), theme);
  assert.ok(Object.isFrozen(theme.schemes.light));
  assert.notEqual(theme.schemes.light.primary, theme.schemes.dark.primary);
  assert.equal(Object.keys(theme.typography).length, 30);
  assert.ok(theme.schemes.light.surfaceContainerLow);
  assert.ok(theme.schemes.light.primaryFixed);
  assert.equal(theme.shape.largeIncreased, 20);
  assert.equal(theme.shape.extraLargeIncreased, 32);
  assert.equal(theme.shape.extraExtraLarge, 48);

  for (const mode of ['light', 'dark']) {
    for (const [color, onColor] of [
      ['primary', 'onPrimary'],
      ['secondary', 'onSecondary'],
      ['surface', 'onSurface'],
    ]) {
      const a = luminance(theme.schemes[mode][color]);
      const b = luminance(theme.schemes[mode][onColor]);

      assert.ok((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) >= 4.45);
    }
  }
});

test('key colors, custom-color harmonization, typography, shape, and exact role overrides are supported', () => {
  const theme = createTheme({
    sourceColor: '#6750a4',
    keyColors: { secondary: '#006c4c' },
    customColors: { success: { value: '#00a000' }, fixed: { value: '#00a000', harmonize: false } },
    typography: { brandFontFamily: 'Georgia, serif', plainFontFamily: 'Arial, sans-serif' },
    shape: { medium: 18 },
    schemes: { light: { primary: '#123456' } },
  });

  assert.equal(theme.schemes.light.primary, '#123456');
  assert.notEqual(theme.schemes.light.secondary, createTheme().schemes.light.secondary);
  assert.notEqual(theme.customColors.success.value, theme.customColors.fixed.value);
  assert.equal(theme.typography.headlineLarge.fontFamily, 'Georgia, serif');
  assert.equal(theme.typography.labelLarge.fontFamily, 'Arial, sans-serif');
  assert.equal(theme.cssVariables['--md-sys-shape-corner-medium'], '18px');
  assert.match(theme.cssVariables['--md-custom-color-success-color'], /^light-dark\(/);
  assert.notEqual(createTheme({ variant: 'expressive' }).schemes.light.primary, createTheme().schemes.light.primary);
});

test('theme export produces scoped static CSS and rejects malformed configuration', () => {
  const css = themeToCss(createTheme(), { selector: '.brand' });

  assert.match(css, /^\.brand \{/);
  assert.match(css, /--md-sys-color-primary: light-dark\(/);
  assert.throws(() => createTheme({ sourceColor: 'red' }), /hex color/);
  assert.throws(() => createTheme({ contrastLevel: 2 }), /contrastLevel/);
  assert.throws(() => createTheme({ shape: { small: -1 } }), /radius/);
  assert.throws(() => createTheme({ customColors: { 'not valid': { value: '#123456' } } }), /kebab-case/);
  assert.throws(() => themeToCss(createTheme(), { selector: 'x{}' }), /selector/);
});

test('Expressive typography provides paired metrics, independent overrides, and canonical CSS tokens', () => {
  const defaults = createTheme();
  const theme = createTheme({
    typography: {
      brandFontFamily: 'Georgia, serif',
      plainFontFamily: 'Arial, sans-serif',
      bodyLarge: { fontSize: 18, lineHeight: 28 },
      bodyLargeEmphasized: { fontWeight: 600, letterSpacing: -0.1 },
    },
  });

  assert.equal(defaults.typography.bodyLargeEmphasized.fontWeight, 500);
  assert.equal(defaults.typography.bodyLargeEmphasized.letterSpacing, 0.15);
  assert.equal(defaults.typography.bodyMediumEmphasized.letterSpacing, 0.25);
  assert.equal(defaults.typography.titleMediumEmphasized.fontWeight, 700);
  assert.equal(defaults.typography.titleMediumEmphasized.letterSpacing, 0.15);
  assert.equal(defaults.typography.labelLargeEmphasized.fontWeight, 700);
  assert.equal(theme.typography.displayLargeEmphasized.fontFamily, 'Georgia, serif');
  assert.equal(theme.typography.bodyLargeEmphasized.fontFamily, 'Arial, sans-serif');
  assert.equal(theme.typography.bodyLarge.fontSize, 18);
  assert.equal(theme.typography.bodyLargeEmphasized.fontSize, 16);
  assert.equal(theme.typography.bodyLargeEmphasized.fontWeight, 600);
  assert.ok(Object.isFrozen(theme.typography.bodyLargeEmphasized));
  assert.equal(theme.cssVariables['--md-sys-typescale-emphasized-body-large-weight'], '600');
  assert.equal(theme.cssVariables['--md-sys-typescale-emphasized-body-large-tracking'], '-0.00625rem');
  assert.match(themeToCss(theme, { selector: '.brand' }), /--md-sys-typescale-emphasized-title-medium-weight: 700;/);
});

test('typography rejects invalid roles, metrics and font-family overrides', () => {
  assert.throws(() => createTheme({ typography: { heading: {} } }), /Unknown typography role/);
  assert.throws(() => createTheme({ typography: { bodyLarge: null } }), /style object/);
  assert.throws(() => createTheme({ typography: { bodyLarge: [] } }), /style object/);
  assert.throws(() => createTheme({ typography: { bodyLarge: { fontSize: 0 } } }), /fontSize/);
  assert.throws(() => createTheme({ typography: { bodyLarge: { lineHeight: NaN } } }), /lineHeight/);
  assert.throws(() => createTheme({ typography: { bodyLargeEmphasized: { fontWeight: 1001 } } }), /fontWeight/);
  assert.throws(() => createTheme({ typography: { bodyLarge: { letterSpacing: Infinity } } }), /letterSpacing/);
  assert.throws(() => createTheme({ typography: { bodyLarge: { fontFamily: '' } } }), /fontFamily/);
  assert.throws(() => createTheme({ typography: { bodyLarge: { tracking: 1 } } }), /Unknown typography property/);
});
