import { Suspense } from 'react';
import { connection } from 'next/server';
import {
  NavigationBar,
  NavigationRail,
  NavigationDrawer,
  NavigationItem,
  ThemeProvider,
} from '@flaut-travel/react-md3e';
import { NavigationDemo } from './navigation-demo/navigation-demo.component';

async function StreamedDestination() {
  await connection();
  await new Promise((resolve) => {
    setTimeout(resolve, 250);
  });

  return (
    <NavigationItem value="streamed" icon="◇" data-testid="streamed-navigation-item">
      Streamed destination
    </NavigationItem>
  );
}

export default function NavigationPage() {
  return (
    <main>
      <h1>Navigation</h1>
      <ThemeProvider colorScheme="light">
        <section>
          <h2>Server composition</h2>
          <NavigationBar
            aria-label="Server navigation"
            defaultValue="home"
            iconPosition="top"
            data-testid="server-navigation"
          >
            <NavigationItem value="home" icon="⌂">
              Home
            </NavigationItem>
            <NavigationItem value="search" icon="⌕">
              Explore
            </NavigationItem>
            <Suspense fallback={<span>Loading destination</span>}>
              <StreamedDestination />
            </Suspense>
          </NavigationBar>
          <NavigationBar aria-label="Baseline bar" variant="baseline" defaultValue={0} data-testid="baseline-bar">
            <NavigationItem value={0} icon="⌂">
              Home
            </NavigationItem>
            <NavigationItem value={1} icon="◇">
              Saved
            </NavigationItem>
          </NavigationBar>
        </section>
        <section style={{ display: 'flex', blockSize: 420, overflowX: 'auto' }}>
          <NavigationRail aria-label="Server rail" defaultValue="home" data-testid="server-rail">
            <NavigationItem value="home" icon="⌂">
              Home
            </NavigationItem>
            <NavigationItem value="saved" icon="◇">
              Saved
            </NavigationItem>
          </NavigationRail>
          <NavigationRail
            aria-label="Baseline rail"
            appearance="baseline"
            defaultValue="home"
            data-testid="baseline-rail"
          >
            <NavigationItem value="home" icon="⌂">
              Home
            </NavigationItem>
            <NavigationItem value="saved" icon="◇">
              Saved
            </NavigationItem>
          </NavigationRail>
          <NavigationDrawer
            variant="standard"
            aria-label="Server drawer"
            header="Mail"
            defaultValue="inbox"
            data-testid="server-drawer"
          >
            <NavigationItem value="inbox" icon="▣" badge="24">
              Inbox
            </NavigationItem>
            <NavigationItem value="outbox" icon="▷">
              Outbox
            </NavigationItem>
          </NavigationDrawer>
        </section>
        <NavigationDemo />
      </ThemeProvider>
      <ThemeProvider colorScheme="dark" dir="rtl" data-testid="dark-navigation">
        <NavigationBar aria-label="Dark RTL navigation" defaultValue="home" iconPosition="start">
          <NavigationItem value="home" icon="⌂">
            Home
          </NavigationItem>
          <NavigationItem value="saved" icon="◇">
            Saved
          </NavigationItem>
        </NavigationBar>
      </ThemeProvider>
    </main>
  );
}
