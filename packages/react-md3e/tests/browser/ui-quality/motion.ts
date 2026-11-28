import { mkdir, writeFile } from 'node:fs/promises';
import type { Page, TestInfo } from '@playwright/test';

/** Arm before the action: records real intermediate frames without pausing or finishing animations. */
export async function recordMotion(page: Page, targets: Record<string, string>, maxFrames = 360) {
  const recorder = await page.evaluateHandle(
    ({ selectors, limit }) => {
      const identify = (node: EventTarget | null) => {
        if (!(node instanceof Element)) {
          return '';
        }

        return node.getAttribute('data-testid') || node.id || node.getAttribute('aria-label') || node.tagName;
      };
      const rect = (node: Element) => {
        const box = node.getBoundingClientRect();

        return { x: box.x, y: box.y, width: box.width, height: box.height };
      };
      const measure = (node: HTMLElement) => {
        const box = rect(node);
        const style = getComputedStyle(node);
        const clippedBy: string[] = [];
        const ancestors: { target: string; scrollLeft: number; scrollTop: number }[] = [];

        if (
          box.x < -1 ||
          box.y < -1 ||
          box.x + box.width > window.innerWidth + 1 ||
          box.y + box.height > window.innerHeight + 1
        ) {
          clippedBy.push('viewport');
        }

        for (let ancestor = node.parentElement; ancestor; ancestor = ancestor.parentElement) {
          ancestors.push({
            target: identify(ancestor),
            scrollLeft: ancestor.scrollLeft,
            scrollTop: ancestor.scrollTop,
          });

          const ancestorStyle = getComputedStyle(ancestor);
          const bounds = ancestor.getBoundingClientRect();
          const clipsX = /hidden|clip|scroll|auto/.test(ancestorStyle.overflowX);
          const clipsY = /hidden|clip|scroll|auto/.test(ancestorStyle.overflowY);

          if (
            (clipsX && (box.x < bounds.x - 1 || box.x + box.width > bounds.right + 1)) ||
            (clipsY && (box.y < bounds.y - 1 || box.y + box.height > bounds.bottom + 1))
          ) {
            clippedBy.push(identify(ancestor));
          }
        }

        return {
          ...box,
          opacity: Number(style.opacity),
          rendered: node.getClientRects().length > 0,
          visibility: style.visibility,
          transform: style.transform,
          fontSize: style.fontSize,
          scrollLeft: node.scrollLeft,
          scrollTop: node.scrollTop,
          ancestors,
          clippedBy,
          scrollbarX: /auto|scroll/.test(style.overflowX) && node.scrollWidth > node.clientWidth + 1,
          scrollbarY: /auto|scroll/.test(style.overflowY) && node.scrollHeight > node.clientHeight + 1,
          animations: node.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running')
            .length,
        };
      };
      const frames: {
        time: number;
        activeElement: string;
        viewport: { x: number; y: number; width: number; height: number };
        elements: Record<string, ReturnType<typeof measure>>;
      }[] = [];
      const resizes: { time: number; target: string; width: number; height: number }[] = [];
      const focus: { time: number; type: string; target: string; related: string }[] = [];
      const shifts: { time: number; value: number; hadRecentInput: boolean }[] = [];
      const observed = new WeakSet<Element>();
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          resizes.push({ time: performance.now(), target: identify(entry.target), ...rect(entry.target) });
        }
      });
      const onFocus = (event: FocusEvent) => {
        focus.push({
          time: performance.now(),
          type: event.type,
          target: identify(event.target),
          related: identify(event.relatedTarget),
        });
      };
      const layoutShiftSupported = PerformanceObserver.supportedEntryTypes.includes('layout-shift');
      const shiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };

          shifts.push({ time: shift.startTime, value: shift.value, hadRecentInput: shift.hadRecentInput });
        }
      });

      if (layoutShiftSupported) {
        shiftObserver.observe({ type: 'layout-shift' });
      }

      document.addEventListener('focusin', onFocus);
      document.addEventListener('focusout', onFocus);

      let running = true;
      let frameId = 0;

      const sample = () => {
        const elements: Record<string, ReturnType<typeof measure>> = {};

        for (const [name, selector] of Object.entries(selectors)) {
          const node = document.querySelector<HTMLElement>(selector);

          if (node) {
            elements[name] = measure(node);

            if (!observed.has(node)) {
              resizeObserver.observe(node);
              observed.add(node);
            }
          }
        }

        frames.push({
          time: performance.now(),
          activeElement: identify(document.activeElement),
          viewport: { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight },
          elements,
        });

        if (running && frames.length < limit) {
          frameId = requestAnimationFrame(sample);
        }
      };

      sample();

      return {
        stop() {
          running = false;
          cancelAnimationFrame(frameId);
          sample();
          resizeObserver.disconnect();
          shiftObserver.disconnect();
          document.removeEventListener('focusin', onFocus);
          document.removeEventListener('focusout', onFocus);

          return { frames, resizes, focus, shifts, layoutShiftSupported, truncated: frames.length >= limit };
        },
      };
    },
    { selectors: targets, limit: maxFrames },
  );

  return {
    async stop(testInfo: TestInfo, name = 'motion') {
      const data = await recorder.evaluate((state) => state.stop());
      const file = testInfo.outputPath(`${name}.json`);

      await recorder.dispose();
      await mkdir(testInfo.outputDir, { recursive: true });
      await writeFile(file, JSON.stringify(data, null, 2));
      await testInfo.attach(`${name}.json`, { path: file, contentType: 'application/json' });

      return data;
    },
  };
}

export async function captureFrames(page: Page, testInfo: TestInfo, name: string, count = 5, framesBetween = 2) {
  for (let index = 0; index < count; index += 1) {
    await page.evaluate(async (frames) => {
      for (let frame = 0; frame < frames; frame += 1) {
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        });
      }
    }, framesBetween);

    const file = testInfo.outputPath(`${name}-${index}.png`);

    await page.screenshot({ path: file, animations: 'allow' });
    await testInfo.attach(`${name}-${index}.png`, { path: file, contentType: 'image/png' });
  }
}
