import type { ComponentPropsWithRef, ReactNode, Ref } from 'react';

export type SliderSize = 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge';
export type SliderVariant = 'standard' | 'centered' | 'range';
export type SliderRange = readonly [number, number];
export type SliderValueLabelDisplay = 'auto' | 'on' | 'off';

export interface SliderMark {
  readonly value: number;
  readonly label?: ReactNode;
}

export interface SliderCommonProps extends Omit<
  ComponentPropsWithRef<'div'>,
  | 'children'
  | 'defaultValue'
  | 'onChange'
  | 'role'
  | 'dangerouslySetInnerHTML'
  | 'aria-valuenow'
  | 'aria-valuemin'
  | 'aria-valuemax'
  | 'aria-valuetext'
  | 'aria-orientation'
> {
  readonly label?: ReactNode;
  readonly disabled?: boolean;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly shiftStep?: number;
  readonly orientation?: 'horizontal' | 'vertical';
  readonly marks?: boolean | readonly SliderMark[];
  readonly valueLabelDisplay?: SliderValueLabelDisplay;
  readonly valueLabelFormat?: (value: number, index: number) => ReactNode;
  readonly getAriaLabel?: (index: number) => string;
  readonly getAriaValueText?: (value: number, index: number) => string;
  readonly locale?: Intl.LocalesArgument;
  readonly format?: Intl.NumberFormatOptions;
  readonly name?: string;
  readonly form?: string;
  /** Ref to the first native range input; the component ref points to its root div. */
  readonly inputRef?: Ref<HTMLInputElement>;
}

interface SingleValueProps {
  readonly value?: number;
  readonly defaultValue?: number;
  readonly onChange?: (event: Event, value: number, activeThumb: number) => void | boolean;
  readonly onChangeCommitted?: (event: Event, value: number) => void;
}

type StandardPresentation =
  | { readonly size?: SliderSize; readonly icon?: never }
  | { readonly size: 'medium' | 'large' | 'extraLarge'; readonly icon: ReactNode };

export type SliderProps = SliderCommonProps &
  (
    | (SingleValueProps & StandardPresentation & { readonly variant?: 'standard' })
    | (SingleValueProps & { readonly variant: 'centered'; readonly size?: SliderSize; readonly icon?: never })
    | {
        readonly variant: 'range';
        readonly size?: SliderSize;
        readonly icon?: never;
        readonly value?: SliderRange;
        readonly defaultValue?: SliderRange;
        /** Distinguish the two handles, for example Minimum price and Maximum price. */
        readonly getAriaLabel: (index: number) => string;
        readonly minStepsBetweenValues?: number;
        readonly onChange?: (event: Event, value: [number, number], activeThumb: number) => void | boolean;
        readonly onChangeCommitted?: (event: Event, value: [number, number]) => void;
      }
  );
