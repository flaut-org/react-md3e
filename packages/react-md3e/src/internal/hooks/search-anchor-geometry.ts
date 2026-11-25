const textContexts = new WeakMap<Document, CanvasRenderingContext2D | null>();

/** The native input has no text DOM range; canvas supplies its actual font/letter-spacing metrics. */
function inputTextWidth(input: HTMLInputElement, style: CSSStyleDeclaration) {
  const document = input.ownerDocument;

  if (!textContexts.has(document)) {
    textContexts.set(document, document.createElement('canvas').getContext('2d'));
  }

  const context = textContexts.get(document);

  if (!context) {
    return 0;
  }

  const textStyle = input.value ? style : getComputedStyle(input, '::placeholder');

  context.font = `${textStyle.fontStyle} ${textStyle.fontWeight} ${textStyle.fontSize} ${textStyle.fontFamily}`;
  context.letterSpacing = textStyle.letterSpacing === 'normal' ? '0px' : textStyle.letterSpacing;

  return context.measureText(input.value || input.placeholder).width;
}

export function readSearchAnchor(bar: HTMLDivElement) {
  const rect = bar.getBoundingClientRect();
  const style = getComputedStyle(bar);
  const rtl = style.direction === 'rtl';
  const input = bar.querySelector<HTMLInputElement>('[data-md3-search-input]')!;
  const inputRect = input.getBoundingClientRect();
  const inputStyle = getComputedStyle(input);
  const leading = bar.querySelector<HTMLElement>('[data-md3-search-leading]')?.getBoundingClientRect();
  const trailing = bar.querySelector<HTMLElement>('[data-md3-search-trailing]')?.getBoundingClientRect();
  const paddingStart = parseFloat(rtl ? inputStyle.paddingRight : inputStyle.paddingLeft);
  const paddingEnd = parseFloat(rtl ? inputStyle.paddingLeft : inputStyle.paddingRight);
  const borderStart = parseFloat(rtl ? inputStyle.borderRightWidth : inputStyle.borderLeftWidth);
  const borderEnd = parseFloat(rtl ? inputStyle.borderLeftWidth : inputStyle.borderRightWidth);
  // Native text inputs expose an editing-area clientWidth; use the border box once, without double-subtracting padding.
  const contentWidth = inputRect.width - borderStart - borderEnd - paddingStart - paddingEnd;
  const textWidth = inputTextWidth(input, inputStyle);
  const space = Math.max(0, contentWidth - textWidth);
  const align = inputStyle.textAlign;
  const endAligned = align === 'end' || (rtl ? align === 'left' : align === 'right');
  let alignmentOffset = 0;

  if (align === 'center') {
    alignmentOffset = space / 2;
  } else if (endAligned) {
    alignmentOffset = space;
  }

  const inputStart = rtl ? rect.right - inputRect.right : inputRect.left - rect.left;
  const scrollOffset = rtl ? -input.scrollLeft : input.scrollLeft;
  const textStart =
    inputStart + borderStart + paddingStart + alignmentOffset - scrollOffset + (parseFloat(inputStyle.textIndent) || 0);
  const gap = parseFloat(style.columnGap) || 0;
  let leadingStart = 0;
  let trailingEnd = 0;

  if (leading) {
    leadingStart = rtl ? rect.right - leading.right : leading.left - rect.left;
  }

  if (trailing) {
    trailingEnd = rtl ? trailing.left - rect.left : rect.right - trailing.right;
  }

  return {
    '--_search-anchor-left': `${rect.left}px`,
    '--_search-anchor-top': `${rect.top}px`,
    '--_search-anchor-width': `${rect.width}px`,
    '--_search-anchor-height': `${rect.height}px`,
    '--_search-anchor-background': style.backgroundColor,
    '--_search-anchor-focus-shadow': style.boxShadow,
    '--_search-anchor-text-start': `${textStart}px`,
    '--_search-anchor-leading-width': `${leading?.width ?? 0}px`,
    '--_search-anchor-leading-gap': `${leading ? gap : 0}px`,
    '--_search-anchor-leading-start': `${leadingStart}px`,
    '--_search-anchor-leading-top': `${leading ? leading.top - rect.top : 0}px`,
    '--_search-anchor-leading-height': `${leading?.height ?? 0}px`,
    '--_search-anchor-trailing-width': `${trailing?.width ?? 0}px`,
    '--_search-anchor-trailing-gap': `${trailing ? gap : 0}px`,
    '--_search-anchor-trailing-end': `${trailingEnd}px`,
    '--_search-anchor-trailing-top': `${trailing ? trailing.top - rect.top : 0}px`,
    '--_search-anchor-trailing-height': `${trailing?.height ?? 0}px`,
  };
}
