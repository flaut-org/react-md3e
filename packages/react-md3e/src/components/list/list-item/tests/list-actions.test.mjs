import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { IconButton, List, ListItem } from '@flaut-travel/react-md3e';

const render = (props) => renderToStaticMarkup(createElement(List, null, createElement(ListItem, props)));

test('action rows render list, listitem and native action semantics without selection', () => {
  const button = render({ primary: 'Open trip', action: { onClick() {} } });
  const link = render({ primary: 'Visit trip', action: { href: '/journeys', target: '_blank', rel: 'noopener' } });

  assert.match(button, /<ul[^>]*data-md3-list=""/);
  assert.match(button, /<li[^>]*data-md3-list-item=""/);
  assert.match(button, /<button[^>]*type="button"/);
  assert.doesNotMatch(button, /aria-selected|aria-pressed|role="option"|role="listbox"/);
  assert.match(link, /<a[^>]*href="\/journeys"[^>]*target="_blank"[^>]*rel="noopener"/);
});

test('multi-action SSR places independently named native actions in sibling areas', () => {
  const html = render({
    primary: 'Journey details',
    action: { href: '/journey' },
    trailingAction: createElement(IconButton, { 'aria-label': 'Save journey' }, 'star'),
  });

  assert.match(html, /<\/a><span[^>]*data-action-position="end"[^>]*><button/);
  assert.doesNotMatch(html, /aria-hidden="true"[^>]*><button/);
  assert.doesNotMatch(html, /<a\b[^>]*>(?:(?!<\/a>).)*<button/);
});

test('disabled actions keep their announced role and cannot retain a navigation destination', () => {
  const button = render({ primary: 'Disabled', disabled: true, action: {} });
  const link = render({ primary: 'Disabled', disabled: true, action: { href: '/disabled' } });

  assert.match(button, /<button[^>]*disabled=""/);
  assert.match(link, /role="link" aria-disabled="true" tabindex="-1"/);
  assert.doesNotMatch(link, /href=/);
});

test('expansion has deterministic server IDs, controlled precedence and hidden kept content', () => {
  const content = createElement('button', { type: 'button' }, 'Nested action');
  const closed = render({ id: 'folder', primary: 'Folder', expansion: { content, keepMounted: true } });
  const open = render({ id: 'folder', primary: 'Folder', expansion: { content, defaultOpen: true } });
  const controlled = render({
    id: 'folder',
    primary: 'Folder',
    expansion: { content, open: false, defaultOpen: true },
  });

  assert.match(closed, /id="folder-trigger"/);
  assert.match(closed, /aria-expanded="false"/);
  assert.match(closed, /aria-controls="folder-panel"/);
  assert.match(closed, /inert="" aria-hidden="true"/);
  assert.match(closed, /Nested action/);
  assert.match(open, /aria-expanded="true"/);
  assert.match(open, /Nested action/);
  assert.doesNotMatch(controlled, /Nested action/);

  const panelId = /aria-controls="([^"]+)"/.exec(open)?.[1];

  assert.ok(panelId);
  assert.ok(open.includes(`id="${panelId}"`));
});

test('selection lists reject action and expansion rows at runtime', () => {
  for (const props of [{ action: {} }, { expansion: { content: 'Nested content' } }]) {
    assert.throws(
      () =>
        renderToStaticMarkup(
          createElement(
            List,
            { 'selectionMode': 'single', 'aria-label': 'Options' },
            createElement(ListItem, { primary: 'Invalid', ...props }),
          ),
        ),
      /require a List without selection/,
    );
  }
});
