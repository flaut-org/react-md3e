'use client';

import { useRef, useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from '@flaut-travel/react-md3e/tabs';
import type { TabValue } from '@flaut-travel/react-md3e/tabs';

export function TabsDemo() {
  const [value, setValue] = useState<TabValue | null>('one');
  const [changes, setChanges] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [longLabel, setLongLabel] = useState(false);
  const [refs, setRefs] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <section>
        <h2>Controlled and automatic activation</h2>
        <Tabs
          value={value}
          ref={rootRef}
          onChange={(_event, next) => {
            setValue(next);
            setChanges((count) => count + 1);
          }}
        >
          <TabList aria-label="Controlled" selectionFollowsFocus ref={listRef}>
            <Tab value="one" ref={tabRef} label="One" />
            <Tab value="disabled" disabled>
              Unavailable
            </Tab>
            <Tab value="two">Two</Tab>
            <Tab value="three" disableRipple>
              Three
            </Tab>
          </TabList>
          <TabPanel value="one" ref={panelRef}>
            <input aria-label="Persistent input" defaultValue="saved" />
          </TabPanel>
          <TabPanel value="two" keepMounted>
            <input aria-label="Kept input" defaultValue="kept" />
          </TabPanel>
          <TabPanel value="three">Third content</TabPanel>
        </Tabs>
        <p data-testid="tab-value">{String(value)}</p>
        <p data-testid="tab-changes">{changes}</p>
        <button type="button" onClick={() => setValue('three')}>
          Set third tab
        </button>
        <button type="button" onClick={() => setValue(null)}>
          Clear tabs
        </button>
        <button type="button" onClick={() => setValue('one')}>
          Set first tab
        </button>
        <button
          type="button"
          onClick={() =>
            setRefs(
              rootRef.current instanceof HTMLDivElement &&
                listRef.current instanceof HTMLDivElement &&
                tabRef.current instanceof HTMLButtonElement &&
                panelRef.current instanceof HTMLDivElement,
            )
          }
        >
          Check tab refs
        </button>
        <output data-testid="tab-refs">{String(refs)}</output>
      </section>
      <section>
        <h2>Icons and secondary tabs</h2>
        <Tabs defaultValue="video" data-testid="icon-tabs">
          <TabList aria-label="Media">
            <Tab value="video" icon="▣">
              Video
            </Tab>
            <Tab value="audio" icon="♫" badge={<span aria-label="2 updates">2</span>}>
              Audio
            </Tab>
          </TabList>
          <TabPanel value="video">Videos</TabPanel>
          <TabPanel value="audio">Audio files</TabPanel>
        </Tabs>
        <Tabs variant="secondary" defaultValue="summary" data-testid="secondary-tabs">
          <TabList aria-label="Details">
            <Tab value="summary" icon="▣">
              Summary
            </Tab>
            <Tab value="reviews" icon="☆">
              Reviews
            </Tab>
          </TabList>
          <TabPanel value="summary">Summary content</TabPanel>
          <TabPanel value="reviews">Reviews content</TabPanel>
        </Tabs>
        <Tabs defaultValue="grid">
          <TabList aria-label="Display">
            <Tab value="grid" icon="▣" aria-label="Grid" />
            <Tab value="list" icon="≡" aria-label="List" />
          </TabList>
          <TabPanel value="grid">Grid view</TabPanel>
          <TabPanel value="list">List view</TabPanel>
        </Tabs>
      </section>
      <section>
        <h2>Scrollable and inherited RTL</h2>
        <Tabs defaultValue={0} style={{ maxWidth: 340 }} data-testid="scrollable-tabs">
          <TabList aria-label="Scrollable" scrollable selectionFollowsFocus>
            {Array.from({ length: 12 }, (_, index) => (
              <Tab key={index} value={index}>
                Destination {index + 1}
              </Tab>
            ))}
          </TabList>
          {Array.from({ length: 12 }, (_, index) => (
            <TabPanel key={index} value={index}>
              Destination content {index + 1}
            </TabPanel>
          ))}
        </Tabs>
        <div dir="rtl">
          <Tabs defaultValue={0} style={{ maxWidth: 340 }} data-testid="rtl-tabs">
            <TabList aria-label="RTL destinations" scrollable selectionFollowsFocus>
              {Array.from({ length: 8 }, (_, index) => (
                <Tab key={index} value={index}>
                  RTL {index + 1}
                </Tab>
              ))}
            </TabList>
            {Array.from({ length: 8 }, (_, index) => (
              <TabPanel key={index} value={index}>
                RTL content {index + 1}
              </TabPanel>
            ))}
          </Tabs>
        </div>
      </section>
      <section>
        <h2>Cancellable changes and dynamic tabs</h2>
        <Tabs defaultValue="one" onChange={() => false}>
          <TabList aria-label="Vetoed">
            <Tab value="one">Veto one</Tab>
            <Tab value="two">Veto two</Tab>
          </TabList>
          <TabPanel value="one">Veto content</TabPanel>
          <TabPanel value="two">Hidden veto content</TabPanel>
        </Tabs>
        <Tabs defaultValue="one" onChange={(event) => event.preventDefault()}>
          <TabList aria-label="Prevented">
            <Tab value="one">Prevent one</Tab>
            <Tab value="two">Prevent two</Tab>
          </TabList>
          <TabPanel value="one">Prevent content</TabPanel>
          <TabPanel value="two">Hidden prevent content</TabPanel>
        </Tabs>
        <Tabs defaultValue="one">
          <TabList aria-label="Click prevented">
            <Tab value="one">Click one</Tab>
            <Tab value="two" onClick={(event) => event.preventDefault()}>
              Click two
            </Tab>
          </TabList>
          <TabPanel value="one">Click content</TabPanel>
          <TabPanel value="two">Hidden click content</TabPanel>
        </Tabs>
        <Tabs defaultValue="one" data-testid="dynamic-tabs">
          <TabList aria-label="Dynamic">
            {!removed && (
              <Tab value="one" disabled={disabled}>
                {longLabel ? 'A much longer first label' : 'First'}
              </Tab>
            )}
            <Tab value="two">Second</Tab>
            <Tab value="three">Third</Tab>
          </TabList>
          <TabPanel value="one">Dynamic first</TabPanel>
          <TabPanel value="two">Dynamic second</TabPanel>
          <TabPanel value="three">Dynamic third</TabPanel>
        </Tabs>
        <button type="button" onClick={() => setDisabled((current) => !current)}>
          Toggle first disabled
        </button>
        <button type="button" onClick={() => setRemoved((current) => !current)}>
          Toggle first mounted
        </button>
        <button type="button" onClick={() => setLongLabel((current) => !current)}>
          Change first label
        </button>
        <Tabs>
          <TabList aria-label="Implicit selection" loopFocus={false}>
            <Tab value="disabled" disabled>
              Disabled initial
            </Tab>
            <Tab value="first">Implicit first</Tab>
            <Tab value="last">Implicit last</Tab>
          </TabList>
          <TabPanel value="first">Implicit panel</TabPanel>
          <TabPanel value="last">Last implicit panel</TabPanel>
        </Tabs>
        <Tabs defaultValue="one">
          <TabList aria-label="Nested parent">
            <Tab value="one">Parent one</Tab>
            <Tab value="two">Parent two</Tab>
          </TabList>
          <TabPanel value="one">
            <Tabs variant="secondary" defaultValue="child">
              <TabList aria-label="Nested child">
                <Tab value="child">Child</Tab>
                <Tab value="other">Other child</Tab>
              </TabList>
              <TabPanel value="child">Nested child content</TabPanel>
              <TabPanel value="other">Other nested content</TabPanel>
            </Tabs>
          </TabPanel>
          <TabPanel value="two">Other parent content</TabPanel>
        </Tabs>
      </section>
    </>
  );
}
