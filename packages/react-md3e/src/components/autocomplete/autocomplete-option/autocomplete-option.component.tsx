'use client';

import { Combobox } from '@base-ui/react/combobox';
import { ListItemContent } from '../../list-item-content/list-item-content.component';
import { SelectionIndicator } from '../../selection-indicator/selection-indicator.component';
import { autocompleteOption } from './autocomplete-option.styles';
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
  return (
    <Combobox.Item
      value={option}
      index={index}
      disabled={disabled}
      className={autocompleteOption}
      render={(props, state) =>
        renderOption ? (
          renderOption(props, option, { selected: state.selected, inputValue, index })
        ) : (
          <div {...props}>
            <ListItemContent
              primary={label}
              indicator={<SelectionIndicator variant="checkmark" checked={state.selected} />}
            />
          </div>
        )
      }
    />
  );
}
