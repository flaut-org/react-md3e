import { badgeRoot, badgeIndicator } from './badge.styles';
import type { BadgeProps } from './badge.types';

const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

function formatLabel(content: BadgeProps['badgeContent'], max: number) {
  if (typeof content === 'number') {
    if (!Number.isFinite(content) || content < 0) {
      return '';
    }

    const limit = Number.isFinite(max) ? Math.min(999, Math.max(0, Math.floor(max))) : 999;
    const count = Math.floor(content);

    return count > limit ? `${limit}+` : String(count);
  }

  const characters = Array.from(segmenter.segment((content ?? '').trim()), ({ segment }) => segment);

  return characters.length > 4 ? `${characters.slice(0, 3).join('')}…` : characters.join('');
}

export function Badge({
  children,
  badgeContent,
  variant = badgeContent == null ? 'small' : 'large',
  max = 999,
  showZero = false,
  invisible = false,
  slotProps,
  className,
  ...props
}: BadgeProps) {
  const label = variant === 'large' ? formatLabel(badgeContent, max) : '';
  const hidden =
    invisible || (variant === 'large' && (!label || (typeof badgeContent === 'number' && label === '0' && !showZero)));

  return (
    <span
      {...props}
      className={[badgeRoot, className].filter(Boolean).join(' ')}
      data-md3-badge=""
      data-anchored={children != null && typeof children !== 'boolean'}
    >
      {children}
      <span
        {...slotProps?.badge}
        className={[badgeIndicator, slotProps?.badge?.className].filter(Boolean).join(' ')}
        aria-hidden="true"
        data-md3-badge-indicator=""
        data-variant={variant}
        data-invisible={hidden}
      >
        {label}
      </span>
    </span>
  );
}
