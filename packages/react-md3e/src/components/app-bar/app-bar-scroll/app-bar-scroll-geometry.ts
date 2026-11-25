import type { AppBarScrollTarget } from '../app-bar.types';

export function resolveAppBarScrollTarget(frame: HTMLElement, target: AppBarScrollTarget | undefined) {
  const explicit = typeof target === 'function' ? target() : target;

  if (explicit) {
    return explicit;
  }

  let ancestor = frame.parentElement;

  while (ancestor && ancestor !== frame.ownerDocument.body && ancestor !== frame.ownerDocument.documentElement) {
    if (/(auto|scroll|overlay)/.test(getComputedStyle(ancestor).overflowY)) {
      return ancestor;
    }

    ancestor = ancestor.parentElement;
  }

  return window;
}

export function appBarScrollTop(target: HTMLElement | Window) {
  const isWindow = 'document' in target;
  const extent = isWindow
    ? target.document.documentElement.scrollHeight - target.innerHeight
    : target.scrollHeight - target.clientHeight;
  const offset = isWindow ? target.scrollY : target.scrollTop;

  return Math.max(0, Math.min(offset, Math.max(0, extent)));
}

/** Exclude animated sizes: only actual inherited typography changes require new natural geometry. */
export function appBarTypographySignature(bar: HTMLElement) {
  const style = getComputedStyle(bar);
  const roles = ['title-large', 'label-medium', 'headline-medium', 'label-large', 'display-small', 'title-medium'];

  return [
    getComputedStyle(bar.ownerDocument.documentElement).fontSize,
    ...roles.flatMap((role) =>
      ['font', 'size', 'line-height', 'weight', 'tracking'].map((part) =>
        style.getPropertyValue(`--md-sys-typescale-${role}-${part}`),
      ),
    ),
  ].join('|');
}

/** Measure the same live label in both layouts, preserving its DOM, IDs, state and focus. */
export function measureAppBar(header: HTMLElement, frame: HTMLElement) {
  const bar = header;
  const row = bar.querySelector<HTMLElement>('[data-md3-app-bar-row]')!;
  const label = bar.querySelector<HTMLElement>(':scope > [data-md3-app-bar-content] > [data-md3-app-bar-label]');
  const navigation = row.querySelector<HTMLElement>('[data-md3-app-bar-navigation]')!;
  const actions = row.querySelector<HTMLElement>('[data-md3-app-bar-actions]')!;
  const { collapsed } = bar.dataset;

  bar.dataset.scrollMeasuring = 'expanded';
  delete bar.dataset.collapsed;

  const expandedHeight = bar.getBoundingClientRect().height;
  const rowHeight = row.getBoundingClientRect().height;
  const borderHeight = bar.offsetHeight - bar.clientHeight;
  const labelPadding = label ? getComputedStyle(label).paddingBlockEnd : '0px';
  const navigationWidth = navigation.getBoundingClientRect().width;
  const actionsWidth = actions.getBoundingClientRect().width;
  const centered = bar.dataset.titleAlign === 'center';
  const start = (centered ? Math.max(navigationWidth, actionsWidth) : navigationWidth) + 8;
  const end = (centered ? Math.max(navigationWidth, actionsWidth) : actionsWidth) + 8;

  frame.style.setProperty('--_app-bar-expanded-height', `${expandedHeight}px`);
  frame.style.setProperty('--_app-bar-compact-height', `${rowHeight + borderHeight}px`);
  frame.style.setProperty('--_app-bar-row-height', `${rowHeight}px`);
  frame.style.setProperty('--_app-bar-border-height', `${borderHeight}px`);
  frame.style.setProperty('--_app-bar-label-start', `${start}px`);
  frame.style.setProperty('--_app-bar-label-end', `${end}px`);
  frame.style.setProperty('--_app-bar-label-padding', labelPadding);
  bar.dataset.scrollReady = 'true';
  bar.dataset.scrollMeasuring = 'compact';
  bar.style.setProperty('--_app-bar-collapse', '1');
  bar.dataset.collapsed = 'true';

  const compactHeight = label
    ? Math.max(rowHeight, label.getBoundingClientRect().height + 8) + borderHeight
    : expandedHeight;
  const fullHeight = Math.max(expandedHeight, compactHeight);

  frame.style.setProperty('--_app-bar-expanded-height', `${fullHeight}px`);
  frame.style.setProperty('--_app-bar-compact-height', `${compactHeight}px`);

  if (collapsed === undefined) {
    delete bar.dataset.collapsed;
  } else {
    bar.dataset.collapsed = collapsed;
  }

  return {
    expanded: fullHeight,
    compact: compactHeight,
    width: frame.getBoundingClientRect().width,
    navigationWidth,
    actionsWidth,
    navigationHeight: navigation.getBoundingClientRect().height,
    actionsHeight: actions.getBoundingClientRect().height,
  };
}
