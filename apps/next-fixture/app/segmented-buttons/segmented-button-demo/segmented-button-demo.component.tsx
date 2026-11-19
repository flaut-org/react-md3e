'use client';

import { useRef, useState } from 'react';
import { ButtonSegment, SegmentedButton } from '@flaut-travel/react-md3e/segmented-button';
import { ThemeProvider } from '@flaut-travel/react-md3e';

export function SegmentedButtonDemo() {
  const [trip, setTrip] = useState<string | null>('return');
  const [changes, setChanges] = useState(0);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState('');
  const [refs, setRefs] = useState(false);
  const groupRef = useRef<HTMLDivElement>(null);
  const segmentRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <section>
        <h2>Controlled selection</h2>
        <SegmentedButton
          aria-label="Trip type"
          value={trip}
          onChange={(_event, next) => {
            setTrip(next);
            setChanges((count) => count + 1);
          }}
          ref={groupRef}
          form="segment-form"
          name="trip"
        >
          <ButtonSegment value="return" ref={segmentRef}>
            Return
          </ButtonSegment>
          <ButtonSegment value="one-way">One way</ButtonSegment>
          <ButtonSegment value="unavailable" disabled>
            Multi-city
          </ButtonSegment>
        </SegmentedButton>
        <p data-testid="trip-value">{trip}</p>
        <p data-testid="trip-changes">{changes}</p>
        <button type="button" onClick={() => setTrip('one-way')}>
          Set one way
        </button>
        <button
          type="button"
          onClick={() =>
            setRefs(groupRef.current instanceof HTMLDivElement && segmentRef.current instanceof HTMLButtonElement)
          }
        >
          Check segment refs
        </button>
        <p data-testid="segment-refs">{String(refs)}</p>
      </section>
      <section>
        <h2>Multiple selection and icons</h2>
        <SegmentedButton
          aria-label="Amenities"
          selectionMode="multiple"
          value={amenities}
          onChange={(_event, next) => setAmenities(next)}
        >
          <ButtonSegment value="wifi" icon={<span>◎</span>}>
            Wi-Fi
          </ButtonSegment>
          <ButtonSegment value="meal" icon={<span>◇</span>}>
            Meal
          </ButtonSegment>
          <ButtonSegment value="seat" icon={<span>□</span>}>
            Seat
          </ButtonSegment>
        </SegmentedButton>
        <p data-testid="amenity-values">{amenities.join(',')}</p>
        <SegmentedButton aria-label="Alignment" defaultValue="left">
          <ButtonSegment value="left" icon="≡" aria-label="Align left" />
          <ButtonSegment value="center" icon="≡" aria-label="Align center" />
          <ButtonSegment value="right" icon="≡" aria-label="Align right" />
        </SegmentedButton>
        <SegmentedButton aria-label="Hidden indicators" defaultValue="first" hideSelectionIndicator>
          <ButtonSegment value="first" icon="◇">
            First
          </ButtonSegment>
          <ButtonSegment value="second" icon="□">
            Second
          </ButtonSegment>
        </SegmentedButton>
      </section>
      <section>
        <h2>Form submission and reset</h2>
        <form
          id="segment-form"
          onSubmit={(event) => {
            event.preventDefault();

            const data = new FormData(event.currentTarget);

            setSubmitted(JSON.stringify({ cabin: data.get('cabin'), filters: data.getAll('filters') }));
          }}
        >
          <SegmentedButton aria-label="Cabin" name="cabin" defaultValue="economy">
            <ButtonSegment value="economy">Economy</ButtonSegment>
            <ButtonSegment value="business">Business</ButtonSegment>
          </SegmentedButton>
          <button type="submit">Submit segments</button>
          <button type="reset">Reset segments</button>
        </form>
        <SegmentedButton
          aria-label="Fare filters"
          selectionMode="multiple"
          name="filters"
          form="segment-form"
          defaultValue={['direct', 'locked']}
        >
          <ButtonSegment value="direct">Direct</ButtonSegment>
          <ButtonSegment value="baggage">Baggage</ButtonSegment>
          <ButtonSegment value="locked" disabled>
            Unavailable fare
          </ButtonSegment>
        </SegmentedButton>
        <p data-testid="submitted-segments">{submitted}</p>
      </section>
      <section>
        <h2>State constraints</h2>
        <SegmentedButton aria-label="Optional choice" defaultValue="one" allowEmpty>
          <ButtonSegment value="one">Optional one</ButtonSegment>
          <ButtonSegment value="two">Optional two</ButtonSegment>
        </SegmentedButton>
        <SegmentedButton aria-label="Vetoed choice" defaultValue="one" onChange={() => false}>
          <ButtonSegment value="one">Veto one</ButtonSegment>
          <ButtonSegment value="two">Veto two</ButtonSegment>
        </SegmentedButton>
        <SegmentedButton aria-label="Prevented choice" defaultValue="one" onChange={(event) => event.preventDefault()}>
          <ButtonSegment value="one">Prevent one</ButtonSegment>
          <ButtonSegment value="two">Prevent two</ButtonSegment>
        </SegmentedButton>
        <SegmentedButton aria-label="Prevented segment" defaultValue="one">
          <ButtonSegment value="one">Click one</ButtonSegment>
          <ButtonSegment value="two" onClick={(event) => event.preventDefault()}>
            Click two
          </ButtonSegment>
        </SegmentedButton>
        <SegmentedButton aria-label="Read only choice" defaultValue="one" readOnly>
          <ButtonSegment value="one">Read one</ButtonSegment>
          <ButtonSegment value="two">Read two</ButtonSegment>
        </SegmentedButton>
        <SegmentedButton aria-label="Disabled choice" defaultValue="one" disabled>
          <ButtonSegment value="one">Disabled one</ButtonSegment>
          <ButtonSegment value="two">Disabled two</ButtonSegment>
        </SegmentedButton>
        <SegmentedButton aria-label="Read only filters" selectionMode="multiple" defaultValue={['one']} readOnly>
          <ButtonSegment value="one">Read filter one</ButtonSegment>
          <ButtonSegment value="two">Read filter two</ButtonSegment>
        </SegmentedButton>
        <SegmentedButton
          aria-label="Vetoed filters"
          selectionMode="multiple"
          defaultValue={['one']}
          onChange={() => false}
        >
          <ButtonSegment value="one">Veto filter one</ButtonSegment>
          <ButtonSegment value="two">Veto filter two</ButtonSegment>
        </SegmentedButton>
      </section>
      <section>
        <h2>Direction and width</h2>
        <div dir="rtl">
          <SegmentedButton aria-label="Inherited RTL" defaultValue="one">
            <ButtonSegment value="one">RTL one</ButtonSegment>
            <ButtonSegment value="disabled" disabled>
              RTL disabled
            </ButtonSegment>
            <ButtonSegment value="two">RTL two</ButtonSegment>
          </SegmentedButton>
        </div>
        <SegmentedButton aria-label="Full width" fullWidth defaultValue="short">
          <ButtonSegment value="short">Short</ButtonSegment>
          <ButtonSegment value="long">A longer label</ButtonSegment>
          <ButtonSegment value="last" disableRipple>
            Last
          </ButtonSegment>
        </SegmentedButton>
        <ThemeProvider colorScheme="dark">
          <SegmentedButton aria-label="Dark choice" defaultValue="one">
            <ButtonSegment value="one">Dark one</ButtonSegment>
            <ButtonSegment value="two">Dark two</ButtonSegment>
          </SegmentedButton>
        </ThemeProvider>
      </section>
    </>
  );
}
