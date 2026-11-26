'use client';

import { createElement, Fragment, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Button, ThemeProvider, Tooltip, Typography } from '@flaut-travel/react-md3e';
import type { TooltipPlacement } from '@flaut-travel/react-md3e/tooltip';
import { TooltipDemoContext } from './contexts/tooltip-demo.context';
import { BookingHint } from './booking-hint/booking-hint.component';
import styles from './tooltip-demo.module.css';

const emptyTitles: ReactNode[] = [
  null,
  undefined,
  false,
  '',
  true,
  [],
  createElement(Fragment),
  [false, createElement(Fragment)],
];
const placements: TooltipPlacement[] = [
  'top',
  'top-start',
  'top-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
  'right',
  'right-start',
  'right-end',
];
const longText = 'Carry-on baggage is included. Check your fare conditions before departure. '.repeat(8);

export function TooltipDemo() {
  const [count, setCount] = useState(0);
  const [richOpen, setRichOpen] = useState(false);
  const [dynamicOpen, setDynamicOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hideDynamic, setHideDynamic] = useState(false);
  const [emptyIndex, setEmptyIndex] = useState(0);
  const [placement, setPlacement] = useState<TooltipPlacement>('top-start');
  const [cancelClose, setCancelClose] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);

  return (
    <TooltipDemoContext value={`Fare ${count}`}>
      <section className={styles.examples} aria-label="Tooltip examples">
        <Tooltip title="Delete item" enterDelay={30}>
          <Button>Plain tooltip</Button>
        </Tooltip>
        <Tooltip
          title={
            <>
              Delete <strong>selected items</strong>
            </>
          }
          enterDelay={30}
        >
          <Button>Formatted tooltip</Button>
        </Tooltip>
        <Tooltip
          variant="rich"
          title={<p>Carry-on baggage: 8 kg. Checked baggage: 23 kg.</p>}
          aria-label="Baggage details"
          enterDelay={30}
        >
          <Button>Rich tooltip</Button>
        </Tooltip>
        <Tooltip variant="rich" headline="Baggage allowance" title="Carry-on baggage: 8 kg." enterDelay={30} arrow>
          <Button>Rich headline</Button>
        </Tooltip>
        <Tooltip
          variant="rich"
          headline="Baggage options"
          title={<Typography variant="bodyMedium">Select the allowance that suits your journey.</Typography>}
          actions={
            <>
              <Button variant="text" onClick={() => setCount((value) => value + 1)}>
                Add baggage
              </Button>
              <a href="#baggage-information">Learn more</a>
            </>
          }
          open={richOpen}
          onOpenChange={(next) => {
            if (!next && cancelClose) {
              return false;
            }

            setRichOpen(next);

            return true;
          }}
          enterDelay={30}
        >
          <Button>Rich actions</Button>
        </Tooltip>
        <Button>After rich actions</Button>
        <Tooltip title={<BookingHint />} enterDelay={30}>
          <Button>Custom component</Button>
        </Tooltip>
        <Tooltip
          variant="rich"
          headline="Live fare"
          title={
            hideDynamic ? null : (
              <>
                <BookingHint />
                <p>{expanded ? longText : 'Short description'}</p>
              </>
            )
          }
          actions={
            <>
              <Button
                variant="text"
                onClick={() => {
                  setTimeout(() => {
                    setExpanded((value) => !value);
                    setCount((value) => value + 1);
                  }, 80);
                }}
              >
                Update content
              </Button>
              <Button variant="text" onClick={() => setHideDynamic(true)}>
                Clear content
              </Button>
            </>
          }
          open={dynamicOpen}
          onOpenChange={(next) => setDynamicOpen(next)}
          placement={placement}
          arrow
          data-testid="dynamic-tooltip"
        >
          <Button onClick={() => setDynamicOpen(true)}>Dynamic content</Button>
        </Tooltip>
        <Tooltip title={longText} enterDelay={30}>
          <Button>Long plain content</Button>
        </Tooltip>
        <Tooltip variant="rich" title={longText} aria-label="Long baggage information" enterDelay={30}>
          <Button>Long rich content</Button>
        </Tooltip>
        <Tooltip title="Also available in the adjacent description" disableInteractive enterDelay={30} leaveDelay={80}>
          <Button>Disabled interactivity</Button>
        </Tooltip>
        <Tooltip
          variant="rich"
          persistent
          headline="New baggage feature"
          title="Choose baggage when booking."
          actions={
            <Button variant="text" onClick={() => setCount((value) => value + 1)}>
              Try feature
            </Button>
          }
        >
          <Button>Persistent tooltip</Button>
        </Tooltip>
        <Tooltip title={0} enterDelay={30}>
          <Button>Zero tooltip</Button>
        </Tooltip>
        <Tooltip title={42} enterDelay={30}>
          <Button>Number tooltip</Button>
        </Tooltip>
        <Tooltip title={[<strong key="one">First</strong>, <span key="two"> and second</span>]} enterDelay={30}>
          <Button>Array tooltip</Button>
        </Tooltip>
        <Tooltip title={emptyTitles[emptyIndex]} open>
          <Button>Empty tooltip</Button>
        </Tooltip>
        <Button onClick={() => setEmptyIndex((value) => (value + 1) % emptyTitles.length)}>Next empty value</Button>
        <Tooltip title="Touch description" enterTouchDelay={100} leaveTouchDelay={150}>
          <Button onClick={() => setCount((value) => value + 1)}>Touch plain</Button>
        </Tooltip>
        <Tooltip
          variant="rich"
          headline="Touch baggage"
          title="More details"
          enterTouchDelay={100}
          actions={
            <Button variant="text" onClick={() => setCount((value) => value + 1)}>
              Touch action
            </Button>
          }
        >
          <Button>Touch rich</Button>
        </Tooltip>
        <Tooltip title="Touch disabled" disableTouchListener>
          <Button>Touch disabled</Button>
        </Tooltip>
        <Tooltip title="Inactive hint" disabled open>
          <Button onClick={() => setCount((value) => value + 1)}>Disabled hint</Button>
        </Tooltip>
        <Tooltip variant="rich" headline="Inactive rich hint" title="Hidden" disabled open>
          <Button onClick={() => setCount((value) => value + 1)}>Disabled rich hint</Button>
        </Tooltip>
        <Tooltip title="Custom host description" container={() => hostRef.current} enterDelay={30}>
          <Button>Custom host</Button>
        </Tooltip>
        <div ref={hostRef} data-testid="tooltip-custom-host" />
        <div dir="rtl">
          <Tooltip
            variant="rich"
            headline="معلومات الأمتعة"
            title="حقيبة اليد مشمولة"
            placement="bottom-start"
            enterDelay={30}
            arrow
            data-testid="rtl-tooltip"
          >
            <Button>RTL rich tooltip</Button>
          </Tooltip>
        </div>
        <ThemeProvider colorScheme="dark" data-testid="dark-tooltip-scope">
          <Tooltip title="Dark plain" enterDelay={30}>
            <Button>Dark plain tooltip</Button>
          </Tooltip>
          <Tooltip variant="rich" headline="Dark baggage" title="Dark rich" enterDelay={30}>
            <Button>Dark rich tooltip</Button>
          </Tooltip>
        </ThemeProvider>
        <div className={styles.scrollport} data-testid="tooltip-scrollport">
          <div className={styles.scrollContent}>
            <Tooltip variant="rich" headline="Scrollable anchor" title="Position follows scrolling" enterDelay={30}>
              <Button>Scrollable tooltip</Button>
            </Tooltip>
          </div>
        </div>
        <label>
          Placement
          <select value={placement} onChange={(event) => setPlacement(event.target.value as TooltipPlacement)}>
            {placements.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label>
          <input type="checkbox" checked={cancelClose} onChange={(event) => setCancelClose(event.target.checked)} />
          Prevent rich dismissal
        </label>
        <Button onClick={() => setDynamicOpen((value) => !value)}>Toggle dynamic tooltip</Button>
        <Button onClick={() => setHideDynamic(false)}>Restore dynamic content</Button>
        <Button onClick={() => setExpanded((value) => !value)}>Resize content externally</Button>
        <Button onClick={() => setCount((value) => value + 1)}>Update context externally</Button>
        <p data-testid="tooltip-count">{count}</p>
        <p id="baggage-information">Baggage information</p>
      </section>
    </TooltipDemoContext>
  );
}
