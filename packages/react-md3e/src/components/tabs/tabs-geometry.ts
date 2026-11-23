/** Reveal only inside the owning tab row; scrollIntoView would also move page ancestors. */
export function revealTab(tab: HTMLElement) {
  const list = tab.closest<HTMLElement>('[data-md3-tab-list]');

  if (list?.dataset.scrollable === 'true') {
    const bounds = list.getBoundingClientRect();
    const target = tab.getBoundingClientRect();
    const delta = target.left < bounds.left ? target.left - bounds.left : Math.max(0, target.right - bounds.right);

    if (delta !== 0) {
      list.scrollBy({ left: delta, behavior: 'instant' });
    }
  }
}
