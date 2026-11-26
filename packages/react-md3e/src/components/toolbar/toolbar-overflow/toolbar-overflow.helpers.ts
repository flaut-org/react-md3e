import type { ToolbarOverflowAction } from '../toolbar.types';

/** Stable greedy distribution: never-overflow controls stay accessible through local scrolling. */
export function distributeToolbarActions(
  actions: readonly Pick<ToolbarOverflowAction, 'id' | 'overflow' | 'priority'>[],
  sizes: readonly number[],
  available: number,
  triggerSize: number,
  gap: number,
) {
  const hidden = new Set(actions.filter((action) => action.overflow === 'always').map((action) => action.id));
  let occupied = triggerSize;
  const candidates = actions
    .map((action, index) => ({ action, index }))
    .filter(({ action }) => action.overflow !== 'always')
    .sort((a, b) => {
      const required = Number(b.action.overflow === 'never') - Number(a.action.overflow === 'never');

      return required || (b.action.priority ?? 0) - (a.action.priority ?? 0) || a.index - b.index;
    });

  for (const { action, index } of candidates) {
    const size = (sizes[index] ?? 0) + gap;

    if (action.overflow === 'never' || occupied + size <= available + 0.5) {
      occupied += size;
    } else {
      hidden.add(action.id);
    }
  }

  return actions.filter((action) => hidden.has(action.id)).map((action) => action.id);
}
