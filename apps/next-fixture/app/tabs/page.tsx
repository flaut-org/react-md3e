import { Suspense } from 'react';
import { Tabs, TabList, Tab, TabPanel, ThemeProvider } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import { TabsDemo } from './tabs-demo/tabs-demo.component';

const standard = createTheme({ motionScheme: 'standard', variant: 'tonalSpot' });

async function StreamedPanel() {
  await new Promise((resolve) => {
    setTimeout(resolve, 120);
  });

  return <p data-testid="streamed-tab-content">Server streamed tab content</p>;
}

export default function TabsPage() {
  return (
    <main>
      <h1>Tabs</h1>
      <ThemeProvider colorScheme="light">
        <section>
          <h2>Server composition</h2>
          <Tabs defaultValue="flights" data-testid="server-tabs">
            <TabList aria-label="Travel">
              <Tab value="flights">Flights</Tab>
              <Tab value="hotels">Hotels</Tab>
              <Tab value="cars" disabled>
                Cars
              </Tab>
            </TabList>
            <TabPanel value="flights">
              <Suspense fallback={<p>Loading tab content</p>}>
                <StreamedPanel />
              </Suspense>
            </TabPanel>
            <TabPanel value="hotels">Hotel search</TabPanel>
            <TabPanel value="cars">Car rental</TabPanel>
          </Tabs>
        </section>
        <TabsDemo />
      </ThemeProvider>
      <ThemeProvider theme={standard} colorScheme="dark" data-testid="standard-tabs">
        <h2>Standard motion and dark colors</h2>
        <Tabs variant="secondary" defaultValue={0}>
          <TabList aria-label="Standard tabs">
            <Tab value={0}>Overview</Tab>
            <Tab value={1}>Details</Tab>
          </TabList>
          <TabPanel value={0}>Standard overview</TabPanel>
          <TabPanel value={1}>Standard details</TabPanel>
        </Tabs>
      </ThemeProvider>
    </main>
  );
}
