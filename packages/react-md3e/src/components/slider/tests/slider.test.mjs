import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Slider } from '@flaut-travel/react-md3e/slider';

const render = (props) => renderToStaticMarkup(createElement(Slider, { label: 'Level', ...props }));
const names = (index) => (index === 0 ? 'Minimum' : 'Maximum');

test('Slider rejects invalid bounds, increments and missing names before rendering', () => {
  for (const props of [
    { min: 1, max: 1 },
    { min: 10, max: 0 },
    { min: NaN },
    { max: Infinity },
    { step: 0 },
    { step: -1 },
    { step: Infinity },
    { shiftStep: 0 },
    { value: NaN },
    { value: [10] },
    { variant: 'range', value: [20], getAriaLabel: names },
    { variant: 'range', value: [10, 20, 30], getAriaLabel: names },
    { variant: 'range', getAriaLabel: () => '' },
  ]) {
    assert.throws(() => render(props));
  }

  assert.throws(() => render({ label: undefined }), /requires a visible label/);
});

test('Slider validates range separation, inset icon configurations and finite bounded marks', () => {
  for (const props of [
    { variant: 'range', minStepsBetweenValues: -1, getAriaLabel: names },
    { variant: 'range', minStepsBetweenValues: 200, getAriaLabel: names },
    { variant: 'range', defaultValue: [20, 25], step: 5, minStepsBetweenValues: 2, getAriaLabel: names },
    { icon: 'sun', size: 'small' },
    { variant: 'centered', icon: 'sun', size: 'medium' },
    { marks: [{ value: 101 }] },
    { marks: [{ value: NaN }] },
    { marks: true, step: 0.00001 },
  ]) {
    assert.throws(() => render(props));
  }

  assert.doesNotThrow(() => render({ marks: [{ value: 50 }], step: 0.00001 }));
});

test('Slider server markup contains sorted/clamped native values, decimal stops and stable label associations', () => {
  const single = render({ defaultValue: 200, name: 'level' });
  const range = render({ variant: 'range', defaultValue: [80, 20], getAriaLabel: names });
  const decimals = render({ min: 0.1, max: 0.5, step: 0.1, marks: true });

  assert.match(single, /type="range"[^>]*value="100"/);
  assert.match(single, /aria-labelledby="[^"]+"/);
  assert.equal((range.match(/type="range"/g) ?? []).length, 2);
  assert.ok(range.indexOf('value="20"') < range.indexOf('value="80"'));
  assert.equal((decimals.match(/data-md3-slider-stop=""/g) ?? []).length, 5);
});
