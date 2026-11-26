import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement, Fragment } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Tooltip } from '@flaut-travel/react-md3e/tooltip';

const trigger = createElement('button', { 'type': 'button', 'aria-label': 'Named action' }, 'Action');
const render = (title, props = {}) => renderToStaticMarkup(createElement(Tooltip, { title, ...props }, trigger));

test('empty nodes, nested arrays and fragments do not attach a dangling tooltip description', () => {
  for (const title of [
    null,
    undefined,
    false,
    true,
    '',
    [],
    [false, ''],
    createElement(Fragment),
    [createElement(Fragment, null, [null, ''])],
  ]) {
    const html = render(title, { open: true });

    assert.doesNotMatch(html, /aria-describedby/);
    assert.match(html, /aria-label="Named action"/);
  }
});

test('numbers including zero and formatted nodes keep server-rendered trigger semantics', () => {
  for (const title of ['Help', 0, 42, createElement('strong', null, 'Help'), createElement(Fragment, null, 'Help')]) {
    const html = render(title);

    assert.match(html, /aria-describedby="[^"]+"/);
    assert.match(html, /aria-label="Named action"/);
    assert.doesNotMatch(html, /role="tooltip"|<strong>|\[object Object\]/);
  }
});

test('rich tooltips require an explicit name or a nonempty headline without inspecting arbitrary JSX text', () => {
  for (const headline of [undefined, null, false, '', [], createElement(Fragment)]) {
    assert.throws(() => render('Details', { variant: 'rich', headline }), /requires a non-empty/);
  }

  assert.doesNotThrow(() => render('Details', { 'variant': 'rich', 'aria-label': 'Details' }));
  assert.doesNotThrow(() => render('Details', { 'variant': 'rich', 'aria-labelledby': 'external-heading' }));
  assert.doesNotThrow(() => render('Details', { variant: 'rich', headline: createElement('strong', null, 'Details') }));
});

test('disabled tooltips leave their trigger usable and preserve a consumer description', () => {
  const html = renderToStaticMarkup(
    createElement(
      Tooltip,
      { title: 'Help', disabled: true },
      createElement('button', { 'type': 'button', 'aria-describedby': 'existing' }, 'Action'),
    ),
  );

  assert.match(html, /aria-describedby="existing"/);
  assert.doesNotMatch(html, /disabled=""/);
  assert.doesNotMatch(render('Help', { variant: 'rich', headline: 'Heading', disabled: true }), /disabled=""/);
});
