'use client';

import { useId, useRef } from 'react';
import type { MouseEvent } from 'react';
import { Input as BaseInput } from '@base-ui/react/input';
import { useMergedRefs } from '../../internal/hooks/use-merged-refs.hook';
import {
  textFieldRoot,
  textFieldContainer,
  textFieldInput,
  textFieldLabel,
  textFieldOutline,
  textFieldAdornment,
  textFieldHelper,
} from './text-field.styles';
import type { TextFieldProps, TextFieldControl } from './text-field.types';

export function TextField({
  label,
  helperText,
  variant = 'outlined',
  error = false,
  fullWidth = false,
  disabled = false,
  required = false,
  readOnly = false,
  multiline = false,
  rows = 3,
  id: providedId,
  inputRef,
  ref,
  className,
  style,
  InputProps = {},
  InputLabelProps,
  inputProps,
  slots,
  slotProps,
  dir,
  type = 'text',
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const hasLabel = label !== undefined && label !== null && label !== '';
  const helperId = helperText != null ? `${id}-helper` : undefined;
  const { startAdornment, endAdornment, className: containerClassName, onClick, ...containerProps } = InputProps;
  const native = { ...props, ...inputProps, ...slotProps?.htmlInput };
  const localRef = useRef<TextFieldControl>(null);
  const forwardedInputRef = useMergedRefs(inputRef, native.ref);
  const controlRef = useMergedRefs(localRef, forwardedInputRef);
  const Container = slots?.input ?? 'div';
  const Control = slots?.htmlInput ?? (multiline ? 'textarea' : BaseInput);
  const labelledBy = native['aria-labelledby'] ?? (hasLabel && !native['aria-label'] ? `${id}-label` : undefined);
  const describedBy = [native['aria-describedby'], helperId].filter(Boolean).join(' ') || undefined;

  if (!hasLabel && !native['aria-label']?.trim() && !native['aria-labelledby']?.trim()) {
    throw new TypeError('TextField requires a label, aria-label, or aria-labelledby.');
  }

  return (
    <div
      ref={ref}
      dir={dir}
      className={[textFieldRoot, className].filter(Boolean).join(' ')}
      style={style}
      data-md3-text-field=""
      data-variant={variant}
      data-error={error}
      data-disabled={disabled}
      data-full-width={fullWidth}
      data-has-label={hasLabel}
      data-shrink={InputLabelProps?.shrink}
      data-has-start={startAdornment != null}
      data-multiline={multiline}
    >
      <Container
        {...containerProps}
        className={[textFieldContainer, containerClassName].filter(Boolean).join(' ')}
        data-md3-field-container=""
        onClick={(event: MouseEvent<HTMLDivElement>) => {
          onClick?.(event);

          if (!event.defaultPrevented && event.target === event.currentTarget) {
            localRef.current?.focus();
          }
        }}
      >
        {startAdornment != null && (
          <span className={textFieldAdornment} data-md3-field-leading="">
            {startAdornment}
          </span>
        )}
        <Control
          {...native}
          ref={controlRef}
          id={id}
          type={multiline ? undefined : type}
          rows={multiline ? rows : undefined}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          placeholder={native.placeholder ?? ' '}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          aria-invalid={error || native['aria-invalid']}
          className={[textFieldInput, native.className].filter(Boolean).join(' ')}
          data-md3-field-input=""
        />
        {hasLabel && (
          <label id={`${id}-label`} className={textFieldLabel} htmlFor={id} data-md3-field-label="">
            {label}
            {required && <span aria-hidden="true"> *</span>}
          </label>
        )}
        {endAdornment != null && (
          <span className={textFieldAdornment} data-md3-field-trailing="">
            {endAdornment}
          </span>
        )}
        {variant === 'outlined' && (
          <fieldset className={textFieldOutline} aria-hidden="true">
            <legend>
              <span>
                {label}
                {required && ' *'}
              </span>
            </legend>
          </fieldset>
        )}
      </Container>
      {helperText != null && (
        <p id={helperId} className={textFieldHelper}>
          {helperText}
        </p>
      )}
    </div>
  );
}
