import type { Locator } from '@playwright/test';

/** Capture CSS motion in the browser's mutation microtask, before a delayed test command can miss it. */
export async function pauseMotionOnAttributeChange(
  scope: Locator,
  attribute: string,
  options: { readonly value?: string | null; readonly selector?: string } = {},
) {
  await scope.evaluate(
    (node, settings) => {
      const observer = new MutationObserver((records) => {
        const target = records.find(
          (record) =>
            record.target instanceof Element &&
            (settings.selector ? record.target.matches(settings.selector) : record.target === node) &&
            (settings.value === undefined || record.target.getAttribute(settings.attribute) === settings.value),
        )?.target;

        if (target instanceof Element) {
          observer.disconnect();

          for (const animation of target.getAnimations({ subtree: true })) {
            animation.pause();
            animation.currentTime = 0;
          }
        }
      });

      observer.observe(node, {
        attributes: true,
        subtree: Boolean(settings.selector),
        attributeFilter: [settings.attribute],
      });
    },
    { attribute, ...options },
  );
}
