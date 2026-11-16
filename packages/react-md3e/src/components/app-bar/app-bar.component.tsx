import {
  appBarRoot,
  appBarRow,
  appBarNavigation,
  appBarActions,
  appBarLabel,
  appBarSmallTitle,
  appBarMediumTitle,
  appBarLargeTitle,
  appBarSmallSubtitle,
  appBarMediumSubtitle,
  appBarLargeSubtitle,
} from './app-bar.styles';
import type { AppBarProps } from './app-bar.types';

const titles = { small: appBarSmallTitle, mediumFlexible: appBarMediumTitle, largeFlexible: appBarLargeTitle };
const subtitles = {
  small: appBarSmallSubtitle,
  mediumFlexible: appBarMediumSubtitle,
  largeFlexible: appBarLargeSubtitle,
};

/** Server-compatible app-bar layout. Actions may contain independent client components. */
export function AppBar({
  title,
  subtitle,
  navigationIcon,
  actions,
  children,
  variant = 'small',
  position = 'fixed',
  titleAlign = 'start',
  scrolled = false,
  className,
  ...props
}: AppBarProps) {
  const hasSubtitle = children == null && subtitle != null && subtitle !== false;
  const label = (
    <div className={appBarLabel} data-md3-app-bar-label="">
      {children ?? (
        <>
          {title != null && (
            <div className={titles[variant]} data-md3-app-bar-title="">
              {title}
            </div>
          )}
          {hasSubtitle && (
            <div className={subtitles[variant]} data-md3-app-bar-subtitle="">
              {subtitle}
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <header
      {...props}
      className={[appBarRoot, className].filter(Boolean).join(' ')}
      data-md3-app-bar=""
      data-variant={variant}
      data-position={position}
      data-title-align={titleAlign}
      data-scrolled={scrolled}
      data-has-subtitle={hasSubtitle}
    >
      <div className={appBarRow} data-md3-app-bar-row="">
        <div className={appBarNavigation}>{navigationIcon}</div>
        {variant === 'small' ? label : <div />}
        <div className={appBarActions}>{actions}</div>
      </div>
      {variant !== 'small' && label}
    </header>
  );
}
