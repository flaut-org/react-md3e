import {
  appBarRoot,
  appBarRow,
  appBarNavigation,
  appBarActions,
  appBarLabel,
  appBarSearch,
  appBarSmallTitle,
  appBarMediumTitle,
  appBarLargeTitle,
  appBarSmallSubtitle,
  appBarMediumSubtitle,
  appBarLargeSubtitle,
  appBarContent,
  appBarScrollFrame,
} from './app-bar.styles';
import { AppBarScroll } from './app-bar-scroll/app-bar-scroll.component';
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
  scrolled,
  scrollBehavior,
  scrollTarget,
  className,
  ...props
}: AppBarProps) {
  const isSearch = variant === 'search';
  const behavior = scrollBehavior ?? 'none';
  const isCompact = variant === 'small' || isSearch;
  const titleVariant = isSearch ? 'small' : variant;
  const hasSubtitle = !isSearch && children == null && subtitle != null && subtitle !== false;
  const label = (
    <div className={appBarLabel} data-md3-app-bar-label="">
      {children ?? (
        <>
          {title != null && (
            <div className={titles[titleVariant]} data-md3-app-bar-title="">
              {title}
            </div>
          )}
          {hasSubtitle && (
            <div className={subtitles[titleVariant]} data-md3-app-bar-subtitle="">
              {subtitle}
            </div>
          )}
        </>
      )}
    </div>
  );
  const titleContent = isCompact ? label : <div />;

  const header = (
    <header
      {...props}
      className={[appBarRoot, className].filter(Boolean).join(' ')}
      data-md3-app-bar=""
      data-variant={variant}
      data-position={position}
      data-title-align={titleAlign}
      data-scrolled={scrolled ?? false}
      data-scroll-behavior={behavior}
      data-has-subtitle={hasSubtitle}
    >
      <div className={appBarContent} data-md3-app-bar-content="">
        <div className={appBarRow} data-md3-app-bar-row="">
          <div className={appBarNavigation} data-md3-app-bar-navigation="">
            {navigationIcon}
          </div>
          {isSearch ? (
            <div className={appBarSearch} data-md3-app-bar-search="" data-title-align={titleAlign}>
              {children}
            </div>
          ) : (
            titleContent
          )}
          <div className={appBarActions} data-md3-app-bar-actions="">
            {actions}
          </div>
        </div>
        {!isCompact && label}
      </div>
      {behavior !== 'none' && <AppBarScroll behavior={behavior} target={scrollTarget} scrolled={scrolled} />}
    </header>
  );

  return (
    <div
      className={appBarScrollFrame}
      data-md3-app-bar-scroll-frame=""
      data-position={position}
      data-scroll-behavior={behavior}
    >
      {header}
    </div>
  );
}
