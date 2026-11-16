import type { CSSProperties, ElementType, HTMLAttributes, InputHTMLAttributes, ReactNode, Ref } from 'react';

export type TextFieldVariant = 'filled' | 'outlined';
export type TextFieldControl = HTMLInputElement | HTMLTextAreaElement;
export type TextFieldInputProps = InputHTMLAttributes<TextFieldControl> & {
  readonly ref?: Ref<TextFieldControl>;
  readonly rows?: number;
};
export type TextFieldContainerProps = HTMLAttributes<HTMLDivElement> & {
  readonly ref?: Ref<HTMLDivElement>;
  readonly startAdornment?: ReactNode;
  readonly endAdornment?: ReactNode;
};
export interface TextFieldSlots {
  readonly input?: ElementType;
  readonly htmlInput?: ElementType;
}
export type TextFieldProps = Omit<
  InputHTMLAttributes<TextFieldControl>,
  'size' | 'color' | 'children' | 'className' | 'style'
> & {
  readonly ref?: Ref<HTMLDivElement>;
  readonly inputRef?: Ref<TextFieldControl>;
  readonly variant?: TextFieldVariant;
  readonly label?: ReactNode;
  readonly helperText?: ReactNode;
  readonly error?: boolean;
  readonly fullWidth?: boolean;
  readonly multiline?: boolean;
  readonly rows?: number;
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly InputProps?: TextFieldContainerProps;
  readonly InputLabelProps?: { readonly shrink?: boolean };
  readonly inputProps?: TextFieldInputProps;
  readonly slots?: TextFieldSlots;
  readonly slotProps?: { readonly htmlInput?: TextFieldInputProps };
};
