import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Toolbar } from '@flaut-travel/react-md3e/toolbar';

const { distributeToolbarActions } = await import(
  new URL('../../../../dist/node/components/toolbar/toolbar-overflow/toolbar-overflow.helpers.js', import.meta.url)
);

const render = (props) => renderToStaticMarkup(createElement(Toolbar, { 'aria-label': 'Tools', ...props }, 'Content'));

test('server layout preserves native attributes, content, slots and passive group semantics', () => {
  const html = render({
    keyboardNavigation: false,
    id: 'tools',
    leading: 'Leading',
    trailing: 'Trailing',
    primaryAction: 'Primary',
  });

  assert.match(html, /data-variant="docked"/);
  assert.match(html, /role="group"/);
  assert.match(html, /id="tools"/);
  assert.match(html, /Leading/);
  assert.match(html, /Content/);
  assert.match(html, /Primary/);
  assert.match(html, /Trailing/);
});

test('collapsed server markup makes secondary content inert before hydration', () => {
  const html = render({ variant: 'floating', expanded: false, fab: 'FAB', color: 'vibrant', orientation: 'vertical' });

  assert.match(html, /data-expanded="false"/);
  assert.match(html, /data-md3-toolbar-surface="" data-md3-toolbar-collapsible=""[^>]* inert=""/);
  assert.match(html, /data-md3-toolbar-fab="" data-md3-toolbar-persistent="">FAB/);
  assert.match(html, /aria-orientation="vertical"/);
});

test('missing labels, unsupported docked orientation and inaccessible collapse configurations fail early', () => {
  assert.throws(() => render({ 'aria-label': '' }), /non-empty/);
  assert.throws(() => render({ variant: 'docked', orientation: 'vertical' }), /horizontal/);
  assert.throws(() => render({ variant: 'floating', defaultExpanded: false }), /primaryAction or fab/);
  assert.throws(() => render({ variant: 'floating', scrollBehavior: 'collapse' }), /primaryAction or fab/);
  assert.throws(() => render({ scrollThreshold: NaN }), /positive finite/);
  assert.throws(() => render({ scrollThreshold: 0 }), /positive finite/);
  assert.throws(
    () => render({ variant: 'floating', scrollBehavior: 'hide', expanded: false, fab: 'FAB' }),
    /mutually exclusive/,
  );
});

test('overflow honors priorities, declaration order, always/never and exact fractional boundaries', () => {
  const actions = [
    { id: 'copy' },
    { id: 'share', priority: 2 },
    { id: 'save', overflow: 'never' },
    { id: 'archive', overflow: 'always' },
  ];

  assert.deepEqual(distributeToolbarActions(actions, [48, 80, 60, 50], 210, 48, 4), ['copy', 'archive']);
  assert.deepEqual(distributeToolbarActions(actions, [48, 80, 60, 50], 280, 48, 4), ['archive']);
  assert.deepEqual(distributeToolbarActions(actions, [48, 80, 60, 50], 20, 48, 4), ['copy', 'share', 'archive']);
  assert.deepEqual(distributeToolbarActions([{ id: 'a' }, { id: 'b' }], [48, 48], 151.8, 48, 4), []);
  assert.deepEqual(distributeToolbarActions([{ id: 'a' }, { id: 'b' }], [48, 48], 150, 48, 4), ['b']);
});

test('redistribution supports insertion, removal, changed labels and restoration without stale ids', () => {
  assert.deepEqual(distributeToolbarActions([{ id: 'a' }, { id: 'b' }], [48, 48], 100, 48, 4), ['b']);
  assert.deepEqual(distributeToolbarActions([{ id: 'b' }], [48], 100, 48, 4), []);
  assert.deepEqual(distributeToolbarActions([{ id: 'b' }], [100], 100, 48, 4), ['b']);
  assert.deepEqual(distributeToolbarActions([{ id: 'b' }], [100], 200, 48, 4), []);
});
