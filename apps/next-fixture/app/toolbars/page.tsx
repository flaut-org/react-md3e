import { Toolbar, IconButton, Button, Divider, Fab, ThemeProvider } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import { ToolbarDemo } from './toolbar-demo/toolbar-demo.component';
import styles from './toolbars.module.css';

const material = createTheme();
const dynamic = createTheme({ sourceColor: '#156f52', contrastLevel: 0.5 });

export default function ToolbarsPage() {
  return (
    <main>
      <ThemeProvider theme={material} colorScheme="light">
        <h1>Material 3 Expressive toolbars</h1>
        <Toolbar aria-label="Server docked tools" data-testid="server-docked">
          <IconButton variant="standard" aria-label="Server undo">
            U
          </IconButton>
          <Divider orientation="vertical" flexItem />
          <Button variant="text">Server save</Button>
        </Toolbar>
        <div className={styles.gallery} data-orientation="vertical" data-variant="docked" data-align="end">
          {(['standard', 'vibrant'] as const).map((color) => (
            <Toolbar
              key={color}
              variant="floating"
              color={color}
              aria-label={`Server ${color} tools`}
              data-testid={`server-${color}`}
            >
              <IconButton variant="standard" aria-label={`${color} undo`}>
                U
              </IconButton>
              <IconButton variant="tonal" selected aria-label={`${color} selected`}>
                S
              </IconButton>
              <IconButton aria-label={`${color} filled`}>F</IconButton>
              <IconButton variant="tonal" selected={false} aria-label={`${color} unselected`}>
                T
              </IconButton>
            </Toolbar>
          ))}
        </div>
        <Toolbar
          variant="floating"
          orientation="vertical"
          aria-label="Server vertical tools"
          data-testid="server-vertical"
        >
          <IconButton variant="standard" aria-label="Vertical undo">
            U
          </IconButton>
          <IconButton variant="standard" aria-label="Vertical redo">
            R
          </IconButton>
          <IconButton variant="standard" aria-label="Vertical save">
            S
          </IconButton>
        </Toolbar>
        <Toolbar dense shape="rounded" aria-label="Compact tools" data-testid="dense-toolbar">
          <Button variant="text">Compact action</Button>
        </Toolbar>
        <Toolbar variant="floating" elevation={0} aria-label="Flat tools" data-testid="flat-toolbar">
          <Button variant="text">Flat action</Button>
        </Toolbar>
        <div dir="rtl">
          <Toolbar variant="floating" aria-label="RTL tools" data-testid="rtl-toolbar">
            <Button>First RTL</Button>
            <Button>Second RTL</Button>
            <Button>Third RTL</Button>
          </Toolbar>
        </div>
        <ToolbarDemo />
      </ThemeProvider>
      <ThemeProvider theme={dynamic} colorScheme="dark" data-testid="dynamic-theme">
        <h2>Dynamic dark theme</h2>
        <Toolbar
          variant="floating"
          color="vibrant"
          aria-label="Dynamic tools"
          data-testid="dynamic-toolbar"
          fab={<Fab aria-label="Dynamic create">+</Fab>}
        >
          <IconButton variant="standard" aria-label="Dynamic undo">
            U
          </IconButton>
          <IconButton variant="tonal" selected aria-label="Dynamic selection">
            S
          </IconButton>
          <Button variant="text" disabled>
            Disabled dynamic
          </Button>
        </Toolbar>
        <Button variant="tonal" data-testid="outside-toolbar">
          Outside toolbar
        </Button>
      </ThemeProvider>
    </main>
  );
}
