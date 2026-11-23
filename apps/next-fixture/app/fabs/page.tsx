import '@flaut-travel/react-md3e/fab/styles.css';
import '@flaut-travel/react-md3e/extended-fab/styles.css';
import '@flaut-travel/react-md3e/fab-menu/styles.css';

import { ExtendedFab, Fab, FabMenu, FabMenuItem, ThemeProvider } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import { FabDemo } from './fab-demo/fab-demo.component';

const material = createTheme({ sourceColor: '#6750a4', typography: { plainFontFamily: 'Arial, sans-serif' } });
const sizes = ['regular', 'medium', 'large'] as const;
const colors = [
  'primaryContainer',
  'secondaryContainer',
  'tertiaryContainer',
  'primary',
  'secondary',
  'tertiary',
  'surface',
] as const;
const add = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7z" />
  </svg>
);

export default function FabsPage() {
  return (
    <main>
      <ThemeProvider theme={material} colorScheme="light">
        <h1>Floating action buttons</h1>
        <section>
          <h2>Server composition</h2>
          <div className="fixture-row">
            <Fab aria-label="Server floating action" data-testid="server-fab">
              {add}
            </Fab>
            <ExtendedFab startIcon={add} data-testid="server-extended-fab">
              Server extended action
            </ExtendedFab>
            <ExtendedFab data-testid="text-extended-fab">Label only</ExtendedFab>
            <FabMenu label="Server create actions" icon={add} data-testid="server-fab-menu">
              <FabMenuItem icon={add}>Server document</FabMenuItem>
              <FabMenuItem icon={add}>Server folder</FabMenuItem>
            </FabMenu>
          </div>
        </section>
        <FabDemo />
        <section>
          <h2>FAB colors and sizes</h2>
          {colors.map((color) => (
            <section key={color}>
              <h3>{color}</h3>
              <div className="fixture-row">
                {sizes.map((size) => (
                  <Fab
                    key={size}
                    color={color}
                    size={size}
                    aria-label={`${color} ${size} action`}
                    data-testid={`fab-${color}-${size}`}
                  >
                    {add}
                  </Fab>
                ))}
              </div>
            </section>
          ))}
        </section>
        <section>
          <h2>Extended FAB sizes</h2>
          <div className="fixture-row">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <ExtendedFab key={size} size={size} startIcon={add} data-testid={`extended-fab-${size}`}>
                Compose
              </ExtendedFab>
            ))}
          </div>
        </section>
        <section>
          <h2>Lowered elevation and legacy small</h2>
          <div className="fixture-row">
            <Fab lowered aria-label="Lowered action" data-testid="lowered-fab">
              {add}
            </Fab>
            <Fab size="small" aria-label="Legacy small action" data-testid="legacy-small-fab">
              {add}
            </Fab>
            <ExtendedFab lowered startIcon={add}>
              Lowered compose
            </ExtendedFab>
            <Fab disabled aria-label="Disabled floating action">
              {add}
            </Fab>
            <ExtendedFab disabled startIcon={add}>
              Disabled extended action
            </ExtendedFab>
          </div>
        </section>
        <section>
          <h2>Short text-only labels retain the minimum width</h2>
          <div className="fixture-row">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <ExtendedFab key={size} size={size} data-testid={`extended-fab-short-${size}`}>
                A
              </ExtendedFab>
            ))}
          </div>
        </section>
        <section>
          <h2>Menu color families</h2>
          <div className="fixture-row" style={{ minHeight: 280, alignItems: 'flex-end' }}>
            {(['primary', 'secondary', 'tertiary'] as const).map((color) => (
              <FabMenu
                key={color}
                label={`${color} create actions`}
                icon={add}
                color={color}
                data-testid={`fab-menu-${color}`}
              >
                <FabMenuItem icon={add}>{color} document</FabMenuItem>
                <FabMenuItem icon={add}>{color} longer folder name</FabMenuItem>
              </FabMenu>
            ))}
          </div>
        </section>
        <section dir="rtl">
          <h2>Right to left</h2>
          <div className="fixture-row" style={{ minHeight: 240, alignItems: 'flex-end' }}>
            <ExtendedFab startIcon={add}>رسالة جديدة</ExtendedFab>
            <FabMenu
              label="إنشاء عنصر"
              closeLabel="إغلاق القائمة"
              size="medium"
              color="secondary"
              icon={add}
              data-testid="rtl-fab-menu"
            >
              <FabMenuItem icon={add}>مستند جديد</FabMenuItem>
              <FabMenuItem icon={add}>مجلد جديد</FabMenuItem>
            </FabMenu>
          </div>
        </section>
        <ThemeProvider theme={material} colorScheme="dark">
          <section>
            <h2>Dark theme</h2>
            <div className="fixture-row" style={{ minHeight: 240, alignItems: 'flex-end' }}>
              <Fab aria-label="Dark floating action">{add}</Fab>
              <ExtendedFab startIcon={add}>Dark compose</ExtendedFab>
              <FabMenu label="Dark create actions" icon={add} color="tertiary" data-testid="dark-fab-menu">
                <FabMenuItem icon={add}>Dark document</FabMenuItem>
                <FabMenuItem icon={add}>Dark folder</FabMenuItem>
              </FabMenu>
            </div>
          </section>
        </ThemeProvider>
        <section>
          <h2>Six related actions</h2>
          <div style={{ minHeight: 420, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <FabMenu label="Six create actions" icon={add} data-testid="six-fab-menu">
              {['Document', 'Spreadsheet', 'Presentation', 'Drawing', 'Form', 'Folder'].map((action) => (
                <FabMenuItem key={action} icon={add}>
                  New {action.toLowerCase()}
                </FabMenuItem>
              ))}
            </FabMenu>
          </div>
        </section>
        <a href="/">Back to the package consumer</a>
      </ThemeProvider>
    </main>
  );
}
