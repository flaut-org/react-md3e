import { useRef, useState } from 'react';
import { Toolbar, ToolbarOverflow, Button, IconButton, Fab, MenuItem } from '@flaut-travel/react-md3e';

export function ExpandableToolbarExample({ fab = false }: { readonly fab?: boolean }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      <Button variant="text" onClick={() => setExpanded((value) => !value)}>
        Toggle toolbar
      </Button>
      <Toolbar
        variant="floating"
        color="vibrant"
        aria-label="Canvas commands"
        expanded={expanded}
        onExpandedChange={setExpanded}
        fab={fab ? <Fab aria-label="Create">+</Fab> : undefined}
        primaryAction={
          fab ? undefined : (
            <IconButton
              aria-label="Toggle commands"
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
            >
              +
            </IconButton>
          )
        }
      >
        <IconButton aria-label="Edit" variant="standard">
          E
        </IconButton>
        <IconButton aria-label="Draw" variant="tonal" selected>
          D
        </IconButton>
        <Button variant="text">Share</Button>
      </Toolbar>
    </div>
  );
}

export function OverflowToolbarExample() {
  const [wide, setWide] = useState(false);
  const [message, setMessage] = useState('Choose an action');
  const actions = ['Copy', 'Paste', 'Share', 'Download', 'Archive'].map((label) => ({
    id: label,
    control: (
      <Button variant="text" onClick={() => setMessage(label)}>
        {label}
      </Button>
    ),
    menuItem: <MenuItem onClick={() => setMessage(label)}>{label}</MenuItem>,
  }));

  return (
    <div>
      <Button variant="text" onClick={() => setWide((value) => !value)}>
        Resize parent
      </Button>
      <div style={{ width: wide ? 680 : 300, maxWidth: '100%', border: '1px dashed currentColor' }}>
        <Toolbar variant="floating" aria-label="Responsive commands">
          <ToolbarOverflow label="More commands" actions={actions} />
        </Toolbar>
      </div>
      <p role="status">{message}</p>
    </div>
  );
}

export function ScrollToolbarExample({ behavior }: { readonly behavior: 'hide' | 'collapse' }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ position: 'relative', height: 340, overflow: 'clip', border: '1px solid currentColor' }}>
      <div ref={scrollRef} style={{ height: '100%', overflow: 'auto' }}>
        <div style={{ height: 1400, padding: 24 }}>Scroll down to {behavior} the toolbar, then up to reveal it.</div>
      </div>
      <Toolbar
        variant="floating"
        position="absolute"
        color="vibrant"
        aria-label="Scroll commands"
        scrollBehavior={behavior}
        scrollTarget={() => scrollRef.current}
        fab={behavior === 'collapse' ? <Fab aria-label="Create">+</Fab> : undefined}
      >
        <IconButton aria-label="Edit" variant="standard">
          E
        </IconButton>
        <IconButton aria-label="Draw" variant="tonal" selected>
          D
        </IconButton>
        <IconButton aria-label="Share" variant="standard">
          S
        </IconButton>
      </Toolbar>
    </div>
  );
}
