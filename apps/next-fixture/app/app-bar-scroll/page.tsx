import { AppBar, Button, IconButton, Search, ThemeProvider } from '@flaut-travel/react-md3e';
import { AppBarScrollDemo } from './app-bar-scroll-demo/app-bar-scroll-demo.component';
import styles from './app-bar-scroll.module.css';

const navigation = (
  <IconButton aria-label="Open navigation" variant="standard">
    ←
  </IconButton>
);
const actions = (
  <IconButton aria-label="Save collection" variant="standard">
    +
  </IconButton>
);

export default function AppBarScrollPage() {
  return (
    <ThemeProvider>
      <AppBar
        title={<h1 className={styles.label}>Window collection</h1>}
        subtitle="Scroll to collapse"
        navigationIcon={navigation}
        actions={actions}
        variant="largeFlexible"
        position="sticky"
        scrollBehavior="exitUntilCollapsed"
        data-testid="window-scroll-bar"
      />
      <main className={styles.windowContent}>
        <h2>Automatic app bar scrolling</h2>
        {(['mediumFlexible', 'largeFlexible'] as const).map((variant) => (
          <section className={styles.panel} key={variant} data-testid={`scroll-${variant}`}>
            <AppBar
              title={
                <h2 id={`scroll-title-${variant}`} className={styles.label}>
                  Saved collection
                </h2>
              }
              subtitle="Recently added"
              navigationIcon={navigation}
              actions={actions}
              variant={variant}
              position="sticky"
              scrollBehavior="exitUntilCollapsed"
              data-testid={`scroll-bar-${variant}`}
            />
            <div className={styles.content}>
              <Button>Collection action</Button>
            </div>
          </section>
        ))}
        <section className={styles.panel} data-testid="scroll-enter">
          <AppBar
            title="Quick return"
            position="sticky"
            scrollBehavior="enterAlways"
            navigationIcon={navigation}
            actions={actions}
            data-testid="enter-bar"
          />
          <div className={styles.content}>
            <a href="#window-top">Scrollable results</a>
          </div>
        </section>
        <section className={styles.panel} data-testid="scroll-search">
          <AppBar variant="search" position="sticky" scrollBehavior="enterAlways" data-testid="scroll-search-bar">
            <Search label="Search scrolling collection">
              <p>Search results in scrolling app bar</p>
            </Search>
          </AppBar>
          <div className={styles.content}>Search results</div>
        </section>
        <section className={styles.panel} data-testid="scroll-enter-large">
          <AppBar
            title="Flexible quick return"
            subtitle="Recent items"
            variant="largeFlexible"
            position="sticky"
            scrollBehavior="enterAlways"
            data-testid="enter-large-bar"
          />
          <div className={styles.content}>Flexible quick return content</div>
        </section>
        <section className={styles.panel} data-testid="scroll-pinned">
          <AppBar
            title="Pinned collection"
            variant="mediumFlexible"
            position="sticky"
            scrollBehavior="pinned"
            data-testid="pinned-bar"
          />
          <div className={styles.content}>Pinned content</div>
        </section>
        <section className={styles.panel} data-testid="scroll-centered">
          <AppBar
            title="A longer centered collection title that wraps without clipping when space is limited"
            subtitle="Additional details"
            variant="largeFlexible"
            position="sticky"
            titleAlign="center"
            dir="rtl"
            navigationIcon={navigation}
            actions={actions}
            scrollBehavior="exitUntilCollapsed"
            data-testid="centered-scroll-bar"
          />
          <div className={styles.content}>Centered RTL content</div>
        </section>
        <AppBarScrollDemo />
      </main>
    </ThemeProvider>
  );
}
