'use client';

import { createElement, useContext, useId } from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRipple } from '../../../internal/hooks/use-ripple.hook';
import { rippleSurface } from '../../../internal/ripple/ripple.styles';
import { MenuContext } from '../contexts/menu.context';
import { MenuItemContent } from '../../menu-item-content/menu-item-content.component';
import { clickMenuItem, menuTextValue } from '../menu.helpers';
import { menuItem, menuItemBody } from '../../menu-item-content/menu-item-content.styles';
import type { MenuItemProps, MenuCheckboxItemProps, MenuRadioItemProps } from '../menu.types';

type ControlProps =
  | (MenuItemProps & { readonly kind: 'action' })
  | (MenuCheckboxItemProps & { readonly kind: 'checkbox' })
  | (MenuRadioItemProps & { readonly kind: 'radio' });

export function MenuItemControl({
  kind,
  disabled = false,
  disableRipple = false,
  closeOnClick,
  textValue,
  children,
  leading,
  trailing,
  supportingText,
  className,
  onClick,
  ...props
}: ControlProps) {
  const context = useContext(MenuContext);
  const labelId = useId();
  const descriptionId = useId();
  const isDisabled = disabled || context.disabled;
  const { ref: rippleRef, handlers } = useRipple(isDisabled || disableRipple);
  const content = (checked = false) => (
    <>
      <span ref={rippleRef} className={rippleSurface} aria-hidden="true" />
      <span className={menuItemBody} data-md3-menu-item-body="">
        <MenuItemContent
          leading={leading}
          trailing={trailing}
          supportingText={supportingText}
          checked={checked}
          labelId={labelId}
          descriptionId={descriptionId}
        >
          {children}
        </MenuItemContent>
      </span>
    </>
  );
  const common = {
    ...mergeProps<'div'>(handlers, { onClick: (event) => clickMenuItem(event, onClick) }),
    'className': [menuItem, className].filter(Boolean).join(' '),
    'data-md3-menu-item': '',
    'disabled': isDisabled,
    'label': menuTextValue(children, textValue),
    'aria-labelledby': props['aria-labelledby'] ?? (props['aria-label'] ? undefined : labelId),
    'aria-describedby': props['aria-describedby'] ?? (supportingText != null ? descriptionId : undefined),
  };

  if (kind === 'checkbox') {
    const { checked, defaultChecked, onChange, ref, ...itemProps } = props as MenuCheckboxItemProps;

    return (
      <BaseMenu.CheckboxItem
        {...mergeProps<'div'>(common, itemProps)}
        ref={ref}
        checked={checked}
        defaultChecked={defaultChecked}
        closeOnClick={closeOnClick ?? false}
        onCheckedChange={(next, details) => {
          const prevented = details.event.defaultPrevented;

          if (onChange?.(details.event, next) === false || (!prevented && details.event.defaultPrevented)) {
            details.cancel();
          }
        }}
        render={(attributes, state) => <div {...attributes}>{content(state.checked)}</div>}
      />
    );
  }

  if (kind === 'radio') {
    const { ref, value, ...itemProps } = props as MenuRadioItemProps;

    return (
      <BaseMenu.RadioItem
        {...mergeProps<'div'>(common, itemProps)}
        ref={ref}
        value={value}
        closeOnClick={closeOnClick ?? true}
        render={(attributes, state) => <div {...attributes}>{content(state.checked)}</div>}
      />
    );
  }

  const { selected = false, href, target, rel, download, ref, ...itemProps } = props as MenuItemProps;

  return (
    <BaseMenu.Item
      {...mergeProps<'div'>(common, itemProps)}
      ref={ref}
      closeOnClick={closeOnClick ?? true}
      data-selected={selected}
      render={
        href ? createElement('a', { href: isDisabled ? undefined : href, target, rel, download }, content()) : undefined
      }
    >
      {content()}
    </BaseMenu.Item>
  );
}
