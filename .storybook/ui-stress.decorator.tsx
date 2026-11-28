import type { Decorator } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import './ui-stress.css';

/** Opt-in constraints usable by any story, through parameters.uiQuality or URL globals. */
export const withUiStress: Decorator = (Story, context) => {
  const options = context.parameters.uiQuality as
    { layout?: string; direction?: string; edge?: string; fontScale?: number } | undefined;
  const layout = String(context.globals.qaLayout ?? options?.layout ?? 'normal');
  const requestedDirection = String(context.globals.qaDirection ?? options?.direction ?? '');
  const direction = requestedDirection === 'rtl' || requestedDirection === 'ltr' ? requestedDirection : undefined;
  const edge = String(context.globals.qaEdge ?? options?.edge ?? 'none');
  const fontScale = Number(context.globals.qaFontScale ?? options?.fontScale ?? 1);
  const typography =
    fontScale === 1
      ? undefined
      : ({
          'fontSize': `${fontScale * 100}%`,
          '--md-sys-typescale-body-large-size': `${16 * fontScale}px`,
          '--md-sys-typescale-body-large-line-height': `${24 * fontScale}px`,
          '--md-sys-typescale-label-large-size': `${14 * fontScale}px`,
          '--md-sys-typescale-label-large-line-height': `${20 * fontScale}px`,
        } as CSSProperties);

  return (
    <div className="qa-stage" dir={direction} data-qa-edge={edge} style={typography}>
      <div className="qa-container" data-qa-layout={layout}>
        <div className="qa-content">
          <Story />
        </div>
      </div>
    </div>
  );
};
