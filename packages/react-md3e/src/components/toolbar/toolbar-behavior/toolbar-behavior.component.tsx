'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import type { ComponentPropsWithoutRef, FocusEvent } from 'react';
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { ToolbarContext } from '../contexts/toolbar.context';
import { navigateToolbar, observeToolbarFocus, updateToolbarVisibility } from './toolbar-focus';
import { observeToolbarScroll, resolveToolbarScrollTarget } from './toolbar-scroll';
import type {
  ToolbarOrientation,
  ToolbarScrollBehavior,
  ToolbarScrollTarget,
  FloatingToolbarProps,
} from '../toolbar.types';

interface ToolbarBehaviorProps extends ComponentPropsWithoutRef<'div'> {
  readonly orientation: ToolbarOrientation;
  readonly keyboardNavigation: boolean;
  readonly loopFocus: boolean;
  readonly expanded: boolean | undefined;
  readonly defaultExpanded: boolean;
  readonly onExpandedChange: FloatingToolbarProps['onExpandedChange'];
  readonly scrollBehavior: ToolbarScrollBehavior;
  readonly scrollTarget: ToolbarScrollTarget | undefined;
  readonly scrollThreshold: number;
}

export function ToolbarBehavior({
  keyboardNavigation,
  orientation,
  loopFocus,
  expanded: controlled,
  defaultExpanded,
  onExpandedChange,
  scrollBehavior,
  scrollTarget,
  scrollThreshold,
  ...props
}: ToolbarBehaviorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [internal, setInternal] = useState(defaultExpanded);
  const [hidden, setHidden] = useState(false);
  const isHidden = scrollBehavior === 'hide' && hidden;
  const expanded = controlled ?? internal;
  const latest = useRef({ expanded, controlled, onExpandedChange });
  const subscription = useRef<
    | {
        target: HTMLElement | Window;
        behavior: ToolbarScrollBehavior;
        threshold: number;
        dispose: () => void;
      }
    | undefined
  >(undefined);

  useLayoutEffect(() => {
    latest.current = { expanded, controlled, onExpandedChange };

    if (ref.current) {
      updateToolbarVisibility(ref.current, expanded, isHidden);
    }
  }, [expanded, isHidden, controlled, onExpandedChange]);

  useLayoutEffect(() => {
    if (ref.current && keyboardNavigation) {
      return observeToolbarFocus(ref.current);
    }

    return undefined;
  }, [keyboardNavigation]);

  useLayoutEffect(() => {
    const root = ref.current;
    const previous = subscription.current;

    if (previous && previous.behavior !== scrollBehavior) {
      previous.dispose();
      subscription.current = undefined;
    }

    if (root) {
      const activation = requestAnimationFrame(() => {
        const target = resolveToolbarScrollTarget(root, scrollTarget);
        const active = subscription.current;

        if (active?.target === target && active.behavior === scrollBehavior && active.threshold === scrollThreshold) {
          return;
        }

        active?.dispose();
        subscription.current = undefined;

        if (scrollBehavior !== 'hide') {
          setHidden(false);
        }

        if (scrollBehavior === 'none') {
          return;
        }

        if (scrollBehavior === 'hide' && latest.current.controlled === undefined) {
          setInternal(true);
        }

        const dispose = observeToolbarScroll(root, target, scrollThreshold, (down, event) => {
          if (scrollBehavior === 'hide') {
            setHidden(down);
          } else {
            const next = !down;
            const { current } = latest;

            if (next !== current.expanded) {
              const prevented = event.defaultPrevented;
              const cancelled = current.onExpandedChange?.(next, event) === false;

              if (!cancelled && (prevented || !event.defaultPrevented) && current.controlled === undefined) {
                setInternal(next);
              }
            }
          }
        });

        subscription.current = { target, behavior: scrollBehavior, threshold: scrollThreshold, dispose };
      });

      return () => cancelAnimationFrame(activation);
    }

    return undefined;
  }, [scrollBehavior, scrollTarget, scrollThreshold]);

  useLayoutEffect(() => () => subscription.current?.dispose(), []);

  const attributes = {
    ...props,
    'ref': ref,
    'data-expanded': expanded,
    'data-hidden': isHidden,
    'tabIndex': -1,
    'onFocusCapture': (event: FocusEvent<HTMLDivElement>) => {
      // A keyboard/assistive user can reach every secondary action after scroll-driven collapse.
      if (
        !expanded &&
        controlled === undefined &&
        event.target instanceof HTMLElement &&
        event.target.matches(':focus-visible')
      ) {
        const cancelled = onExpandedChange?.(true, event.nativeEvent) === false;

        if (!cancelled) {
          setInternal(true);
        }
      }
    },
  };

  return (
    <ToolbarContext value={{ expanded, orientation }}>
      {keyboardNavigation ? (
        <BaseToolbar.Root
          {...attributes}
          orientation={orientation}
          loopFocus={loopFocus}
          onKeyDown={(event) => {
            // Preserve text editing, nested widgets, and inert-aware navigation for arbitrary ReactNode controls.
            event.preventBaseUIHandler();
            navigateToolbar(event.currentTarget, event.nativeEvent, orientation, loopFocus);
          }}
        />
      ) : (
        <div {...attributes} role="group" />
      )}
    </ToolbarContext>
  );
}
