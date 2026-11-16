import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react';
import type {
  TextFieldProps,
  TextFieldSlots,
  TextFieldContainerProps,
  TextFieldInputProps,
} from '../text-field/text-field.types';

export type AutocompleteValue<T, Multiple extends boolean = false> = Multiple extends true ? T[] : T | null;
export type AutocompleteChangeReason = 'selectOption' | 'removeOption' | 'clear';
export type AutocompleteInputChangeReason = 'input' | 'clear' | 'selectOption' | 'blur' | 'reset';
export type AutocompleteCloseReason = 'escape' | 'selectOption' | 'blur' | 'toggleInput';
export interface AutocompleteOptionState {
  readonly selected: boolean;
  readonly inputValue: string;
  readonly index: number;
}
export type AutocompleteRenderInputParams = TextFieldProps & {
  readonly id: string;
  readonly InputProps: TextFieldContainerProps;
  readonly slots: Required<TextFieldSlots>;
  readonly slotProps: { readonly htmlInput: TextFieldInputProps };
};
export type AutocompleteProps<T, Multiple extends boolean = false> = Omit<
  ComponentPropsWithRef<'div'>,
  'onChange' | 'defaultValue' | 'children'
> & {
  readonly options: readonly T[];
  readonly multiple?: Multiple;
  readonly value?: AutocompleteValue<NoInfer<T>, Multiple>;
  readonly defaultValue?: AutocompleteValue<NoInfer<T>, Multiple>;
  readonly onChange?: (event: Event, value: AutocompleteValue<T, Multiple>, reason: AutocompleteChangeReason) => void;
  readonly inputValue?: string;
  readonly defaultInputValue?: string;
  readonly onInputChange?: (event: Event, value: string, reason: AutocompleteInputChangeReason) => void;
  readonly getOptionLabel?: (option: T) => string;
  readonly getOptionKey?: (option: T) => string | number;
  readonly getOptionValue?: (option: T) => string;
  readonly getOptionDisabled?: (option: T) => boolean;
  readonly isOptionEqualToValue?: (option: T, value: T) => boolean;
  readonly filterOptions?: (
    options: readonly T[],
    state: { readonly inputValue: string; readonly getOptionLabel: (option: T) => string },
  ) => readonly T[];
  readonly filterSelectedOptions?: boolean;
  readonly renderInput?: (params: AutocompleteRenderInputParams) => ReactNode;
  readonly renderOption?: (
    props: ComponentPropsWithRef<'div'>,
    option: T,
    state: AutocompleteOptionState,
  ) => ReactElement;
  readonly label?: ReactNode;
  readonly helperText?: ReactNode;
  readonly placeholder?: string;
  readonly variant?: TextFieldProps['variant'];
  readonly error?: boolean;
  readonly fullWidth?: boolean;
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly required?: boolean;
  readonly name?: string;
  readonly form?: string;
  readonly inputRef?: TextFieldProps['inputRef'];
  readonly disableClearable?: boolean;
  readonly clearOnEscape?: boolean;
  readonly selectOnFocus?: boolean;
  readonly autoHighlight?: boolean;
  readonly openOnFocus?: boolean;
  readonly disableListWrap?: boolean;
  readonly open?: boolean;
  readonly defaultOpen?: boolean;
  readonly onOpen?: (event: Event) => void;
  readonly onClose?: (event: Event, reason: AutocompleteCloseReason) => void;
  readonly loading?: boolean;
  readonly loadingText?: ReactNode;
  readonly noOptionsText?: ReactNode;
  readonly clearText?: string;
  readonly openText?: string;
  readonly closeText?: string;
  readonly container?: HTMLElement | null | (() => HTMLElement | null);
};
