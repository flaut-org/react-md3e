'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type {
  ChangeEvent,
  ClipboardEvent,
  CompositionEvent,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  RefObject,
} from 'react';
import { createDateMask } from '../../components/date-entry/date-entry-mask';
import type { DateFormat } from '../../components/date-entry/date-entry-format';
import type { TextFieldControl, TextFieldProps } from '../../components/text-field';

interface DateInputMaskProps {
  readonly raw: string;
  readonly format: DateFormat;
  readonly range: boolean;
  readonly input: RefObject<TextFieldControl | null>;
  readonly native: TextFieldProps;
  readonly onChange: (raw: string) => void;
}

export function useDateInputMask({ raw, format, range, input, native, onChange }: DateInputMaskProps) {
  const mask = useMemo(() => createDateMask(format, range), [format, range]);
  const [focused, setFocused] = useState(false);
  const [composing, setComposing] = useState(false);
  const [selection, setSelection] = useState({ index: 0, revision: 0 });
  const typing = useRef({ index: -1, buffer: '' });
  const firstClick = useRef(false);
  const values = mask.read(raw);
  const view = useMemo(() => mask.render(mask.read(raw)), [mask, raw]);
  const maskable = mask.canRead(raw);
  const value = !composing && maskable && (focused || raw) ? view.value : raw;

  useLayoutEffect(() => {
    const section = view.sections[selection.index];

    if (focused && !composing && section) {
      input.current?.setSelectionRange(section.start, section.end);
    }
  }, [focused, composing, selection, value, input, view.sections]);

  const select = (index: number) => {
    typing.current = { index: -1, buffer: '' };
    setSelection((previous) => ({ index, revision: previous.revision + 1 }));
  };
  const publish = (next: readonly string[], index: number) => {
    onChange(mask.serialize(next));
    setSelection((previous) => ({ index, revision: previous.revision + 1 }));
  };
  const enterDigits = (characters: string, element: TextFieldControl, replaceAll = false) => {
    const all = replaceAll || (element.selectionStart === 0 && element.selectionEnd === element.value.length);
    let next = all ? values.map(() => '') : values;
    let active = all ? 0 : selection.index;
    let buffer = typing.current.index === active && !all ? typing.current.buffer : '';

    for (const character of format.normalize(characters)) {
      const result = mask.digit(next, active, buffer, character);

      next = result.values;
      active = result.index;
      buffer = result.buffer;
    }

    typing.current = { index: active, buffer };
    publish(next, active);
  };
  const clearSections = (element: TextFieldControl, backward: boolean) => {
    const start = element.selectionStart ?? 0;
    const end = element.selectionEnd ?? start;
    const all = start === 0 && end === element.value.length;
    let active = selection.index;

    if (!all && backward && !values[active] && active > 0) {
      active -= 1;
    }

    const next = values.map((part, index) => {
      const section = view.sections[index]!;
      const intersects = start < section.end && end > section.start;

      return all || intersects || index === active ? '' : part;
    });

    typing.current = { index: -1, buffer: '' };
    publish(next, all ? 0 : active);
  };
  const replaceText = (text: string) => {
    typing.current = { index: -1, buffer: '' };

    if (mask.canRead(text)) {
      const next = mask.read(text);
      const incomplete = next.findIndex((part, index) => part.length < view.sections[index]!.width);

      publish(next, incomplete < 0 ? next.length - 1 : incomplete);
    } else {
      onChange(text);
    }
  };
  const keyDown = (event: KeyboardEvent<TextFieldControl>) => {
    native.onKeyDown?.(event);

    if (
      event.defaultPrevented ||
      native.readOnly ||
      native.disabled ||
      composing ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    ) {
      return;
    }

    const character = format.normalize(event.key);

    if (/^\d$/.test(character)) {
      event.preventDefault();
      enterDigits(character, event.currentTarget);
    } else if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      clearSections(event.currentTarget, event.key === 'Backspace');
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();

      const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
      const step = (event.key === 'ArrowRight' ? 1 : -1) * (rtl ? -1 : 1);

      select(
        Math.max(
          0,
          Math.min(values.length - 1, mask.locate(view.sections, event.currentTarget.selectionStart ?? 0) + step),
        ),
      );
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      select(event.key === 'Home' ? 0 : values.length - 1);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();

      const active = mask.locate(view.sections, event.currentTarget.selectionStart ?? 0);
      const section = view.sections[active]!;
      const limit = { month: 12, day: 31, year: 9999 }[section.unit];
      const direction = event.key === 'ArrowUp' ? 1 : -1;
      const number = Number(values[active] || (direction === 1 ? '0' : '1'));
      const next = ((number + direction - 1 + limit) % limit) + 1;

      typing.current = { index: -1, buffer: '' };
      publish(
        values.map((part, index) => (index === active ? String(next).padStart(section.width, '0') : part)),
        active,
      );
    } else if (/^[/.-]$/.test(event.key)) {
      event.preventDefault();

      const active = selection.index;
      const section = view.sections[active]!;

      publish(
        values.map((part, index) => (index === active && part ? part.padStart(section.width, '0') : part)),
        Math.min(active + 1, values.length - 1),
      );
      typing.current = { index: -1, buffer: '' };
    }
  };
  const change = (event: ChangeEvent<TextFieldControl>) => {
    const inputEvent = event.nativeEvent as InputEvent;

    if (!event.target.value) {
      typing.current = { index: -1, buffer: '' };
      publish(
        values.map(() => ''),
        0,
      );
    } else if (composing || inputEvent.isComposing) {
      onChange(event.target.value);
    } else if (
      inputEvent.inputType === 'insertText' &&
      inputEvent.data &&
      /^\d+$/.test(format.normalize(inputEvent.data)) &&
      inputEvent.data.length <= (range ? 16 : 8)
    ) {
      enterDigits(inputEvent.data, event.currentTarget, inputEvent.data === event.target.value);
    } else if (inputEvent.inputType === 'insertText' && inputEvent.data && inputEvent.data.length > 1) {
      replaceText(inputEvent.data);
    } else if (inputEvent.inputType?.startsWith('delete')) {
      clearSections(event.currentTarget, inputEvent.inputType === 'deleteContentBackward');
    } else {
      replaceText(event.target.value);
    }
  };
  const paste = (event: ClipboardEvent<TextFieldControl>) => {
    native.onPaste?.(event);

    if (!event.defaultPrevented && !native.readOnly && !native.disabled) {
      event.preventDefault();

      const text = event.clipboardData.getData('text/plain');
      const digits = format.normalize(text);

      if (/^\d+$/.test(digits) && digits.length <= (range ? 16 : 8)) {
        typing.current = { index: -1, buffer: '' };
        enterDigits(digits, event.currentTarget, digits.length >= 8);
      } else {
        replaceText(text);
      }
    }
  };

  return {
    value,
    onKeyDown: keyDown,
    onChange: change,
    onPaste: paste,
    onCut: (event: ClipboardEvent<TextFieldControl>) => {
      native.onCut?.(event);

      if (!event.defaultPrevented && !native.readOnly && !native.disabled) {
        event.preventDefault();
        event.clipboardData.setData(
          'text/plain',
          event.currentTarget.value.slice(
            event.currentTarget.selectionStart ?? 0,
            event.currentTarget.selectionEnd ?? 0,
          ),
        );
        clearSections(event.currentTarget, false);
      }
    },
    onFocus: (event: FocusEvent<TextFieldControl>) => {
      native.onFocus?.(event);

      if (!event.defaultPrevented) {
        firstClick.current = !raw;
        setFocused(true);
        select(0);
      }
    },
    onClick: (event: MouseEvent<TextFieldControl>) => {
      native.onClick?.(event);

      if (!event.defaultPrevented) {
        select(firstClick.current ? 0 : mask.locate(view.sections, event.currentTarget.selectionStart ?? 0));
        firstClick.current = false;
      }
    },
    onBlur: (event: FocusEvent<TextFieldControl>) => {
      setFocused(false);
      typing.current = { index: -1, buffer: '' };
      native.onBlur?.(event);
    },
    onCompositionStart: (event: CompositionEvent<TextFieldControl>) => {
      native.onCompositionStart?.(event);
      setComposing(true);
    },
    onCompositionEnd: (event: CompositionEvent<TextFieldControl>) => {
      native.onCompositionEnd?.(event);
      setComposing(false);
      replaceText(event.currentTarget.value);
    },
  };
}
