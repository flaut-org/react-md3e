/** An inert DOM picture preserves the source adornment's appearance without mounting its React tree twice. */
export function copySearchAdornment(source: HTMLElement | null, host: HTMLDivElement) {
  host.replaceChildren();

  if (!source) {
    return;
  }

  const picture = source.cloneNode(true) as HTMLElement;
  const style = getComputedStyle(source);

  for (const node of [picture, ...picture.querySelectorAll('*')]) {
    for (const name of ['id', 'name', 'form', 'autofocus', 'tabindex']) {
      node.removeAttribute(name);
    }

    // Search's live slot selectors must not apply a second time to its decorative picture.
    for (const name of node.getAttributeNames()) {
      if (name.startsWith('data-md3-search-')) {
        node.removeAttribute(name);
      }
    }
  }

  picture.style.setProperty('color', style.color);
  picture.style.setProperty('--_search-bar-leading-color', style.color);
  picture.style.setProperty(
    '--md-comp-icon-button-standard-color',
    style.getPropertyValue('--md-comp-icon-button-standard-color') || style.color,
  );
  host.append(picture);
}

/** Supply only stable layout measurements. Native CSS interpolates the slots and text indent. */
export function measureSearchViewInput(bar: HTMLDivElement, input: HTMLInputElement, popup: HTMLElement) {
  const barStyle = getComputedStyle(bar);
  const inputStyle = getComputedStyle(input);
  // Subtracting animated DOM rectangles introduces rounding noise and retargets the text every frame.
  // The zero-gap flex row's base is its static box edges, independent of the leading slot's width.
  const base =
    parseFloat(barStyle.paddingInlineStart) +
    parseFloat(barStyle.borderInlineStartWidth) +
    parseFloat(inputStyle.paddingInlineStart) +
    parseFloat(inputStyle.borderInlineStartWidth) +
    (parseFloat(inputStyle.marginInlineStart) || 0);
  const trailing = bar.querySelector<HTMLElement>('[data-md3-search-view-trailing]')!;
  const trailingWidth = trailing.getBoundingClientRect().width;

  popup.style.setProperty('--_search-view-input-base', `${base}px`);
  popup.style.setProperty('--_search-view-trailing-width', `${trailingWidth}px`);
  popup.style.setProperty('--_search-view-trailing-gap', `${trailingWidth > 0 ? 4 : 0}px`);
}
