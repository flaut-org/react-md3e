'use client';

import { useId, useRef, useState } from 'react';
import { Combobox } from '@base-ui/react/combobox';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { useMergedRefs } from '../../internal/hooks/use-merged-refs.hook';
import { useControlledInputGuard } from '../../internal/hooks/use-controlled-input-guard.hook';
import { useSelectOnFocus } from '../../internal/hooks/use-select-on-focus.hook';
import { usePortalContainer } from '../../internal/hooks/use-portal-container.hook';
import { TextField } from '../text-field/text-field.component';
import { MenuSurface } from '../menu-surface/menu-surface.component';
import { menuItemBody } from '../menu-item-content/menu-item-content.styles';
import { AutocompleteInput } from './autocomplete-input/autocomplete-input.component';
import { AutocompleteOption } from './autocomplete-option/autocomplete-option.component';
import { AutocompleteChip } from './autocomplete-chip/autocomplete-chip.component';
import { defaultOptionLabel, defaultOptionValue, normalizeOptionText } from './autocomplete.helpers';
import {
  autocompleteRoot,
  autocompletePositioner,
  autocompletePopup,
  autocompleteList,
  autocompleteStatus,
  autocompleteAction,
} from './autocomplete.styles';
import type {
  AutocompleteProps,
  AutocompleteValue,
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
  AutocompleteCloseReason,
  AutocompleteRenderInputParams,
} from './autocomplete.types';

export function Autocomplete<T, Multiple extends boolean = false>({
  options,
  multiple,
  value,
  defaultValue,
  onChange,
  inputValue,
  defaultInputValue,
  onInputChange,
  getOptionLabel = defaultOptionLabel,
  getOptionKey,
  getOptionValue,
  getOptionDisabled,
  isOptionEqualToValue = Object.is,
  filterOptions,
  filterSelectedOptions = false,
  renderInput,
  renderOption,
  label,
  helperText,
  placeholder,
  variant = 'outlined',
  error = false,
  fullWidth = false,
  disabled = false,
  readOnly = false,
  required = false,
  name,
  form,
  inputRef,
  disableClearable = false,
  clearOnEscape = false,
  selectOnFocus = false,
  autoHighlight = false,
  openOnFocus = false,
  disableListWrap = false,
  open,
  defaultOpen,
  onOpen,
  onClose,
  loading = false,
  loadingText = 'Loading…',
  noOptionsText = 'No options',
  clearText = 'Clear',
  openText = 'Open',
  closeText = 'Close',
  container,
  id: suppliedId,
  className,
  dir,
  onKeyDownCapture,
  ...props
}: AutocompleteProps<T, Multiple>) {
  const generatedId = useId();
  const selectionHandlers = useSelectOnFocus(selectOnFocus && !disabled && !readOnly);
  const id = suppliedId ?? generatedId;
  const anchor = useRef<HTMLDivElement>(null);
  const containerRef = useMergedRefs(anchor, undefined);
  const nativeInputRef = useMergedRefs(inputRef, undefined);
  const { anchorRef, host, direction } = usePortalContainer(container);
  const [internalValue, setInternalValue] = useState<AutocompleteValue<T, Multiple>>(
    () => defaultValue ?? ((multiple ? [] : null) as AutocompleteValue<T, Multiple>),
  );
  const selected = value === undefined ? internalValue : value;
  const singleSelection = selected == null ? [] : [selected as T];
  const selectedOptions: T[] = multiple ? (selected as T[]) : singleSelection;
  const selectedLabel = !multiple && selectedOptions[0] != null ? getOptionLabel(selectedOptions[0]) : '';
  const [query, setQuery] = useState(defaultInputValue ?? selectedLabel);
  const [previousLabel, setPreviousLabel] = useState(selectedLabel);

  // Escape clearing owns the query during the popup's closing transition. Keep programmatic
  // selection changes in sync while preserving independently controlled/default input text.
  if (previousLabel !== selectedLabel) {
    setPreviousLabel(selectedLabel);

    if (clearOnEscape && inputValue === undefined && defaultInputValue === undefined) {
      setQuery(selectedLabel);
    }
  }

  const currentQuery = inputValue ?? query;
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const currentOpen = open ?? internalOpen;
  const inputGuard = useControlledInputGuard(inputValue, currentOpen);
  const availableOptions = filterSelectedOptions
    ? options.filter((option) => !selectedOptions.some((entry) => isOptionEqualToValue(option, entry)))
    : options;
  const filtered = filterOptions?.(options, { inputValue: currentQuery, getOptionLabel });
  const visible = filtered?.filter(
    (option) => !filterSelectedOptions || !selectedOptions.some((entry) => isOptionEqualToValue(option, entry)),
  );
  const handleSelection = (next: AutocompleteValue<T, Multiple>, details: Combobox.Root.ChangeEventDetails) => {
    if (details.reason === 'escape-key' && (!clearOnEscape || disableClearable)) {
      details.cancel();
      details.allowPropagation();
    } else {
      let reason: AutocompleteChangeReason = 'selectOption';

      if (details.reason === 'clear-press' || (!multiple && next === null)) {
        reason = 'clear';
      } else if (
        details.reason === 'chip-remove-press' ||
        (multiple && Array.isArray(next) && next.length < selectedOptions.length)
      ) {
        reason = 'removeOption';
      }

      const wasPrevented = details.event.defaultPrevented;

      onChange?.(details.event, next, reason);

      if (!wasPrevented && details.event.defaultPrevented) {
        details.cancel();
      } else if (value === undefined) {
        setInternalValue(next);
      }
    }
  };
  const handleInput = (next: string, details: Combobox.Root.ChangeEventDetails) => {
    if (details.reason === 'escape-key' && (!clearOnEscape || disableClearable)) {
      details.cancel();
      details.allowPropagation();
    } else if (
      inputGuard.isStaleReset(
        (details.reason === 'none' || details.reason === 'input-clear') && details.event.type === 'base-ui',
      )
    ) {
      details.cancel();
    } else {
      let reason: AutocompleteInputChangeReason = 'reset';

      if (details.reason === 'escape-key') {
        reason = 'clear';
      } else if (details.reason === 'input-change') {
        reason = 'input';
      } else if (details.reason === 'clear-press') {
        reason = 'clear';
      } else if (details.reason === 'input-clear') {
        reason = details.isItemPress ? 'selectOption' : 'reset';
      } else if (details.reason === 'item-press') {
        reason = 'selectOption';
      } else if (details.reason === 'focus-out') {
        reason = 'blur';
      }

      const wasPrevented = details.event.defaultPrevented;

      onInputChange?.(details.event, next, reason);

      if (!wasPrevented && details.event.defaultPrevented) {
        details.cancel();
      } else {
        inputGuard.accept(next);
        setQuery(next);
      }
    }
  };
  const params: AutocompleteRenderInputParams = {
    id,
    label,
    helperText,
    variant,
    error,
    'fullWidth': true,
    disabled,
    readOnly,
    required,
    ...(placeholder !== undefined && { placeholder }),
    'inputRef': nativeInputRef,
    'aria-label': props['aria-label'],
    'aria-labelledby': props['aria-labelledby'],
    ...(multiple && { InputLabelProps: { shrink: true } }),
    'slots': { input: multiple ? Combobox.Chips : Combobox.InputGroup, htmlInput: AutocompleteInput },
    'slotProps': {
      htmlInput: {
        onFocus: (event) => {
          selectionHandlers.onFocus(event);

          if (openOnFocus && !currentOpen && !disabled && !readOnly) {
            onOpen?.(event.nativeEvent);

            if (!event.defaultPrevented && !event.nativeEvent.defaultPrevented && open === undefined) {
              setInternalOpen(true);
            }
          }
        },
        onMouseUp: selectionHandlers.onMouseUp,
        onBlur: selectionHandlers.onBlur,
      },
    },
    'InputProps': {
      ref: containerRef,
      ...(multiple && { 'aria-label': typeof label === 'string' ? `${label} selected values` : 'Selected values' }),
      startAdornment: multiple ? (
        <Combobox.Value>
          {(entries: T[]) =>
            entries.map((option, index) => (
              <AutocompleteChip
                key={getOptionKey?.(option) ?? `${getOptionLabel(option)}-${index}`}
                label={getOptionLabel(option)}
                readOnly={readOnly}
                removeText={clearText}
              />
            ))
          }
        </Combobox.Value>
      ) : undefined,
      endAdornment: (
        <>
          {!disableClearable && !readOnly && (
            <Combobox.Clear className={autocompleteAction} aria-label={clearText}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="m6 6 12 12M6 18 18 6" />
              </svg>
            </Combobox.Clear>
          )}
          <Combobox.Trigger
            className={autocompleteAction}
            aria-label={openText}
            disabled={readOnly}
            render={(triggerProps, state) => (
              <button {...triggerProps} type="button" aria-label={state.open ? closeText : openText} />
            )}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </Combobox.Trigger>
        </>
      ),
    },
  };
  const content = (
    <div
      {...props}
      onKeyDownCapture={(event) => {
        onKeyDownCapture?.(event);

        if (
          !event.defaultPrevented &&
          event.key === 'Escape' &&
          !currentOpen &&
          clearOnEscape &&
          !disableClearable &&
          !disabled &&
          !readOnly &&
          event.target instanceof HTMLInputElement &&
          (currentQuery !== '' || selectedOptions.length > 0)
        ) {
          event.stopPropagation();

          const next = (multiple ? [] : null) as AutocompleteValue<T, Multiple>;
          const { nativeEvent } = event;
          const prevented = nativeEvent.defaultPrevented;

          onInputChange?.(nativeEvent, '', 'clear');
          onChange?.(nativeEvent, next, 'clear');

          if (prevented || !nativeEvent.defaultPrevented) {
            setQuery('');

            if (value === undefined) {
              setInternalValue(next);
            }
          }
        }
      }}
      dir={dir}
      className={[autocompleteRoot, className].filter(Boolean).join(' ')}
      data-md3-autocomplete=""
      data-multiple={Boolean(multiple)}
      data-full-width={fullWidth}
    >
      <Combobox.Root<T, Multiple>
        items={availableOptions}
        multiple={multiple}
        value={selected as Combobox.Root.Props<T, Multiple>['value']}
        onValueChange={(next, details) => handleSelection(next, details)}
        inputValue={clearOnEscape ? currentQuery : inputValue}
        defaultInputValue={defaultInputValue}
        onInputValueChange={handleInput}
        itemToStringLabel={getOptionLabel}
        itemToStringValue={getOptionValue ?? ((option) => defaultOptionValue(option, getOptionLabel))}
        isItemEqualToValue={isOptionEqualToValue}
        filteredItems={visible}
        filter={(option, text) =>
          normalizeOptionText(getOptionLabel(option)).includes(normalizeOptionText(text)) &&
          (!filterSelectedOptions || !selectedOptions.some((entry) => isOptionEqualToValue(option, entry)))
        }
        name={name}
        form={form}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        autoHighlight={autoHighlight}
        loopFocus={!disableListWrap}
        open={disabled || readOnly ? false : currentOpen}
        openOnInputClick
        onOpenChange={(next, details) => {
          const wasPrevented = details.event.defaultPrevented;

          if (next) {
            onOpen?.(details.event);
          } else {
            let reason: AutocompleteCloseReason = 'blur';

            if (details.reason === 'escape-key') {
              reason = 'escape';
            } else if (details.reason === 'item-press') {
              reason = 'selectOption';
            } else if (details.reason === 'trigger-press') {
              reason = 'toggleInput';
            }

            onClose?.(details.event, reason);
          }

          if (!wasPrevented && details.event.defaultPrevented) {
            details.cancel();
          } else if (open === undefined) {
            setInternalOpen(next);
          }
        }}
      >
        <span hidden ref={anchorRef} />
        {renderInput ? renderInput(params) : <TextField {...params} />}
        {host && (
          <Combobox.Portal container={host} dir={dir ?? direction}>
            <Combobox.Positioner anchor={anchor} sideOffset={4} align="start" className={autocompletePositioner}>
              <Combobox.Popup
                render={<MenuSurface />}
                className={autocompletePopup}
                data-md3-autocomplete-popup=""
                initialFocus={false}
              >
                <Combobox.Empty>
                  <div className={autocompleteStatus}>
                    <span className={menuItemBody}>{loading ? loadingText : noOptionsText}</span>
                  </div>
                </Combobox.Empty>
                <Combobox.List
                  className={autocompleteList}
                  aria-label={typeof label === 'string' ? label : props['aria-label']}
                  aria-busy={loading}
                >
                  {(option: T, index: number) => (
                    <AutocompleteOption
                      key={getOptionKey?.(option) ?? `${getOptionLabel(option)}-${index}`}
                      option={option}
                      index={index}
                      label={getOptionLabel(option)}
                      disabled={getOptionDisabled?.(option) ?? false}
                      inputValue={currentQuery}
                      renderOption={renderOption}
                    />
                  )}
                </Combobox.List>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        )}
      </Combobox.Root>
    </div>
  );

  return (
    <DirectionProvider direction={dir === 'rtl' || direction === 'rtl' ? 'rtl' : 'ltr'}>{content}</DirectionProvider>
  );
}
