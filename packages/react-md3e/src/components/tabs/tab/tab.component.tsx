'use client';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRipple } from '../../../internal/hooks/use-ripple.hook';
import { revealTab } from '../tabs-geometry';
import { rippleSurface } from '../../../internal/ripple/ripple.styles';
import { tabRoot, tabFocusRing } from '../tabs.styles';
import { TabContent } from './tab-content/tab-content.component';
import type { TabProps } from '../tabs.types';

export function Tab({
  value,
  label,
  icon,
  iconPosition,
  badge,
  disabled = false,
  disableRipple = false,
  children,
  className,
  ...props
}: TabProps) {
  const { ref: rippleRef, handlers } = useRipple(disabled || disableRipple);
  const text = label ?? children;
  const buttonProps = mergeProps<'button'>(handlers, { onFocus: (event) => revealTab(event.currentTarget) }, props);

  if (text == null && !props['aria-label']?.trim() && !props['aria-labelledby']?.trim()) {
    throw new TypeError('An icon-only Tab requires a non-empty aria-label or aria-labelledby.');
  }

  return (
    <BaseTabs.Tab
      {...buttonProps}
      onClick={(event) => {
        buttonProps.onClick?.(event);

        if (event.defaultPrevented) {
          event.preventBaseUIHandler();
        }
      }}
      onFocus={(event) => {
        buttonProps.onFocus?.(event);

        if (event.defaultPrevented) {
          event.preventBaseUIHandler();
        }
      }}
      value={value}
      disabled={disabled}
      type="button"
      className={[tabRoot, className].filter(Boolean).join(' ')}
      data-md3-tab=""
      data-with-icon={icon != null}
      data-with-label={text != null}
      data-icon-position={iconPosition}
      render={(nativeProps, state) => (
        <button {...nativeProps} type="button">
          <span ref={rippleRef} className={rippleSurface} aria-hidden="true" />
          <span className={tabFocusRing} data-md3-tab-focus-ring="" aria-hidden="true" />
          <TabContent active={state.active} label={text} icon={icon} badge={badge} />
        </button>
      )}
    />
  );
}
