import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LoadingIndicator, ProgressIndicator } from '@flaut-travel/react-md3e';

for (const Component of [LoadingIndicator, ProgressIndicator]) {
  test(`${Component.name} server markup has named progress semantics and a clamped finite range`, () => {
    const render = (props) => renderToStaticMarkup(createElement(Component, { 'aria-label': 'Operation', ...props }));

    assert.match(render({ value: -10 }), /aria-valuenow="0"/);
    assert.match(render({ value: 120 }), /aria-valuenow="100"/);
    assert.match(render({ value: 30, min: 10, max: 50 }), /aria-valuemin="10" aria-valuemax="50" aria-valuenow="30"/);
    assert.match(render({ value: 30, min: 10, max: 50 }), /role="progressbar"/);
    assert.doesNotMatch(render({ value: null }), /aria-valuenow=/);
    assert.doesNotMatch(render({}), /aria-valuenow=/);

    for (const value of [NaN, Infinity, -Infinity]) {
      assert.throws(() => render({ value }), /finite/);
    }

    for (const range of [
      { min: 10, max: 10 },
      { min: 50, max: 0 },
      { min: NaN },
      { max: Infinity },
      { min: -Number.MAX_VALUE, max: Number.MAX_VALUE },
    ]) {
      assert.throws(() => render({ ...range, value: 20 }), /range/);
    }
  });
}

test('ProgressIndicator validates mode/thickness and explicit indeterminate mode ignores a stale numeric value', () => {
  const render = (props) =>
    renderToStaticMarkup(createElement(ProgressIndicator, { 'aria-label': 'Operation', ...props }));

  assert.throws(() => render({ variant: 'determinate' }), /numeric value/);
  assert.throws(() => render({ thickness: 6 }), /4 or 8/);
  assert.doesNotMatch(render({ variant: 'indeterminate', value: 60 }), /aria-valuenow=/);
  assert.match(render({ value: 100 }), /data-complete="true"/);
  assert.match(render({ value: 0 }), /data-empty="true"/);
});
