import { ToolbarBehavior } from './toolbar-behavior/toolbar-behavior.component';
import { toolbarRoot, toolbarControls, toolbarSurface, toolbarRegion, toolbarFab } from './toolbar.styles';
import type { ToolbarProps } from './toolbar.types';

/** Server-owned layout and tokens; behavior is an independent, optional client boundary. */
export function Toolbar({
  variant = 'docked',
  color = 'standard',
  orientation = 'horizontal',
  position = 'static',
  placement = 'bottom',
  align = variant === 'docked' ? 'responsive' : 'center',
  fullWidth = true,
  shape = 'square',
  dense = false,
  elevation = 3,
  leading,
  children,
  trailing,
  primaryAction,
  fab,
  fabPosition = 'end',
  expanded,
  defaultExpanded = true,
  onExpandedChange,
  scrollBehavior = 'none',
  scrollTarget,
  scrollThreshold = 40,
  keyboardNavigation = true,
  loopFocus = true,
  className,
  'aria-label': label,
  'aria-labelledby': labelledBy,
  ...props
}: ToolbarProps) {
  const initialExpanded = expanded ?? defaultExpanded;
  const interactive = keyboardNavigation || scrollBehavior !== 'none' || expanded !== undefined || !!onExpandedChange;
  const hasFab = fab != null && typeof fab !== 'boolean';
  const hasPrimary = primaryAction != null && typeof primaryAction !== 'boolean';
  const canCollapse = hasFab || hasPrimary;
  const leadingContent = hasPrimary ? (
    <>
      {leading}
      {children}
    </>
  ) : (
    leading
  );

  if (!label?.trim() && !labelledBy?.trim()) {
    throw new TypeError('Toolbar requires a non-empty aria-label or aria-labelledby.');
  }

  if (variant === 'docked' && orientation !== 'horizontal') {
    throw new TypeError('Docked Toolbar supports horizontal orientation only.');
  }

  if (variant === 'floating' && (!initialExpanded || scrollBehavior === 'collapse') && !canCollapse) {
    throw new TypeError('Collapsible Toolbar requires primaryAction or fab.');
  }

  if (scrollBehavior === 'hide' && !initialExpanded) {
    throw new TypeError('Toolbar hiding and collapse are mutually exclusive.');
  }

  if (!Number.isFinite(scrollThreshold) || scrollThreshold <= 0) {
    throw new TypeError('Toolbar scrollThreshold must be a positive finite number.');
  }

  const content = (
    <>
      <div
        className={toolbarSurface}
        data-md3-toolbar-surface=""
        data-md3-toolbar-collapsible={hasFab ? '' : undefined}
        data-has-primary={hasPrimary}
        inert={hasFab && !initialExpanded}
      >
        {(leadingContent != null || hasPrimary) && (
          <div
            className={toolbarRegion}
            data-md3-toolbar-region="leading"
            data-md3-toolbar-collapsible=""
            inert={!initialExpanded}
          >
            {leadingContent}
          </div>
        )}
        {!hasPrimary && children != null && (
          <div
            className={toolbarRegion}
            data-md3-toolbar-region="middle"
            data-md3-toolbar-collapsible=""
            inert={!initialExpanded}
          >
            {children}
          </div>
        )}
        {hasPrimary && (
          <div className={toolbarRegion} data-md3-toolbar-region="primary" data-md3-toolbar-persistent="">
            {primaryAction}
          </div>
        )}
        {trailing != null && (
          <div
            className={toolbarRegion}
            data-md3-toolbar-region="trailing"
            data-md3-toolbar-collapsible=""
            inert={!initialExpanded}
          >
            {trailing}
          </div>
        )}
      </div>
      {hasFab && (
        <div className={toolbarFab} data-md3-toolbar-fab="" data-md3-toolbar-persistent="">
          {fab}
        </div>
      )}
    </>
  );
  const attributes = {
    'className': toolbarControls,
    'data-md3-toolbar-controls': '',
    'data-expanded': initialExpanded,
    'aria-label': label,
    'aria-labelledby': labelledBy,
  } as const;

  return (
    <div
      {...props}
      className={[toolbarRoot, className].filter(Boolean).join(' ')}
      data-md3-toolbar=""
      data-variant={variant}
      data-color={color}
      data-orientation={orientation}
      data-position={position}
      data-placement={placement}
      data-align={align}
      data-full-width={variant === 'docked' && fullWidth}
      data-shape={shape}
      data-dense={dense}
      data-elevation={variant === 'floating' ? elevation : 0}
      data-fab-position={fabPosition}
      data-has-fab={hasFab}
    >
      {interactive ? (
        <ToolbarBehavior
          {...attributes}
          orientation={orientation}
          keyboardNavigation={keyboardNavigation}
          loopFocus={loopFocus}
          expanded={expanded}
          defaultExpanded={defaultExpanded}
          onExpandedChange={onExpandedChange}
          scrollBehavior={scrollBehavior}
          scrollTarget={scrollTarget}
          scrollThreshold={scrollThreshold}
        >
          {content}
        </ToolbarBehavior>
      ) : (
        <div {...attributes} role="group">
          {content}
        </div>
      )}
    </div>
  );
}
