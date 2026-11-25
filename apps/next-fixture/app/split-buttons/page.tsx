import { MenuGroup, MenuItem, MenuSubmenu, SplitButton, ThemeProvider } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import { SplitButtonDemo } from './split-button-demo/split-button-demo.component';

const material = createTheme({ sourceColor: '#6750a4', typography: { plainFontFamily: 'Arial, sans-serif' } });
const sizes = ['extraSmall', 'small', 'medium', 'large', 'extraLarge'] as const;
const variants = ['filled', 'tonal', 'outlined', 'elevated'] as const;

export default function SplitButtonsPage() {
  return (
    <ThemeProvider theme={material} colorScheme="light">
      <main>
        <h1>Expressive split buttons</h1>
        <section>
          <h2>Server composition</h2>
          <SplitButton
            data-testid="server-split"
            menuButtonLabel="More save options"
            menu={<MenuItem>Save a copy</MenuItem>}
          >
            Save
          </SplitButton>
        </section>
        <SplitButtonDemo />
        <section>
          <h2>Four color styles and five sizes</h2>
          {variants.map((variant) => (
            <section key={variant}>
              <h3>{variant}</h3>
              <div className="fixture-row">
                {sizes.map((size) => (
                  <SplitButton
                    key={size}
                    data-testid={`split-${variant}-${size}`}
                    variant={variant}
                    size={size}
                    menuButtonLabel={`More ${variant} ${size} options`}
                    menu={<MenuItem>Related action</MenuItem>}
                  >
                    Go
                  </SplitButton>
                ))}
              </div>
            </section>
          ))}
        </section>
        <section>
          <h2>Availability</h2>
          <div className="fixture-row">
            <SplitButton disabled menuButtonLabel="Unavailable options" menu={<MenuItem>Unavailable action</MenuItem>}>
              Disabled
            </SplitButton>
            <SplitButton loading menuButtonLabel="Loading options" menu={<MenuItem>Pending action</MenuItem>}>
              Loading
            </SplitButton>
            <SplitButton
              buttonProps={{ disabled: true }}
              menuButtonLabel="Available alternatives"
              menu={<MenuItem>Alternative action</MenuItem>}
            >
              Unavailable primary
            </SplitButton>
            <SplitButton
              menuButtonProps={{ disabled: true }}
              menuButtonLabel="Unavailable alternatives"
              menu={<MenuItem>Unavailable alternative</MenuItem>}
            >
              Available primary
            </SplitButton>
          </div>
        </section>
        <section>
          <h2>Grouped vibrant menu</h2>
          <SplitButton
            menuButtonLabel="More organize options"
            menuProps={{ layout: 'grouped', variant: 'vibrant' }}
            menu={
              <>
                <MenuGroup aria-label="Document actions">
                  <MenuItem selected>Current folder</MenuItem>
                  <MenuItem>New folder</MenuItem>
                </MenuGroup>
                <MenuGroup aria-label="Other locations">
                  <MenuSubmenu label="Move to">
                    <MenuItem>Archive folder</MenuItem>
                  </MenuSubmenu>
                </MenuGroup>
              </>
            }
          >
            Organize
          </SplitButton>
        </section>
        <section dir="rtl">
          <h2>Inherited RTL</h2>
          <SplitButton
            data-testid="rtl-split"
            menuButtonLabel="المزيد من الخيارات"
            menu={<MenuItem>إجراء آخر</MenuItem>}
          >
            إرسال
          </SplitButton>
        </section>
        <ThemeProvider theme={material} colorScheme="dark">
          <section>
            <h2>Dark theme</h2>
            <SplitButton menuButtonLabel="More dark options" variant="tonal" menu={<MenuItem>Dark action</MenuItem>}>
              Dark action
            </SplitButton>
          </section>
        </ThemeProvider>
        <section>
          <h2>Full width</h2>
          <SplitButton fullWidth menuButtonLabel="More full-width options" menu={<MenuItem>Another action</MenuItem>}>
            Continue
          </SplitButton>
        </section>
        <a href="/">Back to the package consumer</a>
      </main>
    </ThemeProvider>
  );
}
