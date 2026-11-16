'use client';

import { useRef, useState } from 'react';
import { Avatar, Button, Checkbox, Radio, RadioGroup } from '@flaut-org/react-md3e';

export function ControlsDemo() {
  const [checked, setChecked] = useState(false);
  const [mixed, setMixed] = useState(true);
  const [choice, setChoice] = useState('economy');
  const [submitted, setSubmitted] = useState('');
  const [source, setSource] = useState('/missing-avatar.png');
  const [imageEvent, setImageEvent] = useState('');
  const checkRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const radioRef = useRef<HTMLSpanElement>(null);
  const radioInput = useRef<HTMLInputElement>(null);

  return (
    <>
      <section>
        <h2>Form controls</h2>
        <form
          aria-label="Travel preferences"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
          }}
        >
          <div className="fixture-row">
            <label>
              <Checkbox
                ref={checkRef}
                inputRef={inputRef}
                checked={checked}
                onChange={(_event, next) => setChecked(next)}
                name="newsletter"
                value="yes"
              />{' '}
              Travel updates
            </label>
            <label>
              <Checkbox
                checked={checked}
                indeterminate={mixed}
                onChange={(_event, next) => {
                  setMixed(false);
                  setChecked(next);
                }}
              />{' '}
              Select all
            </label>
            <label htmlFor="terms">
              <Checkbox id="terms" name="terms" value="accepted" required /> Accept terms
            </label>
            <label>
              <Checkbox disabled defaultChecked /> Disabled checkbox
            </label>
            <label>
              <Checkbox readOnly defaultChecked /> Read-only checkbox
            </label>
            <label>
              <Checkbox error aria-describedby="error-help" /> Error checkbox
            </label>
            <label>
              <Checkbox disableRipple /> Without ripple
            </label>
            <label>
              <Checkbox onChange={(event) => event.preventDefault()} /> Veto checkbox
            </label>
          </div>
          <p id="error-help">Review this selection.</p>
          <RadioGroup
            aria-label="Cabin"
            value={choice}
            onChange={(_event, next) => setChoice(next)}
            name="cabin"
            required
          >
            <label>
              <Radio value="economy" ref={radioRef} inputRef={radioInput} /> Economy
            </label>
            <label>
              <Radio value="business" /> Business
            </label>
            <label>
              <Radio value="first" disabled /> First class
            </label>
          </RadioGroup>
          <Button type="submit">Submit preferences</Button>
        </form>
        <p data-testid="control-state">
          {String(checked)} / {choice}
        </p>
        <p data-testid="submitted-preferences">{submitted}</p>
        <Button
          onClick={() => {
            setChecked(true);
            setChoice('business');
          }}
        >
          Change controls from code
        </Button>
        <Button
          onClick={() => {
            checkRef.current?.setAttribute('data-ref-checked', String(inputRef.current?.type === 'checkbox'));
            radioRef.current?.setAttribute('data-ref-checked', String(radioInput.current?.type === 'radio'));
          }}
        >
          Check control refs
        </Button>
      </section>
      <section>
        <h2>Radio restrictions and direction</h2>
        <RadioGroup aria-label="Disabled radios" disabled defaultValue="a">
          <label>
            <Radio value="a" /> Disabled A
          </label>
          <label>
            <Radio value="b" /> Disabled B
          </label>
        </RadioGroup>
        <RadioGroup aria-label="Read-only radios" readOnly defaultValue="a">
          <label>
            <Radio value="a" /> Read-only A
          </label>
          <label>
            <Radio value="b" /> Read-only B
          </label>
        </RadioGroup>
        <RadioGroup aria-label="RTL radios" dir="rtl" row defaultValue="a">
          <label>
            <Radio value="a" /> RTL A
          </label>
          <label>
            <Radio value="b" /> RTL B
          </label>
          <label>
            <Radio value="c" /> RTL C
          </label>
        </RadioGroup>
      </section>
      <section>
        <h2>Image fallback</h2>
        <Avatar
          src={source}
          alt="Sam Rivers"
          imgProps={{ loading: 'lazy', onLoad: () => setImageEvent('loaded'), onError: () => setImageEvent('error') }}
          data-testid="changing-avatar"
        >
          SR
        </Avatar>
        <p data-testid="avatar-event">{imageEvent}</p>
        <Button onClick={() => setSource('/avatar.svg')}>Load avatar image</Button>
        <Button onClick={() => setSource('/missing-again.png')}>Break avatar image</Button>
        <Avatar data-testid="decorative-avatar">AB</Avatar>
        <Avatar alt="Zoë Hart" data-testid="automatic-initial-avatar" />
      </section>
    </>
  );
}
