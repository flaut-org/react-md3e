'use client';

import { Combobox } from '@base-ui/react/combobox';
import { cloneElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { useRipple } from '../../../internal/hooks/use-ripple.hook';
import { rippleSurface } from '../../../internal/ripple/ripple.styles';
import { MenuItemContent } from '../../menu-item-content/menu-item-content.component';
import { menuItem, menuItemBody } from '../../menu-item-content/menu-item-content.styles';
import type { AutocompleteProps } from '../autocomplete.types';

export function AutocompleteOption<T>({
  option,
  index,
  label,
  disabled,
  inputValue,
  renderOption,
}: {
  readonly option: T;
  readonly index: number;
  readonly label: string;
  readonly disabled: boolean;
  readonly inputValue: string;
  readonly renderOption: AutocompleteProps<T>['renderOption'];
}) {
  const { ref: rippleRef, handlers } = useRipple(disabled);

  return (
    <Combobox.Item
      {...handlers}
      value={option}
      index={index}
      disabled={disabled}
      className={menuItem}
      data-md3-menu-item=""
      render={(props, state) => {
        const attributes = { ...props, 'data-focus-visible': state.highlighted ? '' : undefined };
        const element = (
          renderOption ? (
            renderOption(attributes, option, { selected: state.selected, inputValue, index })
          ) : (
            <div {...attributes}>
              <MenuItemContent checked={state.selected}>{label}</MenuItemContent>
            </div>
          )
        ) as ReactElement<{ readonly children?: ReactNode }>;

        return cloneElement(
          element,
          undefined,
          <>
            <span ref={rippleRef} className={rippleSurface} aria-hidden="true" />
            <span className={menuItemBody} data-md3-menu-item-body="">
              {element.props.children}
            </span>
          </>,
        );
      }}
    />
  );
}
