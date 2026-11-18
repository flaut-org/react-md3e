import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Badge } from '@flaut-travel/react-md3e/badge';

function indicator(props) {
  const html = renderToStaticMarkup(createElement(Badge, props));
  const match = html.match(
    /aria-hidden="true" data-md3-badge-indicator="" data-variant="(.*?)" data-invisible="(.*?)">(.*?)<\/span>/,
  );

  assert.ok(match, html);

  return { variant: match[1], hidden: match[2] === 'true', label: match[3] };
}

test('Badge infers Material variants and handles empty labels and zero without hiding its anchor', () => {
  assert.deepEqual(indicator({}), { variant: 'small', hidden: false, label: '' });
  assert.deepEqual(indicator({ badgeContent: 7 }), { variant: 'large', hidden: false, label: '7' });
  assert.deepEqual(indicator({ variant: 'small', badgeContent: 7 }), { variant: 'small', hidden: false, label: '' });
  assert.equal(indicator({ badgeContent: 0 }).hidden, true);
  assert.equal(indicator({ badgeContent: 0.4 }).hidden, true);
  assert.equal(indicator({ badgeContent: 0, showZero: true }).hidden, false);
  assert.equal(indicator({ badgeContent: '0' }).hidden, false);

  for (const badgeContent of [null, undefined, '', '   ', -1, NaN, Infinity]) {
    assert.equal(indicator({ variant: 'large', badgeContent }).hidden, true);
  }

  const html = renderToStaticMarkup(createElement(Badge, { invisible: true, badgeContent: 7 }, 'Inbox'));

  assert.match(html, /data-anchored="true">Inbox/);
  assert.match(html, /data-invisible="true">7/);
});

test('counts cap at four characters and invalid limits never produce NaN or oversized labels', () => {
  for (const [badgeContent, max, label] of [
    [999, undefined, '999'],
    [1000, undefined, '999+'],
    [100, 99, '99+'],
    [4.9, 10.9, '4'],
    [1000, 10000, '999+'],
    [1000, Infinity, '999+'],
    [1000, NaN, '999+'],
    [1, -4, '0+'],
  ]) {
    assert.equal(indicator({ badgeContent, max }).label, label);
  }
});

test('status labels preserve Unicode graphemes when truncating and escape user text', () => {
  assert.equal(indicator({ badgeContent: ' New ' }).label, 'New');
  assert.equal(indicator({ badgeContent: 'Updated' }).label, 'Upd…');
  assert.equal(indicator({ badgeContent: '👩‍💻👩‍💻👩‍💻👩‍💻' }).label, '👩‍💻👩‍💻👩‍💻👩‍💻');
  assert.equal(indicator({ badgeContent: 'ééééé' }).label, 'ééé…');
  assert.equal(indicator({ badgeContent: '<&' }).label, '&lt;&amp;');
});
