'use client';

import { useRef, useState } from 'react';
import {
  Toolbar,
  ToolbarOverflow,
  Button,
  IconButton,
  Fab,
  MenuItem,
  TextField,
  Checkbox,
  Switch,
  Divider,
  Tooltip,
  ButtonGroup,
  ButtonGroupButton,
  Slider,
} from '@flaut-travel/react-md3e';
import styles from '../toolbars.module.css';

export function ToolbarDemo() {
  const [expanded, setExpanded] = useState(true);
  const [wide, setWide] = useState(false);
  const [extra, setExtra] = useState(true);
  const [count, setCount] = useState(0);
  const [longLabel, setLongLabel] = useState(false);
  const [vetoScroll, setVetoScroll] = useState(false);
  const [lastScrollChange, setLastScrollChange] = useState('none');
  const hideScroll = useRef<HTMLDivElement>(null);
  const collapseScroll = useRef<HTMLDivElement>(null);
  const documentScroll = useRef<Window | null>(null);
  const actions = ['Copy', 'Share', 'Download', ...(extra ? ['Archive'] : [])].map((label, index) => ({
    id: label,
    priority: index === 0 ? 2 : 0,
    control: (
      <Button variant="text" onClick={() => setCount((value) => value + 1)}>
        {label === 'Share' && longLabel ? 'Share with everyone' : label}
      </Button>
    ),
    menuItem: <MenuItem onClick={() => setCount((value) => value + 1)}>{label}</MenuItem>,
  }));

  return (
    <>
      <section>
        <h2>Mixed controls</h2>
        <a href="#after-toolbar" data-testid="before-toolbar">
          Before toolbar
        </a>
        <Toolbar
          aria-label="Editor tools"
          data-testid="editor-toolbar"
          leading={<Button variant="text">Undo</Button>}
          trailing={<TextField label="Editor search" defaultValue="Search text" />}
        >
          <Tooltip title="Strong emphasis">
            <IconButton variant="tonal" selected aria-label="Bold">
              B
            </IconButton>
          </Tooltip>
          <IconButton variant="standard" aria-label="Unavailable" disabled>
            ×
          </IconButton>
          <Divider orientation="vertical" flexItem />
          <Checkbox aria-label="Show marks" />
          <Switch aria-label="Live preview" />
          <Slider label="Editor zoom" defaultValue={50} style={{ width: 140 }} />
          <select aria-label="Font family">
            <option>Sans serif</option>
            <option>Serif</option>
          </select>
          <button type="button" onClick={() => setCount((value) => value + 1)}>
            Custom action
          </button>
        </Toolbar>
        <a href="#before-toolbar" id="after-toolbar" data-testid="after-toolbar">
          After toolbar
        </a>
      </section>
      <section>
        <h2>Controlled expansion</h2>
        <Button data-testid="toggle-expanded" onClick={() => setExpanded((value) => !value)}>
          Toggle expanded
        </Button>
        <Toolbar
          variant="floating"
          color="vibrant"
          aria-label="Expandable tools"
          data-testid="controlled-toolbar"
          expanded={expanded}
          scrollBehavior="collapse"
          scrollTarget={() => collapseScroll.current}
          onExpandedChange={(next) => {
            setLastScrollChange(next ? 'expand' : 'collapse');

            if (vetoScroll) {
              return false;
            }

            setExpanded(next);

            return undefined;
          }}
          primaryAction={
            <IconButton
              aria-label="Toggle tools"
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
            >
              +
            </IconButton>
          }
        >
          <IconButton variant="standard" aria-label="Edit">
            E
          </IconButton>
          <IconButton variant="tonal" selected aria-label="Selected tool">
            S
          </IconButton>
          <Button variant="text">Export</Button>
        </Toolbar>
        <Toolbar
          variant="floating"
          aria-label="Expandable FAB tools"
          data-testid="fab-toolbar"
          expanded={expanded}
          fab={
            <Fab aria-label="Create document" onClick={() => setCount((value) => value + 1)}>
              +
            </Fab>
          }
        >
          <IconButton variant="standard" aria-label="Cut">
            C
          </IconButton>
          <IconButton variant="standard" aria-label="Paste">
            P
          </IconButton>
        </Toolbar>
        <Toolbar
          variant="floating"
          color="vibrant"
          orientation="vertical"
          fabPosition="start"
          aria-label="Vertical FAB tools"
          data-testid="vertical-fab-toolbar"
          expanded={expanded}
          fab={<Fab aria-label="Add page">+</Fab>}
        >
          <IconButton variant="standard" aria-label="Pen">
            P
          </IconButton>
          <IconButton variant="tonal" selected aria-label="Eraser">
            E
          </IconButton>
          <IconButton variant="standard" aria-label="Select region">
            S
          </IconButton>
        </Toolbar>
      </section>
      <section>
        <h2>Parent size and dynamic actions</h2>
        <Button data-testid="resize-toolbar" onClick={() => setWide((value) => !value)}>
          Resize parent
        </Button>
        <Button data-testid="change-actions" onClick={() => setExtra((value) => !value)}>
          Change actions
        </Button>
        <Button data-testid="change-label" onClick={() => setLongLabel((value) => !value)}>
          Change label
        </Button>
        <div className={styles.resizable} style={{ width: wide ? 640 : 280 }} data-testid="overflow-parent">
          <Toolbar variant="floating" aria-label="Responsive tools" data-testid="overflow-toolbar">
            <ToolbarOverflow label="More tools" actions={actions} />
          </Toolbar>
        </div>
        <p role="status" data-testid="toolbar-count">
          Actions: {count}
        </p>
      </section>
      <section>
        <h2>Scroll behavior</h2>
        <Button data-testid="veto-scroll" onClick={() => setVetoScroll((value) => !value)}>
          Veto controlled scroll
        </Button>
        <p data-testid="controlled-scroll-change">{lastScrollChange}</p>
        <div className={styles.scrollFrame}>
          <div ref={hideScroll} className={styles.scroller} data-testid="hide-scroll">
            <div className={styles.scrollContent}>Scrollable editor</div>
          </div>
          <Toolbar
            position="absolute"
            variant="docked"
            aria-label="Hide on scroll"
            data-testid="hide-toolbar"
            scrollBehavior="hide"
            scrollTarget={() => hideScroll.current}
          >
            <Button>Undo scroll</Button>
            <Button>Redo scroll</Button>
            <Button>Save scroll</Button>
          </Toolbar>
        </div>
        <div className={styles.scrollFrame}>
          <div ref={collapseScroll} className={styles.scroller} data-testid="collapse-scroll">
            <div className={styles.scrollContent}>Scrollable canvas</div>
          </div>
          <Toolbar
            position="absolute"
            variant="floating"
            color="vibrant"
            aria-label="Collapse on scroll"
            data-testid="collapse-toolbar"
            scrollBehavior="collapse"
            scrollTarget={() => collapseScroll.current}
            fab={
              <Fab aria-label="Scroll create" onClick={() => setCount((value) => value + 1)}>
                +
              </Fab>
            }
          >
            <IconButton variant="standard" aria-label="Scroll edit">
              E
            </IconButton>
            <IconButton variant="standard" aria-label="Scroll share">
              S
            </IconButton>
          </Toolbar>
        </div>
        <Toolbar
          variant="floating"
          position="fixed"
          placement="end"
          orientation="vertical"
          aria-label="Document scroll tools"
          data-testid="document-scroll-toolbar"
          scrollBehavior="hide"
          scrollTarget={() => {
            documentScroll.current = window;

            return documentScroll.current;
          }}
        >
          <IconButton variant="standard" aria-label="Document undo">
            U
          </IconButton>
          <IconButton variant="standard" aria-label="Document redo">
            R
          </IconButton>
          <IconButton variant="standard" aria-label="Document save">
            S
          </IconButton>
        </Toolbar>
      </section>
      <section>
        <h2>Grouped primary action</h2>
        <Toolbar
          color="vibrant"
          aria-label="Document commands"
          primaryAction={<Button>Publish</Button>}
          trailing={<Button variant="text">Settings</Button>}
        >
          <ButtonGroup aria-label="Text alignment" selectionMode="single" defaultValue="left" variant="standard">
            <ButtonGroupButton value="left">Left</ButtonGroupButton>
            <ButtonGroupButton value="center">Center</ButtonGroupButton>
            <ButtonGroupButton value="right">Right</ButtonGroupButton>
          </ButtonGroup>
        </Toolbar>
      </section>
      <section>
        <h2>Vertical overflow and native focus</h2>
        <Toolbar
          variant="floating"
          orientation="vertical"
          aria-label="Vertical responsive tools"
          data-testid="vertical-overflow-toolbar"
        >
          <ToolbarOverflow label="More vertical tools" actions={actions} style={{ maxHeight: 180 }} />
        </Toolbar>
        <Toolbar
          variant="floating"
          aria-label="Native scrolling tools"
          data-testid="native-scroll-toolbar"
          style={{ maxWidth: 220 }}
          loopFocus={false}
        >
          {Array.from({ length: 7 }, (_, index) => (
            <Button key={index} variant="text">
              Command {index + 1}
            </Button>
          ))}
        </Toolbar>
      </section>
      <span
        hidden
        data-testid="toolbar-demo-ready"
        ref={(node) => {
          const frame = requestAnimationFrame(() => node?.setAttribute('data-ready', 'true'));

          return () => cancelAnimationFrame(frame);
        }}
      />
    </>
  );
}
