'use client';

import { useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioItem,
  MenuRadioGroup,
  MenuGroup,
  MenuDivider,
  MenuSubmenu,
} from '@flaut-travel/react-md3e';
import type { MenuCloseReason } from '@flaut-travel/react-md3e';
import styles from '../menus.module.css';

export function MenuDemo() {
  const [action, setAction] = useState('none');
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<MenuCloseReason>('programmatic');
  const [bold, setBold] = useState(false);
  const [sort, setSort] = useState('date');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refResult, setRefResult] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLElement>(null);

  return (
    <div className={styles.stack}>
      <section className={styles.row}>
        <h2>Commands and controlled state</h2>
        <Menu trigger={<Button>Commands</Button>} data-testid="command-menu" ref={popupRef}>
          <MenuItem
            ref={itemRef}
            leading="☆"
            supportingText="Start with an empty document"
            trailing="⌘N"
            onClick={() => setAction('new')}
          >
            New document
          </MenuItem>
          <MenuItem disabled onClick={() => setAction('disabled')}>
            Archived document
          </MenuItem>
          <MenuItem onClick={() => setAction('copy')}>Copy</MenuItem>
          <MenuItem onClick={(event) => event.preventDefault()}>Prevented command</MenuItem>
          <MenuItem onClick={() => false}>Vetoed command</MenuItem>
          <MenuItem closeOnClick={false} onClick={() => setAction('inspect')}>
            Inspect without closing
          </MenuItem>
          <MenuItem href="#destination">Navigate</MenuItem>
        </Menu>
        <button type="button" onClick={() => setRefResult(Boolean(popupRef.current && itemRef.current))}>
          Check menu refs
        </button>
        <Menu
          trigger={<Button>Controlled menu</Button>}
          open={open}
          data-testid="controlled-menu"
          onOpenChange={(next) => setOpen(next)}
          onClose={(_event, nextReason) => setReason(nextReason)}
        >
          <MenuItem onClick={() => setAction('controlled')}>Run controlled action</MenuItem>
        </Menu>
        <Menu trigger={<Button>Close veto menu</Button>} onClose={() => false} data-testid="veto-menu">
          <MenuItem>Keep open</MenuItem>
        </Menu>
        <Menu trigger={<Button disabled>Disabled menu</Button>}>
          <MenuItem>Never activated</MenuItem>
        </Menu>
        <output data-testid="menu-action">{action}</output>
        <output data-testid="menu-reason">{reason}</output>
        <output data-testid="menu-refs">{String(refResult)}</output>
      </section>
      <section className={styles.row}>
        <h2>Selection and groups</h2>
        <Menu trigger={<Button>Selection menu</Button>} data-testid="selection-menu" variant="vibrant">
          <MenuGroup label="Formatting">
            <MenuCheckboxItem leading="B" checked={bold} onChange={(_event, next) => setBold(next)}>
              Bold
            </MenuCheckboxItem>
            <MenuCheckboxItem defaultChecked>Italic</MenuCheckboxItem>
            <MenuCheckboxItem onChange={() => false}>Locked preference</MenuCheckboxItem>
          </MenuGroup>
          <MenuDivider />
          <MenuRadioGroup label="Sort order" value={sort} onChange={(_event, next) => setSort(next)}>
            <MenuRadioItem value="date">Date</MenuRadioItem>
            <MenuRadioItem value="name">Name</MenuRadioItem>
          </MenuRadioGroup>
          <MenuRadioGroup label="Locked order" defaultValue="first" onChange={() => false} disabled>
            <MenuRadioItem value="first">First locked</MenuRadioItem>
            <MenuRadioItem value="second">Second locked</MenuRadioItem>
          </MenuRadioGroup>
        </Menu>
        <output data-testid="menu-selection">
          {String(bold)}:{sort}
        </output>
        <Menu trigger={<Button>Uncontrolled radio menu</Button>} data-testid="radio-menu">
          <MenuRadioGroup label="Order" defaultValue="first">
            <MenuRadioItem value="first">First</MenuRadioItem>
            <MenuRadioItem value="second">Second</MenuRadioItem>
          </MenuRadioGroup>
        </Menu>
      </section>
      <section className={styles.row}>
        <h2>Nested menus</h2>
        <Menu trigger={<Button>Nested menu</Button>} data-testid="nested-menu">
          <MenuSubmenu label="Share" leading="↗" data-testid="share-menu">
            <MenuItem onClick={() => setAction('link')}>Copy link</MenuItem>
            <MenuSubmenu label="Export" data-testid="export-menu">
              <MenuItem onClick={() => setAction('pdf')}>PDF document</MenuItem>
              <MenuItem onClick={() => setAction('text')}>Text document</MenuItem>
            </MenuSubmenu>
          </MenuSubmenu>
          <MenuSubmenu label="Disabled submenu" disabled>
            <MenuItem>Not available</MenuItem>
          </MenuSubmenu>
          <MenuItem>Other command</MenuItem>
        </Menu>
        <div dir="rtl">
          <Menu trigger={<Button>RTL menu</Button>} data-testid="rtl-menu">
            <MenuSubmenu label="خيارات" data-testid="rtl-submenu">
              <MenuItem>نسخ</MenuItem>
            </MenuSubmenu>
            <MenuItem>حفظ</MenuItem>
          </Menu>
          <Menu trigger={<Button>LTR override menu</Button>} dir="ltr" data-testid="ltr-override-menu">
            <MenuSubmenu label="Options">
              <MenuItem>Copy in LTR</MenuItem>
            </MenuSubmenu>
          </Menu>
        </div>
      </section>
      <section className={styles.row}>
        <h2>Density and scrolling</h2>
        {([0, -1, -2, -3] as const).map((density) => (
          <Menu
            key={density}
            trigger={<Button>Density {density}</Button>}
            density={density}
            data-testid={`density-${density}`}
          >
            <MenuItem>Compact command</MenuItem>
            <MenuItem>Another command</MenuItem>
          </Menu>
        ))}
        <Menu trigger={<Button>Scrollable menu</Button>} data-testid="scroll-menu">
          {Array.from({ length: 30 }, (_unused, index) => (
            <MenuItem key={index}>Command {index + 1}</MenuItem>
          ))}
        </Menu>
        <Menu trigger={<Button>Nonmodal menu</Button>} modal={false} data-testid="nonmodal-menu">
          <MenuItem>Nonmodal command</MenuItem>
        </Menu>
      </section>
      <section>
        <Button onClick={() => setDialogOpen(true)}>Open menu dialog</Button>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Menu inside dialog</DialogTitle>
          <DialogContent>
            <Menu trigger={<Button>Dialog menu</Button>} data-testid="dialog-menu">
              <MenuItem>Dialog command</MenuItem>
            </Menu>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Close dialog</Button>
          </DialogActions>
        </Dialog>
      </section>
      <div className={styles.edge}>
        <Menu trigger={<Button>Edge menu</Button>} data-testid="edge-menu" placement="bottom-end">
          <MenuItem>Flipped command</MenuItem>
          <MenuItem>Another flipped command</MenuItem>
        </Menu>
      </div>
    </div>
  );
}
