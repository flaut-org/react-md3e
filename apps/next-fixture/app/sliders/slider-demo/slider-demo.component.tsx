'use client';

import { useRef, useState } from 'react';
import { Slider } from '@flaut-travel/react-md3e/slider';
import { ThemeProvider } from '@flaut-travel/react-md3e';
import styles from '../sliders.module.css';

export function SliderDemo() {
  const [volume, setVolume] = useState(40);
  const [range, setRange] = useState<[number, number]>([20, 80]);
  const [changes, setChanges] = useState(0);
  const [commits, setCommits] = useState(0);
  const [lastCommit, setLastCommit] = useState(40);
  const [activeThumb, setActiveThumb] = useState(-1);
  const [iconValue, setIconValue] = useState(2);
  const [submitted, setSubmitted] = useState('');
  const [refs, setRefs] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <section className={styles.stack} aria-label="Controlled sliders">
        <h2>Controlled values</h2>
        <Slider
          label="Volume"
          value={volume}
          onChange={(_event, next) => {
            setVolume(next);
            setChanges((count) => count + 1);
          }}
          onChangeCommitted={(_event, next) => {
            setCommits((count) => count + 1);
            setLastCommit(next);
          }}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}%`}
          getAriaValueText={(value) => `${value} percent`}
          name="volume"
          form="slider-form"
          ref={rootRef}
          inputRef={inputRef}
          data-testid="controlled-slider"
        />
        <p data-testid="slider-value">{volume}</p>
        <p data-testid="slider-changes">{changes}</p>
        <p data-testid="slider-commits">
          {commits}:{lastCommit}
        </p>
        <div className={styles.actions}>
          <button type="button" onClick={() => setVolume(65)}>
            Set volume to 65
          </button>
          <button
            type="button"
            onClick={() =>
              setRefs(rootRef.current instanceof HTMLDivElement && inputRef.current instanceof HTMLInputElement)
            }
          >
            Check slider refs
          </button>
        </div>
        <p data-testid="slider-refs">{String(refs)}</p>
        <Slider
          label="Price range"
          variant="range"
          value={range}
          onChange={(_event, next, index) => {
            setRange(next);
            setActiveThumb(index);
          }}
          getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
          valueLabelDisplay="auto"
          name="bounds"
          form="slider-form"
          data-testid="range-slider"
        />
        <p data-testid="slider-range">
          {range.join(',')}:{activeThumb}
        </p>
        <Slider
          label="Separated range"
          variant="range"
          defaultValue={[20, 80]}
          step={10}
          minStepsBetweenValues={2}
          marks
          getAriaLabel={(index) => (index === 0 ? 'Separated minimum' : 'Separated maximum')}
          data-testid="separated-slider"
        />
      </section>
      <section className={styles.stack} aria-label="Stops and constraints">
        <h2>Stops, values and constraints</h2>
        <Slider
          label="Stepped"
          defaultValue={30}
          step={10}
          marks
          valueLabelDisplay="auto"
          data-testid="stepped-slider"
        />
        <Slider
          label="Labeled stops"
          defaultValue={50}
          step={10}
          marks={[
            { value: 0, label: 'Low' },
            { value: 50, label: 'Medium' },
            { value: 100, label: 'High' },
          ]}
          data-testid="labeled-slider"
        />
        <Slider
          label="Decimals"
          min={0.1}
          max={0.5}
          step={0.1}
          shiftStep={0.2}
          defaultValue={0.2}
          marks
          data-testid="decimal-slider"
        />
        <Slider
          label="Vetoed slider"
          defaultValue={35}
          onChange={() => false}
          onChangeCommitted={() => setCommits((count) => count + 1)}
          data-testid="vetoed-slider"
        />
        <Slider
          label="Prevented slider"
          defaultValue={35}
          onChange={(event) => event.preventDefault()}
          data-testid="prevented-slider"
        />
        <Slider
          label="Disabled slider"
          defaultValue={60}
          disabled
          name="disabled"
          form="slider-form"
          data-testid="disabled-slider"
        />
        <Slider
          label="Disabled range"
          variant="range"
          defaultValue={[20, 80]}
          disabled
          getAriaLabel={(index) => (index === 0 ? 'Disabled minimum' : 'Disabled maximum')}
          data-testid="disabled-range"
        />
      </section>
      <section className={styles.stack} aria-label="Inset icon and direction">
        <h2>Inset icon and direction</h2>
        <Slider
          label="Icon brightness"
          size="medium"
          icon="☀"
          value={iconValue}
          onChange={(_event, next) => setIconValue(next)}
          valueLabelDisplay="auto"
          data-testid="icon-slider"
        />
        <button type="button" onClick={() => setIconValue(80)}>
          Set icon slider to 80
        </button>
        <Slider label="RTL volume" dir="rtl" defaultValue={25} data-testid="rtl-slider" />
        <div dir="rtl">
          <Slider label="Inherited RTL volume" defaultValue={25} data-testid="inherited-rtl-slider" />
        </div>
        <div className={styles.verticals}>
          <Slider
            label="Vertical level"
            orientation="vertical"
            defaultValue={30}
            size="medium"
            valueLabelDisplay="auto"
            data-testid="vertical-slider"
          />
          <Slider
            label="Vertical balance"
            orientation="vertical"
            variant="centered"
            min={-100}
            max={100}
            defaultValue={-20}
            data-testid="vertical-centered"
          />
          <Slider
            label="Vertical RTL level"
            dir="rtl"
            orientation="vertical"
            defaultValue={40}
            valueLabelDisplay="auto"
            data-testid="vertical-rtl-slider"
          />
        </div>
        <ThemeProvider colorScheme="dark">
          <Slider label="Dark volume" defaultValue={40} data-testid="dark-slider" />
        </ThemeProvider>
      </section>
      <section>
        <h2>Native forms</h2>
        <form
          id="slider-form"
          onSubmit={(event) => {
            event.preventDefault();

            const data = new FormData(event.currentTarget);

            setSubmitted(
              JSON.stringify({
                volume: data.get('volume'),
                bounds: data.getAll('bounds'),
                disabled: data.get('disabled'),
              }),
            );
          }}
          onReset={() => {
            setVolume(40);
            setRange([20, 80]);
          }}
        >
          <button type="submit">Submit sliders</button>
          <button type="reset">Reset sliders</button>
        </form>
        <p data-testid="slider-form-values">{submitted}</p>
      </section>
    </>
  );
}
