import {
  appBarScrollTop,
  appBarTypographySignature,
  measureAppBar,
  resolveAppBarScrollTarget,
} from './app-bar-scroll-geometry';
import type { AppBarScrollBehavior, AppBarScrollTarget } from '../app-bar.types';

/** Passive scroll subscriptions update numeric geometry; all rules and spring motion live in CSS. */
export function observeAppBarScroll(
  marker: HTMLSpanElement,
  behavior: Exclude<AppBarScrollBehavior, 'none'>,
  target: AppBarScrollTarget | undefined,
  controlledScrolled: boolean | undefined,
) {
  const bar = marker.closest<HTMLElement>('[data-md3-app-bar]')!;
  const frame = bar.parentElement!;
  const source = resolveAppBarScrollTarget(frame, target);
  const row = bar.querySelector<HTMLElement>('[data-md3-app-bar-row]')!;
  const forcedColors = window.matchMedia('(forced-colors: active)');
  const navigation = row.querySelector<HTMLElement>('[data-md3-app-bar-navigation]')!;
  const actions = row.querySelector<HTMLElement>('[data-md3-app-bar-actions]')!;
  const label = bar.querySelector<HTMLElement>('[data-md3-app-bar-label]');
  let geometry = measureAppBar(bar, frame);
  let typography = appBarTypographySignature(bar);
  let previousTop = appBarScrollTop(source);
  let offset =
    behavior === 'pinned' || bar.contains(bar.ownerDocument.activeElement)
      ? 0
      : Math.min(previousTop, behavior === 'enterAlways' ? geometry.expanded : geometry.expanded - geometry.compact);
  let settleTimer: ReturnType<typeof setTimeout> | undefined;
  let measureFrame = 0;

  const paint = () => {
    const distance = geometry.expanded - geometry.compact;
    const progress = distance > 0 ? Math.min(1, offset / distance) : 0;
    const hidden = Math.max(0, offset - distance);

    bar.style.setProperty('--_app-bar-collapse', String(progress));
    bar.style.setProperty('--_app-bar-hidden-offset', `${hidden}px`);
    bar.dataset.collapsed = String(distance > 0 && progress >= 1);
    bar.dataset.hidden = String(hidden >= geometry.compact - 0.5);
    bar.dataset.scrolled = String(controlledScrolled ?? previousTop > 0);
  };
  const stopSettling = () => {
    if (bar.dataset.settling === 'true') {
      const rendered = bar.getBoundingClientRect().height;
      const { transform } = getComputedStyle(bar);
      const hidden = transform === 'none' ? 0 : -new DOMMatrixReadOnly(transform).m42;

      offset = Math.max(0, geometry.expanded - rendered + hidden);
      delete bar.dataset.settling;
      paint();
    }

    clearTimeout(settleTimer);
  };
  const settle = () => {
    clearTimeout(settleTimer);

    if (behavior === 'pinned' || bar.contains(bar.ownerDocument.activeElement)) {
      return;
    }

    const distance = geometry.expanded - geometry.compact;
    const base = behavior === 'enterAlways' && offset > distance ? distance : 0;
    const range = base > 0 || distance === 0 ? geometry.compact : distance;

    if (range > 0 && offset > base && offset < base + range) {
      bar.dataset.settling = 'true';
      // Commit the direct-manipulation pose before enabling the spring's target state.
      bar.getBoundingClientRect();
      offset = base + (offset - base > range / 2 ? range : 0);
      paint();
    }
  };
  const scroll = () => {
    const top = appBarScrollTop(source);
    const delta = top - previousTop;

    if (delta === 0) {
      return;
    }

    stopSettling();

    if (behavior !== 'pinned' && !bar.contains(bar.ownerDocument.activeElement)) {
      if (behavior === 'enterAlways') {
        offset = Math.max(0, Math.min(geometry.expanded, offset + delta));
      } else if (delta > 0) {
        offset = Math.min(geometry.expanded - geometry.compact, offset + delta);
      } else {
        offset = Math.min(offset, top);
      }

      if (top === 0) {
        offset = 0;
      }
    }

    previousTop = top;
    paint();
    settleTimer = setTimeout(settle, 120);
  };
  const reveal = () => {
    stopSettling();
    offset = 0;
    paint();
  };
  const measure = () => {
    measureFrame = 0;
    stopSettling();

    const previousDistance = geometry.expanded - geometry.compact;
    const previousHidden = Math.max(0, offset - previousDistance) / geometry.compact;
    const previousProgress = previousDistance > 0 ? Math.min(1, offset / previousDistance) : 0;

    geometry = measureAppBar(bar, frame);
    typography = appBarTypographySignature(bar);

    const distance = geometry.expanded - geometry.compact;

    offset = previousProgress * distance + previousHidden * geometry.compact;

    if (behavior === 'exitUntilCollapsed' && previousDistance === 0) {
      offset = Math.min(previousTop, distance);
    }

    paint();
    // Restore the measured state in one layout commit, without animating the temporary ruler poses.
    bar.getBoundingClientRect();
    delete bar.dataset.scrollMeasuring;
    settleTimer = setTimeout(settle, 120);
  };
  const requestMeasure = () => {
    if (!measureFrame) {
      measureFrame = requestAnimationFrame(measure);
    }
  };
  const resize = new ResizeObserver(() => {
    if (
      Math.abs(frame.getBoundingClientRect().width - geometry.width) > 0.5 ||
      Math.abs(navigation.getBoundingClientRect().width - geometry.navigationWidth) > 0.5 ||
      Math.abs(actions.getBoundingClientRect().width - geometry.actionsWidth) > 0.5 ||
      Math.abs(navigation.getBoundingClientRect().height - geometry.navigationHeight) > 0.5 ||
      Math.abs(actions.getBoundingClientRect().height - geometry.actionsHeight) > 0.5 ||
      appBarTypographySignature(bar) !== typography
    ) {
      requestMeasure();
    }
  });
  const mutation = new MutationObserver(requestMeasure);
  const restore = () => {
    previousTop = appBarScrollTop(source);
    offset =
      behavior === 'pinned'
        ? 0
        : Math.min(previousTop, behavior === 'enterAlways' ? geometry.expanded : geometry.expanded - geometry.compact);
    paint();
    requestMeasure();
  };

  paint();
  bar.getBoundingClientRect();
  delete bar.dataset.scrollMeasuring;
  resize.observe(frame);
  resize.observe(navigation);
  resize.observe(actions);

  if (label) {
    resize.observe(label);
    mutation.observe(label, {
      childList: true,
      characterData: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });
  }

  source.addEventListener('scroll', scroll, { passive: true });
  source.addEventListener('scrollend', settle);
  window.addEventListener('resize', requestMeasure);
  window.addEventListener('pageshow', restore);
  forcedColors.addEventListener('change', requestMeasure);
  bar.addEventListener('focusin', reveal);
  bar.ownerDocument.fonts.addEventListener('loadingdone', requestMeasure);

  return () => {
    source.removeEventListener('scroll', scroll);
    source.removeEventListener('scrollend', settle);
    window.removeEventListener('resize', requestMeasure);
    window.removeEventListener('pageshow', restore);
    forcedColors.removeEventListener('change', requestMeasure);
    bar.removeEventListener('focusin', reveal);
    bar.ownerDocument.fonts.removeEventListener('loadingdone', requestMeasure);
    resize.disconnect();
    mutation.disconnect();
    clearTimeout(settleTimer);
    cancelAnimationFrame(measureFrame);

    for (const key of ['scrollReady', 'scrollMeasuring', 'collapsed', 'hidden', 'settling']) {
      delete bar.dataset[key];
    }

    bar.dataset.scrolled = String(controlledScrolled ?? false);
    bar.style.removeProperty('--_app-bar-collapse');
    bar.style.removeProperty('--_app-bar-hidden-offset');

    for (const key of [
      'expanded-height',
      'compact-height',
      'row-height',
      'border-height',
      'label-start',
      'label-end',
      'label-padding',
    ]) {
      frame.style.removeProperty(`--_app-bar-${key}`);
    }
  };
}
