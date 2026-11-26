'use client';

import { useContext, useLayoutEffect, useRef, useState } from 'react';
import { useMergedRefs } from '../../../internal/hooks/use-merged-refs.hook';
import { Menu } from '../../menu/menu.component';
import { IconButton } from '../../icon-button/icon-button.component';
import { ToolbarContext } from '../contexts/toolbar.context';
import { distributeToolbarActions } from './toolbar-overflow.helpers';
import { toolbarOverflow } from './toolbar-overflow.styles';
import type { ToolbarOverflowProps } from '../toolbar.types';

const moreIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
  </svg>
);

export function ToolbarOverflow({ actions, label, icon = moreIcon, className, ref, ...props }: ToolbarOverflowProps) {
  const { orientation, expanded } = useContext(ToolbarContext);
  const rootRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(rootRef, ref);
  const [hidden, setHidden] = useState<readonly string[]>(() =>
    actions.filter((action) => action.overflow === 'always').map((action) => action.id),
  );
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const finalFocusRef = useRef<HTMLElement | null>(null);
  const pendingFocus = useRef<HTMLElement | null>(null);

  if (!label.trim()) {
    throw new TypeError('ToolbarOverflow requires a non-empty label.');
  }

  if (new Set(actions.map((action) => action.id)).size !== actions.length) {
    throw new TypeError('ToolbarOverflow action ids must be unique.');
  }

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return undefined;
    }

    const vertical = orientation === 'vertical';
    let frame = 0;
    const measure = () => {
      const nodes = [...root.querySelectorAll<HTMLElement>(':scope > [data-md3-toolbar-overflow-action]')];
      const gap = Number.parseFloat(getComputedStyle(root).gap) || 0;
      const extent = (element: HTMLElement) => {
        const rect = element.getBoundingClientRect();

        return vertical ? rect.height : rect.width;
      };
      const sizes = nodes.map(extent);
      const triggerSize = triggerRef.current ? extent(triggerRef.current) : 48;
      const naturalSize = sizes.reduce(
        (sum, size, index) => sum + (actions[index]?.overflow === 'always' ? 0 : size + gap),
        triggerSize,
      );
      const sizeValue = `${naturalSize}px`;

      if (root.style.getPropertyValue('--_toolbar-overflow-size') !== sizeValue) {
        root.style.setProperty('--_toolbar-overflow-size', sizeValue);
      }

      const available = vertical ? root.clientHeight : root.clientWidth;
      const next = distributeToolbarActions(actions, sizes, available, triggerSize, gap);
      const active = root.ownerDocument.activeElement;

      if (nodes.some((node, index) => next.includes(actions[index]?.id ?? '') && node.contains(active))) {
        pendingFocus.current = triggerRef.current;
      }

      const menuId = active
        ?.closest('[data-md3-toolbar-overflow-menu-item]')
        ?.getAttribute('data-md3-toolbar-overflow-menu-item');

      if (menuId && !next.includes(menuId)) {
        const returned = nodes[actions.findIndex((action) => action.id === menuId)];
        const target = returned?.querySelector<HTMLElement>('button, a[href], input, [tabindex]') ?? triggerRef.current;

        pendingFocus.current = target;
        finalFocusRef.current = target;
        setOpen(false);
      }

      setHidden((previous) =>
        previous.length === next.length && previous.every((id, index) => id === next[index]) ? previous : next,
      );
    };
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    });

    observer.observe(root);

    for (const node of root.querySelectorAll<HTMLElement>(':scope > [data-md3-toolbar-overflow-action]')) {
      observer.observe(node);
    }

    measure();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [actions, orientation]);

  useLayoutEffect(() => {
    const pending = pendingFocus.current;

    if (pending) {
      pending.focus({ preventScroll: true });
      pendingFocus.current = null;
    }

    if (!expanded || hidden.length === 0) {
      const frame = requestAnimationFrame(() => setOpen(false));

      return () => cancelAnimationFrame(frame);
    }

    return undefined;
  }, [expanded, hidden]);

  return (
    <div
      {...props}
      ref={mergedRef}
      className={[toolbarOverflow, className].filter(Boolean).join(' ')}
      data-md3-toolbar-overflow=""
      data-orientation={orientation}
    >
      {actions.map((action) => {
        const overflowed = hidden.includes(action.id);

        return (
          <div
            key={action.id}
            data-md3-toolbar-overflow-action={action.id}
            data-overflowed={overflowed}
            inert={overflowed}
            aria-hidden={overflowed || undefined}
          >
            {action.control}
          </div>
        );
      })}
      <div data-md3-toolbar-overflow-trigger="" data-empty={hidden.length === 0} inert={hidden.length === 0}>
        <Menu
          trigger={
            <IconButton ref={triggerRef} variant="standard" aria-label={label}>
              {icon}
            </IconButton>
          }
          open={open && expanded && hidden.length > 0}
          onOpenChange={(next) => {
            if (next) {
              finalFocusRef.current = triggerRef.current;
            }

            setOpen(next);
          }}
          finalFocus={finalFocusRef}
          placement={orientation === 'vertical' ? 'right-start' : 'top-end'}
          modal={false}
        >
          {actions
            .filter((action) => hidden.includes(action.id))
            .map((action) => (
              <div key={action.id} role="presentation" data-md3-toolbar-overflow-menu-item={action.id}>
                {action.menuItem}
              </div>
            ))}
        </Menu>
      </div>
    </div>
  );
}
