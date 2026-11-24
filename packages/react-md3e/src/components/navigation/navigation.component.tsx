import { NavigationSelection } from './navigation-selection/navigation-selection.component';
import { NavigationPanel } from './navigation-panel/navigation-panel.component';
import { navigationRoot, navigationHeader, navigationItems, navigationFooter } from './navigation.styles';
import type { NavigationInternalProps } from './navigation.types';

/** Native server layout; only the nested selection owner and individual controls hydrate. */
export function Navigation({
  kind,
  value,
  defaultValue,
  onChange,
  header,
  footer,
  children,
  className,
  modal = false,
  open,
  defaultOpen,
  trigger,
  onOpenChange,
  onOpenChangeComplete,
  onClose,
  keepMounted,
  disableEscapeKeyDown,
  disableSwipe,
  container,
  initialFocus,
  finalFocus,
  ...props
}: NavigationInternalProps) {
  if (!props['aria-label']?.trim() && !props['aria-labelledby']?.trim()) {
    throw new TypeError('Navigation requires a non-empty aria-label or aria-labelledby.');
  }

  const content = (
    <nav {...props} className={[navigationRoot, className].filter(Boolean).join(' ')} data-md3-navigation={kind}>
      {header != null && (
        <div className={navigationHeader} data-md3-navigation-header="">
          {header}
        </div>
      )}
      <div className={navigationItems} data-md3-navigation-items="">
        {children}
      </div>
      {footer != null && (
        <div className={navigationFooter} data-md3-navigation-footer="">
          {footer}
        </div>
      )}
    </nav>
  );

  return (
    <NavigationSelection value={value} defaultValue={defaultValue} onChange={onChange}>
      {modal ? (
        <NavigationPanel
          kind={kind}
          aria-label={props['aria-label']}
          aria-labelledby={props['aria-labelledby']}
          dir={props.dir}
          open={open}
          defaultOpen={defaultOpen}
          trigger={trigger}
          onOpenChange={onOpenChange}
          onOpenChangeComplete={onOpenChangeComplete}
          onClose={onClose}
          keepMounted={keepMounted}
          disableEscapeKeyDown={disableEscapeKeyDown}
          disableSwipe={disableSwipe}
          container={container}
          initialFocus={initialFocus}
          finalFocus={finalFocus}
        >
          {content}
        </NavigationPanel>
      ) : (
        content
      )}
    </NavigationSelection>
  );
}
