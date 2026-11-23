import { Button } from '../button/button.component';
import { Menu } from '../menu/menu.component';
import { splitButtonRoot, splitButtonAction, splitButtonMenuButton, splitButtonChevron } from './split-button.styles';
import type { SplitButtonProps } from './split-button.types';

/** Passive composition: Button and Menu retain their own interaction/client boundaries. */
export function SplitButton({
  children,
  menu,
  menuButtonLabel,
  variant = 'filled',
  size = 'small',
  startIcon,
  disabled = false,
  loading = false,
  fullWidth = false,
  disableRipple = false,
  onClick,
  buttonProps,
  menuButtonProps,
  menuProps,
  open,
  defaultOpen,
  onOpenChange,
  onClose,
  className,
  dir,
  ...props
}: SplitButtonProps) {
  const unavailable = disabled || loading;
  const primaryLabel = buttonProps?.['aria-label'] ?? (typeof children === 'string' ? children : undefined);

  if (!menuButtonLabel.trim()) {
    throw new TypeError('SplitButton requires a menuButtonLabel describing the related choices.');
  }

  return (
    <div
      {...props}
      dir={dir}
      role="group"
      aria-label={props['aria-label'] ?? (props['aria-labelledby'] ? undefined : primaryLabel)}
      className={[splitButtonRoot, className].filter(Boolean).join(' ')}
      data-md3-split-button=""
      data-size={size}
      data-full-width={fullWidth}
    >
      <Button
        {...buttonProps}
        onClick={onClick}
        variant={variant}
        size={size}
        startIcon={startIcon}
        disabled={unavailable || Boolean(buttonProps?.disabled)}
        loading={loading}
        disableRipple={disableRipple}
        className={[splitButtonAction, buttonProps?.className].filter(Boolean).join(' ')}
        data-md3-split-action=""
      >
        {children}
      </Button>
      <Menu
        placement="bottom-end"
        {...menuProps}
        dir={dir}
        {...(open !== undefined && { open })}
        {...(defaultOpen !== undefined && { defaultOpen })}
        {...(onOpenChange && { onOpenChange })}
        {...(onClose && { onClose })}
        disabled={unavailable}
        trigger={
          <Button
            {...menuButtonProps}
            type="button"
            variant={variant}
            size={size}
            disabled={unavailable || Boolean(menuButtonProps?.disabled)}
            disableRipple={disableRipple}
            aria-label={menuButtonLabel}
            className={[splitButtonMenuButton, menuButtonProps?.className].filter(Boolean).join(' ')}
            data-md3-split-menu-button=""
          >
            <svg className={splitButtonChevron} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="m7 10 5 5 5-5" />
            </svg>
          </Button>
        }
      >
        {menu}
      </Menu>
    </div>
  );
}
