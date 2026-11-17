'use client';

import { useState } from 'react';
import {
  Button,
  Collapsible,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Shape,
  ThemeProvider,
} from '@flaut-travel/react-md3e';
import type { MotionScheme, Theme } from '@flaut-travel/react-md3e';
import styles from './motion-demo.module.css';

export function MotionDemo({ themes }: { readonly themes: Readonly<Record<MotionScheme, Theme>> }) {
  const [scheme, setScheme] = useState<MotionScheme>('expressive');
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <section>
      <label htmlFor="motion-scheme">Motion scheme</label>
      <select id="motion-scheme" value={scheme} onChange={(event) => setScheme(event.target.value as MotionScheme)}>
        <option value="expressive">Expressive</option>
        <option value="standard">Standard</option>
      </select>
      <ThemeProvider theme={themes[scheme]} data-testid="motion-scope" className={styles.scope}>
        <div className={styles.row}>
          <Button selected={expanded} onClick={() => setExpanded(!expanded)} data-testid="motion-button">
            Animate motion
          </Button>
          <IconButton selected={expanded} aria-label="Toggle selection" onClick={() => setExpanded(!expanded)}>
            ★
          </IconButton>
          <Button variant="outlined" onClick={() => setOpen(true)}>
            Open motion dialog
          </Button>
        </div>
        <div className={styles.track}>
          <div className={styles.sample} data-active={expanded} data-testid="motion-sample" />
        </div>
        <Shape variant={expanded ? 'sunny' : 'circle'} data-testid="motion-shape" />
        <Collapsible trigger={<Button variant="text">Motion details</Button>}>
          <p>Spatial springs move shapes and dimensions. Effects springs fade and recolor without overshoot.</p>
        </Collapsible>
        <ThemeProvider data-testid="nested-default-motion" className={styles.scope}>
          <Button data-testid="nested-motion-button" variant="tonal">
            Nested default expressive theme
          </Button>
        </ThemeProvider>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Themed motion dialog</DialogTitle>
          <DialogContent>Portal transitions inherit the selected scheme through CSS.</DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Close motion dialog</Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </section>
  );
}
