'use client';

import { useRef, useState } from 'react';
import { Button, Switch } from '@flaut-travel/react-md3e';
import styles from '../switches.module.css';

export function SwitchDemo() {
  const [checked, setChecked] = useState(false);
  const [changes, setChanges] = useState(0);
  const [submitted, setSubmitted] = useState('');
  const [resetKey, setResetKey] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [vetoes, setVetoes] = useState(0);
  const rootRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <section>
      <h2>State, form values and restrictions</h2>
      <form
        id="switch-preferences"
        key={resetKey}
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
        }}
        onReset={() => {
          setChecked(false);
          setResetKey((value) => value + 1);
        }}
      >
        <div className="fixture-row">
          <label className={styles.setting}>
            <Switch
              ref={rootRef}
              inputRef={inputRef}
              checked={checked}
              disabled={disabled}
              onChange={(_event, next) => {
                setChecked(next);
                setChanges((value) => value + 1);
              }}
              name="notifications"
              value="enabled"
              data-testid="controlled-switch"
            />{' '}
            Notifications
          </label>
          <label htmlFor="automatic-updates">Automatic updates</label>
          <Switch id="automatic-updates" name="updates" value="enabled" required />
          <label className={styles.setting}>
            <Switch disabled defaultChecked name="disabled" /> Disabled setting
          </label>
          <label className={styles.setting}>
            <Switch readOnly defaultChecked name="locked" value="yes" /> Read-only setting
          </label>
          <label className={styles.setting}>
            <Switch disableRipple /> Without ripple
          </label>
          <label className={styles.setting}>
            <Switch
              onChange={(event) => {
                event.preventDefault();
                setVetoes((value) => value + 1);
              }}
            />{' '}
            Veto setting
          </label>
        </div>
        <div className={styles.actions}>
          <Button type="submit">Submit preferences</Button>
          <Button type="reset">Reset preferences</Button>
        </div>
      </form>
      <label className={styles.setting}>
        <Switch form="switch-preferences" name="external" value="yes" defaultChecked /> External setting
      </label>
      <p data-testid="switch-state">
        {String(checked)} / {changes}
      </p>
      <p data-testid="switch-vetoes">{vetoes}</p>
      <output data-testid="switch-submitted">{submitted}</output>
      <div className="fixture-row">
        <Button onClick={() => setChecked((value) => !value)}>Change from code</Button>
        <Button onClick={() => setDisabled((value) => !value)}>Toggle disabled</Button>
        <Button
          onClick={() => {
            rootRef.current?.setAttribute('data-refs-connected', String(inputRef.current?.type === 'checkbox'));
            rootRef.current?.focus();
          }}
        >
          Check switch refs
        </Button>
      </div>
    </section>
  );
}
